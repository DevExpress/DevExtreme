import $ from 'jquery';
import Class from 'core/class';
import { DataController } from '__internal/grids/pivot_grid/data_controller/m_data_controller';
import virtualScrolling from '__internal/grids/grid_core/virtual_scrolling/m_virtual_scrolling_core';
import stateStoring from '__internal/grids/grid_core/state_storing/m_state_storing_core';
import pivotGridUtils from '__internal/grids/pivot_grid/m_widget_utils';
import { PivotGridDataSource } from '__internal/grids/pivot_grid/data_source/m_data_source';

import executeAsyncMock from '../../helpers/executeAsyncMock.js';

const moduleConfig = {
    beforeEach: function() {
        const StateStoringController = stateStoring.StateStoringController;

        const stateStoringController = sinon.createStubInstance(StateStoringController);
        stateStoringController.init.returns(stateStoringController);

        sinon.stub(stateStoring, 'StateStoringController').callsFake(function() {
            return stateStoringController;
        });

        this.stateStoringController = stateStoringController;

        executeAsyncMock.setup();
    },

    afterEach: function() {
        stateStoring.StateStoringController.restore();
        executeAsyncMock.teardown();
    }
};

function prepareLoadedData(data) {
    pivotGridUtils.foreachTree(data, function(items) {
        delete items[0].text;
    });
    return data;
}

const texts = {
    grandTotal: 'Grand Total',
    total: '{0} Total',
    dataNotAvailable: 'Error'
};

const prepareCellsInfo = function(cellsInfo) {
    const result = [];

    for(let rowIndex = 0; rowIndex < cellsInfo.length; rowIndex++) {
        result.push([]);
        for(let columnIndex = 0; columnIndex < cellsInfo[rowIndex].length; columnIndex++) {
            const cellInfo = cellsInfo[rowIndex][columnIndex];
            const preparedCellInfo = {
                rowType: cellInfo.rowType,
                columnType: cellInfo.columnType,
                text: cellInfo.text
            };
            if(cellInfo.width) {
                preparedCellInfo.width = cellInfo.width;
            }
            result[rowIndex].push(preparedCellInfo);
        }
    }
    return result;
};

