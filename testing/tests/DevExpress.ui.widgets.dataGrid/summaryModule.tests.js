QUnit.testStart(function() {
    const markup =
'<div>\
    <div id="container" class="dx-datagrid"></div>\
</div>';

    $('#qunit-fixture').html(markup);
});


import 'common.css!';

import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import { setupDataGridModules, MockDataController, MockColumnsController } from '../../helpers/dataGridMocks.js';

import summaryModule from 'ui/data_grid/ui.data_grid.summary';

function getFooterOptions(cellsByColumns, cellsCount) {
    let i;
    let cell;
    const cells = [];

    for(i = 0; i < cellsCount; i++) {
        cell = cellsByColumns[i.toString()];
        if(cell) {
            cells.push(cell);
        } else {
            cells.push([]);
        }
    }
    return { rowType: 'totalFooter', summaryCells: cells };
}

QUnit.module('Summary footer', {
    beforeEach: function() {
        const that = this;
        that.defaultFooterOptions = getFooterOptions({
            0: [
                { summaryType: 'count', value: 100 },
                { summaryType: 'min', value: 0 },
                { summaryType: 'max', value: 120001 }
            ],
            2: [
                { summaryType: 'sum', value: 1234 },
                { summaryType: 'avg', value: 123.54 }
            ]
        }, 5);

        that.createFooterView = function(totalItem, rows, columns) {
            rows = rows || [{ values: [1, 2, 3, 4, 5] }];
            columns = columns || [
                { caption: 'Column 1', alignment: 'left' },
                { caption: 'Column 2', alignment: 'left' },
                { caption: 'Column 3', alignment: 'right' },
                { caption: 'Column 4', alignment: 'right' },
                { caption: 'Column 5', alignment: 'left' }
            ];

            const mockDataGrid = {
                options: that.options,
                element: function() {
                    return $('#container');
                }
            };

            that.columnsController = new MockColumnsController(columns);
            that.dataController = new MockDataController({ items: rows, totalItem: totalItem });

            setupDataGridModules(mockDataGrid, ['data', 'columns', 'rows', 'summary'], {
                initViews: true,
                controllers: {
                    columns: that.columnsController,
                    data: that.dataController
                },
                initDefaultOptions: true
            });

            that.rowsView = mockDataGrid.rowsView;

            return mockDataGrid.footerView;
        };
    }
});

QUnit.test('Render when summary is defined', function(assert) {
    // arrange
    const footerView = this.createFooterView(this.defaultFooterOptions);
    let $summary;
    let $cells;

    // act
    footerView.render($('#container'));
    $summary = $('.dx-datagrid-summary-item');
    $cells = $('.dx-row td');

    // assert
    assert.equal($('col').length, 5, 'col elements count');
    assert.equal($('.dx-datagrid-total-footer').length, 1, 'footer element');
    assert.equal($('.dx-datagrid-scroll-container').length, 1, 'scroll container');
    assert.equal($summary.length, 5, 'summary elements');
    assert.equal($summary.eq(0).text(), 'Count: 100', 'one summary item text');
    assert.equal($summary.eq(1).text(), 'Min: 0', 'two summary item text');
    assert.equal($summary.eq(2).text(), 'Max: 120001', 'three summary item text');
    assert.equal($summary.eq(3).text(), 'Sum: 1234', 'four summary item text');
    assert.equal($summary.eq(4).text(), 'Avg: 123.54', 'five summary item text');
    $.each($cells, function(index, cell) {
        assert.equal($(cell).attr('role'), 'gridcell', 'Every cell in row has correct role');
    });
});

// T298904
QUnit.test('rowClick event when summary is defined', function(assert) {
    const rowClickArgs = [];
    this.options = {
        onRowClick: function(e) {
            rowClickArgs.push(e);
        }
    };

    // arrange
    const footerView = this.createFooterView(this.defaultFooterOptions);

    footerView.render($('#container'));
    const $summary = $('.dx-datagrid-summary-item');

    // act
    $summary.eq(1).trigger('dxclick');

    // assert
    assert.equal(rowClickArgs.length, 1, 'rowClick call count');
    assert.ok($(rowClickArgs[0].rowElement).hasClass('dx-row'), 'rowElement is defined');
    assert.equal(rowClickArgs[0].rowType, 'totalFooter', 'rowType is defined');
    assert.equal(rowClickArgs[0].summaryCells.length, 5, 'summaryCells is defined');
    assert.equal(rowClickArgs[0].columns.length, 5, 'columns is defined');
});

