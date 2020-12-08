import $ from 'jquery';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { isDefined, isFunction } from 'core/utils/type';
import { JSPdfDataGridTestHelper } from './jspdfTestHelper.js';
import { LoadPanelTests } from '../commonParts/loadPanel.tests.js';
import { JSPdfOptionTests } from './jspdf.options.tests.js';
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
        this.jsPDFDocument = _jsPDF();
        this.customizeCellCallCount = 0;

        helper = new JSPdfDataGridTestHelper(this.jsPDFDocument);
    }
};

const getOptions = (context, dataGrid, expectedCustomizeCellArgs, options) => {
    const { keepColumnWidths = true, selectedRowsOnly = false, autoTableOptions = {}, customizeCell = () => {} } = options || {};

    let flatArrayExpectedCells;
    if(isDefined(expectedCustomizeCellArgs)) {
        const { head = [], body = [] } = expectedCustomizeCellArgs;
        flatArrayExpectedCells = [].concat.apply([], head.concat(body));
    }

    const result = {
        component: dataGrid,
        jsPDFDocument: context.jsPDFDocument
    };
    result.keepColumnWidths = keepColumnWidths;
    result.selectedRowsOnly = selectedRowsOnly;
    result.autoTableOptions = autoTableOptions;
    result.customizeCell = (eventArgs) => {
        customizeCell(eventArgs);
        if(isDefined(flatArrayExpectedCells)) {
            helper.checkCustomizeCell(eventArgs, flatArrayExpectedCells, context.customizeCellCallCount++);
        }
    };
    return result;
};

QUnit.module('Simple grid', moduleConfig, () => {
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

        exportDataGrid(getOptions(this, dataGrid, null, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            head: [[{ pdfCell: { content: 'f1' }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } }]],
            body: [[{ pdfCell: { content: 'text1' }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }]]
        };

        exportDataGrid(getOptions(this, dataGrid)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });
});

QUnit.module('Grid headers', moduleConfig, () => {
    QUnit.test('Header - 1 column, showColumnHeaders: false', function(assert) {
        const done = assert.async();
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [{ caption: 'f1' }],
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = { head: [] };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    [
        { visible: true, },
        { visible: false }
    ].forEach((config) => {
        QUnit.test(`Header - 1 column, column.visible: ${config.visible}`, function(assert) {
            const done = assert.async();
            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [{ caption: 'f1', visible: config.visible }],
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            const expectedCells = config.visible
                ? { head: [[{ pdfCell: { content: 'f1' }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } }]] }
                : { head: [] };

            exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
                done();
            });
        });
    });

    [
        { allowExporting: true },
        { allowExporting: false }
    ].forEach((config) => {
        QUnit.test(`Header - 1 column, column.allowExporting: ${config.allowExporting}`, function(assert) {
            const done = assert.async();
            const dataGrid = $('#dataGrid').dxDataGrid({
                columns: [{ caption: 'f1', allowExporting: config.allowExporting }],
                loadingTimeout: undefined
            }).dxDataGrid('instance');

            const expectedCells = config.allowExporting
                ? { head: [[{ pdfCell: { content: 'f1' }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } }]] }
                : { head: [] };

            exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
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
                head: [[{ pdfCell: { content: 'f1', styles: { 'halign': alignment } }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } }]]
            };

            exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            head: [[{ pdfCell: { content: 'f1', styles: { cellWidth: 'wrap' } }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } }]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    QUnit.test('Header - 1 column, paging.enabled: true', function(assert) {
        const done = assert.async();

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [{ caption: 'f1' }],
            paging: {
                enabled: true
            }
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[{ pdfCell: { content: 'f1' }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } }]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            const expectedCells = {
                head: [[
                    { pdfCell: { content: 'f1' }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } },
                    { pdfCell: { content: 'f2' }, gridCell: { rowType: 'header', value: 'f2', column: dataGrid.columnOption(1) } }
                ]]
            };

            exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'f2' }, gridCell: { rowType: 'header', value: 'f2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3' }, gridCell: { rowType: 'header', value: 'f3', column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'f1' }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3' }, gridCell: { rowType: 'header', value: 'f3', column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'f2' }, gridCell: { rowType: 'header', value: 'f2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f1' }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'f3' }, gridCell: { rowType: 'header', value: 'f3', column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'f1' }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'f3' }, gridCell: { rowType: 'header', value: 'f3', column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            done();
        });
    });
});