QUnit.module('dxPivotGrid DataController', moduleConfig, () => {

    QUnit.test('Without options', function(assert) {
        const dataController = new DataController({});
        assert.deepEqual(dataController.getRowsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getColumnsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getCellsInfo(), []);
    });

    QUnit.test('With empty fields', function(assert) {
        const dataController = new DataController({ dataSource: { fields: [] } });
        assert.deepEqual(dataController.getRowsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getColumnsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getCellsInfo(), []);
    });

    QUnit.test('No dataSource options', function(assert) {
        const dataController = new DataController({});
        assert.deepEqual(dataController.getRowsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getColumnsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getCellsInfo(), []);
    });

    QUnit.test('Empty dataSource', function(assert) {
        const dataController = new DataController({
            dataSource: {}
        });
        assert.deepEqual(dataController.getRowsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getColumnsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getCellsInfo(), []);
        assert.ok(dataController.isEmpty(), 'isEmpty');
    });

    QUnit.test('DataSource with empty data', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column', width: 100 },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                grandTotalRowIndex: 0,
                grandTotalColumnIndex: 0
            }
        });
        assert.deepEqual(dataController.getRowsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getColumnsInfo(), [[{ text: undefined, type: 'GT', isLast: true }]]);
        assert.deepEqual(dataController.getCellsInfo(), []);
        assert.ok(dataController.isEmpty(), 'isEmpty');
    });

    QUnit.test('Empty dataSource when showRowGrandTotals/showColumnGrandTotals disabled', function(assert) {
        const dataController = new DataController({
            showRowGrandTotals: false,
            showColumnGrandTotals: false,
            dataSource: {},
            texts: texts
        });

        assert.deepEqual(dataController.getRowsInfo(), [[{ text: undefined, type: undefined }]], 'Rows Info');
        assert.deepEqual(dataController.getColumnsInfo(), [[{ text: undefined, type: undefined }]], 'Columns Info');
        assert.deepEqual(dataController.getCellsInfo(), [], 'Cells Info');
    });

    QUnit.test('dataSource by options disposing', function(assert) {
        const dataController = new DataController({
            dataSource: {}
        });
        const onScrollChanged = sinon.stub();

        const dataSource = dataController.getDataSource();
        dataController.scrollChanged.add(onScrollChanged);

        // act
        dataController.dispose();

        dataController.scrollChanged.fire();

        // assert
        assert.ok(dataSource, 'dataSource created');
        assert.ok(dataSource.isDisposed(), 'dataSource disposed');
        assert.ok(!onScrollChanged.called, 'onScrollChanged');
    });

    QUnit.test('dataSource by instance disposing', function(assert) {
        const dataSource = new PivotGridDataSource({});
        const dataController = new DataController({
            dataSource: dataSource
        });

        // act
        dataController.dispose();

        // assert
        assert.ok(dataSource, 'dataSource created');
        assert.strictEqual(dataController.getDataSource(), dataSource, 'DataController dataSource equal dataSource instance');
        assert.ok(!dataSource.isDisposed(), 'dataSource is not disposed');
        assert.ok(this.stateStoringController.dispose.calledOnce);
    });

    QUnit.test('columnsInfo when cells descriptions count === 1', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column', width: 100 },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });

        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true, width: 100 },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true, width: 100 }
            ]
        ]);
    });

    QUnit.test('columnsInfo when cells descriptions count === 1 and sorting by summary', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { sortBySummaryField: 'sum', sortBySummaryPath: ['A', 'P2'], area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],

                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true, sorted: true }
            ]
        ]);
    });

    QUnit.test('columnsInfo when cells descriptions count === 1 and sorting by summary when used key in summary Path', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { sortBySummaryField: 'sum', sortBySummaryPath: ['&[A]', '&[P2]'], area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],

                columns: [{
                    value: 'A', key: '&[A]', children: [{ value: 'P1', key: '&[P1]' }, { value: 'P2', key: '&[P2]' }]
                },
                { value: 'C1', key: '&[C1]' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['&[A]'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['&[A]'], type: 'T', isLast: true },
                { text: 'C1', rowspan: 2, expanded: false, path: ['&[C1]'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1', type: 'D', path: ['&[A]', '&[P1]'], isLast: true },
                { text: 'P2', type: 'D', path: ['&[A]', '&[P2]'], isLast: true, sorted: true }
            ]
        ]);
    });

    QUnit.test('columnsInfo when cells descriptions count === 1 and sorting by summary when caption path', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { sortBySummaryField: 'sum', sortBySummaryPath: ['Atext', 'P2text'], area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],

                columns: [{
                    value: 'A', key: '&[A]', text: 'Atext', children: [{ value: 'P1', key: '&[P1]', text: 'P1text' }, { value: 'P2', key: '&[P2]', text: 'P2text' }]
                },
                { value: 'C1', key: '&[C1]', text: 'C1text' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'Atext', colspan: 2, expanded: true, path: ['&[A]'], type: 'D' },
                { text: 'Atext Total', rowspan: 2, path: ['&[A]'], type: 'T', isLast: true },
                { text: 'C1text', rowspan: 2, expanded: false, path: ['&[C1]'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1text', type: 'D', path: ['&[A]', '&[P1]'], isLast: true },
                { text: 'P2text', type: 'D', path: ['&[A]', '&[P2]'], isLast: true, sorted: true }
            ]
        ]);
    });

    QUnit.test('Sort local total when sortBysummary path by caption', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { sortBySummaryField: 'sum', sortBySummaryPath: ['Atext'], area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],

                columns: [{
                    value: 'A', key: '&[A]', text: 'Atext', children: [{ value: 'P1', key: '&[P1]', text: 'P1text' }, { value: 'P2', key: '&[P2]', text: 'P2text' }]
                },
                { value: 'C1', key: '&[C1]', text: 'C1text' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'Atext', colspan: 2, expanded: true, path: ['&[A]'], type: 'D' },
                { text: 'Atext Total', rowspan: 2, path: ['&[A]'], type: 'T', isLast: true, sorted: true },
                { text: 'C1text', rowspan: 2, expanded: false, path: ['&[C1]'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1text', type: 'D', path: ['&[A]', '&[P1]'], isLast: true },
                { text: 'P2text', type: 'D', path: ['&[A]', '&[P2]'], isLast: true }
            ]
        ]);
    });

    QUnit.test('columnsInfo when cells descriptions count === 1 and sorting by summary when caption path and one level', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { sortBySummaryField: 'sum', sortBySummaryPath: ['Atext'], area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],

                columns: [
                    { value: 'A', key: '&[A]', text: 'Atext' },
                    { value: 'C1', key: '&[C1]', text: 'C1text' }
                ]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [[
            {
                expanded: false,
                isLast: true,
                path: [
                    '&[A]'
                ],
                sorted: true,
                text: 'Atext',
                type: 'D'
            },
            {
                expanded: false,
                isLast: true,
                path: [
                    '&[C1]'
                ],
                text: 'C1text',
                type: 'D'
            },
            {
                isLast: true,
                text: 'Grand Total',
                type: 'GT'
            }]]);
    });

    QUnit.test('columnsInfo when cells descriptions count === 1 and sorting by summary when key are used', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { sortBySummaryField: 'sum', sortBySummaryPath: ['A', 'P2'], area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],

                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true, sorted: true }
            ]
        ]);
    });

    QUnit.test('columnsInfo when cells descriptions count === 1 and sorting by summary for total', function(assert) {
        const dataController = new DataController({

            dataSource: {
                fields: [
                    { sortBySummaryField: 'sum', sortBySummaryPath: ['A'], area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],

                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true, sorted: true },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ]
        ]);
    });

    QUnit.test('columnsInfo when cells descriptions count === 1 when showColumnTotals disabled', function(assert) {
        const dataController = new DataController({
            showColumnTotals: false,

            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],

                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ]
        ]);
    });

    QUnit.test('columnsInfo when cells descriptions count === 1 when showColumnGrandTotals disabled', function(assert) {
        const dataController = new DataController({
            showColumnGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ]
        ]);
    });

    QUnit.test('columnsInfo and rowsInfo without dimension fields when showGrandTotals is disabled', function(assert) {
        const dataController = new DataController({
            showColumnGrandTotals: false,
            showRowGrandTotals: false,

            dataSource: {
                fields: [
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [],
                rows: []
            },
            texts: texts
        });

        assert.deepEqual(dataController.getColumnsInfo(), [[
            {
                text: undefined,
                type: undefined
            }
        ]], 'Columns Info');

        assert.deepEqual(dataController.getRowsInfo(), [[
            {
                text: undefined,
                type: undefined
            }
        ]], 'Rows Info');
    });

    QUnit.test('columnsInfo and rowsInfo without dimension fields when showGrandTotals is disabled on dataField level', function(assert) {
        const dataController = new DataController({

            dataSource: {
                fields: [
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data', showGrandTotals: false }
                ],
                columns: [],
                rows: []
            },
            texts: texts
        });

        assert.deepEqual(dataController.getColumnsInfo(), [[
            {
                isLast: true,
                text: 'Grand Total',
                type: 'GT'
            }
        ]], 'Columns Info');

        assert.deepEqual(dataController.getRowsInfo(), [[
            {
                isLast: true,
                text: 'Grand Total',
                type: 'GT'
            }
        ]], 'Rows Info');
    });

    QUnit.test('columnsInfo and rowsInfo without dimension fields when showGrandTotals is disabled on dataField level. Two data fields', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data', showGrandTotals: false },
                    { dataField: 'avg', caption: 'Avg', format: 'fixedPoint', area: 'data', showGrandTotals: false }
                ],
                columns: [],
                rows: []
            },
            texts: texts
        });

        assert.deepEqual(dataController.getColumnsInfo(), [[
            {
                text: 'Grand Total',
                type: 'GT',
                colspan: 2
            }
        ],
        [
            {
                dataIndex: 0,
                isLast: true,
                text: 'Sum',
                type: 'GT'
            },
            {
                dataIndex: 1,
                isLast: true,
                text: 'Avg',
                type: 'GT'
            }

        ]], 'Columns Info');

        assert.deepEqual(dataController.getRowsInfo(), [[
            {
                isLast: true,
                text: 'Grand Total',
                type: 'GT'
            }
        ]], 'Rows Info');
    });

    QUnit.test('columnsInfo and rowsInfo without dimension fields when showGrandTotals is disabled on dataField level. Two data fields, dataFieldArea = row', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data', showGrandTotals: false },
                    { dataField: 'avg', caption: 'Avg', format: 'fixedPoint', area: 'data', showGrandTotals: false }
                ],
                columns: [],
                rows: []
            },
            texts: texts,
            dataFieldArea: 'row'
        });

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                {
                    text: 'Grand Total',
                    type: 'GT',
                    rowspan: 2
                },
                {
                    dataIndex: 0,
                    isLast: true,
                    text: 'Sum',
                    type: 'GT'
                },
            ],
            [
                {
                    dataIndex: 1,
                    isLast: true,
                    text: 'Avg',
                    type: 'GT'
                }

            ]
        ], 'Rows Info');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            {
                isLast: true,
                text: 'Grand Total',
                type: 'GT'
            }
        ]], 'Columns Info');
    });

    QUnit.test('dataFieldArea: column, hasDimensionFields: true; columnsInfo and rowsInfo when showGrandTotals is disabled only for one field', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'row' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data', showGrandTotals: false },
                    { dataField: 'avg', caption: 'Avg', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{ value: 'column 1' }],
                rows: [{ value: 'row 1' }]
            },
            texts: texts,
            dataFieldArea: 'column'
        });

        assert.deepEqual(
            dataController.getColumnsInfo(),
            [[
                { type: 'D', text: 'column 1', path: [ 'column 1' ], colspan: 2 },
                { type: 'GT', text: 'Grand Total', }
            ],
            [
                { type: 'D', text: 'Sum', path: ['column 1'], dataIndex: 0, isLast: true },
                { type: 'D', text: 'Avg', path: ['column 1'], dataIndex: 1, isLast: true },
                { type: 'GT', text: 'Avg', dataIndex: 1, isLast: true }
            ]],
            'Columns Info'
        );

        assert.deepEqual(
            dataController.getRowsInfo(),
            [
                [{ type: 'D', text: 'row 1', path: ['row 1'], isLast: true }],
                [{ type: 'GT', text: 'Grand Total', isLast: true }]
            ],
            'Rows Info'
        );
    });

    QUnit.test('dataFieldArea: column, hasDimensionFields: false; columnsInfo and rowsInfo when showGrandTotals is disabled only for one field', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data', showGrandTotals: false },
                    { dataField: 'avg', caption: 'Avg', format: 'fixedPoint', area: 'data' }
                ],
                columns: [],
                rows: []
            },
            texts: texts,
            dataFieldArea: 'column'
        });

        assert.deepEqual(
            dataController.getColumnsInfo(),
            [
                [{ type: 'GT', text: 'Grand Total', }],
                [{ type: 'GT', text: 'Avg', dataIndex: 1, isLast: true }]
            ],
            'Columns Info'
        );

        assert.deepEqual(
            dataController.getRowsInfo(),
            [
                [{ type: 'GT', text: 'Grand Total', isLast: true, }]
            ],
            'Rows Info'
        );
    });

    QUnit.test('dataFieldArea: row, hasDimensionFields: true; columnsInfo and rowsInfo when showGrandTotals is disabled only for one field', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'row' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data', showGrandTotals: false },
                    { dataField: 'avg', caption: 'Avg', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{ value: 'column 1' }],
                rows: [{ value: 'row 1' }]
            },
            texts: texts,
            dataFieldArea: 'row'
        });

        assert.deepEqual(
            dataController.getColumnsInfo(),
            [[
                { type: 'D', text: 'column 1', path: ['column 1'], isLast: true },
                { type: 'GT', text: 'Grand Total', isLast: true }
            ]],
            'Columns Info'
        );

        assert.deepEqual(
            dataController.getRowsInfo(),
            [[
                { type: 'D', text: 'row 1', path: ['row 1'], rowspan: 2 },
                { type: 'D', text: 'Sum', path: ['row 1'], dataIndex: 0, isLast: true }
            ],
            [
                { type: 'D', text: 'Avg', path: ['row 1'], dataIndex: 1, isLast: true }
            ],
            [
                { type: 'GT', text: 'Grand Total' },
                { type: 'GT', text: 'Avg', dataIndex: 1, isLast: true }
            ]],
            'Rows Info'
        );
    });

    QUnit.test('dataFieldArea: row, hasDimensionFields: false; columnsInfo and rowsInfo when showGrandTotals is disabled only for one field', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data', showGrandTotals: false },
                    { dataField: 'avg', caption: 'Avg', format: 'fixedPoint', area: 'data' }
                ],
                columns: [],
                rows: []
            },
            texts: texts,
            dataFieldArea: 'row'
        });

        assert.deepEqual(
            dataController.getColumnsInfo(),
            [
                [{ type: 'GT', text: 'Grand Total', isLast: true }]
            ],
            'Columns Info'
        );

        assert.deepEqual(
            dataController.getRowsInfo(),
            [[
                { type: 'GT', text: 'Grand Total', },
                { type: 'GT', text: 'Avg', dataIndex: 1, isLast: true }
            ]],
            'Rows Info'
        );
    });

    QUnit.test('T541266. No dublicate cells in Chrome 60', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                rows: [{ 'value': 2014, 'index': 1, 'text': '2014', 'children': [{ 'value': 1, 'index': 10, 'text': 'Q1' }, { 'value': 2, 'index': 11, 'text': 'Q2' }, { 'value': 3, 'index': 12, 'text': 'Q3' }, { 'value': 4, 'index': 13, 'text': 'Q4' }] }, { 'value': 2015, 'index': 2, 'text': '2015', 'children': [{ 'value': 1, 'index': 4, 'text': 'Q1', 'children': [{ 'value': 1, 'index': 6, 'text': 'January' }, { 'value': 2, 'index': 7, 'text': 'February' }, { 'value': 3, 'index': 8, 'text': 'March' }] }] }]
            },
            texts: texts
        });

        const rowsInfo = dataController.getRowsInfo(true);

        assert.equal(rowsInfo[0].length, 2);
        assert.equal(rowsInfo[5].length, 3);
    });

    // B234872
    QUnit.test('columnsInfo with empty array children when cells descriptions count === 1', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1', children: [] }, { value: 'P2' }]
                },
                { value: 'C1', children: [] }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true },
                { text: 'C1', rowspan: 2, path: ['C1'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { text: 'P2', type: 'D', expanded: false, path: ['A', 'P2'], isLast: true }
            ]
        ]);
    });

    QUnit.test('columnsInfo with two expanded items when cells descriptions count === 1', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [
                    { value: 'A', children: [{ value: 'P1' }, { value: 'P2' }] },
                    { value: 'B' },
                    { value: 'C', children: [{ value: 'P3' }, { value: 'P4' }] }
                ]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true },
                { text: 'B', rowspan: 2, expanded: false, path: ['B'], type: 'D', isLast: true },
                { text: 'C', colspan: 2, expanded: true, path: ['C'], type: 'D' },
                { text: 'C Total', rowspan: 2, path: ['C'], type: 'T', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true },
                { text: 'P3', type: 'D', path: ['C', 'P3'], isLast: true },
                { text: 'P4', type: 'D', path: ['C', 'P4'], isLast: true }
            ]
        ]);
    });

    QUnit.test('columnsInfo when cells descriptions count > 1', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', area: 'data' }, { caption: 'Avg', area: 'data' }
                ],
                columns: [
                    {
                        value: 'A',
                        children: [{ value: 'P1' }, { value: 'P2' }]
                    },
                    { value: 'C1' }
                ]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 4, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, colspan: 2, path: ['A'], type: 'T' },
                { text: 'C1', rowspan: 2, colspan: 2, expanded: false, path: ['C1'], type: 'D' },
                { text: 'Grand Total', rowspan: 2, colspan: 2, type: 'GT' }
            ],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], colspan: 2 },
                { text: 'P2', type: 'D', path: ['A', 'P2'], colspan: 2 }
            ],
            [
                { text: 'Sum', type: 'D', isLast: true, path: ['A', 'P1'], dataIndex: 0 },
                { text: 'Avg', type: 'D', isLast: true, path: ['A', 'P1'], dataIndex: 1 },
                { text: 'Sum', type: 'D', isLast: true, path: ['A', 'P2'], dataIndex: 0 },
                { text: 'Avg', type: 'D', isLast: true, path: ['A', 'P2'], dataIndex: 1 },
                { text: 'Sum', type: 'T', isLast: true, path: ['A'], dataIndex: 0 },
                { text: 'Avg', type: 'T', isLast: true, path: ['A'], dataIndex: 1 },
                { text: 'Sum', type: 'D', isLast: true, path: ['C1'], dataIndex: 0 },
                { text: 'Avg', type: 'D', isLast: true, path: ['C1'], dataIndex: 1 },
                { text: 'Sum', type: 'GT', isLast: true, dataIndex: 0 },
                { text: 'Avg', type: 'GT', isLast: true, dataIndex: 1 }
            ]
        ]);
    });

    QUnit.test('rowsInfo when cells descriptions count > 1. dataFieldArea is \'rowArea\'', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row', width: 100 },
                    { caption: 'Sum', area: 'data' }, { caption: 'Avg', area: 'data' }
                ],
                rows: [{ value: 'A' }]
            },
            texts: texts,
            dataFieldArea: 'row'
        });
        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { expanded: false, path: ['A'], rowspan: 2, text: 'A', type: 'D' },
                { dataIndex: 0, isLast: true, path: ['A'], text: 'Sum', type: 'D' }
            ],
            [
                { dataIndex: 1, isLast: true, path: ['A'], text: 'Avg', type: 'D' }
            ],
            [
                { rowspan: 2, text: 'Grand Total', type: 'GT' },
                { dataIndex: 0, isLast: true, text: 'Sum', type: 'GT' }
            ],
            [
                { dataIndex: 1, isLast: true, text: 'Avg', type: 'GT' }
            ]
        ]);
    });

    QUnit.test('Pass wordWrapEnabled option to HeaderInfo', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row', wordWrapEnabled: true }, { area: 'row', width: 100, wordWrapEnabled: false },
                    { caption: 'Sum', area: 'data', wordWrapEnabled: true }, { caption: 'Avg', area: 'data' }
                ],
                rows: [{ value: 'A', children: [{ value: 'a' }] }]
            },
            texts: texts,
            dataFieldArea: 'row'
        });
        assert.deepEqual(dataController.getRowsInfo(), [
            [
                {
                    'expanded': true,
                    'path': [
                        'A'
                    ],
                    'rowspan': 2,
                    'text': 'A',
                    'type': 'D',
                    'wordWrapEnabled': true
                },
                {
                    'path': [
                        'A',
                        'a'
                    ],
                    'rowspan': 2,
                    'text': 'a',
                    'type': 'D',
                    'width': 100,
                    'wordWrapEnabled': false
                },
                {
                    'dataIndex': 0,
                    'isLast': true,
                    'path': [
                        'A',
                        'a'
                    ],
                    'text': 'Sum',
                    'type': 'D',
                    wordWrapEnabled: true
                }
            ],
            [
                {
                    'dataIndex': 1,
                    'isLast': true,
                    'path': [
                        'A',
                        'a'
                    ],
                    'text': 'Avg',
                    'type': 'D'
                }
            ],
            [
                {
                    'colspan': 2,
                    'path': [
                        'A'
                    ],
                    'rowspan': 2,
                    'text': 'A Total',
                    'type': 'T',
                    'wordWrapEnabled': true
                },
                {
                    'dataIndex': 0,
                    'isLast': true,
                    'path': [
                        'A'
                    ],
                    'text': 'Sum',
                    'type': 'T',
                    'wordWrapEnabled': true
                }
            ],
            [
                {
                    'dataIndex': 1,
                    'isLast': true,
                    'path': [
                        'A'
                    ],
                    'text': 'Avg',
                    'type': 'T'
                }
            ],
            [
                {
                    'colspan': 2,
                    'rowspan': 2,
                    'text': 'Grand Total',
                    'type': 'GT',
                    'wordWrapEnabled': true
                },
                {
                    'dataIndex': 0,
                    'isLast': true,
                    'text': 'Sum',
                    'type': 'GT',
                    wordWrapEnabled: true
                }
            ],
            [
                {
                    'dataIndex': 1,
                    'isLast': true,
                    'text': 'Avg',
                    'type': 'GT'
                }
            ]
        ]);
    });


    QUnit.test('columnsInfo when cells descriptions count > 1 when sorting by summary', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { sortBySummaryField: 'sum', sortBySummaryPath: ['A', 'P2'], area: 'row' }, { sortBySummaryField: 'avg', area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { dataField: 'sum', caption: 'Sum', area: 'data' }, { dataField: 'avg', caption: 'Avg', area: 'data' }
                ],
                columns: [
                    {
                        value: 'A',
                        children: [{ value: 'P1' }, { value: 'P2' }]
                    },
                    { value: 'C1' }
                ]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 4, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, colspan: 2, path: ['A'], type: 'T' },
                { text: 'C1', rowspan: 2, colspan: 2, expanded: false, path: ['C1'], type: 'D' },
                { text: 'Grand Total', rowspan: 2, colspan: 2, type: 'GT' }
            ],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], colspan: 2 },
                { text: 'P2', type: 'D', path: ['A', 'P2'], colspan: 2 }
            ],
            [
                { text: 'Sum', type: 'D', isLast: true, path: ['A', 'P1'], dataIndex: 0 },
                { text: 'Avg', type: 'D', isLast: true, path: ['A', 'P1'], dataIndex: 1 },
                { text: 'Sum', type: 'D', isLast: true, path: ['A', 'P2'], dataIndex: 0, sorted: true },
                { text: 'Avg', type: 'D', isLast: true, path: ['A', 'P2'], dataIndex: 1 },
                { text: 'Sum', type: 'T', isLast: true, path: ['A'], dataIndex: 0 },
                { text: 'Avg', type: 'T', isLast: true, path: ['A'], dataIndex: 1 },
                { text: 'Sum', type: 'D', isLast: true, path: ['C1'], dataIndex: 0 },
                { text: 'Avg', type: 'D', isLast: true, path: ['C1'], dataIndex: 1 },
                { text: 'Sum', type: 'GT', isLast: true, dataIndex: 0 },
                { text: 'Avg', type: 'GT', isLast: true, dataIndex: 1, sorted: true }
            ]
        ]);
    });

    // B234872
    QUnit.test('columnsInfo with empty array children when cells descriptions count > 1', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', area: 'data' }, { caption: 'Avg', area: 'data' }
                ],
                columns: [
                    {
                        value: 'A',
                        children: [{ value: 'P1' }, { value: 'P2' }]
                    },
                    { value: 'C1', children: [] }
                ]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 4, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, colspan: 2, path: ['A'], type: 'T' },
                { text: 'C1', rowspan: 2, colspan: 2, path: ['C1'], type: 'D' },
                { text: 'Grand Total', rowspan: 2, colspan: 2, type: 'GT' }
            ],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], colspan: 2 },
                { text: 'P2', type: 'D', path: ['A', 'P2'], colspan: 2 }
            ],
            [
                { text: 'Sum', type: 'D', isLast: true, path: ['A', 'P1'], dataIndex: 0 },
                { text: 'Avg', type: 'D', isLast: true, path: ['A', 'P1'], dataIndex: 1 },
                { text: 'Sum', type: 'D', isLast: true, path: ['A', 'P2'], dataIndex: 0 },
                { text: 'Avg', type: 'D', isLast: true, path: ['A', 'P2'], dataIndex: 1 },
                { text: 'Sum', type: 'T', isLast: true, path: ['A'], dataIndex: 0 },
                { text: 'Avg', type: 'T', isLast: true, path: ['A'], dataIndex: 1 },
                { text: 'Sum', type: 'D', isLast: true, path: ['C1'], dataIndex: 0 },
                { text: 'Avg', type: 'D', isLast: true, path: ['C1'], dataIndex: 1 },
                { text: 'Sum', type: 'GT', isLast: true, dataIndex: 0 },
                { text: 'Avg', type: 'GT', isLast: true, dataIndex: 1 }
            ]
        ]);
    });

    QUnit.test('columnsInfo when no column descriptions', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [{ text: 'Grand Total', type: 'GT', isLast: true }]
        ]);
    });

    QUnit.test('columns formatting', function(assert) {
        const customizeTextThisObjects = [];
        const column = {
            area: 'column',
            areaIndex: 0,
            format: 'decimal', customizeText: function(e) {
                customizeTextThisObjects.push(this);
                return e.valueText + ' year';
            },
            caption: 'Caption'
        };
        const dataController = new DataController({
            dataSource: {
                fields: [
                    column,
                    { format: 'month', area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],

                columns: [{
                    value: 2009, children: [{ value: new Date(2009, 5, 11) }, { value: new Date(2009, 7, 5) }]
                },
                { value: 2010 }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: '2009 year', colspan: 2, expanded: true, path: [2009], type: 'D' },
                { text: '2009 year Total', rowspan: 2, path: [2009], type: 'T', isLast: true },
                { text: '2010 year', rowspan: 2, expanded: false, path: [2010], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { text: 'June', type: 'D', path: [2009, new Date(2009, 5, 11)], isLast: true },
                { text: 'August', type: 'D', path: [2009, new Date(2009, 7, 5)], isLast: true }
            ]
        ]);

        assert.strictEqual(customizeTextThisObjects.length, 2); // TODO

        const compareColumn = $.extend({ index: 0 }, column);
        assert.deepEqual(customizeTextThisObjects[0], compareColumn);
        assert.deepEqual(customizeTextThisObjects[1], compareColumn);
    });

    QUnit.test('rowsInfo', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { width: 100, area: 'row' }, { area: 'row' },
                    { sortBySummaryField: 'sum', sortBySummaryPath: ['A', 'P2'], area: 'column' },
                    { dataField: 'sum', caption: 'Sum', area: 'data' }
                ],
                rows: [{
                    value: 'A',
                    children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }
                ]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: 'A', rowspan: 2, expanded: true, path: ['A'], type: 'D', width: 100 },
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true }
            ], [
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true, sorted: true }
            ], [
                { text: 'A Total', colspan: 2, path: ['A'], type: 'T', isLast: true }
            ], [
                { text: 'C1', colspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true, width: 100 }
            ], [
                { text: 'Grand Total', colspan: 2, type: 'GT', isLast: true }
            ]
        ]);
    });

    QUnit.test('rowsInfo when showRowTotals disabled', function(assert) {
        const dataController = new DataController({
            showRowTotals: false,
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { caption: 'Sum', area: 'data' }
                ],
                rows: [{
                    value: 'A',
                    children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }
                ]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: 'A', rowspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true }
            ], [
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ], [
                { text: 'C1', colspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ], [
                { text: 'Grand Total', colspan: 2, type: 'GT', isLast: true }
            ]
        ]);
    });

    QUnit.test('rowsInfo when showRowGrandTotals disabled', function(assert) {
        const dataController = new DataController({
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { caption: 'Sum', area: 'data' }
                ],
                rows: [{
                    value: 'A',
                    children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }
                ]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: 'A', rowspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true }
            ], [
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ], [
                { text: 'A Total', colspan: 2, path: ['A'], type: 'T', isLast: true }
            ], [
                { text: 'C1', colspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ]
        ]);
    });

    QUnit.test('rowsInfo when no row fields', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [{ area: 'data' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getRowsInfo(), [
            [{ text: 'Grand Total', type: 'GT', isLast: true }]
        ]);
    });

    QUnit.test('rows formatting', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row', format: 'decimal' }, { area: 'row', format: 'month' },
                    { caption: 'Sum', area: 'data' }
                ],
                rows: [{
                    value: 2009,
                    children: [{ value: new Date(2009, 3, 5) }]
                }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: '2009', expanded: true, path: [2009], type: 'D' },
                { text: 'April', type: 'D', path: [2009, new Date(2009, 3, 5)], isLast: true }
            ], [
                { text: '2009 Total', colspan: 2, path: [2009], type: 'T', isLast: true }
            ], [
                { text: 'Grand Total', colspan: 2, type: 'GT', isLast: true }
            ]
        ]);
    });

    QUnit.test('cellInfo when cells descriptions count === 1', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });

        assert.deepEqual(dataController.getCellsInfo()[0][4].columnPath, []);
        assert.deepEqual(dataController.getCellsInfo()[0][1].columnPath, ['A', 'P2']);
        assert.deepEqual(dataController.getCellsInfo()[0][2].columnPath, ['A']);

        assert.deepEqual(dataController.getCellsInfo()[0][4].rowPath, ['Vasya']);
        assert.deepEqual(dataController.getCellsInfo()[2][1].rowPath, []);

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'T', rowType: 'D', text: '1' },
                { columnType: 'D', rowType: 'D', text: '6' },
                { columnType: 'GT', rowType: 'D', text: '12' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'GT', rowType: 'D', text: '18' }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'T', rowType: 'GT', text: '3' },
                { columnType: 'D', rowType: 'GT', text: '15' },
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ]]);
    });

    QUnit.test('Get Cell info for column depth = 3', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1, children: [{ value: 'P11', index: 2 }, { value: 'P12', index: 3 }] }, { value: 'P2', index: 4 }]
                },
                { value: 'C', index: 5 }],
                values: [
                    [3, 5, 7, 15, 30]
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [[
            { columnType: 'D', rowType: 'GT', text: '7' },
            { columnType: 'D', rowType: 'GT', text: '15' },
            { columnType: 'T', rowType: 'GT', text: '5' },
            { columnType: 'D', rowType: 'GT', text: '30' },
            { columnType: 'T', rowType: 'GT', text: '3' },
            { columnType: 'D', rowType: 'GT', text: '' },
            { columnType: 'GT', rowType: 'GT', text: '' }
        ]]);
    });

    QUnit.test('get cells info with hidden data field', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' },
                    { caption: 'Sum', area: 'data', visible: false },
                    { caption: 'Avg', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }],
                columns: [{ value: 'A', index: 0 }],
                values: [
                    [[3, 4], [12, 13]],
                    [[7, 8], [30, 31]]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'GT', rowType: 'D', text: '13' }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '8' },
                { columnType: 'GT', rowType: 'GT', text: '31' }
            ],
        ]);
    });

    QUnit.test('cellInfo when cells when no dataFields', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [100]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [],
            [],
            []
        ]);
    });

    QUnit.test('cellInfo when cells descriptions count === 1 when showTotals disabled', function(assert) {
        const dataController = new DataController({
            showRowTotals: false,
            showColumnTotals: false,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });

        assert.deepEqual(dataController.getCellsInfo()[0][3].columnPath, []);
        assert.deepEqual(dataController.getCellsInfo()[0][0].columnPath, ['A', 'P1']);
        assert.deepEqual(dataController.getCellsInfo()[0][1].columnPath, ['A', 'P2']);
        assert.deepEqual(dataController.getCellsInfo()[0][2].columnPath, ['C']);

        assert.deepEqual(dataController.getCellsInfo()[0][3].rowPath, ['Vasya']);
        assert.deepEqual(dataController.getCellsInfo()[2][1].rowPath, []);

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '6' },
                { columnType: 'GT', rowType: 'D', text: '12' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'GT', rowType: 'D', text: '18' }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'D', rowType: 'GT', text: '15' },
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ]]);
    });

    QUnit.test('cellInfo when cells descriptions count === 1 when showGrandTotals disabled', function(assert) {
        const dataController = new DataController({
            showRowGrandTotals: false,
            showColumnGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'T', rowType: 'D', text: '1' },
                { columnType: 'D', rowType: 'D', text: '6' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '9' }
            ]]);

    });

    QUnit.test('cellInfo when no columns and when showGrandTotals disabled', function(assert) {
        const dataController = new DataController({
            showRowGrandTotals: false,
            showColumnGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [],
                values: [
                    [1],
                    [2],
                    [3]
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [[], []]);
    });

    QUnit.test('cellInfo when cells descriptions count > 1', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }, { caption: 'Avg', format: 'decimal', width: 100, area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [[1, 2], [2, 3], [3, 4], [6, 7], [12, 13]],
                    [[2, 3], [3, 4], [4, 5], [9, 10], [18, 19]],
                    [[3, 4], [5, 6], [7, 8], [15, 16], [30, 31]]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3', width: 100 },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4', width: 100 },
                { columnType: 'T', rowType: 'D', text: '1' },
                { columnType: 'T', rowType: 'D', text: '2', width: 100 },
                { columnType: 'D', rowType: 'D', text: '6' },
                { columnType: 'D', rowType: 'D', text: '7', width: 100 },
                { columnType: 'GT', rowType: 'D', text: '12' },
                { columnType: 'GT', rowType: 'D', text: '13', width: 100 }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4', width: 100 },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'D', rowType: 'D', text: '5', width: 100 },
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'T', rowType: 'D', text: '3', width: 100 },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'D', rowType: 'D', text: '10', width: 100 },
                { columnType: 'GT', rowType: 'D', text: '18' },
                { columnType: 'GT', rowType: 'D', text: '19', width: 100 }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '6', width: 100 },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'D', rowType: 'GT', text: '8', width: 100 },
                { columnType: 'T', rowType: 'GT', text: '3' },
                { columnType: 'T', rowType: 'GT', text: '4', width: 100 },
                { columnType: 'D', rowType: 'GT', text: '15' },
                { columnType: 'D', rowType: 'GT', text: '16', width: 100 },
                { columnType: 'GT', rowType: 'GT', text: '30' },
                { columnType: 'GT', rowType: 'GT', text: '31', width: 100 }
            ]]);
    });

    QUnit.test('cellInfo when cells descriptions count === 1, dataFieldArea = row', function(assert) {
        const dataController = new DataController({
            dataFieldArea: 'row',
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' },
                    { caption: 'Sum1', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }],
                columns: [{ value: 'A', index: 0 }],
                values: [
                    [[0, 2], [1, 3]],
                    [[4, 6], [5, 7]]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '0' },
                { columnType: 'GT', rowType: 'D', text: '1' }
            ], [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'GT', rowType: 'D', text: '3' }
            ], [
                { columnType: 'D', rowType: 'GT', text: '4' },
                { columnType: 'GT', rowType: 'GT', text: '5' }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '6' },
                { columnType: 'GT', rowType: 'GT', text: '7' }
            ]]);
    });

    QUnit.test('cellInfo when no column descriptions', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                values: [
                    [12],
                    [18],
                    [30]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [{ columnType: 'GT', rowType: 'D', text: '12' }],
            [{ columnType: 'GT', rowType: 'D', text: '18' }],
            [{ columnType: 'GT', rowType: 'GT', text: '30' }]]);
    });

    QUnit.test('collapse column item', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        assert.ok(dataController.collapseHeaderItem('column', ['A']));
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', expanded: false, path: ['A'], type: 'D', isLast: true },
                { text: 'C1', expanded: false, path: ['C1'], type: 'D', isLast: true },
                { text: 'Grand Total', type: 'GT', isLast: true }
            ]
        ]);
    });

    QUnit.test('collapse column item second level', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1', children: [{ value: 'P11' }, { value: 'P12' }] }, { value: 'P2', children: [{ value: 'P21' }, { value: 'P22' }] }]
                },
                { value: 'C' }]
            },
            texts: texts
        });
        assert.ok(dataController.collapseHeaderItem('column', ['A', 'P2']));
        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { colspan: 4, expanded: true, path: ['A'], text: 'A', type: 'D' },
                { rowspan: 3, text: 'A Total', path: ['A'], type: 'T', isLast: true },
                { expanded: false, path: ['C'], rowspan: 3, text: 'C', type: 'D', isLast: true },
                { rowspan: 3, text: 'Grand Total', type: 'GT', isLast: true }
            ],
            [
                { colspan: 2, expanded: true, path: ['A', 'P1'], text: 'P1', type: 'D' },
                { rowspan: 2, text: 'P1 Total', path: ['A', 'P1'], type: 'T', isLast: true },
                { expanded: false, path: ['A', 'P2'], rowspan: 2, text: 'P2', type: 'D', isLast: true }
            ],
            [
                { isLast: true, text: 'P11', path: ['A', 'P1', 'P11'], type: 'D' },
                { isLast: true, text: 'P12', path: ['A', 'P1', 'P12'], type: 'D' }
            ]]);
    });

    QUnit.test('collapse column item for incorrect path', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            }
        });

        // act, assert
        assert.ok(!dataController.collapseHeaderItem('column', ['A', 'P3']));
    });

    QUnit.test('collapse collapsed item', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C' }]
            }
        });

        // act, assert
        assert.ok(!dataController.collapseHeaderItem('column', ['C']));
    });

    QUnit.test('collapse row item', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });

        // act
        assert.ok(dataController.collapseHeaderItem('row', ['A']));

        // assert
        assert.deepEqual(dataController.getRowsInfo(), [
            [{ text: 'A', expanded: false, path: ['A'], type: 'D', isLast: true }],
            [{ text: 'C1', expanded: false, path: ['C1'], type: 'D', isLast: true }],
            [{ text: 'Grand Total', type: 'GT', isLast: true }]
        ]);

    });

    QUnit.test('expand collapsed column item', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        assert.ok(dataController.collapseHeaderItem('column', ['A']));

        // act, assert
        assert.ok(dataController.expandHeaderItem('column', ['A']));

        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }
            ],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ]
        ]);
    });

    QUnit.test('expand not collapsed column item', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C' }]
            }
        });
        const changedSpy = sinon.spy();
        const expandValueChangingSpy = sinon.spy();
        dataController.changed.add(changedSpy);
        dataController.expandValueChanging.add(expandValueChangingSpy);

        // act, assert
        assert.ok(!dataController.expandHeaderItem('column', ['C']));
        // when expandHeaderItem return false, need request for partial dataController for children

        assert.strictEqual(expandValueChangingSpy.callCount, 1, 'expandValueChanging is called');
        // T887002
        assert.strictEqual(changedSpy.callCount, 0, 'changed is not called');
    });

    QUnit.test('apply partial dataController with columns path', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        dataController.applyPartialDataSource('column', ['C'], {
            columns: [{ value: 'P3', index: 0 }, { value: 'P4', index: 1 }],
            rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
            values: [
                [],
                [4, 5],
                [8, 7]
            ]
        });
        assert.deepEqual(prepareLoadedData(dataController.getData().columns), [
            { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
            { value: 'C', index: 3, children: [{ value: 'P3', index: 5 }, { value: 'P4', index: 6 }] }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell && cell.text;
            }));
        });
        assert.deepEqual(cells, [
            ['1', '2', '3', '', '', '6', '12'],
            ['2', '3', '4', '4', '5', '9', '18'],
            ['3', '5', '7', '8', '7', '15', '30']
        ]);
    });

    QUnit.test('Apply partial dataController with empty data. Update columns', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        dataController.applyPartialDataSource('column', ['C'], {
            columns: [],
            rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
            values: [
                [0]
            ]
        });
        assert.deepEqual(prepareLoadedData(dataController.getData().columns), [
            { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
            { value: 'C', index: 3, children: [] }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell && cell.text;
            }));
        });
        assert.deepEqual(cells, [
            ['1', '2', '3', '6', '12'],
            ['2', '3', '4', '9', '18'],
            ['3', '5', '7', '15', '30']
        ]);
    });

    QUnit.test('Apply partial dataController with empty data. Update rows', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        dataController.applyPartialDataSource('row', ['Piter'], {
            columns: [
                { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                { value: 'C', index: 3 }
            ],
            rows: [],
            values: [
                [0]
            ]
        });
        assert.deepEqual(prepareLoadedData(dataController.getData().rows), [
            { value: 'Vasya', index: 0 }, { value: 'Piter', index: 1, children: [] }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell && cell.text;
            }));
        });
        assert.deepEqual(cells, [
            ['1', '2', '3', '6', '12'],
            ['2', '3', '4', '9', '18'],
            ['3', '5', '7', '15', '30']
        ]);
    });

    // T737140
    QUnit.test('Apply partial dataController by rows after column collapsing', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });

        dataController.collapseHeaderItem('column', ['A']);

        dataController.applyPartialDataSource('row', ['Piter'], {
            columns: [
                { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                { value: 'C', index: 3 }
            ],
            rows: [
                { value: 'T1', index: 0 }
            ],
            values: [
                [1, 2, 3, 6, 12]
            ]
        });

        assert.deepEqual(prepareLoadedData(dataController.getData().rows), [
            { value: 'Vasya', index: 0 },
            { value: 'Piter', index: 1, children: [{
                value: 'T1',
                index: 3
            }] }
        ]);

        assert.deepEqual(prepareLoadedData(dataController.getData().columns), [
            { value: 'A', index: 2 },
            { value: 'C', index: 3 }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell && cell.text;
            }));
        });
        assert.deepEqual(cells, [
            ['3', '6', '12'],
            ['3', '6', '12'],
            ['4', '9', '18'],
            ['7', '15', '30']
        ]);
    });

    QUnit.test('Apply partial dataController with empty data. Update Rows', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        dataController.applyPartialDataSource('row', ['Vasya'], {
            columns: [],
            rows: [],
            values: [
                [0]
            ]
        });
        assert.deepEqual(prepareLoadedData(dataController.getData().rows), [
            { value: 'Vasya', index: 0, children: [] }, { value: 'Piter', index: 1 }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell && cell.text;
            }));
        });
        assert.deepEqual(cells, [
            ['1', '2', '3', '6', '12'],
            ['2', '3', '4', '9', '18'],
            ['3', '5', '7', '15', '30']
        ]);
    });

    // B234872
    QUnit.test('apply partial dataController with empty data', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });

        // act
        dataController.applyPartialDataSource('column', ['C'], {
            columns: [],
            rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
            values: []
        });

        // assert
        assert.deepEqual(prepareLoadedData(dataController.getData().columns), [
            { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
            { value: 'C', index: 3, children: [] }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell ? cell.text : '';
            }));
        });
        assert.deepEqual(cells, [
            ['1', '2', '3', '6', '12'],
            ['2', '3', '4', '9', '18'],
            ['3', '5', '7', '15', '30']
        ]);
    });

    // B234219
    QUnit.test('collapse column after apply partial dataController with column path', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        dataController.applyPartialDataSource('column', ['C'], {
            columns: [{ value: 'P3', index: 0 }, { value: 'P4', index: 1 }],
            rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
            values: [
                [4, 2],
                [4, 5],
                [8, 7]
            ]
        });
        dataController.collapseHeaderItem('column', ['C']);

        assert.deepEqual(prepareLoadedData(dataController.getData().columns), [
            { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
            { value: 'C', index: 3, collapsedChildren: [{ value: 'P3', index: 5, text: 'P3' }, { value: 'P4', index: 6, text: 'P4' }] }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell ? cell.text : '';
            }));
        });
        assert.deepEqual(cells, [
            ['1', '2', '3', '6', '12'],
            ['2', '3', '4', '9', '18'],
            ['3', '5', '7', '15', '30']
        ]);
    });

    QUnit.test('apply partial dataController with columns path, removed row item', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        dataController.applyPartialDataSource('column', ['C'], {
            columns: [{ value: 'P3', index: 0 }, { value: 'P4', index: 1 }],
            rows: [{ value: 'Piter', index: 0 }],
            values: [
                [4, 5],
                [4, 5]
            ]
        });
        assert.deepEqual(prepareLoadedData(dataController.getData().columns), [
            { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
            { value: 'C', index: 3, children: [{ value: 'P3', index: 5 }, { value: 'P4', index: 6 }] }
        ]);

        assert.deepEqual(prepareLoadedData(dataController.getData().rows), [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell ? cell.text : '';
            }));
        });
        assert.deepEqual(cells, [
            ['1', '2', '3', '', '', '6', '12'],
            ['2', '3', '4', '4', '5', '9', '18'],
            ['3', '5', '7', '4', '5', '15', '30']
        ]);
    });

    QUnit.test('apply partial dataController with columns path length 2', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });

        dataController.applyPartialDataSource('column', ['A', 'P1'], {
            columns: [{ value: 'P11', index: 0 }, { value: 'P12', index: 1 }],
            rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
            values: [
                [1, 0],
                [1, 1],
                [2, 1]
            ]
        });
        assert.deepEqual(prepareLoadedData(dataController.getData().columns), [
            { value: 'A', index: 2, children: [{ value: 'P1', index: 0, children: [{ value: 'P11', index: 5 }, { value: 'P12', index: 6 }] }, { value: 'P2', index: 1 }] },
            { value: 'C', index: 3 }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell ? cell.text : '';
            }));
        });
        assert.deepEqual(cells, [
            ['1', '0', '1', '2', '3', '6', '12'],
            ['1', '1', '2', '3', '4', '9', '18'],
            ['2', '1', '3', '5', '7', '15', '30']
        ]);
    });

    QUnit.test('apply partial dataController with rows path', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                columns: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                values: [
                    [1, 2, 3],
                    [2, 3, 5],
                    [3, 4, 7],
                    [6, 9, 15],
                    [12, 18, 30]
                ]
            }
        });

        dataController.applyPartialDataSource('row', ['C'], {
            rows: [{ value: 'P3', index: 0 }, { value: 'P4', index: 1 }],
            columns: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
            values: [
                [4, 4, 8],
                [2, 5, 7]
            ]
        });
        assert.deepEqual(prepareLoadedData(dataController.getData().rows), [
            { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
            { value: 'C', index: 3, children: [{ value: 'P3', index: 5 }, { value: 'P4', index: 6 }] }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell ? cell.text : '';
            }));
        });
        assert.deepEqual(cells, [
            ['1', '2', '3'],
            ['2', '3', '5'],
            ['3', '4', '7'],
            ['4', '4', '8'],
            ['2', '5', '7'],
            ['6', '9', '15'],
            ['12', '18', '30']
        ]);
    });

    // B234219
    QUnit.test('collapse row after apply partial dataController with rows path', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                columns: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                values: [
                    [1, 2, 3],
                    [2, 3, 5],
                    [3, 4, 7],
                    [6, 9, 15],
                    [12, 18, 30]
                ]
            }
        });
        dataController.applyPartialDataSource('row', ['C'], {
            rows: [{ value: 'P3', index: 0 }, { value: 'P4', index: 1 }],
            columns: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
            values: [
                [4, 4, 8],
                [2, 5, 7]
            ]
        });
        dataController.collapseHeaderItem('row', ['C']);
        assert.deepEqual(prepareLoadedData(dataController.getData().rows), [
            { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
            { value: 'C', index: 3, collapsedChildren: [{ value: 'P3', index: 5, text: 'P3' }, { value: 'P4', index: 6, text: 'P4' }] }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell ? cell.text : '';
            }));
        });
        assert.deepEqual(cells, [
            ['1', '2', '3'],
            ['2', '3', '5'],
            ['3', '4', '7'],
            ['6', '9', '15'],
            ['12', '18', '30']
        ]);
    });

    // B232736
    QUnit.test('lost cells after several collapse/expand/applyPartialDataSource', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'C', index: 1 }
                ],
                columns: [{ value: 'Vasya', index: 0 }],
                values: [
                    [3, 3],
                    [6, 6],
                    [12, 12]
                ]
            }
        });
        dataController.applyPartialDataSource('row', ['A'], {
            rows: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }],
            columns: [{ value: 'Vasya', index: 0 }],
            values: [
                [1, 1],
                [2, 2]
            ]
        });
        dataController.collapseHeaderItem('row', ['A']);
        dataController.applyPartialDataSource('row', ['C'], {
            rows: [{ value: 'P3', index: 0 }, { value: 'P4', index: 1 }],
            columns: [{ value: 'Vasya', index: 0 }],
            values: [
                [4, 4],
                [2, 2]
            ]
        });
        dataController.expandHeaderItem('row', ['A']);
        assert.deepEqual(prepareLoadedData(dataController.getData().rows), [
            { value: 'A', index: 0, children: [{ value: 'P1', index: 3 }, { value: 'P2', index: 4 }] },
            { value: 'C', index: 1, children: [{ value: 'P3', index: 5 }, { value: 'P4', index: 6 }] }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell ? cell.text : '';
            }));
        });
        assert.deepEqual(cells, [
            ['1', '1'],
            ['2', '2'],
            ['3', '3'],
            ['4', '4'],
            ['2', '2'],
            ['6', '6'],
            ['12', '12']
        ]);
    });

    QUnit.test('apply partial dataController with rows path when no column descriptions', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { area: 'column' },
                    { caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1],
                    [2],
                    [3],
                    [6],
                    [12]
                ]
            }
        });
        dataController.applyPartialDataSource('row', ['C'], {
            rows: [{ value: 'P3', index: 0 }, { value: 'P4', index: 1 }],
            values: [
                [4],
                [2]
            ]
        });
        assert.deepEqual(prepareLoadedData(dataController.getData().rows), [
            { value: 'A', index: 2, children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }] },
            { value: 'C', index: 3, children: [{ value: 'P3', index: 5 }, { value: 'P4', index: 6 }] }
        ]);

        const cells = [];
        $.each(dataController.getCellsInfo(), function() {
            cells.push($.map(this, function(cell) {
                return cell ? cell.text : '';
            }));
        });
        assert.deepEqual(cells, [
            ['1'],
            ['2'],
            ['3'],
            ['4'],
            ['2'],
            ['6'],
            ['12']
        ]);
    });

    // Q561802
    QUnit.test('Header item text for an item with displayText equal to empty string', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column', caption: 'column' },
                    { caption: 'value', format: 'fixedPoint', area: 'data' }
                ],
                rows: [],
                columns: [{ value: 'columnValue1', displayText: '', index: 0 }, { value: 'columnValue2', displayText: 'value2', index: 1 }],
                values: [
                    [1, 2]
                ]
            }
        });

        assert.equal(dataController.getColumnsInfo()[0][0].text, '');
    });

    QUnit.test('update options', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column', width: 100 },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        dataController.changed.add(assertFunction);

        dataController.updateViewOptions({
            showColumnTotals: false,
            texts: {
                grandTotal: 'Total'
            }
        });


        function assertFunction() {
            assert.deepEqual(dataController.getColumnsInfo(), [
                [
                    { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                    { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true },
                    { text: 'Total', rowspan: 2, type: 'GT', isLast: true }],
                [
                    { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true, width: 100 },
                    { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true, width: 100 }
                ]
            ]);
        }

    });

    QUnit.test('Hide empty columns in a single group', function(assert) {
        const dataController = new DataController({
            hideEmptySummaryCells: true,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0, isEmpty: [true],
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3, isEmpty: [true] }],
                values: [
                    [null, 2, 3, null, 12],
                    [null, 3, 4, null, 18],
                    [null, 5, 7, null, 30]
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '2'
                }, {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '3'
                }, {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '12'
                }],
            [
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '3'
                },
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '4'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '18'
                }
            ], [
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '5'
                },
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '7'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'GT',
                    'text': '30'
                }]
        ], 'cells info');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            {
                dataSourceIndex: 0,
                'colspan': 2,
                'expanded': true,
                'path': [
                    'A'
                ],
                'text': 'A',
                'type': 'D'
            },
            {
                'isLast': true,
                'rowspan': 2,
                'text': undefined,
                'type': 'GT'
            }
        ],
        [
            {
                'dataSourceIndex': 1,
                'isLast': true,
                'path': [
                    'A',
                    'P1'
                ],
                'text': 'P1',
                'type': 'D'
            },
            {
                'dataSourceIndex': 2,
                'isLast': true,
                'path': [
                    'A',
                    'P2'
                ],
                'text': 'P2',
                'type': 'D'
            }
        ]]);
        assert.strictEqual(dataController.totalColumnCount(), 3);
        assert.strictEqual(dataController.totalRowCount(), 3);
    });

    QUnit.test('Hide empty columns in a single group isEmpty field is array', function(assert) {
        const dataController = new DataController({
            hideEmptySummaryCells: true,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0, isEmpty: [true],
                    children: [{ value: 'P1', index: 1, isEmpty: [false] }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3, isEmpty: [true] }],
                values: [
                    [null, 2, 3, null, 12],
                    [null, 3, 4, null, 18],
                    [null, 5, 7, null, 30]
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '2'
                }, {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '3'
                }, {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '12'
                }],
            [
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '3'
                },
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '4'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '18'
                }
            ], [
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '5'
                },
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '7'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'GT',
                    'text': '30'
                }]
        ], 'cells info');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            {
                dataSourceIndex: 0,
                'colspan': 2,
                'expanded': true,
                'path': [
                    'A'
                ],
                'text': 'A',
                'type': 'D'
            },
            {
                'isLast': true,
                'rowspan': 2,
                'text': undefined,
                'type': 'GT'
            }
        ],
        [
            {
                'dataSourceIndex': 1,
                'isLast': true,
                'path': [
                    'A',
                    'P1'
                ],
                'text': 'P1',
                'type': 'D'
            },
            {
                'dataSourceIndex': 2,
                'isLast': true,
                'path': [
                    'A',
                    'P2'
                ],
                'text': 'P2',
                'type': 'D'
            }
        ]]);
        assert.strictEqual(dataController.totalColumnCount(), 3);
        assert.strictEqual(dataController.totalRowCount(), 3);
    });

    QUnit.test('Hide empty rows in a single group', function(assert) {
        const dataController = new DataController({
            hideEmptySummaryCells: true,
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'row' }, { area: 'row' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                columns: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                rows: [{
                    value: 'A', index: 0, isEmpty: [true],
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3, isEmpty: [true] }],
                values: [
                    [null, null, null],
                    [2, 3, 5],
                    [3, 4, 7],
                    [null, null, null],
                    [12, 18, 30]
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '2'
                },
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '3'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '5'
                }
            ],
            [
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '3'
                },
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '4'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '7'
                }
            ],
            [
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '12'
                },
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '18'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'GT',
                    'text': '30'
                }
            ]
        ], 'cells info');

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                {
                    dataSourceIndex: 0,
                    'expanded': true,
                    'path': [
                        'A'
                    ],
                    'rowspan': 2,
                    'text': 'A',
                    'type': 'D'
                },
                {
                    dataSourceIndex: 1,
                    'isLast': true,
                    'path': [
                        'A',
                        'P1'
                    ],
                    'text': 'P1',
                    'type': 'D'
                }
            ],
            [
                {
                    dataSourceIndex: 2,
                    'isLast': true,
                    'path': [
                        'A',
                        'P2'
                    ],
                    'text': 'P2',
                    'type': 'D'
                }
            ],
            [
                {
                    'colspan': 2,
                    'isLast': true,
                    'text': undefined,
                    'type': 'GT'
                }
            ]
        ]);
        assert.strictEqual(dataController.totalColumnCount(), 3);
        assert.strictEqual(dataController.totalRowCount(), 3);
    });

    QUnit.test('Hide empty columns in different groups', function(assert) {
        const dataController = new DataController({
            hideEmptySummaryCells: true,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1, isEmpty: [true] }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3, isEmpty: [true] }],
                values: [
                    [1, null, 3, null, 12],
                    [2, null, 4, null, 18],
                    [3, null, 7, null, 30]
                ]
            }
        });


        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '3'
                }, {
                    'columnType': 'T',
                    'rowType': 'D',
                    'text': '1'
                }, {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '12'
                }],
            [
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '4'
                },
                {
                    'columnType': 'T',
                    'rowType': 'D',
                    'text': '2'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '18'
                }
            ], [
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '7'
                },
                {
                    'columnType': 'T',
                    'rowType': 'GT',
                    'text': '3'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'GT',
                    'text': '30'
                }]
        ], 'cells info');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            {
                dataSourceIndex: 0,
                'expanded': true,
                'path': [
                    'A'
                ],
                'text': 'A',
                'type': 'D'
            },
            {
                dataSourceIndex: 0,
                'isLast': true,
                'path': [
                    'A'
                ],
                'rowspan': 2,
                'text': '',
                'type': 'T'
            },
            {
                'isLast': true,
                'rowspan': 2,
                'text': undefined,
                'type': 'GT'
            }
        ],
        [
            {
                dataSourceIndex: 2,
                'isLast': true,
                'path': [
                    'A',
                    'P2'
                ],
                'text': 'P2',
                'type': 'D'
            }
        ]], 'column Info');

        assert.strictEqual(dataController.totalColumnCount(), 3);
        assert.strictEqual(dataController.totalRowCount(), 3);
    });

    QUnit.test('Not hide empty columns', function(assert) {
        const dataController = new DataController({
            showEmptyColumns: false,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0, isEmpty: [true],
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3, isEmpty: [true] }],
                values: [
                    [null, 2, 3, null, 12],
                    [null, 3, 4, null, 18],
                    [null, 5, 7, null, 30]
                ]
            }
        });

        assert.strictEqual(dataController.totalColumnCount(), 5);
        assert.strictEqual(dataController.totalRowCount(), 3);
    });

    QUnit.test('Not hide empty rows', function(assert) {
        const dataController = new DataController({
            hideEmptySummaryCells: false,
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'row' }, { area: 'row' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                columns: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                rows: [{
                    value: 'A', index: 0, isEmpty: [true],
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3, isEmpty: [true] }],
                values: [
                    [null, null, null],
                    [2, 3, 5],
                    [3, 4, 7],
                    [null, null, null],
                    [12, 18, 30]
                ]
            }
        });

        assert.strictEqual(dataController.totalColumnCount(), 3);
        assert.strictEqual(dataController.totalRowCount(), 5);
    });

    QUnit.test('Hide all children items', function(assert) {
        const dataController = new DataController({
            hideEmptySummaryCells: true,
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'row' }, { area: 'row' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                columns: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                rows: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1, isEmpty: [true] }, { value: 'P2', index: 2, isEmpty: [true] }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3],
                    [null, null, null],
                    [null, null, null],
                    [6, 9, 15],
                    [12, 18, 30]
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                {
                    'columnType': 'D',
                    'rowType': 'T',
                    'text': '1'
                },
                {
                    'columnType': 'D',
                    'rowType': 'T',
                    'text': '2'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'T',
                    'text': '3'
                }
            ],
            [
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '6'
                },
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '9'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '15'
                }
            ],
            [
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '12'
                },
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '18'
                },
                {
                    'columnType': 'GT',
                    'rowType': 'GT',
                    'text': '30'
                }
            ]
        ], 'cells info');

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                {
                    'colspan': 2,
                    'dataSourceIndex': 0,
                    'isLast': true,
                    'path': [
                        'A'
                    ],
                    'text': '',
                    'type': 'T'
                }
            ],
            [
                {
                    'colspan': 2,
                    'dataSourceIndex': 3,
                    'expanded': false,
                    'isLast': true,
                    'path': [
                        'C'
                    ],
                    'text': 'C',
                    'type': 'D'
                }
            ],
            [
                {
                    'colspan': 2,
                    'isLast': true,
                    'text': undefined,
                    'type': 'GT'
                }
            ]
        ]);
        assert.strictEqual(dataController.totalColumnCount(), 3);
        assert.strictEqual(dataController.totalRowCount(), 3);
    });

    QUnit.test('Hide totals on data field level', function(assert) {
        const dataController = new DataController({
            showRowTotals: true,
            showColumnTotals: true,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data', showTotals: false }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ]]);
    });

    QUnit.test('Hide values on data column field level when showTotals is true. Two fields', function(assert) {
        const dataController = new DataController({
            showRowTotals: true,
            showColumnTotals: true,
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' },
                    { caption: 'Sum2', format: 'decimal', area: 'data', showTotals: true, showValues: false }
                ],
                rows: [],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]],
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'GT', text: '3' },
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'T', rowType: 'GT', text: '1' },
                { columnType: 'T', rowType: 'GT', text: '2' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'GT', rowType: 'GT', text: '9' },
                { columnType: 'GT', rowType: 'GT', text: '10' }
            ]]);
    });

    QUnit.test('Hide totals on data column field level when showValues is true. Two fields', function(assert) {
        const dataController = new DataController({
            showRowTotals: true,
            showColumnTotals: true,
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' },
                    { caption: 'Sum2', format: 'decimal', area: 'data', showTotals: false, showValues: true }
                ],
                rows: [],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }]
                },
                {
                    value: 'C', index: 2,
                    children: [{ value: 'P2', index: 3 }]
                }],
                values: [
                    [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]],
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'GT', text: '3' },
                { columnType: 'D', rowType: 'GT', text: '4' },
                { columnType: 'T', rowType: 'GT', text: '1' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'D', rowType: 'GT', text: '8' },
                { columnType: 'T', rowType: 'GT', text: '5' },
                { columnType: 'GT', rowType: 'GT', text: '9' },
                { columnType: 'GT', rowType: 'GT', text: '10' }
            ]]);
    });

    QUnit.test('Hide values on data column field level when showTotals is true. One data field', function(assert) {
        const dataController = new DataController({
            showRowTotals: true,
            showColumnTotals: true,
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum2', format: 'decimal', area: 'data', showTotals: true, showValues: false }
                ],
                rows: [],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 3, 5, 7, 9]
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'T', rowType: 'GT', text: '1' },
                { columnType: 'GT', rowType: 'GT', text: '9' }
            ]]);
    });

    QUnit.test('Not hide row with not empty second cell', function(assert) {
        const dataController = new DataController({
            hideEmptySummaryCells: true,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' },
                    { area: 'data' },
                    { area: 'data' }
                ],
                'rows': [
                    { 'value': 'Los Angeles', 'index': 2, 'text': 'Los Angeles', 'isEmpty': [true, false] },
                    { 'value': 'New York', 'index': 1, 'text': 'New York', 'isEmpty': [false, false] }
                ],
                'columns': [
                    { 'value': 1, 'index': 1, 'text': 'January', 'isEmpty': [false, false] },
                    { 'value': 2, 'index': 2, 'text': 'February', 'isEmpty': [true, false] }
                ],
                'values': [
                    [[1740, 2], [1740, 1], [null, 1]],
                    [[1740, 1], [1740, 1], [null]],
                    [[null, 1], [null], [null, 1]]
                ],
                grandTotalColumnIndex: 0,
                grandTotalRowIndex: 0
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { 'columnType': 'D', 'rowType': 'D', 'text': '' },
                { 'columnType': 'D', 'rowType': 'D', 'text': '' },
                { 'columnType': 'D', 'rowType': 'D', 'text': '1' },
                { 'columnType': 'GT', 'rowType': 'D', 'text': '' },
                { 'columnType': 'GT', 'rowType': 'D', 'text': '1' }
            ],
            [
                { 'columnType': 'D', 'rowType': 'D', 'text': '1740' },
                { 'columnType': 'D', 'rowType': 'D', 'text': '1' },
                { 'columnType': 'D', 'rowType': 'D', 'text': '' },
                { 'columnType': 'GT', 'rowType': 'D', 'text': '1740' },
                { 'columnType': 'GT', 'rowType': 'D', 'text': '1' }
            ],
            [
                { 'columnType': 'D', 'rowType': 'GT', 'text': '1740' },
                { 'columnType': 'D', 'rowType': 'GT', 'text': '1' },
                { 'columnType': 'D', 'rowType': 'GT', 'text': '1' },
                { 'columnType': 'GT', 'rowType': 'GT', 'text': '1740' },
                { 'columnType': 'GT', 'rowType': 'GT', 'text': '2' }
            ]
        ], 'cells info');
    });


    QUnit.test('Hide totals on data column field level when showValues is true. One data field', function(assert) {
        const dataController = new DataController({
            showRowTotals: true,
            showColumnTotals: true,
            dataSource: {
                fields: [
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum2', format: 'decimal', area: 'data', showTotals: false, showValues: true }
                ],
                rows: [],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 3, 5, 7, 9]
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'GT', text: '3' },
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'GT', rowType: 'GT', text: '9' }
            ]]);
    });

    QUnit.test('Hide GrandTotals on data field level', function(assert) {
        const dataController = new DataController({
            showRowGrandTotals: true,
            showColumnGrandTotals: true,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data', showGrandTotals: false }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'T', rowType: 'D', text: '1' },
                { columnType: 'D', rowType: 'D', text: '6' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '9' }
            ]]);

    });

    QUnit.test('hide grand totals on field level when two data fields', function(assert) {
        const dataController = new DataController({
            showRowGrandTotals: true,
            showColumnGrandTotals: true,
            showRowTotals: true,
            showColumnTotals: true,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' },
                    {
                        caption: 'Avg',
                        format: 'decimal',
                        width: 100,
                        area: 'data',
                        showGrandTotals: false
                    }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [[1, 2], [2, 3], [3, 4], [6, 7], [12, 13]],
                    [[2, 3], [3, 4], [4, 5], [9, 10], [18, 19]],
                    [[3, 4], [5, 6], [7, 8], [15, 16], [30, 31]]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3', width: 100 },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4', width: 100 },
                { columnType: 'T', rowType: 'D', text: '1' },
                { columnType: 'T', rowType: 'D', text: '2', width: 100 },
                { columnType: 'D', rowType: 'D', text: '6' },
                { columnType: 'D', rowType: 'D', text: '7', width: 100 },
                { columnType: 'GT', rowType: 'D', text: '12' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4', width: 100 },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'D', rowType: 'D', text: '5', width: 100 },
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'T', rowType: 'D', text: '3', width: 100 },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'D', rowType: 'D', text: '10', width: 100 },
                { columnType: 'GT', rowType: 'D', text: '18' }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '6', width: 100 },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'D', rowType: 'GT', text: '8', width: 100 },
                { columnType: 'T', rowType: 'GT', text: '3' },
                { columnType: 'T', rowType: 'GT', text: '4', width: 100 },
                { columnType: 'D', rowType: 'GT', text: '15' },
                { columnType: 'D', rowType: 'GT', text: '16', width: 100 },
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ]]);
    });

    QUnit.test('Hide totals on data column header field level', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column', showTotals: false }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            },
            texts: texts
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '6' },
                { columnType: 'GT', rowType: 'D', text: '12' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'GT', rowType: 'D', text: '18' }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'D', rowType: 'GT', text: '15' },
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ]], 'cells info');

        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { dataSourceIndex: 0, text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { dataSourceIndex: 3, text: 'C', rowspan: 2, expanded: false, path: ['C'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { dataSourceIndex: 1, text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { dataSourceIndex: 2, text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ]
        ], 'columns info');

    });

    QUnit.test('Hide totals when showColumnsTotals is false and showTotal is true for header field', function(assert) {
        const dataController = new DataController({
            showColumnTotals: false,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column', showTotals: true }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            },
            texts: texts
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '6' },
                { columnType: 'GT', rowType: 'D', text: '12' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'GT', rowType: 'D', text: '18' }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'D', rowType: 'GT', text: '15' },
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ]], 'cells info');

        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { dataSourceIndex: 0, text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { dataSourceIndex: 3, text: 'C', rowspan: 2, expanded: false, path: ['C'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }],
            [
                { dataSourceIndex: 1, text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true },
                { dataSourceIndex: 2, text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ]
        ], 'columns info');

    });

    QUnit.test('Hide totals on data row header field level', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'row', showTotals: false }, { area: 'row' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                columns: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                rows: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3],
                    [2, 3, 5],
                    [3, 4, 7],
                    [6, 9, 15],
                    [12, 18, 30]
                ]
            },
            texts: texts
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'GT', rowType: 'D', text: '5' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'GT', rowType: 'D', text: '7' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '6' },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'GT', rowType: 'D', text: '15' }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '12' },
                { columnType: 'D', rowType: 'GT', text: '18' },
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ]
        ], 'cells info');

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { dataSourceIndex: 0, text: 'A', rowspan: 2, expanded: true, path: ['A'], type: 'D' },
                { dataSourceIndex: 1, text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true }
            ], [
                { dataSourceIndex: 2, text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ], [
                { dataSourceIndex: 3, text: 'C', colspan: 2, expanded: false, path: ['C'], type: 'D', isLast: true }
            ], [
                { text: 'Grand Total', colspan: 2, type: 'GT', isLast: true }
            ]
        ], 'rows info');

    });

    // T504918
    QUnit.test('Format cell with error value', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column', caption: 'column' },
                    { caption: 'value', format: 'fixedPoint', area: 'data' }
                ],
                rows: [],
                columns: [{ value: 'columnValue1', displayText: '', index: 0 }],
                values: [[1, '#N/A']]
            },
            texts: texts
        });

        assert.equal(dataController.getCellsInfo()[0][0].text, '1');
        assert.equal(dataController.getCellsInfo()[0][1].text, 'Error');
    });

    QUnit.test('T492326. Not set colspan in rowInfo item if all values and totals are hidden', function(assert) {
        const dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'row' },
                    { area: 'column' },
                    {
                        caption: 'Sum', format: 'decimal', area: 'data',
                        showValues: false,
                        showTotals: false,
                        showGrandTotals: true,
                    }
                ],
                rows: [{
                    index: 0,
                    value: '1',
                    children: [
                        {
                            value: '2',
                            index: 1
                        }
                    ]
                }],
                columns: [{
                    value: 'A', index: 1
                }],
                values: [
                    [[1], [3], [5]],
                    [[1], [3], [5]]
                ]
            }
        });

        assert.deepEqual(dataController.getRowsInfo(), [
            [{
                'isLast': true,
                'text': undefined,
                'type': 'GT'
            }]
        ]);
    });


});