QUnit.test('Summary is not rendered when summary is not defined in an options', function(assert) {
    // arrange
    const footerView = this.createFooterView();

    // act
    footerView.render($('#container'));

    // assert
    assert.ok(!$('.dx-datagrid-total-footer').length, 'footer element');
    assert.ok(!$('.dx-datagrid-summary-item').length, 'summary elements');
});

QUnit.test('Text alignment by default', function(assert) {
    // arrange
    const footerView = this.createFooterView(this.defaultFooterOptions);
    let $summaryItems;

    // act
    footerView.render($('#container'));
    $summaryItems = $('.dx-datagrid-summary-item');

    assert.equal($summaryItems.length, 5, 'cells count');
    assert.equal($summaryItems.eq(0).css('textAlign'), 'left');
    assert.equal($summaryItems.eq(1).css('textAlign'), 'left');
    assert.equal($summaryItems.eq(2).css('textAlign'), 'left');
    assert.equal($summaryItems.eq(3).css('textAlign'), 'right');
    assert.equal($summaryItems.eq(4).css('textAlign'), 'right');
});

QUnit.test('Customize text alignment', function(assert) {
    // arrange
    const footerView = this.createFooterView(getFooterOptions({
        0: [
            { summaryType: 'count', value: 100, alignment: 'center' },
            { summaryType: 'min', value: 0, alignment: 'center' },
            { summaryType: 'max', value: 120001, alignment: 'center' }
        ],
        2: [
            { summaryType: 'sum', value: 1234, alignment: 'right' },
            { summaryType: 'avg', value: 123.54, alignment: 'right' }
        ]
    }, 5));
    let $summaryItems;

    // act
    footerView.render($('#container'));
    $summaryItems = $('.dx-datagrid-summary-item');

    assert.equal($summaryItems.length, 5, 'cells count');
    assert.equal($summaryItems.eq(0).css('textAlign'), 'center', 'count');
    assert.equal($summaryItems.eq(1).css('textAlign'), 'center', 'min');
    assert.equal($summaryItems.eq(2).css('textAlign'), 'center', 'max');
    assert.equal($summaryItems.eq(3).css('textAlign'), 'right', 'sum');
    assert.equal($summaryItems.eq(4).css('textAlign'), 'right', 'avg');
});

QUnit.test('Repeated rendering', function(assert) {
    // arrange
    const footerView = this.createFooterView(this.defaultFooterOptions);
    const $container = $('#container');

    // act
    footerView.render($container);
    footerView.render($container);

    // assert
    assert.equal($('col').length, 5, 'col elements count');
    assert.equal($('.dx-datagrid-total-footer').length, 1, 'footer element');
    assert.equal($('.dx-datagrid-summary-item').length, 5, 'summary elements');
});

QUnit.test('View is rendered when changed event with changeType \'refresh\' of dataController is occurred', function(assert) {
    // arrange
    const summaryCount = { summaryType: 'count', value: 100 };
    const footerView = this.createFooterView(getFooterOptions({
        0: [
            summaryCount,
            { summaryType: 'min', value: 0 },
            { summaryType: 'max', value: 120001 }
        ]
    }, 5));
    let $summary;
    const $container = $('#container');

    // act
    footerView.render($container);
    summaryCount.value = 21;

    // T246726
    this.rowsView.render = function() { };
    this.dataController.changed.fire({ changeType: 'refresh' });

    $summary = $('.dx-datagrid-summary-item');

    // assert
    assert.equal($summary.eq(0).text(), 'Count: 21');
});

// T563460
QUnit.test('View is rendered when changed event with changeType \'append\' of dataController is occurred', function(assert) {
    // arrange
    const summaryCount = { summaryType: 'count', value: 100 };
    const footerView = this.createFooterView(getFooterOptions({
        0: [
            summaryCount
        ]
    }, 5));
    let $summary;
    const $container = $('#container');

    // act
    footerView.render($container);
    summaryCount.value = 21;
    this.dataController.changed.fire({ changeType: 'append' });

    // assert
    $summary = $('.dx-datagrid-summary-item');
    assert.equal($summary.eq(0).text(), 'Count: 21');
});

QUnit.test('View is rendered when changed event with changeType \'prepend\' of dataController is occurred', function(assert) {
    // arrange
    const summaryCount = { summaryType: 'count', value: 100 };
    const footerView = this.createFooterView(getFooterOptions({
        0: [
            summaryCount
        ]
    }, 5));
    let $summary;
    const $container = $('#container');

    // act
    footerView.render($container);
    summaryCount.value = 21;
    this.dataController.changed.fire({ changeType: 'prepend' });

    // assert
    $summary = $('.dx-datagrid-summary-item');
    assert.equal($summary.eq(0).text(), 'Count: 21');
});

