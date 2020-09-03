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
        const { keepColumnWidths = true, autoTableOptions = {} } = options || {};

        const result = {
            component: dataGrid,
            jsPDFDocument: context.jsPDFDocument
        };
        result.keepColumnWidths = keepColumnWidths;
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
            loadingTimeout: undefined,
            showColumnHeaders: true
        }).dxDataGrid('instance');
        const options = {
            autoTableOptions: { tableWidth: 250 }
        };

        const expectedCells = {
            head: [[{ content: 'f1' }]],
            body: [[{ content: 'text1' }]]
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

    [true, false].forEach((keepColumnWidths) => {
        QUnit.test(`Table and column widths, keepColumnWidths: ${keepColumnWidths}`, function(assert) {
            const done = assert.async();
            const ds = [{ id: 1, name: 'test' }];
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: ds,
                keyExpr: 'id',
                columns: [
                    { dataField: 'id', width: 50, caption: 'id' },
                    { dataField: 'name', caption: 'name' }
                ],
                loadingTimeout: undefined,
                showColumnHeaders: true,
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
                head: [[{ content: 'id' }, { content: 'name' }]],
                body: [[{ content: 1 }, { content: 'test' }]]
            };

            exportDataGrid(getOptions(this, dataGrid, options)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                assert.strictEqual(autoTableOptions.tableWidth, 250, 'autoTableWidth');
                helper.checkColumnWidths(expectedColumnWidths, autoTableOptions);
                ['head', 'body'].forEach((rowType) => {
                    helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                    helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                });
                done();
            });
        });
    });

    QUnit.test('grouping, row hasn\'t additional items', function(assert) {
        const done = assert.async();
        const ds = [
            { f1: 'text1_1', f2: 'text1_2', f3: 'group1' },
            { f1: 'text2_1', f2: 'text2_2', f3: 'group1' }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: ds,
            columns: [
                { dataField: 'f1', caption: 'f1' },
                { dataField: 'f2', caption: 'f2' },
                { dataField: 'f3', caption: 'f3', groupIndex: 0 }
            ],
            loadingTimeout: undefined,
            showColumnHeaders: true
        }).dxDataGrid('instance');

        const expectedCells = {
            head: [[{ content: 'f1' }, { content: 'f2' }]],
            body: [
                [{ content: 'f3: group1', colSpan: 2 }],
                [{ content: 'text1_1' }, { content: 'text1_2' }],
                [{ content: 'text2_1' }, { content: 'text2_2' }]
            ]
        };

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            ['head', 'body'].forEach((rowType) => {
                helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
            });
            done();
        });
    });

    [true, false].forEach((alignByColumn) => {
        QUnit.test(`grouping, row has additional items, alignByColumn === ${alignByColumn}`, function(assert) {
            const done = assert.async();
            const ds = [
                { f1: 'text1_1', f2: 'text1_2', f3: 1, f4: 'group1', f5: 'text1_5' },
                { f1: 'text2_1', f2: 'text2_2', f3: 1, f4: 'group1', f5: 'text2_5' }
            ];
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: ds,
                columns: [
                    { dataField: 'f1', caption: 'f1' },
                    { dataField: 'f2', caption: 'f2' },
                    { dataField: 'f3', caption: 'f3' },
                    { dataField: 'f4', caption: 'f4', groupIndex: 0 },
                    { dataField: 'f5', caption: 'f5' }
                ],
                summary: {
                    groupItems: [{
                        column: 'f3',
                        summaryType: 'sum',
                        showInGroupFooter: false,
                        alignByColumn: alignByColumn
                    }]
                },
                loadingTimeout: undefined,
                showColumnHeaders: true
            }).dxDataGrid('instance');

            const groupRow = alignByColumn
                ? [{ content: 'f4: group1', colSpan: 2 }, { content: 'Sum: 2' }, {}]
                : [{ content: 'f4: group1 (Sum of f3 is 2)', colSpan: 4 }];

            const expectedCells = {
                head: [[{ content: 'f1' }, { content: 'f2' }, { content: 'f3' }, { content: 'f5' }]],
                body: [
                    groupRow,
                    [{ content: 'text1_1' }, { content: 'text1_2' }, { content: 1 }, { content: 'text1_5' } ],
                    [{ content: 'text2_1' }, { content: 'text2_2' }, { content: 1 }, { content: 'text2_5' }]
                ]
            };

            exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                ['head', 'body'].forEach((rowType) => {
                    helper.checkRowAndColumnCount(expectedCells, autoTableOptions, rowType);
                    helper.checkCellsContent(expectedCells, autoTableOptions, rowType);
                    helper.checkMergeCells(expectedCells, autoTableOptions, rowType);
                });
                done();
            });
        });
    });
});
