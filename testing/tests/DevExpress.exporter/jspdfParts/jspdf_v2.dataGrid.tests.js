import $ from 'jquery';
import { jsPDF } from 'jspdf';

import { isDefined, isFunction, isObject } from 'core/utils/type';

import 'ui/data_grid/ui.data_grid';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        // The transpiling of the script on the drone and locally has differences that affect the imported jsPDF type.
        const _jsPDF = isFunction(jsPDF) ? jsPDF : jsPDF.jsPDF;
        this.jsPDFDocument = _jsPDF();
        this.customizeCellCallCount = 0;
    }
};

function exportDataGrid(doc, dataGrid, options) {
    if(!isDefined(options.rect)) {
        throw 'options.rect is required';
    }
    const dataProvider = dataGrid.getDataProvider();
    return new Promise((resolve) => {
        dataProvider.ready().done(() => {
            const table = {
                rect: options.rect,
                borderLineWidth: 1
            };
            table.rows = [];
            const columns = dataProvider.getColumns();
            const dataRowsCount = dataProvider.getRowsCount();
            for(let rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                const row = [];
                table.rows.push(row);
                for(let cellIndex = 0; cellIndex < columns.length; cellIndex++) {
                    const cellData = dataProvider.getCellData(rowIndex, cellIndex, true);
                    const pdfCell = {
                        text: cellData.value
                    };
                    if(options.onCellExporting) {
                        options.onCellExporting({ pdfCell });
                    }
                    row.push(pdfCell);
                }
            }

            drawTable(doc, table);
            resolve();
        });
    });
}

function drawTable(doc, table) {
    function drawTableBorder(doc, { rect } = table) {
        if(!isDefined(doc)) {
            throw 'doc is required';
        }
        if(isDefined(rect)) {
            doc.setLineWidth(1);
            doc.rect(rect.x, rect.y, rect.w, rect.h);
        }
    }

    function drawRow(doc, rowCells) {
        if(!isDefined(rowCells)) {
            throw 'rowCells is required';
        }
        rowCells.forEach(cell => {
            if(isDefined(cell.text) && cell.text !== '') {
                if(!isDefined(cell.rect)) {
                    throw 'cell.rect is required';
                }
                const textY = cell.rect.y + (cell.rect.h / 2); // https://github.com/MrRio/jsPDF/issues/1573
                doc.text(cell.text, cell.rect.x, textY, { baseline: 'middle' });
            }
            if(isDefined(cell.rect)) {
                doc.setLineWidth(1);
                doc.rect(cell.rect.x, cell.rect.y, cell.rect.w, cell.rect.h);
            }
        });
    }

    if(!isDefined(table) || !isDefined(table.rect)) {
        return Promise.resolve();
    }

    if(isDefined(table.rows)) {
        for(let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
            drawRow(doc, table.rows[rowIndex]);
        }
    }

    drawTableBorder(doc, table);
}

QUnit.module('exportDataGrid', moduleConfig, () => {

    function argumentsToString() {
        const items = Array.from(arguments);
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

        return result;
    }

    function createDataGrid(options) {
        options.loadingTimeout = undefined;
        return $('#dataGrid').dxDataGrid(options).dxDataGrid('instance');
    }

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

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 20 }, onCellExporting }).then(() => {
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

        const rect = { x: 10, y: 15, w: 100, h: 20 };
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = rect;
        };

        const expectedLog = [
            'text,f1,10,25,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20',
            'setLineWidth,1', 'rect,10,15,100,20',
        ];

        exportDataGrid(doc, dataGrid, { rect, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 100, h: 20 },
            { x: 10, y: 35, w: 100, h: 24 },
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = cellRects[cellIndex];
            cellIndex++;
        };

        const expectedLog = [
            'text,F1,10,25,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,20',
            'text,v1,10,47,{baseline:middle}', 'setLineWidth,1', 'rect,10,35,100,24',
            'setLineWidth,1', 'rect,10,15,100,44',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 44 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 100, h: 16 },
            { x: 10, y: 31, w: 100, h: 20 },
            { x: 10, y: 51, w: 100, h: 24 },
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = cellRects[cellIndex];
            cellIndex++;
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,100,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,100,24',
            'setLineWidth,1', 'rect,10,15,100,60',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 60 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 40, h: 16 },
            { x: 50, y: 15, w: 60, h: 16 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
        };

        const expectedLog = [
            'text,f1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,f2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,16',
            'setLineWidth,1', 'rect,10,15,100,16'
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 16 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 40, h: 16 },
            { x: 50, y: 15, w: 60, h: 16 },
            { x: 10, y: 31, w: 40, h: 20 },
            { x: 50, y: 31, w: 60, h: 20 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,16',
            'text,v1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2,50,41,{baseline:middle}', 'setLineWidth,1', 'rect,50,31,60,20',
            'setLineWidth,1', 'rect,10,15,100,36'
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 36 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 40, h: 16 },
            { x: 50, y: 15, w: 60, h: 16 },
            { x: 10, y: 31, w: 40, h: 20 },
            { x: 50, y: 31, w: 60, h: 20 },
            { x: 10, y: 51, w: 40, h: 24 },
            { x: 50, y: 51, w: 60, h: 24 }
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
        };

        const expectedLog = [
            'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,40,16',
            'text,F2,50,23,{baseline:middle}', 'setLineWidth,1', 'rect,50,15,60,16',
            'text,v1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
            'text,v2_1,50,41,{baseline:middle}', 'setLineWidth,1', 'rect,50,31,60,20',
            'text,v1_2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
            'text,v2_2,50,63,{baseline:middle}', 'setLineWidth,1', 'rect,50,51,60,24',
            'setLineWidth,1', 'rect,10,15,100,60'
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 60 }, onCellExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
