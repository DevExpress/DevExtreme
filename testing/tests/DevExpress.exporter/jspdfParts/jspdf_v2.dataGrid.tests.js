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
                        options.onCellExporting({ gridCell: { value: cellData.value }, pdfCell });
                    }
                    row.push(pdfCell);
                    if(pdfCell.borderLeftLineWidth === 0) {
                        if(row.length > 1) {
                            row[row.length - 2].borderRightLineWidth = 0;
                        }
                    } else if(!isDefined(pdfCell.borderLeftLineWidth)) {
                        if(row.length > 1 && row[row.length - 2].borderRightLineWidth === 0) {
                            pdfCell.borderLeftLineWidth = 0;
                        }
                    }
                    if(pdfCell.borderTopLineWidth === 0) {
                        if(table.rows.length > 1) {
                            table.rows[table.rows.length - 2][row.length - 1].borderBottomLineWidth = 0;
                        }
                    } else if(!isDefined(pdfCell.borderTopLineWidth)) {
                        if(table.rows.length > 1 && table.rows[table.rows.length - 2][row.length - 1].borderBottomLineWidth === 0) {
                            pdfCell.borderTopLineWidth = 0;
                        }
                    }
                }
            }

            drawTable(doc, table);
            resolve();
        });
    });
}

const defaultBorderLineWidth = 1;

