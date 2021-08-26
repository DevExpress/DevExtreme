import $ from 'jquery';
import { jsPDF } from 'jspdf';

import { isFunction, isObject } from 'core/utils/type';

import 'ui/data_grid';
import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';
import { initializeDxObjectAssign, clearDxObjectAssign } from '../commonParts/objectAssignHelper.js';

import { JSPdfBandsTests } from './jspdf_v2.dataGrid.bands.tests.js';
import { JSPdfGroupingTests } from './jspdf_v2.dataGrid.grouping.tests.js';
import { JSPdfSummariesTests } from './jspdf_v2.dataGrid.summaries.tests.js';
import { JSPdfStylesTests } from './jspdf_v2.dataGrid.styles.tests.js';
import { JSPdfMultilineTests } from './jspdf_v2.dataGrid.multiline.tests.js';
import { JSPdfWordWrapTests } from './jspdf_v2.dataGrid.wordwrap.tests.js';
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
            'text,F1,10,25,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20',
            'text,v1,10,47,{baseline:middle}', 'setLineWidth,1', 'rect,10,35,100,24',
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
            'text,F1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,18.4',
            'text,v1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,100,18.4',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,100,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,100,24',
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
            'text,F1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,18.4',
            'text,v1_1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,100,18.4',
            'text,v1_2,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,100,18.4'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
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
            'text,f1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,f2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,16',
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
            'text,f1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,18.4',
            'text,f2,50,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,18.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,16',
            'text,v1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2,50,41,{baseline:middle}', 'setLineWidth,1', 'rect,50,31,60,20',
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
            'text,F1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,18.4',
            'text,F2,50,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,18.4',
            'text,v1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,40,18.4',
            'text,v2,50,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,50,33.4,60,18.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2_1,50,41,{baseline:middle}', 'setLineWidth,1', 'rect,50,31,60,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
            'text,v2_2,50,63,{baseline:middle}', 'setLineWidth,1', 'rect,50,51,60,24',
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
            'text,F1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,18.4',
            'text,F2,50,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,18.4',
            'text,v1_1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,40,18.4',
            'text,v2_1,50,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,50,33.4,60,18.4',
            'text,v1_2,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,40,18.4',
            'text,v2_2,50,61,{baseline:middle}', 'setLineWidth,1', 'rect,50,51.8,60,18.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,0,16',
            'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,0,20',
            'text,v2_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,100,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,0,24',
            'text,v2_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,100,24',
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,50,16',
            'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,60,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,50,31', 'line,10,31,10,51', 'line,10,51,50,51',
            'text,v2_1,50,41,{baseline:middle}', 'setLineWidth,1', 'line,50,31,100,31', 'line,100,31,100,51', 'line,50,51,100,51',
            'text,v3_1,100,41,{baseline:middle}', 'setLineWidth,1', 'rect,100,31,60,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
            'text,v2_2,50,63,{baseline:middle}', 'setLineWidth,1', 'rect,50,51,50,24',
            'text,v3_2,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,60,24',
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,50,16',
            'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,60,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2_1,50,41,{baseline:middle}', 'setLineWidth,1', 'line,50,31,100,31', 'line,50,31,50,51', 'line,50,51,100,51',
            'text,v3_1,100,41,{baseline:middle}', 'setLineWidth,1', 'line,100,31,160,31', 'line,160,31,160,51', 'line,100,51,160,51',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
            'text,v2_2,50,63,{baseline:middle}', 'setLineWidth,1', 'rect,50,51,50,24',
            'text,v3_2,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,60,24',
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'line,50,15,100,15', 'line,50,15,50,31', 'line,100,15,100,31',
            'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,60,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2_1,50,41,{baseline:middle}', 'setLineWidth,1', 'line,50,31,50,51', 'line,100,31,100,51', 'line,50,51,100,51',
            'text,v3_1,100,41,{baseline:middle}', 'setLineWidth,1', 'rect,100,31,60,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
            'text,v2_2,50,63,{baseline:middle}', 'setLineWidth,1', 'rect,50,51,50,24',
            'text,v3_2,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,60,24',
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,50,16',
            'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,60,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2_1,50,41,{baseline:middle}', 'setLineWidth,1', 'line,50,31,100,31', 'line,50,31,50,51', 'line,100,31,100,51',
            'text,v3_1,100,41,{baseline:middle}', 'setLineWidth,1', 'rect,100,31,60,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
            'text,v2_2,50,63,{baseline:middle}', 'setLineWidth,1', 'line,50,51,50,75', 'line,100,51,100,75', 'line,50,75,100,75',
            'text,v3_2,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,60,24',
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'line,50,15,100,15', 'line,50,15,50,31', 'line,100,15,100,31',
            'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,60,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,50,31', 'line,10,31,10,51', 'line,10,51,50,51',
            'text,v2_1,50,41,{baseline:middle}',
            'text,v3_1,100,41,{baseline:middle}', 'setLineWidth,1', 'line,100,31,160,31', 'line,160,31,160,51', 'line,100,51,160,51',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
            'text,v2_2,50,63,{baseline:middle}', 'setLineWidth,1', 'line,50,51,50,75', 'line,100,51,100,75', 'line,50,75,100,75',
            'text,v3_2,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,60,24',
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