// T246726
QUnit.test('View is not rendered when changed event with changeType \'update\' of dataController is occurred', function(assert) {
    // arrange
    const summaryCount = { summaryType: 'count', value: 100 };
    const footerView = this.createFooterView(getFooterOptions({
        0: [
            summaryCount,
            { summaryType: 'min', value: 0 },
            { summaryType: 'max', value: 120001 }
        ]
    }, 5));
    let isRendered;
    let $summary;
    const $container = $('#container');

    // act
    footerView.render($container);
    summaryCount.value = 21;

    this.rowsView.render = function() { };
    footerView.render = function() {
        isRendered = true;
    };
    this.dataController.changed.fire({ changeType: 'update' });

    $summary = $('.dx-datagrid-summary-item');

    // assert
    assert.ok(!isRendered, 'footer view is not rendered');
    assert.equal($summary.eq(0).text(), 'Count: 100');
});

QUnit.test('View is rendered when width of column is changed', function(assert) {
    // arrange
    const footerView = this.createFooterView(this.defaultFooterOptions);
    let $cols;
    const $container = $('#container');

    // act
    this.rowsView.render($container);
    footerView.render($container);

    this.columnsController.columnOption(0, 'width', 100);

    this.columnsController.columnsChanged.fire({ columnIndex: 0, optionNames: { width: true, length: 1 }, changeTypes: {} });

    $cols = $('.dx-datagrid-total-footer' + ' col');

    // assert
    assert.equal($cols.eq(0).css('width'), '100px');
});

QUnit.test('View is not rendered when columnChanged is occurred', function(assert) {
    // arrange
    let isRendered;
    const footerView = this.createFooterView(this.defaultFooterOptions);
    const $container = $('#container');

    // act
    this.rowsView.render($container);
    footerView.render($container);

    footerView.render = function() {
        isRendered = true;
    };

    this.columnsController.columnsChanged.fire({ columnIndex: 0, optionNames: { test: true, length: 1 }, changeTypes: { columns: true, length: 1 } });

    // assert
    assert.ok(!isRendered);
});

QUnit.test('Value format for summary item', function(assert) {
    // arrange
    const footerView = this.createFooterView(getFooterOptions({
        0: [
            { summaryType: 'min', valueFormat: 'currency', value: 100 },
            { summaryType: 'max', valueFormat: { type: 'fixedPoint', precision: 4 }, value: 120.00012034 }
        ]
    }, 5));
    const $container = $('#container');
    let $summary;

    // act
    footerView.render($container);
    $summary = $('.dx-datagrid-summary-item');

    // assert
    assert.equal($summary.eq(0).text(), 'Min: $100');
    assert.equal($summary.eq(1).text(), 'Max: 120.0001');
});

QUnit.test('Display format for summary item', function(assert) {
    // arrange
    const footerView = this.createFooterView(getFooterOptions({
        0: [
            { summaryType: 'min', valueFormat: 'currency', value: 100, displayFormat: 'Min: {0}' },
            { summaryType: 'max', valueFormat: { type: 'fixedPoint', precision: 4 }, value: 120.00012034, displayFormat: '{0} - Max' }
        ]
    }, 5));
    const $container = $('#container');
    let $summary;

    // act
    footerView.render($container);
    $summary = $('.dx-datagrid-summary-item');

    // assert
    assert.equal($summary.eq(0).text(), 'Min: $100');
    assert.equal($summary.eq(1).text(), '120.0001 - Max');
});

QUnit.test('Customize text for summary items', function(assert) {
    // arrange
    const customizeText = function(cellInfo) {
        return 'test ' + cellInfo.valueText + ' postfix';
    };
    const footerView = this.createFooterView(getFooterOptions({
        0: [
            { summaryType: 'min', valueFormat: 'currency', value: 100, displayFormat: 'Min: {0}', customizeText: customizeText },
            { summaryType: 'max', valueFormat: 'percent', value: 120.00012034, displayFormat: '{0} - Max', customizeText: customizeText }
        ]
    }, 5));
    const $container = $('#container');
    let $summary;

    // act
    footerView.render($container);
    $summary = $('.dx-datagrid-summary-item');

    // assert
    assert.equal($summary.eq(0).text(), 'test Min: $100 postfix');
    assert.equal($summary.eq(1).text(), 'test 12,000% - Max postfix');
});