QUnit.module('Showing total on the top', moduleConfig, () => {

    QUnit.test('Get header info. Show column totals near', function(assert) {
        const dataController = new DataController({
            showTotalsPrior: 'columns',
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column', width: 100 },

                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }],

                rows: [{
                    value: 'A',
                    children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }
                ]
            },
            texts: texts
        });

        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true, expanded: true },
                { text: 'A', colspan: 2, path: ['A'], type: 'D' },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true, width: 100 },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true, width: 100 }
            ]
        ]);

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: 'A', rowspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true }
            ], [
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ], [
                { text: 'A Total', colspan: 2, path: ['A'], type: 'T', isLast: true }
            ], [
                { text: 'C1', colspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ], [
                { text: 'Grand Total', colspan: 2, type: 'GT', isLast: true }
            ]
        ]);
    });

    QUnit.test('Get header info. Show row totals near', function(assert) {
        const dataController = new DataController({
            showTotalsPrior: 'rows',
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column', width: 100 },

                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }],

                rows: [{
                    value: 'A',
                    children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }
                ]
            },
            texts: texts
        });

        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'A', colspan: 2, expanded: true, path: ['A'], type: 'D' },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true },
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true }
            ],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true, width: 100 },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true, width: 100 }
            ]
        ]);

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: 'Grand Total', colspan: 2, type: 'GT', isLast: true }
            ], [
                { text: 'A Total', colspan: 2, path: ['A'], type: 'T', isLast: true, expanded: true }
            ],
            [
                { text: 'A', rowspan: 2, path: ['A'], type: 'D' },
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true }
            ], [
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ], [
                { text: 'C1', colspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ]
        ]);
    });

    QUnit.test('Get header info. Show all totals near', function(assert) {
        const dataController = new DataController({
            showTotalsPrior: 'both',
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column', width: 100 },

                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }],

                rows: [{
                    value: 'A',
                    children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }
                ]
            },
            texts: texts
        });

        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'Grand Total', rowspan: 2, type: 'GT', isLast: true },
                { text: 'A Total', rowspan: 2, path: ['A'], type: 'T', isLast: true, expanded: true },
                { text: 'A', colspan: 2, path: ['A'], type: 'D' },
                { text: 'C1', rowspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ],
            [
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true, width: 100 },
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true, width: 100 }
            ]
        ]);

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: 'Grand Total', colspan: 2, type: 'GT', isLast: true }
            ], [
                { text: 'A Total', colspan: 2, path: ['A'], type: 'T', isLast: true, expanded: true }
            ],
            [
                { text: 'A', rowspan: 2, path: ['A'], type: 'D' },
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true }
            ], [
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ], [
                { text: 'C1', colspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ]
        ]);
    });

    QUnit.test('Get header info with near total and two level expanded', function(assert) {
        const dataController = new DataController({
            showTotalsPrior: 'columns',
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column', width: 100 },
                    { area: 'column' },

                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1', children: [{ value: 'P11' }] }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });


        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { text: 'Grand Total', rowspan: 3, type: 'GT', isLast: true },
                { text: 'A Total', rowspan: 3, path: ['A'], type: 'T', isLast: true, expanded: true },
                { text: 'A', colspan: 3, path: ['A'], type: 'D' },
                { text: 'C1', rowspan: 3, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ],
            [
                { text: 'P1 Total', rowspan: 2, type: 'T', path: ['A', 'P1'], isLast: true, expanded: true },
                { text: 'P1', type: 'D', path: ['A', 'P1'], width: 100 },
                { text: 'P2', type: 'D', rowspan: 2, path: ['A', 'P2'], isLast: true, width: 100, expanded: false }
            ],
            [
                { text: 'P11', type: 'D', path: ['A', 'P1', 'P11'], isLast: true }
            ]
        ]);
    });

    QUnit.test('cellInfo when cells descriptions count === 1', function(assert) {
        const dataController = new DataController({
            showTotalsPrior: 'both',
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'GT', rowType: 'GT', text: '30' },
                { columnType: 'T', rowType: 'GT', text: '3' },
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'D', rowType: 'GT', text: '15' }
            ], [
                { columnType: 'GT', rowType: 'D', text: '12' },
                { columnType: 'T', rowType: 'D', text: '1' },
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '6' }
            ], [
                { columnType: 'GT', rowType: 'D', text: '18' },
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'D', rowType: 'D', text: '9' }
            ]]);
    });

    QUnit.test('cellInfo when cells descriptions count === 1. Show only row totals near', function(assert) {
        const dataController = new DataController({
            showTotalsPrior: 'rows',
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'T', rowType: 'GT', text: '3' },
                { columnType: 'D', rowType: 'GT', text: '15' },
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'T', rowType: 'D', text: '1' },
                { columnType: 'D', rowType: 'D', text: '6' },
                { columnType: 'GT', rowType: 'D', text: '12' }
            ], [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'GT', rowType: 'D', text: '18' }
            ]
        ]);
    });

    QUnit.test('cellInfo when cells descriptions count === 1. Show only column totals near', function(assert) {
        const dataController = new DataController({
            showTotalsPrior: 'columns',
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        });
        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'GT', rowType: 'D', text: '12' },
                { columnType: 'T', rowType: 'D', text: '1' },
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '6' }
            ], [
                { columnType: 'GT', rowType: 'D', text: '18' },
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'D', rowType: 'D', text: '9' }
            ],
            [
                { columnType: 'GT', rowType: 'GT', text: '30' },
                { columnType: 'T', rowType: 'GT', text: '3' },
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'D', rowType: 'GT', text: '15' }
            ]
        ]);
    });

    QUnit.test('Hide empty columns in different groups', function(assert) {
        const dataController = new DataController({
            showTotalsPrior: 'columns',
            hideEmptySummaryCells: true,
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1, isEmpty: [true] }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3, isEmpty: [true] }],
                values: [
                    [1, null, 3, null, 12],
                    [2, null, 4, null, 18],
                    [3, null, 7, null, 30]
                ]
            }
        });

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '12'
                },
                {
                    'columnType': 'T',
                    'rowType': 'D',
                    'text': '1'
                },
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '3'
                }],
            [
                {
                    'columnType': 'GT',
                    'rowType': 'D',
                    'text': '18'
                },
                {
                    'columnType': 'T',
                    'rowType': 'D',
                    'text': '2'
                },
                {
                    'columnType': 'D',
                    'rowType': 'D',
                    'text': '4'
                }
            ], [
                {
                    'columnType': 'GT',
                    'rowType': 'GT',
                    'text': '30'
                },
                {
                    'columnType': 'T',
                    'rowType': 'GT',
                    'text': '3'
                },
                {
                    'columnType': 'D',
                    'rowType': 'GT',
                    'text': '7'
                }]
        ], 'cells info');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            {
                'isLast': true,
                'rowspan': 2,
                'text': undefined,
                'type': 'GT'
            },
            {
                'dataSourceIndex': 0,
                'isLast': true,
                'expanded': true,
                'path': [
                    'A'
                ],
                'rowspan': 2,
                'text': '',
                'type': 'T'
            },
            {
                'dataSourceIndex': 0,
                'path': [
                    'A'
                ],
                'text': 'A',
                'type': 'D'
            }
        ],
        [
            {
                'dataSourceIndex': 2,
                'isLast': true,
                'path': [
                    'A',
                    'P2'
                ],
                'text': 'P2',
                'type': 'D'
            }
        ]], 'column Info');

        assert.strictEqual(dataController.totalColumnCount(), 3);
        assert.strictEqual(dataController.totalRowCount(), 3);
    });


});