QUnit.module('Grid data rows', moduleConfig, () => {
    QUnit.test('Data - 1 row & 1 columns, showColumnHeaders: false', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'text1' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [{ dataField: 'f1', caption: 'f1' }],
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [],
            body: [[{ pdfCell: { content: 'text1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                head: [[{ pdfCell: { content: 'f1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } }]],
                body: [[{ pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }]]
            };

            exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'F4', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F4', column: dataGrid.columnOption(3) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: ds[0].f4, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Data - 1 column & 3 rows, paging[enabled: true; pageSize: 1]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1' }, { f1: 'f2_1' }, { f1: 'f3_1' }];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            paging: {
                enabled: true,
                pageSize: 1,
                pageIndex: 2
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: ds[1].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: ds[2].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[2].f1, data: ds[2], column: dataGrid.columnOption(0) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            head: [[
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: ds[1].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[1].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            head: [[
                { pdfCell: { content: 'F1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F2', styles: { 'halign': 'right' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            head: [[
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F2', styles: { 'halign': 'right' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: ds[1].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[1].f2, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            head: [[
                { pdfCell: { content: 'F1', styles: { 'halign': 'left', cellWidth: 'wrap' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F2', styles: { 'halign': 'right', cellWidth: 'wrap' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'right', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });
});

QUnit.module('Column data types', moduleConfig, () => {
    const dateValue1 = new Date(2019, 9, 9, 9, 9, 9, 9);
    const dateValue2 = new Date(2020, 9, 9, 9, 9, 9, 9);

    [
        { dataType: 'string', value: '1', expectedValue: '1', alignment: 'left' },
        { dataType: 'number', value: 1, expectedValue: 1, alignment: 'right' },
        { dataType: 'boolean', value: true, expectedValue: true, alignment: 'center' },
        { dataType: 'date', value: dateValue1, expectedValue: '10/9/2019', alignment: 'left' },
        { dataType: 'datetime', value: dateValue1, expectedValue: '10/9/2019, 9:09 AM', alignment: 'left' }
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
                head: [[
                    { pdfCell: { content: 'F1', styles: { 'halign': config.alignment } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } }
                ]],
                body: [[
                    { pdfCell: { content: config.expectedValue, styles: { 'halign': config.alignment } }, gridCell: { rowType: 'data', value: config.value, data: ds[0], column: dataGrid.columnOption(0) } }
                ]]
            };

            exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
        { dataType: 'string', value: '1', expectedValue: '1', alignment: 'left' },
        { dataType: 'number', value: 1, expectedValue: 1, alignment: 'right' },
        { dataType: 'boolean', value: true, expectedValue: true, alignment: 'center' },
        { dataType: 'date', value: dateValue1, expectedValue: '10/9/2019', alignment: 'left' },
        { dataType: 'datetime', value: dateValue1, expectedValue: '10/9/2019, 9:09 AM', alignment: 'left' }
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
                body: [[
                    { pdfCell: { content: 'custom', styles: { 'halign': config.alignment } }, gridCell: { rowType: 'data', value: config.value, data: ds[0], column: dataGrid.columnOption(0) } }
                ]]
            };

            exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
                helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
                helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
                done();
            });
        });
    });

    [
        { dataType: 'string', values: ['1', '2'], expectedValue: '1', alignment: 'left' },
        { dataType: 'number', values: [1, 2], expectedValue: 1, alignment: 'right' },
        { dataType: 'boolean', values: [true, false], expectedValue: true, alignment: 'center' },
        { dataType: 'date', values: [dateValue1, dateValue2], expectedValue: '10/9/2019', alignment: 'left' },
        { dataType: 'datetime', values: [dateValue1, dateValue2], expectedValue: '10/9/2019, 9:09 AM', alignment: 'left' }
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
                body: [[
                    { pdfCell: { content: config.expectedValue, styles: { 'halign': config.alignment } }, gridCell: { rowType: 'data', value: config.values[0], data: ds[0], column: dataGrid.columnOption(0) } }
                ]]
            };

            exportDataGrid(getOptions(this, dataGrid, expectedCells, { selectedRowsOnly: true })).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
                helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
                helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
                helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
                done();
            });
        });
    });

    [
        { dataType: 'string', values: ['1', '2'], expectedValue: '2', alignment: 'left' },
        { dataType: 'number', values: [1, 2], expectedValue: 2, alignment: 'right' },
        { dataType: 'boolean', values: [true, false], expectedValue: false, alignment: 'center' },
        { dataType: 'date', values: [dateValue1, dateValue2], expectedValue: '10/9/2020', alignment: 'left' },
        { dataType: 'datetime', values: [dateValue1, dateValue2], expectedValue: '10/9/2020, 9:09 AM', alignment: 'left' }
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
                body: [[
                    { pdfCell: { content: config.expectedValue, styles: { 'halign': config.alignment } }, gridCell: { rowType: 'data', value: config.values[1], data: ds[1], column: dataGrid.columnOption(0) } }
                ]]
            };

            exportDataGrid(getOptions(this, dataGrid, expectedCells, { selectedRowsOnly: true })).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: null, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: '', data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'str1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str1', data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'str2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str2', data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: null, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 0, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 0, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 1, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 1, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: -2, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: -2, data: ds[0], column: dataGrid.columnOption(4) } },
                { pdfCell: { content: 'Infinity', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: Number.POSITIVE_INFINITY, data: ds[0], column: dataGrid.columnOption(5) } },
                { pdfCell: { content: '-Infinity', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: Number.NEGATIVE_INFINITY, data: ds[0], column: dataGrid.columnOption(6) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });
});

