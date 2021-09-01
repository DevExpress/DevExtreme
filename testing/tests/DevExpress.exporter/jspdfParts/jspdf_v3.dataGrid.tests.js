import $ from 'jquery';
import { jsPDF } from 'jspdf';

import { isFunction, isObject } from 'core/utils/type';

import 'ui/data_grid';
import { exportDataGrid } from 'exporter/jspdf/export_data_grid_3';
import { initializeDxObjectAssign, clearDxObjectAssign } from '../commonParts/objectAssignHelper.js';

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
});