QUnit.module('Tree-Like row layout', moduleConfig, () => {

    QUnit.test('get Rows info', function(assert) {
        const dataController = new DataController({
            rowHeaderLayout: 'tree',
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: 'A Total', colspan: 2, path: ['A'], type: 'T', isLast: true, expanded: true }
            ],
            [
                { text: 'A', rowspan: 2, isWhiteSpace: true, path: ['A'], type: 'D', width: null },
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true }
            ], [
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ], [
                { text: 'C1', colspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ], [
                { text: 'Grand Total', colspan: 2, type: 'GT', isLast: true }
            ]
        ]);
    });

    QUnit.test('get Rows info. with data fields', function(assert) {
        const dataController = new DataController({
            rowHeaderLayout: 'tree',
            dataFieldArea: 'row',
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' },
                    { dataField: 'sum', caption: 'Sum1', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: 'A Total', colspan: 2, rowspan: 2, path: ['A'], type: 'T', expanded: true },
                { dataIndex: 0, isLast: true, text: 'Sum', type: 'T', path: ['A'] }
            ],
            [
                { dataIndex: 1, isLast: true, text: 'Sum1', type: 'T', path: ['A'] }
            ],
            [
                { text: 'A', rowspan: 4, isWhiteSpace: true, path: ['A'], type: 'D', width: null },
                { text: 'P1', type: 'D', rowspan: 2, path: ['A', 'P1'] },
                { dataIndex: 0, isLast: true, text: 'Sum', type: 'D', path: ['A', 'P1'] }
            ],
            [
                { dataIndex: 1, isLast: true, text: 'Sum1', type: 'D', path: ['A', 'P1'] }
            ],
            [
                { text: 'P2', type: 'D', rowspan: 2, path: ['A', 'P2'] },
                { dataIndex: 0, isLast: true, text: 'Sum', type: 'D', path: ['A', 'P2'] }
            ],
            [
                { dataIndex: 1, isLast: true, text: 'Sum1', type: 'D', path: ['A', 'P2'] }
            ],
            [
                { text: 'C1', colspan: 2, rowspan: 2, expanded: false, path: ['C1'], type: 'D' },
                { dataIndex: 0, isLast: true, text: 'Sum', type: 'D', path: ['C1'] }
            ],
            [
                { dataIndex: 1, isLast: true, text: 'Sum1', type: 'D', path: ['C1'] }
            ],
            [
                { text: 'Grand Total', colspan: 2, rowspan: 2, type: 'GT' },
                { dataIndex: 0, isLast: true, text: 'Sum', type: 'GT' }
            ], [
                { dataIndex: 1, isLast: true, text: 'Sum1', type: 'GT' }
            ]
        ]);
    });

    QUnit.test('get Rows info. Totals are Disabled', function(assert) {
        const dataController = new DataController({
            rowHeaderLayout: 'tree',
            showRowTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', showTotals: false }, { area: 'row' },
                    { dataField: 'sum', caption: 'Sum', format: 'fixedPoint', area: 'data' }
                ],
                rows: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { text: 'A Total', colspan: 2, path: ['A'], type: 'T', isLast: true, expanded: true }
            ],
            [
                { text: 'A', rowspan: 2, isWhiteSpace: true, path: ['A'], type: 'D', width: null },
                { text: 'P1', type: 'D', path: ['A', 'P1'], isLast: true }
            ], [
                { text: 'P2', type: 'D', path: ['A', 'P2'], isLast: true }
            ], [
                { text: 'C1', colspan: 2, expanded: false, path: ['C1'], type: 'D', isLast: true }
            ]
        ]);
    });


});

