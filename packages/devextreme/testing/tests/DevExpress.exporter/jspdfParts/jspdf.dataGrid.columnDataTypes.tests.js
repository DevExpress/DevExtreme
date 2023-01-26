import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Column data types', moduleConfig, () => {

    const dateValue1 = new Date(2019, 9, 9, 9, 9, 9, 9);
    const dateValue2 = new Date(2020, 9, 9, 9, 9, 9, 9);

    QUnit.test('Columns.dataType: string, value: \'1\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: '1' }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,1,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: string, values: [\'1\', \'2\']', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: '1' }, { f1: '2' }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,1,55,87.25,{baseline:middle}',
            'text,2,55,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'rect,50,98,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: string, values: [\'1\', \'2\'], selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const ds = [{ f1: '1' }, { f1: '2' }];

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: ds,
            selectedRowKeys: [ds[1]],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,2,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], selectedRowsOnly: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: string, col_1.customizeText: (cell) => \'custom\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'string', customizeText: (cell) => 'custom' }],
            dataSource: [{ f1: '1' }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,custom,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: string, unbound', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataType: 'string', calculateCellValue: () => undefined },
                { dataType: 'string', calculateCellValue: () => null },
                { dataType: 'string', calculateCellValue: () => '' },
                { dataType: 'string', calculateCellValue: () => 'str1' },
                { dataType: 'string', calculateCellValue: () => 'str2' }
            ],
            dataSource: [{ id: 0 }],
            loadingTimeout: null,
            showColumnHeaders: false
        });

        const expectedLog = [
            'setFontSize,10',
            'text,str1,355,65.75,{baseline:middle}',
            'text,str2,455,65.75,{baseline:middle}',
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

    QUnit.test('Columns.dataType: number, value: 1', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [{ f1: 1 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,145,65.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,1,145,87.25,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: number, value: [1, 2]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [{ f1: 1 }, { f1: 2 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,145,65.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,1,145,87.25,{baseline:middle,align:right}',
            'text,2,145,108.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'rect,50,98,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: number, value: [1, 2], selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const ds = [{ f1: 1 }, { f1: 2 }];

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: ds,
            selectedRowKeys: [ds[1]],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,145,65.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,2,145,87.25,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], selectedRowsOnly: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: number, col_1.customizeText: (cell) => \'custom\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'number', customizeText: (cell) => 'custom' }],
            dataSource: [{ f1: 1 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,145,65.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,custom,145,87.25,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: number, unbound', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataType: 'number', calculateCellValue: () => undefined },
                { dataType: 'number', calculateCellValue: () => null },
                { dataType: 'number', calculateCellValue: () => 0 },
                { dataType: 'number', calculateCellValue: () => 1 },
                { dataType: 'number', calculateCellValue: () => -2 },
                { dataType: 'number', calculateCellValue: () => Number.POSITIVE_INFINITY },
                { dataType: 'number', calculateCellValue: () => Number.NEGATIVE_INFINITY }
            ],
            dataSource: [{ id: 0 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setFontSize,10',
            'text,0,255,65.75,{baseline:middle,align:right}',
            'text,1,325,65.75,{baseline:middle,align:right}',
            'text,-2,395,65.75,{baseline:middle,align:right}',
            'text,Infinity,465,65.75,{baseline:middle,align:right}',
            'text,-Infinity,535,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,0',
            'rect,120,55,70,0',
            'rect,190,55,70,0',
            'rect,260,55,70,0',
            'rect,330,55,70,0',
            'rect,400,55,70,0',
            'rect,470,55,70,0',
            'rect,50,55,70,21.5',
            'rect,120,55,70,21.5',
            'rect,190,55,70,21.5',
            'rect,260,55,70,21.5',
            'rect,330,55,70,21.5',
            'rect,400,55,70,21.5',
            'rect,470,55,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70, 70, 70, 70, 70 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: boolean, value: true', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'boolean' }],
            dataSource: [{ f1: true }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,100,65.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,true,100,87.25,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: boolean, values: [true, false]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'boolean' }],
            dataSource: [{ f1: true }, { f1: false }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,100,65.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,true,100,87.25,{baseline:middle,align:center}',
            'text,false,100,108.75,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'rect,50,98,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: boolean, values: [true, false], selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const ds = [{ f1: true }, { f1: false }];

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'boolean' }],
            dataSource: ds,
            selectedRowKeys: [ds[1]],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,100,65.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,false,100,87.25,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], selectedRowsOnly: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: boolean, col_1.customizeText: (cell) => \'custom\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'boolean', customizeText: (cell) => 'custom' }],
            dataSource: [{ f1: true }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,100,65.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,custom,100,87.25,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: date, value: 10/9/2019', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [{ f1: dateValue1 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,10/9/2019,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: date, values: [ 10/9/2019, 10/9/2020]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [{ f1: dateValue1 }, { f1: dateValue2 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,10/9/2019,55,87.25,{baseline:middle}',
            'text,10/9/2020,55,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'rect,50,98,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: date, values: [ 10/9/2019, 10/9/2020], selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const ds = [{ f1: dateValue1 }, { f1: dateValue2 }];

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: ds,
            selectedRowKeys: [ds[1]],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,10/9/2020,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], selectedRowsOnly: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: date, col_1.customizeText: (cell) => \'custom\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'date', customizeText: (cell) => 'custom' }],
            dataSource: [{ f1: dateValue1 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,custom,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: datetime, value: 10/9/2019', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'datetime' }],
            dataSource: [{ f1: dateValue1 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,10/9/2019, 9:09 AM,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: datetime, values: [ 10/9/2019, 10/9/2020 ]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'datetime' }],
            dataSource: [{ f1: dateValue1 }, { f1: dateValue2 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,10/9/2019, 9:09 AM,55,87.25,{baseline:middle}',
            'text,10/9/2020, 9:09 AM,55,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'rect,50,98,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: datetime, values: [ 10/9/2019, 10/9/2020 ], selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const ds = [{ f1: dateValue1 }, { f1: dateValue2 }];

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'datetime' }],
            dataSource: ds,
            selectedRowKeys: [ds[1]],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,10/9/2020, 9:09 AM,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], selectedRowsOnly: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Columns.dataType: datetime, col_1.customizeText: (cell) => \'custom\'', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'f1', dataType: 'datetime', customizeText: (cell) => 'custom' }],
            dataSource: [{ f1: dateValue1 }],
            loadingTimeout: null
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,custom,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