function drawTable(doc, table) {
    if(!isDefined(doc)) {
        throw 'doc is required';
    }

    function drawBorder(rect, borderLeftLineWidth, borderRightLineWidth, borderTopLineWidth, borderBottomLineWidth) {
        if(!isDefined(rect)) {
            throw 'rect is required';
        }

        if(isDefined(borderLeftLineWidth) || isDefined(borderRightLineWidth) || isDefined(borderTopLineWidth) || isDefined(borderBottomLineWidth)) {
            if(borderLeftLineWidth !== 0 || borderRightLineWidth !== 0 || borderTopLineWidth !== 0 || borderBottomLineWidth !== 0) {
                doc.setLineWidth(defaultBorderLineWidth);
            }

            if(borderTopLineWidth !== 0) {
                doc.line(rect.x, rect.y, rect.x + rect.w, rect.y); // top
            }

            if(borderLeftLineWidth !== 0) {
                doc.line(rect.x, rect.y, rect.x, rect.y + rect.h); // left
            }

            if(borderRightLineWidth !== 0) {
                doc.line(rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h); // right
            }

            if(borderBottomLineWidth !== 0) {
                doc.line(rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h); // bottom
            }
        } else {
            doc.setLineWidth(defaultBorderLineWidth);
            doc.rect(rect.x, rect.y, rect.w, rect.h);
        }
    }

    function drawRow(rowCells) {
        if(!isDefined(rowCells)) {
            throw 'rowCells is required';
        }
        rowCells.forEach(cell => {
            if(cell.skip === true) {
                return;
            }
            if(!isDefined(cell.rect)) {
                throw 'cell.rect is required';
            }
            if(isDefined(cell.text) && cell.text !== '') { // TODO: use cell.text.trim() ?
                const textY = cell.rect.y + (cell.rect.h / 2); // https://github.com/MrRio/jsPDF/issues/1573
                doc.text(cell.text, cell.rect.x, textY, { baseline: 'middle' });
            }
            drawBorder(cell.rect, cell.borderLeftLineWidth, cell.borderRightLineWidth, cell.borderTopLineWidth, cell.borderBottomLineWidth);
        });
    }

    if(!isDefined(table)) {
        return Promise.resolve();
    }
    if(!isDefined(table.rect)) {
        throw 'table.rect is required';
    }

    if(isDefined(table.rows)) {
        for(let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
            drawRow(table.rows[rowIndex]);
        }
    }

    drawBorder(table.rect);
}

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

    QUnit.test('3 cols - 2 rows - hide left border of [1,1] cell', function(assert) {
        // TODO:
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        let cellIndex = 0;
        const pdfCellRects = [
            { x: 10, y: 15, w: 40, h: 16 }, { x: 50, y: 15, w: 50, h: 16 }, { x: 100, y: 15, w: 60, h: 16 },
            { x: 10, y: 31, w: 40, h: 20 }, { x: 50, y: 31, w: 50, h: 20 }, { x: 100, y: 31, w: 60, h: 20 },
            { x: 10, y: 51, w: 40, h: 24 }, { x: 50, y: 51, w: 50, h: 24 }, { x: 100, y: 51, w: 60, h: 24 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.borderLeftLineWidth = 0;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'setLineWidth,1', 'rect,10,15,150,60'
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 40, h: 16 }, { x: 50, y: 15, w: 50, h: 16 }, { x: 100, y: 15, w: 60, h: 16 },
            { x: 10, y: 31, w: 40, h: 20 }, { x: 50, y: 31, w: 50, h: 20 }, { x: 100, y: 31, w: 60, h: 20 },
            { x: 10, y: 51, w: 40, h: 24 }, { x: 50, y: 51, w: 50, h: 24 }, { x: 100, y: 51, w: 60, h: 24 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.borderRightLineWidth = 0;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'setLineWidth,1', 'rect,10,15,150,60'
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 40, h: 16 }, { x: 50, y: 15, w: 50, h: 16 }, { x: 100, y: 15, w: 60, h: 16 },
            { x: 10, y: 31, w: 40, h: 20 }, { x: 50, y: 31, w: 50, h: 20 }, { x: 100, y: 31, w: 60, h: 20 },
            { x: 10, y: 51, w: 40, h: 24 }, { x: 50, y: 51, w: 50, h: 24 }, { x: 100, y: 51, w: 60, h: 24 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.borderTopLineWidth = 0;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'setLineWidth,1', 'rect,10,15,150,60'
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 40, h: 16 }, { x: 50, y: 15, w: 50, h: 16 }, { x: 100, y: 15, w: 60, h: 16 },
            { x: 10, y: 31, w: 40, h: 20 }, { x: 50, y: 31, w: 50, h: 20 }, { x: 100, y: 31, w: 60, h: 20 },
            { x: 10, y: 51, w: 40, h: 24 }, { x: 50, y: 51, w: 50, h: 24 }, { x: 100, y: 51, w: 60, h: 24 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.borderBottomLineWidth = 0;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'setLineWidth,1', 'rect,10,15,150,60'
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 40, h: 16 }, { x: 50, y: 15, w: 50, h: 16 }, { x: 100, y: 15, w: 60, h: 16 },
            { x: 10, y: 31, w: 40, h: 20 }, { x: 50, y: 31, w: 50, h: 20 }, { x: 100, y: 31, w: 60, h: 20 },
            { x: 10, y: 51, w: 40, h: 24 }, { x: 50, y: 51, w: 50, h: 24 }, { x: 100, y: 51, w: 60, h: 24 }
        ];
        const onCellExporting = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.borderLeftLineWidth = 0;
                pdfCell.borderRightLineWidth = 0;
                pdfCell.borderTopLineWidth = 0;
                pdfCell.borderBottomLineWidth = 0;
            }
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
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
            'setLineWidth,1', 'rect,10,15,150,60'
        ];
        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 150, h: 60 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 100, h: 16 },
            { x: 10, y: 31, w: 100, h: 20 },
            { x: 10, y: 51, w: 100, h: 24 },
        ];
        const onCellExporting = ({ pdfCell }) => {
            pdfCell.rect = pdfCellRects[cellIndex];
            cellIndex++;
        };

        const expectedLog = [
            'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,16',
            'text,F1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,100,20',
            'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,100,24',
            'setLineWidth,1', 'rect,10,15,100,60',
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 100, h: 60 }, onCellExporting }).then(() => {
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
            { x: 10, y: 15, w: 90, h: 36 }, { x: 100, y: 15, w: 110, h: 16 }, null,
            null, { x: 100, y: 31, w: 50, h: 20 }, { x: 150, y: 31, w: 60, h: 20 },
            { x: 10, y: 51, w: 90, h: 24 }, { x: 100, y: 51, w: 50, h: 24 }, { x: 150, y: 51, w: 60, h: 24 },
        ];
        const onCellExporting = ({ pdfCell }) => {
            if(pdfCellRects[cellIndex] === null) {
                pdfCell.skip = true; // TODO: pdfCell.isMerged?
            } else {
                pdfCell.rect = pdfCellRects[cellIndex];
            }
            cellIndex++;
        };

        const expectedLog = [
            'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,36',
            'text,Band1,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,110,16',
            'text,F2,100,41,{baseline:middle}', 'setLineWidth,1', 'rect,100,31,50,20',
            'text,F3,150,41,{baseline:middle}', 'setLineWidth,1', 'rect,150,31,60,20',
            'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,90,24',
            'text,f2_1,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,50,24',
            'text,f3_1,150,63,{baseline:middle}', 'setLineWidth,1', 'rect,150,51,60,24',
            'setLineWidth,1', 'rect,10,15,200,60'
        ];

        exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 200, h: 60 }, onCellExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
