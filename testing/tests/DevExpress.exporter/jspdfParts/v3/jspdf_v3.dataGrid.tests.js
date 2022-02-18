import $ from 'jquery';
import { jsPDF } from 'jspdf';

import { isFunction, isObject, isDefined } from 'core/utils/type';
import { extend } from 'core/utils//extend';

import 'ui/data_grid';
import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { initializeDxObjectAssign, clearDxObjectAssign } from '../../commonParts/objectAssignHelper.js';

import { JSPdfMultilineTests } from './jspdf_v3.dataGrid.multiline.tests.js';
import { JSPdfWordWrapTests } from './jspdf_v3.dataGrid.wordwrap.tests.js';
import { JSPdfStylesTests } from './jspdf_v3.dataGrid.styles.tests.js';
import { JSPdfBorderColorsTests } from './jspdf_v3.dataGrid.borderColors.tests.js';
import { JSPdfBorderWidthsTests } from './jspdf_v3.dataGrid.borderWidths.tests.js';
import { JSPdfBandsTests } from './jspdf_v3.dataGrid.bands.tests.js';
import { JSPdfGroupingTests } from './jspdf_v3.dataGrid.grouping.tests.js';
import { JSPdfSummariesTests } from './jspdf_v3.dataGrid.summaries.tests.js';
import { JSPdfVerticalAlignTests } from './jspdf_v3.dataGrid.verticalAlign.tests.js';
import { JSPdfHorizontalAlignTests } from './jspdf_v3.dataGrid.horizontalAlign.tests.js';
import { JSPdfPageMarginsTests } from './jspdf_v3.dataGrid.pageMargin.tests.js';
import { JSPdfColumnWidthsTests } from './jspdf_v3.dataGrid.columnAutoWidth.tests.js';
import { JSPdfCustomDrawCellTests } from './jspdf_v3.dataGrid.customDrawCell.tests.js';
import { JSPdfSplittingTests } from './jspdf_v3.dataGrid.splitting.tests.js';
import { JSPdfMeasureUnitsTests } from './jspdf_v3.dataGrid.measureUnits.tests.js';
import { JSPdfColumnDataTypesTests } from './jspdf_v3.dataGrid.columnDataTypes.tests.js';
import { JSPdfColumnDataFormatsTests } from './jspdf_v3.dataGrid.columnDataFormats.tests.js';

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