QUnit.test('Custom Css class for summary item', function(assert) {
    // arrange
    const footerView = this.createFooterView(getFooterOptions({
        0: [
            { summaryType: 'min', cssClass: 'min-bold' },
            { summaryType: 'max', cssClass: 'max-italic' }
        ],
        2: [
            { summaryType: 'count', cssClass: 'count-red' }
        ]
    }, 5));
    const $container = $('#container');
    let $summary;

    // act
    footerView.render($container);
    $summary = $('.dx-datagrid-summary-item');

    // assert
    assert.ok($summary.eq(0).hasClass('min-bold'), 'min-bold class');
    assert.ok($summary.eq(1).hasClass('max-italic'), 'max-italic class');
    assert.ok($summary.eq(2).hasClass('count-red'), 'count-red class');
});

QUnit.test('Cell is rendered in not a command column', function(assert) {
    // arrange
    const summaryTexts = {
        min: 'Min: {0}',
        count: 'Count: {0}'
    };
    const $cellElements = [$('<td/>'), $('<td/>')];

    // act
    summaryModule.renderSummaryCell($cellElements[0], {
        summaryItems: [{
            column: 'name',
            summaryType: 'coun',
            value: 119
        }],
        column: { alignment: 'left' },
        summaryTexts: summaryTexts
    });

    // assert
    assert.equal($cellElements[0].text(), 119, 'column is not command');

    // act
    summaryModule.renderSummaryCell($cellElements[1], {
        summaryItems: [{
            column: 'age',
            summaryType: 'min',
            value: 19
        }],
        column: { command: 'expand', alignment: 'left' },
        summaryTexts: summaryTexts
    });

    // assert
    assert.equal($cellElements[1].html(), '', 'command column');
});

QUnit.test('onCellPrepared for totalFooter', function(assert) {
    // arrange
    let footerView;
    let resultOptions;
    let countCallCellPrepared = 0;

    this.options = {
        onCellPrepared: function(options) {
            countCallCellPrepared++;

            if(options.columnIndex === 0) {
                resultOptions = options;
            }
        }
    };

    footerView = this.createFooterView(this.defaultFooterOptions);

    // act
    footerView.render($('#container'));

    // assert
    assert.equal(countCallCellPrepared, 5, 'countCallCellPrepared');
    assert.equal(resultOptions.columnIndex, 0, 'columnIndex');
    assert.strictEqual(resultOptions.rowType, 'totalFooter', 'rowType');
    assert.deepEqual(resultOptions.column, { caption: 'Column 1', alignment: 'left', index: 0 }, 'column');
    assert.equal(resultOptions.summaryItems.length, 3, 'summaryItems');
    assert.ok(resultOptions.summaryTexts, 'summaryTexts');
    assert.equal(resultOptions.totalItem.summaryCells.length, 5, 'summaryCells');
});

QUnit.test('onRowPrepared for totalFooter', function(assert) {
    // arrange
    let footerView;
    let resultOptions;
    let countCallRowPrepared = 0;

    this.options = {
        onRowPrepared: function(options) {
            countCallRowPrepared++;
            resultOptions = options;
        }
    };

    footerView = this.createFooterView(this.defaultFooterOptions);

    // act
    footerView.render($('#container'));

    // assert
    assert.equal(countCallRowPrepared, 1, 'countCallRowPrepared');
    assert.equal(resultOptions.columns.length, 5, 'columns');
    assert.strictEqual(resultOptions.rowType, 'totalFooter', 'rowType');
    assert.equal(resultOptions.summaryCells.length, 5, 'summaryCells');
});

// T373746
QUnit.test('Change scroll position after resize', function(assert) {
    // arrange
    const footerView = this.createFooterView(this.defaultFooterOptions, null, [
        { caption: 'Column 1', width: 200 },
        { caption: 'Column 2', width: 200 },
        { caption: 'Column 3', width: 200 },
        { caption: 'Column 4', width: 200 },
        { caption: 'Column 5', width: 200 }
    ]);
    const $testElement = $('#container').width(300);

    footerView.render($testElement);
    footerView.scrollTo({ left: 1000 });

    // act
    footerView.render($testElement);
    footerView.resize();

    // assert
    assert.equal($testElement.find('.dx-datagrid-scroll-container').scrollLeft(), 700, 'scroll left');
});

QUnit.module('Group footer', {
    beforeEach: function() {
        const that = this;

        that.createRowsView = function(items) {
            const columns = [
                { caption: 'Column 1', alignment: 'left' },
                { caption: 'Column 2', alignment: 'left' },
                { caption: 'Column 3', alignment: 'right' }
            ];
            const mockDataGrid = {
                options: that.options,
                element: function() {
                    return $('#container');
                }
            };

            that.columnsController = new MockColumnsController(columns);
            that.dataController = new MockDataController({ items: items });

            setupDataGridModules(mockDataGrid, ['data', 'rows', 'summary'], {
                initViews: true,
                controllers: {
                    columns: that.columnsController,
                    data: that.dataController
                },
                initDefaultOptions: true
            });

            return mockDataGrid.rowsView;
        };
    }
});