QUnit.module('Table splitting', moduleConfig, () => {

    QUnit.test('Split grid on one page, 1 col', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v2_1') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.tableTopLeft = { x: 60, y: 15 };
            } else if(e.rowCells[0].text === 'v3_1') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2_1,60,27,{baseline:middle}', 'setLineWidth,1', 'rect,60,15,40,24',
            'text,v3_1,60,54,{baseline:middle}', 'setLineWidth,1', 'rect,60,39,40,30',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid on one page, 1 col - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'v2_1') {
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.tableTopLeft = { x: 60, y: 15 };
            }
        };

        const expectedLog = [
            'text,F1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,18.4',
            'text,v1_1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,40,18.4',
            'text,v2_1,60,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,60,15,40,18.4',
            'text,v3_1,60,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,60,33.4,40,18.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid on one page, 1 col - draw table borders', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v2_1') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.tableTopLeft = { x: 60, y: 15 };
            } else if(e.rowCells[0].text === 'v3_1') {
                e.rowHeight = 30;
            }
        };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,36',
            'text,v2_1,60,27,{baseline:middle}',
            'text,v3_1,60,54,{baseline:middle}',
            'setLineWidth,1', 'rect,60,15,40,54'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40 ], onRowExporting, customizeCell, drawTableBorder: true }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid on different pages, 1 col', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v2_1') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableTopLeft = { x: 10, y: 10 };
            } else if(e.rowCells[0].text === 'v3_1') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'text,F1,10,808,{baseline:middle}', 'setLineWidth,1', 'rect,10,800,40,16',
            'text,v1_1,10,826,{baseline:middle}', 'setLineWidth,1', 'rect,10,816,40,20',
            'addPage,',
            'text,v2_1,10,22,{baseline:middle}', 'setLineWidth,1', 'rect,10,10,40,24',
            'text,v3_1,10,49,{baseline:middle}', 'setLineWidth,1', 'rect,10,34,40,30',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 800 }, columnWidths: [ 40 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid on different pages, 1 col - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'v2_1') {
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableTopLeft = { x: 10, y: 10 };
            }
        };

        const expectedLog = [
            'text,F1,10,809.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,800,40,18.4',
            'text,v1_1,10,827.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,818.4,40,18.4',
            'addPage,',
            'text,v2_1,10,19.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,10,40,18.4',
            'text,v3_1,10,37.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,28.4,40,18.4'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 800 }, columnWidths: [ 40 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid on different pages, 1 col - draw table borders', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v2_1') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableTopLeft = { x: 10, y: 10 };
            } else if(e.rowCells[0].text === 'v3_1') {
                e.rowHeight = 30;
            }
        };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };

        const expectedLog = [
            'text,F1,10,808,{baseline:middle}',
            'text,v1_1,10,826,{baseline:middle}',
            'setLineWidth,1', 'rect,10,800,40,36',
            'addPage,',
            'text,v2_1,10,22,{baseline:middle}',
            'text,v3_1,10,49,{baseline:middle}',
            'setLineWidth,1', 'rect,10,10,40,54'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 800 }, columnWidths: [ 40 ], onRowExporting, customizeCell, drawTableBorder: true }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by columns - 2 cols - hide all borders', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'F1' }, { caption: 'F2' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 15, y: 20 }
        }];

        const customizeCell = ({ pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };
        const onRowExporting = (e) => {
            e.rowHeight = 16;
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'addPage,',
            'text,F2,15,28,{baseline:middle}',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50 ], customizeCell, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by columns - 2 cols - hide all borders - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'F1' }, { caption: 'F2' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 15, y: 20 }
        }];

        const customizeCell = ({ pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };
        const onRowExporting = () => { };

        const expectedLog = [
            'text,F1,10,24.2,{baseline:middle}',
            'addPage,',
            'text,F2,15,29.2,{baseline:middle}',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50 ], customizeCell, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by columns - 3 cols - 2 rows - hide all borders', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

        const customizeCell = ({ pdfCell }) => {
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
            'text,F1,10,28,{baseline:middle}',
            'text,v1_1,10,46,{baseline:middle}',
            'text,v1_2,10,68,{baseline:middle}',
            'addPage,',
            'text,F2,11,29,{baseline:middle}',
            'text,v2_1,11,47,{baseline:middle}',
            'text,v2_2,11,69,{baseline:middle}',
            'addPage,',
            'text,F3,12,30,{baseline:middle}',
            'text,v3_1,12,48,{baseline:middle}',
            'text,v3_2,12,70,{baseline:middle}',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by columns - 3 cols - 2 rows - hide all borders - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

        const customizeCell = ({ pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };

        const expectedLog = [
            'text,F1,10,29.2,{baseline:middle}',
            'text,v1_1,10,47.6,{baseline:middle}',
            'text,v1_2,10,66,{baseline:middle}',
            'addPage,',
            'text,F2,11,30.2,{baseline:middle}',
            'text,v2_1,11,48.6,{baseline:middle}',
            'text,v2_2,11,67,{baseline:middle}',
            'addPage,',
            'text,F3,12,31.2,{baseline:middle}',
            'text,v3_1,12,49.6,{baseline:middle}',
            'text,v3_2,12,68,{baseline:middle}'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting: () => {}, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by columns - 3 cols - 2 rows - show cell borders only', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

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
            'text,F1,10,28,{baseline:middle}', 'setLineWidth,1', 'rect,10,20,40,16',
            'text,v1_1,10,46,{baseline:middle}', 'setLineWidth,1', 'rect,10,36,40,20',
            'text,v1_2,10,68,{baseline:middle}', 'setLineWidth,1', 'rect,10,56,40,24',
            'addPage,',
            'text,F2,11,29,{baseline:middle}', 'setLineWidth,1', 'rect,11,21,50,16',
            'text,v2_1,11,47,{baseline:middle}', 'setLineWidth,1', 'rect,11,37,50,20',
            'text,v2_2,11,69,{baseline:middle}', 'setLineWidth,1', 'rect,11,57,50,24',
            'addPage,',
            'text,F3,12,30,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,60,16',
            'text,v3_1,12,48,{baseline:middle}', 'setLineWidth,1', 'rect,12,38,60,20',
            'text,v3_2,12,70,{baseline:middle}', 'setLineWidth,1', 'rect,12,58,60,24'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by columns - 3 cols - 2 rows - show table border only', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

        const customizeCell = ({ pdfCell }) => {
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
            'text,F1,10,28,{baseline:middle}',
            'text,v1_1,10,46,{baseline:middle}',
            'text,v1_2,10,68,{baseline:middle}',
            'setLineWidth,1', 'rect,10,20,40,60',
            'addPage,',
            'text,F2,11,29,{baseline:middle}',
            'text,v2_1,11,47,{baseline:middle}',
            'text,v2_2,11,69,{baseline:middle}',
            'setLineWidth,1', 'rect,11,21,50,60',
            'addPage,',
            'text,F3,12,30,{baseline:middle}',
            'text,v3_1,12,48,{baseline:middle}',
            'text,v3_2,12,70,{baseline:middle}',
            'setLineWidth,1', 'rect,12,22,60,60'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting, splitToTablesByColumns, drawTableBorder: true }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by columns - 3 cols - 2 rows - show cell borders with table border', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

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
            'text,F1,10,28,{baseline:middle}', 'setLineWidth,1', 'rect,10,20,40,16',
            'text,v1_1,10,46,{baseline:middle}', 'setLineWidth,1', 'rect,10,36,40,20',
            'text,v1_2,10,68,{baseline:middle}', 'setLineWidth,1', 'rect,10,56,40,24',
            'setLineWidth,1', 'rect,10,20,40,60',
            'addPage,',
            'text,F2,11,29,{baseline:middle}', 'setLineWidth,1', 'rect,11,21,50,16',
            'text,v2_1,11,47,{baseline:middle}', 'setLineWidth,1', 'rect,11,37,50,20',
            'text,v2_2,11,69,{baseline:middle}', 'setLineWidth,1', 'rect,11,57,50,24',
            'setLineWidth,1', 'rect,11,21,50,60',
            'addPage,',
            'text,F3,12,30,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,60,16',
            'text,v3_1,12,48,{baseline:middle}', 'setLineWidth,1', 'rect,12,38,60,20',
            'text,v3_2,12,70,{baseline:middle}', 'setLineWidth,1', 'rect,12,58,60,24',
            'setLineWidth,1', 'rect,12,22,60,60'
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], onRowExporting, splitToTablesByColumns, drawTableBorder: true }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by columns - 3 cols - 2 rows - show cell borders - hide top border of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

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
            'text,F1,10,28,{baseline:middle}', 'setLineWidth,1', 'rect,10,20,40,16',
            'text,v1_1,10,46,{baseline:middle}', 'setLineWidth,1', 'rect,10,36,40,20',
            'text,v1_2,10,68,{baseline:middle}', 'setLineWidth,1', 'rect,10,56,40,24',
            'addPage,',
            'text,F2,11,29,{baseline:middle}', 'setLineWidth,1', 'line,11,21,61,21', 'line,11,21,11,37', 'line,61,21,61,37',
            'text,v2_1,11,47,{baseline:middle}', 'setLineWidth,1', 'line,11,37,11,57', 'line,61,37,61,57', 'line,11,57,61,57',
            'text,v2_2,11,69,{baseline:middle}', 'setLineWidth,1', 'rect,11,57,50,24',
            'addPage,',
            'text,F3,12,30,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,60,16',
            'text,v3_1,12,48,{baseline:middle}', 'setLineWidth,1', 'rect,12,38,60,20',
            'text,v3_2,12,70,{baseline:middle}', 'setLineWidth,1', 'rect,12,58,60,24',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by columns - 3 cols - 2 rows - show cell borders - hide left border of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

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
            'text,F1,10,28,{baseline:middle}', 'setLineWidth,1', 'rect,10,20,40,16',
            'text,v1_1,10,46,{baseline:middle}', 'setLineWidth,1', 'rect,10,36,40,20',
            'text,v1_2,10,68,{baseline:middle}', 'setLineWidth,1', 'rect,10,56,40,24',
            'addPage,',
            'text,F2,11,29,{baseline:middle}', 'setLineWidth,1', 'rect,11,21,50,16',
            'text,v2_1,11,47,{baseline:middle}', 'setLineWidth,1', 'line,11,37,61,37', 'line,61,37,61,57', 'line,11,57,61,57',
            'text,v2_2,11,69,{baseline:middle}', 'setLineWidth,1', 'rect,11,57,50,24',
            'addPage,',
            'text,F3,12,30,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,60,16',
            'text,v3_1,12,48,{baseline:middle}', 'setLineWidth,1', 'rect,12,38,60,20',
            'text,v3_2,12,70,{baseline:middle}', 'setLineWidth,1', 'rect,12,58,60,24',
        ];
        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by rows and by columns - 3 cols - 2 rows - show cell borders with table border', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }, { f1: 'v1_3', f2: 'v2_3', f3: 'v3_3' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

        const onRowExporting = (e) => {
            // if(rowIndex === 2) { // TODO: change to something like "if(row.valuesByColumn["f1"] === "v1_2")"
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableTopLeft = { x: 10, y: 56 };
                e.drawNewTableFromThisRow.splitToTablesByColumns = [{
                    columnIndex: 1,
                    tableTopLeft: { x: 11, y: 57 }
                }, {
                    columnIndex: 2,
                    tableTopLeft: { x: 12, y: 58 }
                }];
            } else if(e.rowCells[0].text === 'v1_3') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'text,F1,10,28,{baseline:middle}', 'setLineWidth,1', 'rect,10,20,40,16',
            'text,v1_1,10,46,{baseline:middle}', 'setLineWidth,1', 'rect,10,36,40,20',
            'setLineWidth,1', 'rect,10,20,40,36',
            'addPage,',
            'text,F2,11,29,{baseline:middle}', 'setLineWidth,1', 'rect,11,21,50,16',
            'text,v2_1,11,47,{baseline:middle}', 'setLineWidth,1', 'rect,11,37,50,20',
            'setLineWidth,1', 'rect,11,21,50,36',
            'addPage,',
            'text,F3,12,30,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,60,16',
            'text,v3_1,12,48,{baseline:middle}', 'setLineWidth,1', 'rect,12,38,60,20',
            'setLineWidth,1', 'rect,12,22,60,36',
            'addPage,',
            'text,v1_2,10,68,{baseline:middle}', 'setLineWidth,1', 'rect,10,56,40,24',
            'text,v1_3,10,95,{baseline:middle}', 'setLineWidth,1', 'rect,10,80,40,30',
            'setLineWidth,1', 'rect,10,56,40,54',
            'addPage,',
            'text,v2_2,11,69,{baseline:middle}', 'setLineWidth,1', 'rect,11,57,50,24',
            'text,v2_3,11,96,{baseline:middle}', 'setLineWidth,1', 'rect,11,81,50,30',
            'setLineWidth,1', 'rect,11,57,50,54',
            'addPage,',
            'text,v3_2,12,70,{baseline:middle}', 'setLineWidth,1', 'rect,12,58,60,24',
            'text,v3_3,12,97,{baseline:middle}', 'setLineWidth,1', 'rect,12,82,60,30',
            'setLineWidth,1', 'rect,12,58,60,54',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], onRowExporting, splitToTablesByColumns, drawTableBorder: true }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by rows and by columns - 3 cols - 2 rows - show cell borders with table border - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }, { f1: 'v1_3', f2: 'v2_3', f3: 'v3_3' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

        const expectedLog = [
            'text,F1,10,29.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,20,40,18.4',
            'text,v1_1,10,47.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,38.4,40,18.4',
            'text,v1_2,10,66,{baseline:middle}', 'setLineWidth,1', 'rect,10,56.8,40,18.4',
            'text,v1_3,10,84.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,75.2,40,18.4',
            'setLineWidth,1', 'rect,10,20,40,73.6',
            'addPage,',
            'text,F2,11,30.2,{baseline:middle}', 'setLineWidth,1', 'rect,11,21,50,18.4',
            'text,v2_1,11,48.6,{baseline:middle}', 'setLineWidth,1', 'rect,11,39.4,50,18.4',
            'text,v2_2,11,67,{baseline:middle}', 'setLineWidth,1', 'rect,11,57.8,50,18.4',
            'text,v2_3,11,85.4,{baseline:middle}', 'setLineWidth,1', 'rect,11,76.2,50,18.4',
            'setLineWidth,1', 'rect,11,21,50,73.6',
            'addPage,',
            'text,F3,12,31.2,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,60,18.4',
            'text,v3_1,12,49.6,{baseline:middle}', 'setLineWidth,1', 'rect,12,40.4,60,18.4',
            'text,v3_2,12,68,{baseline:middle}', 'setLineWidth,1', 'rect,12,58.8,60,18.4',
            'text,v3_3,12,86.4,{baseline:middle}', 'setLineWidth,1', 'rect,12,77.2,60,18.4',
            'setLineWidth,1', 'rect,12,22,60,73.6'
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], onRowExporting: () => {}, splitToTablesByColumns, drawTableBorder: true }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by rows and by columns - 3 cols - 2 rows - show cell borders - hide top border of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }, { f1: 'v1_3', f2: 'v2_3', f3: 'v3_3' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableTopLeft = { x: 12, y: 22 };
                e.drawNewTableFromThisRow.splitToTablesByColumns = [{
                    columnIndex: 1,
                    tableTopLeft: { x: 13, y: 23 }
                }, {
                    columnIndex: 2,
                    tableTopLeft: { x: 14, y: 24 }
                }];
            } else if(e.rowCells[0].text === 'v1_3') {
                e.rowHeight = 30;
            }
        };
        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawTopBorder = false;
            }
        };

        const expectedLog = [
            'text,F1,10,28,{baseline:middle}', 'setLineWidth,1', 'rect,10,20,40,16',
            'text,v1_1,10,46,{baseline:middle}', 'setLineWidth,1', 'rect,10,36,40,20',
            'addPage,',
            'text,F2,11,29,{baseline:middle}', 'setLineWidth,1', 'line,11,21,61,21', 'line,11,21,11,37', 'line,61,21,61,37',
            'text,v2_1,11,47,{baseline:middle}', 'setLineWidth,1', 'line,11,37,11,57', 'line,61,37,61,57', 'line,11,57,61,57',
            'addPage,',
            'text,F3,12,30,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,60,16',
            'text,v3_1,12,48,{baseline:middle}', 'setLineWidth,1', 'rect,12,38,60,20',
            'addPage,',
            'text,v1_2,12,34,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,40,24',
            'text,v1_3,12,61,{baseline:middle}', 'setLineWidth,1', 'rect,12,46,40,30',
            'addPage,',
            'text,v2_2,13,35,{baseline:middle}', 'setLineWidth,1', 'rect,13,23,50,24',
            'text,v2_3,13,62,{baseline:middle}', 'setLineWidth,1', 'rect,13,47,50,30',
            'addPage,',
            'text,v3_2,14,36,{baseline:middle}', 'setLineWidth,1', 'rect,14,24,60,24',
            'text,v3_3,14,63,{baseline:middle}', 'setLineWidth,1', 'rect,14,48,60,30',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid by rows and by columns - 3 cols - 2 rows - show cell borders - hide left border of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }, { f1: 'v1_3', f2: 'v2_3', f3: 'v3_3' }]
        });

        const splitToTablesByColumns = [{
            columnIndex: 1,
            tableTopLeft: { x: 11, y: 21 }
        }, {
            columnIndex: 2,
            tableTopLeft: { x: 12, y: 22 }
        }];

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableTopLeft = { x: 12, y: 22 };
                e.drawNewTableFromThisRow.splitToTablesByColumns = [{
                    columnIndex: 1,
                    tableTopLeft: { x: 13, y: 23 }
                }, {
                    columnIndex: 2,
                    tableTopLeft: { x: 14, y: 24 }
                }];
            } else if(e.rowCells[0].text === 'v1_3') {
                e.rowHeight = 30;
            }
        };
        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawLeftBorder = false;
            }
        };

        const expectedLog = [
            'text,F1,10,28,{baseline:middle}', 'setLineWidth,1', 'rect,10,20,40,16',
            'text,v1_1,10,46,{baseline:middle}', 'setLineWidth,1', 'rect,10,36,40,20',
            'addPage,',
            'text,F2,11,29,{baseline:middle}', 'setLineWidth,1', 'rect,11,21,50,16',
            'text,v2_1,11,47,{baseline:middle}', 'setLineWidth,1', 'line,11,37,61,37', 'line,61,37,61,57', 'line,11,57,61,57',
            'addPage,',
            'text,F3,12,30,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,60,16',
            'text,v3_1,12,48,{baseline:middle}', 'setLineWidth,1', 'rect,12,38,60,20',
            'addPage,',
            'text,v1_2,12,34,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,40,24',
            'text,v1_3,12,61,{baseline:middle}', 'setLineWidth,1', 'rect,12,46,40,30',
            'addPage,',
            'text,v2_2,13,35,{baseline:middle}', 'setLineWidth,1', 'rect,13,23,50,24',
            'text,v2_3,13,62,{baseline:middle}', 'setLineWidth,1', 'rect,13,47,50,30',
            'addPage,',
            'text,v3_2,14,36,{baseline:middle}', 'setLineWidth,1', 'rect,14,24,60,24',
            'text,v3_3,14,63,{baseline:middle}', 'setLineWidth,1', 'rect,14,48,60,30',
        ];

        exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 20 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

});

JSPdfBandsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfGroupingTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfSummariesTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfStylesTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfMultilineTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfWordWrapTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