QUnit.module('Column data formats', moduleConfig, () => {
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
                body: [[
                    { pdfCell: { content: config.expectedPdfCellValue, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: dateValue, data: ds[0], column: dataGrid.columnOption(0) } }
                ]]
            };

            exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
                const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '100.000%', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '100%', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '100%', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '100.0%', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '100.000000%', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '1.000', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '1.0', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '1.000000', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '001', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '000001', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '1.000E+0', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '1E+0', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '1.0E+0', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '1.0E+0', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '1.000000E+0', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '1.000', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '1.0', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '1.000000', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '0.001K', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '0K', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '0K', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '0.0K', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '0.001000K', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '0.000M', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '0M', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '0M', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '0.0M', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '0.000001M', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '0.000B', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '0B', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '0B', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '0.0B', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '0.000000B', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '0.000T', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '0T', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '0T', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '0.0T', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '0.000000T', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                { pdfCell: { content: '$1.00', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '$1.0000', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '$1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '$1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '$1.0', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f5, data: ds[0], column: dataGrid.columnOption(4) } },
                { pdfCell: { content: '$1.00000', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: ds[0].f6, data: ds[0], column: dataGrid.columnOption(5) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });
});

QUnit.module('Grouping', moduleConfig, () => {
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
            head: [[{ pdfCell: { content: 'f2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'f2', column: dataGrid.columnOption(0) } }]],
            body: [
                [{ pdfCell: { content: 'f1: f1_1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'f1: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            QUnit.test(`Grouping - 1 level, column.dataType: date, format: 'yyyy-MM-dd', cell.value: ${JSON.stringify(dateValue)}, remoteOperations: ${remoteOperations}`, function(assert) {
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
                    head: [[{ pdfCell: { content: 'f2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'f2', column: dataGrid.columnOption(0) } }]],
                    body: [
                        [{ pdfCell: { content: 'f1: 1996-07-04', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: remoteOperations ? ds[0].f1 : new Date(ds[0].f1), data: ds[0], column: dataGrid.columnOption(0) } }],
                        [{ pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(1) } }]
                    ]
                };

                exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
                    const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'f1: custom', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'f1: custom', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'f1: custom', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'custom', data: ds[0], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            head: [[
                { pdfCell: { content: 'f1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'f1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'f2', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: 'f1: custom', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'custom', data: ds[0], column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'f1: custom', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'custom', data: ds[0], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'custom_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'custom_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            head: [[
                { pdfCell: { content: 'f2', styles: { 'halign': 'right', cellWidth: 'wrap' } }, gridCell: { rowType: 'header', value: 'f2', column: dataGrid.columnOption(0) } }
            ]],
            body: [
                [{ pdfCell: { content: 'f1: f1_1', styles: { 'halign': 'left', cellWidth: 'wrap', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f2_1', styles: { 'halign': 'right', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'f1: f1_2', styles: { 'halign': 'left', cellWidth: 'wrap', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f2_2', styles: { 'halign': 'right', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            head: [[
                { pdfCell: { content: 'f2', styles: { 'halign': 'right', cellWidth: 'wrap' } }, gridCell: { rowType: 'header', value: 'f2', column: dataGrid.columnOption(0) } }
            ]],
            body: [
                [{ pdfCell: { content: 'f1: f1_1', styles: { 'halign': 'right', cellWidth: 'wrap', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f2_1', styles: { 'halign': 'right', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'f1: f1_2', styles: { 'halign': 'right', cellWidth: 'wrap', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f2_2', styles: { 'halign': 'right', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'F1: str1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'str1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str1_1', data: ds[0], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, { selectedRowsOnly: true })).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'F1: str1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'str_1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str_1_2', data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, { selectedRowsOnly: true })).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'F1: str1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'str1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str1_1', data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'str_1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str_1_2', data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, { selectedRowsOnly: true })).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            body: [[
                { pdfCell: { content: 'Field 3: str1!', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'str1!', column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'str1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'str1_f2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str1_f2', data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'str1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str1', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'str1_f2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str1_f2', data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'Field 3: str1!', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'str1!', column: dataGrid.columnOption(2) } }],
                [
                    { pdfCell: { content: 'str1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str1', data: ds[1], column: dataGrid.columnOption(0) } },
                    { pdfCell: { content: 'str1_f2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'str1_f2', data: ds[1], column: dataGrid.columnOption(1) } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, { selectedRowsOnly: true })).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'F1: str2_1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'str2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, { selectedRowsOnly: true })).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'f1: f1_1 (Max of f2 is 1)', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 1 }] } }],
                [{ pdfCell: { content: 1, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 1, data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'f1: f1_2 (Max of f2 is 3)', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 3 }] } }],
                [{ pdfCell: { content: 3, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 3, data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'f1: f1_1 (custom)', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 1 }] } }],
                [{ pdfCell: { content: 1, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 1, data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'f1: f1_2 (custom)', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 3 }] } }],
                [{ pdfCell: { content: 3, styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 3, data: ds[1], column: dataGrid.columnOption(1) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' },
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
                [{ pdfCell: { content: 'f1: f1_1 (Count: 1, Count: 1)', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 1 }, { 'name': 'GroupItems 2', 'value': 1 }] } }],
                [
                    { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                    { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(1) } }
                ],
                [{ pdfCell: { content: 'f1: f1_2 (Count: 1, Count: 1)', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 1 }, { 'name': 'GroupItems 2', 'value': 1 }] } }],
                [
                    { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                    { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(1) } }
                ]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'f1: f1_1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f2: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }],
                [{ pdfCell: { content: 'f1: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } }],
                [{ pdfCell: { content: 'f2: f2_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1) } }],
                [{ pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
                [{ pdfCell: { content: 'f1: f1_1 (Max of f3 is f3_2, Count: 2)', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f3_2' }, { 'name': 'GroupItems 2', 'value': 2 }] } }],
                [{ pdfCell: { content: 'f2: f1_2 (Max of f3 is f3_1, Count: 1)', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f3_1' }, { 'name': 'GroupItems 2', 'value': 1 }] } }],
                [{ pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }],
                [{ pdfCell: { content: 'f2: f2_2 (Max of f3 is f3_2, Count: 1)', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(0), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f3_2' }, { 'name': 'GroupItems 2', 'value': 1 }] } }],
                [{ pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1' },
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
            body: [[
                { pdfCell: { content: 'f1: f1_1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Max: f4_2\nCount: 2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'Max: f4_2\nCount: 2', data: ds[0], column: dataGrid.columnOption(3), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f4_2' }, { 'name': 'GroupItems 2', 'value': 2 }] } },
                { pdfCell: { content: 'Max: f5_2\nCount: 2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'Max: f5_2\nCount: 2', data: ds[0], column: dataGrid.columnOption(4), groupSummaryItems: [{ 'name': 'GroupItems 3', 'value': 'f5_2' }, { 'name': 'GroupItems 4', 'value': 2 }] } }
            ], [
                { pdfCell: { content: 'f2: f2_1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: ds[0].f2, data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'Max: f4_1\nCount: 1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: 'Max: f4_1\nCount: 1', data: ds[0], column: dataGrid.columnOption(3), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f4_1' }, { 'name': 'GroupItems 2', 'value': 1 }] } },
                { pdfCell: { content: 'Max: f5_1\nCount: 1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: 'Max: f5_1\nCount: 1', data: ds[0], column: dataGrid.columnOption(4), groupSummaryItems: [{ 'name': 'GroupItems 3', 'value': 'f5_1' }, { 'name': 'GroupItems 4', 'value': 1 }] } }
            ], [
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'f4_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f4_1', data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'f5_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f5_1', data: ds[0], column: dataGrid.columnOption(4) } }
            ], [
                { pdfCell: { content: 'f2: f2_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: ds[1].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'Max: f4_2\nCount: 1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: 'Max: f4_2\nCount: 1', data: ds[1], column: dataGrid.columnOption(3), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f4_2' }, { 'name': 'GroupItems 2', 'value': 1 }] } },
                { pdfCell: { content: 'Max: f5_2\nCount: 1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: 'Max: f5_2\nCount: 1', data: ds[1], column: dataGrid.columnOption(4), groupSummaryItems: [{ 'name': 'GroupItems 3', 'value': 'f5_2' }, { 'name': 'GroupItems 4', 'value': 1 }] } }
            ], [
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'f4_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f4_2', data: ds[1], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'f5_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f5_2', data: ds[1], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            body: [[
                { pdfCell: { content: 'f1: f1_1 (Max of f4 is f4_2, Count: 2, Max of f5 is f5_2, Count: 2)', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f4_2' }, { 'name': 'GroupItems 2', 'value': 2 }, { 'name': 'GroupItems 3', 'value': 'f5_2' }, { 'name': 'GroupItems 4', 'value': 2 }] } }
            ], [
                { pdfCell: { content: 'f2: f1_2 (Max of f4 is f4_1, Count: 1, Max of f5 is f5_1, Count: 1)', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f4_1' }, { 'name': 'GroupItems 2', 'value': 1 }, { 'name': 'GroupItems 3', 'value': 'f5_1' }, { 'name': 'GroupItems 4', 'value': 1 }] } }
            ], [
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'f4_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f4_1', data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'f5_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f5_1', data: ds[0], column: dataGrid.columnOption(4) } }
            ], [
                { pdfCell: { content: 'f2: f2_2 (Max of f4 is f4_2, Count: 1, Max of f5 is f5_2, Count: 1)', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 1, value: ds[1].f2, data: ds[0], column: dataGrid.columnOption(1), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f4_2' }, { 'name': 'GroupItems 2', 'value': 1 }, { 'name': 'GroupItems 3', 'value': 'f5_2' }, { 'name': 'GroupItems 4', 'value': 1 }] } }
            ], [
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'f4_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f4_2', data: ds[1], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'f5_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f5_2', data: ds[1], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });
});

QUnit.module('Group summary', moduleConfig, () => {
    QUnit.test('Grouping - 3 columns & group.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: true', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string', groupIndex: 0, allowExporting: false },
            ],
            summary: {
                groupItems: [
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'groupFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'groupFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'Max: f3_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'groupFooter', value: ds[1].f3, data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & group.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string', groupIndex: 0, allowExporting: false },
            ],
            summary: {
                groupItems: [
                    { name: 'GroupItems 1', column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: false }
                ]
            },
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'Max: f3_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'Max: f3_2', data: ds[0], column: dataGrid.columnOption(2), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f3_2' }] } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & col_1.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: true', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', allowExporting: false },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string', groupIndex: 0 },
            ],
            summary: {
                groupItems: [
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'groupFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'Max: f3_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'groupFooter', value: ds[1].f3, data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & col_1.allowExporting: false, summary_col_1.alignByColumn: true x showInGroupFooter: true', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', allowExporting: false },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string', groupIndex: 0 },
            ],
            summary: {
                groupItems: [
                    { column: 'f1', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'groupFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'groupFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & col_1.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', allowExporting: false },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string', groupIndex: 0 },
            ],
            summary: {
                groupItems: [
                    { name: 'GroupItems 1', column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: false }
                ]
            },
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f4: f4_1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'Max: f3_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'Max: f3_2', data: ds[0], column: dataGrid.columnOption(2), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f3_2' }] } }
            ], [
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & col_2.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: true', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string', allowExporting: false },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string', groupIndex: 0 },
            ],
            summary: {
                groupItems: [
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 2, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'groupFooter', value: undefined, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Max: f3_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'groupFooter', value: ds[1].f3, data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Grouping - 3 columns & col_2.allowExporting: false, summary_col_3.alignByColumn: true x showInGroupFooter: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string', allowExporting: false },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string', groupIndex: 0 },
            ],
            summary: {
                groupItems: [
                    { name: 'GroupItems 1', column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: false }
                ]
            },
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f4: f4_1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'Max: f3_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: 'Max: f3_2', data: ds[0], column: dataGrid.columnOption(2), groupSummaryItems: [{ 'name': 'GroupItems 1', 'value': 'f3_2' }] } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });
});

QUnit.module('Total summary', moduleConfig, () => {
    QUnit.test('Total summary', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { name: 'TotalSummary 1', column: 'f1', summaryType: 'max' },
                    { name: 'TotalSummary 2', column: 'f1', summaryType: 'min' },
                    { name: 'TotalSummary 3', column: 'f2', summaryType: 'max' },
                    { name: 'TotalSummary 4', column: 'f2', summaryType: 'min' }
                ]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'Max: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 1' } },
                { pdfCell: { content: 'Max: f2_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 3' } }
            ], [
                { pdfCell: { content: 'Min: f1_1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[0].f1, data: ds[1], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 2' } },
                { pdfCell: { content: 'Min: f2_1', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[0].f2, data: ds[1], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 4' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Total summary, total_col_1.customizeText: (cell) => \'custom\'', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' }
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { name: 'TotalSummary 1', column: 'f1', summaryType: 'max', customizeText: (cell) => 'custom' }
                ]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'custom', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 1' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Total summary, grid.wordWrapEnabled: false, rtlEnabled: true', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { name: 'TotalSummary 1', column: 'f1', summaryType: 'max' },
                    { name: 'TotalSummary 2', column: 'f1', summaryType: 'min' },
                    { name: 'TotalSummary 3', column: 'f2', summaryType: 'max' },
                    { name: 'TotalSummary 4', column: 'f2', summaryType: 'min' }
                ]
            },
            wordWrapEnabled: false,
            rtlEnabled: true,
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'right' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'Max: f1_2', styles: { 'halign': 'right', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 1' } },
                { pdfCell: { content: 'Max: f2_2', styles: { 'halign': 'right', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 3' } }
            ], [
                { pdfCell: { content: 'Min: f1_1', styles: { 'halign': 'right', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 2' } },
                { pdfCell: { content: 'Min: f2_1', styles: { 'halign': 'right', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 4' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('TODO: not supported - Total summary, grid.wordWrapEnabled: true, totalItems.alignment, total_2.alignment: center, total_3: right', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { name: 'TotalSummary 1', column: 'f1', summaryType: 'max' },
                    { name: 'TotalSummary 2', column: 'f1', summaryType: 'min', alignment: 'center' },
                    { name: 'TotalSummary 3', column: 'f2', summaryType: 'max', alignment: 'right' },
                    { name: 'TotalSummary 4', column: 'f2', summaryType: 'min' }
                ]
            },
            wordWrapEnabled: true,
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left', cellWidth: 'wrap' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'Max: f1_2', styles: { 'halign': 'left', fontStyle: 'bold', cellWidth: 'wrap' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 1' } },
                { pdfCell: { content: 'Max: f2_2', styles: { 'halign': 'left', fontStyle: 'bold', cellWidth: 'wrap' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 3' } }
            ], [
                { pdfCell: { content: 'Min: f1_1', styles: { 'halign': 'left', fontStyle: 'bold', cellWidth: 'wrap' } }, gridCell: { rowType: 'totalFooter', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 2' } },
                { pdfCell: { content: 'Min: f2_1', styles: { 'halign': 'left', fontStyle: 'bold', cellWidth: 'wrap' } }, gridCell: { rowType: 'totalFooter', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 4' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Total summary, selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { name: 'TotalSummary 1', column: 'f1', summaryType: 'max' },
                    { name: 'TotalSummary 2', column: 'f1', summaryType: 'min' },
                    { name: 'TotalSummary 3', column: 'f2', summaryType: 'max' },
                    { name: 'TotalSummary 4', column: 'f2', summaryType: 'min' }
                ]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined,
            selectedRowKeys: [ds[1]]
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'Max: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 1' } },
                { pdfCell: { content: 'Max: f2_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 3' } }
            ], [
                { pdfCell: { content: 'Min: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 2' } },
                { pdfCell: { content: 'Min: f2_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 4' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, { selectedRowsOnly: true })).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Total summary - 3 columns & total_col_1.showInColumn: col_1 - col_1.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', allowExporting: false },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { column: 'f1', summaryType: 'max' }
                ]
            },
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Total summary - 3 columns & total_col_1.showInColumn: col_2 - col_1.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', allowExporting: false },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { column: 'f2', summaryType: 'max' }
                ]
            },
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'Max: f2_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Total summary - 3 columns & total_col_1.showInColumn: col_3 - col_1.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string', allowExporting: false },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { column: 'f3', summaryType: 'max' }
                ]
            },
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Max: f3_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f3, data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Total summary - 3 columns & total_col_1.showInColumn: col_1 - col_2.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string', allowExporting: false },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { column: 'f1', summaryType: 'max' }
                ]
            },
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'Max: f1_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Total summary - 3 columns & total_col_1.showInColumn: col_2 - col_2.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string', allowExporting: false },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { column: 'f2', summaryType: 'max' }
                ]
            },
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Total summary - 3 columns & total_col_1.showInColumn: col_3 - col_2.allowExporting: false', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string', allowExporting: false },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { column: 'f3', summaryType: 'max' }
                ]
            },
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Max: f3_2', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f3, data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });
});

QUnit.module('Bands', moduleConfig, () => {
    QUnit.test('Bands, col2_band x without columns', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1', width: 200, alignment: 'left'
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Band1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: null, data: ds[0], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [f1, band[empty]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f1', width: 100 },
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'Band1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1F1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [f1, band[f2, f3]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: '1' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                'f1',
                {
                    caption: 'Band1',
                    alignment: 'left',
                    columns: [
                        { dataField: 'f2', alignment: 'left' },
                        { dataField: 'f3', alignment: 'left' },
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', rowSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Band1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(2) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(2) } },
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [f1, band[f2, f3, f4]]', function(assert) {
        const done = assert.async();
        const ds = [];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100, alignment: 'left' },
                {
                    caption: 'Band1',
                    alignment: 'left',
                    columns: [
                        { dataField: 'f2', width: 150, alignment: 'left' },
                        { dataField: 'f3', width: 200, alignment: 'left' },
                        { dataField: 'f4', width: 200, alignment: 'left' },
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', rowSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Band1', colSpan: 3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'F4', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F4', column: dataGrid.columnOption(3) } }
            ]],
            body: []
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [f1, band[f2, f3], band[f4, f5]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: '1' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f2', width: 150, alignment: 'left' },
                        { dataField: 'f3', width: 200, alignment: 'left' },
                    ]
                },
                {
                    caption: 'Band2',
                    alignment: 'left',
                    columns: [
                        { dataField: 'f4', width: 100, alignment: 'left' },
                        { dataField: 'f5', width: 200, alignment: 'left' },
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', rowSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Band1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'Band2', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band2', column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(2) } },
                { pdfCell: { content: 'F4', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F4', column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'F5', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F5', column: dataGrid.columnOption(4) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(4) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [f1, band[f2, f3.visible:false, f4], band[f5.visible: false, f6, f7]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: '1' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1',
                    alignment: 'left',
                    columns: [
                        { dataField: 'f2', width: 150, alignment: 'left' },
                        { dataField: 'f3', width: 200, alignment: 'left', visible: false },
                        { dataField: 'f4', width: 100, alignment: 'left' },
                    ]
                },
                {
                    caption: 'Band2',
                    alignment: 'left',
                    columns: [
                        { dataField: 'f5', width: 100, alignment: 'left', visible: false },
                        { dataField: 'f6', width: 150, alignment: 'left' },
                        { dataField: 'f7', width: 200, alignment: 'left' },
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', rowSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Band1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'Band2', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band2', column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(3) } },
                { pdfCell: { content: 'F4', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F4', column: dataGrid.columnOption(5) } },
                { pdfCell: { content: 'F6', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F6', column: dataGrid.columnOption(7) } },
                { pdfCell: { content: 'F7', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F7', column: dataGrid.columnOption(8) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(3) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(5) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(7) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: undefined, data: ds[0], column: dataGrid.columnOption(8) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, showColumnHeaders: false, [f1, band[f2, f3, f4]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' } ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f2', width: 150 },
                        { dataField: 'f3', width: 200 },
                        { dataField: 'f4', width: 200 },
                    ]
                }
            ],
            dataSource: ds,
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: ds[0].f4, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, showColumnHeaders: false, [f1, band[f2.visible: false, f3, f4]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' } ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f2', width: 150, visible: false },
                        { dataField: 'f3', width: 200 },
                        { dataField: 'f4', width: 200 },
                    ]
                }
            ],
            dataSource: ds,
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: ds[0].f4, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, showColumnHeaders: false, [f1, band[f2.allowExporting: false, f3, f4]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' } ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f2', width: 150, allowExporting: false },
                        { dataField: 'f3', width: 200 },
                        { dataField: 'f4', width: 100 },
                    ]
                }
            ],
            dataSource: ds,
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: ds[0].f4, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [f1, band[f2, f3].visible: false, f4]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1',
                    visible: false,
                    columns: [
                        { dataField: 'f2', width: 50 },
                        { dataField: 'f3', width: 200 },
                    ]
                },
                { dataField: 'f4', width: 200 },
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F4', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F4', column: dataGrid.columnOption(3) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f4, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [f1, band[f2.visible: false, f3.visible: false], f4.visible: false]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1',
                    alignment: 'left',
                    width: 250,
                    columns: [
                        { dataField: 'f2', width: 50, visible: false, allowExporting: true },
                        { dataField: 'f3', width: 200, visible: false, allowExporting: true }
                    ]
                },
                { dataField: 'f4', visible: false, width: 150 }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Band1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: null, data: ds[0], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [f1, band[f2.visible: false(allowExporting: true), f3, f4]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f2', width: 100, visible: false, allowExporting: true },
                        { dataField: 'f3', width: 200 },
                        { dataField: 'f4', width: 250 },
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', rowSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Band1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F4', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F4', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: ds[0].f4, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [f1, band[f2.allowExporting: false, f3, f4]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', width: 100 },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f2', width: 100, visible: true, allowExporting: false },
                        { dataField: 'f3', width: 200 },
                        { dataField: 'f4', width: 150 },
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'F1', rowSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Band1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F4', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F4', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } },
                { pdfCell: { content: ds[0].f4, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(3) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [band[band[f1, f2, f3]]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        {
                            caption: 'Band1_1',
                            columns: [
                                { dataField: 'f1', width: 100 },
                                { dataField: 'f2', width: 150 },
                                { dataField: 'f3', width: 200 },
                            ]
                        }
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'Band1', colSpan: 3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'Band1_1', colSpan: 3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1_1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(2) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [band[band[f1.visible: false, f2, f3]]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        {
                            caption: 'Band1_1',
                            columns: [
                                { dataField: 'f1', width: 100, visible: false },
                                { dataField: 'f2', width: 150 },
                                { dataField: 'f3', width: 200 },
                            ]
                        }
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'Band1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'Band1_1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1_1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(2) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [band[band[f1, f2.allowExporting: false, f3.visible: false]]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        {
                            caption: 'Band1_1',
                            columns: [
                                { dataField: 'f1', width: 100 },
                                { dataField: 'f2', width: 150, allowExporting: false },
                                { dataField: 'f3', width: 200, visible: false },
                            ]
                        }
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'Band1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'Band1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1_1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [band[f1, band[f2, f3]]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f1', width: 100 },
                        {
                            caption: 'Band1_1',
                            columns: [
                                { dataField: 'f2', width: 150 },
                                { dataField: 'f3', width: 200 },
                            ]
                        }
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'Band1', colSpan: 3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'F1', rowSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'Band1_1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1_1', column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(2) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [band[f1.visible: false, band[f2, f3]]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f1', width: 100, visible: false },
                        {
                            caption: 'Band1_1',
                            columns: [
                                { dataField: 'f2', width: 150 },
                                { dataField: 'f3', width: 200 },
                            ]
                        }
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'Band1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'Band1_1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1_1', column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'F3', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(2) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [band[band[f1, f2], f3]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        {
                            caption: 'Band1_1',
                            columns: [
                                { dataField: 'f1', width: 150 },
                                { dataField: 'f2', width: 200 },
                            ]
                        },
                        { dataField: 'f3', width: 100 }
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'Band1', colSpan: 3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'Band1_1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1_1', column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'F3', rowSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F3', column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: ds[0].f3, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f3, data: ds[0], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsStyles(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    QUnit.test('Bands, [band[band[f1, f2], f3.visible: false]]', function(assert) {
        const done = assert.async();
        const ds = [{ f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' }];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        {
                            caption: 'Band1_1',
                            columns: [
                                { dataField: 'f1', width: 150 },
                                { dataField: 'f2', width: 200 },
                            ]
                        },
                        { dataField: 'f3', width: 100, visible: false }
                    ]
                }
            ],
            dataSource: ds,
            loadingTimeout: undefined
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'Band1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1', column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'Band1_1', colSpan: 2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'Band1_1', column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'F1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F1', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'F2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'header', value: 'F2', column: dataGrid.columnOption(1) } }
            ]],
            body: [[
                { pdfCell: { content: ds[0].f1, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: ds[0].f2, styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
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

QUnit.module('customizeCell', moduleConfig, () => {
    QUnit.test('Customize header cells', function(assert) {
        const done = assert.async();
        const dataGrid = $('#dataGrid').dxDataGrid({
            keyExpr: 'f1',
            columns: [
                { caption: 'f1', dataType: 'string' },
                { caption: 'f2', dataType: 'string' }
            ],
            loadingTimeout: undefined
        }).dxDataGrid('instance');
        const options = {
            customizeCell: (options) => {
                const { gridCell, pdfCell } = options;
                if(gridCell.rowType === 'header') {
                    pdfCell.content += ' customText';
                    pdfCell.styles.fontStyle = 'bold';
                }
            }
        };

        const expectedCells = {
            head: [[
                { pdfCell: { content: 'f1 customText', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'header', value: 'f1 customText', column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2 customText', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'header', value: 'f2 customText', column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'head');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'head');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'head');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'head');
            done();
        });
    });

    QUnit.test('Customize data cells', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1', f2: 'f2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'string' },
                { dataField: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');
        const options = {
            customizeCell: (options) => {
                const { gridCell, pdfCell } = options;
                if(gridCell.rowType === 'data') {
                    pdfCell.content += ' customText';
                    pdfCell.styles.fontStyle = 'bold';
                }
            }
        };

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1 customText', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'data', value: 'f1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2 customText', styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'data', value: 'f2', data: ds[0], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Customize group cells', function(assert) {
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
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');
        const options = {
            customizeCell: (options) => {
                const { gridCell, pdfCell } = options;
                if(gridCell.rowType === 'group') {
                    pdfCell.content += ' customText';
                    pdfCell.styles.fontStyle = 'normal';
                }
            }
        };

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1: f1_1 customText', styles: { 'halign': 'left', fontStyle: 'normal' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'f1: f1_2 customText', styles: { 'halign': 'left', fontStyle: 'normal' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(1) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Customize groupSummary cells', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' },
            { f1: 'f1_2', f2: 'f2_2', f3: 'f3_2', f4: 'f4_1' }
        ];

        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
                { dataField: 'f3', caption: 'f3', dataType: 'string' },
                { dataField: 'f4', caption: 'f4', dataType: 'string', groupIndex: 0, allowExporting: false },
            ],
            summary: {
                groupItems: [
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: ds,
            loadingTimeout: undefined,
            showColumnHeaders: false
        }).dxDataGrid('instance');
        const options = {
            customizeCell: (options) => {
                const { gridCell, pdfCell } = options;
                if(gridCell.rowType === 'groupFooter') {
                    pdfCell.styles.fontStyle = 'normal';
                    if(pdfCell.content) {
                        pdfCell.content += ': customText';
                    }
                }
            }
        };

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f4: f4_1', colSpan: 3, styles: { 'halign': 'left', fontStyle: 'bold' } }, gridCell: { rowType: 'group', groupIndex: 0, value: ds[0].f4, data: ds[0], column: dataGrid.columnOption(0) } }
            ], [
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_1', data: ds[0], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'f3_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f3_2', data: ds[1], column: dataGrid.columnOption(2) } }
            ], [
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'normal' } }, gridCell: { rowType: 'groupFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: '', styles: { 'halign': 'left', fontStyle: 'normal' } }, gridCell: { rowType: 'groupFooter', value: undefined, data: ds[1], column: dataGrid.columnOption(1) } },
                { pdfCell: { content: 'Max: f3_2: customText', styles: { 'halign': 'left', fontStyle: 'normal' } }, gridCell: { rowType: 'groupFooter', value: ds[1].f3, data: ds[1], column: dataGrid.columnOption(2) } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });

    QUnit.test('Customize totalSummary cells', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'f1_1', f2: 'f2_1' },
            { f1: 'f1_2', f2: 'f2_2' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'f1', caption: 'f1', dataType: 'string' },
                { dataField: 'f2', caption: 'f2', dataType: 'string' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { name: 'TotalSummary 1', column: 'f1', summaryType: 'max' },
                    { name: 'TotalSummary 2', column: 'f1', summaryType: 'min' },
                    { name: 'TotalSummary 3', column: 'f2', summaryType: 'max' },
                    { name: 'TotalSummary 4', column: 'f2', summaryType: 'min' }
                ]
            },
            showColumnHeaders: false,
            loadingTimeout: undefined
        }).dxDataGrid('instance');
        const options = {
            customizeCell: (options) => {
                const { gridCell, pdfCell } = options;
                if(gridCell.rowType === 'totalFooter') {
                    pdfCell.styles.fontStyle = 'normal';
                    pdfCell.content += ': customText';
                }
            }
        };

        const expectedCells = {
            body: [[
                { pdfCell: { content: 'f1_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_1', data: ds[0], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_1', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_1', data: ds[0], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'f1_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f1_2', data: ds[1], column: dataGrid.columnOption(0) } },
                { pdfCell: { content: 'f2_2', styles: { 'halign': 'left' } }, gridCell: { rowType: 'data', value: 'f2_2', data: ds[1], column: dataGrid.columnOption(1) } }
            ], [
                { pdfCell: { content: 'Max: f1_2: customText', styles: { 'halign': 'left', fontStyle: 'normal' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f1, data: ds[1], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 1' } },
                { pdfCell: { content: 'Max: f2_2: customText', styles: { 'halign': 'left', fontStyle: 'normal' } }, gridCell: { rowType: 'totalFooter', value: ds[1].f2, data: ds[1], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 3' } }
            ], [
                { pdfCell: { content: 'Min: f1_1: customText', styles: { 'halign': 'left', fontStyle: 'normal' } }, gridCell: { rowType: 'totalFooter', value: ds[0].f1, data: ds[0], column: dataGrid.columnOption(0), totalSummaryItemName: 'TotalSummary 2' } },
                { pdfCell: { content: 'Min: f2_1: customText', styles: { 'halign': 'left', fontStyle: 'normal' } }, gridCell: { rowType: 'totalFooter', value: ds[0].f2, data: ds[0], column: dataGrid.columnOption(1), totalSummaryItemName: 'TotalSummary 4' } }
            ]]
        };

        exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then(() => {
            const autoTableOptions = this.jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkRowAndColumnCount(expectedCells, autoTableOptions, 'body');
            helper.checkCellsStyles(expectedCells, autoTableOptions, 'body');
            helper.checkCellsContent(expectedCells, autoTableOptions, 'body');
            helper.checkMergeCells(expectedCells, autoTableOptions, 'body');
            done();
        });
    });
});

JSPdfOptionTests.runTests(moduleConfig, exportDataGrid.__internals._getFullOptions, function() { return $('#dataGrid').dxDataGrid({}).dxDataGrid('instance'); });
LoadPanelTests.runTests(moduleConfig, exportDataGrid, () => $('#dataGrid').dxDataGrid({ dataSource: [{ f1: 'f1_1' }], loadingTimeout: undefined }).dxDataGrid('instance'), 'jsPDFDocument');