QUnit.test('Show summary', function(assert) {
    // arrange
    const rowsView = this.createRowsView([{
        rowType: 'groupFooter', values: [], summaryCells: [
            [
                { summaryType: 'count', value: '10' },
                { summaryType: 'min', value: '1245' }
            ],
            [],
            [
                { summaryType: 'avg', value: '34.009' }
            ]]
    }]);
    let $summaryItems;

    // act
    rowsView.render($('#container'));
    $summaryItems = $('.dx-datagrid-summary-item');

    // assert
    assert.ok($('.dx-datagrid-group-footer').length, 'group footer class');
    assert.equal($summaryItems.length, 3, 'summary items count');
    assert.ok($summaryItems.eq(0).closest('.dx-datagrid-rowsview').length, 'rowsView is parent');
    assert.equal($summaryItems.eq(0).text(), 'Count: 10', '1 summary item');
    assert.equal($summaryItems.eq(1).text(), 'Min: 1245', '2 summary item');
    assert.equal($summaryItems.eq(2).text(), 'Avg: 34.009', '3 summary item');
});

QUnit.test('onCellPrepared for group footer', function(assert) {
    // arrange
    let rowsView;
    let resultOptions;
    let countCallCellPrepared = 0;

    this.options = {
        onCellPrepared: function(options) {
            countCallCellPrepared++;

            if(options.columnIndex === 0) {
                resultOptions = options;
            }
        }
    };

    rowsView = this.createRowsView([{
        rowType: 'groupFooter', values: [], summaryCells: [
            [
                { summaryType: 'count', value: '10' },
                { summaryType: 'min', value: '1245' }
            ],
            [],
            [
                { summaryType: 'avg', value: '34.009' }
            ]]
    }]);

    // act
    rowsView.render($('#container'));

    // assert
    assert.equal(countCallCellPrepared, 3, 'countCallCellPrepared');
    assert.equal(resultOptions.rowIndex, 0, 'rowIndex');
    assert.equal(resultOptions.columnIndex, 0, 'columnIndex');
    assert.equal(resultOptions.summaryItems.length, 2, 'count summary items');
    assert.strictEqual(resultOptions.rowType, 'groupFooter', 'rowType');
    assert.deepEqual(resultOptions.column, { 'alignment': 'left', caption: 'Column 1', index: 0 }, 'column');
});

QUnit.test('onRowPrepared for group footer', function(assert) {
    // arrange
    let rowsView;
    let resultOptions;
    let countCallRowPrepared = 0;

    this.options = {
        onRowPrepared: function(options) {
            countCallRowPrepared++;
            resultOptions = options;
        }
    };

    rowsView = this.createRowsView([{
        rowType: 'groupFooter', values: [], summaryCells: [
            [
                { summaryType: 'count', value: '10' },
                { summaryType: 'min', value: '1245' }
            ],
            [],
            [
                { summaryType: 'avg', value: '34.009' }
            ]]
    }]);

    // act
    rowsView.render($('#container'));

    // assert
    assert.equal(countCallRowPrepared, 1, 'countCallRowPrepared');
    assert.equal(resultOptions.columns.length, 3, 'columns');
    assert.strictEqual(resultOptions.rowType, 'groupFooter', 'rowType');
    assert.equal(resultOptions.summaryCells.length, 3, 'summaryCells');
    assert.equal(resultOptions.rowIndex, 0, 'rowIndex');
});

QUnit.module('Footer with real dataController and columnController', {
    beforeEach: function() {
        this.items = [
            { key: 0, name: 'Alex', age: 15, cash: 1200, regDate: '2008/04/21' },
            { key: 1, name: 'Dan', age: 16, cash: 12, regDate: '2010/05/23' },
            { key: 2, name: 'Vadim', age: 17, cash: 14300, regDate: '2011/02/13' },
            { key: 3, name: 'Dmitry', age: 18, cash: 100, regDate: '2009/06/29' },
            { key: 4, name: 'Sergey', age: 18, cash: 200, regDate: '2009/09/14' },
            { key: 5, name: 'Kate', age: 20, cash: 345, regDate: '2012/02/20' },
            { key: 6, name: 'Dan', age: 21, cash: 1200700, regDate: '2014/05/18' }
        ];

        this.columns = [
            { dataField: 'name', caption: 'Test name' },
            'age',
            { dataField: 'cash', caption: 'Test cash' },
            { dataField: 'regDate', dataType: 'date' }
        ];

        this.setupDataGridModules = function(userOptions) {
            setupDataGridModules(this, ['data', 'columns', 'rows', 'columnFixing', 'grouping', 'summary', 'pager', 'editing'], {
                initViews: true,
                initDefaultOptions: true,
                options: $.extend(true, {
                    columns: this.columns,
                    loadingTimeout: null,
                    dataSource: this.items,
                    paging: {
                        enabled: true,
                        pageSize: 20
                    },
                    scrolling: {}
                }, userOptions)
            });
        };
    },
    afterEach: function() {
        this.dispose();
    }
});

