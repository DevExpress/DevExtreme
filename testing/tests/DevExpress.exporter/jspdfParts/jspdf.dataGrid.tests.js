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
    beforeEach: function() {
        // The transpiling of the script on the drone and locally has differences that affect the imported jsPDF type.
        const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
        this.jsPDFDocument = _jsPDF('p', 'pt', 'a4');

        helper = new JSPdfDataGridTestHelper(this.jsPDFDocument);
    }
};

QUnit.module('Scenarios, generate autoTable options', moduleConfig, () => {
    const getOptions = (context, dataGrid, expectedCustomizeCellArgs, options) => {
        const { /* keepColumnWidths = true, selectedRowsOnly = false, */ autoTableOptions = {} } = options || {};

        const result = {
            component: dataGrid,
            jsPDFDocument: context.jsPDFDocument
        };
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
        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then((jsPDFDocument) => {
            const autoTableOptions = jsPDFDocument.autoTable.__autoTableOptions;
            helper.checkTableAndColumnWidths(Export.convertPixelsToPoints(500), [Export.convertPixelsToPoints(50), 'auto'], autoTableOptions);
            helper.checkCellsContent([['id', 'name']], [['1', 'test']], autoTableOptions);
            done();
        });
    });
});
