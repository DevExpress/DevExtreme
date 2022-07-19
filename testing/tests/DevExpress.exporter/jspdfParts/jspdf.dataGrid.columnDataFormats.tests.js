import '../../../helpers/noIntl.js';
import 'intl';

import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Column data formats', moduleConfig, () => {

    QUnit.test('columns.dataType: date, columns.format.type: [\'millisecond\', \'second\', \'minute\', \'hour\', \'day\', \'month\', \'year\', \'quarter\', \'monthAndDay\', \'monthAndYear\', \'quarterAndYear\', \'shortDate\', \'shortTime\', \'longDateLongTim, \'shortDateShortT, \'longDate\', \'longTime\', \'dayOfWeek\', \'yyyy-MM-dd\']', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dateValue = new Date(2019, 9, 9, 9, 9, 9, 9);

        const columns = [
            { dataField: 'f1', dataType: 'datetime', format: 'millisecond' }, // '009'
            { dataField: 'f2', dataType: 'datetime', format: 'second' }, // '09'
            { dataField: 'f3', dataType: 'datetime', format: 'minute' }, // '09'
            { dataField: 'f4', dataType: 'datetime', format: 'hour' }, // '09'
            { dataField: 'f5', dataType: 'datetime', format: 'day' }, // '9'
            { dataField: 'f6', dataType: 'datetime', format: 'month' }, // 'October'
            { dataField: 'f7', dataType: 'datetime', format: 'year' }, // '2019'
            { dataField: 'f8', dataType: 'datetime', format: 'quarter' }, // 'Q4'
            { dataField: 'f9', dataType: 'datetime', format: 'monthAndDay' }, // 'October 9'
            { dataField: 'f10', dataType: 'datetime', format: 'monthAndYear' }, // 'October 2019'
            { dataField: 'f11', dataType: 'datetime', format: 'quarterAndYear' }, // 'Q4 2019'
            { dataField: 'f12', dataType: 'datetime', format: 'shortDate' }, // '10/9/2019'
            { dataField: 'f13', dataType: 'datetime', format: 'shortTime' }, // '9:09 AM'
            { dataField: 'f14', dataType: 'datetime', format: 'longDateLongTime' }, // 'Wednesday, October 9, 2019, 9:09:09 AM'
            { dataField: 'f15', dataType: 'datetime', format: 'shortDateShortTime' }, // '10/9/2019, 9:09 AM'
            { dataField: 'f16', dataType: 'datetime', format: 'longDate' }, // 'Wednesday, October 9, 2019'
            { dataField: 'f17', dataType: 'datetime', format: 'longTime' }, // '9:09:09 AM'
            { dataField: 'f18', dataType: 'datetime', format: 'dayOfWeek' }, // 'Wednesday'
            { dataField: 'f19', dataType: 'datetime', format: 'yyyy-MM-dd' }, // '2019-10-09'
        ];

        const columnWidths = [];
        const dataSource = [{}];
        columns.forEach((column) => {
            dataSource[0][column.dataField] = dateValue;

            const isLongLine = ['longDateLongTime', 'shortDateShortTime', 'longDate'].indexOf(column.format) !== -1;
            columnWidths.push(isLongLine ? 210 : 80);
        });

        const dataGrid = createDataGrid({
            columns,
            dataSource,
            loadingTimeout: null,
            showColumnHeaders: false
        });

        const expectedLog = [
            'setFontSize,10',
            'text,009,55,65.75,{baseline:middle}',
            'text,09,135,65.75,{baseline:middle}',
            'text,09,215,65.75,{baseline:middle}',
            'text,09,295,65.75,{baseline:middle}',
            'text,9,375,65.75,{baseline:middle}',
            'text,October,455,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,80,21.5',
            'rect,210,55,80,21.5',
            'rect,290,55,80,21.5',
            'rect,370,55,80,21.5',
            'rect,450,55,80,21.5',
            'addPage,',
            'text,2019,45,65.75,{baseline:middle}',
            'text,Q4,125,65.75,{baseline:middle}',
            'text,October 9,205,65.75,{baseline:middle}',
            'text,October 2019,285,65.75,{baseline:middle}',
            'text,Q4 2019,365,65.75,{baseline:middle}',
            'text,10/9/2019,445,65.75,{baseline:middle}',
            'rect,40,55,80,21.5',
            'rect,120,55,80,21.5',
            'rect,200,55,80,21.5',
            'rect,280,55,80,21.5',
            'rect,360,55,80,21.5',
            'rect,440,55,80,21.5',
            'addPage,',
            'text,9:09 AM,45,65.75,{baseline:middle}',
            'text,Wednesday, October 9, 2019 at 9:09:09 AM,125,65.75,{baseline:middle}',
            'text,10/9/2019, 9:09 AM,335,65.75,{baseline:middle}',
            'rect,40,55,80,21.5',
            'rect,120,55,210,21.5',
            'rect,330,55,210,21.5',
            'addPage,',
            'text,Wednesday, October 9, 2019,45,65.75,{baseline:middle}',
            'text,9:09:09 AM,255,65.75,{baseline:middle}',
            'text,Wednesday,335,65.75,{baseline:middle}',
            'text,2019-10-09,415,65.75,{baseline:middle}',
            'rect,40,55,210,21.5',
            'rect,250,55,80,21.5',
            'rect,330,55,80,21.5',
            'rect,410,55,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'percent\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'percent', precision: 3 } }, // 100.000%
                { dataField: 'f2', dataType: 'number', format: { type: 'percent', precision: 0 } }, // 100%
                { dataField: 'f3', dataType: 'number', format: { type: 'percent' } }, // 100%
                { dataField: 'f4', dataType: 'number', format: { type: 'percent', precision: 1 } }, // 100.0%
                { dataField: 'f5', dataType: 'number', format: { type: 'percent', precision: 6 } }, // 100.000000%
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,100.000%,145,65.75,{baseline:middle,align:right}',
            'text,100%,245,65.75,{baseline:middle,align:right}',
            'text,100%,345,65.75,{baseline:middle,align:right}',
            'text,100.0%,445,65.75,{baseline:middle,align:right}',
            'text,100.000000%,545,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,150,55,100,21.5',
            'rect,250,55,100,21.5',
            'rect,350,55,100,21.5',
            'rect,450,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100, 100, 100, 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'fixedPoint\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'fixedPoint', precision: 3 } }, // '1.000'
                { dataField: 'f2', dataType: 'number', format: { type: 'fixedPoint', precision: 0 } }, // '1'
                { dataField: 'f3', dataType: 'number', format: { type: 'fixedPoint' } }, // '1'
                { dataField: 'f4', dataType: 'number', format: { type: 'fixedPoint', precision: 1 } }, // '1.0'
                { dataField: 'f5', dataType: 'number', format: { type: 'fixedPoint', precision: 6 } }, // '1.000000'
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,1.000,145,65.75,{baseline:middle,align:right}',
            'text,1,245,65.75,{baseline:middle,align:right}',
            'text,1,345,65.75,{baseline:middle,align:right}',
            'text,1.0,445,65.75,{baseline:middle,align:right}',
            'text,1.000000,545,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,150,55,100,21.5',
            'rect,250,55,100,21.5',
            'rect,350,55,100,21.5',
            'rect,450,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100, 100, 100, 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'decimal\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'decimal', precision: 3 } }, // 001
                { dataField: 'f2', dataType: 'number', format: { type: 'decimal', precision: 0 } }, // 1
                { dataField: 'f3', dataType: 'number', format: { type: 'decimal' } }, // 1
                { dataField: 'f4', dataType: 'number', format: { type: 'decimal', precision: 1 } }, // 1
                { dataField: 'f5', dataType: 'number', format: { type: 'decimal', precision: 6 } }, // 000001
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,001,145,65.75,{baseline:middle,align:right}',
            'text,1,245,65.75,{baseline:middle,align:right}',
            'text,1,345,65.75,{baseline:middle,align:right}',
            'text,1,445,65.75,{baseline:middle,align:right}',
            'text,000001,545,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,150,55,100,21.5',
            'rect,250,55,100,21.5',
            'rect,350,55,100,21.5',
            'rect,450,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100, 100, 100, 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'exponential\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'exponential', precision: 3 } }, // '1.000E+0'
                { dataField: 'f2', dataType: 'number', format: { type: 'exponential', precision: 0 } }, // '1E+0'
                { dataField: 'f3', dataType: 'number', format: { type: 'exponential' } }, // '1.0E+0'
                { dataField: 'f4', dataType: 'number', format: { type: 'exponential', precision: 1 } }, // '1.0E+0'
                { dataField: 'f5', dataType: 'number', format: { type: 'exponential', precision: 6 } }, // '1.000000E+0'
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,1.000E+0,145,65.75,{baseline:middle,align:right}',
            'text,1E+0,245,65.75,{baseline:middle,align:right}',
            'text,1.0E+0,345,65.75,{baseline:middle,align:right}',
            'text,1.0E+0,445,65.75,{baseline:middle,align:right}',
            'text,1.000000E+0,545,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,150,55,100,21.5',
            'rect,250,55,100,21.5',
            'rect,350,55,100,21.5',
            'rect,450,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100, 100, 100, 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'largeNumber\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'largeNumber', precision: 3 } }, // '1.000'
                { dataField: 'f2', dataType: 'number', format: { type: 'largeNumber', precision: 0 } }, // '1'
                { dataField: 'f3', dataType: 'number', format: { type: 'largeNumber' } }, // '1'
                { dataField: 'f4', dataType: 'number', format: { type: 'largeNumber', precision: 1 } }, // '1.0'
                { dataField: 'f5', dataType: 'number', format: { type: 'largeNumber', precision: 6 } }, // '1.000000'
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,1.000,145,65.75,{baseline:middle,align:right}',
            'text,1,245,65.75,{baseline:middle,align:right}',
            'text,1,345,65.75,{baseline:middle,align:right}',
            'text,1.0,445,65.75,{baseline:middle,align:right}',
            'text,1.000000,545,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,150,55,100,21.5',
            'rect,250,55,100,21.5',
            'rect,350,55,100,21.5',
            'rect,450,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100, 100, 100, 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'thousands\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'thousands', precision: 3 } }, // '0.001K'
                { dataField: 'f2', dataType: 'number', format: { type: 'thousands', precision: 0 } }, // '0K'
                { dataField: 'f3', dataType: 'number', format: { type: 'thousands' } }, // '0K'
                { dataField: 'f4', dataType: 'number', format: { type: 'thousands', precision: 1 } }, // '0.0K'
                { dataField: 'f5', dataType: 'number', format: { type: 'thousands', precision: 6 } }, // '0.001000K'
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,0.001K,145,65.75,{baseline:middle,align:right}',
            'text,0K,245,65.75,{baseline:middle,align:right}',
            'text,0K,345,65.75,{baseline:middle,align:right}',
            'text,0.0K,445,65.75,{baseline:middle,align:right}',
            'text,0.001000K,545,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,150,55,100,21.5',
            'rect,250,55,100,21.5',
            'rect,350,55,100,21.5',
            'rect,450,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100, 100, 100, 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'millions\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'millions', precision: 3 } }, // '0.000M'
                { dataField: 'f2', dataType: 'number', format: { type: 'millions', precision: 0 } }, // '0M'
                { dataField: 'f3', dataType: 'number', format: { type: 'millions' } }, // '0M'
                { dataField: 'f4', dataType: 'number', format: { type: 'millions', precision: 1 } }, // '0.0M'
                { dataField: 'f5', dataType: 'number', format: { type: 'millions', precision: 6 } }, // '0.000001M'
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,0.000M,145,65.75,{baseline:middle,align:right}',
            'text,0M,245,65.75,{baseline:middle,align:right}',
            'text,0M,345,65.75,{baseline:middle,align:right}',
            'text,0.0M,445,65.75,{baseline:middle,align:right}',
            'text,0.000001M,545,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,150,55,100,21.5',
            'rect,250,55,100,21.5',
            'rect,350,55,100,21.5',
            'rect,450,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100, 100, 100, 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'billions\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'billions', precision: 3 } }, // '0.000B'
                { dataField: 'f2', dataType: 'number', format: { type: 'billions', precision: 0 } }, // '0B'
                { dataField: 'f3', dataType: 'number', format: { type: 'billions' } }, // '0B'
                { dataField: 'f4', dataType: 'number', format: { type: 'billions', precision: 1 } }, // '0.0B'
                { dataField: 'f5', dataType: 'number', format: { type: 'billions', precision: 6 } }, // '0.000000B'
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,0.000B,145,65.75,{baseline:middle,align:right}',
            'text,0B,245,65.75,{baseline:middle,align:right}',
            'text,0B,345,65.75,{baseline:middle,align:right}',
            'text,0.0B,445,65.75,{baseline:middle,align:right}',
            'text,0.000000B,545,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,150,55,100,21.5',
            'rect,250,55,100,21.5',
            'rect,350,55,100,21.5',
            'rect,450,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100, 100, 100, 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'trillions\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'trillions', precision: 3 } }, // '0.000T'
                { dataField: 'f2', dataType: 'number', format: { type: 'trillions', precision: 0 } }, // '0T'
                { dataField: 'f3', dataType: 'number', format: { type: 'trillions' } }, // '0T'
                { dataField: 'f4', dataType: 'number', format: { type: 'trillions', precision: 1 } }, // '0.0T'
                { dataField: 'f5', dataType: 'number', format: { type: 'trillions', precision: 6 } }, // '0.000000T'
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,0.000T,145,65.75,{baseline:middle,align:right}',
            'text,0T,245,65.75,{baseline:middle,align:right}',
            'text,0T,345,65.75,{baseline:middle,align:right}',
            'text,0.0T,445,65.75,{baseline:middle,align:right}',
            'text,0.000000T,545,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,150,55,100,21.5',
            'rect,250,55,100,21.5',
            'rect,350,55,100,21.5',
            'rect,450,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100, 100, 100, 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('columns.dataType: number, columns.format.type: \'currency\' with presicion', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', dataType: 'number', format: { type: 'currency', precision: 2 } }, // '$1.00'
                { dataField: 'f2', dataType: 'number', format: { type: 'currency', precision: 4 } }, // '$1.0000'
                { dataField: 'f3', dataType: 'number', format: { type: 'currency', precision: 0 } }, // '$1'
                { dataField: 'f4', dataType: 'number', format: { type: 'currency' } }, // '$1'
                { dataField: 'f5', dataType: 'number', format: { type: 'currency', precision: 1 } }, // '$1.0'
                { dataField: 'f6', dataType: 'number', format: { type: 'currency', precision: 5 } }, // '$1.000000'
            ],
            dataSource: [{ f1: 1, f2: 1, f3: 1, f4: 1, f5: 1, f6: 1 }],
            loadingTimeout: null,
            showColumnHeaders: false,
        });

        const expectedLog = [
            'setFontSize,10',
            'text,$1.00,125,65.75,{baseline:middle,align:right}',
            'text,$1.0000,205,65.75,{baseline:middle,align:right}',
            'text,$1,285,65.75,{baseline:middle,align:right}',
            'text,$1,365,65.75,{baseline:middle,align:right}',
            'text,$1.0,445,65.75,{baseline:middle,align:right}',
            'text,$1.00000,525,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,80,21.5',
            'rect,210,55,80,21.5',
            'rect,290,55,80,21.5',
            'rect,370,55,80,21.5',
            'rect,450,55,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 80, 80, 80, 80, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