QUnit.test('Summary items with valueFormat and displayFormat', function(assert) {
    // arrange, act
    this.setupDataGridModules({
        summary: {
            totalItems: [
                {
                    column: 'name',
                    summaryType: 'count',
                    displayFormat: 'Names count: {0}'
                },
                {
                    column: 'age',
                    summaryType: 'max',
                    displayFormat: 'Very old man: {0}'
                },
                {
                    column: 'age',
                    summaryType: 'min',
                    displayFormat: 'Very young man: {0}'
                },
                {
                    column: 'cash',
                    summaryType: 'sum',
                    valueFormat: 'currency'
                },
                {
                    column: 'cash',
                    summaryType: 'avg',
                    valueFormat: {
                        type: 'fixedPoint',
                        precision: 2
                    }
                },
                {
                    column: 'regDate',
                    summaryType: 'max'
                },
                {
                    column: 'regDate',
                    valueFormat: 'longDate',
                    summaryType: 'max'
                },
                {
                    column: 'regDate',
                    summaryType: 'count'
                }
            ]
        }
    });
    this.footerView.render($('#container'));
    const $summary = $('.dx-datagrid-summary-item');

    // assert
    assert.equal($summary.eq(0).text(), 'Names count: 7', 'names count');
    assert.equal($summary.eq(1).text(), 'Very old man: 21', 'names count');
    assert.equal($summary.eq(2).text(), 'Very young man: 15', 'names count');
    assert.equal($summary.eq(3).text(), 'Sum: $1,216,857', 'names count');
    assert.equal($summary.eq(4).text(), 'Avg: 173,836.71', 'names count');
    assert.equal($summary.eq(5).text(), 'Max: 5/18/2014', 'date max default valueFormat');
    assert.equal($summary.eq(6).text(), 'Max: Sunday, May 18, 2014', 'date max custom valueFormat');
    assert.equal($summary.eq(7).text(), 'Count: 7');
});

// T348335
QUnit.test('Summary items when summary.texts are not defined', function(assert) {
    // arrange, act
    this.setupDataGridModules({
        summary: {
            texts: null,
            totalItems: [
                {
                    column: 'name',
                    summaryType: 'count'
                },
                {
                    column: 'age',
                    summaryType: 'max'
                }
            ]
        }
    });
    this.footerView.render($('#container'));
    const $summary = $('.dx-datagrid-summary-item');

    // assert
    assert.equal($summary.eq(0).text(), '7', 'names count');
    assert.equal($summary.eq(1).text(), '21', 'names count');
});

QUnit.test('Summary items with default and custom valueFormat in group rows', function(assert) {
    // arrange, act

    this.setupDataGridModules({
        customizeColumns: function(columns) {
            columns[2].groupIndex = 0;
        },
        summary: {
            groupItems: [
                {
                    column: 'regDate',
                    summaryType: 'max'
                },
                {
                    column: 'regDate',
                    valueFormat: 'longDate',
                    summaryType: 'max'
                }
            ]
        }
    });

    this.rowsView.render($('#container'));
    const $summary = $('.dx-group-row td:last-child');

    // assert
    assert.equal($summary.eq(0).text(), 'Test cash: 12 (Max of Reg Date is 5/23/2010, Max of Reg Date is Sunday, May 23, 2010)', 'Group summary date format in default and custom valueFormat');
});

QUnit.test('Summary items with default and custom valueFormat in group footer', function(assert) {
    // arrange, act

    this.setupDataGridModules({
        customizeColumns: function(columns) {
            columns[2].groupIndex = 0;
        },
        summary: {
            groupItems: [
                {
                    column: 'regDate',
                    summaryType: 'max',
                    showInGroupFooter: true
                },
                {
                    column: 'regDate',
                    valueFormat: 'longDate',
                    summaryType: 'max',
                    showInGroupFooter: true
                }
            ]
        }
    });

    this.rowsView.render($('#container'));
    const $summary = $('.dx-datagrid-summary-item');

    // assert
    assert.equal($summary.eq(0).text(), 'Max: 5/23/2010', 'Group summary date format in shortDate');
    assert.equal($summary.eq(1).text(), 'Max: Sunday, May 23, 2010', 'Group summary date format in custom valueFormat');
});

