import $ from 'jquery';
import { jsPDF } from 'jspdf';

import { isFunction, isObject, isDefined } from 'core/utils/type';

import 'ui/data_grid';
import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';
import { initializeDxObjectAssign, clearDxObjectAssign } from '../../commonParts/objectAssignHelper.js';

import { JSPdfMultilineTests } from './jspdf_v3.dataGrid.multiline.tests.js';
import { JSPdfWordWrapTests } from './jspdf_v3.dataGrid.wordwrap.tests.js';
import { JSPdfStylesTests } from './jspdf_v3.dataGrid.styles.tests.js';
import { JSPdfBorderColorsTests } from './jspdf_v3.dataGrid.borderColors.tests.js';
import { JSPdfBandsTests } from './jspdf_v3.dataGrid.bands.tests.js';
import { JSPdfGroupingTests } from './jspdf_v3.dataGrid.grouping.tests.js';
import { JSPdfSummariesTests } from './jspdf_v3.dataGrid.summaries.tests.js';
import { JSPdfVerticalAlignTests } from './jspdf_v3.dataGrid.verticalAlign.tests.js';
import { JSPdfColumnWidthsTests } from './jspdf_v3.dataGrid.columnAutoWidth.tests.js';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    before: function() {
        initializeDxObjectAssign();
    },
    beforeEach: function() {
        // The transpiling of the script on the drone and locally has differences that affect the imported jsPDF type.
        const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
        this.jsPDFDocument = _jsPDF();
        this.customizeCellCallCount = 0;
    },
    after: function() {
        clearDxObjectAssign();
    }
};

function argumentsToString() {
    const items = [];
    for(let i = 0; i < arguments.length; i++) { // Array.from(arguments) is not supported in IE
        items.push(arguments[i]);
    }
    for(let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if(isObject(item)) {
            items[i] = '{' + Object.keys(item).map((key) => key + ':' + item[key]).join(',') + '}';
        }
    }
    return items.toString();
}

function createMockPdfDoc() {
    const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
    const result = _jsPDF({ unit: 'pt' });
    result.__log = [];

    result.__skipCheckHorizontalAlignInLogs = false;

    result.__setDrawColor = result.setDrawColor;
    result.setDrawColor = function() {
        this.__log.push('setDrawColor,' + argumentsToString.apply(null, arguments));
        this.__setDrawColor.apply(this, arguments);
    };

    result.__setFillColor = result.setFillColor;
    result.setFillColor = function() {
        this.__log.push('setFillColor,' + argumentsToString.apply(null, arguments));
        this.__setFillColor.apply(this, arguments);
    };

    result.__setFont = result.setFont;
    result.setFont = function() {
        this.__log.push('setFont,' + argumentsToString.apply(null, arguments));
        this.__setFont.apply(this, arguments);
    };

    result.__setFontSize = result.setFontSize;
    result.setFontSize = function() {
        this.__log.push('setFontSize,' + argumentsToString.apply(null, arguments));
        this.__setFontSize.apply(this, arguments);
    };

    result.__setLineHeightFactor = result.setLineHeightFactor;
    result.setLineHeightFactor = function() {
        this.__log.push('setLineHeightFactor,' + argumentsToString.apply(null, arguments));
        this.__setLineHeightFactor.apply(this, arguments);
    };

    result.__setTextColor = result.setTextColor;
    result.setTextColor = function() {
        this.__log.push('setTextColor,' + argumentsToString.apply(null, arguments));
        this.__setTextColor.apply(this, arguments);
    };

    result.__rect = result.rect;
    result.rect = function() {
        this.__log.push('rect,' + argumentsToString.apply(null, arguments));
        this.__rect.apply(this, arguments);
    };

    result.__line = result.line;
    result.line = function() {
        this.__log.push('line,' + argumentsToString.apply(null, arguments));
        this.__line.apply(this, arguments);
    };

    result.__setLineWidth = result.setLineWidth;
    result.setLineWidth = function() {
        this.__log.push('setLineWidth,' + argumentsToString.apply(null, arguments));
        this.__setLineWidth.apply(this, arguments);
    };

    result.__text = result.text;
    result.text = function() {
        if(arguments.length >= 3 && arguments[3].baseline === 'alphabetic') {
            arguments[3] = undefined;
        }
        if(!this.__checkHorizontalAlignInLogs && arguments.length >= 3 && isDefined(arguments[3]) && arguments[3].align === 'left') {
            delete arguments[3].align;
        }
        this.__log.push('text,' + argumentsToString.apply(null, arguments));
        this.__text.apply(this, arguments);
    };

    result.__addPage = result.addPage;
    result.addPage = function() {
        this.__log.push('addPage,' + argumentsToString.apply(null, arguments));
        this.__addPage.apply(this, arguments);
    };

    return result;
}

