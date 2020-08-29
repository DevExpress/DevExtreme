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

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
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

        exportDataGrid(getOptions(this, dataGrid)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
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
            const options = {
                autoTableOptions: {
                    tableWidth: 250
                },
                keepColumnWidths: keepColumnWidths
            };

            exportDataGrid(getOptions(this, dataGrid, options)).then((jsPDFDocument) => {
                const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
                assert.equal(autoTableOptions.tableWidth, 250, 'autoTableWidth');
                const expectedColumnWidths = keepColumnWidths ? [25, 225] : ['auto', 'auto'];
                helper.checkColumnWidths(expectedColumnWidths, autoTableOptions);
                helper.checkCellsContent([['id', 'name']], [['1', 'test']], autoTableOptions);
                done();
            });
        });
    });
});