QUnit.test('Show in column', function(assert) {
    // arrange, act
    this.setupDataGridModules({
        summary: {
            totalItems: [
                {
                    column: 'name',
                    summaryType: 'count'
                },
                {
                    column: 'cash',
                    summaryType: 'max',
                    showInColumn: 'name',
                    valueFormat: 'currency'
                }
            ]
        }
    });
    this.footerView.render($('#container'));
    const $summary = $('.dx-datagrid-summary-item');
    const $summaryCells = $('.dx-datagrid-total-footer' + ' td');

    // assert
    assert.equal($summaryCells.length, 4, 'cells count');
    assert.equal($summaryCells.eq(0).children().length, 2, '1 cell children count');
    assert.equal($summaryCells.eq(1).children().length, 0, '2 cell children count');
    assert.equal($summaryCells.eq(2).children().length, 0, '3 cell children count');
    assert.equal($summary.eq(0).text(), 'Count: 7', 'names count');
    assert.equal($summary.eq(1).text(), 'Max of Test cash is $1,200,700', 'max cash');
});

QUnit.test('getTotalSummaryValue api method', function(assert) {
    // arrange
    this.setupDataGridModules({
        summary: {
            totalItems: [
                {
                    column: 'age',
                    summaryType: 'max'
                },
                {
                    name: 'test cash',
                    column: 'cash',
                    summaryType: 'max'
                },
                {
                    column: 'Test name',
                    summaryType: 'count'
                }
            ]
        }
    });

    // act, assert
    assert.equal(this.dataController.getTotalSummaryValue('test cash'), 1200700);
});

QUnit.test('getTotalSummaryValue api method for show in column', function(assert) {
    // arrange
    this.setupDataGridModules({
        summary: {
            totalItems: [
                {
                    column: 'age',
                    summaryType: 'sum'
                },
                {
                    name: 'test cash',
                    column: 'cash',
                    summaryType: 'sum',
                    showInColumn: 'Test name'
                },
                {
                    column: 'Test name',
                    summaryType: 'count'
                }
            ]
        }
    });

    // act, assert
    assert.equal(this.dataController.getTotalSummaryValue('test cash'), 1216857);
});

QUnit.test('Invalid value is not shown', function(assert) {
    // arrange act
    this.setupDataGridModules();

    const summaryItems = [
        { column: 'name', summaryType: 'avg' },
        { column: 'cash', summaryType: 'sum' },
        { column: 'age', summaryType: 'max' }
    ];
    const aggregates = [NaN, 1234, NaN];
    const visibleColumns = [
        { dataField: 'name', index: 0 },
        { dataField: 'age', index: 1 },
        { dataField: 'cash', index: 2 }
    ];
    const summaryCells = this.dataController._calculateSummaryCells(summaryItems, aggregates, visibleColumns, function(summaryItem, column) {
        return column.index;
    });

    // assert
    assert.deepEqual(summaryCells, [[], [], [{
        'column': 'cash',
        'summaryType': 'sum',
        'value': 1234
    }]]);
});

// T239191
QUnit.test('Show group footer', function(assert) {
    // arrange
    const that = this;
    const testElement = $('#container');

    that.columns[0].groupIndex = 0;


    that.setupDataGridModules({
        summary: {
            groupItems: [{
                column: 'age',
                summaryType: 'count',
                showInGroupFooter: true
            }
            ]
        }
    });

    // act
    that.rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('.dx-datagrid-group-footer').length, 6, 'has group footer rows');
    assert.equal(testElement.find('.dx-datagrid-group-footer').first().find('td').length, 4, 'count cell in group footer row');
    assert.strictEqual(testElement.find('.dx-datagrid-group-footer').first().find('td').eq(0).html(), '&nbsp;', 'text first cell in group footer row');
    assert.strictEqual(testElement.find('.dx-datagrid-group-footer').first().find('td').eq(1).text(), 'Count: 1', 'text second cell in group footer row');
    assert.strictEqual(testElement.find('.dx-datagrid-group-footer').first().find('td').eq(2).text(), '', 'text third cell in group footer row');
    assert.ok(!testElement.find('.dx-datagrid-group-footer').first().find('.dx-datagrid-expand').length, 'not has expand cell in group footer row');
});