QUnit.module('Virtual scrolling', {
    beforeEach: function() {
        this.data = [
            {
                'value': 'Accessories',
                'children': [
                    { 'value': 'Bike Racks' },
                    { 'value': 'Bottles and Cages' },
                    { 'value': 'Cleaners' },
                    { 'value': 'Helmets' },
                    { 'value': 'Hydration Packs' },
                    { 'value': 'Locks' },
                    { 'value': 'Pumps' },
                    { 'value': 'Tires and Tubes' }
                ]
            },
            {
                'value': 'Bikes',
                'children': [
                    { 'value': 'Mountain Bikes' },
                    { 'value': 'Road Bikes' },
                    { 'value': 'Touring Bikes' }
                ]
            },
            {
                'value': 'Clothing',
                'children': [
                    { 'value': 'Bib-Shorts' },
                    { 'text': 'Caps', 'value': 'Caps' },
                    { 'value': 'Gloves' },
                    { 'value': 'Jerseys' },
                    { 'value': 'Shorts' },
                    { 'value': 'Socks' },
                    { 'value': 'Tights' },
                    { 'value': 'Vests' }
                ]
            },
            {
                'value': 'Components',
                'children': [
                    { 'value': 'Bottom Brackets' },
                    { 'value': 'Brakes' },
                    { 'value': 'Chains' },
                    { 'value': 'Cranksets' },
                    { 'value': 'Derailleurs' },
                    { 'value': 'Forks' },
                    { 'value': 'Handlebars' },
                    { 'value': 'Headsets' },
                    { 'value': 'Mountain Frames' },
                    { 'value': 'Pedals' },
                    { 'value': 'Road Frames' },
                    { 'value': 'Saddles' },
                    { 'value': 'Touring Frames' },
                    { 'value': 'Wheels' }
                ]
            }];

        const VirtualScrollController = virtualScrolling.VirtualScrollController;

        this.VirtualScrollController = sinon.stub(virtualScrolling, 'VirtualScrollController').callsFake(function() {
            return sinon.createStubInstance(VirtualScrollController);
        });

        this.component = {
            option: sinon.stub().withArgs('scrolling.mode').returns('virtual')
        };

        this.getOptions = function(options) {
            return $.extend({
                component: this.component
            }, options || {});
        };

        moduleConfig.beforeEach();
    },
    afterEach: function() {
        this.VirtualScrollController.restore && this.VirtualScrollController.restore();
        moduleConfig.afterEach();
    }
}, () => {

    QUnit.test('create dataController with virtual scrollController when scrolling is virtual', function(assert) {
        const dataController = new DataController(this.getOptions({
            fields: [
                { area: 'row' },
                { area: 'column' }, { area: 'column' },
                { caption: 'Sum', format: 'decimal', area: 'data' }
            ],
            rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
            columns: [{
                value: 'A', index: 0,
                children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
            },
            { value: 'C', index: 3 }],
            values: [
                [1, 2, 3, 6, 12],
                [2, 3, 4, 9, 18],
                [3, 5, 7, 15, 30]
            ]
        }));

        assert.strictEqual(this.VirtualScrollController.callCount, 2);
        assert.ok(this.VirtualScrollController.firstCall.calledWithNew);
        assert.ok(this.VirtualScrollController.secondCall.calledWithNew);

        assert.strictEqual(this.VirtualScrollController.lastCall.args[0], this.component);
        assert.ok(!this.VirtualScrollController.firstCall.returnValue.dispose.calledOnce);
        assert.ok(!this.VirtualScrollController.secondCall.returnValue.dispose.calledOnce);

        assert.strictEqual(dataController._columnsScrollController, this.VirtualScrollController.secondCall.returnValue);
        assert.strictEqual(dataController._rowsScrollController, this.VirtualScrollController.firstCall.returnValue);
    });

    QUnit.test('Calculate virtual content params', function(assert) {
        const dataController = new DataController(this.getOptions({}));
        const rowsScrollController = this.VirtualScrollController.firstCall.returnValue;
        const columnsScrollController = this.VirtualScrollController.secondCall.returnValue;
        const scrollChanged = sinon.stub();

        dataController.scrollChanged.add(scrollChanged);

        rowsScrollController.getContentOffset.returns(100);
        columnsScrollController.getContentOffset.returns(150);
        rowsScrollController.getVirtualContentSize.returns(1000);
        columnsScrollController.getVirtualContentSize.returns(1500);

        columnsScrollController.viewportItemSize.returns(20);
        rowsScrollController.viewportItemSize.returns(20);

        columnsScrollController.getViewportPosition.returns(400);
        rowsScrollController.getViewportPosition.returns(500);

        const itemWidths = [100, 100, 100, 100, 100, 100];
        const itemHeights = [100, 100, 100, 100, 100, 100, 100, 100];
        // act
        const result = dataController.calculateVirtualContentParams({
            virtualRowHeight: 40,
            virtualColumnWidth: 15,
            itemWidths: itemWidths,
            itemHeights: itemHeights,
            rowCount: 20,
            columnCount: 40,
            viewportWidth: 300,
            viewportHeight: 200
        });

        // assert
        assert.strictEqual(rowsScrollController.viewportItemSize.callCount, 2);
        assert.strictEqual(rowsScrollController.viewportItemSize.firstCall.args[0], 40);
        assert.strictEqual(columnsScrollController.viewportItemSize.callCount, 2);
        assert.strictEqual(columnsScrollController.viewportItemSize.firstCall.args[0], 15);

        assert.strictEqual(columnsScrollController.viewportSize.lastCall.args[0], 15);
        assert.strictEqual(columnsScrollController.setContentItemSizes.lastCall.args[0], itemWidths);

        assert.strictEqual(rowsScrollController.viewportSize.lastCall.args[0], 10);
        assert.strictEqual(rowsScrollController.setContentItemSizes.lastCall.args[0], itemHeights);

        assert.strictEqual(rowsScrollController.loadIfNeed.callCount, 1);
        assert.strictEqual(columnsScrollController.loadIfNeed.callCount, 1);

        assert.ok(rowsScrollController.loadIfNeed.calledAfter(rowsScrollController.setContentItemSizes));
        assert.ok(columnsScrollController.loadIfNeed.calledAfter(columnsScrollController.setContentItemSizes));

        assert.deepEqual(result, {
            contentLeft: 150,
            contentTop: 100,
            height: 1000,
            width: 1500
        });

        assert.ok(scrollChanged.calledOnce);
        assert.deepEqual(scrollChanged.lastCall.args[0], {
            left: 400,
            top: 500
        });
    });

    QUnit.test('setViewPortPosition', function(assert) {
        const dataController = new DataController(this.getOptions({}));
        const rowsScrollController = this.VirtualScrollController.firstCall.returnValue;
        const columnsScrollController = this.VirtualScrollController.secondCall.returnValue;

        // act
        dataController.setViewportPosition(20, 100);
        dataController.setViewportPosition(null, undefined);
        dataController.setViewportPosition(undefined, 0);
        // assert
        assert.strictEqual(columnsScrollController.setViewportPosition.callCount, 3);
        assert.strictEqual(rowsScrollController.setViewportPosition.callCount, 3);

        assert.strictEqual(columnsScrollController.setViewportPosition.getCall(0).args[0], 20);
        assert.strictEqual(columnsScrollController.setViewportPosition.getCall(1).args[0], 0);
        assert.strictEqual(columnsScrollController.setViewportPosition.getCall(2).args[0], 0);

        assert.strictEqual(rowsScrollController.setViewportPosition.getCall(0).args[0], 100);
        assert.strictEqual(rowsScrollController.setViewportPosition.getCall(1).args[0], 0);
        assert.strictEqual(rowsScrollController.setViewportPosition.getCall(2).args[0], 0);
    });

    QUnit.test('subscribeToWindowScrollEvents', function(assert) {
        const dataController = new DataController(this.getOptions({}));
        const rowsScrollController = this.VirtualScrollController.firstCall.returnValue;
        const columnsScrollController = this.VirtualScrollController.secondCall.returnValue;
        const testElement = $('<div>');

        // act
        dataController.subscribeToWindowScrollEvents(testElement);
        // assert
        assert.strictEqual(columnsScrollController.subscribeToWindowScrollEvents.callCount, 0);
        assert.strictEqual(rowsScrollController.subscribeToWindowScrollEvents.callCount, 1);

        assert.strictEqual(rowsScrollController.subscribeToWindowScrollEvents.getCall(0).args[0], testElement);
    });

    QUnit.test('updateWindowScrollPosition', function(assert) {
        const dataController = new DataController(this.getOptions({}));
        const rowsScrollController = this.VirtualScrollController.firstCall.returnValue;
        const columnsScrollController = this.VirtualScrollController.secondCall.returnValue;

        // act
        dataController.updateWindowScrollPosition(145);
        // assert
        assert.strictEqual(columnsScrollController.scrollTo.callCount, 0);
        assert.strictEqual(rowsScrollController.scrollTo.callCount, 1);

        assert.strictEqual(rowsScrollController.scrollTo.getCall(0).args[0], 145);
    });

    QUnit.test('dataAdapter for columnsScrollController', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        }));
        const changed = sinon.stub();
        const dataSourceChanged = sinon.stub();

        dataController.changed.add(changed);
        dataController.dataSourceChanged.add(dataSourceChanged);

        const dataAdapter = this.VirtualScrollController.secondCall.args[1];

        dataController.columnPageSize(2);
        dataController.rowPageSize(3);

        assert.ok(dataAdapter);
        assert.strictEqual(dataAdapter.pageCount(), 3);
        assert.strictEqual(dataAdapter.pageSize(), 2);
        assert.strictEqual(dataAdapter.pageIndex(1), 1);
        assert.strictEqual(dataController.columnPageIndex(), 1);

        assert.deepEqual(dataAdapter.items(), []);
        assert.deepEqual(dataAdapter.viewportItems(), []);
        assert.strictEqual(dataAdapter.hasKnownLastPage(), true);
        assert.strictEqual(dataAdapter.isLoading(), false);
        assert.strictEqual(dataAdapter.pageCount(), 3);

        assert.strictEqual(dataAdapter.totalItemsCount(), 5);

        assert.ok(!changed.called);
        assert.ok(!this.VirtualScrollController.secondCall.returnValue.handleDataChanged.calledOnce);

        dataAdapter.load();
        assert.ok(this.VirtualScrollController.secondCall.returnValue.handleDataChanged.calledOnce);
        this.VirtualScrollController.secondCall.returnValue.handleDataChanged.lastCall.args[0]();
        assert.ok(changed.calledOnce);
        assert.ok(!dataSourceChanged.called);
    });


    QUnit.test('dataSourceChanged should fired only on data change', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }
                ],
                rows: [{ value: 'Vasya', index: 0 }],
                columns: [
                    { value: 'A', index: 0 },
                    { value: 'C', index: 3 }
                ],
                values: [
                    [1, 6, 7],
                    [1, 6, 7]
                ]
            }
        }));
        const dataSourceChanged = sinon.stub();

        dataController.dataSourceChanged.add(dataSourceChanged);

        dataController.load();
        assert.ok(dataSourceChanged.calledOnce);
    });

    QUnit.test('dataAdapter for columnsScrollController. Load when rowPageIndex greater then pagecount', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        }));
        const changed = sinon.stub();
        const dataAdapter = this.VirtualScrollController.secondCall.args[1];
        const scrollController = this.VirtualScrollController.secondCall.returnValue;

        dataController.changed.add(changed);
        scrollController.pageIndex.returns(10);

        // act
        dataAdapter.load();
        // assert
        assert.ok(scrollController.handleDataChanged.calledOnce);
        scrollController.handleDataChanged.lastCall.args[0]();
        assert.ok(changed.calledOnce);
        assert.strictEqual(scrollController.pageIndex.lastCall.args[0], 0);
    });

    QUnit.test('dataAdapter for rowsScrollController', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        }));
        const changed = sinon.stub();
        const dataAdapter = this.VirtualScrollController.firstCall.args[1];

        dataController.changed.add(changed);
        dataController.rowPageSize(2);

        assert.ok(dataAdapter);
        assert.strictEqual(dataAdapter.pageCount(), 2);
        assert.strictEqual(dataAdapter.pageSize(), 2);
        assert.strictEqual(dataAdapter.pageIndex(1), 1);
        assert.strictEqual(dataController.rowPageIndex(), 1);

        assert.strictEqual(dataAdapter.totalItemsCount(), 3);
        assert.deepEqual(dataAdapter.items(), []);
        assert.deepEqual(dataAdapter.viewportItems(), []);
        assert.strictEqual(dataAdapter.hasKnownLastPage(), true);
        assert.strictEqual(dataAdapter.isLoading(), false);
        assert.strictEqual(dataAdapter.pageCount(), 2);

        assert.ok(!changed.called);
        assert.ok(!this.VirtualScrollController.firstCall.returnValue.handleDataChanged.calledOnce);

        dataAdapter.load();
        assert.ok(this.VirtualScrollController.firstCall.returnValue.handleDataChanged.calledOnce);
        this.VirtualScrollController.firstCall.returnValue.handleDataChanged.lastCall.args[0]();
        assert.ok(changed.calledOnce);
    });

    QUnit.test('dataAdapter for rowsScrollController. Load when rowPageIndex greater then pagecount', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        }));
        const changed = sinon.stub();
        const dataAdapter = this.VirtualScrollController.firstCall.args[1];
        const scrollController = this.VirtualScrollController.firstCall.returnValue;

        dataController.changed.add(changed);
        scrollController.pageIndex.returns(10);

        // act
        dataAdapter.load();
        // assert
        assert.ok(this.VirtualScrollController.firstCall.returnValue.handleDataChanged.calledOnce);
        this.VirtualScrollController.firstCall.returnValue.handleDataChanged.lastCall.args[0]();
        assert.ok(changed.calledOnce);
        assert.strictEqual(scrollController.pageIndex.lastCall.args[0], 0);
    });

    QUnit.test('Dispose DataController', function(assert) {
        const dataController = new DataController(this.getOptions());

        dataController.dispose();

        assert.ok(this.VirtualScrollController.firstCall.returnValue.dispose.calledOnce);
        assert.ok(this.VirtualScrollController.secondCall.returnValue.dispose.calledOnce);
    });

    QUnit.test('Paging methods. Get/set', function(assert) {
        const dataController = new DataController({});

        assert.strictEqual(dataController.rowPageSize(), 20, 'get default row page size');
        assert.strictEqual(dataController.rowPageSize(100), 100, 'set row page size');
        assert.strictEqual(dataController.rowPageSize(), 100, 'get row page size after setting');

        assert.strictEqual(dataController.columnPageSize(), 20, 'get default column page size');
        assert.strictEqual(dataController.columnPageSize(100), 100, 'set column page size');
        assert.strictEqual(dataController.columnPageSize(), 100, 'get column page size after setting');


        assert.strictEqual(dataController.rowPageIndex(), 0, 'get default row page index');
        assert.strictEqual(dataController.rowPageIndex(100), 100, 'set row page index');
        assert.strictEqual(dataController.rowPageIndex(), 100, 'get row page index after setting');

        assert.strictEqual(dataController.columnPageIndex(), 0, 'get default column page index');
        assert.strictEqual(dataController.columnPageIndex(100), 100, 'set column page index');
        assert.strictEqual(dataController.columnPageIndex(), 100, 'get column page index after setting');

    });

    QUnit.test('Get data by pageIndex, pageSize, pageCount. Rows', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                rows: this.data
            },
            texts: texts
        }));

        dataController.rowPageSize(2);
        dataController._rowsScrollController.beginPageIndex.returns(1);
        dataController._rowsScrollController.endPageIndex.returns(2);

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                {
                    'expanded': true,
                    'path': [
                        'Accessories'
                    ],
                    'rowspan': 4,
                    'text': 'Accessories',
                    'type': 'D'
                },
                {
                    'isLast': true,
                    'path': [
                        'Accessories',
                        'Cleaners'
                    ],
                    'text': 'Cleaners',
                    'type': 'D'
                }
            ],
            [
                {
                    'isLast': true,
                    'path': [
                        'Accessories',
                        'Helmets'
                    ],
                    'text': 'Helmets',
                    'type': 'D'
                }
            ],
            [
                {
                    'isLast': true,
                    'path': [
                        'Accessories',
                        'Hydration Packs'
                    ],
                    'text': 'Hydration Packs',
                    'type': 'D'
                }
            ],
            [
                {
                    'isLast': true,
                    'path': [
                        'Accessories',
                        'Locks'
                    ],
                    'text': 'Locks',
                    'type': 'D'
                }
            ]]);

        dataController.rowPageSize(2);
        dataController._rowsScrollController.beginPageIndex.returns(2);
        dataController._rowsScrollController.endPageIndex.returns(4);

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                {
                    'expanded': true,
                    'path': [
                        'Accessories'
                    ],
                    'rowspan': 4,
                    'text': 'Accessories',
                    'type': 'D'
                },
                {
                    'isLast': true,
                    'path': [
                        'Accessories',
                        'Hydration Packs'
                    ],
                    'text': 'Hydration Packs',
                    'type': 'D'
                }
            ],


            [
                {
                    'isLast': true,
                    'path': [
                        'Accessories',
                        'Locks'
                    ],
                    'text': 'Locks',
                    'type': 'D'
                }
            ],
            [
                {
                    'isLast': true,
                    'path': [
                        'Accessories',
                        'Pumps'
                    ],
                    'text': 'Pumps',
                    'type': 'D'
                }
            ],
            [
                {
                    'isLast': true,
                    'path': [
                        'Accessories',
                        'Tires and Tubes'
                    ],
                    'text': 'Tires and Tubes',
                    'type': 'D'
                }
            ],
            [
                {
                    'colspan': 2,
                    'isLast': true,
                    'path': [
                        'Accessories'
                    ],
                    'text': 'Accessories Total',
                    'type': 'T'
                }
            ],
            [
                {
                    'expanded': true,
                    'path': [
                        'Bikes'
                    ],
                    'rowspan': 1,
                    'text': 'Bikes',
                    'type': 'D'
                },
                {
                    'isLast': true,
                    'path': [
                        'Bikes',
                        'Mountain Bikes'
                    ],
                    'text': 'Mountain Bikes',
                    'type': 'D'
                }
            ]
        ]);

    });

    QUnit.test('T318502. Get rows info with three level expanded items', function(assert) {
        this.data[0].children = this.data[0].children.slice(0, 2);
        this.data[1].children = null;
        this.data[2].children = null;
        this.data[3].children = null;

        this.data[0].children[1].children = [{
            value: 'Red'
        }, {
            value: 'Black'
        }];

        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                rows: this.data
            },
            texts: texts
        }));

        dataController.rowPageSize(4);
        dataController._rowsScrollController.beginPageIndex.returns(0);
        dataController._rowsScrollController.endPageIndex.returns(2);

        assert.deepEqual(dataController.getRowsInfo(), [[
            {
                'expanded': true,
                'path': [
                    'Accessories'
                ],
                'rowspan': 4,
                'text': 'Accessories',
                'type': 'D'
            },
            {
                'colspan': 2,
                'expanded': false,
                'isLast': true,
                'path': [
                    'Accessories',
                    'Bike Racks'
                ],
                'text': 'Bike Racks',
                'type': 'D'
            }
        ],
        [
            {
                'expanded': true,
                'path': [
                    'Accessories',
                    'Bottles and Cages'
                ],
                'rowspan': 2,
                'text': 'Bottles and Cages',
                'type': 'D'
            },
            {
                'isLast': true,
                'path': [
                    'Accessories',
                    'Bottles and Cages',
                    'Red'
                ],
                'text': 'Red',
                'type': 'D'
            }
        ],
        [
            {
                'isLast': true,
                'path': [
                    'Accessories',
                    'Bottles and Cages',
                    'Black'
                ],
                'text': 'Black',
                'type': 'D'
            }
        ],
        [
            {
                'colspan': 2,
                'isLast': true,
                'path': [
                    'Accessories',
                    'Bottles and Cages'
                ],
                'text': 'Bottles and Cages Total',
                'type': 'T'
            }
        ],
        [
            {
                'colspan': 3,
                'isLast': true,
                'path': [
                    'Accessories'
                ],
                'text': 'Accessories Total',
                'type': 'T'
            }
        ],
        [
            {
                'colspan': 3,
                'expanded': false,
                'isLast': true,
                'path': [
                    'Bikes'
                ],
                'text': 'Bikes',
                'type': 'D'
            }
        ],
        [
            {
                'colspan': 3,
                'expanded': false,
                'isLast': true,
                'path': [
                    'Clothing'
                ],
                'text': 'Clothing',
                'type': 'D'
            }
        ],
        [
            {
                'colspan': 3,

                'expanded': false,
                'isLast': true,
                'path': [
                    'Components'
                ],
                'text': 'Components',
                'type': 'D'
            }
        ],
        [
            {
                'colspan': 3,
                'isLast': true,
                'text': 'Grand Total',
                'type': 'GT'
            }
        ]]);

        dataController.rowPageSize(3);
        dataController._rowsScrollController.beginPageIndex.returns(1);
        dataController._rowsScrollController.endPageIndex.returns(2);

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                {
                    'expanded': true,
                    'path': [
                        'Accessories'
                    ],
                    'rowspan': 1,
                    'text': 'Accessories',
                    'type': 'D'
                },
                {
                    'colspan': 1,
                    'isLast': true,
                    'path': [
                        'Accessories',
                        'Bottles and Cages'
                    ],
                    'text': 'Bottles and Cages Total',
                    'type': 'T'
                }
            ],
            [
                {
                    'colspan': 2,
                    'isLast': true,
                    'path': [
                        'Accessories'
                    ],
                    'text': 'Accessories Total',
                    'type': 'T'
                }
            ],
            [
                {
                    'colspan': 2,
                    'expanded': false,
                    'isLast': true,
                    'path': [
                        'Bikes'
                    ],
                    'text': 'Bikes',
                    'type': 'D'
                }
            ],
            [
                {
                    'colspan': 2,
                    'expanded': false,
                    'isLast': true,
                    'path': [
                        'Clothing'
                    ],
                    'text': 'Clothing',
                    'type': 'D'
                }
            ],
            [
                {
                    'colspan': 2,
                    'expanded': false,
                    'isLast': true,
                    'path': [
                        'Components'
                    ],
                    'text': 'Components',
                    'type': 'D'
                }
            ],
            [
                {
                    'colspan': 2,
                    'isLast': true,
                    'text': 'Grand Total',
                    'type': 'GT'
                }
            ]
        ]);
    });

    QUnit.test('Get data by pageIndex, pageSize, pageCount. Rows first level when there are expanded headers', function(assert) {
        this.data[1].children = null;
        this.data[2].children = null;
        this.data[3].children = null;

        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                rows: this.data
            },
            texts: texts
        }));

        dataController.rowPageSize(2);
        dataController._rowsScrollController.beginPageIndex.returns(5);
        dataController._rowsScrollController.endPageIndex.returns(6);

        dataController.rowPageSize(2);


        assert.deepEqual(dataController.getRowsInfo(), [
            [
                {
                    'colspan': 1,
                    'expanded': false,
                    'isLast': true,
                    'path': [
                        'Clothing'
                    ],
                    'text': 'Clothing',
                    'type': 'D'
                }
            ],
            [
                {
                    'colspan': 1,
                    'expanded': false,
                    'isLast': true,
                    'path': [
                        'Components'
                    ],
                    'text': 'Components',
                    'type': 'D'
                }
            ],
            [
                {
                    'colspan': 1,
                    'isLast': true,
                    'text': 'Grand Total',
                    'type': 'GT'
                }
            ]
        ]);
        assert.strictEqual(dataController.getRowsInfo(true)[10][0].colspan, 2);
    });

    QUnit.test('Get data by pageIndex, pageSize, pageCount. Columns', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: this.data
            },
            texts: texts
        }));
        let columnsInfo;

        dataController.columnPageSize(2);
        dataController._columnsScrollController.beginPageIndex.returns(1);
        dataController._columnsScrollController.endPageIndex.returns(2);
        columnsInfo = dataController.getColumnsInfo();

        assert.strictEqual(columnsInfo.length, 2);

        assert.deepEqual(columnsInfo[0], [{
            'expanded': true,
            'path': [
                'Accessories'
            ],
            'colspan': 4,
            'text': 'Accessories',
            'type': 'D'
        }]);

        assert.deepEqual(columnsInfo[1], [
            {
                'isLast': true,
                'path': [
                    'Accessories',
                    'Cleaners'
                ],
                'text': 'Cleaners',
                'type': 'D'
            },
            {
                'isLast': true,
                'path': [
                    'Accessories',
                    'Helmets'
                ],
                'text': 'Helmets',
                'type': 'D'
            },
            {
                'isLast': true,
                'path': [
                    'Accessories',
                    'Hydration Packs'
                ],
                'text': 'Hydration Packs',
                'type': 'D'
            },
            {
                'isLast': true,
                'path': [
                    'Accessories',
                    'Locks'
                ],
                'text': 'Locks',
                'type': 'D'
            }
        ]);

        dataController.columnPageSize(2);
        dataController._columnsScrollController.beginPageIndex.returns(2);
        dataController._columnsScrollController.endPageIndex.returns(6);

        columnsInfo = dataController.getColumnsInfo();

        assert.deepEqual(columnsInfo[0], [{
            'colspan': 4,
            'expanded': true,
            'path': [
                'Accessories'
            ],
            'text': 'Accessories',
            'type': 'D'
        },
        {
            'isLast': true,
            'path': [
                'Accessories'
            ],
            'rowspan': 2,
            'text': 'Accessories Total',
            'type': 'T'
        },
        {
            'colspan': 3,
            'expanded': true,
            'path': [
                'Bikes'
            ],
            'text': 'Bikes',
            'type': 'D'
        },
        {
            'isLast': true,
            'path': [
                'Bikes'
            ],
            'rowspan': 2,
            'text': 'Bikes Total',
            'type': 'T'
        }, {
            'colspan': 1,
            'expanded': true,
            'path': [
                'Clothing'
            ],
            'text': 'Clothing',
            'type': 'D'
        }]);

        assert.strictEqual(columnsInfo[1].length, 8);

        assert.deepEqual(columnsInfo[1], [{
            'isLast': true,
            'path': [
                'Accessories',
                'Hydration Packs'
            ],
            'text': 'Hydration Packs',
            'type': 'D'
        },
        {
            'isLast': true,
            'path': [
                'Accessories',
                'Locks'
            ],
            'text': 'Locks',
            'type': 'D'
        },
        {
            'isLast': true,
            'path': [
                'Accessories',
                'Pumps'
            ],
            'text': 'Pumps',
            'type': 'D'
        },
        {
            'isLast': true,
            'path': [
                'Accessories',
                'Tires and Tubes'
            ],
            'text': 'Tires and Tubes',
            'type': 'D'
        },
        {
            'isLast': true,
            'path': [
                'Bikes',
                'Mountain Bikes'
            ],
            'text': 'Mountain Bikes',
            'type': 'D'
        },
        {
            'isLast': true,
            'path': [
                'Bikes',
                'Road Bikes'
            ],
            'text': 'Road Bikes',
            'type': 'D'
        },
        {
            'isLast': true,
            'path': [
                'Bikes',
                'Touring Bikes'
            ],
            'text': 'Touring Bikes',
            'type': 'D'
        },
        {
            'isLast': true,
            'path': [
                'Clothing',
                'Bib-Shorts'
            ],
            'text': 'Bib-Shorts',
            'type': 'D'
        }]);
    });

    QUnit.test('T522627. Columns info. Second row not in the visible pages', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column' },
                    { area: 'data', caption: 'd1' },
                    { area: 'data', caption: 'd2' }
                ],
                columns: [
                    { value: 'A' },
                    { value: 'B' },
                    { value: 'C' },
                    {
                        value: 'D',
                        children: [
                            { value: 'P1' },
                            { value: 'P2' }
                        ]
                    }]
            },
            texts: texts
        }));

        dataController.columnPageSize(2);
        dataController._columnsScrollController.beginPageIndex.returns(0);
        dataController._columnsScrollController.endPageIndex.returns(0);

        const columnsInfo = dataController.getColumnsInfo();

        assert.strictEqual(columnsInfo.length, 3);
        assert.deepEqual(columnsInfo[1], []);
    });

    QUnit.test('Get page start with begin of header element. Columns', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: this.data
            },
            texts: texts
        }));

        dataController.columnPageSize(2);
        dataController._columnsScrollController.beginPageIndex.returns(4);
        dataController._columnsScrollController.endPageIndex.returns(5);
        const columnsInfo = dataController.getColumnsInfo();

        assert.strictEqual(columnsInfo.length, 2);

        assert.deepEqual(columnsInfo[0], [{
            'isLast': true,
            'path': [
                'Accessories'
            ],
            'rowspan': 2,
            'text': 'Accessories Total',
            'type': 'T'
        },
        {
            'colspan': 3,
            'expanded': true,
            'path': [
                'Bikes'
            ],
            'text': 'Bikes',
            'type': 'D'
        }]);
    });

    QUnit.test('Get all data when paging. Columns', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: this.data
            },
            texts: texts
        }));

        dataController.columnPageSize(2);
        dataController._columnsScrollController.beginPageIndex.returns(4);
        dataController._columnsScrollController.endPageIndex.returns(5);
        const columnsInfo = dataController.getColumnsInfo(true);

        assert.strictEqual(columnsInfo.length, 2);
        assert.strictEqual(columnsInfo[0].length, 9);
        assert.strictEqual(columnsInfo[1].length, 33);
    });

    QUnit.test('Get all data when paging. Rows', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                rows: this.data
            },
            texts: texts
        }));

        dataController.rowPageSize(2);
        dataController._rowsScrollController.beginPageIndex.returns(1);
        dataController._rowsScrollController.endPageIndex.returns(2);

        const rowsInfo = dataController.getRowsInfo(true);

        assert.strictEqual(rowsInfo.length, 38);
    });

    QUnit.test('get cells info', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum', format: 'decimal', area: 'data' }
                ],
                rows: [{ value: 'Vasya', index: 0 }, { value: 'Piter', index: 1 }],
                columns: [{
                    value: 'A', index: 0,
                    children: [{ value: 'P1', index: 1 }, { value: 'P2', index: 2 }]
                },
                { value: 'C', index: 3 }],
                values: [
                    [1, 2, 3, 6, 12],
                    [2, 3, 4, 9, 18],
                    [3, 5, 7, 15, 30]
                ]
            }
        }));

        dataController.columnPageSize(2);
        dataController._columnsScrollController.beginPageIndex.returns(1);
        dataController._columnsScrollController.endPageIndex.returns(2);

        dataController.rowPageSize(1);
        dataController._rowsScrollController.beginPageIndex.returns(1);
        dataController._rowsScrollController.endPageIndex.returns(2);


        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'GT', rowType: 'D', text: '18' }
            ],
            [
                { columnType: 'T', rowType: 'GT', text: '3' },
                { columnType: 'D', rowType: 'GT', text: '15' },
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ]
        ]);

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo(true)), [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'T', rowType: 'D', text: '1' },
                { columnType: 'D', rowType: 'D', text: '6' },
                { columnType: 'GT', rowType: 'D', text: '12' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'D', rowType: 'D', text: '4' },
                { columnType: 'T', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '9' },
                { columnType: 'GT', rowType: 'D', text: '18' }
            ],
            [
                { columnType: 'D', rowType: 'GT', text: '5' },
                { columnType: 'D', rowType: 'GT', text: '7' },
                { columnType: 'T', rowType: 'GT', text: '3' },
                { columnType: 'D', rowType: 'GT', text: '15' },
                { columnType: 'GT', rowType: 'GT', text: '30' }
            ]
        ], 'get All data');
    });

    QUnit.test('Get total count cells. Rows with data and empty columns', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'row' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                rows: this.data
            },
            texts: texts
        }));

        assert.strictEqual(dataController.totalRowCount(), 38);
        assert.strictEqual(dataController.totalColumnCount(), 1);
    });

    QUnit.test('Get total count cells. columns with data and empty rows', function(assert) {
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: this.data
            },
            texts: texts
        }));

        assert.strictEqual(dataController.totalRowCount(), 1);
        assert.strictEqual(dataController.totalColumnCount(), 38);
    });

    QUnit.test('Can get changingTime. after load columnsScrollController', function(assert) {
        const clock = sinon.useFakeTimers();
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: this.data
            }
        }));

        dataController.changed.add(function() {
            clock.tick(377);
        });

        const columnsScrollController = this.VirtualScrollController.firstCall.returnValue;
        const columnsDataAdapter = this.VirtualScrollController.firstCall.args[1];
        const rowsDataAdapter = this.VirtualScrollController.secondCall.args[1];

        columnsScrollController.handleDataChanged.returns('handleChangedResult');

        const loadResult = columnsDataAdapter.load();
        const handleDataChangedArg = columnsScrollController.handleDataChanged.lastCall.args[0];

        // act
        handleDataChangedArg();

        assert.ok(columnsScrollController);
        assert.strictEqual(loadResult, 'handleChangedResult');
        assert.strictEqual(columnsDataAdapter.changingDuration(), 377);
        assert.strictEqual(rowsDataAdapter.changingDuration(), 377);

        // teardown
        clock.restore();
    });

    QUnit.test('changingDuration if paginate', function(assert) {
        const clock = sinon.useFakeTimers();
        const dataController = new DataController(this.getOptions({
            dataSource: {
                paginate: true,
                fields: [
                    { area: 'column' },
                    { area: 'column' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: this.data
            }
        }));

        dataController._dataSource.paginate = function() {
            return true;
        };

        dataController.changed.add(function() {
            clock.tick(377);
        });

        const columnsScrollController = this.VirtualScrollController.firstCall.returnValue;
        const columnsDataAdapter = this.VirtualScrollController.firstCall.args[1];
        const rowsDataAdapter = this.VirtualScrollController.secondCall.args[1];

        columnsScrollController.handleDataChanged.returns('handleChangedResult');

        const loadResult = columnsDataAdapter.load();
        const handleDataChangedArg = columnsScrollController.handleDataChanged.lastCall.args[0];

        // act
        handleDataChangedArg();

        assert.ok(columnsScrollController);
        assert.strictEqual(loadResult, 'handleChangedResult');
        assert.strictEqual(columnsDataAdapter.changingDuration(), 300);
        assert.strictEqual(rowsDataAdapter.changingDuration(), 300);

        // teardown
        clock.restore();
    });

    QUnit.test('Can get changingTime. after load rowsScrollController', function(assert) {
        const clock = sinon.useFakeTimers();
        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: this.data
            }
        }));

        dataController.changed.add(function() {
            clock.tick(377);
        });

        const rowsScrollController = this.VirtualScrollController.secondCall.returnValue;
        const columnsDataAdapter = this.VirtualScrollController.firstCall.args[1];
        const rowsDataAdapter = this.VirtualScrollController.secondCall.args[1];

        rowsScrollController.handleDataChanged.returns('handleChangedResult');

        const loadResult = rowsDataAdapter.load();
        const handleDataChangedArg = rowsScrollController.handleDataChanged.lastCall.args[0];

        // act
        handleDataChangedArg();

        assert.ok(rowsScrollController);
        assert.strictEqual(loadResult, 'handleChangedResult');

        assert.strictEqual(columnsDataAdapter.changingDuration(), 377);
        assert.strictEqual(rowsDataAdapter.changingDuration(), 377);

        // teardown
        clock.restore();
    });

    QUnit.test('T327502. DataController changed once on update', function(assert) {
        this.VirtualScrollController.restore();

        const dataController = new DataController(this.getOptions({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column' },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: this.data
            }
        }));
        const changedCallback = sinon.stub();

        dataController.changed.add(changedCallback);
        // act
        dataController.getDataSource().load();
        // assert
        assert.ok(changedCallback.calledOnce);
    });


});

