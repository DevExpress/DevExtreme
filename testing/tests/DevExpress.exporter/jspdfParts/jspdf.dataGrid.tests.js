import $ from 'jquery';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { isFunction } from 'core/utils/type';
import { JSPdfDataGridTestHelper } from './jspdfTestHelper.js';
import { exportDataGrid } from 'pdf_exporter';

import 'ui/data_grid/ui.data_grid';

import 'common.css!';
import 'generic_light.css!';
import { Export } from 'exporter/jspdf/export';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';

    $('#qunit-fixture').html(markup);
});

let helper;

const moduleConfig = {
    jsPDFUnit: 'pt',
    beforeEach: function() {
        // The transpiling of the script on the drone and locally has differences that affect the imported jsPDF type.
        const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
        this.jsPDFDocument = _jsPDF('p', this.jsPDFUnit, 'a4');

        helper = new JSPdfDataGridTestHelper(this.jsPDFDocument);
    }
};

['mm', 'cm', 'em', 'px', 'pt'].forEach((unit) => {
    const _moduleConfig = $.extend(moduleConfig, {
        jsPDFUnit: unit
    });

    QUnit.module('Scenarios, check generated content', _moduleConfig, () => {
        const getOptions = (context, dataGrid, expectedCustomizeCellArgs, options) => {
            const { autoTableOptions = {} } = options || {};

            const result = {
                component: dataGrid,
                jsPDFDocument: context.jsPDFDocument
            };
            result.autoTableOptions = autoTableOptions;
            return result;
        };

        QUnit.test(`Table and column widths, jsPDFUnit: ${unit}`, function(assert) {
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
            const expectedCells = [];
            const options = {
                autoTableOptions: {
                    styles: { fillColor: [255, 0, 0] }
                }
            };

            exportDataGrid(getOptions(this, dataGrid, expectedCells, options)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkTableAndColumnWidths(500, [50, 'auto'], autoTableOptions);
                helper.checkTableAndColumnWidthsInOutput(500, [50, 450]);
                done();
            });
        });
    });
});

QUnit.module('Scenarios, check autoTableOptions', moduleConfig, () => {
    const getOptions = (context, dataGrid, expectedCustomizeCellArgs, options) => {
        const { keepColumnWidths = true, /* selectedRowsOnly = false, */ autoTableOptions = {} } = options || {};

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
        const expectedCells = [];

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkTableAndColumnWidths(undefined, [], autoTableOptions);
            helper.checkCellsContent([], [], autoTableOptions);
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
        const expectedCells = [];

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkTableAndColumnWidths(undefined, ['auto'], autoTableOptions);
            helper.checkCellsContent([['f1']], [['text1']], autoTableOptions);
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
            const expectedCells = [];

            exportDataGrid(getOptions(this, dataGrid, expectedCells, { keepColumnWidths: keepColumnWidths })).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                const expectedColumnWidths = keepColumnWidths ? [50, 'auto'] : ['auto', 'auto'];
                helper.checkTableAndColumnWidths(500, expectedColumnWidths, autoTableOptions);
                helper.checkCellsContent([['id', 'name']], [['1', 'test']], autoTableOptions);
                done();
            });
        });
    });

    ['px', 'pt'].forEach((unit) => {
        QUnit.test(`Table and column widths. A CSS-accepted measurement: '${unit}'`, function(assert) {
            const tableWidth = unit === 'pt' ? `${Export.convertPixelsToPoints(300)}pt` : '300px';
            const columnWidth = unit === 'pt' ? `${Export.convertPixelsToPoints(30)}pt` : '30px';

            const done = assert.async();
            const ds = [{ id: 1, name: 'test' }];
            const dataGrid = $('#dataGrid').dxDataGrid({
                dataSource: ds,
                keyExpr: 'id',
                columns: [
                    { dataField: 'id', width: `${columnWidth}`, caption: 'id' },
                    { dataField: 'name', caption: 'name' }
                ],
                loadingTimeout: undefined,
                showColumnHeaders: true,
                width: `${tableWidth}`
            }).dxDataGrid('instance');
            const expectedCells = [];

            exportDataGrid(getOptions(this, dataGrid, expectedCells)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                helper.checkTableAndColumnWidths(300, [30, 'auto'], autoTableOptions);
                helper.checkCellsContent([['id', 'name']], [['1', 'test']], autoTableOptions);
                done();
            });
        });
    });
});