// T341607
QUnit.test('Show group footer when edit column exists', function(assert) {
    // arrange
    const that = this;
    const testElement = $('#container');

    that.columns[0].groupIndex = 0;

    that.setupDataGridModules({
        editing: {
            allowUpdating: true,
            mode: 'row'
        },
        summary: {
            groupItems: [{
                column: 'age',
                summaryType: 'count',
                showInGroupFooter: true
            }]
        }
    });

    // act
    that.rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('.dx-datagrid-group-footer').length, 6, 'has group footer rows');
    const $groupFooterEditCell = testElement.find('.dx-datagrid-group-footer').first().find('td').last();
    assert.ok($groupFooterEditCell.hasClass('dx-command-edit'), 'is command edit cell');
    assert.equal($groupFooterEditCell.html(), '&nbsp;', 'edit column cell in group footer row is empty');
});


// T324170
QUnit.test('Show group footer when has calculateCustomSummary and groupItems with showInColumn and without column', function(assert) {
    // arrange
    const that = this;
    const $testElement = $('#container');

    that.columns[0].groupIndex = 0;
    that.setupDataGridModules({
        summary: {
            groupItems: [
                {
                    showInColumn: 'age',
                    summaryType: 'custom',
                    showInGroupFooter: true,
                    displayFormat: 'Sum Group: {0}'
                }
            ],
            calculateCustomSummary: function(e) {
                e.totalValue = 0;
            }
        }
    });

    // act
    that.rowsView.render($testElement);

    // assert
    assert.equal($testElement.find('.dx-datagrid-group-footer').length, 6, 'count group footer rows');
    assert.equal($testElement.find('.dx-datagrid-group-footer').eq(0).children().eq(1).text(), 'Sum Group: 0', 'count group footer rows');
});

// T695403
QUnit.test('Total summary should be correctly updated after editing cell when there are fixed columns and recalculateWhileEditing is enabled', function(assert) {
    // arrange
    const that = this;
    let $summaryElements;
    const $testElement = $('#container');

    that.columns[0].fixed = true;

    that.setupDataGridModules({
        editing: {
            allowUpdating: true,
            mode: 'batch'
        },
        summary: {
            recalculateWhileEditing: true,
            totalItems: [{
                column: 'cash',
                summaryType: 'sum'
            }]
        }
    });

    that.rowsView.render($testElement);
    that.footerView.render($testElement);

    // assert
    $summaryElements = $(that.footerView.element()).find('.dx-datagrid-summary-item');
    assert.strictEqual($summaryElements.length, 1, 'summary item count');
    assert.strictEqual($summaryElements.first().text(), 'Sum: 1216857', '');

    // act
    that.cellValue(6, 2, 100);

    // assert
    $summaryElements = $(that.footerView.element()).find('.dx-datagrid-summary-item');
    assert.strictEqual($summaryElements.length, 1, 'summary item count');
    assert.strictEqual($summaryElements.first().text(), 'Sum: 16257', '');
});

const generateData = function(countRow) {
    let i;
    let j = 1;
    const result = [];

    for(i = 0; i < countRow; i++) {
        result.push({ name: 'test name' + j, age: i, cash: 'test cash', regDate: new Date() });
        j += ((i + 1) % 7 === 0) ? 1 : 0;
    }

    return result;
};

QUnit.module('Footer with virtual scroll', {
    beforeEach: function() {
        this.items = generateData(20);

        this.columns = [
            { dataField: 'name', caption: 'Test name' },
            'age',
            { dataField: 'cash', caption: 'Test cash' },
            { dataField: 'regDate', dataType: 'date' }
        ];

        this.setupDataGridModules = function(userOptions) {
            setupDataGridModules(this, ['data', 'virtualScrolling', 'columns', 'rows', 'grouping', 'summary', 'pager'], {
                initViews: true,
                initDefaultOptions: true,
                options: $.extend(true, {
                    columns: this.columns,
                    loadingTimeout: null,
                    dataSource: {
                        asyncLoadEnabled: false,
                        store: this.items,
                        pageSize: 5
                    },
                    scrolling: {
                        mode: 'virtual'
                    }
                }, userOptions)
            });
        };
    },
    afterEach: function() {
        this.dispose();
    }
});

// T317725
QUnit.test('Show group footer with virtual scrolling', function(assert) {
    // arrange
    const that = this;
    const $testElement = $('#container');

    that.columns[0].groupIndex = 0;
    that.setupDataGridModules({
        summary: {
            groupItems: [
                {
                    column: 'age',
                    summaryType: 'count',
                    showInGroupFooter: true
                }
            ]
        }
    });

    // act
    that.rowsView.render($testElement);
    that.rowsView.height(100);
    that.rowsView.resize();

    // assert
    assert.equal($testElement.find('.dx-datagrid-group-footer').length, 1, 'count group footer rows');
});