QUnit.module('StateStoring', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.component = {
            option: function() { }
        };

        this.stateStoringController.isEnabled.returns(true);

        this.stateStoringController.load.returns($.Deferred().resolve({ fields: [{ area: 'column', filterValues: ['ValueFromState'] }] }));
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
    }
}, () => {
    QUnit.test('Create stateStoringController', function(assert) {
        new DataController({
            component: this.component,
            dataSource: {
                fields: []
            }
        });

        assert.ok(stateStoring.StateStoringController.calledOnce);
        assert.ok(stateStoring.StateStoringController.calledWithNew);
        assert.strictEqual(stateStoring.StateStoringController.lastCall.args[0], this.component);

        assert.ok(stateStoring.StateStoringController.lastCall.returnValue.init.calledOnce);

        assert.strictEqual(this.stateStoringController.state.callCount, 1);
        assert.deepEqual(this.stateStoringController.state.lastCall.args[0], {
            'columnExpandedPaths': [],
            'fields': [],
            'rowExpandedPaths': []
        });
        assert.ok(this.stateStoringController.save.calledAfter(this.stateStoringController.state));
    });

    QUnit.test('Create stateStoringController when state storing is disabled', function(assert) {
        this.stateStoringController.isEnabled.returns(false);

        new DataController({
            component: this.component,
            dataSource: {
                fields: []
            }
        });

        assert.ok(stateStoring.StateStoringController.calledOnce);
        assert.ok(stateStoring.StateStoringController.calledWithNew);
        assert.strictEqual(stateStoring.StateStoringController.lastCall.args[0], this.component);

        assert.ok(stateStoring.StateStoringController.lastCall.returnValue.init.calledOnce);

        assert.strictEqual(this.stateStoringController.state.callCount, 0);
    });

    QUnit.test('Load dataController when stateStoring isEnabled', function(assert) {
        const dataController = new DataController({
            component: this.component,
            dataSource: {
                fields: [{}]
            }
        });

        assert.deepEqual(dataController._dataSource.fields(), [{
            area: 'column',
            areaIndex: 0,
            caption: '',
            filterValues: [
                'ValueFromState'
            ],
            expanded: undefined,
            filterType: undefined,
            index: 0,

            sortBy: undefined,
            sortBySummaryField: undefined,
            sortBySummaryPath: undefined,
            sortOrder: undefined,
            _initProperties: {
                caption: undefined,
                area: undefined,
                areaIndex: undefined,
                expanded: undefined,
                filterType: undefined,
                filterValues: undefined,
                sortBy: undefined,
                sortBySummaryField: undefined,
                sortBySummaryPath: undefined,
                sortOrder: undefined
            }
        }]);
    });

    QUnit.test('Load dataController when stateStoring is disabled', function(assert) {
        this.stateStoringController.isEnabled.returns(false);

        const dataController = new DataController({
            component: this.component,
            dataSource: {
                fields: [{}]
            }
        });


        assert.deepEqual(dataController._dataSource.fields(), [{
            caption: '',
            '_initProperties': {
                'caption': undefined
            },
            index: 0
        }]);
    });

    QUnit.test('Load dataController when stateStoring is enabled and no state', function(assert) {
        this.stateStoringController.isEnabled.returns(false);
        this.stateStoringController.load.returns($.Deferred().resolve(undefined));

        const dataController = new DataController({
            component: this.component,
            dataSource: {
                fields: [{}]
            }
        });

        assert.deepEqual(dataController._dataSource.fields(), [{
            caption: '',
            '_initProperties': {
                'caption': undefined
            },
            index: 0
        }]);
    });
});