function createMockPdfDoc(options) {
    const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
    const unit = isDefined(options) && isDefined(options.unit)
        ? options.init
        : 'pt';
    const pdfOptions = extend(options || {}, { unit });
    const result = _jsPDF(pdfOptions);
    result.__log = [];

    result.__logOptions = { textOptions: {} };

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
        if(this.__logOptions.textOptions === false) {
            arguments[3] = undefined;
        } else if(this.__logOptions.textOptions.hAlign !== true && arguments.length >= 3 && isDefined(arguments[3]) && arguments[3].align === 'left') {
            delete arguments[3].align;
        }
        this.__log.push('text,' + argumentsToString.apply(null, arguments));
        this.__text.apply(this, arguments);
    };

    result.__moveTo = result.moveTo;
    result.moveTo = function() {
        this.__log.push('moveTo,' + argumentsToString.apply(null, arguments));
        this.__moveTo.apply(this, arguments);
    };

    result.__lineTo = result.lineTo;
    result.lineTo = function() {
        this.__log.push('lineTo,' + argumentsToString.apply(null, arguments));
        this.__lineTo.apply(this, arguments);
    };

    result.__clip = result.clip;
    result.clip = function() {
        this.__log.push('clip,' + argumentsToString.apply(null, arguments));
        this.__clip.apply(this, arguments);
    };

    result.__discardPath = result.discardPath;
    result.discardPath = function() {
        this.__log.push('discardPath,' + argumentsToString.apply(null, arguments));
        this.__discardPath.apply(this, arguments);
    };

    result.__saveGraphicsState = result.saveGraphicsState;
    result.saveGraphicsState = function() {
        this.__log.push('saveGraphicsState,' + argumentsToString.apply(null, arguments));
        this.__saveGraphicsState.apply(this, arguments);
    };

    result.__restoreGraphicsState = result.restoreGraphicsState;
    result.restoreGraphicsState = function() {
        this.__log.push('restoreGraphicsState,' + argumentsToString.apply(null, arguments));
        this.__restoreGraphicsState.apply(this, arguments);
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,0,0',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const customizeCell = () => {
            assert.fail('customizeCell should not be called');
        };
        const onRowExporting = () => {
            assert.fail('onRowExporting should not be called');
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, customizeCell, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,67.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,65,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,62.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,11.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,16.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,11.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,16.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65,{baseline:middle}',
            'setFontSize,16',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell, onRowExporting, drawTableBorder: false }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,87,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setDrawColor,#979797',
            'rect,50,75,100,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setDrawColor,#979797',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setDrawColor,#979797',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,16',
            'setDrawColor,#979797',
            'rect,50,71,100,20',
            'setDrawColor,#979797',
            'rect,50,91,100,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,87.25,{baseline:middle}',
            'text,v1_2,55,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setDrawColor,#979797',
            'rect,50,76.5,100,21.5',
            'setDrawColor,#979797',
            'rect,50,98,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,87.25,{baseline:middle}',
            'text,v1_2,55,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setDrawColor,#979797',
            'rect,50,76.5,100,21.5',
            'setDrawColor,#979797',
            'rect,50,98,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,f2,95,63,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'setDrawColor,#979797',
            'rect,90,55,60,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65.75,{baseline:middle}',
            'setTextColor,#979797',
            'text,f2,95,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,21.5',
            'setDrawColor,#979797',
            'rect,90,55,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,70.75,{baseline:middle}',
            'setTextColor,#979797',
            'text,f2,100,70.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,31.5',
            'setDrawColor,#979797',
            'rect,90,55,60,31.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,81,{baseline:middle}',
            'text,v2,95,81,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'setDrawColor,#979797',
            'rect,90,55,60,16',
            'setDrawColor,#979797',
            'rect,50,71,40,20',
            'setDrawColor,#979797',
            'rect,90,71,60,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,87.25,{baseline:middle}',
            'text,v2,95,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,21.5',
            'setDrawColor,#979797',
            'rect,90,55,60,21.5',
            'setDrawColor,#979797',
            'rect,50,76.5,40,21.5',
            'setDrawColor,#979797',
            'rect,90,76.5,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,70.75,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,100,70.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,102.25,{baseline:middle}',
            'text,v2,100,102.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,31.5',
            'setDrawColor,#979797',
            'rect,90,55,60,31.5',
            'setDrawColor,#979797',
            'rect,50,86.5,40,31.5',
            'setDrawColor,#979797',
            'rect,90,86.5,60,31.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'setDrawColor,#979797',
            'rect,90,55,60,16',
            'setDrawColor,#979797',
            'rect,50,71,40,20',
            'setDrawColor,#979797',
            'rect,90,71,60,20',
            'setDrawColor,#979797',
            'rect,50,91,40,24',
            'setDrawColor,#979797',
            'rect,90,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,87.25,{baseline:middle}',
            'text,v2_1,95,87.25,{baseline:middle}',
            'text,v1_2,55,108.75,{baseline:middle}',
            'text,v2_2,95,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,21.5',
            'setDrawColor,#979797',
            'rect,90,55,60,21.5',
            'setDrawColor,#979797',
            'rect,50,76.5,40,21.5',
            'setDrawColor,#979797',
            'rect,90,76.5,60,21.5',
            'setDrawColor,#979797',
            'rect,50,98,40,21.5',
            'setDrawColor,#979797',
            'rect,90,98,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,70.75,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,100,70.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,102.25,{baseline:middle}',
            'text,v2_1,100,102.25,{baseline:middle}',
            'text,v1_2,55,133.75,{baseline:middle}',
            'text,v2_2,100,133.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,31.5',
            'setDrawColor,#979797',
            'rect,90,55,60,31.5',
            'setDrawColor,#979797',
            'rect,50,86.5,40,31.5',
            'setDrawColor,#979797',
            'rect,90,86.5,60,31.5',
            'setDrawColor,#979797',
            'rect,50,118,40,31.5',
            'setDrawColor,#979797',
            'rect,90,118,60,31.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,...,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,55,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,...,55,81,{baseline:middle}',
            'text,v2_1,55,81,{baseline:middle}',
            'text,...,55,103,{baseline:middle}',
            'text,v2_2,55,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,0,16',
            'setDrawColor,#979797',
            'rect,50,55,100,16',
            'setDrawColor,#979797',
            'rect,50,71,0,20',
            'setDrawColor,#979797',
            'rect,50,71,100,20',
            'setDrawColor,#979797',
            'rect,50,91,0,24',
            'setDrawColor,#979797',
            'rect,50,91,100,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 0, 100 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'setDrawColor,#979797',
            'rect,90,55,50,16',
            'setDrawColor,#979797',
            'rect,140,55,60,16',
            'setDrawColor,#979797',
            'line,50,71,90,71',
            'line,50,71,50,91',
            'line,50,91,90,91',
            'setDrawColor,#979797',
            'line,90,71,140,71',
            'line,140,71,140,91',
            'line,90,91,140,91',
            'setDrawColor,#979797',
            'rect,140,71,60,20',
            'setDrawColor,#979797',
            'rect,50,91,40,24',
            'setDrawColor,#979797',
            'rect,90,91,50,24',
            'setDrawColor,#979797',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'setDrawColor,#979797',
            'rect,90,55,50,16',
            'setDrawColor,#979797',
            'rect,140,55,60,16',
            'setDrawColor,#979797',
            'rect,50,71,40,20',
            'setDrawColor,#979797',
            'line,90,71,140,71',
            'line,90,71,90,91',
            'line,90,91,140,91',
            'setDrawColor,#979797',
            'line,140,71,200,71',
            'line,200,71,200,91',
            'line,140,91,200,91',
            'setDrawColor,#979797',
            'rect,50,91,40,24',
            'setDrawColor,#979797',
            'rect,90,91,50,24',
            'setDrawColor,#979797',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'setDrawColor,#979797',
            'line,90,55,140,55',
            'line,90,55,90,71',
            'line,140,55,140,71',
            'setDrawColor,#979797',
            'rect,140,55,60,16',
            'setDrawColor,#979797',
            'rect,50,71,40,20',
            'setDrawColor,#979797',
            'line,90,71,90,91',
            'line,140,71,140,91',
            'line,90,91,140,91',
            'setDrawColor,#979797',
            'rect,140,71,60,20',
            'setDrawColor,#979797',
            'rect,50,91,40,24',
            'setDrawColor,#979797',
            'rect,90,91,50,24',
            'setDrawColor,#979797',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'setDrawColor,#979797',
            'rect,90,55,50,16',
            'setDrawColor,#979797',
            'rect,140,55,60,16',
            'setDrawColor,#979797',
            'rect,50,71,40,20',
            'setDrawColor,#979797',
            'line,90,71,140,71',
            'line,90,71,90,91',
            'line,140,71,140,91',
            'setDrawColor,#979797',
            'rect,140,71,60,20',
            'setDrawColor,#979797',
            'rect,50,91,40,24',
            'setDrawColor,#979797',
            'line,90,91,90,115',
            'line,140,91,140,115',
            'line,90,115,140,115',
            'setDrawColor,#979797',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'setDrawColor,#979797',
            'line,90,55,140,55',
            'line,90,55,90,71',
            'line,140,55,140,71',
            'setDrawColor,#979797',
            'rect,140,55,60,16',
            'setDrawColor,#979797',
            'line,50,71,90,71',
            'line,50,71,50,91',
            'line,50,91,90,91',
            'setDrawColor,#979797',
            'line,140,71,200,71',
            'line,200,71,200,91',
            'line,140,91,200,91',
            'setDrawColor,#979797',
            'rect,50,91,40,24',
            'setDrawColor,#979797',
            'line,90,91,90,115',
            'line,140,91,140,115',
            'line,90,115,140,115',
            'setDrawColor,#979797',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#979797',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setFontSize,16'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
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
JSPdfBorderWidthsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfBandsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfGroupingTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfSummariesTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfVerticalAlignTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfHorizontalAlignTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfColumnWidthsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfPageMarginsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfCustomDrawCellTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfSplittingTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfMeasureUnitsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfColumnDataTypesTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfColumnDataFormatsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
