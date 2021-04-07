import $ from 'jquery';
import { jsPDF } from 'jspdf';

import { isFunction, isObject } from 'core/utils/type';

import 'ui/data_grid/ui.data_grid';
import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';
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

QUnit.module('exportDataGrid', moduleConfig, () => {

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
        options.loadingTimeout = undefined;
        return $('#dataGrid').dxDataGrid(options).dxDataGrid('instance');
    }

    QUnit.test('Required arguments', function(assert) {
        // TODO
        assert.ok(true);
    });

    QUnit.test('Empty', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({});

        const expectedLog = [
            'setLineWidth,1', 'rect,10,15,100,20',
        ];

        const onCellExporting = () => {
            assert.fail('onCellExporting should not be called');
        };
        const onRowExporting = () => {
            assert.fail('onRowExporting should not be called');
        };

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 20 }, onCellExporting, onRowExporting }).then(() => {
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

        const rect = { x: 10, y: 15 };
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = rect;
        };
        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const expectedLog = [
            'text,f1,10,25,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 20 }, columnWidths: [ 100 ], onCellExporting, onRowExporting }).then(() => {
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

        const rect = { x: 10, y: 15 };
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = rect;
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

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 20 }, columnWidths: [ 100 ], onCellExporting, onRowExporting, drawTableBorder: false }).then(() => {
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

        let cellIndex = 0;
        const cellRects = [
            { x: 10, y: 15 },
            { x: 10, y: 35 },
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = cellRects[cellIndex];
            cellIndex++;
        };
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

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 44 }, columnWidths: [ 100 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const cellRects = [
            { x: 10, y: 15 },
            { x: 10, y: 31 },
            { x: 10, y: 51 },
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = cellRects[cellIndex];
            cellIndex++;
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
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,100,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,100,24',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 60 }, columnWidths: [ 100 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 },
            { x: 50, y: 15 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
        };
        const onRowExporting = (e) => {
            e.rowHeight = 16;
        };

        const expectedLog = [
            'text,f1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,f2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,16',
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 16 }, columnWidths: [ 40, 60 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 },
            { x: 50, y: 15 },
            { x: 10, y: 31 },
            { x: 50, y: 31 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
        };
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 36 }, columnWidths: [ 40, 60 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 },
            { x: 50, y: 15 },
            { x: 10, y: 31 },
            { x: 50, y: 31 },
            { x: 10, y: 51 },
            { x: 50, y: 51 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2_1,50,41,{baseline:middle}', 'setLineWidth,1', 'rect,50,31,60,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
            'text,v2_2,50,63,{baseline:middle}', 'setLineWidth,1', 'rect,50,51,60,24',
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 60 }, columnWidths: [ 40, 60 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 }, { x: 50, y: 15 }, { x: 100, y: 15 },
            { x: 10, y: 31 }, { x: 50, y: 31 }, { x: 100, y: 31 },
            { x: 10, y: 51 }, { x: 50, y: 51 }, { x: 100, y: 51 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawLeftBorder = false;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 }, { x: 50, y: 15 }, { x: 100, y: 15 },
            { x: 10, y: 31 }, { x: 50, y: 31 }, { x: 100, y: 31 },
            { x: 10, y: 51 }, { x: 50, y: 51 }, { x: 100, y: 51 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawRightBorder = false;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 }, { x: 50, y: 15 }, { x: 100, y: 15 },
            { x: 10, y: 31 }, { x: 50, y: 31 }, { x: 100, y: 31 },
            { x: 10, y: 51 }, { x: 50, y: 51 }, { x: 100, y: 51 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawTopBorder = false;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 }, { x: 50, y: 15 }, { x: 100, y: 15 },
            { x: 10, y: 31 }, { x: 50, y: 31 }, { x: 100, y: 31 },
            { x: 10, y: 51 }, { x: 50, y: 51 }, { x: 100, y: 51 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawBottomBorder = false;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 }, { x: 50, y: 15 }, { x: 100, y: 15 },
            { x: 10, y: 31 }, { x: 50, y: 31 }, { x: 100, y: 31 },
            { x: 10, y: 51 }, { x: 50, y: 51 }, { x: 100, y: 51 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawLeftBorder = false;
                pdfCell.drawRightBorder = false;
                pdfCell.drawTopBorder = false;
                pdfCell.drawBottomBorder = false;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting }).then(() => {
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

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 }, { x: 50, y: 15 }, { x: 100, y: 15 },
            { x: 10, y: 31 }, { x: 50, y: 31 }, { x: 100, y: 31 },
            { x: 10, y: 51 }, { x: 50, y: 51 }, { x: 100, y: 51 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Bands, [band[f1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f1' },
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1' }],
        });

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15 },
            { x: 10, y: 31 },
            { x: 10, y: 51 },
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'Band1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'f1_1') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,16',
            'text,F1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,100,20',
            'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,100,24',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 60 }, columnWidths: [ 100 ], onCellExporting, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Bands, [f1, band[f2, f3]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                {
                    caption: 'Band1',
                    columns: [
                        'f2',
                        'f3',
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15, h: 36 }, { x: 100, y: 15, w: 110 }, null, // TODO: remove "h: 36" and "w: 110"
            null, { x: 100, y: 31 }, { x: 150, y: 31 },
            { x: 10, y: 51 }, { x: 100, y: 51 }, { x: 150, y: 51 },
        ];
        const onCellExporting = ({ pdfCell }) => {
            if(pdfCellRects[cellIndex] === null) {
                pdfCell.skip = true; // TODO: pdfCell.isMerged?
            } else {
                pdfCell.rect = pdfCellRects[cellIndex];
            }
            cellIndex++;
        };
        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F1') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_1') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,36',
            'text,Band1,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,110,16',
            'text,F2,100,41,{baseline:middle}', 'setLineWidth,1', 'rect,100,31,50,20',
            'text,F3,150,41,{baseline:middle}', 'setLineWidth,1', 'rect,150,31,60,20',
            'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,90,24',
            'text,f2_1,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,50,24',
            'text,f3_1,150,63,{baseline:middle}', 'setLineWidth,1', 'rect,150,51,60,24',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 200, h: 60 }, columnWidths: [ 90, 50, 60 ], onCellExporting, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Split grid on one page, 1 col', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
        });

        const pdfCellRects = [
            { x: 10, y: 15 },
            { x: 10, y: 31 },
            { x: 60, y: 15 },
            { x: 60, y: 39 }
        ];

        let cellIndex = 0;
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v2_1') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.tableRect = { x: 60, y: 15, w: 40, h: 54 };
            } else if(e.rowCells[0].text === 'v3_1') {
                e.rowHeight = 30;
            }
        };
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2_1,60,27,{baseline:middle}', 'setLineWidth,1', 'rect,60,15,40,24',
            'text,v3_1,60,54,{baseline:middle}', 'setLineWidth,1', 'rect,60,39,40,30',
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 40, h: 36 }, columnWidths: [ 40 ], onRowExporting, onCellExporting }).then(() => {
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

        const pdfCellRects = [
            { x: 10, y: 15 },
            { x: 10, y: 31 },
            { x: 60, y: 15 },
            { x: 60, y: 39 }
        ];

        let cellIndex = 0;
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v2_1') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.tableRect = { x: 60, y: 15, w: 40, h: 54 };
            } else if(e.rowCells[0].text === 'v3_1') {
                e.rowHeight = 30;
            }
        };
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
            cellIndex++;
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'text,v1_1,10,41,{baseline:middle}',
            'setLineWidth,1', 'rect,10,15,40,36',
            'text,v2_1,60,27,{baseline:middle}',
            'text,v3_1,60,54,{baseline:middle}',
            'setLineWidth,1', 'rect,60,15,40,54'
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 40, h: 36 }, columnWidths: [ 40 ], onRowExporting, onCellExporting, drawTableBorder: true }).then(() => {
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

        const pdfCellRects = [
            { x: 10, y: 800 },
            { x: 10, y: 816 },
            { x: 10, y: 10 },
            { x: 10, y: 34 }
        ];

        let cellIndex = 0;
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v2_1') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableRect = { x: 10, y: 10, w: 40, h: 54 };
            } else if(e.rowCells[0].text === 'v3_1') {
                e.rowHeight = 30;
            }
        };
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
        };

        const expectedLog = [
            'text,F1,10,808,{baseline:middle}', 'setLineWidth,1', 'rect,10,800,40,16',
            'text,v1_1,10,826,{baseline:middle}', 'setLineWidth,1', 'rect,10,816,40,20',
            'addPage,',
            'text,v2_1,10,22,{baseline:middle}', 'setLineWidth,1', 'rect,10,10,40,24',
            'text,v3_1,10,49,{baseline:middle}', 'setLineWidth,1', 'rect,10,34,40,30',
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 800, w: 40, h: 36 }, columnWidths: [ 40 ], onRowExporting, onCellExporting }).then(() => {
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

        const pdfCellRects = [
            { x: 10, y: 800 },
            { x: 10, y: 816 },
            { x: 10, y: 10 },
            { x: 10, y: 34 }
        ];

        let cellIndex = 0;
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v2_1') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableRect = { x: 10, y: 10, w: 40, h: 54 };
            } else if(e.rowCells[0].text === 'v3_1') {
                e.rowHeight = 30;
            }
        };
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
            cellIndex++;
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

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 800, w: 40, h: 36 }, columnWidths: [ 40 ], onRowExporting, onCellExporting, drawTableBorder: true }).then(() => {
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

        const pdfCellRects = [
            { x: 10, y: 15 },
            { x: 15, y: 20 },
        ];

        const splitToTablesByColumns = [{
            columnIndex: 1,
            drawOnNewPage: true,
            tableRect: { x: 15, y: 20, w: 50, h: 16 }
        }];

        let cellIndex = 0;
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
            cellIndex++;
        };
        const onRowExporting = (e) => {
            e.rowHeight = 16;
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}',
            'addPage,',
            'text,F2,15,28,{baseline:middle}',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 40, h: 16 }, columnWidths: [ 40, 50 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
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
            drawOnNewPage: true,
            tableRect: { x: 15, y: 25, w: 50, h: 20 }
        }, {
            columnIndex: 2,
            drawOnNewPage: true,
            tableRect: { x: 20, y: 35, w: 60, h: 24 }
        }];

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
            { x: 10, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 38 },
            { x: 10, y: 56 }, { x: 11, y: 57 }, { x: 12, y: 58 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 20, w: 40, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
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
            drawOnNewPage: true,
            tableRect: { x: 11, y: 21, w: 50, h: 60 }
        }, {
            columnIndex: 2,
            drawOnNewPage: true,
            tableRect: { x: 12, y: 22, w: 60, h: 60 }
        }];

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
            { x: 10, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 38 },
            { x: 10, y: 56 }, { x: 11, y: 57 }, { x: 12, y: 58 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'text,v2_1,11,47,{baseline:middle}', 'setLineWidth,1', 'rect,11,37,50,20',
            'text,v2_2,11,69,{baseline:middle}', 'setLineWidth,1', 'rect,11,57,50,24',
            'addPage,',
            'text,F3,12,30,{baseline:middle}', 'setLineWidth,1', 'rect,12,22,60,16',
            'text,v3_1,12,48,{baseline:middle}', 'setLineWidth,1', 'rect,12,38,60,20',
            'text,v3_2,12,70,{baseline:middle}', 'setLineWidth,1', 'rect,12,58,60,24'
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 20, w: 40, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
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
            drawOnNewPage: true,
            tableRect: { x: 11, y: 21, w: 50, h: 60 }
        }, {
            columnIndex: 2,
            drawOnNewPage: true,
            tableRect: { x: 12, y: 22, w: 60, h: 60 }
        }];

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
            { x: 10, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 38 },
            { x: 10, y: 56 }, { x: 11, y: 57 }, { x: 12, y: 58 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 20, w: 40, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: true }).then(() => {
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
            drawOnNewPage: true,
            tableRect: { x: 11, y: 21, w: 50, h: 60 }
        }, {
            columnIndex: 2,
            drawOnNewPage: true,
            tableRect: { x: 12, y: 22, w: 60, h: 60 }
        }];

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
            { x: 10, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 38 },
            { x: 10, y: 56 }, { x: 11, y: 57 }, { x: 12, y: 58 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 20, w: 40, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: true }).then(() => {
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
            drawOnNewPage: true,
            tableRect: { x: 11, y: 21, w: 50, h: 60 }
        }, {
            columnIndex: 2,
            drawOnNewPage: true,
            tableRect: { x: 12, y: 22, w: 60, h: 60 }
        }];

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
            { x: 10, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 38 },
            { x: 10, y: 56 }, { x: 11, y: 57 }, { x: 12, y: 58 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawTopBorder = false;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 20, w: 40, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
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
            drawOnNewPage: true,
            tableRect: { x: 11, y: 21, w: 50, h: 60 }
        }, {
            columnIndex: 2,
            drawOnNewPage: true,
            tableRect: { x: 12, y: 22, w: 60, h: 60 }
        }];

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
            { x: 10, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 38 },
            { x: 10, y: 56 }, { x: 11, y: 57 }, { x: 12, y: 58 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawLeftBorder = false;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 20, w: 40, h: 60 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
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
            drawOnNewPage: true,
            tableRect: { x: 11, y: 21, w: 50, h: 36 }
        }, {
            columnIndex: 2,
            drawOnNewPage: true,
            tableRect: { x: 12, y: 22, w: 60, h: 36 }
        }];

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
            { x: 10, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 38 },
            { x: 10, y: 56 }, { x: 11, y: 57 }, { x: 12, y: 58 },
            { x: 10, y: 80 }, { x: 11, y: 80 }, { x: 12, y: 80 }
        ];
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
                e.drawNewTableFromThisRow.tableRect = { x: 10, y: 56, w: 40, h: 54 };
                e.drawNewTableFromThisRow.splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableRect: { x: 11, y: 57, w: 50, h: 54 }
                }, {
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableRect: { x: 12, y: 58, w: 60, h: 54 }
                }];
            } else if(e.rowCells[0].text === 'v1_3') {
                e.rowHeight = 30;
            }
        };
        const onCellExporting = ({ gridCell, pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'text,v2_3,11,95,{baseline:middle}', 'setLineWidth,1', 'rect,11,80,50,30',
            'setLineWidth,1', 'rect,11,57,50,54',
            'addPage,',
            'text,v3_2,12,70,{baseline:middle}', 'setLineWidth,1', 'rect,12,58,60,24',
            'text,v3_3,12,95,{baseline:middle}', 'setLineWidth,1', 'rect,12,80,60,30',
            'setLineWidth,1', 'rect,12,58,60,54',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 20, w: 40, h: 36 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: true }).then(() => {
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
            drawOnNewPage: true,
            tableRect: { x: 11, y: 21, w: 50, h: 36 }
        }, {
            columnIndex: 2,
            drawOnNewPage: true,
            tableRect: { x: 12, y: 22, w: 60, h: 36 }
        }];

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
            { x: 10, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 38 },
            { x: 10, y: 56 }, { x: 11, y: 57 }, { x: 12, y: 58 },
            { x: 10, y: 80 }, { x: 11, y: 80 }, { x: 12, y: 80 }
        ];
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableRect = { x: 10, y: 56, w: 40, h: 54 };
            } else if(e.rowCells[0].text === 'v1_3') {
                e.rowHeight = 30;
            }
        };
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawTopBorder = false;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'text,v1_2,10,68,{baseline:middle}', 'setLineWidth,1', 'rect,10,56,40,24',
            'text,v1_3,10,95,{baseline:middle}', 'setLineWidth,1', 'rect,10,80,40,30',
            'addPage,',
            'text,v2_2,11,69,{baseline:middle}', 'setLineWidth,1', 'rect,11,57,50,24',
            'text,v2_3,11,95,{baseline:middle}', 'setLineWidth,1', 'rect,11,80,50,30',
            'addPage,',
            'text,v3_2,12,70,{baseline:middle}', 'setLineWidth,1', 'rect,12,58,60,24',
            'text,v3_3,12,95,{baseline:middle}', 'setLineWidth,1', 'rect,12,80,60,30',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 20, w: 40, h: 36 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
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
            drawOnNewPage: true,
            tableRect: { x: 11, y: 21, w: 50, h: 36 }
        }, {
            columnIndex: 2,
            drawOnNewPage: true,
            tableRect: { x: 12, y: 22, w: 60, h: 36 }
        }];

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
            { x: 10, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 38 },
            { x: 10, y: 56 }, { x: 11, y: 57 }, { x: 12, y: 58 },
            { x: 10, y: 80 }, { x: 11, y: 80 }, { x: 12, y: 80 }
        ];
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
                e.drawNewTableFromThisRow.startNewTable = true;
                e.drawNewTableFromThisRow.addPage = true;
                e.drawNewTableFromThisRow.tableRect = { x: 10, y: 56, w: 40, h: 54 };
            } else if(e.rowCells[0].text === 'v1_3') {
                e.rowHeight = 30;
            }
        };
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawLeftBorder = false;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'text,v1_2,10,68,{baseline:middle}', 'setLineWidth,1', 'rect,10,56,40,24',
            'text,v1_3,10,95,{baseline:middle}', 'setLineWidth,1', 'rect,10,80,40,30',
            'addPage,',
            'text,v2_2,11,69,{baseline:middle}', 'setLineWidth,1', 'rect,11,57,50,24',
            'text,v2_3,11,95,{baseline:middle}', 'setLineWidth,1', 'rect,11,80,50,30',
            'addPage,',
            'text,v3_2,12,70,{baseline:middle}', 'setLineWidth,1', 'rect,12,58,60,24',
            'text,v3_3,12,95,{baseline:middle}', 'setLineWidth,1', 'rect,12,80,60,30',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 20, w: 40, h: 36 }, columnWidths: [ 40, 50, 60 ], onCellExporting, onRowExporting, splitToTablesByColumns, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