QUnit.module('Begin/end loading changing', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.dataController = new DataController({
            dataSource: {
                fields: [
                    { area: 'column' },
                    { area: 'column', width: 100 },
                    { area: 'data', caption: 'Sum', format: 'fixedPoint' }
                ],
                columns: [{
                    value: 'A', children: [{ value: 'P1' }, { value: 'P2' }]
                },
                { value: 'C1' }]
            },
            texts: texts
        });
        sinon.spy(this.dataController._dataSource, 'beginLoading');
        sinon.spy(this.dataController._dataSource, 'endLoading');
    },
    afterEach: function() {
        moduleConfig.afterEach.call(this);
    }
}, () => {

    QUnit.test('beginLoading', function(assert) {
        this.dataController.beginLoading();

        assert.equal(this.dataController._dataSource.beginLoading.callCount, 1, 'beginLoading was called once');
        assert.equal(this.dataController._dataSource.endLoading.callCount, 0, 'endLoading was not called');
    });

    QUnit.test('endLoading', function(assert) {
        this.dataController.endLoading();

        assert.equal(this.dataController._dataSource.beginLoading.callCount, 0, 'beginLoading was not called');
        assert.equal(this.dataController._dataSource.endLoading.callCount, 1, 'endLoading was called once');
    });
});