function createDataGrid(options) {
    options.loadingTimeout = null;
    return $('#dataGrid').dxDataGrid(options).dxDataGrid('instance');
}

QUnit.module('Table', moduleConfig, () => {

    QUnit.test('Required arguments', function(assert) {
        // TODO
        assert.ok(true);
    });

    QUnit.test('Empty', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({});

        const expectedLog = [
            'setLineWidth,1', 'rect,10,15,0,0',
        ];

        const customizeCell = () => {
            assert.fail('customizeCell should not be called');
        };
        const onRowExporting = () => {
            assert.fail('onRowExporting should not be called');
        };

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const expectedLog = [
            'text,f1,10,25,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'text,f1,15,25,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding.left', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { left: 5 };
        };

        const expectedLog = [
            'text,f1,15,25,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding.top', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { top: 5 };
        };

        const expectedLog = [
            'text,f1,10,27.5,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding.right', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { right: 5 };
        };

        const expectedLog = [
            'text,f1,10,25,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding.bottom', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { bottom: 5 };
        };

        const expectedLog = [
            'text,f1,10,22.5,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'text,f1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,18.4',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'text,f1,15,29.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,28.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - height auto, padding.left', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { left: 5 };
        };

        const expectedLog = [
            'text,f1,15,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,18.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - height auto, padding.top', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { top: 5 };
        };

        const expectedLog = [
            'text,f1,10,29.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,23.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - height auto, padding.right', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { right: 5 };
        };

        const expectedLog = [
            'text,f1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,18.4',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - height auto, padding.bottom', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { bottom: 5 };
        };

        const expectedLog = [
            'text,f1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,23.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - hide all borders', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };
        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const expectedLog = [
            'text,f1,10,25,{baseline:middle}'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell, onRowExporting, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 20;
            } else {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,25,{baseline:middle}',
            'text,v1,10,47,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,100,20',
            'setLineWidth,1', 'rect,10,35,100,24',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1' }],
        });

        const expectedLog = [
            'text,F1,10,24.2,{baseline:middle}',
            'text,v1,10,42.6,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,100,18.4',
            'setLineWidth,1', 'rect,10,33.4,100,18.4',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1' }],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'text,F1,15,29.2,{baseline:middle}',
            'text,v1,15,57.6,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,100,28.4',
            'setLineWidth,1', 'rect,10,43.4,100,28.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const expectedLog = [
            'text,line 1,10,24.2,{baseline:middle}',
            'setLineWidth,1',
            'rect,10,15,200,18.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'text,line 1,10,24.2,{baseline:middle,align:left}',
            'setLineWidth,1',
            'rect,10,15,200,18.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'text,line 1,110,24.2,{baseline:middle,align:center}',
            'setLineWidth,1',
            'rect,10,15,200,18.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'text,line 1,210,24.2,{baseline:middle,align:right}',
            'setLineWidth,1',
            'rect,10,15,200,18.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setFontSize,10',
            'text,line 1,10,20.75,{baseline:middle,align:left}',
            'setLineWidth,1',
            'rect,10,15,200,11.5',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setFontSize,10',
            'text,line 1,110,20.75,{baseline:middle,align:center}',
            'setLineWidth,1',
            'rect,10,15,200,11.5',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setFontSize,10',
            'text,line 1,210,20.75,{baseline:middle,align:right}',
            'setLineWidth,1',
            'rect,10,15,200,11.5',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setFontSize,20',
            'text,line 1,10,26.5,{baseline:middle,align:left}',
            'setLineWidth,1',
            'rect,10,15,200,23',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setFontSize,20',
            'text,line 1,110,26.5,{baseline:middle,align:center}',
            'setLineWidth,1',
            'rect,10,15,200,23',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setFontSize,20',
            'text,line 1,210,26.5,{baseline:middle,align:right}',
            'setLineWidth,1',
            'rect,10,15,200,23',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'text,line 1\nlong line 2,10,24.2,{baseline:middle,align:left}',
            'setLineWidth,1',
            'rect,10,15,200,36.8'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'text,line 1\nlong line 2,110,24.2,{baseline:middle,align:center}',
            'setLineWidth,1',
            'rect,10,15,200,36.8'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'text,line 1\nlong line 2,210,24.2,{baseline:middle,align:right}',
            'setLineWidth,1',
            'rect,10,15,200,36.8'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setFontSize,10',
            'text,line 1\nlong line 2,10,20.75,{baseline:middle,align:left}',
            'setLineWidth,1',
            'rect,10,15,200,23',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setFontSize,10',
            'text,line 1\nlong line 2,110,20.75,{baseline:middle,align:center}',
            'setLineWidth,1',
            'rect,10,15,200,23',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setFontSize,10',
            'text,line 1\nlong line 2,210,20.75,{baseline:middle,align:right}',
            'setLineWidth,1',
            'rect,10,15,200,23',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setFontSize,20',
            'text,line 1\nlong line 2,10,26.5,{baseline:middle,align:left}',
            'setLineWidth,1',
            'rect,10,15,200,46',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setFontSize,20',
            'text,line 1\nlong line 2,110,26.5,{baseline:middle,align:center}',
            'setLineWidth,1',
            'rect,10,15,200,46',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setFontSize,20',
            'text,line 1\nlong line 2,210,26.5,{baseline:middle,align:right}',
            'setLineWidth,1',
            'rect,10,15,200,46',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'text,line 1\nlong line 2\nvery long line 3,10,24.2,{baseline:middle,align:left}',
            'setLineWidth,1',
            'rect,10,15,200,55.2'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'text,line 1\nlong line 2\nvery long line 3,110,24.2,{baseline:middle,align:center}',
            'setLineWidth,1',
            'rect,10,15,200,55.2'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'text,line 1\nlong line 2\nvery long line 3,210,24.2,{baseline:middle,align:right}',
            'setLineWidth,1',
            'rect,10,15,200,55.2'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setFontSize,10',
            'text,line 1\nlong line 2\nvery long line 3,10,20.75,{baseline:middle,align:left}',
            'setLineWidth,1',
            'rect,10,15,200,34.5',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setFontSize,10',
            'text,line 1\nlong line 2\nvery long line 3,110,20.75,{baseline:middle,align:center}',
            'setLineWidth,1',
            'rect,10,15,200,34.5',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setFontSize,10',
            'text,line 1\nlong line 2\nvery long line 3,210,20.75,{baseline:middle,align:right}',
            'setLineWidth,1',
            'rect,10,15,200,34.5',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setFontSize,20',
            'text,line 1\nlong line 2\nvery long line 3,10,26.5,{baseline:middle,align:left}',
            'setLineWidth,1',
            'rect,10,15,200,69',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setFontSize,20',
            'text,line 1\nlong line 2\nvery long line 3,110,26.5,{baseline:middle,align:center}',
            'setLineWidth,1',
            'rect,10,15,200,69',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__checkHorizontalAlignInLogs = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setFontSize,20',
            'text,line 1\nlong line 2\nvery long line 3,210,26.5,{baseline:middle,align:right}',
            'setLineWidth,1',
            'rect,10,15,200,69',
            'setFontSize,16'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 rows', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v1_2' }]
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'text,v1_2,10,63,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,100,16',
            'setLineWidth,1', 'rect,10,31,100,20',
            'setLineWidth,1', 'rect,10,51,100,24',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 rows - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v1_2' }]
        });

        const expectedLog = [
            'text,F1,10,24.2,{baseline:middle}',
            'text,v1_1,10,42.6,{baseline:middle}',
            'text,v1_2,10,61,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,100,18.4',
            'setLineWidth,1', 'rect,10,33.4,100,18.4',
            'setLineWidth,1', 'rect,10,51.8,100,18.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 rows - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v1_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'text,F1,15,29.2,{baseline:middle}',
            'text,v1_1,15,57.6,{baseline:middle}',
            'text,v1_2,15,86,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,100,28.4',
            'setLineWidth,1', 'rect,10,43.4,100,28.4',
            'setLineWidth,1', 'rect,10,71.8,100,28.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }, { caption: 'f2' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 16;
        };

        const expectedLog = [
            'text,f1,10,23,{baseline:middle}',
            'text,f2,50,23,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,16',
            'setLineWidth,1', 'rect,50,15,60,16',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }, { caption: 'f2' }]
        });

        const expectedLog = [
            'text,f1,10,24.2,{baseline:middle}',
            'text,f2,50,24.2,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,18.4',
            'setLineWidth,1', 'rect,50,15,60,18.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - height auto, columns with different paddings', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }, { caption: 'f2' }]
        });

        const paddingMap = [ 5, 10 ];
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = paddingMap[gridCell.column.index];
        };

        const expectedLog = [
            'text,f1,15,34.2,{baseline:middle}',
            'text,f2,60,34.2,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,38.4',
            'setLineWidth,1', 'rect,50,15,60,38.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 1 row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1', f2: 'v2' }]
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1') {
                e.rowHeight = 20;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,F2,50,23,{baseline:middle}',
            'text,v1,10,41,{baseline:middle}',
            'text,v2,50,41,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,16',
            'setLineWidth,1', 'rect,50,15,60,16',
            'setLineWidth,1', 'rect,10,31,40,20',
            'setLineWidth,1', 'rect,50,31,60,20',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 1 row - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1', f2: 'v2' }]
        });

        const expectedLog = [
            'text,F1,10,24.2,{baseline:middle}',
            'text,F2,50,24.2,{baseline:middle}',
            'text,v1,10,42.6,{baseline:middle}',
            'text,v2,50,42.6,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,18.4',
            'setLineWidth,1', 'rect,50,15,60,18.4',
            'setLineWidth,1', 'rect,10,33.4,40,18.4',
            'setLineWidth,1', 'rect,50,33.4,60,18.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 1 row - height auto, columns with different paddings', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1', f2: 'v2' }]
        });

        const paddingMap = [ 5, 10 ];
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = paddingMap[gridCell.column.index];
        };

        const expectedLog = [
            'text,F1,15,34.2,{baseline:middle}',
            'text,F2,60,34.2,{baseline:middle}',
            'text,v1,15,72.6,{baseline:middle}',
            'text,v2,60,72.6,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,38.4',
            'setLineWidth,1', 'rect,50,15,60,38.4',
            'setLineWidth,1', 'rect,10,53.4,40,38.4',
            'setLineWidth,1', 'rect,50,53.4,60,38.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 2 rows', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,F2,50,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'text,v2_1,50,41,{baseline:middle}',
            'text,v1_2,10,63,{baseline:middle}',
            'text,v2_2,50,63,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,16',
            'setLineWidth,1', 'rect,50,15,60,16',
            'setLineWidth,1', 'rect,10,31,40,20',
            'setLineWidth,1', 'rect,50,31,60,20',
            'setLineWidth,1', 'rect,10,51,40,24',
            'setLineWidth,1', 'rect,50,51,60,24',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 2 rows - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
        });

        const expectedLog = [
            'text,F1,10,24.2,{baseline:middle}',
            'text,F2,50,24.2,{baseline:middle}',
            'text,v1_1,10,42.6,{baseline:middle}',
            'text,v2_1,50,42.6,{baseline:middle}',
            'text,v1_2,10,61,{baseline:middle}',
            'text,v2_2,50,61,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,18.4',
            'setLineWidth,1', 'rect,50,15,60,18.4',
            'setLineWidth,1', 'rect,10,33.4,40,18.4',
            'setLineWidth,1', 'rect,50,33.4,60,18.4',
            'setLineWidth,1', 'rect,10,51.8,40,18.4',
            'setLineWidth,1', 'rect,50,51.8,60,18.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 2 rows - height auto, columns with different paddings', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
        });

        const paddingMap = [ 5, 10 ];
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = paddingMap[gridCell.column.index];
        };

        const expectedLog = [
            'text,F1,15,34.2,{baseline:middle}',
            'text,F2,60,34.2,{baseline:middle}',
            'text,v1_1,15,72.6,{baseline:middle}',
            'text,v2_1,60,72.6,{baseline:middle}',
            'text,v1_2,15,111,{baseline:middle}',
            'text,v2_2,60,111,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,38.4',
            'setLineWidth,1', 'rect,50,15,60,38.4',
            'setLineWidth,1', 'rect,10,53.4,40,38.4',
            'setLineWidth,1', 'rect,50,53.4,60,38.4',
            'setLineWidth,1', 'rect,10,91.8,40,38.4',
            'setLineWidth,1', 'rect,50,91.8,60,38.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 2 rows - column[0] width is zero', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,F2,10,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'text,v2_1,10,41,{baseline:middle}',
            'text,v1_2,10,63,{baseline:middle}',
            'text,v2_2,10,63,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,0,16',
            'setLineWidth,1', 'rect,10,15,100,16',
            'setLineWidth,1', 'rect,10,31,0,20',
            'setLineWidth,1', 'rect,10,31,100,20',
            'setLineWidth,1', 'rect,10,51,0,24',
            'setLineWidth,1', 'rect,10,51,100,24',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 0, 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide left border of [1,1] cell', function(assert) {
        // TODO:
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawLeftBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,F2,50,23,{baseline:middle}',
            'text,F3,100,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'text,v2_1,50,41,{baseline:middle}',
            'text,v3_1,100,41,{baseline:middle}',
            'text,v1_2,10,63,{baseline:middle}',
            'text,v2_2,50,63,{baseline:middle}',
            'text,v3_2,100,63,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,16',
            'setLineWidth,1', 'rect,50,15,50,16',
            'setLineWidth,1', 'rect,100,15,60,16',
            'setLineWidth,1', 'line,10,31,50,31', 'line,10,31,10,51', 'line,10,51,50,51',
            'setLineWidth,1', 'line,50,31,100,31', 'line,100,31,100,51', 'line,50,51,100,51',
            'setLineWidth,1', 'rect,100,31,60,20',
            'setLineWidth,1', 'rect,10,51,40,24',
            'setLineWidth,1', 'rect,50,51,50,24',
            'setLineWidth,1', 'rect,100,51,60,24',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide right border of [1,1] cell', function(assert) {
        // TODO:
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawRightBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,F2,50,23,{baseline:middle}',
            'text,F3,100,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'text,v2_1,50,41,{baseline:middle}',
            'text,v3_1,100,41,{baseline:middle}',
            'text,v1_2,10,63,{baseline:middle}',
            'text,v2_2,50,63,{baseline:middle}',
            'text,v3_2,100,63,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,16',
            'setLineWidth,1', 'rect,50,15,50,16',
            'setLineWidth,1', 'rect,100,15,60,16',
            'setLineWidth,1', 'rect,10,31,40,20',
            'setLineWidth,1', 'line,50,31,100,31', 'line,50,31,50,51', 'line,50,51,100,51',
            'setLineWidth,1', 'line,100,31,160,31', 'line,160,31,160,51', 'line,100,51,160,51',
            'setLineWidth,1', 'rect,10,51,40,24',
            'setLineWidth,1', 'rect,50,51,50,24',
            'setLineWidth,1', 'rect,100,51,60,24',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide top border of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawTopBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,F2,50,23,{baseline:middle}',
            'text,F3,100,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'text,v2_1,50,41,{baseline:middle}',
            'text,v3_1,100,41,{baseline:middle}',
            'text,v1_2,10,63,{baseline:middle}',
            'text,v2_2,50,63,{baseline:middle}',
            'text,v3_2,100,63,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,16',
            'setLineWidth,1', 'line,50,15,100,15', 'line,50,15,50,31', 'line,100,15,100,31',
            'setLineWidth,1', 'rect,100,15,60,16',
            'setLineWidth,1', 'rect,10,31,40,20',
            'setLineWidth,1', 'line,50,31,50,51', 'line,100,31,100,51', 'line,50,51,100,51',
            'setLineWidth,1', 'rect,100,31,60,20',
            'setLineWidth,1', 'rect,10,51,40,24',
            'setLineWidth,1', 'rect,50,51,50,24',
            'setLineWidth,1', 'rect,100,51,60,24',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide bottom border of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawBottomBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,F2,50,23,{baseline:middle}',
            'text,F3,100,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'text,v2_1,50,41,{baseline:middle}',
            'text,v3_1,100,41,{baseline:middle}',
            'text,v1_2,10,63,{baseline:middle}',
            'text,v2_2,50,63,{baseline:middle}',
            'text,v3_2,100,63,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,16',
            'setLineWidth,1', 'rect,50,15,50,16',
            'setLineWidth,1', 'rect,100,15,60,16',
            'setLineWidth,1', 'rect,10,31,40,20',
            'setLineWidth,1', 'line,50,31,100,31', 'line,50,31,50,51', 'line,100,31,100,51',
            'setLineWidth,1', 'rect,100,31,60,20',
            'setLineWidth,1', 'rect,10,51,40,24',
            'setLineWidth,1', 'line,50,51,50,75', 'line,100,51,100,75', 'line,50,75,100,75',
            'setLineWidth,1', 'rect,100,51,60,24',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide all borders of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawLeftBorder = false;
                pdfCell.drawRightBorder = false;
                pdfCell.drawTopBorder = false;
                pdfCell.drawBottomBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,F2,50,23,{baseline:middle}',
            'text,F3,100,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'text,v2_1,50,41,{baseline:middle}',
            'text,v3_1,100,41,{baseline:middle}',
            'text,v1_2,10,63,{baseline:middle}',
            'text,v2_2,50,63,{baseline:middle}',
            'text,v3_2,100,63,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,16',
            'setLineWidth,1', 'line,50,15,100,15', 'line,50,15,50,31', 'line,100,15,100,31',
            'setLineWidth,1', 'rect,100,15,60,16',
            'setLineWidth,1', 'line,10,31,50,31', 'line,10,31,10,51', 'line,10,51,50,51',
            'setLineWidth,1', 'line,100,31,160,31', 'line,160,31,160,51', 'line,100,51,160,51',
            'setLineWidth,1', 'rect,10,51,40,24',
            'setLineWidth,1', 'line,50,51,50,75', 'line,100,51,100,75', 'line,50,75,100,75',
            'setLineWidth,1', 'rect,100,51,60,24',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide all borders', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,F2,50,23,{baseline:middle}',
            'text,F3,100,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'text,v2_1,50,41,{baseline:middle}',
            'text,v3_1,100,41,{baseline:middle}',
            'text,v1_2,10,63,{baseline:middle}',
            'text,v2_2,50,63,{baseline:middle}',
            'text,v3_2,100,63,{baseline:middle}',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

});

JSPdfMultilineTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfWordWrapTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfStylesTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfBorderColorsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfBandsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfGroupingTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfSummariesTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfVerticalAlignTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfColumnWidthsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
