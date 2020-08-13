import $ from 'jquery';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { PdfJSDataGridTestHelper } from './PdfJSTestHelper.js';
import { initializeDxObjectAssign, clearDxObjectAssign } from '../exceljsParts/objectAssignHelper.js';
import './promiseHelper.js';
import { exportDataGrid } from 'pdf_exporter';

import 'ui/data_grid/ui.data_grid';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id=\'dataGrid\'></div>';

    $('#qunit-fixture').html(markup);
});

let helper;

const moduleConfig = {
    before: function() {
        initializeDxObjectAssign();
    },
    beforeEach: function() {
        this.jsPDFDocument = new jsPDF('p', 'pt', 'a4');
        this.customizeCellCallCount = 0;

        helper = new PdfJSDataGridTestHelper(this.jsPDFDocument);
    },
    after: function() {
        clearDxObjectAssign();
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

        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then((autoTableOptions) => {
            helper.checkTableWidth(undefined, autoTableOptions);
            helper.checkColumnWidths([], autoTableOptions);
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
        exportDataGrid(getOptions(this, dataGrid, expectedCells)).then((autoTableOptions) => {
            helper.checkTableWidth(500, autoTableOptions);
            helper.checkColumnWidths([50, 'auto'], autoTableOptions);
            helper.checkCellsContent([['id', 'name']], [['1', 'test']], autoTableOptions);
            done();
        });
    });
});