QUnit.module('Remote paging', {
    beforeEach: function() {
        const createItems = function(count, prefix, skip, take, desc) {
            const items = [];

            for(let i = 0; i < count; i++) {
                const value = prefix + (desc ? count - i : i + 1);

                if((skip && i < skip) || (take && i >= skip + take)) {
                    items.push({});
                } else {
                    items.push({
                        value: value,
                        text: value,
                        index: i - skip + 1
                    });
                }
            }
            return items;
        };

        const createValues = function(loadOptions, columnCount) {
            const result = [];
            for(let rowIndex = loadOptions.rowSkip; rowIndex < loadOptions.rowSkip + loadOptions.rowTake + 1; rowIndex++) {
                const row = [];
                result.push(row);
                for(let columnIndex = loadOptions.columnSkip; columnIndex < loadOptions.columnSkip + loadOptions.columnTake + 1; columnIndex++) {
                    row.push([ rowIndex * 10 + columnIndex ]);
                }
            }
            return result;
        };

        const that = this;
        this.loadArgs = [];

        const MockStore = Class.inherit({
            ctor: function(options) {
                this._rowCount = options.rowCount;
                this._columnCount = options.columnCount;
            },
            getFields: function() {
                return $.Deferred().resolve([]);
            },
            supportPaging: function() {
                return true;
            },
            load: function(loadOptions) {
                that.loadArgs.push(loadOptions);
                const rowCount = loadOptions.rows.length ? this._rowCount : 0;
                const columnCount = loadOptions.columns.length ? this._columnCount : 0;

                return $.Deferred().resolve({
                    rows: createItems(rowCount, 'row ', loadOptions.rowSkip, loadOptions.rowTake, rowCount && loadOptions.rows[0].sortOrder === 'desc'),
                    columns: createItems(columnCount, 'column ', loadOptions.columnSkip, loadOptions.columnTake, columnCount && loadOptions.columns[0].sortOrder === 'desc'),
                    values: createValues(loadOptions),
                    grandTotalRowIndex: 0,
                    grandTotalColumnIndex: 0
                });
            }
        });

        this.component = {
            option: function(name) {
                if(name === 'scrolling.mode') {
                    return 'virtual';
                }
                if(name === 'scrolling.loadTwoPagesOnStart') {
                    return true;
                }
            }
        };

        this.getOptions = function(options) {
            return $.extend({
                component: this.component
            }, options || {});
        };

        this.createDataSource = function(rowFieldCount, columnFieldCount) {
            rowFieldCount = rowFieldCount === undefined ? 1 : rowFieldCount;
            columnFieldCount = columnFieldCount === undefined ? 1 : columnFieldCount;
            return {
                paginate: true,
                store: new this.MockStore({
                    rowCount: 10,
                    columnCount: 10
                }),
                pageSize: 4,
                fields: Array.apply(null, Array(rowFieldCount)).map(function() { return { area: 'row' }; })
                    .concat(
                        Array.apply(null, Array(columnFieldCount)).map(function() { return { area: 'column' }; })
                    ).concat(
                        [{ area: 'data' }]
                    )
            };
        };

        this.setup = function(dataSourceOptions) {
            const dataController = new DataController(this.getOptions({
                dataSource: dataSourceOptions || this.createDataSource(),
                texts: texts
            }));

            dataController.columnPageSize(2);
            dataController.rowPageSize(2);

            this.loadArgs = [];

            dataController.getDataSource().reload();

            return dataController;
        };

        this.MockStore = MockStore;
        executeAsyncMock.setup();
    },

    afterEach: function() {
        executeAsyncMock.teardown();
    }
}, () => {

    QUnit.test('first load', function(assert) {
        const dataController = this.setup();

        assert.strictEqual(this.loadArgs.length, 1, 'one load');
        assert.strictEqual(this.loadArgs[0].rows.length, 1, 'load args rows');
        assert.strictEqual(this.loadArgs[0].columns.length, 1, 'load args columns');
        assert.strictEqual(this.loadArgs[0].rowSkip, 0, 'load args rowSkip');
        assert.strictEqual(this.loadArgs[0].columnSkip, 0, 'load args columnSkip');
        assert.strictEqual(this.loadArgs[0].rowTake, 2, 'load args rowTake');
        assert.strictEqual(this.loadArgs[0].columnTake, 2, 'load args columnTake');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            { dataSourceIndex: 1, text: 'column 1', path: ['column 1'], type: 'D', isLast: true },
            { dataSourceIndex: 2, text: 'column 2', path: ['column 2'], type: 'D', isLast: true }
        ]]);

        assert.deepEqual(dataController.getRowsInfo(), [
            [{ dataSourceIndex: 1, text: 'row 1', path: ['row 1'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 2, text: 'row 2', path: ['row 2'], type: 'D', isLast: true }]
        ]);

        assert.deepEqual(prepareCellsInfo(dataController.getCellsInfo()), [
            [
                { columnType: 'D', rowType: 'D', text: '11' },
                { columnType: 'D', rowType: 'D', text: '12' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '21' },
                { columnType: 'D', rowType: 'D', text: '22' }
            ]
        ]);
    });

    QUnit.test('expanded field option should be ignored', function(assert) {
        const dataController = this.setup({
            paginate: true,
            store: new this.MockStore({
                rowCount: 10,
                columnCount: 10
            }),
            pageSize: 4,
            fields: [
                { area: 'row', expanded: true }, { area: 'row' },
                { area: 'column', expanded: true }, { area: 'column' },
                { area: 'data' }
            ]
        });

        assert.strictEqual(this.loadArgs.length, 1, 'one load');
        assert.strictEqual(this.loadArgs[0].rows.length, 2, 'load args rows');
        assert.strictEqual(this.loadArgs[0].columns.length, 2, 'load args columns');
        assert.strictEqual(this.loadArgs[0].rowSkip, 0, 'load args rowSkip');
        assert.strictEqual(this.loadArgs[0].columnSkip, 0, 'load args columnSkip');
        assert.strictEqual(this.loadArgs[0].rowTake, 2, 'load args rowTake');
        assert.strictEqual(this.loadArgs[0].columnTake, 2, 'load args columnTake');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            { dataSourceIndex: 1, text: 'column 1', path: ['column 1'], type: 'D', isLast: true, expanded: false },
            { dataSourceIndex: 2, text: 'column 2', path: ['column 2'], type: 'D', isLast: true, expanded: false }
        ]]);

        assert.deepEqual(dataController.getRowsInfo(), [
            [{ dataSourceIndex: 1, text: 'row 1', path: ['row 1'], type: 'D', isLast: true, expanded: false }],
            [{ dataSourceIndex: 2, text: 'row 2', path: ['row 2'], type: 'D', isLast: true, expanded: false }]
        ]);
    });

    QUnit.test('load after scroll', function(assert) {
        const dataController = this.setup();

        this.loadArgs = [];

        dataController.setViewportPosition(0, 4 * 20);

        assert.strictEqual(this.loadArgs.length, 1, 'one load');
        assert.strictEqual(this.loadArgs[0].rows.length, 1, 'load args rows');
        assert.strictEqual(this.loadArgs[0].columns.length, 1, 'load args columns');
        assert.strictEqual(this.loadArgs[0].rowSkip, 4, 'load args rowSkip');
        assert.strictEqual(this.loadArgs[0].rowTake, 4, 'load args rowTake');
        assert.strictEqual(this.loadArgs[0].columnSkip, 0, 'load args columnSkip');
        assert.strictEqual(this.loadArgs[0].columnTake, 4, 'load args columnTake');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            { dataSourceIndex: 1, text: 'column 1', path: ['column 1'], type: 'D', isLast: true },
            { dataSourceIndex: 2, text: 'column 2', path: ['column 2'], type: 'D', isLast: true },
            { dataSourceIndex: 3, text: 'column 3', path: ['column 3'], type: 'D', isLast: true },
            { dataSourceIndex: 4, text: 'column 4', path: ['column 4'], type: 'D', isLast: true },
        ]]);

        assert.deepEqual(dataController.getRowsInfo(), [
            [{ dataSourceIndex: 3, text: 'row 5', path: ['row 5'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 4, text: 'row 6', path: ['row 6'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 5, text: 'row 7', path: ['row 7'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 6, text: 'row 8', path: ['row 8'], type: 'D', isLast: true }],
        ]);
    });

    QUnit.test('load from cache after scroll and return scroll', function(assert) {
        const dataController = this.setup();

        dataController.setViewportPosition(0, 0);
        dataController.setViewportPosition(0, 8 * 20);

        this.loadArgs = [];
        dataController.setViewportPosition(0, 0);

        assert.strictEqual(this.loadArgs.length, 0, 'no load');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            { dataSourceIndex: 1, text: 'column 1', path: ['column 1'], type: 'D', isLast: true },
            { dataSourceIndex: 2, text: 'column 2', path: ['column 2'], type: 'D', isLast: true },
            { dataSourceIndex: 3, text: 'column 3', path: ['column 3'], type: 'D', isLast: true },
            { dataSourceIndex: 4, text: 'column 4', path: ['column 4'], type: 'D', isLast: true },
        ]]);
        assert.deepEqual(dataController.getRowsInfo(), [
            [{ dataSourceIndex: 1, text: 'row 1', path: ['row 1'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 2, text: 'row 2', path: ['row 2'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 3, text: 'row 3', path: ['row 3'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 4, text: 'row 4', path: ['row 4'], type: 'D', isLast: true }]
        ]);
    });

    QUnit.test('change sort order', function(assert) {
        const dataController = this.setup();

        this.loadArgs = [];

        dataController.getDataSource().field(0, { sortOrder: 'desc' });
        dataController.getDataSource().load();

        assert.strictEqual(this.loadArgs.length, 1, 'one load');
        assert.strictEqual(this.loadArgs[0].rows.length, 1, 'load args rows');
        assert.strictEqual(this.loadArgs[0].columns.length, 1, 'load args columns');
        assert.strictEqual(this.loadArgs[0].rowSkip, 0, 'load args rowSkip');
        assert.strictEqual(this.loadArgs[0].columnSkip, 0, 'load args columnSkip');
        assert.strictEqual(this.loadArgs[0].rowTake, 2, 'load args rowTake');
        assert.strictEqual(this.loadArgs[0].columnTake, 2, 'load args columnTake');

        assert.deepEqual(dataController.getColumnsInfo(), [[
            { dataSourceIndex: 1, text: 'column 1', path: ['column 1'], type: 'D', isLast: true },
            { dataSourceIndex: 2, text: 'column 2', path: ['column 2'], type: 'D', isLast: true },
        ]]);

        assert.deepEqual(dataController.getRowsInfo(), [
            [{ dataSourceIndex: 1, text: 'row 10', path: ['row 10'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 2, text: 'row 9', path: ['row 9'], type: 'D', isLast: true }]
        ]);
    });

    QUnit.test('expand row', function(assert) {
        const dataController = this.setup(this.createDataSource(2, 0));

        this.loadArgs = [];
        dataController.expandHeaderItem('row', ['row 1']);

        assert.strictEqual(this.loadArgs.length, 1, 'one load');
        assert.strictEqual(this.loadArgs[0].headerName, 'rows', 'load args headerName');
        assert.strictEqual(this.loadArgs[0].area, 'row', 'load args area');
        assert.deepEqual(this.loadArgs[0].path, ['row 1'], 'load args path');
        assert.strictEqual(this.loadArgs[0].rows.length, 2, 'load args rows');
        assert.strictEqual(this.loadArgs[0].columns.length, 0, 'load args columns');
        assert.strictEqual(this.loadArgs[0].rowSkip, 0, 'load args rowSkip');
        assert.strictEqual(this.loadArgs[0].rowTake, 4, 'load args rowTake');
        assert.strictEqual(this.loadArgs[0].columnSkip, 0, 'load args columnSkip');
        assert.strictEqual(this.loadArgs[0].columnTake, 4, 'load args columnTake');

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { dataSourceIndex: 1, text: 'row 1', path: ['row 1'], type: 'D', expanded: true, rowspan: 2 },
                { dataSourceIndex: 4, text: 'row 1', path: ['row 1', 'row 1'], type: 'D', isLast: true }
            ],
            [{ dataSourceIndex: 5, text: 'row 2', path: ['row 1', 'row 2'], type: 'D', isLast: true }]
        ]);
    });

    QUnit.test('reload after expand row', function(assert) {
        const dataController = this.setup(this.createDataSource(2, 1));

        dataController.expandHeaderItem('row', ['row 1']);

        this.loadArgs = [];
        dataController.getDataSource().reload();

        assert.deepEqual(this.loadArgs.map(function(options) {
            return {
                path: options.path,
                area: options.area,
                rowSkip: options.rowSkip,
                rowTake: options.rowTake,
                columnSkip: options.columnSkip,
                columnTake: options.columnTake
            };
        }), [
            { path: undefined, area: undefined, rowSkip: 0, rowTake: 2, columnSkip: 0, columnTake: 2 },
            { path: ['row 1'], area: 'row', rowSkip: 0, rowTake: 4, columnSkip: 0, columnTake: 2 }
        ], 'load options');

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { dataSourceIndex: 1, text: 'row 1', path: ['row 1'], type: 'D', expanded: true, rowspan: 2 },
                { dataSourceIndex: 4, text: 'row 1', path: ['row 1', 'row 1'], type: 'D', isLast: true }
            ],
            [{ dataSourceIndex: 5, text: 'row 2', path: ['row 1', 'row 2'], type: 'D', isLast: true }]
        ]);
    });

    QUnit.test('expand column', function(assert) {
        const dataController = this.setup(this.createDataSource(0, 2));

        this.loadArgs = [];
        dataController.expandHeaderItem('column', ['column 1']);

        assert.strictEqual(this.loadArgs.length, 1, 'one load');
        assert.strictEqual(this.loadArgs[0].headerName, 'columns', 'load args headerName');
        assert.strictEqual(this.loadArgs[0].area, 'column', 'load args area');
        assert.deepEqual(this.loadArgs[0].path, ['column 1'], 'load args path');
        assert.strictEqual(this.loadArgs[0].rows.length, 0, 'load args rows');
        assert.strictEqual(this.loadArgs[0].columns.length, 2, 'load args columns');
        assert.strictEqual(this.loadArgs[0].rowSkip, 0, 'load args rowSkip');
        assert.strictEqual(this.loadArgs[0].rowTake, 4, 'load args rowTake');
        assert.strictEqual(this.loadArgs[0].columnSkip, 0, 'load args columnSkip');
        assert.strictEqual(this.loadArgs[0].columnTake, 4, 'load args columnTake');

        assert.deepEqual(dataController.getColumnsInfo(), [
            [{ dataSourceIndex: 1, text: 'column 1', path: ['column 1'], type: 'D', expanded: true, colspan: 2 }],
            [
                { dataSourceIndex: 4, text: 'column 1', path: ['column 1', 'column 1'], type: 'D', isLast: true },
                { dataSourceIndex: 5, text: 'column 2', path: ['column 1', 'column 2'], type: 'D', isLast: true },
            ]
        ]);
    });

    QUnit.test('collapse row', function(assert) {
        const dataController = this.setup(this.createDataSource(2, 0));

        dataController.expandHeaderItem('row', ['row 1']);

        this.loadArgs = [];
        dataController.collapseHeaderItem('row', ['row 1']);

        assert.strictEqual(this.loadArgs.length, 0, 'no load');

        assert.deepEqual(dataController.getRowsInfo(), [
            [{ dataSourceIndex: 1, text: 'row 1', path: ['row 1'], type: 'D', isLast: true, expanded: false }],
            [{ dataSourceIndex: 2, text: 'row 2', path: ['row 2'], type: 'D', isLast: true, expanded: false }],
        ]);
    });

    QUnit.test('expand several rows and columns', function(assert) {
        const dataController = this.setup({
            paginate: true,
            store: new this.MockStore({
                rowCount: 10,
                columnCount: 10
            }),
            pageSize: 4,
            fields: [
                { area: 'row' }, { area: 'row' }, { area: 'row' },
                { area: 'column' }, { area: 'column' }, { area: 'column' },
                { area: 'data' }
            ]
        });

        dataController.expandHeaderItem('column', ['column 1']);
        dataController.expandHeaderItem('column', ['column 1', 'column 2']);
        dataController.expandHeaderItem('row', ['row 1']);

        this.loadArgs = [];
        dataController.expandHeaderItem('row', ['row 1', 'row 2']);

        assert.deepEqual(this.loadArgs.map(function(options) {
            return {
                path: options.path,
                oppositePath: options.oppositePath,
                area: options.area,
                rowSkip: options.rowSkip,
                rowTake: options.rowTake,
                columnSkip: options.columnSkip,
                columnTake: options.columnTake
            };
        }), [
            { path: ['row 1', 'row 2'], area: 'row', rowSkip: 0, rowTake: 4, columnSkip: 0, columnTake: 4, oppositePath: undefined },
            { path: ['row 1', 'row 2'], area: 'row', rowSkip: 0, rowTake: 4, columnSkip: 0, columnTake: 4, oppositePath: ['column 1'] },
            { path: ['row 1', 'row 2'], area: 'row', rowSkip: 0, rowTake: 4, columnSkip: 0, columnTake: 4, oppositePath: ['column 1', 'column 2'] },
        ], 'load options');

        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                {
                    'colspan': 2,
                    'dataSourceIndex': 1,
                    'expanded': true,
                    'path': [
                        'column 1'
                    ],
                    'text': 'column 1',
                    'type': 'D'
                }
            ],
            [
                {
                    'dataSourceIndex': 4,
                    'expanded': false,
                    'isLast': true,
                    'path': [
                        'column 1',
                        'column 1'
                    ],
                    'rowspan': 2,
                    'text': 'column 1',
                    'type': 'D'
                },
                {
                    'colspan': 1,
                    'dataSourceIndex': 5,
                    'expanded': true,
                    'path': [
                        'column 1',
                        'column 2'
                    ],
                    'text': 'column 2',
                    'type': 'D'
                }
            ],
            [
                {
                    'dataSourceIndex': 9,
                    'isLast': true,
                    'path': [
                        'column 1',
                        'column 2',
                        'column 1'
                    ],
                    'text': 'column 1',
                    'type': 'D'
                }
            ]
        ], 'columns');

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                {
                    'dataSourceIndex': 1,
                    'expanded': true,
                    'path': [
                        'row 1'
                    ],
                    'rowspan': 2,
                    'text': 'row 1',
                    'type': 'D'
                },
                {
                    'colspan': 2,
                    'dataSourceIndex': 6,
                    'expanded': false,
                    'isLast': true,
                    'path': [
                        'row 1',
                        'row 1'
                    ],
                    'text': 'row 1',
                    'type': 'D'
                }
            ],
            [
                {
                    'dataSourceIndex': 7,
                    'expanded': true,
                    'path': [
                        'row 1',
                        'row 2'
                    ],
                    'rowspan': 1,
                    'text': 'row 2',
                    'type': 'D'
                },
                {
                    'dataSourceIndex': 11,
                    'isLast': true,
                    'path': [
                        'row 1',
                        'row 2',
                        'row 1'
                    ],
                    'text': 'row 1',
                    'type': 'D'
                }
            ]
        ], 'rows');
    });

    QUnit.test('scroll after expand row', function(assert) {
        const dataController = this.setup(this.createDataSource(2, 0));

        dataController.expandHeaderItem('row', ['row 2']);

        this.loadArgs = [];
        const changedSpy = sinon.spy();
        dataController.changed.add(changedSpy);

        dataController.setViewportPosition(0, 4 * 20);

        assert.deepEqual(this.loadArgs.map(function(options) {
            return {
                path: options.path,
                rowSkip: options.rowSkip,
                rowTake: options.rowTake
            };
        }), [{ path: ['row 2'], rowSkip: 4, rowTake: 4 }], 'load options');

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { dataSourceIndex: 2, text: 'row 2', path: ['row 2'], type: 'D', expanded: true, rowspan: 4 },
                { dataSourceIndex: 7, text: 'row 4', path: ['row 2', 'row 4'], type: 'D', isLast: true }
            ],
            [{ dataSourceIndex: 8, text: 'row 5', path: ['row 2', 'row 5'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 9, text: 'row 6', path: ['row 2', 'row 6'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 10, text: 'row 7', path: ['row 2', 'row 7'], type: 'D', isLast: true }]
        ], 'rows info');

        assert.strictEqual(changedSpy.callCount, 3, 'changed call count');
    });

    QUnit.test('scroll by columns after expand column', function(assert) {
        const dataController = this.setup(this.createDataSource(0, 2));

        dataController.expandHeaderItem('column', ['column 2']);

        this.loadArgs = [];
        const changedSpy = sinon.spy();
        dataController.changed.add(changedSpy);

        dataController.setViewportPosition(4 * 20, 0);

        assert.deepEqual(this.loadArgs.map(function(options) {
            return {
                path: options.path,
                columnSkip: options.columnSkip,
                columnTake: options.columnTake
            };
        }), [{ path: ['column 2'], columnSkip: 4, columnTake: 4 }], 'load options');

        assert.deepEqual(dataController.getColumnsInfo(), [
            [{ dataSourceIndex: 2, text: 'column 2', path: ['column 2'], type: 'D', expanded: true, colspan: 4 }],
            [
                { dataSourceIndex: 7, text: 'column 4', path: ['column 2', 'column 4'], type: 'D', isLast: true },
                { dataSourceIndex: 8, text: 'column 5', path: ['column 2', 'column 5'], type: 'D', isLast: true },
                { dataSourceIndex: 9, text: 'column 6', path: ['column 2', 'column 6'], type: 'D', isLast: true },
                { dataSourceIndex: 10, text: 'column 7', path: ['column 2', 'column 7'], type: 'D', isLast: true }
            ]
        ], 'rows info');

        assert.strictEqual(changedSpy.callCount, 3, 'changed call count');
    });

    QUnit.test('scroll by rows after expand column', function(assert) {
        const dataController = this.setup(this.createDataSource(1, 2));

        dataController.expandHeaderItem('column', ['column 2']);

        this.loadArgs = [];
        const changedSpy = sinon.spy();
        dataController.changed.add(changedSpy);

        dataController.setViewportPosition(0, 4 * 20);

        assert.deepEqual(this.loadArgs.map(function(options) {
            return {
                path: options.path,
                columnSkip: options.columnSkip,
                columnTake: options.columnTake,
                rowSkip: options.rowSkip,
                rowTake: options.rowTake
            };
        }), [
            { path: undefined, columnSkip: 0, columnTake: 4, rowSkip: 4, rowTake: 4 },
            { path: ['column 2'], columnSkip: 0, columnTake: 4, rowSkip: 4, rowTake: 4 }
        ], 'load options');

        assert.deepEqual(dataController.getColumnsInfo(), [
            [
                { dataSourceIndex: 1, text: 'column 1', path: ['column 1'], type: 'D', expanded: false, rowspan: 2, isLast: true },
                { dataSourceIndex: 2, text: 'column 2', path: ['column 2'], type: 'D', expanded: true, colspan: 3 }
            ],
            [
                { dataSourceIndex: 4, text: 'column 1', path: ['column 2', 'column 1'], type: 'D', isLast: true },
                { dataSourceIndex: 5, text: 'column 2', path: ['column 2', 'column 2'], type: 'D', isLast: true },
                { dataSourceIndex: 6, text: 'column 3', path: ['column 2', 'column 3'], type: 'D', isLast: true }
            ]
        ], 'rows info');

        assert.strictEqual(changedSpy.callCount, 4, 'changed call count');
    });

    QUnit.test('scroll to end of expanded row', function(assert) {
        const dataController = this.setup(this.createDataSource(2, 0));

        dataController.expandHeaderItem('row', ['row 2']);

        this.loadArgs = [];
        const changedSpy = sinon.spy();
        dataController.changed.add(changedSpy);

        dataController.setViewportPosition(0, 10 * 20);

        assert.deepEqual(this.loadArgs.map(function(options) {
            return {
                path: options.path,
                rowSkip: options.rowSkip,
                rowTake: options.rowTake
            };
        }), [
            { path: ['row 2'], rowSkip: 8, rowTake: 4 },
            { path: undefined, rowSkip: 0, rowTake: 4 }
        ], 'load options');

        assert.deepEqual(dataController.getRowsInfo(), [
            [
                { dataSourceIndex: 2, text: 'row 2', path: ['row 2'], type: 'D', expanded: true, rowspan: 1 },
                { dataSourceIndex: 9, text: 'row 10', path: ['row 2', 'row 10'], type: 'D', isLast: true }
            ],
            [{ dataSourceIndex: 2, text: 'row 2 Total', path: ['row 2'], type: 'T', isLast: true, colspan: 2 }],
            [{ dataSourceIndex: 10, text: 'row 3', path: ['row 3'], type: 'D', isLast: true, colspan: 2, expanded: false }],
            [{ dataSourceIndex: 11, text: 'row 4', path: ['row 4'], type: 'D', isLast: true, colspan: 2, expanded: false }]
        ], 'rows info');

        assert.strictEqual(changedSpy.callCount, 3, 'changed call count');
    });

    QUnit.skip('load with CustomStore', function(assert) {
        const that = this;

        const dataController = that.setup({
            paginate: true,
            fields: [{ dataField: 'row', area: 'row' }],
            load: function(loadOptions) {
                that.loadArgs.push(loadOptions);
                return $.Deferred().resolve([{ key: 'row 1' }, { key: 'row 2' }], {
                    groupCount: 10
                });
            }
        });

        assert.strictEqual(this.loadArgs.length, 1, 'one load');
        assert.deepEqual(this.loadArgs[0], {
            group: [{
                desc: false,
                groupInterval: undefined,
                isExpanded: false,
                selector: 'row'
            }],
            groupSummary: [],
            requireGroupCount: true,
            skip: 0,
            take: 2,
            totalSummary: []
        }, 'load args');

        assert.deepEqual(dataController.getRowsInfo(), [
            [{ dataSourceIndex: 1, text: 'row 1', path: ['row 1'], type: 'D', isLast: true }],
            [{ dataSourceIndex: 2, text: 'row 2', path: ['row 2'], type: 'D', isLast: true }]
        ]);
    });

});

