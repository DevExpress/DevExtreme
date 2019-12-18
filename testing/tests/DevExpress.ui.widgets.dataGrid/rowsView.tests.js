QUnit.testStart(function() {
    var markup =
'<style>\
    .qunit-fixture-static {\
        position: static !important;\
        left: 0 !important;\
        top: 0 !important;\
    }\
    .dx-scrollable-native-ios .dx-scrollable-content {\
            padding: 0 !important;\
    }\
    .cross-browser-border-width-getting table {\
        border-collapse: separate !important;\
    }\
</style>\
<div class="dx-widget">\
    <div class="dx-datagrid dx-gridbase-container">\
        <div id="container"></div>\
    </div>\
</div>';

    $('#qunit-fixture').html(markup);
});

import 'common.css!';
import 'generic_light.css!';

import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import gridCoreUtils from 'ui/grid_core/ui.grid_core.utils';
import dataUtils from 'core/element_data';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import devices from 'core/devices';
import config from 'core/config';
import support from 'core/utils/support';
import browser from 'core/utils/browser';
import pointerMock from '../../helpers/pointerMock.js';
import nativePointerMock from '../../helpers/nativePointerMock.js';
import { setupDataGridModules, MockDataController, MockColumnsController, MockSelectionController, getCells, generateItems } from '../../helpers/dataGridMocks.js';
import numberLocalization from 'localization/number';
import virtualScrollingCore from 'ui/grid_core/ui.grid_core.virtual_scrolling_core';
import ODataStore from 'data/odata/store';
import ArrayStore from 'data/array_store';

var expandCellTemplate = gridCoreUtils.getExpandCellTemplate();

function getText(element) {
    return $(element).text();
}

function createRowsView(rows, dataController, columns, initDefaultOptions, userOptions) {
    var i,
        columnsController;

    dataController = dataController || new MockDataController({ items: rows });

    if(!typeUtils.isDefined(columns)) {
        columns = [];
        for(i = 0; i < rows[0].values.length; i++) {
            columns.push({});
        }
    }

    var defaultSelectionCellTemplate = function(container, options) {
        this.dataGrid.rowsView.renderSelectCheckBoxContainer($(container), options);
    }.bind(this);

    columns.forEach(function(column) {
        if(column.command === 'select') {
            column.cellTemplate = defaultSelectionCellTemplate;
        }
    });

    columnsController = new MockColumnsController(columns);

    this.options = $.extend({}, { disabled: false, noDataText: 'No Data' }, userOptions);

    this.selectionOptions = {};

    var mockDataGrid = {
        options: this.options,
        isReady: function() {
            return true;
        },
        $element: function() {
            return $('.dx-datagrid');
        }
    };

    setupDataGridModules(mockDataGrid, ['data', 'virtualScrolling', 'columns', 'grouping', 'rows', 'pager', 'selection', 'editing', 'editorFactory', 'summary', 'masterDetail', 'keyboardNavigation', 'search', 'contextMenu'], {
        initViews: true,
        controllers: {
            columns: columnsController,
            data: dataController,
            selection: new MockSelectionController(this.selectionOptions)
        },
        initDefaultOptions: initDefaultOptions
    });

    this.setColumnWidths = function({ widths }) {
        var i;
        for(i = 0; i < columns.length; i++) {
            columns[i].visibleWidth = widths[i];
        }
        this.dataGrid.rowsView.setColumnWidths({ widths });
    };

    if(this.dataGrid) {
        QUnit.assert.ok(false, 'dataGrid is already created');
    }

    this.dataGrid = mockDataGrid;
    return mockDataGrid.rowsView;
}

QUnit.module('Rows view', {
    beforeEach: function() {
        this.items = [
            { data: { name: 'test1', id: 1, date: new Date(2001, 0, 1) }, values: ['test1', 1, '1/01/2001'], rowType: 'data', dataIndex: 0 },
            { data: { name: 'test2', id: 2, date: new Date(2002, 1, 2) }, values: ['test2', 2, '2/02/2002'], rowType: 'data', dataIndex: 1 },
            { data: { name: 'test3', id: 3, date: new Date(2003, 2, 3) }, values: ['test3', 3, '3/03/2003'], rowType: 'data', dataIndex: 2 }];

        this.clock = sinon.useFakeTimers();

        this.createRowsView = createRowsView;
    },
    afterEach: function() {
        this.dataGrid && this.dataGrid.dispose();
        this.clock.restore();
    }
});

QUnit.test('Create col elements by columns collection', function(assert) {
    // arrange, act
    // arrange
    var rowsView = this.createRowsView([{ values: [1, 2, 3, 4, 5] }], null, [{ caption: 'Column 1', width: 30 }, { caption: 'Column 2', width: 50 }, { caption: 'Column 3', width: 73 },
            { caption: 'Column 4' }, { caption: 'Column 5', width: 91 }]),
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    var cols = testElement.find('col');

    // assert
    assert.equal(cols.length, 5, 'columns count');
    assert.equal(cols[0].style.width, '30px', '1 column width');
    assert.equal(cols[1].style.width, '50px', '2 column width');
    assert.equal(cols[2].style.width, '73px', '3 column width');
    assert.equal(cols[3].style.width, '', '4 column width');
    assert.equal(cols[4].style.width, '91px', '5 column width');
});

QUnit.test('Add colgroup to table', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    // arrange
    var colgroupElement = testElement.find('table').find('colgroup');
    assert.equal(colgroupElement.length, 1, '1 colgroup element');
    assert.equal(colgroupElement.children().length, 3, '3 col elements');
    assert.equal(colgroupElement.children().first()[0].tagName.toLowerCase(), 'col', 'col element');
});

QUnit.test('Render rows', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        cells,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    cells = getCells(testElement);

    // assert
    assert.equal(getText(cells[0]), 'test1', 'row 1 cell 1');
    assert.equal(getText(cells[1]), '1', 'row 1 cell 2');
    assert.equal(getText(cells[2]), '1/01/2001', 'row 1 cell 3');

    assert.equal(getText(cells[3]), 'test2', 'row 2 cell 1');
    assert.equal(getText(cells[4]), '2', 'row 2 cell 2');
    assert.equal(getText(cells[5]), '2/02/2002', 'row 2 cell 3');

    assert.equal(getText(cells[6]), 'test3', 'row 3 cell 1');
    assert.equal(getText(cells[7]), '3', 'row 3 cell 2');
    assert.equal(getText(cells[8]), '3/03/2003', 'row 3 cell 3');
    assert.equal(testElement.find('.dx-datagrid-content').length, 1, 'content class for focus overlay added');
});

// T311620
QUnit.test('Render rows with empty data', function(assert) {
    // arrange
    var rowsView = this.createRowsView([{ data: { test1: '   ', test2: undefined, test3: null, test4: '' }, values: ['   ', undefined, null, ''], rowType: 'data', dataIndex: 0 }]),
        cells,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    cells = testElement.find('.dx-data-row').children();

    // assert
    assert.equal(cells.length, 4, 'count column');
    assert.strictEqual(cells[0].innerHTML, '&nbsp;', 'text of the first column');
    assert.strictEqual(cells[1].innerHTML, '&nbsp;', 'text of the second column');
    assert.strictEqual(cells[2].innerHTML, '&nbsp;', 'text of the third column');
    assert.strictEqual(cells[3].innerHTML, '&nbsp;', 'text of the fourth column');
});

QUnit.test('Render scrollable', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        testElement = $('#container');

    this.options.scrolling = {
        useNative: false,
        showScrollbar: 'always',
        test: 'test'
    };


    // act
    rowsView.render(testElement);
    rowsView.height(100);
    rowsView.resize();

    var $scrollable = testElement.find('.dx-scrollable'),
        $scrollableContent = testElement.find('.dx-scrollable-content'),
        $scrollableScrollbar = testElement.find('.dx-scrollable-scrollbar');

    // assert
    assert.equal($scrollable.length, 1, 'scrollable count');
    assert.equal($scrollableContent.length, 1, 'scrollable content count');
    assert.equal($scrollableScrollbar.length, 2, 'scrollable scrollbar count');
    // T575726
    assert.equal($scrollableContent.css('zIndex'), 'auto', 'scrollable content z-index');
    assert.equal($scrollableScrollbar.css('zIndex'), 'auto', 'scrollable scrollbar z-index');

    var scrollable = $scrollable.dxScrollable('instance');
    assert.strictEqual(scrollable.option('useNative'), false, 'scrollable useNative');
    assert.strictEqual(scrollable.option('showScrollbar'), 'always', 'scrollable showScrollbar');
    assert.strictEqual(scrollable.option('test'), 'test', 'scrollable test');
    // T654402
    assert.strictEqual(scrollable.option('updateManually'), false, 'scrollable updateManually');
    // T698156
    assert.strictEqual(scrollable.option('pushBackValue'), 0, 'scrollable pushBackValue');
});

QUnit.test('Check WAI-ARIA attributes for data rows/cells after render rows', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        testElement = $('#container'),
        $rows,
        $cells,
        $freeSpaceCells,
        i;

    // act
    rowsView.render(testElement);
    $rows = rowsView._getRowElements();
    $freeSpaceCells = getCells(testElement).filter(function(i, cell) { return $(cell).parent().hasClass('dx-freespace-row'); });
    $cells = getCells(testElement).filter(function(i, cell) { return !$(cell).parent().hasClass('dx-freespace-row'); });

    // assert
    assert.expect(15 - $freeSpaceCells.length);

    for(i = 0; i < $cells.length; i++) {
        if(i < $rows.length) {
            assert.equal($rows.eq(i).attr('role'), 'row', 'Row has correct role');
        }
        assert.equal($cells.eq(i).attr('role'), 'gridcell', 'Cell has correct role');
    }
});

QUnit.test('Check WAI-ARIA attributes for freeSpace rows/cells after render rows', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        testElement = $('#container'),
        $rows,
        $cells,
        i;

    // act
    rowsView.render(testElement);

    $rows = rowsView._getRowElements().filter(function(i, row) { return $(row).hasClass('dx-freespace-row'); });
    $cells = getCells(testElement).filter(function(i, cell) { return $(cell).parent().hasClass('dx-freespace-row'); });

    // assert
    for(i = 0; i < $cells.length; i++) {
        if(i < $rows.length) {
            assert.equal($rows.eq(i).attr('aria-hidden'), true, 'Free space row has aria-hidden attribute');
        }
        var $cell = $cells.eq(i);
        assert.equal($cell.attr('role'), undefined, 'Free space cell has no "role"');
        assert.equal($cell.attr('aria-colindex'), undefined, 'Free space cell has no "aria-colindex"');
        assert.equal($cell.attr('aria-selected'), undefined, 'Free space cell has no "aria-selected"');
    }
});

QUnit.test('Render Lookup Column', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [{}, { lookup: { calculateCellValue: function(value) { return 'Lookup ' + value; } } }, {}]),
        cells,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    cells = getCells(testElement);

    // assert
    assert.equal(getText(cells[0]), 'test1', 'row 1 cell 1');
    assert.equal(getText(cells[1]), 'Lookup 1', 'row 1 cell 2');
    assert.equal(getText(cells[2]), '1/01/2001', 'row 1 cell 3');

    assert.equal(getText(cells[3]), 'test2', 'row 2 cell 1');
    assert.equal(getText(cells[4]), 'Lookup 2', 'row 2 cell 2');
    assert.equal(getText(cells[5]), '2/02/2002', 'row 2 cell 3');

    assert.equal(getText(cells[6]), 'test3', 'row 3 cell 1');
    assert.equal(getText(cells[7]), 'Lookup 3', 'row 3 cell 2');
    assert.equal(getText(cells[8]), '3/03/2003', 'row 3 cell 3');
});

QUnit.test('Render Lookup Column with calculateDisplayValue', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [{}, { calculateDisplayValue: function(data) { return 'Lookup ' + data.id; }, dataField: 'id', lookup: { } }, {}]),
        cells,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    cells = getCells(testElement);

    // assert
    assert.equal(getText(cells[0]), 'test1', 'row 1 cell 1');
    assert.equal(getText(cells[1]), 'Lookup 1', 'row 1 cell 2');
    assert.equal(getText(cells[2]), '1/01/2001', 'row 1 cell 3');

    assert.equal(getText(cells[3]), 'test2', 'row 2 cell 1');
    assert.equal(getText(cells[4]), 'Lookup 2', 'row 2 cell 2');
    assert.equal(getText(cells[5]), '2/02/2002', 'row 2 cell 3');

    assert.equal(getText(cells[6]), 'test3', 'row 3 cell 1');
    assert.equal(getText(cells[7]), 'Lookup 3', 'row 3 cell 2');
    assert.equal(getText(cells[8]), '3/03/2003', 'row 3 cell 3');
});

QUnit.test('Resized event not raised for grouped column', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [
            { dataField: 'test1', resizedCallbacks: $.Callbacks().add(function(width) { resizedColumns.push('test1'); resizedColumnWidths.push(width); }) },
            { dataField: 'test2', groupIndex: 0, resizedCallbacks: $.Callbacks().add(function(width) { resizedColumns.push('test2'); resizedColumnWidths.push(width); }) },
            { dataField: 'test3', groupIndex: null, resizedCallbacks: $.Callbacks().add(function(width) { resizedColumns.push('test3'); resizedColumnWidths.push(width); }) }
        ]),
        resizedColumns = [],
        resizedColumnWidths = [],
        testElement = $('#container');

    rowsView.render(testElement);
    this.setColumnWidths({ widths: [100, 100, 100] });
    // act
    rowsView.resize();

    // assert
    assert.deepEqual(resizedColumns, ['test1', 'test3'], 'resized event raised for all columns except grouped');
    assert.equal(resizedColumnWidths.length, 2, 'resized event raised for all columns except grouped');
});

QUnit.test('Resized event on resize after second render', function(assert) {
    // arrange

    var columns = [
        { dataField: 'test1', width: 100, resizedCallbacks: $.Callbacks().add(function(width) { resizedColumns.push('test1'); resizedColumnWidths.push(width); }) },
        { dataField: 'test2', resizedCallbacks: $.Callbacks().add(function(width) { resizedColumns.push('test2'); resizedColumnWidths.push(width); }) },
        { dataField: 'test3', resizedCallbacks: $.Callbacks().add(function(width) { resizedColumns.push('test3'); resizedColumnWidths.push(width); }) }
    ];

    var rowsView = this.createRowsView(this.items, null, columns),
        resizedColumns = [],
        resizedColumnWidths = [],
        testElement = $('#container');

    rowsView.render(testElement);
    this.setColumnWidths({ widths: [100, 100, 100] });
    rowsView.resize();

    // act
    columns[1].width = 50;
    rowsView.render();
    rowsView.resize();

    // assert
    assert.deepEqual(resizedColumns, ['test1', 'test2', 'test3', 'test1', 'test2', 'test3'], 'resized event not raised');
    assert.equal(resizedColumnWidths.length, 6, 'resized event not raised');
});

QUnit.test('Resized event on second resize not raised', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [
            { dataField: 'test1', width: 100, resizedCallbacks: $.Callbacks().add(function() { resizedColumns.push('test1'); }) },
            { dataField: 'test2', resizedCallbacks: $.Callbacks().add(function() { resizedColumns.push('test2'); }) },
            { dataField: 'test3', resizedCallbacks: $.Callbacks().add(function() { resizedColumns.push('test3'); }) }
        ]),
        resizedColumns = [],
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.setColumnWidths({});
    rowsView.resize();
    resizedColumns = [];
    // act
    rowsView.resize();

    // assert
    assert.deepEqual(resizedColumns, [], 'resized event not raised');
});

QUnit.test('Resized event on second resize when container resized and columns with fixed width defined', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [
            { dataField: 'test1', width: 100, resizedCallbacks: $.Callbacks().add(function() { resizedColumns.push('test1'); }) },
            { dataField: 'test2', resizedCallbacks: $.Callbacks().add(function() { resizedColumns.push('test2'); }) },
            { dataField: 'test3', resizedCallbacks: $.Callbacks().add(function() { resizedColumns.push('test3'); }) }
        ]),
        resizedColumns = [],
        testElement = $('#container');

    rowsView.render(testElement);
    this.setColumnWidths({ widths: [100, 100, 100] });
    rowsView.resize();
    resizedColumns = [];
    this.setColumnWidths({ widths: [100, 50, 50] });
    // act
    rowsView.resize();
    getCells(testElement);

    // assert
    assert.deepEqual(resizedColumns, ['test2', 'test3'], 'resized event raised for columns with changed width after change container width ');
});

QUnit.test('Resized event on update width of column', function(assert) {
    // arrange

    var columns = [
        { dataField: 'test1', visibleWidth: 100, resizedCallbacks: $.Callbacks().add(function(width) { resizedColumns.push('test1'); widths.push(width); }) },
        { dataField: 'test2', visibleWidth: 100, resizedCallbacks: $.Callbacks().add(function(width) { resizedColumns.push('test2'); widths.push(width); }) },
        { dataField: 'test3', resizedCallbacks: $.Callbacks().add(function(width) { resizedColumns.push('test3'); widths.push(width); }) }
    ];

    var rowsView = this.createRowsView(this.items, null, columns),
        resizedColumns = [],
        widths = [],
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.resize();

    widths = [];
    resizedColumns = [];
    columns[0].visibleWidth = 95;
    columns[1].visibleWidth = 105;
    // act
    rowsView._columnsController.columnsChanged.fire({
        changeTypes: { columns: true, length: 1 },
        optionNames: { width: true, length: 1 }
    });

    // assert
    assert.deepEqual(resizedColumns, ['test1', 'test2'], 'resized event raised for column with changed width');
    assert.deepEqual(widths, [95, 105], 'resized event raised with width parameter');
});

// T174577
QUnit.test('Resize after change scrolling options', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        testElement = $('#container');

    rowsView.render(testElement);

    // act
    rowsView.optionChanged({ name: 'scrolling' });
    rowsView.resize();

    // assert
    assert.strictEqual(rowsView._tableElement, null);
});

QUnit.test('Grid is not rendered on columnsChanged', function(assert) {
    // arrange

    var columns = [{ dataField: 'test1' }, { dataField: 'test2' }, { dataField: 'test3' }];

    var rowsView = this.createRowsView(this.items, null, columns),
        isRendered = false;

    rowsView.render = function() {
        isRendered = true;
    };

    // act
    rowsView._columnsController.columnsChanged.fire({
        changeTypes: { columns: true, length: 1 },
        optionNames: { test: true, length: 1 }
    });

    // assert
    assert.ok(!isRendered, 'rowsView is not rendered on columnsChanged');
});

QUnit.test('Apply text alignment', function(assert) {
    var columns = [{ alignment: 'right' }, { alignment: 'left' }, { alignment: 'center' }],
        rowsView = this.createRowsView(this.items, null, columns),
        testElement = $('#container'),
        cellContents;

    // act
    rowsView.render(testElement);
    cellContents = testElement.find('td');

    // assert
    assert.equal($(cellContents[0]).css('text-align'), 'right', 'cell 1');
    assert.equal($(cellContents[1]).css('text-align'), 'left', 'cell 2');
    assert.equal($(cellContents[2]).css('text-align'), 'center', 'cell 3');
});

QUnit.test('Highlight searchText disabled option', function(assert) {
    var columns = [{}, {}, {}],
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, null, columns),
        testElement = $('#container'),
        cells;

    // act
    this.options.searchPanel = {
        highlightSearchText: false,
        text: '1'
    };

    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.ok(cells.length > 3);
    assert.equal($(cells[0]).html(), 'test1', 'cell 1');
    assert.equal($(cells[1]).html(), '1', 'cell 2');
    assert.equal($(cells[2]).html(), '1/01/2001', 'cell 3');
});

// T429643
QUnit.test('Highlight searchText with customizeText', function(assert) {
    var columns = [{ allowFiltering: true, dataType: 'string' }, {
            allowFiltering: true, dataType: 'number', format: 'currency', customizeText: function(cellInfo) {
                if(cellInfo.target === 'search') {
                    cellInfo.valueText = '$' + cellInfo.value;
                }

                return cellInfo.valueText;
            }
        }, { allowFiltering: true, dataType: 'date' }],
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        $testElement = $('#container'),
        searchTextClass = 'dx-datagrid-search-text',
        cells;

    // act
    this.options.searchPanel = {
        highlightSearchText: true,
        text: '1'
    };

    rowsView.render($testElement);
    cells = $testElement.find('td');

    // assert
    assert.ok(cells.length > 3, 'Correct number of cells');
    assert.equal(getNormalizeMarkup(cells.eq(0)), 'test<span class=' + searchTextClass + '>1</span>', 'cell 1');
    assert.equal(getNormalizeMarkup(cells.eq(1)), '<span class=' + searchTextClass + '>$1</span>', 'cell 2');
    assert.equal(getNormalizeMarkup(cells.eq(2)), '1/01/2001', 'cell 3');
});

QUnit.test('Highlight searchText for different data types (T636268)', function(assert) {
    this.items = [
        { data: { name: 'test1', id: 11, date: new Date(2001, 0, 1) }, values: ['test1', 11, '1/01/2001'], rowType: 'data', dataIndex: 0 },
        { data: { name: 'test2', id: 21, date: new Date(2002, 1, 2) }, values: ['test2', 21, '2/02/2002'], rowType: 'data', dataIndex: 1 },
        { data: { name: 'test3', id: 31, date: new Date(2003, 2, 3) }, values: ['test3', 31, '3/03/2003'], rowType: 'data', dataIndex: 2 }];

    var columns = [
            { allowFiltering: true, dataType: 'string',
                cellTemplate: function(container, options) {
                    $('<span>test</span>').appendTo(container);
                }
            },
            { allowFiltering: true, dataType: 'number' },
            { allowFiltering: true, dataType: 'date' }],
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        $testElement = $('#container'),
        searchTextClass = 'dx-datagrid-search-text',
        cells;

    // act
    this.options.searchPanel = {
        highlightSearchText: true,
        text: '1'
    };

    rowsView.render($testElement);
    cells = $testElement.find('td');

    // assert
    assert.ok(cells.length > 3, 'Correct number of cells');
    assert.equal(getNormalizeMarkup(cells.eq(0)), '<span>test</span>', 'cell 0');
    assert.equal(getNormalizeMarkup(cells.eq(1)), '11', 'cell 1');
    assert.equal(getNormalizeMarkup(cells.eq(2)), '1/01/2001', 'cell 2');

    // act
    this.options.searchPanel = { highlightSearchText: true, text: '11' };

    rowsView.render($testElement);
    cells = $testElement.find('td');

    // assert
    assert.equal(getNormalizeMarkup(cells.eq(0)), '<span>test</span>', 'cell 0');
    assert.equal(getNormalizeMarkup(cells.eq(1)), '<span class=' + searchTextClass + '>11</span>', 'cell 1');
    assert.equal(getNormalizeMarkup(cells.eq(2)), '1/01/2001', 'cell 2');
});

QUnit.test('Highlight searchText for a cell template (T656969)', function(assert) {
    this.items = [
        { data: { name: 'test1', id: 11, date: new Date(2001, 0, 1) }, values: ['test1', 11, '1/01/2001'], rowType: 'data', dataIndex: 0 },
        { data: { name: 'test2', id: 21, date: new Date(2002, 1, 2) }, values: ['test2', 21, '2/02/2002'], rowType: 'data', dataIndex: 1 },
        { data: { name: 'test3', id: 31, date: new Date(2003, 2, 3) }, values: ['test3', 31, '3/03/2003'], rowType: 'data', dataIndex: 2 }];

    var columns = [
            { allowFiltering: true, dataType: 'string',
                cellTemplate: function(container) {
                    $('<div>')
                        .addClass('dx-template-wrapper')
                        .append($('<span>test</span>'))
                        .appendTo(container);
                }
            },
            { allowFiltering: true, dataType: 'number' },
            { allowFiltering: true, dataType: 'date' }],
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        $testElement = $('#container'),
        searchTextClass = 'dx-datagrid-search-text',
        cells;

    // act
    this.options.searchPanel = { highlightSearchText: true, text: 'te' };

    rowsView.render($testElement);
    cells = $testElement.find('td');

    // assert
    assert.equal(getNormalizeMarkup(cells.eq(0)), '<div class=dx-template-wrapper><span><span class=' + searchTextClass + '>te</span>st</span></div>', 'cell 0');
    assert.equal(getNormalizeMarkup(cells.eq(1)), '11', 'cell 1');
    assert.equal(getNormalizeMarkup(cells.eq(2)), '1/01/2001', 'cell 2');
});
function getNormalizeMarkup($element) {
    var quoteRE = new RegExp('"', 'g'),
        spanRE = new RegExp('span', 'gi');
    return $element.html().replace(quoteRE, '').replace(spanRE, 'span');
}

QUnit.test('Highlight searchText', function(assert) {
    var columns = [{ allowFiltering: true, dataType: 'string' }, {
            allowFiltering: true, dataType: 'number', format: 'currency', parseValue: function(text) {
                return numberLocalization.parse(text);
            }
        }, { allowFiltering: true, dataType: 'date' }],
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        testElement = $('#container'),
        searchTextClass = 'dx-datagrid-search-text',
        cells;

    // act
    this.options.searchPanel = {
        highlightSearchText: true,
        text: '1'
    };

    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.ok(cells.length > 3, 'Correct number of cells');
    assert.equal(getNormalizeMarkup(cells.eq(0)), 'test<span class=' + searchTextClass + '>1</span>', 'cell 1');
    // T266424
    assert.equal(getNormalizeMarkup(cells.eq(1)), '<span class=' + searchTextClass + '>$1</span>', 'cell 2');
    // T106125
    assert.equal(getNormalizeMarkup(cells.eq(2)), '1/01/2001', 'cell 3');
});

// T103538
QUnit.test('Highlight searchText with rowTemplate', function(assert) {
    // arrange
    var columns = [{ allowFiltering: true, dataType: 'string' }, { allowFiltering: true, dataType: 'number' }, { allowFiltering: true, dataType: 'date' }],
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        testElement = $('#container'),
        searchTextClass = 'dx-datagrid-search-text',
        cells;

    this.options.searchPanel = {
        highlightSearchText: true,
        text: '1'
    };

    this.options.rowTemplate = function(container, options) {
        var data = options.data;

        $(container).append('<tr class=\'dx-row\'><td>' + data.name + '</td><td>' + data.id + '</td></tr>');
    };

    // act
    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal(getNormalizeMarkup(cells.eq(0)), 'test<span class=' + searchTextClass + '>1</span>', 'cell 1');
    assert.equal(getNormalizeMarkup(cells.eq(1)), '<span class=' + searchTextClass + '>1</span>', 'cell 2');
});

// T106289
QUnit.test('Highlight searchText with rowTemplate not replace tagName', function(assert) {
    // arrange
    var columns = [{ allowFiltering: true, dataType: 'string' }, { allowFiltering: true, dataType: 'number' }, { allowFiltering: true, dataType: 'date' }],
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        testElement = $('#container'),
        cells;

    this.options.searchPanel = {
        highlightSearchText: true,
        text: 't'
    };

    this.options.rowTemplate = function(container, options) {
        var data = options.data;

        $(container).append('<tr class=\'dx-row\'><td>' + data.name + '</td><td>' + data.id + '</td><td>' + data.date + '</td></tr>');
    };

    // act
    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal(cells.length, 3 * 4 /* 3 rows + 1 freespace */, 'column count');
});

// T106289
QUnit.test('Highlight searchText with rowTemplate not replace class', function(assert) {
    // arrange
    var columns = [{ allowFiltering: true, dataType: 'string' }, { allowFiltering: true, dataType: 'number' }, { allowFiltering: true, dataType: 'date' }],
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        testElement = $('#container'),
        rows;

    this.options.searchPanel = {
        highlightSearchText: true,
        text: 'test'
    };

    this.options.rowTemplate = function(container, options) {
        var data = options.data;

        $(container).append('<tr class=\'dx-row dx-test\'><td>' + data.name + '</td><td>' + data.id + '</td></tr>');
    };

    // act
    rowsView.render(testElement);
    rows = testElement.find('.dx-test');

    // assert
    assert.equal(rows.length, 3, 'rows count');
});

// B254927
QUnit.test('Highlight searchText with column edit', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, [{ allowFiltering: true, dataType: 'string' }, { allowFiltering: true, dataType: 'number' }, { allowFiltering: true, dataType: 'date' }, { command: 'edit' }]),
        testElement = $('#container'),
        cells;

    this.options.searchPanel = {
        highlightSearchText: true,
        text: 'e'
    };

    this.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: 'Edit'
        }
    };

    // act
    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.ok(cells.length > 4, 'Correct number of cells');
    assert.ok(cells.eq(0).find('span').length, 'cell 1');
    assert.ok(!cells.eq(1).find('span').length, 'cell 2');
    assert.ok(!cells.eq(2).find('span').length, 'cell 3');
    assert.ok(!cells.eq(3).find('span').length, 'cell 4');
});

// B255151
QUnit.test('Not highlight searchText when in column allowFiltering false', function(assert) {
    // arrange
    var columns = [{ allowFiltering: true, dataType: 'string' }, { allowFiltering: true, dataType: 'number' }, { allowFiltering: false, dataType: 'date' }],
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        testElement = $('#container'),
        searchTextClass = 'dx-datagrid-search-text',
        cells;

    this.options.searchPanel = {
        highlightSearchText: true,
        text: '1'
    };

    // act
    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal(getNormalizeMarkup(cells.eq(0)), 'test<span class=' + searchTextClass + '>1</span>', 'cell 1');
    assert.equal(getNormalizeMarkup(cells.eq(1)), '<span class=' + searchTextClass + '>1</span>', 'cell 2');
    assert.equal(getNormalizeMarkup(cells.eq(2)), '1/01/2001', 'cell 3');
});

QUnit.test('Highlight searchText - case insensitive', function(assert) {
    var columns = [{ allowFiltering: true, dataType: 'string' }],
        rows = [
            { data: { name: 'test1' }, values: ['test1'] },
            { data: { name: 'test2' }, values: ['test2'] },
            { data: { name: 'test3' }, values: ['Test3'] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        testElement = $('#container'),
        $rows;

    // act
    this.options.searchPanel = {
        highlightSearchText: true,
        text: 'test'
    };

    rowsView.render(testElement);
    $rows = testElement.find('tbody > tr');

    // assert
    assert.equal($rows.length, 4, 'Correct number of rows');

    assert.equal(getNormalizeMarkup($rows.eq(0).find('td:first')), '<span class=' + 'dx-datagrid-search-text' + '>test</span>1', 'Row 1 - case matches');
    assert.equal(getNormalizeMarkup($rows.eq(1).find('td:first')), '<span class=' + 'dx-datagrid-search-text' + '>test</span>2', 'Row 2 - case matches');
    assert.equal(getNormalizeMarkup($rows.eq(2).find('td:first')), '<span class=' + 'dx-datagrid-search-text' + '>Test</span>3', 'Row 3 - case matches');
});

// T166350
QUnit.test('Highlight searchText - case sensitive for odata when highlightCaseSensitive enabled', function(assert) {
    var columns = [{ allowFiltering: true, dataType: 'string' }],
        rows = [
            { data: { name: 'test1' }, values: ['test1'] },
            { data: { name: 'test2' }, values: ['test2'] },
            { data: { name: 'test3' }, values: ['Test3'] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        testElement = $('#container'),
        store = new ODataStore({ url: 'test.org' }),
        $rows;

    dataController.store = function() {
        return store;
    };

    // act
    this.options.searchPanel = {
        highlightSearchText: true,
        highlightCaseSensitive: true,
        text: 'test'
    };

    rowsView.render(testElement);
    $rows = testElement.find('tbody > tr');

    // assert
    assert.equal($rows.length, 4, 'Correct number of rows');

    assert.equal(getNormalizeMarkup($rows.eq(0).find('td:first')), '<span class=' + 'dx-datagrid-search-text' + '>test</span>1', 'Row 1 - case matches');
    assert.equal(getNormalizeMarkup($rows.eq(1).find('td:first')), '<span class=' + 'dx-datagrid-search-text' + '>test</span>2', 'Row 2 - case matches');
    assert.equal(getNormalizeMarkup($rows.eq(2).find('td:first')), 'Test3', 'Row 3 - case does not match');
});

// T490465
QUnit.test('Highlight searchText - case sensitive for odata', function(assert) {
    var columns = [{ allowFiltering: true, dataType: 'string' }],
        rows = [
            { data: { name: 'test1' }, values: ['test1'] },
            { data: { name: 'test2' }, values: ['test2'] },
            { data: { name: 'test3' }, values: ['Test3'] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(this.items, dataController, columns),
        testElement = $('#container'),
        store = new ODataStore({ url: 'test.org' }),
        $rows;

    dataController.store = function() {
        return store;
    };

    // act
    this.options.searchPanel = {
        highlightSearchText: true,
        text: 'test'
    };

    rowsView.render(testElement);
    $rows = testElement.find('tbody > tr');

    // assert
    assert.equal($rows.length, 4, 'Correct number of rows');

    assert.equal(getNormalizeMarkup($rows.eq(0).find('td:first')), '<span class=' + 'dx-datagrid-search-text' + '>test</span>1', 'Row 1');
    assert.equal(getNormalizeMarkup($rows.eq(1).find('td:first')), '<span class=' + 'dx-datagrid-search-text' + '>test</span>2', 'Row 2');
    assert.equal(getNormalizeMarkup($rows.eq(2).find('td:first')), '<span class=' + 'dx-datagrid-search-text' + '>Test</span>3', 'Row 3');
});

QUnit.test('Highlight searchText for lookup column (T449327)', function(assert) {
    // arrange
    var columns = [{ allowFiltering: true, dataType: 'number',
            lookup: {
                dataType: 'string',
                calculateCellValue: function(value) {
                    return 'Lookup' + value;
                }
            },
            parseValue: function(text) {
                return text;
            }
        }],
        rowsView = this.createRowsView([{ data: { id: 1 }, values: [1], rowType: 'data', dataIndex: 0 }], null, columns),
        $testElement = $('#container'),
        searchTextClass = 'dx-datagrid-search-text',
        $cells;

    // act
    this.options.searchPanel = {
        highlightSearchText: true,
        text: '1'
    };

    rowsView.render($testElement);
    $cells = $testElement.find('.dx-data-row').find('td');

    // assert
    assert.equal($cells.length, 1, 'Correct number of cells');
    assert.strictEqual(getNormalizeMarkup($cells.eq(0)), 'Lookup<span class=' + searchTextClass + '>1</span>', 'highlight text in cell');
});

// T534059
QUnit.test('Highlighting search text for boolean column with set to \'trueText\' option', function(assert) {
    // arrange
    var columns = [{
            allowFiltering: true,
            dataType: 'boolean',
            trueText: 'Yes',
            parseValue: function(text) {
                if(text === this.trueText) {
                    return true;
                } else if(text === this.falseText) {
                    return false;
                }
            },
            customizeText: function(e) {
                if(e.value === true) {
                    return this.trueText || 'true';
                } else {
                    return e.valueText || '';
                }
            }
        }],
        rowsView = this.createRowsView([
            { data: { field: true }, values: [true], rowType: 'data', dataIndex: 0 }
        ], null, columns),
        $testElement = $('#container'),
        searchTextClass = 'dx-datagrid-search-text',
        $cells;

    this.options.searchPanel = {
        highlightSearchText: true,
        text: 'Yes'
    };

    // act
    rowsView.render($testElement);

    // assert
    $cells = $testElement.find('.dx-data-row').find('td');
    assert.strictEqual(getNormalizeMarkup($cells.eq(0)), '<span class=' + searchTextClass + '>Yes</span>', 'highlight text in cell');
});

// T534059
QUnit.test('Highlighting search text for boolean column with set to \'falseText\' option', function(assert) {
    // arrange
    var columns = [{
            allowFiltering: true,
            dataType: 'boolean',
            falseText: 'No',
            parseValue: function(text) {
                if(text === this.trueText) {
                    return true;
                } else if(text === this.falseText) {
                    return false;
                }
            },
            customizeText: function(e) {
                if(e.value === false) {
                    return this.falseText || 'false';
                } else {
                    return e.valueText || '';
                }
            }
        }],
        rowsView = this.createRowsView([
            { data: { field: false }, values: [false], rowType: 'data', dataIndex: 0 }
        ], null, columns),
        $testElement = $('#container'),
        searchTextClass = 'dx-datagrid-search-text',
        $cells;

    this.options.searchPanel = {
        highlightSearchText: true,
        text: 'No'
    };

    // act
    rowsView.render($testElement);

    // assert
    $cells = $testElement.find('.dx-data-row').find('td');
    assert.strictEqual(getNormalizeMarkup($cells.eq(0)), '<span class=' + searchTextClass + '>No</span>', 'highlight text in cell');
});

QUnit.test('Highlighting search text for group row if templatesRenderAsynchronously is true (T808974)', function(assert) {
    // arrange
    var columns = [{
            allowCollapsing: true,
            allowFiltering: true,
            cssClass: 'dx-command-expand',
            groupIndex: 0,
            command: 'expand',
            caption: 'Group',
            dataType: 'string'
        }, {
            allowFiltering: true,
            dataType: 'string',
            dataField: 'name'
        }],
        rowsView = this.createRowsView([
            { data: { key: 'TestGroup', items: null }, values: ['TestGroup'], rowType: 'group', groupIndex: 0 }
        ], null, columns),
        $testElement = $('#container'),
        $cells;

    this.options.searchPanel = {
        highlightSearchText: true,
        text: 'Test'
    };
    this.options.templatesRenderAsynchronously = true;

    // act
    rowsView.render($testElement);
    this.clock.tick();

    // assert
    $cells = $testElement.find('.dx-group-row').find('td');
    assert.strictEqual(getNormalizeMarkup($cells.eq(1)), 'Group: <span class=dx-datagrid-search-text>Test</span>Group', 'highlight text in cell');
});

QUnit.test('All rows are not isSelected by default', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        rowsSelected,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    rowsSelected = testElement.find('.dx-selection');

    // assert
    assert.ok(rowsSelected.length === 0, 'rows are not isSelected by default');
});

QUnit.test('Click on row call changeItemSelection', function(assert) {
    // arrange
    var rowClickArgs = [];

    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, null, false, {
            onRowClick: function(e) {
                assert.equal(typeUtils.isRenderer(e.rowElement), !!config().useJQuery, 'rowElement is correct');
                rowClickArgs.push(e);
            }
        }),
        testElement = $('#container');

    rowsView.render(testElement);
    // act
    testElement.find('tbody > tr').eq(1).trigger('dxclick');

    this.selectionOptions.changeItemSelectionResult = true;

    testElement.find('tbody > tr').eq(2).trigger('dxclick');

    // assert
    assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 2);
    assert.deepEqual(this.selectionOptions.changeItemSelectionArgs, [2]);
    // T224173
    assert.equal(rowClickArgs.length, 2, 'rowClick called');
    assert.ok(!rowClickArgs[0].handled, 'first rowClick is not handled by grid');
    assert.ok(rowClickArgs[1].handled, 'second rowClick is handled by grid');
});

// T489828
QUnit.test('Click on row with metaKey should call changeItemSelection with control flag', function(assert) {
    // arrange
    var rowClickArgs = [];

    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, null, false, {
            onRowClick: function(e) {
                rowClickArgs.push(e);
            }
        }),
        testElement = $('#container');

    rowsView.render(testElement);

    // act
    testElement.find('tbody > tr').eq(2).trigger($.Event('dxclick', { metaKey: true, shiftKey: false }));

    // assert
    assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 1);
    assert.deepEqual(this.selectionOptions.changeItemSelectionArgs, [2]);
    assert.deepEqual(this.selectionOptions.additionalKeys, { control: true, shift: false });
});

QUnit.test('Click on row do not call changeItemSelection for showCheckBoxesMode always when mode is multiple', function(assert) {
    // arrange
    var rowClickArgs = [];

    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, null, false, {
            onRowClick: function(e) {
                rowClickArgs.push(e);
            }
        }),
        testElement = $('#container');

    this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always' };

    rowsView.render(testElement);
    sinon.spy(this.dataGrid.selectionController, 'changeItemSelection');
    // act
    testElement.find('tbody > tr').eq(1).trigger('dxclick');

    // assert
    assert.equal(this.dataGrid.selectionController.changeItemSelection.callCount, 0, 'changeItemSelection call count');
});

// T365183
QUnit.test('Click on row call changeItemSelection for showCheckBoxesMode always when mode is single', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        testElement = $('#container');

    this.options.selection = { mode: 'single', showCheckBoxesMode: 'always' };

    rowsView.render(testElement);
    sinon.spy(this.dataGrid.selectionController, 'changeItemSelection');
    // act
    testElement.find('tbody > tr').eq(1).trigger('dxclick');

    // assert
    assert.equal(this.dataGrid.selectionController.changeItemSelection.callCount, 1, 'changeItemSelection call count');
});

QUnit.test('Render selection from dataController rows state', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        selectedCells,
        testElement = $('#container');

    this.items[2].isSelected = true;
    // act
    rowsView.render(testElement);

    selectedCells = getCells(testElement, '.dx-selection');

    // assert
    assert.equal(selectedCells.length, 3, '1 row, 3 cells isSelected');
    assert.equal(getText(selectedCells[0]), 'test3', 'row 3 cell 1');
    assert.equal(getText(selectedCells[1]), '3', 'row 3 cell 2');
    assert.equal(getText(selectedCells[2]), '3/03/2003', 'row 3 cell 3');
});


QUnit.test('Update selection on changed dataController event', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        selectedCells,
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    this.items[2].isSelected = true;
    dataController.changed.fire({ changeType: 'updateSelection', itemIndexes: [1, 2], items: this.items });

    selectedCells = getCells(testElement, '.dx-selection');

    // assert
    assert.equal(selectedCells.length, 3, '1 row, 3 cells isSelected');
    assert.equal(getText(selectedCells[0]), 'test3', 'row 3 cell 1');
    assert.equal(getText(selectedCells[1]), '3', 'row 3 cell 2');
    assert.equal(getText(selectedCells[2]), '3/03/2003', 'row 3 cell 3');
});

var getCheckBoxInstance = function(element) {
    return $(element).dxCheckBox('instance');
};

QUnit.test('Show column with check boxes', function(assert) {
    // arrange
    var rows = [{ values: [false, 'test1', 1, '1/01/2001'], rowType: 'data' }, { values: [true, 'test2', 2, '2/02/2002'], rowType: 'data' }, { values: [false, 'test3', 3, '3/03/2003'], rowType: 'data' }],
        dataController = new MockDataController({ items: rows, selection: { mode: 'multiple', showCheckBoxesMode: 'always' } }),
        rowsView = this.createRowsView(this.items, dataController, [{ command: 'select', dataType: 'boolean' }, {}, {}, {}]),
        checkBoxes,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    checkBoxes = testElement.find('.dx-checkbox');

    // assert
    assert.equal(checkBoxes.length, 3, 'check boxs count');
    assert.ok(!getCheckBoxInstance(checkBoxes[0]).option('value'), 'check is false');
    assert.ok(getCheckBoxInstance(checkBoxes[1]).option('value'), 'check is true');
    assert.ok(!getCheckBoxInstance(checkBoxes[2]).option('value'), 'check is false');
});

QUnit.test('Selection rows by click on checkbox', function(assert) {
    // arrange
    var rows = [{ values: [false, 'test1', 1, '1/01/2001'], rowType: 'data' }, { values: [false, 'test2', 2, '2/02/2002'], rowType: 'data' }, { values: [false, 'test3', 3, '3/03/2003'], rowType: 'data' }],
        dataController = new MockDataController({ items: rows, selection: { mode: 'multiple', showCheckBoxesMode: 'always' } }),
        rowsView = this.createRowsView(this.items, dataController, [{ command: 'select', dataType: 'boolean', cssClass: 'dx-command-select' }, {}, {}, {}]),
        checkBoxes,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    checkBoxes = testElement.find('.dx-checkbox');
    assert.equal(checkBoxes.length, 3);
    checkBoxes.eq(1).trigger('dxclick');

    // assert
    assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 1);
    assert.deepEqual(this.selectionOptions.changeItemSelectionArgs, [1]);
});

QUnit.test('Selection rows by space keydown on checkbox', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'Keyboard navigation is not worked by devices');
        return;
    }

    // arrange
    var rows = [{ values: [false, 'test1', 1, '1/01/2001'], rowType: 'data' }, { values: [false, 'test2', 2, '2/02/2002'], rowType: 'data' }, { values: [false, 'test3', 3, '3/03/2003'], rowType: 'data' }],
        dataController = new MockDataController({ items: rows, selection: { mode: 'multiple', showCheckBoxesMode: 'always' } }),
        rowsView = this.createRowsView(this.items, dataController, [{ command: 'select', dataType: 'boolean', cssClass: 'dx-command-select' }, {}, {}, {}]),
        checkBoxes,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    checkBoxes = testElement.find('.dx-checkbox');
    assert.equal(checkBoxes.length, 3);
    checkBoxes.eq(1).trigger($.Event('keydown', { key: ' ' }));

    // assert
    assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 1);
    assert.deepEqual(this.selectionOptions.changeItemSelectionArgs, [1]);
});

QUnit.test('Selection is not working by row when selectionMode is "multipleWithCheckBoxes"', function(assert) {
    var rows = [{ values: [false, 'test1', 1, '1/01/2001'] }, { values: [false, 'test2', 2, '2/02/2002'] }, { values: [false, 'test3', 3, '3/03/2003'] }],
        dataController = new MockDataController({ items: rows, selection: { mode: 'multiple', showCheckBoxesMode: 'always' } }),
        rowsView = this.createRowsView(this.items, dataController, [{ command: 'select' }, {}, {}, {}]),
        selectionRows,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');
    rows[0].click();

    // assert
    selectionRows = testElement.find('.dx-selection');
    assert.equal(selectionRows.length, 0, 'selection rows');

    // act
    rows[1].click();

    // assert
    selectionRows = testElement.find('.dx-selection');
    assert.equal(selectionRows.length, 0, 'selection rows');

    // act
    rows[2].click();

    // assert
    selectionRows = testElement.find('.dx-selection');
    assert.equal(selectionRows.length, 0, 'selection rows');
});

QUnit.test('Render rows after "refresh" from data controller', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, null),
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    dataController.changed.fire({
        changeType: 'refresh',
        items: [{ values: ['test4', 4, '4/04/2004'] }]
    });

    // assert
    assert.equal(testElement.find('colgroup').length, 1, 'col elements count');
    assert.equal(testElement.find('tbody > tr').length, 2, 'rows count');
    assert.equal(testElement.find('.dx-datagrid-content').length, 1, 'content class for focus overlay added');
});

QUnit.test('Custom function template for column', function(assert) {
    var rows = [{ values: [true], rowType: 'data' }, { values: [false], rowType: 'data' }, { values: [true], rowType: 'data' }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            cellTemplate: function(container, options) {
                var $container = $(container);
                $('<div class="customTemplate" />')
                    .css('background-color', options.value ? 'red' : 'blue')
                    .appendTo($container);

                // T234340
                assert.ok(!!$container.closest(document).length, 'cell is attached to dom');
            }
        }]),
        testElement = $('#container'),
        cells,
        checkColor = function(result, expected1, expected2, message) {
            assert.ok(result === expected1 || result === expected2, message);
        };

    // act
    rowsView.render(testElement);
    cells = testElement.find('.customTemplate');

    // assert
    checkColor($(cells[0]).css('background-color'), 'rgb(255, 0, 0)', 'red', 'row 1 cell 1');
    checkColor($(cells[1]).css('background-color'), 'rgb(0, 0, 255)', 'blue', 'row 2 cell 1');
    checkColor($(cells[2]).css('background-color'), 'rgb(255, 0, 0)', 'red', 'row 3 cell 1');
});

// T116631
QUnit.test('Click in cellTemplate should be not prevented', function(assert) {
    var rows = [{ values: [1], rowType: 'data' }, { values: [2], rowType: 'data' }, { values: [3], rowType: 'data' }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            cellTemplate: function(container, options) {
                $('<a />', {
                    text: options.text
                }).appendTo(container);
            }
        }]),
        testElement = $('#container');

    rowsView.render(testElement);

    var isClicked = false,
        isDefaultPrevented;

    $('#container').on('click', function(e) {
        isClicked = true;
        isDefaultPrevented = e.isDefaultPrevented();
    });

    // act
    testElement.find('a')[1].click();

    // assert
    assert.ok(isClicked, 'is clicked');
    assert.ok(!isDefaultPrevented, 'default is not prevented');
});

QUnit.test('Custom function template options for lookup column', function(assert) {
    var templateOptions = [],
        rows = [{ rowType: 'data', values: [1] }, { rowType: 'data', values: [2] }, { rowType: 'data', values: [3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            lookup: {
                calculateCellValue: function(value) {
                    return 'Lookup ' + value;
                }
            },
            cellTemplate: function(container, options) {
                templateOptions.push(options);
            }
        }]),
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(templateOptions.length, 3, 'rows count');
    assert.equal(templateOptions[0].value, 1, 'row 1 value');
    assert.equal(templateOptions[0].displayValue, 'Lookup 1', 'row 1 display value');
    assert.equal(templateOptions[0].text, 'Lookup 1', 'row 1 text');
    assert.equal(templateOptions[1].value, 2, 'row 2 value');
    assert.equal(templateOptions[1].displayValue, 'Lookup 2', 'row 2 display value');
    assert.equal(templateOptions[1].text, 'Lookup 2', 'row 2 text');
});


QUnit.test('Custom extern column template with allowRenderToDetachedContainer', function(assert) {
    var rows = [{ values: ['1'], rowType: 'data' }, { values: ['2'], rowType: 'data' }, { values: ['3'], rowType: 'data' }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            cellTemplate: 'testTemplate'
        }]),
        testElement = $('#container'),
        cells;

    rowsView.component._getTemplate = function() {
        return {
            allowRenderToDetachedContainer: true,
            render: function(options) {
                options.container.text('Custom Template - ' + options.model.text);
            }
        };
    };

    // act
    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal($(cells[0]).text(), 'Custom Template - 1');
    assert.equal($(cells[1]).text(), 'Custom Template - 2');
    assert.equal($(cells[2]).text(), 'Custom Template - 3');
});

QUnit.test('Custom extern column template without allowRenderToDetachedContainer', function(assert) {
    var rows = [{ values: ['1'], rowType: 'data' }, { values: ['2'], rowType: 'data' }, { values: ['3'], rowType: 'data' }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            cellTemplate: 'testTemplate'
        }]),
        testElement = $('#container'),
        cells;

    rowsView.component._getTemplate = function() {
        return {
            allowRenderToDetachedContainer: false,
            render: function(options) {
                // T145808
                assert.ok(!contentPositionUpdated, 'content position not updated');
                options.container.text('Custom Template - ' + options.model.text);
            }
        };
    };

    // act

    var contentPositionUpdated = false;
    rowsView._updateContentPosition = function(isRender) {
        if(!isRender) {
            contentPositionUpdated = true;
        }
    };

    rowsView.render(testElement);
    rowsView.resize();
    cells = testElement.find('td');

    // assert
    assert.equal($(cells[0]).text(), 'Custom Template - 1');
    assert.equal($(cells[1]).text(), 'Custom Template - 2');
    assert.equal($(cells[2]).text(), 'Custom Template - 3');
    // T145808
    assert.ok(contentPositionUpdated, 'content position updated');
});

QUnit.test('Custom extern column template without allowRenderToDetachedContainer and detached root rowsView element', function(assert) {
    var rows = [{ values: ['1'], rowType: 'data' }, { values: ['2'], rowType: 'data' }, { values: ['3'], rowType: 'data' }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            cellTemplate: 'testTemplate'
        }]),
        testElement = $('<div/>'),
        cells;

    rowsView.component._getTemplate = function() {
        return {
            allowRenderToDetachedContainer: false,
            render: function(options) {
                options.container.text('Custom Template - ' + options.model.text);
            }
        };
    };

    // act
    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal($(cells[0]).text(), '');

    // act
    rowsView.renderDelayedTemplates();

    // assert
    assert.equal($(cells[0]).text(), 'Custom Template - 1');
    assert.equal($(cells[1]).text(), 'Custom Template - 2');
    assert.equal($(cells[2]).text(), 'Custom Template - 3');
});

QUnit.test('Custom function row template with allowRenderToDetachedContainer', function(assert) {
    var rows = [{ values: ['1'], rowType: 'data' }, { values: ['2'], rowType: 'data' }, { values: ['3'], rowType: 'data' }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{}]),
        testElement = $('#container'),
        cells;

    this.options.rowTemplate = 'test';

    rowsView.component._getTemplate = function(templateName) {
        if(templateName === 'test') {
            return {
                allowRenderToDetachedContainer: true,
                render: function(options) {
                    options.container.append('<tr><td>Custom Template - ' + options.model.values[0] + '</td></tr>');
                }
            };
        }
    };

    // act
    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal($(cells[0]).text(), 'Custom Template - 1');
    assert.equal($(cells[1]).text(), 'Custom Template - 2');
    assert.equal($(cells[2]).text(), 'Custom Template - 3');
});

QUnit.test('Custom function row template without allowRenderToDetachedContainer', function(assert) {
    var rows = [{ values: ['1'], rowType: 'data' }, { values: ['2'], rowType: 'data' }, { values: ['3'], rowType: 'data' }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{}]),
        testElement = $('#container'),
        cells;

    this.options.rowTemplate = 'test';

    rowsView.component._getTemplate = function(templateName) {
        if(templateName === 'test') {
            return {
                allowRenderToDetachedContainer: false,
                render: function(options) {
                    options.container.append('<tr><td>Custom Template - ' + options.model.values[0] + '</td></tr>');
                }
            };
        }
    };

    // act
    rowsView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal($(cells[0]).text(), 'Custom Template - 1');
    assert.equal($(cells[1]).text(), 'Custom Template - 2');
    assert.equal($(cells[2]).text(), 'Custom Template - 3');
});

QUnit.test('Custom extern row template', function(assert) {
    var rows = [{ values: ['1'], rowType: 'data' }, { values: ['2'], rowType: 'data', isSelected: true }, { values: ['3'], rowType: 'data' }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{}]),
        testElement = $('#container');

    this.options.rowTemplate = function(container, options) {
        $(container).append('<tr' + (options.isSelected ? ' class="dx-selection"' : '') + '><td>Custom Template - ' + options.values[0] + '</td></tr>');
    };

    // act
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    // assert
    assert.equal($(rows[0]).text(), 'Custom Template - 1');
    assert.ok(!$(rows[0]).hasClass('dx-selection'));
    assert.equal($(rows[1]).text(), 'Custom Template - 2');
    assert.ok($(rows[1]).hasClass('dx-selection'));
    assert.equal($(rows[2]).text(), 'Custom Template - 3');
    assert.ok(!$(rows[2]).hasClass('dx-selection'));
});

// B254287
QUnit.test('Group row is not edit', function(assert) {
    // arrange
    this.items[0].rowType = 'group';
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController, null),
        groupedRows,
        testElement = $('#container');

    this.options.editing = {
        mode: 'inline',
        allowUpdating: true
    };
    rowsView.render(testElement);
    groupedRows = testElement.find('.' + 'dx-group-row');

    // assert
    assert.equal(groupedRows.length, 1, 'grouped rows');

    // act
    rowsView.getController('editing').editRow(0);

    // assert
    assert.ok(!groupedRows.hasClass('dx-edit-row'), 'grouped row not has class dx-edit-row');

    // act
    rowsView.getController('editing').editRow(1);

    // assert
    assert.ok(testElement.find('tbody > tr').eq(1).hasClass('dx-edit-row'), 'edit row without grouping');
});

QUnit.test('Not start selectionWithCheckboxes when tap less longTapTime', function(assert) {
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        testElement = $('#container'),
        rows,
        selectionOptions = this.selectionOptions;

    this.options.selection = {
        showCheckBoxesMode: 'onLongTap'
    };

    // act
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    var mouse = pointerMock(rows.eq(1))
        .start()
        .down()
        .wait(500);

    this.clock.tick(500);
    mouse.up();

    // assert
    assert.equal(selectionOptions.changeItemSelectionCallsCount, 1);
    assert.ok(!selectionOptions.isSelectionWithCheckboxes);
});

QUnit.test('Start selectionWithCheckboxes when tap longer longTapTime', function(assert) {
    var rowInfos = this.items,
        dataController = new MockDataController({ items: rowInfos }),
        rowsView = this.createRowsView(rowInfos, dataController),
        testElement = $('#container'),
        selectionOptions = this.selectionOptions,
        rows;

    this.options.selection = {
        showCheckBoxesMode: 'onLongTap'
    };

    // act
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    var mouse = pointerMock(rows.eq(1))
        .start()
        .down()
        .wait(750);

    this.clock.tick(750);
    mouse.up();

    // assert
    assert.ok(!selectionOptions.changeItemSelectionCallsCount);
    assert.ok(selectionOptions.isSelectionWithCheckboxes);
});

QUnit.test('No start selectionWithCheckboxes on several click', function(assert) {
    var rowInfos = this.items,
        dataController = new MockDataController({ items: rowInfos }),
        rowsView = this.createRowsView(rowInfos, dataController),
        testElement = $('#container'),
        selectionOptions = this.selectionOptions,
        rows;

    this.options.selection = {
        showCheckBoxesMode: 'onLongTap'
    };

    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    // act
    rows.eq(1).trigger('dxclick');
    rows.eq(2).trigger('dxclick');

    // assert
    assert.equal(selectionOptions.changeItemSelectionCallsCount, 2);
    assert.ok(!selectionOptions.isSelectionWithCheckboxes);
});

QUnit.test('Not start selectionWithCheckboxes when showCheckBoxesMode none', function(assert) {
    var rowInfos = this.items,
        dataController = new MockDataController({ items: rowInfos }),
        rowsView = this.createRowsView(rowInfos, dataController),
        testElement = $('#container'),
        selectionOptions = this.selectionOptions,
        rows;

    this.options.selection = {
        showCheckBoxesMode: 'none'
    };

    // act
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    var mouse = pointerMock(rows.eq(1))
        .start()
        .down()
        .wait(750);

    this.clock.tick(750);
    mouse.up();

    // assert
    assert.equal(selectionOptions.changeItemSelectionCallsCount, 1);
    assert.ok(!selectionOptions.isSelectionWithCheckboxes);
});

QUnit.test('Selection on long tap when selectionWithCheckboxes started', function(assert) {
    // arrange
    var rowInfos = this.items,
        dataController = new MockDataController({ items: rowInfos }),
        rowsView = this.createRowsView(rowInfos, dataController),
        testElement = $('#container'),
        selectionOptions = this.selectionOptions,
        rows;

    this.options.selection = {
        showCheckBoxesMode: 'onLongTap'
    };
    selectionOptions.isSelectionWithCheckboxes = true;

    // act
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    rows.eq(1).trigger('dxclick');

    // assert
    assert.strictEqual(selectionOptions.changeItemSelectionCallsCount, 1);
    assert.ok(selectionOptions.isSelectionWithCheckboxes);
});

// B254289
QUnit.test('Selection on hold', function(assert) {
    // arrange
    var rowInfos = this.items,
        dataController = new MockDataController({ items: rowInfos }),
        rowsView = this.createRowsView(rowInfos, dataController),
        testElement = $('#container'),
        selectionOptions = this.selectionOptions,
        rows;

    this.dataGrid.contextMenuView.render(testElement);

    this.options.selection = {
        showCheckBoxesMode: 'onClick'
    };

    // act
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    var mouse = pointerMock(rows.eq(1))
        .start(support.touch ? 'touch' : 'mouse')
        .down()
        .wait(750);

    this.clock.tick(750);
    mouse.up();

    // assert
    assert.strictEqual(selectionOptions.changeItemSelectionCallsCount, 1);
    assert.ok(selectionOptions.isSelectionWithCheckboxes);
});

// T437599
QUnit.test('Selection on hold should not work when showCheckBoxesMode is always', function(assert) {
    // arrange
    var rowInfos = this.items,
        dataController = new MockDataController({ items: rowInfos }),
        rowsView = this.createRowsView(rowInfos, dataController),
        testElement = $('#container'),
        selectionOptions = this.selectionOptions,
        rows;

    this.dataGrid.contextMenuView.render(testElement);

    this.options.selection = {
        showCheckBoxesMode: 'always'
    };

    // act
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    var mouse = pointerMock(rows.eq(1))
        .start(support.touch ? 'touch' : 'mouse')
        .down()
        .wait(750);

    this.clock.tick(750);
    mouse.up();

    // assert
    assert.ok(!selectionOptions.changeItemSelectionCallsCount);
});


// T355686
QUnit.test('ContextMenu on hold when touch and when assign items in onContextMenuPreparing', function(assert) {
    // arrange
    var rowInfos = this.items,
        dataController = new MockDataController({ items: rowInfos }),
        rowsView = this.createRowsView(rowInfos, dataController),
        testElement = $('#container'),
        selectionOptions = this.selectionOptions,
        rows;

    this.options.selection = {
        showCheckBoxesMode: 'onClick',
    };

    this.options.onContextMenuPreparing = function(e) {
        e.items = [{ text: 'test' }];
    };

    this.dataGrid.contextMenuController.init();

    var oldTouch = support.touch;
    support.touch = true;
    this.dataGrid.contextMenuView.render(testElement);


    // act
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    var mouse = pointerMock(rows.eq(1))
        .start('touch')
        .down()
        .wait(750);

    this.clock.tick(750);
    mouse.up();

    // assert
    assert.strictEqual(selectionOptions.changeItemSelectionCallsCount, undefined, 'selection is not called');
    assert.strictEqual($('.dx-datagrid.dx-context-menu').text(), 'test', 'context menu is rendered');

    support.touch = oldTouch;
});

QUnit.test('onRowClick event handling', function(assert) {
    var rowInfos = this.items,
        dataController = new MockDataController({ items: rowInfos }),
        rowsView = this.createRowsView(rowInfos, dataController),
        testElement = $('#container'),
        rows,
        rowClickArgs;

    this.options.onRowClick = function(data) {
        rowClickArgs = data;
    };

    rowsView.optionChanged({ name: 'onRowClick' });
    rowsView.render(testElement);
    rows = testElement.find('tbody > tr');

    // act
    rows.eq(1).trigger('dxclick');

    // assert
    assert.equal(typeUtils.isRenderer(rowClickArgs.rowElement), !!config().useJQuery, 'row element');
    assert.deepEqual($(rowClickArgs.rowElement)[0], rows[1], 'row element');
    assert.deepEqual(rowClickArgs.data, { name: 'test2', id: 2, date: new Date(2002, 1, 2) });
    assert.equal(rowClickArgs.columns.length, 3, 'count columns');
    assert.equal(rowClickArgs.dataIndex, 1, 'dataIndex');
    assert.equal(rowClickArgs.rowIndex, 1, 'rowIndex');
    assert.strictEqual(rowClickArgs.rowType, 'data', 'rowType');
    assert.deepEqual(rowClickArgs.values, ['test2', 2, '2/02/2002'], 'values');
    assert.strictEqual(rowClickArgs.event.type, 'dxclick', 'Event type');
});

QUnit.test('onCellClick event handling', function(assert) {
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        testElement = $('#container'),
        cells,
        cellClickArgs;

    this.options.onCellClick = function(options) {
        cellClickArgs = options;
    };

    rowsView.optionChanged({ name: 'onCellClick' });
    rowsView.render(testElement);
    cells = testElement.find('td');

    // act
    cells.eq(0).trigger('dxclick');

    // assert
    assert.equal(typeUtils.isRenderer(cellClickArgs.cellElement), !!config().useJQuery, 'cellElement is correct');
    assert.deepEqual($(cellClickArgs.cellElement)[0], cells[0], 'Container');
    assert.ok(cellClickArgs.event, 'event');
    assert.deepEqual(cellClickArgs.event.target, cells[0], 'event.target');
    assert.strictEqual(cellClickArgs.value, 'test1', 'value');
    assert.strictEqual(cellClickArgs.text, 'test1', 'text');
    assert.strictEqual(cellClickArgs.isEditing, false, 'isEditing');
    assert.strictEqual(cellClickArgs.columnIndex, 0, 'columnIndex');
    assert.strictEqual(cellClickArgs.rowIndex, 0, 'rowIndex');
});

QUnit.test('onRowDblClick event handling', function(assert) {
    var $rowElement,
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        $testElement = $('#container'),
        rowDoubleClickArgs;

    this.options.onRowDblClick = function(data) {
        rowDoubleClickArgs = data;
    };

    rowsView.optionChanged({ name: 'onRowDblClick' });
    rowsView.render($testElement);
    $rowElement = $(rowsView.getRowElement(1));

    // act
    $rowElement.trigger('dxdblclick');

    // assert
    assert.equal(typeUtils.isRenderer(rowDoubleClickArgs.rowElement), !!config().useJQuery, 'row element');
    assert.deepEqual($(rowDoubleClickArgs.rowElement)[0], $rowElement[0], 'row element');
    assert.deepEqual(rowDoubleClickArgs.data, { name: 'test2', id: 2, date: new Date(2002, 1, 2) });
    assert.equal(rowDoubleClickArgs.columns.length, 3, 'count columns');
    assert.equal(rowDoubleClickArgs.dataIndex, 1, 'dataIndex');
    assert.equal(rowDoubleClickArgs.rowIndex, 1, 'rowIndex');
    assert.strictEqual(rowDoubleClickArgs.rowType, 'data', 'rowType');
    assert.deepEqual(rowDoubleClickArgs.values, ['test2', 2, '2/02/2002'], 'values');
    assert.strictEqual(rowDoubleClickArgs.event.type, 'dxdblclick', 'Event type');
});

QUnit.test('onCellDblClick event handling', function(assert) {
    var $cellElement,
        dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        $testElement = $('#container'),
        cellDoubleClickArgs;

    this.options.onCellDblClick = function(options) {
        cellDoubleClickArgs = options;
    };

    rowsView.optionChanged({ name: 'onCellDblClick' });
    rowsView.render($testElement);
    $cellElement = $(rowsView.getCellElement(0, 0));

    // act
    $cellElement.trigger('dxdblclick');

    // assert
    assert.equal(typeUtils.isRenderer(cellDoubleClickArgs.cellElement), !!config().useJQuery, 'cellElement is correct');
    assert.deepEqual($(cellDoubleClickArgs.cellElement)[0], $cellElement[0], 'Container');
    assert.ok(cellDoubleClickArgs.event, 'event');
    assert.deepEqual(cellDoubleClickArgs.event.target, $cellElement[0], 'event.target');
    assert.strictEqual(cellDoubleClickArgs.value, 'test1', 'value');
    assert.strictEqual(cellDoubleClickArgs.text, 'test1', 'text');
    assert.strictEqual(cellDoubleClickArgs.isEditing, false, 'isEditing');
    assert.strictEqual(cellDoubleClickArgs.columnIndex, 0, 'columnIndex');
    assert.strictEqual(cellDoubleClickArgs.rowIndex, 0, 'rowIndex');
    assert.strictEqual(cellDoubleClickArgs.event.type, 'dxdblclick', 'Event type');
});

// T182190
QUnit.test('Horizontal scroll when no data', function(assert) {
    // arrange
    var rowsView = this.createRowsView([], null, [{ width: 200 }, { width: 200 }]),
        $testElement = $('#container');

    // act
    $testElement.height(300);
    $testElement.width(300);
    rowsView.render($testElement);
    rowsView.resize();

    // assert
    var scrollable = rowsView.element().data('dxScrollable');

    assert.equal(scrollable.clientWidth(), 300, 'client width');
    assert.equal(scrollable.scrollWidth(), 400, 'scroll width');
    // T210256
    assert.ok(rowsView._getFreeSpaceRowElements().is(':visible'), 'visible free space row');
    assert.equal(rowsView._getFreeSpaceRowElements().height(), 0, 'height free space row');
});

QUnit.test('Render additional row for free space_B232625', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        oldTableHeight,
        oldFunc,
        $table,
        $testElement = $('#container');

    // act
    $testElement.height(300);
    oldFunc = rowsView._renderScrollable;
    rowsView._renderScrollable = function() {
        oldTableHeight = this._getTableElement().height();
        oldFunc.call(rowsView);
    };

    rowsView.render($testElement);
    rowsView.height(300);
    rowsView.resize();

    // assert
    assert.equal(rowsView._getFreeSpaceRowElements().css('display'), 'table-row', 'display style is table-row');

    // act
    rowsView.height(10);
    rowsView.resize();

    // assert
    assert.equal(rowsView._getFreeSpaceRowElements().css('display'), 'none', 'display style is none');

    // act
    rowsView.height(300);
    rowsView.resize();
    $table = $testElement.find('table');

    // assert
    assert.equal(rowsView._getFreeSpaceRowElements().css('display'), 'table-row', 'display style is table-row');
    assert.ok(oldTableHeight < $testElement.height(), 'old table height');
    assert.ok(Math.abs($table[0].offsetHeight - $testElement[0].offsetHeight) <= 1);
    assert.ok(rowsView._getFreeSpaceRowElements()[0].style.height, 'free space rows height');
});

// B253540
QUnit.test('Render additional row for free space after resize', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [{ resizedCallbacks: $.Callbacks().add(function() { $('#container').find('tbody > tr').height(200); }) }, {}, {}]),
        $testElement = $('#container');

    $testElement.height(300);

    rowsView.render($testElement);
    this.setColumnWidths({ widths: [100] });
    // act
    rowsView.resize();

    // assert
    assert.equal(rowsView._getFreeSpaceRowElements().css('display'), 'none', 'display style is none');
});

QUnit.test('Free space row with a command column', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items, virtualItemsCount: { begin: 20, end: 0 } }),
        rowsView = this.createRowsView(this.items, dataController, [{ command: 'expand' }, {}, {}, {}]),
        $testElement = $('#container');

    // act
    rowsView.render($testElement);
    rowsView.height(400);
    rowsView.resize();

    // assert
    assert.ok(rowsView._getFreeSpaceRowElements().find('td').hasClass('dx-datagrid-group-space'), 'has class dx-datagrid-group-space');
});

QUnit.test('Free space row with a command column and cssClass', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items, virtualItemsCount: { begin: 20, end: 0 } }),
        rowsView = this.createRowsView(this.items, dataController, [{ command: 'expand', cssClass: 'command-cell' }, { cssClass: 'simple-cell' }, {}, {}]),
        $testElement = $('#container');

    // act
    rowsView.render($testElement);
    rowsView.height(400);
    rowsView.resize();

    // assert
    var $cells = $testElement.find('table').last().find('.dx-freespace-row td'),
        $commandCell = $cells.eq(0),
        $simpleCellWithCssClass = $cells.eq(1),
        $simpleCell = $cells.eq(2);

    assert.ok($commandCell.hasClass('dx-datagrid-group-space'), 'has class dx-datagrid-group-space');
    assert.ok($commandCell.hasClass('command-cell'), 'has custom css class');
    assert.ok($simpleCellWithCssClass.hasClass('simple-cell'), 'has custom css class');
    assert.notOk($simpleCell.hasClass('simple-cell'), 'doesn\'t have a custom css class');
});

// B233350
QUnit.test('Freespace row must be empty for virtual scroller and non-first page', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items, virtualItemsCount: { begin: 20, end: 0 } }),
        rowsView = this.createRowsView(this.items, dataController, null, false, { scrolling: { mode: 'virtual' } }),
        $testElement = $('#container');

    // act
    rowsView.render($testElement);
    rowsView.height(400);
    dataController.getVirtualContentSize = function() {
        return 1000;
    };
    rowsView.resize();

    // assert
    assert.equal(rowsView._getFreeSpaceRowElements().css('display'), 'none', 'display style is none');
});

// B233350
QUnit.test('Freespace row not must be empty for virtual scroller and first page', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items, virtualItemsCount: { begin: 0, end: 0 } }),
        rowsView = this.createRowsView(this.items, dataController),
        $testElement = $('#container');

    // act
    rowsView.render($testElement);
    rowsView.height(400);
    rowsView.resize();

    // assert
    assert.equal(rowsView._getFreeSpaceRowElements().css('display'), 'table-row', 'display style is none');
});

// T439963
QUnit.test('RowsView should not be scrolled on render if page index is specified', function(assert) {
    var done = assert.async(),
        dataController = new MockDataController({ items: this.items, pageIndex: 1, virtualItemsCount: { begin: 10, end: 0 } }),
        rowsView = this.createRowsView(this.items, dataController),
        $testElement = $('#container');

    sinon.spy(rowsView, 'scrollTo');

    rowsView.render($testElement);
    rowsView.height(30);
    dataController.getVirtualContentSize = function() {
        return 300;
    };
    dataController.getContentOffset = function() {
        return 200;
    };
    rowsView.resize();

    var $scrollable = $testElement.find('.dx-scrollable'),
        scrollable = $scrollable.dxScrollable('instance'),
        $scrollableContainer = $scrollable.find('.dx-scrollable-container'),
        oldScrollHandler = scrollable.option('onScroll');

    scrollable.option('onScroll', function() {

        var callCount = rowsView.scrollTo.callCount;
        assert.ok(callCount > 0, 'scrollTo should be called on the first render');

        oldScrollHandler.apply(this, arguments);
        rowsView.render($testElement);
        assert.equal(rowsView.scrollTo.callCount, callCount, 'scrollTo should not be called on the second render');
        done();
    });

    $scrollableContainer.get(0).scrollTop = 80;
});

// T112484
QUnit.test('Height free space row for virtual scroller', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items, virtualItemsCount: { begin: 0, end: 0 } }),
        rowsView = this.createRowsView(this.items, dataController),
        $testElement = $('#container'),
        freeSpaceRowHeight,
        borderTopWidth,
        tableBorderTopWidth;

    // act
    rowsView.render($testElement);
    rowsView.height(400);
    rowsView.resize();
    borderTopWidth = Math.ceil(parseFloat($(rowsView.element()).css('borderTopWidth')));
    tableBorderTopWidth = Math.ceil(parseFloat(rowsView.getTableElements().css('borderTopWidth')));

    // assert
    freeSpaceRowHeight = 400 - 3 * rowsView._rowHeight - borderTopWidth - tableBorderTopWidth;
    assert.equal(rowsView._getFreeSpaceRowElements().css('display'), 'table-row', 'display style is none');
    assert.equal(rowsView._getFreeSpaceRowElements()[0].offsetHeight, Math.round(freeSpaceRowHeight), 'height free space row');
});

QUnit.test('Free space row has not hover', function(assert) {
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        freeSpaceRow,
        testElement = $('#container');

    // act
    this.options.hoverStateEnabled = true;
    rowsView.render(testElement);
    rowsView.height(300);
    rowsView.resize();
    freeSpaceRow = testElement.find('.dx-freespace-row').get(0);

    // assert
    assert.ok(!$(freeSpaceRow).hasClass('dx-state-hover'), 'free space row has not hover');
});

QUnit.test('Free space row with option showColumnLines true', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        freeSpaceRow,
        testElement = $('#container');

    // act
    this.options.showColumnLines = true;
    rowsView.render(testElement);
    rowsView.height(300);
    rowsView.resize();
    freeSpaceRow = testElement.find('.dx-freespace-row').first();

    // assert
    assert.ok(freeSpaceRow.hasClass('dx-column-lines'), 'has class dx-column-lines');
});

QUnit.test('Free space row with option showColumnLines false', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items }),
        rowsView = this.createRowsView(this.items, dataController),
        freeSpaceRow,
        testElement = $('#container');

    // act
    this.options.showColumnLines = false;
    rowsView.render(testElement);
    rowsView.height(300);
    rowsView.resize();
    freeSpaceRow = testElement.find('.dx-freespace-row').first();

    // assert
    assert.ok(!freeSpaceRow.hasClass('dx-column-lines'), 'not has class dx-column-lines');
});

QUnit.test('Height of free space row is wrong_B254959', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items, pageSize: 10, pageIndex: 1, pageCount: 2 }),
        rowsView = this.createRowsView(this.items, dataController),
        freeSpaceRow,
        expectedHeight,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    rowsView.resize();

    freeSpaceRow = testElement.find('.dx-freespace-row').first();
    expectedHeight = freeSpaceRow.height();

    rowsView.updateFreeSpaceRowHeight();

    // assert
    assert.equal(freeSpaceRow.height(), expectedHeight, 'height of freeSpaceRow');
    assert.equal(testElement.find('.dx-last-row-border').length, 0);
});

// T174661
QUnit.test('Update free space row height after insert/remove row', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        $testElement = $('#container');

    // act
    rowsView.render($testElement);
    rowsView.height(300);
    rowsView.resize();

    // assert
    var oldFreeSpaceRowHeight = rowsView._getFreeSpaceRowElements().height();

    assert.equal(rowsView._getFreeSpaceRowElements().css('display'), 'table-row', 'display style is table-row');
    assert.ok(oldFreeSpaceRowHeight > 0);

    // act
    rowsView.render(null, {
        changeType: 'update',
        rowIndices: [0],
        changeTypes: ['insert'],
        items: this.items
    });
    rowsView.resize();

    // assert
    var freeSpaceRowElement = rowsView._getFreeSpaceRowElements();
    assert.equal(freeSpaceRowElement.css('display'), 'table-row', 'display style is table-row');
    assert.ok(freeSpaceRowElement.height() > 0);
    assert.ok(freeSpaceRowElement.height() < oldFreeSpaceRowHeight);
});

// T354748
QUnit.test('Update content without data', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        $testElement = $('#container');

    rowsView.render($testElement);

    // act
    rowsView.render($testElement, {
        changeType: 'update',
        rowIndices: [0],
        changeTypes: ['update'],
        items: []
    });

    // assert
    assert.ok(true);
});

// T391782
QUnit.test('Remove last row', function(assert) {
    // arrange
    var rowsView = this.createRowsView([this.items[0]]),
        $testElement = $('#container');

    rowsView.render($testElement);

    assert.equal($testElement.find('.dx-data-row').length, 1, 'one data row rendered');

    // act
    rowsView.render($testElement, {
        changeType: 'update',
        rowIndices: [0],
        changeTypes: ['remove'],
        items: []
    });

    // assert
    assert.equal($testElement.find('.dx-data-row').length, 0, 'last data row is removed');
});

QUnit.test('Add css class for a last row when the showBorders and showRowLines are enabled and freeSpaceRow is hidden', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items, pageSize: 10, pageIndex: 1, pageCount: 2 }),
        rowsView = this.createRowsView(this.items, dataController, null, null, {
            showRowLines: true,
            showBorders: true
        }
        ),
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    rowsView._hasHeight = true;
    rowsView.resize();

    // assert
    assert.equal(testElement.find('.dx-last-row-border').length, 1);
});

QUnit.test('Remove css class for a last row when freeSpaceRow is shown', function(assert) {
    // arrange
    var dataController = new MockDataController({ items: this.items, pageSize: 10, pageIndex: 1, pageCount: 2 }),
        rowsView = this.createRowsView(this.items, dataController, null, null, {
            showRowLines: true,
            showBorders: true
        }
        ),
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    rowsView._hasHeight = true;
    rowsView.resize();

    rowsView._hasHeight = false;
    rowsView.resize();

    // assert
    assert.equal(testElement.find('.dx-last-row-border').length, 0);
});

QUnit.test('Show grouped columns', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2] }, { rowType: 'data', values: [null, null, 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }, {}]),
        testElement = $('#container');

    this.options.grouping = {
        texts: { groupContinuesMessage: 'Continued on the next page' }
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, 'rows count: 3 + 1 freespace row');

    assert.equal(testElement.find('tbody > tr').eq(0).attr('role'), 'row');
    assert.equal(testElement.find('tbody > tr').eq(0).attr('aria-expanded'), 'true');
    assert.ok($(testElement.find('tbody > tr')[0]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').length, 2);
    assert.ok($(testElement.find('tbody > tr')[0]).find('td').first().children().first().hasClass('dx-datagrid-group-opened'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1: 1 (Continued on the next page)');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().attr('colspan'), 2);

    assert.equal(testElement.find('tbody > tr').eq(1).attr('role'), 'row');
    assert.equal(testElement.find('tbody > tr').eq(1).attr('aria-expanded'), 'false');
    assert.ok($(testElement.find('tbody > tr')[1]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').length, 3);
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').first().text(), '');
    assert.ok($(testElement.find('tbody > tr')[1]).find('td').eq(1).children().first().hasClass('dx-datagrid-group-closed'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 2: 2');
    assert.ok(!$(testElement.find('tbody > tr')[1]).find('td').last()[0].hasAttribute('colspan'));

    assert.ok(!$(testElement.find('tbody > tr')[2]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').length, 3);
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').first().html(), '&nbsp;');
    assert.equal($($(testElement.find('tbody > tr')[2]).find('td')[1]).html(), '&nbsp;');
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').last().text(), '3');
});

QUnit.test('Show grouped columns with continuation messages', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuation: true } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2], data: { isContinuationOnNextPage: true } }, { rowType: 'group', groupIndex: 2, isExpanded: false, values: [1, 2, 3], data: { isContinuation: true, isContinuationOnNextPage: true } }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }, { groupIndex: 2, caption: 'column 3', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }]),
        testElement = $('#container');

    this.options.grouping = {
        texts: {
            groupContinuesMessage: 'Continued on the next page',
            groupContinuedMessage: 'Continued from the previous page'
        }
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, 'rows count: 3 + 1 freespace row');

    assert.ok($(testElement.find('tbody > tr')[0]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').eq(0).attr('class'), 'dx-datagrid-group-space');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1: 1 (Continued from the previous page)');

    assert.ok($(testElement.find('tbody > tr')[1]).hasClass('dx-group-row'));
    assert.ok($(testElement.find('tbody > tr')[1]).find('td').eq(1).hasClass('dx-datagrid-group-space'));
    assert.ok($(testElement.find('tbody > tr')[1]).find('td').eq(1).children().first().hasClass('dx-datagrid-group-closed'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 2: 2 (Continued on the next page)');

    assert.ok($(testElement.find('tbody > tr')[2]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').eq(2).attr('class'), 'dx-datagrid-group-space');
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').last().text(), 'column 3: 3 (Continued from the previous page. Continued on the next page)');
});

// B251665
QUnit.test('Show grouped columns when virtual scrolling enabled', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } }],
        dataController = new MockDataController({ items: rows, virtualItemsCount: { begin: 10, end: 0 } }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }]),
        testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.ok(testElement.find('tbody > tr').eq(0).hasClass('dx-virtual-row'));
    assert.ok($(testElement.find('tbody > tr')[1]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').length, 2);
    assert.ok($(testElement.find('tbody > tr')[1]).find('td').first().hasClass('dx-datagrid-group-space'));
    assert.ok($(testElement.find('tbody > tr')[1]).find('td').first().children().first().hasClass('dx-datagrid-group-opened'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 1: 1');
});

// B254928
QUnit.test('Show grouped columns when infinite scrolling enabled', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true }]),
        testElement = $('#container');

    this.options.scrolling = {
        mode: 'infinite'
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.ok($(testElement.find('tbody > tr')[0]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').length, 2);
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').first().attr('class'), 'dx-datagrid-group-space');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1: 1');
});

QUnit.test('Group template', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true, items: [{}, {}] } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2], data: { items: [{}, {}, {}] } }, { rowType: 'data', values: ['', '', 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            command: 'expand',
            groupIndex: 0, caption: 'column 1', allowCollapsing: true,
            cellTemplate: expandCellTemplate,
            groupCellTemplate: function(container, options) {
                assert.equal(typeUtils.isRenderer(container), !!config().useJQuery, 'rowElement is correct');
                $('<div />')
                    .text(options.column.caption + ' - ' + options.text + ' (Count - ' + options.data.items.length + ')')
                    .appendTo(container);
            } }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }, {}]),
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    // assert
    assert.ok($(testElement.find('tbody > tr')[0]).find('td').eq(0).children().first().hasClass('dx-datagrid-group-opened'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1 - 1 (Count - 2)');

    assert.ok($(testElement.find('tbody > tr')[1]).find('td').eq(1).children().first().hasClass('dx-datagrid-group-closed'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 2: 2');
});

QUnit.test('Group template returns jQuery element', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true, items: [{}, {}] } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2], data: { items: [{}, {}, {}] } }, { rowType: 'data', values: ['', '', 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            command: 'expand',
            groupIndex: 0, caption: 'column 1', allowCollapsing: true,
            cellTemplate: expandCellTemplate,
            groupCellTemplate: function(container, options) {
                return $('<div />')
                    .text(options.column.caption + ' - ' + options.text + ' (Count - ' + options.data.items.length + ')');
            } }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }, {}]),
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    // assert
    assert.ok($(testElement.find('tbody > tr')[0]).find('td').eq(0).children().first().hasClass('dx-datagrid-group-opened'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1 - 1 (Count - 2)');

    assert.ok($(testElement.find('tbody > tr')[1]).find('td').eq(1).children().first().hasClass('dx-datagrid-group-closed'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 2: 2');
});

QUnit.test('Group template returns DOM-element', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true, items: [{}, {}] } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2], data: { items: [{}, {}, {}] } }, { rowType: 'data', values: ['', '', 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            command: 'expand',
            groupIndex: 0, caption: 'column 1', allowCollapsing: true,
            cellTemplate: expandCellTemplate,
            groupCellTemplate: function(container, options) {
                return ($('<div />')
                    .text(options.column.caption + ' - ' + options.text + ' (Count - ' + options.data.items.length + ')')).eq(0);
            } }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }, {}]),
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    // assert
    assert.ok($(testElement.find('tbody > tr')[0]).find('td').eq(0).children().first().hasClass('dx-datagrid-group-opened'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1 - 1 (Count - 2)');

    assert.ok($(testElement.find('tbody > tr')[1]).find('td').eq(1).children().first().hasClass('dx-datagrid-group-closed'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 2: 2');
});

QUnit.test('Show grouped columns when no allowCollapsing', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2] }, { values: ['', '', 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1' }, { groupIndex: 1, caption: 'column 2' }, {}]),
        testElement = $('#container');

    this.options.grouping = {
        texts: { groupContinuesMessage: 'Continued on the next page' }
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, 'rows count: 3 + 1 freespace row');

    assert.ok($(testElement.find('tbody > tr')[0]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').length, 2);
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').first().text(), '');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1: 1 (Continued on the next page)');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().attr('colspan'), 2);

    assert.ok($(testElement.find('tbody > tr')[1]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').length, 3);
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').first().text(), '');
    assert.equal($($(testElement.find('tbody > tr')[1]).find('td')[1]).text(), '');
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 2: 2');
    assert.ok(!$(testElement.find('tbody > tr')[1]).find('td').last()[0].hasAttribute('colspan'));

    assert.ok(!$(testElement.find('tbody > tr')[2]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').length, 3);
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').first().text(), '');
    assert.equal($($(testElement.find('tbody > tr')[2]).find('td')[1]).text(), '');
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').last().text(), '3');
});

QUnit.test('Show grouped columns with select column', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1] }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2] }, { values: ['', '', 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ command: 'select' }, { command: 'expand', type: 'groupExpand', groupIndex: 0, caption: 'column 1', allowCollapsing: true, cellTemplate: expandCellTemplate }, { command: 'expand', type: 'groupExpand', groupIndex: 1, caption: 'column 2', cellTemplate: expandCellTemplate }, {}]),
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, 'rows count: 3 + 1 freespace row');

    assert.ok($(testElement.find('tbody > tr')[0]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').length, 3);
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').eq(1).attr('class'), 'dx-datagrid-group-space dx-datagrid-expand dx-selection-disabled');
    assert.ok($(testElement.find('tbody > tr')[0]).find('td').eq(1).children().first().hasClass('dx-datagrid-group-opened'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1: 1');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().attr('colspan'), 2);

    assert.ok($(testElement.find('tbody > tr')[1]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').length, 4);
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').first().text(), '');
    assert.equal($($(testElement.find('tbody > tr')[1]).find('td')[2]).text(), '');
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 2: 2');
    assert.ok(!$(testElement.find('tbody > tr')[1]).find('td').last()[0].hasAttribute('colspan'));
});

QUnit.test('Show grouped columns with column command is empty', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1] }, { rowType: 'group', groupIndex: 1, isExpanded: true, values: [1, 2] }, { rowType: 'group', groupIndex: 2, isExpanded: true, values: [1, 2, 3] }, { values: [null, null, null, null] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true }, { groupIndex: 2, caption: 'column 3', allowCollapsing: true }, { command: 'empty' }]),
        testElement = $('#container');

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').length, 5, 'rows count: 4 + 1 freespace row');

    assert.ok($(testElement.find('tbody > tr')[0]).hasClass('dx-group-row'), 'has class dx-group-row');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').length, 2, 'count td');
    assert.strictEqual($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1: 1', 'group text');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().attr('colspan'), 3, 'colspan');

    assert.ok($(testElement.find('tbody > tr')[1]).hasClass('dx-group-row'), 'has class dx-group-row');
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').length, 3, 'count td');
    assert.strictEqual($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 2: 2', 'group text');
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().attr('colspan'), 2, 'colspan');

    assert.ok($(testElement.find('tbody > tr')[2]).hasClass('dx-group-row'), 'has class dx-group-row');
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').length, 4, 'count td');
    assert.strictEqual($(testElement.find('tbody > tr')[2]).find('td').last().text(), 'column 3: 3', 'group text');
    assert.ok(!$(testElement.find('tbody > tr')[2]).find('td').last()[0].hasAttribute('colspan'), 'colspan');

    assert.ok($(testElement.find('tbody > tr')[3]).hasClass('dx-row'), 'has class dx-row');
    assert.equal($(testElement.find('tbody > tr')[3]).find('td').length, 4, 'count td');
    assert.strictEqual($(testElement.find('tbody > tr')[3]).find('td').last().html(), '&nbsp;', 'row text');
});

// T125391
QUnit.test('groupContinuesMessage parameter for group template', function(assert) {
    // arrange
    var rows = [
            { rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true, items: [{}, {}] } },
            { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2], data: { items: [{}, {}, {}] } },
            { values: ['', '', 3] }
        ],
        groupContinuesMessage,
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{
            groupIndex: 0, caption: 'column 1', allowCollapsing: true,
            groupCellTemplate: function(container, options) {
                groupContinuesMessage = options.groupContinuesMessage;
            } }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true }, {}]),
        testElement = $('#container');

    this.options.grouping = {
        texts: { groupContinuesMessage: 'groupContinuesMessage' }
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(groupContinuesMessage, 'groupContinuesMessage');
});

// T125391
QUnit.test('groupContinuedMessage parameter for group template', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuation: true, items: [{}, {}] } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2], data: { items: [{}, {}, {}] } }, { values: ['', '', 3] }],
        dataController = new MockDataController({ items: rows }),
        passedGroupContinuedMessage,
        rowsView = this.createRowsView(rows, dataController, [{
            groupIndex: 0, caption: 'column 1', allowCollapsing: true,
            groupCellTemplate: function(container, options) {
                passedGroupContinuedMessage = options.groupContinuedMessage;
            } }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true }, {}]),
        testElement = $('#container');

    this.options.grouping = {
        // TODO: use sinon.js instead
        texts: { groupContinuedMessage: 'groupContinuedMessage' }
    };
    // act
    rowsView.render(testElement);

    // assert
    assert.equal(passedGroupContinuedMessage, 'groupContinuedMessage');
});

QUnit.test('Show master detail', function(assert) {
    // arrange
    var rows = [{ rowType: 'data', values: [true, 1] }, { rowType: 'detail', data: { detailInfo: 'Test Detail Information' } }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ command: 'expand', cellTemplate: gridCoreUtils.getExpandCellTemplate() }, {}]),
        testElement = $('#container');

    this.options.masterDetail = {
        enabled: true,
        template: function(container, options) {
            $(container).text(options.data.detailInfo);
        }
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').length, 3, 'rows count: 2 + 1 freespace row');

    assert.ok(!$(testElement.find('tbody > tr')[0]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').length, 2);
    assert.ok($(testElement.find('tbody > tr')[0]).find('td').eq(0).children().first().hasClass('dx-datagrid-group-opened'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').eq(1).text(), '1');

    assert.ok(!$(testElement.find('tbody > tr')[1]).hasClass('dx-group-row'));
    assert.ok($(testElement.find('tbody > tr')[1]).hasClass('dx-master-detail-row'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').length, 1);
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').first().text(), 'Test Detail Information');
});

QUnit.test('Detail grid render as delayed template', function(assert) {
    // arrange
    var rows = [{ rowType: 'data', values: [true, 1] }, { rowType: 'detail', data: { detailInfo: 'Test Detail Information' } }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ command: 'expand' }, {}]),
        testElement = $('#container'),
        counter = 0;

    this.options.masterDetail = {
        enabled: true,
        template: function(container) {
            $('<div>').appendTo(container).dxTabPanel({
                dataSource: [{
                    text: 'Names Details'
                }, {
                    text: 'Ziborov Details'
                }],
                itemRender: function(itemData, itemIndex, itemElement) {
                    if(itemIndex === 0) {
                        itemElement
                            .dxDataGrid({
                                columns: ['name'],
                                dataSource: {
                                    store: [{ name: 'Alex' }, { name: 'David' }]
                                }
                            });
                    }
                    if(itemIndex === 1) {
                        itemElement.html('Ziborov: Ziborov</br>Ziborov: Ziborov</br>Ziborov: Ziborov</br>Ziborov: Ziborov</br>');
                    }
                }
            });
        }
    };

    rowsView.renderDelayedTemplates = function() {
        if(this._delayedTemplates.length) {
            counter++;
        }
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.ok(counter > 0);
});

QUnit.test('_getRowElements return right set of elements when using masterDetail', function(assert) {
    // arrange
    var rows = [{ rowType: 'data', values: [true, 1] }, { rowType: 'detail', data: { detailInfo: 'Test Detail Information' } }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ command: 'expand' }, {}]),
        testElement = $('#container');

    this.options.masterDetail = {
        enabled: true,
        template: function(container, options) {
            $(container).dxDataGrid({
                loadingTimeout: 0,
                columns: ['name'],
                dataSource: [{ name: 'test1' }, { name: 'test2' }]
            });
        }
    };

    // act
    rowsView.render(testElement);

    this.clock.tick();

    // assert
    assert.equal(testElement.find('tbody > tr').length, 7, 'rows count: 2 main data rows + 1 main freespace row + 1 detail header row + 2 detail data rows + 1 detail freespace row');
    assert.equal(rowsView._getRowElements().length, 2, '2 rows only, without freespace row');
});

QUnit.test('Show grouped columns and master detail', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2] }, { rowType: 'data', values: [null, null, true, 3] }, { rowType: 'detail', data: { detailInfo: 'Test Detail Information' } }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true, command: 'expand', cellTemplate: expandCellTemplate }, { command: 'expand', cellTemplate: expandCellTemplate }, {}]),
        testElement = $('#container');

    this.options.grouping = {
        texts: { groupContinuesMessage: 'Continued on the next page' }
    };

    this.options.masterDetail = {
        enabled: true,
        template: function(container, options) {
            $(container).text(options.data.detailInfo);
        }
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').length, 5, 'rows count: 4 + 1 freespace row');

    assert.ok($(testElement.find('tbody > tr')[0]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').length, 2);
    assert.ok($(testElement.find('tbody > tr')[0]).find('td').first().children().first().hasClass('dx-datagrid-group-opened'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'column 1: 1 (Continued on the next page)');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().attr('colspan'), 3);

    assert.ok($(testElement.find('tbody > tr')[1]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').length, 3);
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').first().text(), '');
    assert.ok($(testElement.find('tbody > tr')[1]).find('td').eq(1).children().first().hasClass('dx-datagrid-group-closed'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().text(), 'column 2: 2');
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').last().attr('colspan'), 2);

    assert.ok(!$(testElement.find('tbody > tr')[2]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').length, 4);
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').first().html(), '&nbsp;');
    assert.equal($($(testElement.find('tbody > tr')[2]).find('td')[1]).html(), '&nbsp;');
    assert.ok($(testElement.find('tbody > tr')[2]).find('td').eq(2).children().first().hasClass('dx-datagrid-group-opened'));
    assert.equal($(testElement.find('tbody > tr')[2]).find('td').last().text(), '3');

    assert.ok(!$(testElement.find('tbody > tr')[3]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[3]).find('td').length, 1);
    assert.equal($(testElement.find('tbody > tr')[3]).find('td').first().text(), 'Test Detail Information');
});

QUnit.test('Change Row Expand for master detail on expand button click ', function(assert) {
    // arrange
    var rows = [{ rowType: 'data', key: 1, values: [false, 1] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ command: 'expand', cellTemplate: gridCoreUtils.getExpandCellTemplate() }, {}]),
        testElement = $('#container'),
        rowClickIndexes = [],
        changeRowExpandKey;

    this.options.masterDetail = {
        enabled: true
    };
    this.options.onRowClick = function(options) {
        rowClickIndexes.push(options.rowIndex);
    };

    rowsView.optionChanged({ name: 'onRowClick' });

    rowsView.render(testElement);

    var $expandCell = testElement.find('tbody > tr').eq(0).find('td').eq(0);

    assert.ok($expandCell.hasClass('dx-datagrid-expand'));
    assert.ok($expandCell.children().first().hasClass('dx-datagrid-group-closed'));

    this.dataGrid.dataController.getKeyByRowIndex = function(rowIndex) {
        return rows[rowIndex].key;
    };
    this.dataGrid.dataController.changeRowExpand = function(key) {
        changeRowExpandKey = key;
    };

    // act
    $($expandCell).trigger('dxclick');

    // assert
    assert.strictEqual(changeRowExpandKey, 1);
    // T185882
    assert.deepEqual(rowClickIndexes, [0]);
});

QUnit.test('Show master detail_T163510', function(assert) {
    // arrange
    var rows = [{ rowType: 'data', key: 1, values: [false, 1] }, {
            rowType: 'detail',
            data: { detailInfo: 'Test Detail Information' }
        }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ command: 'expand' }, {}]),
        $masterDetail,
        testElement = $('#container');

    this.options.masterDetail = {
        enabled: false
    };

    // act
    rowsView.render(testElement);
    $masterDetail = testElement.find('.dx-master-detail-cell');

    assert.equal($masterDetail.parent().children().length, 1, 'cells inside detail row');
    assert.equal($masterDetail.attr('colspan'), 2, 'colspan');
});

// T225735
QUnit.test('Show master detail with native checkbox', function(assert) {
    // arrange
    var rows = [{ rowType: 'data', values: [true, 1] }, { rowType: 'detail', data: { detailInfo: 'Test Detail Information' } }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ command: 'expand' }, {}]),
        testElement = $('#container'),
        rowClickArgs;

    this.options.onRowClick = function(e) {
        rowClickArgs = e;
    };

    rowsView.optionChanged({ name: 'onRowClick' });

    this.options.masterDetail = {
        enabled: true,
        template: function(container, options) {
            $(container).html('<div><input class="native-checkbox" type="checkbox" /></div>');
        }
    };

    rowsView.render(testElement);
    var $checkbox = testElement.find('.native-checkbox');

    assert.equal($checkbox.length, 1);

    // act
    $($checkbox).trigger('dxclick');

    // assert
    assert.ok(rowClickArgs, 'onRowClick called');
    assert.equal(rowClickArgs.event.isDefaultPrevented(), false, 'Default is not prevented');
});

QUnit.test('Show rowlines for master detail', function(assert) {
    // arrange
    var rows = [{ rowType: 'data', key: 1, values: [false, 1] }, {
            rowType: 'detail',
            data: { detailInfo: 'Test Detail Information' }
        }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ command: 'expand' }, {}]),
        $masterDetail,
        testElement = $('#container');

    this.options.showRowLines = true;
    this.options.masterDetail = {
        enabled: false
    };

    // act
    rowsView.render(testElement);
    $masterDetail = testElement.find('.dx-master-detail-cell');

    assert.ok($masterDetail.parent().hasClass('dx-row-lines'), 'add css class');
});

QUnit.test('Add class nowrap when wordWrapEnabled false', function(assert) {
    // arrange
    var rowsView = this.createRowsView([{ values: [1, 2, 3, 4, 5] }], null, [{ caption: 'Column 1', width: 30 }, { caption: 'Column 2', width: 50 }, { caption: 'Column 3', width: 73 },
            { caption: 'Column 4' }, { caption: 'Column 5', width: 91 }]),
        testElement = $('#container');

    this.options.wordWrapEnabled = false;
    // act
    rowsView.render(testElement);

    // assert
    assert.ok($('.dx-datagrid-rowsview').hasClass('dx-datagrid-nowrap'));
});

QUnit.test('Remove class nowrap when wordWrapEnabled true', function(assert) {
    // arrange
    var rowsView = this.createRowsView([{ values: [1, 2, 3, 4, 5] }], null, [{ caption: 'Column 1', width: 30 }, { caption: 'Column 2', width: 50 }, { caption: 'Column 3', width: 73 },
            { caption: 'Column 4' }, { caption: 'Column 5', width: 91 }]),
        testElement = $('#container');

    this.options.wordWrapEnabled = true;
    // act
    rowsView.render(testElement);

    // assert
    assert.ok(!$('.dx-datagrid-rowsview').hasClass('dx-datagrid-nowrap'));
});

QUnit.test('Set rows opacity', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        cells,
        testElement = $('#container');

    rowsView.render(testElement);

    // act
    rowsView.setRowsOpacity(1, 0.5);
    cells = getCells(testElement);

    // assert
    assert.equal(cells.eq(0).css('opacity'), 1, 'row 1 cell 2 opacity 1');
    assert.equal(cells.eq(1).css('opacity'), 0.5, 'row 1 cell 2 opacity 0.5');
    assert.equal(cells.eq(2).css('opacity'), 1, 'row 1 cell 2 opacity 1');

    assert.equal(cells.eq(3).css('opacity'), 1, 'row 1 cell 2 opacity 1');
    assert.equal(cells.eq(4).css('opacity'), 0.5, 'row 2 cell 2 opacity 0.5');
    assert.equal(cells.eq(5).css('opacity'), 1, 'row 1 cell 2 opacity 1');

    assert.equal(cells.eq(6).css('opacity'), 1, 'row 1 cell 2 opacity 1');
    assert.equal(cells.eq(7).css('opacity'), 0.5, 'row 3 cell 2 opacity 0.5');
    assert.equal(cells.eq(8).css('opacity'), 1, 'row 1 cell 2 opacity 1');
});

QUnit.test('Set rows opacity for band column', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, [
            [{ caption: 'Band column 1', index: 0, isBand: true }],
            [{ caption: 'Column 1', index: 1, ownerBand: 0 }, { caption: 'Column 2', index: 2, ownerBand: 0 }, { caption: 'Band column 2', index: 3, ownerBand: 0 }],
            [{ caption: 'Column 3', index: 4, ownerBand: 3 }],
            [{ caption: 'Column 1', index: 1, ownerBand: 0 }, { caption: 'Column 2', index: 2, ownerBand: 0 }, { caption: 'Column 3', index: 4, ownerBand: 3 }]
        ]),
        $cells,
        $testElement = $('#container');

    rowsView._columnsController.getColumns = function() {
        return [{ caption: 'Band column 1', index: 0, isBand: true }, { caption: 'Column 1', index: 1, ownerBand: 0 }, { caption: 'Column 2', index: 2, ownerBand: 0 }, { caption: 'Band column 2', index: 3, ownerBand: 0 }, { caption: 'Column 3', index: 4, ownerBand: 3 }];
    };
    rowsView.render($testElement);

    // act
    rowsView.setRowsOpacity(0, 0.5);
    $cells = getCells($testElement);

    // assert
    assert.equal($cells.eq(0).css('opacity'), 0.5, 'opacity of the first cell of the first row');
    assert.equal($cells.eq(1).css('opacity'), 0.5, 'opacity of the second cell of the first row');
    assert.equal($cells.eq(2).css('opacity'), 0.5, 'opacity of the third cell of the first row');
    assert.equal($cells.eq(3).css('opacity'), 0.5, 'opacity of the first cell of the second row');
    assert.equal($cells.eq(4).css('opacity'), 0.5, 'opacity of the second cell of the second row');
    assert.equal($cells.eq(5).css('opacity'), 0.5, 'opacity of the third cell of the second row');
    assert.equal($cells.eq(6).css('opacity'), 0.5, 'opacity of the first cell of the third row');
    assert.equal($cells.eq(7).css('opacity'), 0.5, 'opacity of the second cell of the third row');
    assert.equal($cells.eq(8).css('opacity'), 0.5, 'opacity of the third cell of the third row');
});

QUnit.test('Rows with option showColumnLines true', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        rows,
        testElement = $('#container');

    this.options.showColumnLines = true;

    // act
    rowsView.render(testElement);

    rows = rowsView._getRowElements();

    // assert
    assert.ok(rows.eq(0).hasClass('dx-column-lines'), 'has class dx-column-lines');
    assert.ok(rows.eq(1).hasClass('dx-column-lines'), 'has class dx-column-lines');
    assert.ok(rows.eq(2).hasClass('dx-column-lines'), 'has class dx-column-lines');
});

QUnit.test('Rows with option showColumnLines false', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        rows,
        testElement = $('#container');

    this.options.showColumnLines = false;

    // act
    rowsView.render(testElement);

    rows = rowsView._getRowElements();

    // assert
    assert.ok(!rows.eq(0).hasClass('dx-column-lines'), 'not has class dx-column-lines');
    assert.ok(!rows.eq(1).hasClass('dx-column-lines'), 'not has class dx-column-lines');
    assert.ok(!rows.eq(2).hasClass('dx-column-lines'), 'not has class dx-column-lines');
});

QUnit.test('Rows with option showRowLines true', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        rows,
        testElement = $('#container');

    this.options.showRowLines = true;

    // act
    rowsView.render(testElement);

    rows = rowsView._getRowElements();

    // assert
    assert.ok(rows.eq(0).hasClass('dx-row-lines'), 'has class dx-row-lines');
    assert.ok(rows.eq(1).hasClass('dx-row-lines'), 'has class dx-row-lines');
    assert.ok(rows.eq(2).hasClass('dx-row-lines'), 'has class dx-row-lines');
    assert.equal(testElement.find('.dx-last-row-border').length, 0);
});

QUnit.test('Rows with option showRowLines false', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        rows,
        testElement = $('#container');

    this.options.showRowLines = false;

    // act
    rowsView.render(testElement);

    rows = rowsView._getRowElements();

    // assert
    assert.ok(!rows.eq(0).hasClass('dx-row-lines'), 'not has class dx-row-lines');
    assert.ok(!rows.eq(1).hasClass('dx-row-lines'), 'not has class dx-row-lines');
    assert.ok(!rows.eq(2).hasClass('dx-row-lines'), 'not has class dx-row-lines');
});

QUnit.test('Rows with option rowAlternationEnabled true', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        rows,
        testElement = $('#container');

    this.options.rowAlternationEnabled = true;

    // act
    rowsView.render(testElement);

    rows = rowsView._getRowElements();

    // assert
    assert.ok(!rows.eq(0).hasClass('dx-row-alt'), 'not has class dx-row-alt');

    assert.ok(rows.eq(1).hasClass('dx-row-alt'), 'has class dx-row-alt');
    assert.ok(rows.eq(1).find('td').css('backgroundColor') !== 'rgba(0, 0, 0, 0)', 'background color row');

    assert.ok(!rows.eq(2).hasClass('dx-row-alt'), 'not has class dx-row-alt');
});

QUnit.test('Rows with option rowAlternationEnabled true when grouping', function(assert) {
    // arrange
    var items = [{
            rowType: 'group', groupIndex: 0, isExpanded: true, data: {
                items: [{ name: 'test', id: 2, date: new Date(2002, 1, 2) }, { name: 'test', id: 3, date: new Date(2003, 2, 3) }], key: 'test'
            }, values: ['test']
        },
        {
            data: { isContinuation: true, name: 'test', id: 2, date: new Date(2002, 1, 2) }, values: ['test', 2, '2/02/2002'], rowType: 'data', dataIndex: 0
        },
        {
            data: { isContinuation: true, name: 'test', id: 3, date: new Date(2003, 2, 3) }, values: ['test', 3, '3/03/2003'], rowType: 'data', dataIndex: 1
        }],
        rowsView = this.createRowsView(items, null, [{ dataField: 'name', caption: 'Name', groupIndex: 0 }, 'id', 'date']),
        rows,
        testElement = $('#container');

    this.options.rowAlternationEnabled = true;

    // act
    rowsView.render(testElement);

    rows = rowsView._getRowElements();

    // assert
    assert.ok(!rows.eq(0).hasClass('dx-row-alt'), 'not has class dx-row-alt');
    assert.ok(!rows.eq(1).hasClass('dx-row-alt'), 'not has class dx-row-alt');
    assert.ok(rows.eq(2).hasClass('dx-row-alt'), 'has class dx-row-alt');
    assert.ok(rows.eq(2).find('td').css('backgroundColor') !== 'rgba(0, 0, 0, 0)', 'background color row');
});

QUnit.test('Rows with option rowAlternationEnabled false', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        rows,
        testElement = $('#container');

    this.options.rowAlternationEnabled = false;

    // act
    rowsView.render(testElement);

    rows = rowsView._getRowElements();

    // assert
    assert.ok(!rows.eq(0).hasClass('dx-row-alt'), 'not has class dx-row-alt');
    assert.ok(!rows.eq(1).hasClass('dx-row-alt'), 'not has class dx-row-alt');
    assert.ok(!rows.eq(2).hasClass('dx-row-alt'), 'not has class dx-row-alt');
});

QUnit.test('Rows with option onCellPrepared', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        rows,
        testElement = $('#container'),
        resultCell,
        resultOptions,
        countCallCellPrepared = 0;

    this.options.onCellPrepared = function(options) {
        countCallCellPrepared++;
        if(options.rowIndex === 1 && options.columnIndex === 2) {
            resultCell = $(options.cellElement).addClass('TestCellPrepared');
            resultOptions = options;
        }
    };
    rowsView.init();

    // act
    rowsView.render(testElement);

    rows = rowsView._getRowElements();

    // assert
    assert.equal(this.dataGrid.__actionConfigs.onCellPrepared.category, 'rendering', 'onCellPrepared category');
    assert.equal(countCallCellPrepared, 9, 'countCallCellPrepared');
    assert.equal(resultOptions.rowIndex, 1, 'rowIndex');
    assert.equal(resultOptions.columnIndex, 2, 'columnIndex');
    assert.deepEqual(resultOptions.values, ['test2', 2, '2/02/2002'], 'values');
    assert.strictEqual(resultOptions.value, '2/02/2002', 'value');
    assert.strictEqual(resultOptions.text, '2/02/2002', 'text');
    assert.strictEqual(resultOptions.displayValue, '2/02/2002', 'displayValue');
    assert.deepEqual(resultOptions.data, { date: new Date(2002, 1, 2), id: 2, name: 'test2' }, 'data');
    assert.strictEqual(resultOptions.rowType, 'data', 'rowType');
    assert.deepEqual(resultOptions.column, { index: 2 }, 'column');
    assert.equal(resultOptions.resized, undefined, 'resized');

    assert.ok(resultCell.hasClass('TestCellPrepared'), 'has class TestCellPrepared customize column');

    // row 0
    assert.ok(!rows.eq(0).find('td').eq(0).hasClass('TestCellPrepared'), 'not has class TestCellPrepared column 0');
    assert.ok(!rows.eq(0).find('td').eq(1).hasClass('TestCellPrepared'), 'not has class TestCellPrepared column 1');
    assert.ok(!rows.eq(0).find('td').eq(2).hasClass('TestCellPrepared'), 'not has class TestCellPrepared column 2');

    // row 1
    assert.ok(!rows.eq(1).find('td').eq(0).hasClass('TestCellPrepared'), 'not has class TestCellPrepared column 0');
    assert.ok(!rows.eq(1).find('td').eq(1).hasClass('TestCellPrepared'), 'not has class TestCellPrepared column 1');
    assert.ok(rows.eq(1).find('td').eq(2).hasClass('TestCellPrepared'), 'has class TestCellPrepared column 2');

    // row 2
    assert.ok(!rows.eq(2).find('td').eq(0).hasClass('TestCellPrepared'), 'not has class TestCellPrepared column 0');
    assert.ok(!rows.eq(2).find('td').eq(1).hasClass('TestCellPrepared'), 'not has class TestCellPrepared column 1');
    assert.ok(!rows.eq(2).find('td').eq(2).hasClass('TestCellPrepared'), 'not has class TestCellPrepared column 2');
});

QUnit.test('onCellPrepared for group rows', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2] }, { rowType: 'data', values: [null, null, 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true, command: 'expand' }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true, command: 'expand' }, {}]),
        testElement = $('#container'),
        resultOptions,
        countCallCellPrepared = 0;

    this.options.onCellPrepared = function(options) {
        countCallCellPrepared++;

        if(options.rowIndex === 0 && options.rowType === 'group' && options.columnIndex === 0) {
            resultOptions = options;
        }
    };

    rowsView.init();

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(countCallCellPrepared, 8, 'countCallCellPrepared');
    assert.equal(resultOptions.rowIndex, 0, 'rowIndex');
    assert.equal(resultOptions.columnIndex, 0, 'columnIndex');
    assert.deepEqual(resultOptions.values, [1], 'values');
    assert.strictEqual(resultOptions.value, 1, 'value');
    assert.strictEqual(resultOptions.text, '1', 'text');
    assert.strictEqual(resultOptions.displayValue, 1, 'displayValue');
    assert.deepEqual(resultOptions.data, { isContinuationOnNextPage: true }, 'data');
    assert.strictEqual(resultOptions.rowType, 'group', 'rowType');
    assert.deepEqual(resultOptions.column, { groupIndex: 0, caption: 'column 1', allowCollapsing: true, command: null, width: null, colspan: 2, 'alignment': 'left', 'index': 0, 'cssClass': null, showWhenGrouped: false }, 'column');
});

QUnit.test('onCellPrepared for group rows (RTL)', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2] }, { rowType: 'data', values: [null, null, 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true, command: 'expand' }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true, command: 'expand' }, {}]),
        testElement = $('#container'),
        resultOptions,
        countCallCellPrepared = 0;

    this.options.rtlEnabled = true;
    this.options.onCellPrepared = function(options) {
        countCallCellPrepared++;

        if(options.rowIndex === 0 && options.rowType === 'group' && options.columnIndex === 0) {
            resultOptions = options;
        }
    };

    rowsView.init();

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(countCallCellPrepared, 8, 'countCallCellPrepared');
    assert.equal(resultOptions.rowIndex, 0, 'rowIndex');
    assert.equal(resultOptions.columnIndex, 0, 'columnIndex');
    assert.deepEqual(resultOptions.values, [1], 'values');
    assert.strictEqual(resultOptions.value, 1, 'value');
    assert.strictEqual(resultOptions.text, '1', 'text');
    assert.strictEqual(resultOptions.displayValue, 1, 'displayValue');
    assert.deepEqual(resultOptions.data, { isContinuationOnNextPage: true }, 'data');
    assert.strictEqual(resultOptions.rowType, 'group', 'rowType');
    assert.deepEqual(resultOptions.column, { groupIndex: 0, caption: 'column 1', allowCollapsing: true, command: null, width: null, colspan: 2, 'alignment': 'right', 'index': 0, 'cssClass': null, showWhenGrouped: false }, 'column');
});

QUnit.test('onCellPrepared for called for command columns', function(assert) {
    // arrange
    var rows = [{ rowType: 'data', values: [false, 'test1', 1, '1/01/2001'] }, { rowType: 'data', values: [true, 'test2', 2, '2/02/2002'] }, { rowType: 'data', values: [false, 'test3', 3, '3/03/2003'] }],
        dataController = new MockDataController({ items: rows, selection: { mode: 'multiple', showCheckBoxesMode: 'always' } }),
        rowsView = this.createRowsView(this.items, dataController, [{ command: 'select', dataType: 'boolean' }, {}, {}, {}]),
        rowsElements,
        testElement = $('#container'),
        checkBoxes,
        countCallCellPrepared = 0;

    this.options.onCellPrepared = function(options) {
        countCallCellPrepared++;
        if(options.rowIndex === 1 && options.columnIndex === 0) {
            $(options.cellElement).addClass('TestCellPrepared');
        }
    };
    rowsView.init();

    // act
    rowsView.render(testElement);
    rowsElements = rowsView._getRowElements();
    checkBoxes = testElement.find('.dx-checkbox');

    // assert
    assert.equal(countCallCellPrepared, 12, 'countCallCellPrepared');
    assert.equal(checkBoxes.length, 3, 'check boxs count');
    assert.equal(rowsElements.find('.TestCellPrepared').length, 1, 'has class TestCellPrepared column 0 row 1');
});

QUnit.test('Rows with option onCellPrepared for data rows', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2] }, { rowType: 'data', values: ['', '', 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true }, {}]),
        rowsElements,
        testElement = $('#container'),
        resultCell,
        countCallCellPrepared = 0;

    this.options.onCellPrepared = function(options) {
        countCallCellPrepared++;

        if(options.rowIndex === 1 && options.columnIndex === 0) {
            resultCell = $(options.cellElement).addClass('TestCellPrepared');
        }
    };
    rowsView.init();

    // act
    rowsView.render(testElement);
    rowsElements = rowsView._getRowElements();

    // assert
    assert.equal(countCallCellPrepared, 8, 'countCallCellPrepared');
    assert.ok(resultCell, 'resultCell');
    assert.ok(rowsElements.eq(1).find('td').eq(0).hasClass('TestCellPrepared'), 'has class TestCellPrepared column 0');
});

QUnit.test('Rows with option onRowPrepared', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        rows,
        testElement = $('#container'),
        resultRow,
        resultOptions,
        countCallRowPrepared = 0;

    this.options.onRowPrepared = function(options) {
        countCallRowPrepared++;
        if(options.rowIndex === 1) {
            resultRow = $(options.rowElement).find('td').addClass('TestRowPrepared');
            resultOptions = options;
        }
    };
    rowsView.init();

    // act
    rowsView.render(testElement);

    rows = rowsView._getRowElements();

    // assert
    assert.equal(this.dataGrid.__actionConfigs.onRowPrepared.category, 'rendering', 'onRowPrepared category');
    assert.equal(countCallRowPrepared, 3, 'countCallRowPrepared');
    assert.equal(typeUtils.isRenderer(resultOptions.rowElement), !!config().useJQuery, 'correct row element');
    assert.ok(dataUtils.data($(resultOptions.rowElement).get(0), 'options'), 'has row options');
    assert.equal(resultOptions.columns.length, 3, 'count columns');
    assert.equal(resultOptions.rowIndex, 1, 'rowIndex');
    assert.equal(resultOptions.dataIndex, 1, 'dataIndex');
    assert.deepEqual(resultOptions.values, ['test2', 2, '2/02/2002'], 'values');
    assert.deepEqual(resultOptions.data, { date: new Date(2002, 1, 2), id: 2, name: 'test2' }, 'data');
    assert.strictEqual(resultOptions.rowType, 'data', 'type');
    assert.ok(!resultOptions.isSelected, 'isSelected');

    assert.ok(resultRow.length, 'resultRow');

    // row 0
    assert.ok(!rows.eq(0).find('td').eq(0).hasClass('TestRowPrepared'), 'not has class TestRowPrepared column 0');
    assert.ok(!rows.eq(0).find('td').eq(1).hasClass('TestRowPrepared'), 'not has class TestRowPrepared column 1');
    assert.ok(!rows.eq(0).find('td').eq(2).hasClass('TestRowPrepared'), 'not has class TestRowPrepared column 2');

    // row 1
    assert.ok(rows.eq(1).find('td').eq(0).hasClass('TestRowPrepared'), 'has class TestRowPrepared column 0');
    assert.ok(rows.eq(1).find('td').eq(1).hasClass('TestRowPrepared'), 'has class TestRowPrepared column 1');
    assert.ok(rows.eq(1).find('td').eq(2).hasClass('TestRowPrepared'), 'has class TestRowPrepared column 2');

    // row 2
    assert.ok(!rows.eq(2).find('td').eq(0).hasClass('TestRowPrepared'), 'not has class TestRowPrepared column 0');
    assert.ok(!rows.eq(2).find('td').eq(1).hasClass('TestRowPrepared'), 'not has class TestRowPrepared column 1');
    assert.ok(!rows.eq(2).find('td').eq(2).hasClass('TestRowPrepared'), 'not has class TestRowPrepared column 2');
});

QUnit.test('onRowPrepared for group rows', function(assert) {
    // arrange
    var rows = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], data: { isContinuationOnNextPage: true } }, { rowType: 'group', groupIndex: 1, isExpanded: false, values: [1, 2] }, { rowType: 'data', values: [null, null, 3] }],
        dataController = new MockDataController({ items: rows }),
        rowsView = this.createRowsView(rows, dataController, [{ groupIndex: 0, caption: 'column 1', allowCollapsing: true, command: 'expand' }, { groupIndex: 1, caption: 'column 2', allowCollapsing: true, command: 'expand' }, {}]),
        testElement = $('#container'),
        resultOptions,
        countCallRowPrepared = 0;

    this.options.onRowPrepared = function(options) {
        countCallRowPrepared++;

        if(options.rowIndex === 0 && options.rowType === 'group') {
            resultOptions = options;
        }
    };

    rowsView.init();

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(countCallRowPrepared, 3, 'countCallCellPrepared');
    assert.ok(dataUtils.data($(resultOptions.rowElement).get(0), 'options'), 'has row options');
    assert.equal(resultOptions.rowIndex, 0, 'rowIndex');
    assert.equal(resultOptions.groupIndex, 0, 'columnIndex');
    assert.equal(resultOptions.columns.length, 3, 'columns');
    assert.deepEqual(resultOptions.values, [1], 'values');
    assert.deepEqual(resultOptions.data, { isContinuationOnNextPage: true }, 'data');
    assert.strictEqual(resultOptions.rowType, 'group', 'rowType');
    assert.ok(resultOptions.isExpanded, 'isExpanded');
});

QUnit.test('EncodeHtml is false for column', function(assert) {
    // arrange
    var items = [{ values: ['text', '<b><i>italic</i></b>'] }],
        rowsView = this.createRowsView(items, null, [{ caption: 'Column 1' }, { caption: 'Column 2', encodeHtml: false }]),
        $b,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    $b = testElement.find('.dx-row b');

    // assert
    assert.equal($b.length, 1);
    assert.equal($b.children(0).text(), 'italic');
});

QUnit.test('EncodeHtml is true for column', function(assert) {
    // arrange
    var items = [{ values: ['text', '<b><i>italic</i></b>'] }],
        rowsView = this.createRowsView(items, null, [{ caption: 'Column 1' }, { caption: 'Column 2', encodeHtml: true }]),
        $cells,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    $cells = testElement.find('.dx-row td');

    // assert
    assert.equal($cells.eq(1).text(), '<b><i>italic</i></b>');
});

QUnit.test('EncodeHtml is false for column with grouping', function(assert) {
    // arrange
    var items = [{ rowType: 'group', groupIndex: 0, values: ['<b><i>italic</i></b>', 'text2'] }],
        rowsView = this.createRowsView(items, null, [{ caption: 'Column 1', encodeHtml: false, groupIndex: 0 }, { caption: 'Column 2' }], true),
        $groupRow,
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    $groupRow = $('.' + 'dx-group-row');

    // assert
    assert.equal($groupRow.length, 1);
    assert.equal($groupRow.children(0).text(), 'Column 1: italic');
});

QUnit.test('Show summary items in a group row', function(assert) {
    // arrange
    var items = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], summaryCells: [
            [{
                column: 'Column1',
                summaryType: 'sum',
                value: 1,
                valueFormat: 'currency'
            }, {
                column: 'Column2',
                summaryType: 'count',
                value: 1,
                displayFormat: '{0}-Count'
            }, {
                column: 'Column2',
                columnCaption: 'Column 2',
                summaryType: 'count',
                value: 1
            }]
        ] }, { values: ['text', 'text2'] }],
        rowsView = this.createRowsView(items, null, [{ caption: 'Column 1', groupIndex: 0 }, { caption: 'Column 2' }], true),
        testElement = $('#container'),
        $groupRow;

    // act
    rowsView.render(testElement);
    $groupRow = $('.' + 'dx-group-row');

    assert.equal($groupRow.first().text(), 'Column 1: 1 (Sum: $1, 1-Count, Count: 1)');
});

QUnit.test('Show only one summary item in a group row', function(assert) {
    // arrange
    var items = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], summaryCells: [
            [{
                column: 'Column1',
                summaryType: 'sum',
                value: 1,
                customizeText: function(itemInfo) {
                    return 'Column1 ' + itemInfo.valueText;
                }
            }]
        ] }, { values: ['text', 'text2'] }],
        rowsView = this.createRowsView(items, null, [{ caption: 'Column 1', groupIndex: 0 }, { caption: 'Column 2' }], true),
        testElement = $('#container'),
        $groupRow;

    // act
    rowsView.render(testElement);
    $groupRow = $('.' + 'dx-group-row');

    assert.equal($groupRow.first().text(), 'Column 1: 1 (Column1 Sum: 1)');
});

QUnit.test('Show summary in a group row when alignByColumn', function(assert) {
    // arrange
    var items = [{
            rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], summaryCells: [
                [{
                    column: 'Column1',
                    summaryType: 'sum',
                    value: 1,
                    customizeText: function(itemInfo) {
                        return 'Column1 ' + itemInfo.valueText;
                    }
                }], [], [], [{
                    column: 'Column3',
                    summaryType: 'sum',
                    alignByColumn: true,
                    value: 100
                }]
            ]
        }, { values: ['text', 'text2'] }],
        rowsView = this.createRowsView(items, null, [{ command: 'expand', groupIndex: 0, caption: 'Column 1' }, {}, { caption: 'Column 2' }, { caption: 'Column 3' }], true),
        testElement = $('#container'),
        $groupRowCells;

    // act
    rowsView.render(testElement);
    $groupRowCells = $('.' + 'dx-group-row').first().children();

    assert.equal($groupRowCells.length, 3);
    assert.equal($groupRowCells.eq(1).text(), 'Column 1: 1 (Column1 Sum: 1)', 'group cell text');
    assert.equal($groupRowCells.eq(1).attr('colspan'), '2', 'group cell colspan');
    assert.equal($groupRowCells.eq(2).text(), 'Sum: 100', 'alignByColumn summary cell text');
});

QUnit.test('Show summary in a group row when two alignByColumn summary items', function(assert) {
    // arrange
    var items = [{
            rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], summaryCells: [
                [{
                    column: 'Column1',
                    summaryType: 'sum',
                    value: 1,
                    customizeText: function(itemInfo) {
                        return 'Column1 ' + itemInfo.valueText;
                    }
                }], [], [{
                    column: 'Column2',
                    summaryType: 'sum',
                    alignByColumn: true,
                    value: 50
                }], [{
                    column: 'Column3',
                    summaryType: 'sum',
                    alignByColumn: true,
                    value: 100
                }]
            ]
        }, { values: ['text', 'text2'] }],
        rowsView = this.createRowsView(items, null, [{ command: 'expand', groupIndex: 0, caption: 'Column 1' }, {}, { caption: 'Column 2' }, { caption: 'Column 3' }], true),
        testElement = $('#container'),
        $groupRowCells;

    // act
    rowsView.render(testElement);
    $groupRowCells = $('.' + 'dx-group-row').first().children();

    assert.equal($groupRowCells.length, 4);
    assert.equal($groupRowCells.eq(1).text(), 'Column 1: 1 (Column1 Sum: 1)', 'group cell text');
    assert.equal($groupRowCells.eq(1).attr('colspan'), '1', 'group cell colspan');
    assert.equal($groupRowCells.eq(2).text(), 'Sum: 50', 'alignByColumn summary cell 1 text');
    assert.equal($groupRowCells.eq(3).text(), 'Sum: 100', 'alignByColumn summary cell 2 text');
});

// T355321
QUnit.test('Show summary in a group row when two alignByColumn summary items and groupIndex is null for all non-grouped columns', function(assert) {
    // arrange
    var items = [{
            rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], summaryCells: [
                [{
                    column: 'Column1',
                    summaryType: 'sum',
                    value: 1,
                    customizeText: function(itemInfo) {
                        return 'Column1 ' + itemInfo.valueText;
                    }
                }], [], [{
                    column: 'Column2',
                    summaryType: 'sum',
                    alignByColumn: true,
                    value: 50
                }], [], [{
                    column: 'Column3',
                    summaryType: 'sum',
                    alignByColumn: true,
                    value: 100
                }]
            ]
        }, { values: ['text', 'text2'] }],
        rowsView = this.createRowsView(items, null, [{ command: 'expand', groupIndex: 0, caption: 'Column 1' }, {}, { groupIndex: null, caption: 'Column 2' }, { caption: 'Columns 3', groupIndex: null }, { groupIndex: null, caption: 'Column 4' }], true),
        testElement = $('#container'),
        $groupRowCells;

    // act
    rowsView.render(testElement);
    $groupRowCells = $('.' + 'dx-group-row').first().children();

    assert.equal($groupRowCells.length, 5);
    assert.equal($groupRowCells.eq(1).text(), 'Column 1: 1 (Column1 Sum: 1)', 'group cell text');
    assert.equal($groupRowCells.eq(1).attr('colspan'), '1', 'group cell colspan');
    assert.equal($groupRowCells.eq(2).text(), 'Sum: 50', 'alignByColumn summary cell 1 text');
    assert.equal($groupRowCells.eq(3).text(), '', 'summary cell 2 must be empty');
    assert.equal($groupRowCells.eq(4).text(), 'Sum: 100', 'alignByColumn summary cell 3 text');
});

QUnit.test('Summary items are not displayed in a group row', function(assert) {
    // arrange
    var items = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: [1], summaryCells: [] },
            { values: ['text', 'text2'] }],
        rowsView = this.createRowsView(items, null, [{ caption: 'Column 1', groupIndex: 0 }, { caption: 'Column 2' }], true),
        testElement = $('#container'),
        $groupRow;

    // act
    rowsView.render(testElement);
    $groupRow = $('.' + 'dx-group-row');

    assert.equal($groupRow.first().text(), 'Column 1: 1');
});

QUnit.test('Scroll to element by focus', function(assert) {
    // arrange
    var testElement = $('#container'),
        rowsView = this.createRowsView(this.items, null, null, null, {
            keyboardNavigation: {
                enabled: true
            },
            columnAutoWidth: true
        }),
        isScrollTo,
        keyboardNavigationController = this.dataGrid.keyboardNavigationController;

    rowsView.render(testElement);
    keyboardNavigationController._isNeedFocus = true;
    keyboardNavigationController._isNeedScroll = true;
    keyboardNavigationController._focusedView = rowsView;
    rowsView._scrollable.scrollToElement = function() {
        isScrollTo = true;
    };

    // act
    this.dataGrid.editorFactoryController.focus(testElement.find('.dx-data-row td').eq(0));
    this.clock.tick(1);

    // assert
    assert.ok(isScrollTo);
});

QUnit.test('Width of column in master detail are not changed when it is changed in parent', function(assert) {
    // arrange
    var that = this,
        rows = [{ rowType: 'data', values: [true, 1] }, { rowType: 'detail', data: { detailInfo: 'Test Detail Information' } }],
        dataController = new MockDataController({ items: rows }),
        rowsView = that.createRowsView(rows, dataController, [{ command: 'expand' }, {}]),
        $colgroup,
        $cols1,
        $cols2,
        testElement = $('#container'),
        detailDataGrid;

    that.options.masterDetail = {
        enabled: true,
        template: function($container) {
            var detailScope = { createRowsView: createRowsView };

            detailScope.createRowsView(rows, dataController, [{ command: 'expand' }, {}]).render($container);
            detailDataGrid = detailScope.dataGrid;
        }
    };

    // act
    rowsView.render(testElement);
    rowsView.setColumnWidths({ widths: [100, 100] });
    $colgroup = $(rowsView.element().find('colgroup'));
    $cols1 = $colgroup.eq(0).children();
    $cols2 = $colgroup.eq(1).children();

    // assert
    assert.equal($colgroup.length, 2);
    assert.equal($cols1[0].style.width, '100px', 'col1 of parent');
    assert.equal($cols1[1].style.width, '100px', 'col2 of parent');
    assert.equal($cols2[0].style.width, '', 'col1 of master');
    assert.equal($cols2[1].style.width, '', 'col2 of master');

    detailDataGrid.dispose();
});

QUnit.test('Invalidate instead of render for options', function(assert) {
    // arrange
    var renderCounter = 0,
        rowsView = this.createRowsView(this.items);

    rowsView.render($('#container'));
    rowsView.renderCompleted.add(function() {
        renderCounter++;
    });

    // act
    rowsView.component.isReady = function() {
        return true;
    };
    rowsView.beginUpdate();
    rowsView.optionChanged({ name: 'rowTemplate' });
    rowsView.optionChanged({ name: 'loadPanel' });
    rowsView.optionChanged({ name: 'rowTemplate' });
    rowsView.optionChanged({ name: 'loadPanel' });
    rowsView.endUpdate();

    // assert
    assert.equal(renderCounter, 1, 'count of rendering');
});

QUnit.test('Invalidate when data is loading', function(assert) {
    // arrange
    var renderCounter = 0,
        rowsView = this.createRowsView(this.items);

    rowsView.render($('#container'));
    rowsView.renderCompleted.add(function() {
        renderCounter++;
    });

    // act
    rowsView.component.isReady = function() {
        return false;
    };
    rowsView.beginUpdate();
    rowsView.optionChanged({ name: 'rowTemplate' });
    rowsView.optionChanged({ name: 'loadPanel' });
    rowsView.endUpdate();

    // assert
    assert.equal(renderCounter, 0, 'count of rendering');
});

QUnit.test('Call resize method when the rowTemplate option is changed', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items);

    rowsView.render($('#container'));

    // act
    rowsView.component.isReady = function() {
        return true;
    };
    rowsView.beginUpdate();
    rowsView.optionChanged({ name: 'rowTemplate' });
    rowsView.endUpdate();

    // assert
    assert.ok(rowsView.component._requireResize);
});

QUnit.test('Call resize method when the loadPanel option is changed', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items);

    rowsView.render($('#container'));

    // act
    rowsView.component.isReady = function() {
        return true;
    };
    rowsView.beginUpdate();
    rowsView.optionChanged({ name: 'loadPanel' });
    rowsView.endUpdate();

    // assert
    assert.ok(rowsView.component._requireResize);
});

// T349039
QUnit.test('Rows view (with wordWrapEnabled is true) in container with \'nowrap\' value of the white-space property', function(assert) {
    // arrange
    var $rowsViewElement,
        rowsView = this.createRowsView([{ values: [1, 2, 3, 4, 5] }], null, [{ caption: 'Column 1', width: 30 }, { caption: 'Column 2', width: 50 }, { caption: 'Column 3', width: 73 },
            { caption: 'Column 4' }, { caption: 'Column 5', width: 91 }]),
        $testElement = $('#container');

    this.options.wordWrapEnabled = true;
    $('.dx-datagrid').wrap($('<div/>').css('whiteSpace', 'nowrap'));

    // act
    rowsView.render($testElement);

    // assert
    $rowsViewElement = $(rowsView.element());
    assert.ok(!$rowsViewElement.hasClass('dx-datagrid-nowrap'));
    assert.strictEqual($rowsViewElement.find('tbody > tr').find('td').first().css('whiteSpace'), 'normal', 'value of the white-space property');
});

// T370318
QUnit.test('Render free space row with rowTemplate', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items),
        $tableElement,
        $testElement = $('#container');

    this.options.rowTemplate = function(container, options) {
        var data = options.data;
        $(container).append('<tbody><tr class=\'dx-row\'><td>' + data.name + '</td><td>' + data.id + '</td></tr></tbody>');
    };

    // act
    rowsView.render($testElement);

    // assert
    $tableElement = $testElement.find('table');

    // TODO is it necessary to remove our tbody? Maybe remove tbody if rowTemplate defined? Or if template define its own tbody - user must remove our tbody
    assert.equal($tableElement.children('tbody').length, 4, 'count tbody');
    assert.equal($tableElement.find('.dx-freespace-row').length, 1, 'count freespace row');
    assert.equal($tableElement.children('tbody').last().find('.dx-freespace-row').length, 1, 'has freespace row in last tbody element');
});

// T363929
QUnit.test('Calculate widths when there is only group rows', function(assert) {
    // arrange
    this.items = [
        { values: [], rowType: 'group', dataIndex: 0 },
        { values: [], rowType: 'group', dataIndex: 1 },
        { values: [], rowType: 'group', dataIndex: 2 }
    ];

    var rowsView = this.createRowsView(this.items, null, [{ allowCollapsing: true, cssClass: 'dx-command-expand', groupIndex: 0, command: 'expand' }, { width: 100 }, { width: 100 }]),
        $testElement = $('#container').width(230);

    // act
    rowsView.render($testElement);

    // assert
    assert.deepEqual(rowsView.getColumnWidths(), [30, 100, 100], 'calculate widths');
});

QUnit.test('GetRowsElements method is called once when opacity is applied to rows', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items);

    rowsView.render($('#container'));

    sinon.spy(rowsView, '_getRowElements');

    // act
    rowsView.setRowsOpacity(0, 0.01);

    // assert
    assert.ok(rowsView._getRowElements.calledOnce, 'GetRowsElements method should called once');
});

QUnit.test('loadPanel position correction if rowsView.height > window.height', function(assert) {
    // arrange
    var rowsView = this.createRowsView(this.items, null, null, null, { loadPanel: { enabled: true } }),
        $testElement = $('#container');

    // act
    rowsView.render($testElement);
    rowsView.height(10000);

    // assert
    var options = rowsView._loadPanel.option('position')();
    assert.deepEqual(options.of[0], window);
    // need when "grid.height > window.height" and grid places with vertical offset
    assert.deepEqual(options.boundary[0], $testElement.find('.dx-datagrid-rowsview')[0]);
    assert.deepEqual(options.collision, 'fit');
});

QUnit.module('Rows view with real dataController and columnController', {
    beforeEach: function() {
        this.items = [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 16 },
            { name: 'Vadim', age: 17 },
            { name: 'Dmitry', age: 18 },
            { name: 'Sergey', age: 18 },
            { name: 'Kate', age: 20 },
            { name: 'Dan', age: 21 }
        ];

        this.options = {
            columns: ['name', 'age'],
            dataSource: {
                asyncLoadEnabled: false,
                store: this.items
            },
            paging: {
                enabled: true,
                pageSize: 20
            },
            scrolling: {}
        };

        this.setupDataGridModules = function() {
            setupDataGridModules(this, ['data', 'columns', 'rows', 'grouping', 'virtualScrolling', 'pager', 'summary', 'masterDetail'], {
                initViews: true
            });
        };
    },
    afterEach: function() {
        this.dispose && this.dispose();
    }
});

QUnit.test('onCellHoverChanged event handling', function(assert) {
    // arrange
    var testElement = $('#container'),
        cells,
        onCellHoverChanged;

    this.options.dataSource = {
        asyncLoadEnabled: false,
        store: {
            type: 'array',
            data: this.items,
            key: 'name'
        }
    };

    this.options.onCellHoverChanged = function(options) {
        onCellHoverChanged = options;
    };

    this.setupDataGridModules();

    this.rowsView.render(testElement);
    cells = testElement.find('td');

    // act
    cells.eq(0).trigger('mouseover');

    // assert
    assert.deepEqual($(onCellHoverChanged.cellElement)[0], cells[0], 'Container');
    assert.ok(onCellHoverChanged.event, 'Event');
    assert.strictEqual(onCellHoverChanged.eventType, 'mouseover', 'eventType');
    assert.deepEqual(onCellHoverChanged.event.target, cells[0], 'Event.target');
    assert.strictEqual(onCellHoverChanged.key, 'Alex', 'key');
    assert.deepEqual(onCellHoverChanged.data, { 'age': 15, 'name': 'Alex' }, 'data');
    assert.deepEqual(onCellHoverChanged.column, this.columnsController.getVisibleColumns()[0], 'column');

    // act
    cells.eq(0).trigger('mouseout');

    // assert
    assert.strictEqual(onCellHoverChanged.eventType, 'mouseout', 'eventType');
});

QUnit.test('Touch click on cell should raise rowClick with correct target arguments (T593150)', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'The test is not actual for mobile devices');
        return;
    }

    var rowClickCount = 0,
        clock = sinon.useFakeTimers();

    this.options.dataSource.group = 'name';

    this.options.grouping = { autoExpandAll: true };

    this.options.onRowClick = function(e) {
        rowClickCount++;
        // assert
        assert.equal(e.event.target, $targetTouchCell[0]);
        assert.equal(e.event.currentTarget, $targetTouchCell.parent()[0]);
    };

    this.setupDataGridModules();

    var testElement = $('#container');

    this.rowsView.render(testElement);

    var $targetTouchCell = testElement.find('tbody > tr').eq(1).children().eq(1);
    var $targetClickCell = testElement.find('tbody > tr').eq(0).children().eq(1);

    // fix wrong clickEmitter prevented state after running another tests
    pointerMock($targetClickCell)
        .start()
        .down();

    // act
    nativePointerMock($targetTouchCell).start().touchStart().touchEnd();
    nativePointerMock($targetClickCell).start().click(true);

    clock.tick();

    // assert
    assert.equal(rowClickCount, 1);

    clock.restore();
});

QUnit.testInActiveWindow('ScrollToPage when virtual scrolling mode', function(assert) {
    // arrange
    var done = assert.async();
    var testElement = $('#container');

    this.options.scrolling.mode = 'virtual';
    this.options.scrolling.useNative = true;

    this.options.paging.pageSize = 3;

    this.setupDataGridModules();

    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.rowsView.resize();

    var that = this;

    this.rowsView.scrollChanged.add(function(e) {
        assert.equal(e.top, Math.floor(that.rowsView._rowHeight * 3), 'scroll position');
        done();
    });

    // act
    this.rowsView.scrollToPage(1);
});

QUnit.test('set pageIndex scroll content when virtual scrolling mode', function(assert) {
    // arrange
    var done = assert.async();
    var testElement = $('#container');


    this.options.scrolling.mode = 'virtual';
    this.options.scrolling.useNative = true;

    this.options.paging.pageSize = 3;

    this.setupDataGridModules();

    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.rowsView.resize();

    var that = this;

    this.rowsView.scrollChanged.add(function(e) {
        assert.equal(e.top, Math.floor(that.rowsView._rowHeight * 3), 'scroll position');
        done();
    });

    // act
    this.dataController.pageIndex(1);
});

// T356666
QUnit.test('None-zero initial pageIndex when virtual scrolling mode', function(assert) {
    // arrange
    var done = assert.async();
    var testElement = $('#container');


    this.options.scrolling.mode = 'virtual';
    this.options.scrolling.useNative = true;

    this.options.paging.pageSize = 3;
    this.options.paging.pageIndex = 1;

    this.setupDataGridModules();

    var that = this;

    this.rowsView.scrollChanged.add(function(e) {
        assert.equal(e.top, Math.floor(that.rowsView._rowHeight * 3), 'scroll position');
        done();
    });

    // act
    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.rowsView.resize();
});

// B254955
QUnit.test('set pageSize scroll content when virtual scrolling mode', function(assert) {
    // arrange
    var done = assert.async();
    var testElement = $('#container');

    this.options.scrolling.mode = 'virtual';
    this.options.scrolling.useNative = true;

    this.options.paging.pageSize = 3;

    this.setupDataGridModules();

    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.rowsView.resize();

    this.rowsView.scrollTo({ y: 10, x: 0 });


    this.rowsView.scrollChanged.add(function(e) {
        // assert
        assert.strictEqual(e.top, 0, 'scroll position after change pageSize');
        done();
    });

    // act
    this.dataController.pageSize(2);
});

QUnit.test('reset scroll position on set pageIndex when standard scrolling mode', function(assert) {
    // arrange
    var done = assert.async();
    var testElement = $('#container');


    this.options.scrolling.useNative = true;

    this.options.paging.pageSize = 3;

    this.setupDataGridModules();

    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.rowsView.resize();

    var that = this;
    var scrollOffsetChangedCallCount = 0;

    this.rowsView.scrollChanged.add(function(e) {
        scrollOffsetChangedCallCount++;
        if(scrollOffsetChangedCallCount === 1) {
            assert.equal(e.top, 5, 'scroll position');
            setTimeout(function() {
                // act
                that.dataController.pageIndex(1);
            });
        } else {
            assert.equal(scrollOffsetChangedCallCount, 2, 'scrollChanged Call Count');
            assert.equal(e.top, 0, 'scroll position is 0');
            done();
        }
    });

    this.rowsView.scrollTo(5);
});

QUnit.test('ScrollToPage when standard scrolling mode reset position to 0', function(assert) {
    // arrange
    var done = assert.async();
    var testElement = $('#container');


    this.options.scrolling.useNative = true;

    this.setupDataGridModules();

    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.rowsView.resize();

    var that = this;
    var scrollOffsetChangedCallCount = 0;

    this.rowsView.scrollChanged.add(function(e) {
        scrollOffsetChangedCallCount++;
        if(scrollOffsetChangedCallCount === 1) {
            assert.equal(e.top, 5, 'scroll position');
            setTimeout(function() {
                // act
                that.rowsView.scrollToPage(1);
            });
        } else {
            assert.equal(scrollOffsetChangedCallCount, 2, 'scrollChanged Call Count');
            assert.equal(e.top, 0, 'scroll position is 0');
            done();
        }
    });

    this.rowsView.scrollTo(5);
});

// T225097
QUnit.test('Scroll position is not reset on change dataSource', function(assert) {
    // arrange
    var done = assert.async();
    var testElement = $('#container');


    this.options.columns = ['name', 'age'];

    this.setupDataGridModules();

    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.rowsView.resize();

    var that = this;
    var scrollOffsetChangedCallCount = 0;

    this.rowsView.scrollChanged.add(function(e) {
        scrollOffsetChangedCallCount++;
        if(scrollOffsetChangedCallCount === 1) {
            assert.ok(e.top > 0, 'scroll position more 0');
            that.dataController.optionChanged({ name: 'dataSource' });
        } else {
            assert.equal(scrollOffsetChangedCallCount, 2, 'scrollChanged Call Count');
            assert.equal(e.top, 150, 'scroll position is 150');
            assert.equal(that.dataController.pageIndex(), 0, 'current pageIndex');
            done();
        }
    });

    // act
    this.rowsView.scrollTo({ y: 150 });
});

// T225097, T290984
QUnit.test('Scroll position is not reset on change dataSource when virtual scrolling enabled', function(assert) {
    // arrange
    var done = assert.async();
    var testElement = $('#container');


    this.options.scrolling.mode = 'virtual';
    this.options.scrolling.useNative = true;
    this.options.paging.pageSize = 3;

    this.options.columns = ['name', 'age'];

    this.setupDataGridModules();

    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.dataController.getVirtualContentSize = function() {
        return 1000;
    };
    this.rowsView.resize();
    var that = this;
    this.dataController.changed.add(function() {
        that.rowsView.resize();
    });

    var scrollOffsetChangedCallCount = 0;

    this.rowsView.scrollChanged.add(function(e) {
        scrollOffsetChangedCallCount++;
        if(scrollOffsetChangedCallCount === 1) {
            assert.ok(e.top > 0, 'scroll position more 0');
            setTimeout(function() {
                that.dataController.optionChanged({ name: 'dataSource' });
            });
        } else {
            assert.equal(scrollOffsetChangedCallCount, 2, 'scrollChanged Call Count');
            assert.equal(e.top, 150, 'scroll position is 150');
            assert.equal(that.dataController.pageIndex(), 1, 'current pageIndex');
            done();
        }
    });

    // act
    this.rowsView.scrollTo({ y: 150 });
});

QUnit.test('Reset scroll position on change filter when virtual scrolling enabled', function(assert) {
    // arrange
    var done = assert.async();
    var testElement = $('#container');


    this.options.scrolling.mode = 'virtual';
    this.options.scrolling.useNative = true;

    this.options.paging.pageSize = 3;

    this.setupDataGridModules();

    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.rowsView.resize();

    var that = this;
    var scrollOffsetChangedCallCount = 0;

    var scrollTop;
    var timeoutID;
    this.rowsView.scrollChanged.add(function(e) {
        scrollOffsetChangedCallCount++;
        if(scrollOffsetChangedCallCount === 1) {
            assert.ok(e.top > 0, 'scroll position more 0');
            setTimeout(function() {
                that.dataController.filter(['age', '>', 10]);
            });
        } else {
            scrollTop = e.top;
            timeoutID = timeoutID || setTimeout(function() {
                assert.equal(scrollTop, 0, 'scroll position is 0');
                done();
            });
        }
    });

    // act
    this.rowsView.scrollTo({ y: 100 });
});

QUnit.test('click expand/collapse group', function(assert) {
    var rowClickArgs;
    this.options.columns = [{ dataField: 'name', groupIndex: 0, allowCollapsing: true }, 'age'];
    this.options.onRowClick = function(e) {
        rowClickArgs = e;
    };
    this.setupDataGridModules();
    // arrange
    var that = this,
        values,
        testElement = $('#container');

    that.dataController.changeRowExpand = function(path) {
        values = path;
    };

    that.rowsView.render(testElement);

    // assert
    var $groupCell = testElement.find('.' + 'dx-datagrid-group-closed').first();
    assert.ok($groupCell.length, 'group cell exist');

    // act
    $($groupCell).trigger('dxclick');

    // assert
    assert.ok(rowClickArgs, 'rowClick called');
    // T224173
    assert.ok(rowClickArgs.handled, 'rowClick handled by grid');
    assert.deepEqual(values, ['Alex'], 'changeRowExpand path');
});

QUnit.test('click expand/collapse group row if expandMode is rowClick', function(assert) {
    var rowClickArgs;
    this.options.columns = [{ dataField: 'name', groupIndex: 0, allowCollapsing: true }, 'age'];
    this.options.onRowClick = function(e) {
        rowClickArgs = e;
    };
    this.options.grouping = {
        expandMode: 'rowClick'
    };

    this.setupDataGridModules();
    // arrange
    var that = this,
        values,
        testElement = $('#container');

    that.dataController.changeRowExpand = function(path) {
        values = path;
    };

    that.rowsView.render(testElement);

    // assert
    var $groupRow = testElement.find('.' + 'dx-group-row').first();
    assert.ok($groupRow.length, 'group cell exist');

    // act
    $($groupRow).trigger('dxclick');

    // assert
    assert.ok(rowClickArgs, 'rowClick called');
    assert.ok(rowClickArgs.handled, 'rowClick handled by grid');
    assert.deepEqual(values, ['Alex'], 'changeRowExpand path');
});

// T734376
QUnit.test('click expand/collapse group row if expandMode is rowClick and allowCollapsing is false', function(assert) {
    var rowClickArgs;
    this.options.columns = [{ dataField: 'name', groupIndex: 0, allowCollapsing: false }, 'age'];
    this.options.onRowClick = function(e) {
        rowClickArgs = e;
    };
    this.options.grouping = {
        expandMode: 'rowClick'
    };

    this.setupDataGridModules();
    // arrange
    var that = this,
        expandPath,
        testElement = $('#container');

    that.dataController.changeRowExpand = function(path) {
        expandPath = path;
    };

    that.rowsView.render(testElement);

    // assert
    var $groupRow = testElement.find('.' + 'dx-group-row').first();
    assert.ok($groupRow.length, 'group cell exist');

    // act
    $($groupRow).trigger('dxclick');

    // assert
    assert.ok(rowClickArgs, 'rowClick is called');
    assert.strictEqual(expandPath, undefined, 'changeRowExpand is not called');
});

// B254492
QUnit.test('free space row height when dataGrid without height and pageCount = 1', function(assert) {
    this.setupDataGridModules();
    // arrange
    var that = this,
        testElement = $('#container');

    that.rowsView.render(testElement);
    that.rowsView.resize();

    // assert
    assert.ok(!that.rowsView._hasHeight, 'not has height');
    assert.ok(that.rowsView._rowHeight > 0, 'row height > 0');
    assert.equal(that.rowsView._getFreeSpaceRowElements().height(), 0, 'height free space row');
});

// B254492
QUnit.test('free space row height for last page when dataGrid without height and pageCount > 1', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container');

    that.options.columns = ['name', 'age'];
    that.options.paging.pageSize = 3;
    that.options.paging.pageIndex = 2;
    that.setupDataGridModules();


    that.rowsView.render(testElement);

    that.dataController.pageSize(3);
    that.dataController.pageIndex(2);
    that.rowsView.resize();

    // assert
    assert.equal(that.dataController.pageCount(), 3, 'page count = 3');
    assert.ok(!that.rowsView._hasHeight, 'not has height');
    assert.ok(that.rowsView._rowHeight > 0, 'row height > 0');
    assert.equal(Math.round(that.rowsView._getFreeSpaceRowElements().height()), Math.round(that.rowsView._rowHeight * 2), 'height free space row');
});

// T142464
QUnit.test('free space row height for last page when dataGrid without height and pageCount > 1 when virtual scrolling mode', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container');

    that.options.columns = ['name', 'age'];
    that.options.scrolling = { mode: 'virtual' };
    that.options.paging.pageSize = 3;
    that.options.paging.pageIndex = 2;
    that.setupDataGridModules();


    that.rowsView.render(testElement);

    that.dataController.pageSize(3);
    that.dataController.pageIndex(2);
    that.rowsView.resize();

    // assert
    assert.equal(that.dataController.pageCount(), 3, 'page count = 3');
    assert.ok(!that.rowsView._hasHeight, 'not has height');
    assert.ok(that.rowsView._rowHeight > 0, 'row height > 0');
    assert.equal(that.rowsView._getFreeSpaceRowElements().height(), 0, 'no height free space row');
});

// B254901
QUnit.test('not height free space row for last page when dataGrid with height and pageCount > 1', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container');

    that.options.paging.pageIndex = 2;
    that.options.paging.pageSize = 4;

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);
    that.rowsView.height(70);
    that.rowsView.resize();

    // assert
    assert.ok(that.rowsView._hasHeight, 'has height');
    assert.ok(that.rowsView._rowHeight > 0, 'row height > 0');
    assert.equal(that.rowsView._getFreeSpaceRowElements().height(), 0, 'height free space row');
});

QUnit.test('Rows with cssClass', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container').height(600),
        rows,
        freeSpaceRow;

    that.options.columns = [{ dataField: 'name', cssClass: 'customCssClass' }, 'age'];

    that.options.dataSource.store = [
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 16 },
        { name: 'Vadim', age: 17 }
    ];

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);

    rows = that.rowsView._getRowElements();

    // assert
    assert.equal(rows.length, 3, 'count rows');
    assert.ok(rows.first().find('td').first().hasClass('customCssClass'), 'has class customCssClass');
    assert.ok(!rows.first().find('td').last().hasClass('customCssClass'), 'not has class customCssClass');

    assert.ok(rows.eq(1).find('td').first().hasClass('customCssClass'), 'has class customCssClass');
    assert.ok(!rows.eq(1).find('td').last().hasClass('customCssClass'), 'not has class customCssClass');

    assert.ok(rows.eq(2).find('td').first().hasClass('customCssClass'), 'has class customCssClass');
    assert.ok(!rows.eq(2).find('td').last().hasClass('customCssClass'), 'not has class customCssClass');

    // B254956
    freeSpaceRow = testElement.find('.dx-datagrid-rowsview').first().find('.dx-freespace-row');
    assert.ok(freeSpaceRow.length, 'free space row');
    assert.ok(freeSpaceRow.find('td').first().hasClass('customCssClass'), 'has class customCssClass');
    assert.ok(!freeSpaceRow.find('td').last().hasClass('customCssClass'), 'not has class customCssClass');
});

// T821255
QUnit.test('Rows with cssClass for grouped column with showWhenGrouped', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container');

    that.options.columns = [{ dataField: 'name', cssClass: 'customCssClass', groupIndex: 0, showWhenGrouped: true }, 'age'];

    that.options.grouping = { autoExpandAll: true };
    that.options.dataSource.store = [
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 16 },
        { name: 'Vadim', age: 17 }
    ];

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);

    var rows = that.rowsView._getRowElements();

    // assert
    assert.equal(rows.eq(0).find('td').length, 2, 'cell count in group row');
    assert.strictEqual(rows.eq(0).find('.customCssClass').length, 0, 'no cells with customCssClass in group row');

    assert.equal(rows.eq(1).find('td').length, 3, 'cell count in data row');
    assert.ok(!rows.eq(1).find('td').eq(0).hasClass('customCssClass'), 'groupExpand column not has class customCssClass');
    assert.ok(rows.eq(1).find('td').eq(1).hasClass('customCssClass'), 'first data column has class customCssClass');
    assert.ok(!rows.eq(1).find('td').eq(2).hasClass('customCssClass'), 'second data column not has class customCssClass');
});

QUnit.test('Add class dx-data-row on rows with type data', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container'),
        rows;

    that.options.columns = [{ dataField: 'name', groupIndex: 0, autoExpandGroup: true }, 'age'];

    that.options.dataSource.store = [
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 16 },
        { name: 'Vadim', age: 17 }
    ];

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);

    rows = that.rowsView._getRowElements();

    // assert
    assert.equal(rows.length, 6, 'count rows');
    assert.ok(!rows.eq(0).hasClass('dx-data-row'), 'not has class dx-data-row');
    assert.ok(rows.eq(1).hasClass('dx-data-row'), 'has class dx-data-row');
    assert.ok(!rows.eq(2).hasClass('dx-data-row'), 'not has class dx-data-row');
    assert.ok(rows.eq(3).hasClass('dx-data-row'), 'has class dx-data-row');
    assert.ok(!rows.eq(4).hasClass('dx-data-row'), 'not has class dx-data-row');
    assert.ok(rows.eq(5).hasClass('dx-data-row'), 'has class dx-data-row');
});

// T355291
QUnit.test('Render groups when calculateDisplayValue is used', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container'),
        rows;

    that.options.columns = [{ dataField: 'name', groupIndex: 0, autoExpandGroup: false, calculateDisplayValue: function(data) { return data.name + ' ' + data.age; } }, 'age'];

    that.options.dataSource.store = [
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 16 },
        { name: 'Vadim', age: 17 }
    ];

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);

    rows = that.rowsView._getRowElements();

    // assert
    assert.equal(rows.length, 3, 'count rows');
    assert.equal(rows.eq(0).children().eq(1).text(), 'Name: Alex 15', 'group row text');
});

// T355291
QUnit.test('Render groups when calculateDisplayValue as string is used', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container'),
        rows;

    that.options.columns = [{ dataField: 'name', groupIndex: 0, autoExpandGroup: false, calculateDisplayValue: 'fullName' }, 'age'];

    that.options.dataSource.store = [
        { name: 'Alex', age: 15, fullName: 'Alex Full' },
        { name: 'Dan', age: 16, fullName: 'Dan Full' },
        { name: 'Vadim', age: 17, fullName: 'Vadim Full' }
    ];

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);

    rows = that.rowsView._getRowElements();

    // assert
    assert.equal(rows.length, 3, 'count rows');
    assert.equal(rows.eq(0).children().eq(1).text(), 'Name: Alex Full', 'group row text');
});

QUnit.test('Render groups when lookup is used', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container'),
        rows;

    that.options.columns = [{
        dataField: 'name', groupIndex: 0, autoExpandGroup: false, lookup: {
            dataSource: [
                { id: 'Alex', name: 'Alex Full' },
                { id: 'Dan', name: 'Dan Full' },
                { id: 'Vadim', name: 'Vadim Full' }],
            valueExpr: 'id',
            displayExpr: 'name'
        }
    }, 'age'];

    that.options.dataSource.store = [
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 16 },
        { name: 'Vadim', age: 17 }
    ];

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);

    rows = that.rowsView._getRowElements();

    // assert
    assert.equal(rows.length, 3, 'count rows');
    assert.equal(rows.eq(0).children().eq(1).text(), 'Name: Alex Full', 'group row text');
});

QUnit.test('Customize columns', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container'),
        rows;

    that.options.columns = ['name', 'age'];

    that.options.dataSource.store = [
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 16 },
        { name: 'Vadim', age: 17 }
    ];

    that.options.customizeColumns = function(columns) {
        columns.push({
            caption: 'Test',
            calculateCellValue: function(data) {
                return data.age > 15;
            },
            dataType: 'boolean'
        });
    };

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);

    rows = that.rowsView._getRowElements();

    // assert
    assert.equal(rows.length, 3, 'count rows');
    assert.strictEqual(rows.eq(0).find('td').last().text(), 'false', 'text customize column');
    assert.strictEqual(rows.eq(1).find('td').last().text(), 'true', 'text customize column');
    assert.strictEqual(rows.eq(2).find('td').last().text(), 'true', 'text customize column');
});

QUnit.test('Customize columns with virtual scrolling', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container'),
        $colGroups,
        $cols;

    that.options.columns = ['name', 'age', 'cash'];
    that.options.scrolling = {
        mode: 'virtual'
    };

    that.options.dataSource.store = [
        { name: 'Alex', age: 15, cash: 10 },
        { name: 'Dan', age: 16, cash: 101 },
        { name: 'Vadim', age: 17, cash: 102 }
    ];

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);

    that.options.customizeColumns = function(columns) {
        columns[0].width = 13;
    };

    that.columnsController._customizeColumns(that.columnsController._columns);
    that.rowsView._contentHeight = 0;
    that.rowsView.render();

    $colGroups = $('colgroup');
    $cols = $colGroups.eq(0).find('col');

    // assert
    assert.equal($cols[0].style.width, '13px', 'colgroup2 col 1');
    assert.equal($cols[1].style.width, '', 'colgroup2 col 2');
    assert.equal($cols[2].style.width, '', 'colgroup2 col 3');
});

QUnit.test('Customize columns with customize trueText and falseText', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container'),
        rows;

    that.options.columns = ['name', 'age'];

    that.options.dataSource.store = [
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 16 },
        { name: 'Vadim', age: 17 }
    ];

    that.options.customizeColumns = function(columns) {
        columns.push({
            caption: 'Test',
            calculateCellValue: function(data) {
                return data.age > 15;
            },
            dataType: 'boolean',
            falseText: 'falseTest',
            trueText: 'trueTest'
        });
    };

    this.setupDataGridModules();

    // act
    that.rowsView.render(testElement);

    rows = that.rowsView._getRowElements();

    // assert
    assert.equal(rows.length, 3, 'count rows');
    assert.strictEqual(rows.eq(0).find('td').last().text(), 'falseTest', 'text customize column');
    assert.strictEqual(rows.eq(1).find('td').last().text(), 'trueTest', 'text customize column');
    assert.strictEqual(rows.eq(2).find('td').last().text(), 'trueTest', 'text customize column');
});

QUnit.test('Customize text is not called when command column is rendered', function(assert) {
    // arrange
    var values = [],
        testElement = $('#container');

    this.options.grouping = { autoExpandAll: true };
    this.options.masterDetail = { enabled: true, template: commonUtils.noop };
    this.options.columns = ['name', {
        dataField: 'age',
        groupIndex: 0,
        customizeText: function(cellInfo) {
            values.push(cellInfo.value);
            return cellInfo.valueText;
        }
    }];

    this.setupDataGridModules();

    // act
    this.rowsView.render(testElement);

    // assert
    assert.deepEqual(values, [15, 16, 17, 18, 20, 21]);
});

// T199951
QUnit.test('Render one time the master detail when expanded/collapsed item', function(assert) {
    // arrange
    var countCallTemplate = 0,
        testElement = $('#container');

    this.options.masterDetail = {
        enabled: true,
        template: function(container) {
            countCallTemplate++;

            $('<div/>')
                .text('Test')
                .appendTo(container);
        },
        autoExpandAll: false
    };

    this.setupDataGridModules();

    // act
    this.rowsView.render(testElement);

    function getRowElement(index) {
        return $(testElement.find('.dx-row')[index]);
    }

    // assert
    assert.ok(!getRowElement(1).hasClass('dx-master-detail-row'), 'not have master detail row');
    assert.equal(countCallTemplate, 0, 'call template');

    // act
    $('.dx-datagrid-expand').first().trigger('dxclick'); // expanded

    // assert
    assert.ok(getRowElement(1).hasClass('dx-master-detail-row'), 'have master detail row');
    assert.ok(getRowElement(1).is(':visible'), 'visible master detail row');
    assert.strictEqual(getRowElement(1).children().first().text(), 'Test', 'text master detail row');
    assert.equal(countCallTemplate, 1, 'call template');

    // act
    $('.dx-datagrid-expand').first().trigger('dxclick'); // collapsed

    // assert
    assert.ok(getRowElement(1).hasClass('dx-master-detail-row'), 'have master detail row');
    assert.ok(!getRowElement(1).is(':visible'), 'not visible master detail row');

    $('.dx-datagrid-expand').first().trigger('dxclick'); // expanded

    // assert
    assert.ok(getRowElement(1).hasClass('dx-master-detail-row'), 'have master detail row');
    assert.ok(getRowElement(1).is(':visible'), 'visible master detail row');
    assert.strictEqual(getRowElement(1).children().first().text(), 'Test', 'text master detail row');
    assert.equal(countCallTemplate, 1, 'not call template');
});

// T492174
QUnit.test('Master detail row template should not be rerendered after expand previous row', function(assert) {
    // arrange
    var countCallTemplate = 0,
        $testElement = $('#container');

    this.options.masterDetail = {
        enabled: true,
        template: function(container) {
            countCallTemplate++;
        },
        autoExpandAll: false
    };

    this.setupDataGridModules();

    this.rowsView.render($testElement);

    $('.dx-datagrid-expand').eq(1).trigger('dxclick');

    // act
    countCallTemplate = 0;
    $('.dx-datagrid-expand').eq(0).trigger('dxclick');

    // assert
    assert.equal(countCallTemplate, 1, 'only one master detail template is rendered');
    assert.ok($testElement.find('.dx-row').eq(0).hasClass('dx-data-row'), 'row 0 is data');
    assert.ok($testElement.find('.dx-row').eq(1).hasClass('dx-master-detail-row'), 'row 1 is detail');
    assert.ok($testElement.find('.dx-row').eq(2).hasClass('dx-data-row'), 'row 2 is data');
    assert.ok($testElement.find('.dx-row').eq(3).hasClass('dx-master-detail-row'), 'row 3 is detail');
});

// T281779
QUnit.test('Show summary in a group row for column going after a grouped column', function(assert) {
    // arrange
    var testElement = $('#container'),
        $rowElement,
        $cellElements;

    this.options.columns[0] = { dataField: 'name', groupIndex: 0 };
    this.options.summary = {
        groupItems: [
            {
                column: 'age',
                summaryType: 'count',
                alignByColumn: true
            }
        ],
        texts: {
            count: 'Count: {0}'
        }
    };
    this.setupDataGridModules();

    // act
    this.rowsView.render(testElement);

    $rowElement = testElement.find('tbody > tr').first();
    $cellElements = $rowElement.find('td');

    // assert
    assert.ok($rowElement.hasClass('dx-group-row'), 'group row');
    assert.equal($cellElements.length, 2, 'count column');
    assert.equal($cellElements.last().text(), 'Name: Alex (Count: 1)', 'summary text');
});

// T281779
QUnit.test('Show summary in a group row with showWhenGrouped true', function(assert) {
    // arrange
    var testElement = $('#container'),
        $rowElement,
        $cellElements;

    this.options.dataSource.store = [{ name: 'Alex', lastName: 'Jobs', age: 15 }];
    this.options.columns = ['name', 'lastName', { dataField: 'age', groupIndex: 0, showWhenGrouped: true }];
    this.options.summary = {
        groupItems: [
            {
                column: 'lastName',
                summaryType: 'count',
                alignByColumn: true
            },
            {
                column: 'age',
                summaryType: 'max',
                alignByColumn: true
            }
        ],
        texts: {
            max: 'Max: {0}',
            count: 'Count: {0}'
        }
    };
    this.setupDataGridModules();

    // act
    this.rowsView.render(testElement);

    $rowElement = testElement.find('tbody > tr').first();
    $cellElements = $rowElement.find('td');

    // assert
    assert.ok($rowElement.hasClass('dx-group-row'), 'group row');
    assert.equal($cellElements.length, 4, 'count column');
    assert.equal($cellElements.eq(1).text(), 'Age: 15 (Max: 15)', 'group text');
    assert.equal($cellElements.eq(2).text(), 'Count: 1', 'summary text third column');
    assert.equal($cellElements.eq(3).text(), '', 'summary text fourth column');
});

// T281779
QUnit.test('Show summary in a group row for column going after a grouped column with showWhenGrouped true', function(assert) {
    // arrange
    var testElement = $('#container'),
        $rowElement,
        $cellElements;

    this.options.columns[0] = { dataField: 'name', groupIndex: 0, showWhenGrouped: true };
    this.options.summary = {
        groupItems: [
            {
                column: 'age',
                summaryType: 'count',
                alignByColumn: true
            }
        ],
        texts: {
            count: 'Count: {0}'
        }
    };
    this.setupDataGridModules();

    // act
    this.rowsView.render(testElement);

    $rowElement = testElement.find('tbody > tr').first();
    $cellElements = $rowElement.find('td');

    // assert
    assert.ok($rowElement.hasClass('dx-group-row'), 'group row');
    assert.equal($cellElements.length, 3, 'count column');
    assert.equal($cellElements.eq(1).text(), 'Name: Alex', 'group text');
    assert.equal($cellElements.last().text(), 'Count: 1', 'summary text');
});

// T281779
QUnit.test('Show summary in a group row for column going after a grouped column with showWhenGrouped true and when has master detail', function(assert) {
    // arrange
    var testElement = $('#container'),
        $rowElement,
        $cellElements;

    this.options.columns[0] = { dataField: 'name', groupIndex: 0, showWhenGrouped: true };
    this.options.masterDetail = {
        enabled: true
    };
    this.options.summary = {
        groupItems: [
            {
                column: 'age',
                summaryType: 'count',
                alignByColumn: true
            },
            {
                column: 'name',
                summaryType: 'count',
                alignByColumn: true
            }
        ],
        texts: {
            count: 'Count: {0}'
        }
    };
    this.setupDataGridModules();

    // act
    this.rowsView.render(testElement);

    $rowElement = testElement.find('tbody > tr').first();
    $cellElements = $rowElement.find('td');

    // assert
    assert.ok($rowElement.hasClass('dx-group-row'), 'group row');
    assert.equal($cellElements.length, 3, 'count column');
    assert.equal($cellElements.eq(1).text(), 'Name: Alex (Count: 1)', 'group text');
    assert.equal($cellElements.last().text(), 'Count: 1', 'summary text');
});


// T411212
QUnit.test('Show master detail with rowTemplate', function(assert) {
    // arrange
    var testElement = $('#container'),
        $rowElements;

    this.options.masterDetail = {
        enabled: true,
        template: function(container, options) {
            $('<div>').addClass('test-detail').text(options.key).appendTo(container);
        }
    };

    this.options.rowTemplate = function(container, options) {
        $('<tr class="dx-row"><td>+</td><td>' + options.data.name + '</td><td>' + options.data.age + '</td></tr>').appendTo(container);
    };

    this.setupDataGridModules();

    this.rowsView.render(testElement);

    // act
    this.expandRow(this.getKeyByRowIndex(0));

    // assert
    $rowElements = testElement.find('tbody > tr');

    assert.equal($rowElements.length, 9, 'row count');
    assert.equal($rowElements.eq(0).children().eq(1).text(), 'Alex');
    assert.equal($rowElements.eq(0).children().eq(2).text(), '15');
    assert.ok($rowElements.eq(1).hasClass('dx-master-detail-row'));
    assert.equal($rowElements.eq(1).find('.test-detail').length, 1, 'master detail template is rendered');
});

// T718316
QUnit.test('Show master detail when row as tbody', function(assert) {
    // arrange
    var $testElement = $('#container'),
        $rowElements;

    this.options.masterDetail = {
        enabled: true,
        template: function(container, options) {
            $('<div>').addClass('test-detail').text(options.key).appendTo(container);
        }
    };
    this.options.rowTemplate = function(container, options) {
        $('<tbody class="dx-row dx-data-row"><tr><td>+</td><td>' + options.data.name + '</td><td>' + options.data.age + '</td></tr></tbody>').appendTo(container);
    };

    this.setupDataGridModules();
    this.rowsView.render($testElement);

    // assert
    $rowElements = $testElement.find('tbody.dx-row');
    assert.strictEqual($rowElements.length, 8, 'row count');

    // act
    this.expandRow(this.getKeyByRowIndex(0));

    // assert
    $rowElements = $testElement.find('tbody.dx-row');
    assert.strictEqual($rowElements.length, 9, 'row count');
    assert.ok($rowElements.eq(0).hasClass('dx-data-row'), 'data row');
    assert.ok($rowElements.eq(1).hasClass('dx-master-detail-row'), 'master detail row');
});

QUnit.test('Do not hide noData block placed inside the masterDetail template', function(assert) {
    // arrange
    var container = $('#container'),
        noDataElements;

    this.options.dataSource.store = [this.items[0]];
    this.options.masterDetail = {
        enabled: true,
        template: function($container, options) {
            $('<div>').addClass('dx-datagrid-nodata').appendTo($container);
        }
    };

    // act
    this.setupDataGridModules();
    this.rowsView.render(container);
    this.rowsView.resize();
    this.expandRow(this.items[0]);

    noDataElements = container.find('.dx-datagrid-nodata');

    // assert
    assert.equal(noDataElements.length, 2, 'two no data containers were rendered');

    // act
    this.rowsView.resize();
    noDataElements = container.find('.dx-datagrid-nodata');
    assert.notOk(noDataElements.eq(0).hasClass('dx-hidden'), 'block inside masterDetail is not hidden');
    assert.ok(noDataElements.eq(1).hasClass('dx-hidden'), 'datagrid\'s nodata block is hidden');
});

// T436424
QUnit.test('Show load panel after replace dataSource when scrolling mode is \'virtual\'', function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        isDataLoading,
        $testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };
    this.options.loadPanel = {
        enabled: true
    };

    this.setupDataGridModules();
    this.rowsView.element = function() { return $testElement; };
    this.rowsView.render($testElement);

    this.dataController.loadingChanged.add(function(isLoading) {
        isDataLoading = isDataLoading || isLoading;
    });

    // act
    this.dataController.optionChanged({ name: 'dataSource' });

    // assert
    assert.ok($testElement.parent().find('.dx-loadpanel-content').first().is(':visible'), 'load panel is visible');
    assert.ok(isDataLoading, 'data loading');
    clock.tick(200);
    assert.ok(!$testElement.parent().find('.dx-loadpanel-content').first().is(':visible'), 'load panel isn\'t visible');

    clock.restore();
});

// T604344
QUnit.test('Scrollbar should be correct updated when specified a remote data', function(assert) {
    // arrange
    var that = this,
        clock = sinon.useFakeTimers(),
        $testElement = $('#container');

    that.options.dataSource = {
        load: function() {
            var d = $.Deferred();

            setTimeout(function() {
                d.resolve([that.items[0]]);
            }, 100);

            return d.promise();
        }
    };
    that.options.loadPanel = {
        enabled: true
    };
    that.options.scrolling = {
        useNative: false
    };
    that.options.columnAutoWidth = true;

    that.setupDataGridModules();
    that.rowsView.element = function() { return $testElement; };
    that.rowsView.render($testElement);
    that.rowsView.resize();
    clock.tick(100);

    // act
    that.rowsView.resize();

    // assert
    assert.notOk(that.rowsView.getScrollable()._allowedDirection(), 'scrollbars are hidden');
    clock.restore();
});

// T341394
QUnit.test('Show grouped column when cellTemplate is defined', function(assert) {
    // arrange
    var testElement = $('#container');

    this.options.grouping = {
        autoExpandAll: true
    };
    this.options.dataSource.store = [
        { name: 'Alex', age: 15, lastName: 'Heart' },
        { name: 'Dan', age: 16, lastName: 'Peyton' },
        { name: 'Vadim', age: 17, lastName: 'Reagan' }
    ];
    this.options.columns = [{ dataField: 'lastName', groupIndex: 0, cellTemplate: function(container) { container.text('test'); } }, 'name', 'age'];

    this.setupDataGridModules();

    // act
    this.rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').length, 7, 'rows count: 6 + 1 freespace row');

    assert.equal(testElement.find('tbody > tr').eq(0).attr('role'), 'row');
    assert.equal(testElement.find('tbody > tr').eq(0).attr('aria-expanded'), 'true');
    assert.ok($(testElement.find('tbody > tr')[0]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().text(), 'Last Name: Heart');
    assert.equal($(testElement.find('tbody > tr')[0]).find('td').last().attr('colspan'), 2);

    assert.ok(!$(testElement.find('tbody > tr')[1]).hasClass('dx-group-row'));
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').length, 3);
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').eq(0).html(), '&nbsp;', 'expand column cell in data row must be empty');
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').eq(1).text(), 'Alex');
    assert.equal($(testElement.find('tbody > tr')[1]).find('td').eq(2).html(), '15');
});

QUnit.test('Group row with the custom position of the group cell', function(assert) {
    // arrange
    var $testElement = $('#container'),
        $groupCellElements;

    this.options.grouping = { allowCollapsing: true };
    this.options.columns[0] = { dataField: 'name', groupIndex: 0 };
    this.options.columns.push({
        type: 'groupExpand'
    }, 'age');

    this.setupDataGridModules();

    // act
    this.rowsView.render($testElement);

    // assert
    $groupCellElements = $(this.getRowElement(0)).children();
    assert.strictEqual($groupCellElements.length, 3, 'group cell count');
    assert.ok($groupCellElements.eq(0).hasClass('dx-datagrid-group-space'), 'first cell is empty');
    assert.ok($groupCellElements.eq(1).hasClass('dx-datagrid-expand'), 'second cell is expandable');
    assert.ok($groupCellElements.eq(2).hasClass('dx-group-cell'), 'third cell is group');
});

// T712541
QUnit.test('Rows should be rendered properly on scrolling when virtual scrolling is enabled and a row template is used', function(assert) {
    // arrange
    var scrollable,
        clock = sinon.useFakeTimers(),
        $testElement = $('#container'),
        store = new ArrayStore(generateItems(10000));

    try {
        this.options.columns = undefined;
        this.options.remoteOperations = true;
        this.options.dataSource = {
            load: function(loadOptions) {
                var d = $.Deferred();

                setTimeout(() => {
                    store.load(loadOptions).done((items) => {
                        d.resolve({ data: items, totalCount: 10000 });
                    });
                }, 100);

                return d.promise();
            }
        };
        this.options.scrolling = {
            mode: 'virtual',
            useNative: false,
            removeInvisiblePages: true,
            rowPageSize: 5,
            rowRenderingMode: 'standard'
        };
        this.options.rowTemplate = (_, options) => {
            return $('<tbody>').addClass('dx-row').html('<tr><td colspan=5>' + options.data.id + '</td></tr>');
        };

        this.setupDataGridModules();
        clock.tick(200);

        this.rowsView.render($testElement);
        this.rowsView.height(200);
        this.rowsView.resize();

        scrollable = this.rowsView._scrollable;
        scrollable.scrollTo({ y: 2500 });
        $(scrollable._container()).trigger('scroll');
        clock.tick(500);

        // assert
        assert.strictEqual(this.pageIndex(), 3, 'current pageIndex');
        assert.strictEqual($testElement.find('tbody.dx-virtual-row').length, 2, 'virtual tbody count');
        assert.strictEqual($testElement.find('tbody').children('.dx-virtual-row').length, 2, 'virtual row count');
    } finally {
        clock.restore();
    }
});


QUnit.module('Virtual scrolling', {
    beforeEach: function() {
        this.createRowsView = function(items, dataController) {
            var rowsView = createRowsView.apply(this, arguments);
            var x = new virtualScrollingCore.VirtualScrollController(this, { pageIndex: function() {} });
            rowsView._dataController._itemSizes = {};
            rowsView._dataController.getVirtualContentSize = x.getVirtualContentSize;
            rowsView._dataController.getContentOffset = x.getContentOffset;
            rowsView._dataController.getItemOffset = x.getItemOffset;
            rowsView._dataController.getItemSize = x.getItemSize;
            rowsView._dataController.getItemSizes = x.getItemSizes;
            rowsView._dataController.viewportItemSize = x.viewportItemSize;
            rowsView._dataController.setContentSize = x.setContentSize;
            rowsView._dataController.setViewportPosition = x.setViewportPosition;
            rowsView._dataController.getItemIndexByPosition = x.getItemIndexByPosition;
            rowsView._dataController._setViewportPositionCore = x._setViewportPositionCore;
            rowsView._dataController.option = rowsView.option.bind(rowsView);
            rowsView._dataController._dataSource = {
                changingDuration: function() { return 50; },
                totalItemsCount: function() {
                    var virtualItemsCount = dataController.virtualItemsCount();
                    return items.length + virtualItemsCount.begin + virtualItemsCount.end;
                }
            };

            return rowsView;
        };
    },
    afterEach: function() {
        this.dataGrid && this.dataGrid.dispose();
    }
});

QUnit.test('Render rows with virtual items', function(assert) {
    // arrange
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container'),
        $virtualRows;

    // act
    this.options.scrolling = {
        mode: 'virtual'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;

    var content = testElement.find('.dx-scrollable-content').children();

    assert.equal(options.viewportSize, Math.round(90 / rowHeight));

    assert.equal(content.length, 1);
    assert.equal(content.children().length, 1);
    assert.equal(content.children().eq(0)[0].tagName, 'TABLE');
    assert.equal(content.children().eq(0).find('tbody > tr').length, 6, '3 data row + 1 freespace row + 2 virtual row');

    $virtualRows = content.children().eq(0).find('.dx-virtual-row');
    assert.roughEqual($virtualRows.eq(0).height(), rowHeight * 10, 1);
    assert.roughEqual($virtualRows.eq(1).height(), rowHeight * 7, 1);
    assert.equal(content.children().eq(1).find('.' + 'dx-datagrid-group-space').length, 0, 'group space class');

    // T720928
    assert.roughEqual(parseFloat($virtualRows.eq(0).children().get(0).style.height), rowHeight * 10, 1);
    assert.roughEqual(parseFloat($virtualRows.eq(1).children().get(0).style.height), rowHeight * 7, 1);
});

QUnit.test('Render rows if row rendering mode is virtual', function(assert) {
    // arrange
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        rowRenderingMode: 'virtual'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;

    var content = testElement.find('.dx-scrollable-content').children();

    assert.equal(options.viewportSize, Math.round(90 / rowHeight));

    assert.equal(content.length, 1);
    assert.equal(content.children().length, 1);
    assert.equal(content.children().eq(0)[0].tagName, 'TABLE');
    assert.equal(content.children().eq(0).find('tbody > tr').length, 6, '3 data row + 1 freespace row + 2 virtual row');
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(0).height(), rowHeight * 10, 1);
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(1).height(), rowHeight * 7, 1);
    assert.equal(content.children().eq(1).find('.' + 'dx-datagrid-group-space').length, 0, 'group space class');
});

// T154003
QUnit.test('Render rows with virtual items count is more 1 000 000', function(assert) {
    // arrange
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 7000000,
                end: 3000000
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        mode: 'virtual'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;

    var heightRatio = dataController._sizeRatio;

    var content = testElement.find('.dx-scrollable-content').children();

    assert.equal(options.viewportSize, Math.round(90 / rowHeight));
    assert.ok(heightRatio > 0 && heightRatio < 1, 'heightRatio is defined and in (0, 1)');

    assert.equal(content.length, 1);
    assert.equal(content.children().length, 1);
    assert.equal(content.children().eq(0)[0].tagName, 'TABLE');
    assert.equal(content.children().eq(0).find('tbody > tr').length, 6, '3 data row + 1 freespace row + 2 virtual row');
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row')[0].getBoundingClientRect().height, rowHeight * heightRatio * 7000000, 1);
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row')[1].getBoundingClientRect().height, rowHeight * heightRatio * 3000000, 1);
    assert.ok(content.children().eq(0).height() < 16000000, 'height is less then height limit');
    assert.equal(content.children().eq(0).find('.' + 'dx-datagrid-group-space').length, 0, 'group space class');
});

if(browser.msie) {
    // T377627
    QUnit.test('Render rows with virtual items count is 200 000 for IE', function(assert) {
        // arrange
        var options = {
                items: [
                    { values: [1] },
                    { values: [2] },
                    { values: [3] }
                ],
                virtualItemsCount: {
                    begin: 150000,
                    end: 50000
                }
            },
            dataController = new MockDataController(options),
            rowsView = this.createRowsView(options.items, dataController),
            testElement = $('#container');

        // act
        this.options.scrolling = {
            mode: 'virtual'
        };
        rowsView.render(testElement);
        rowsView.height(90);
        rowsView.resize();

        var rowHeight = rowsView._rowHeight;
        var heightRatio = dataController._sizeRatio;

        var content = testElement.find('.dx-scrollable-content').children();

        assert.equal(options.viewportSize, Math.round(90 / rowHeight));
        assert.ok(heightRatio > 0 && heightRatio < 1, 'heightRatio is defined and in (0, 1)');

        assert.equal(content.length, 1);
        assert.equal(content.children().length, 1);
        assert.equal(content.children().eq(0)[0].tagName, 'TABLE');
        assert.equal(content.children().eq(0).find('tbody > tr').length, 6, '3 data row + 1 freespace row + 2 virtual row');
        assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(0).height(), rowHeight * heightRatio * 150000, 1);
        assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(1).height(), rowHeight * heightRatio * 50000, 1);
        assert.ok(content.children().eq(0).height() < 5000000, 'height is less then height limit');
        assert.equal(content.children().eq(0).find('.dx-datagrid-group-space').length, 0, 'group space class');
    });
}

QUnit.test('setViewportItemIndex for virtual scrolling when rowsView height defined', function(assert) {
    // arrange
    var done = assert.async();
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        mode: 'virtual'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;

    dataController.setViewportItemIndex = function(itemIndex) {
        assert.equal(Math.round(itemIndex), 6);
        done();
    };

    rowsView.scrollTo({ y: rowHeight * 6 });
});

QUnit.test('setViewportItemIndex for virtual scrolling when rowsView height defined and scrolling.timeout is defined', function(assert) {
    // arrange
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        useNative: false,
        timeout: 10,
        renderingThreshold: 0,
        mode: 'virtual'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;
    var setViewportItemIndexCallCount = 0;
    var lastItemIndex;

    dataController.setViewportItemIndex = function(itemIndex) {
        lastItemIndex = itemIndex;
        setViewportItemIndexCallCount++;
    };

    this.clock = sinon.useFakeTimers();

    // act
    rowsView.scrollTo({ y: rowHeight * 5 });
    rowsView.scrollTo({ y: rowHeight * 6 });

    this.clock.tick(5);

    // assert
    assert.equal(setViewportItemIndexCallCount, 0, 'setViewportItemIndex is not called');

    // act
    this.clock.tick(5);

    // assert
    assert.equal(lastItemIndex, 6, 'itemIndex');
    assert.equal(setViewportItemIndexCallCount, 1, 'setViewportItemIndex call count');

    this.clock.restore();
});

// T154003
QUnit.test('setViewportItemIndex to far for virtual scrolling when rowsView height defined and virtual items count is more 1 000 000', function(assert) {
    // arrange
    var done = assert.async();
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 7000000,
                end: 3000000
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;
    var heightRatio = rowsView._dataController._sizeRatio;

    dataController.setViewportItemIndex = function(itemIndex) {
        assert.ok(heightRatio > 0 && heightRatio < 1, 'heightRatio is defined and in (0, 1)');
        assert.roughEqual(itemIndex, 9000000, 2.1);
        done();
    };

    // act
    var itemSizes = dataController.getItemSizes();
    var definedItemSizes = Object.keys(itemSizes).map(function(key) { return itemSizes[key]; });
    rowsView.scrollTo({ y: rowHeight * heightRatio * (9000000 - definedItemSizes.length) + definedItemSizes[0] * definedItemSizes.length });
});

// T154003
QUnit.test('setViewportItemIndex to near for virtual scrolling when rowsView height defined and virtual items count is more 1 000 000', function(assert) {
    // arrange
    var done = assert.async();
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] },
                { values: [4] },
                { values: [5] },
                { values: [6] },
                { values: [7] },
                { values: [8] },
                { values: [9] },
                { values: [10] }
            ],
            virtualItemsCount: {
                begin: 7000000,
                end: 3000000
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;
    var heightRatio = rowsView._dataController._sizeRatio;

    dataController.setViewportItemIndex = function(itemIndex) {
        assert.ok(heightRatio > 0 && heightRatio < 1, 'heightRatio is defined and in (0, 1)');
        assert.equal(Math.round(itemIndex), 7000003);
        done();
    };

    // act
    rowsView.scrollTo({ y: rowHeight * heightRatio * 7000000 + rowHeight * 3 });
});

QUnit.test('setViewportItemIndex for virtual scrolling when rowsView height auto and browser scroll used', function(assert) {
    if(devices.real().ios || ('callPhantom' in window)) {
        // TODO reanimate for ios
        assert.ok(true);
        return;
    }
    $('#qunit-fixture').addClass('qunit-fixture-static');
    // arrange
    var done = assert.async(),
        options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 97
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        mode: 'virtual'
    };

    var $parent = $('.dx-datagrid').parent();
    var $dataGridContainer = $('.dx-datagrid').detach();


    rowsView.render(testElement);
    rowsView.height('auto');
    rowsView.resize();

    // T356116
    $dataGridContainer.appendTo($parent);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;

    dataController.setViewportItemIndex = function(itemIndex) {
        if($('.qunit-fixture-static').length) {
            $('#qunit-fixture').removeClass('qunit-fixture-static');
            assert.ok(true, 'setViewportItemIndex called');
            done();
        }
    };
    $(window).scrollTop(testElement.offset().top + rowHeight * 50);
});

QUnit.test('Render rows with virtual items after render with not virtual items', function(assert) {
    // arrange
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ]
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };

    rowsView.render(testElement);
    // act
    options.virtualItemsCount = {
        begin: 10,
        end: 7
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;

    var content = testElement.find('.dx-scrollable-content').children();

    assert.equal(options.viewportSize, Math.round(90 / rowHeight));

    assert.equal(content.length, 1);
    assert.equal(content.children().length, 1);
    assert.equal(content.children().eq(0)[0].tagName, 'TABLE');
    assert.equal(content.children().eq(0).find('tbody > tr').length, 6, '3 data row + 1 freespace row + 2 virtual row');
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(0).height(), rowHeight * 10, 1);
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(1).height(), rowHeight * 7, 1);
});

QUnit.test('Render rows at end when virtual scrolling', function(assert) {
    // arrange
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        mode: 'virtual'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var newItems = [
        { values: [4] },
        { values: [5] },
        { values: [6] }
    ];

    options.items = options.items.concat(newItems);
    options.virtualItemsCount.end = 4;

    var rowHeight = rowsView._rowHeight;

    dataController.changed.fire({
        items: newItems,
        changeType: 'append'
    });
    rowsView.resize();


    var content = testElement.find('.dx-scrollable-content').children();

    assert.equal(options.viewportSize, Math.round(90 / rowHeight));
    assert.equal(rowHeight, rowsView._rowHeight);

    assert.equal(content.length, 1);
    assert.equal(content.children().length, 1);
    assert.equal(content.children().eq(0)[0].tagName, 'TABLE');
    assert.equal(content.children().eq(0).find('tbody > tr').length, 9, '3 data row + 3 data row + 1 freespace row + 2 virtual row');
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(0).height(), rowHeight * 10, 1);
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(1).height(), rowHeight * 4, 1);
});

// T423722
QUnit.test('Render rows at end when virtual scrolling enabled and rowTemplate is defined', function(assert) {
    // arrange
    var options = {
            items: [
                { rowType: 'data', values: [1] },
                { rowType: 'data', values: [2] },
                { rowType: 'data', values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        mode: 'virtual'
    };

    this.options.rowTemplate = function(container, item) {
        var markup =
            '<tbody>' +
                '<tr>' +
                    '<td>' + item.values[0] + '</td>' +
                '</tr>' +
            '</tbody>';

        $(container).append(markup);
    };

    rowsView.render(testElement);
    rowsView.height(80);
    rowsView.resize();

    var newItems = [
        { rowType: 'data', values: [4] },
        { rowType: 'data', values: [5] },
        { rowType: 'data', values: [6] }
    ];

    options.items = options.items.concat(newItems);
    options.virtualItemsCount.end = 4;

    var rowHeight = rowsView._rowHeight;

    dataController.changed.fire({
        items: newItems,
        changeType: 'append'
    });
    rowsView.resize();


    var content = testElement.find('.dx-scrollable-content').children();

    assert.equal(options.viewportSize, Math.round(90 / rowHeight));
    assert.equal(rowHeight, rowsView._rowHeight);

    assert.equal(content.length, 1);
    assert.equal(content.children().length, 1);
    assert.equal(content.children().eq(0)[0].tagName, 'TABLE');
    assert.equal(content.children().eq(0).find('tbody > tr').length, 9, '3 data row + 3 data row + 1 freespace row + 2 virtual row');
    assert.equal(content.children().eq(0).find('tbody > tr').eq(4).text(), '4', 'row 4 text');
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(0).height(), rowHeight * 10, 1);
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(1).height(), rowHeight * 4, 1);
});


QUnit.test('Render rows at end when infinite scrolling', function(assert) {
    // arrange
    var options = {
            isLoaded: true,
            hasKnownLastPage: false,
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ]
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        mode: 'infinite'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    var newItems = [
        { values: [4] },
        { values: [5] },
        { values: [6] }
    ];

    options.items = options.items.concat(newItems);

    var rowHeight = rowsView._rowHeight;

    dataController.changed.fire({
        items: newItems,
        changeType: 'append'
    });
    rowsView.resize();

    var content = testElement.find('.dx-scrollable-content').children();

    var lastRowHeight = rowsView._rowHeight;
    var $bottomLoadPanel = testElement.find('.dx-datagrid-bottom-load-panel');

    assert.equal(options.viewportSize, Math.round(90 / lastRowHeight));
    assert.ok(rowHeight > 0);
    assert.ok(rowHeight >= lastRowHeight, 'row height after append'); // T129182

    assert.equal($bottomLoadPanel.length, 1, 'bottom load panel exists');
    assert.equal(content.length, 1);
    assert.equal(content.children().length, 2);
    assert.equal(content.children().eq(0)[0].tagName, 'TABLE');
    assert.equal(content.children().eq(0).find('tbody > tr').length, 7, '3 data row + 3 data row + 1 freespace row');
    assert.equal(content.children().eq(0).find('tbody > tr').eq(3).text(), '4', '3 data row + 3 data row + 1 freespace row');

    // act
    rowsView.height(500);
    rowsView.resize();

    // assert
    assert.ok(dataController.viewportItemSize() > 30, 'viewportItemSize is correct');
    assert.equal(content.children().eq(0).find('.dx-freespace-row').length, 1, 'only one freespace-row exists');
    assert.ok(content.children().eq(0).find('.dx-freespace-row').eq(0).is(':visible'), 'freespace row is visible');
});

// T630906
QUnit.test('Render rows at end when infinite scrolling for specific row height', function(assert) {
    // arrange
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ]
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        useNative: false,
        timeout: 0,
        mode: 'infinite'
    };

    rowsView.render(testElement);
    rowsView.height(15);
    rowsView.resize();

    // assert
    assert.equal(dataController.viewportSize(), 1, 'viewportSize');
});

// B254821
QUnit.test('Selection with virtual scrolling after scroll to second page', function(assert) {
    // arrange
    var options = {
            items: [
                { rowType: 'data', values: [1] },
                { rowType: 'data', values: [2] },
                { rowType: 'data', values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            },
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController, [{ command: 'select', cssClass: 'dx-command-select' }, {}, {}, {}]),
        testElement = $('#container');

    // act
    this.options.scrolling = {
        mode: 'virtual'
    };
    rowsView.render(testElement);
    rowsView.height(90);
    rowsView.resize();

    options.items = [
        { rowType: 'data', values: [4] },
        { rowType: 'data', values: [5] },
        { rowType: 'data', values: [6] }
    ];
    options.virtualItemsCount.end = 4;
    dataController.changed.fire({
        items: options.items,
        changeType: 'append'
    });

    var selectCheckboxes = testElement.find('.dx-select-checkbox');

    // assert
    selectCheckboxes.eq(4).trigger('dxclick');

    assert.equal(selectCheckboxes.length, 6);
    assert.equal(this.selectionOptions.changeItemSelectionCallsCount, 1);
    assert.deepEqual(this.selectionOptions.changeItemSelectionArgs, [4]);
});

QUnit.test('rowHeight/viewportSize calculation during Render rows with viewport', function(assert) {
    // arrange
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    // act
    rowsView.render(testElement);
    rowsView.height(60);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;

    var content = testElement.find('.dx-scrollable-content').children();

    assert.equal(options.viewportSize, 2);
    assert.ok((content.find('tbody')[0].offsetHeight - rowHeight * 3) <= 1);
});

QUnit.test('Update rowsView on changed', function(assert) {
    // arrange
    var options = {
            items: [
                { values: [1] },
                { values: [2] },
                { values: [3] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };

    rowsView.render(testElement);
    rowsView.height(60);
    rowsView.resize();

    var rowHeight = rowsView._rowHeight;
    // act

    options.items = [
        { values: [4] }, { values: [5] }, { values: [6] },
        { values: [7] }, { values: [8] }, { values: [9] }
    ];

    options.virtualItemsCount = {
        begin: 12,
        end: 1
    };

    dataController.changed.fire({
        changeType: 'refresh',
        items: options.items
    });
    rowsView.resize();

    var content = testElement.find('.dx-scrollable-content').children();

    assert.equal(content.length, 1);
    assert.equal(content.children().length, 1);
    assert.equal(content.children().eq(0).find('tbody > tr').length, 9);
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(0).height(), rowHeight * 12, 1);
    assert.roughEqual(content.children().eq(0).find('.dx-virtual-row').eq(1).height(), rowHeight * 1, 1);
    assert.equal(getText(getCells(content.children().find('tbody > tr').eq(1))), '4');
});

QUnit.test('rowHeight calculation when freeSpace row shown', function(assert) {
    // arrange
    var rows = [
            { values: [1], data: { field: 1 } },
            { values: [2], data: { field: 2 } },
            { values: [3], data: { field: 3 } }
        ],
        dataController = new MockDataController({
            items: rows,
            virtualItemsCount: {
                begin: 0,
                end: 0
            }
        }),
        rowsView = this.createRowsView(rows, dataController),
        testElement = $('#container');

    rowsView.render(testElement);
    // act
    rowsView.height(100);
    rowsView.resize();

    // assert
    var secondRowHeight = rowsView._tableElement[0].rows[1].offsetHeight;
    assert.equal(Math.floor(rowsView._rowHeight), secondRowHeight);
});

QUnit.test('Add group space class for master detail', function(assert) {
    // arrange
    var rows = [{ rowType: 'data', values: [true, 1] }, { rowType: 'detail', data: { detailInfo: 'Test Detail Information' } }],
        dataController = new MockDataController({ items: rows, virtualItemsCount: { begin: 10, end: 10 } }),
        rowsView = this.createRowsView(rows, dataController, [{ command: 'expand' }, {}]),
        $tables,
        testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };

    // act
    rowsView.render(testElement);
    rowsView.resize();
    $tables = testElement.find('table');

    // assert
    assert.equal($tables.eq(0).find('.dx-virtual-row .dx-datagrid-group-space').length, 2);
});

QUnit.test('Change column visibility_T194439', function(assert) {
    // arrange
    var rows = [
            { values: [1, 2, 'test'] },
            { values: [2, 3, 'test'] },
            { values: [3, 4, 'test'] },
            { values: [1, 5, 'test'] },
            { values: [2, 5, 'test'] },
            { values: [3, 6, 'test'] },
            { values: [1, 8, 'test'] },
            { values: [2, 1, 'test'] },
            { values: [3, 4, 'test'] }
        ],
        dataController = new MockDataController({
            items: rows,
            virtualItemsCount: {
                begin: 5,
                end: 2
            }
        }),
        rowsView = this.createRowsView(rows, dataController, ['col1', 'col2', 'col3']),
        $tables,
        testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };

    rowsView.component.isReady = function() {
        return true;
    };
    rowsView.render(testElement);

    // act
    this.dataGrid.columnsController.getVisibleColumns = function() {
        return ['col1', 'col2'];
    };

    this.dataGrid.dataController.changed.fire({
        changeType: 'refresh',
        items: rows
    });

    // assert
    $tables = $('.dx-datagrid-table');
    assert.equal($tables.length, 1, 'one table with content');
    assert.equal($tables.eq(0).find('col').length, 2, 'table with content');
});

QUnit.test('Change column lines visibility_T194439', function(assert) {
    // arrange
    var rows = [
            { values: [1, 2, 'test'] },
            { values: [2, 3, 'test'] },
            { values: [3, 4, 'test'] },
            { values: [1, 5, 'test'] },
            { values: [2, 5, 'test'] },
            { values: [3, 6, 'test'] },
            { values: [1, 8, 'test'] },
            { values: [2, 1, 'test'] },
            { values: [3, 4, 'test'] }
        ],
        dataController = new MockDataController({
            items: rows,
            virtualItemsCount: {
                begin: 0,
                end: 3
            }
        }),
        rowsView = this.createRowsView(rows, dataController, ['col1', 'col2', 'col3']),
        $cellWithColumnLines,
        testElement = $('#container');

    this.options.showColumnLines = true;
    this.options.scrolling = {
        mode: 'virtual'
    };
    rowsView._rowHeight = 34;
    rowsView.render(testElement);

    // act
    this.options.showColumnLines = false;

    rowsView.beginUpdate();
    rowsView.optionChanged({
        fullName: 'showColumnLines',
        name: 'showColumnLines'
    });
    rowsView.endUpdate();

    // assert
    $cellWithColumnLines = $('.dx-datagrid-table .dx-column-lines');
    assert.equal($cellWithColumnLines.length, 0, 'cells with column lines class');
});

QUnit.test('Set column widths for virtual table', function(assert) {
    // arrange
    var $colElements,
        options = {
            items: [
                { values: [1, 2, 3] },
                { values: [4, 5, 6] },
                { values: [7, 8, 9] }
            ],
            virtualItemsCount: {
                begin: 10,
                end: 7
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        $testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };
    rowsView.render($testElement);
    rowsView.resize();

    // act
    rowsView.setColumnWidths({ widths: [10, 20, 30] });

    // assert
    $colElements = $testElement.find('table:not(.dx-datagrid-table-content)').find('col');
    assert.equal($colElements.length, 3, 'count col');
    assert.equal($colElements[0].style.width, '10px', 'width of the first col');
    assert.equal($colElements[1].style.width, '20px', 'width of the second col');
    assert.equal($colElements[2].style.width, '30px', 'width of the third col');
});

// T472955
QUnit.test('Last data row of the last tbody should not have border bottom width', function(assert) {
    // arrange
    var $tbodyElements,
        options = {
            isLoaded: true,
            hasKnownLastPage: false,
            items: [
                { values: [1], rowType: 'data' },
                { values: [2], rowType: 'data' }
            ]
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController, null, null, {
            showRowLines: true,
            showBorders: true,
            scrolling: {
                mode: 'infinite'
            }
        }),
        $testElement = $('.dx-datagrid').addClass('dx-datagrid-borders cross-browser-border-width-getting');

    // act
    rowsView.render($testElement);

    // assert
    $tbodyElements = $(rowsView.element().find('tbody'));
    assert.ok(rowsView.element().hasClass('dx-last-row-border'), 'has class \'dx-last-row-border\'');
    assert.strictEqual($tbodyElements.length, 1, 'count tbody');
    assert.strictEqual($tbodyElements.eq(0).children('.dx-data-row:nth-last-child(2)').children().first().css('borderBottomWidth'), '0px', 'bottom border is hidden');

    // act
    dataController.changed.fire({
        items: [
            { values: [3], rowType: 'data' },
            { values: [4], rowType: 'data' }
        ],
        changeType: 'append'
    });

    // assert
    $tbodyElements = $(rowsView.element().find('tbody'));
    assert.strictEqual($tbodyElements.length, 1, 'count tbody');
    assert.strictEqual($tbodyElements.eq(0).children('.dx-data-row:nth-last-child(2)').children().first().css('borderBottomWidth'), '0px', 'bottom border is hidden');
});

// T487466
QUnit.test('Vertical scroll position should be correct after render rows when scroll up', function(assert) {
    if(!browser.webkit) {
        assert.ok(true, 'This test is only relevant for webkit browser');
        return;
    }

    // arrange
    var options = {
            items: [
                { rowType: 'data', values: [13] },
                { rowType: 'data', values: [14] },
                { rowType: 'data', values: [15] }
            ],
            virtualItemsCount: {
                begin: 12,
                end: 6
            },
            pageSize: 3,
            pageIndex: 4
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController, null, null, {
            scrolling: {
                mode: 'virtual'
            }
        }),
        done = assert.async(),
        scrollTop,
        $tableElement,
        $testElement = $('#container');

    rowsView._hasHeight = true;
    rowsView.render($testElement);
    rowsView.height(100);
    rowsView.resize();

    // assert
    $tableElement = $testElement.find('table').first();
    assert.equal($tableElement.find('tbody').length, 1, 'count page');

    // act
    scrollTop = $tableElement.find('.dx-virtual-row').eq(0).height() - 50;
    rowsView.scrollTo(scrollTop);
    options.items = [
        { rowType: 'data', values: [10] },
        { rowType: 'data', values: [11] },
        { rowType: 'data', values: [12] }
    ];
    options.virtualItemsCount.begin = 9;
    rowsView._isScrollByEvent = true;
    dataController.changed.fire({
        items: options.items,
        changeType: 'prepend'
    });

    rowsView.scrollChanged.add(function() {
        // assert
        $tableElement = $testElement.find('table').first();
        assert.equal($tableElement.find('.dx-data-row').length, 6, 'row count');
        assert.equal(rowsView._scrollTop, scrollTop, 'scroll top');
        done();
    });
});

QUnit.test('getTopVisibleRowData when virtual scrolling enabled', function(assert) {
    // arrange
    var done = assert.async();
    var rows = [
            { values: [1], data: { field: 1 } },
            { values: [2], data: { field: 2 } },
            { values: [3], data: { field: 3 } }
        ],
        dataController = new MockDataController({
            items: rows,
            virtualItemsCount: {
                begin: 5,
                end: 2
            }
        }),
        rowsView = this.createRowsView(rows, dataController),
        testElement = $('#container');

    this.options.scrolling = {
        mode: 'virtual'
    };

    rowsView.render(testElement);
    rowsView.height(20);
    rowsView.resize();

    rowsView.scrollChanged.add(function() {
        // act, assert
        assert.deepEqual(rowsView.getTopVisibleRowData(), { field: 2 });
        done();
    });

    rowsView.element().dxScrollable('instance').scrollTo(rowsView._rowHeight * 5 + 25);
});


QUnit.module('Scrollbar', {
    beforeEach: function() {
        this.createRowsView = createRowsView;
    },
    afterEach: function() {
        this.dataGrid && this.dataGrid.dispose();
    }
});

QUnit.test('isScrollbarVisible', function(assert) {
    // arrange
    var rows = [{ values: [1] }, { values: [2] }, { values: [3] }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController),
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.height(40);
    rowsView.resize();

    // act, assert
    assert.ok(rowsView.isScrollbarVisible());
});

QUnit.test('No isScrollbarVisible', function(assert) {
    // arrange
    var rows = [{ values: [1] }, { values: [2] }, { values: [3] }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController),
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.height(200);

    // act, assert
    assert.ok(!rowsView.isScrollbarVisible());
});

QUnit.test('getTopVisibleRowData without scrolling', function(assert) {
    // arrange
    var rows = [{ values: [1], data: { field: 1 } }, { values: [2], data: { field: 2 } }, { values: [3], data: { field: 3 } }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController),
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.height(10);
    rowsView.resize();

    // act, assert
    assert.deepEqual(rowsView.getTopVisibleRowData(), { field: 1 });
});

// B252594
QUnit.test('getTopVisibleRowData for one row', function(assert) {
    // arrange
    var rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController),
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.height(10);
    rowsView.resize();

    // act, assert
    assert.deepEqual(rowsView.getTopVisibleRowData(), { field: 1 });
});

QUnit.test('getTopVisibleRowData with small scrolling', function(assert) {
    // arrange
    var done = assert.async();
    var rows = [{ values: [1], data: { field: 1 } }, { values: [2], data: { field: 2 } }, { values: [3], data: { field: 3 } }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController),
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.height(10);
    rowsView.resize();

    rowsView.scrollChanged.add(function() {
        // act, assert
        assert.deepEqual(rowsView.getTopVisibleRowData(), { field: 1 });
        done();
    });

    rowsView.element().dxScrollable('instance').scrollTo(2);
});

QUnit.test('getTopVisibleRowData with scrolling', function(assert) {
    // arrange
    var done = assert.async();
    var rows = [
            { values: [1], data: { field: 1 } },
            { values: [2], data: { field: 2 } },
            { values: [3], data: { field: 3 } }
        ],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController),
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.height(10);
    rowsView.resize();

    rowsView.scrollChanged.add(function() {
        // act, assert
        assert.deepEqual(rowsView.getTopVisibleRowData(), { field: 2 });
        done();
    });

    rowsView.element().dxScrollable('instance').scrollTo(20);
});

QUnit.test('getTopVisibleRowData when virtual scrolling enabled after append next page', function(assert) {
    // arrange
    var done = assert.async();
    var options = {
            items: [
                { values: [1], data: { field: 1 } },
                { values: [2], data: { field: 2 } },
                { values: [3], data: { field: 3 } }
            ],
            virtualItemsCount: {
                begin: 0,
                end: 4
            }
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(options.items, dataController),
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.height(20);
    rowsView.resize();

    var appendRows = [
        { values: [4], data: { field: 4 } },
        { values: [5], data: { field: 5 } },
        { values: [6], data: { field: 6 } }
    ];
    options.virtualItemsCount.end = 1;
    options.items = options.items.concat(appendRows);
    dataController.changed.fire({
        items: appendRows,
        changeType: 'append'
    });

    rowsView.scrollChanged.add(function() {
        // act, assert
        assert.deepEqual(rowsView.getTopVisibleRowData(), { field: 5 });
        done();
    });

    rowsView.element().dxScrollable('instance').scrollTo(rowsView._rowHeight * 4 + 5);
});

QUnit.test('Get width of horizontal scrollbar when both scrollbars are shown', function(assert) {
    // arrange
    var rows = [{ values: [1] }, { values: [2] }, { values: [3] }, { values: [4] }, { values: [5] }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController, [
            { width: 200 },
            { width: 200 },
            { width: 200 }
        ]);

    // act
    rowsView.render($('#container').css({ width: 100, height: 100 }));

    // arrange
    if(devices.real().deviceType === 'desktop') {
        assert.ok(rowsView.getScrollbarWidth() > 0, 'scrollbar width more 0 for desktop');
    } else {
        assert.strictEqual(rowsView.getScrollbarWidth(), 0, 'scrollbar width is 0 for mobile devices');
    }
});

// T606944
QUnit.test('The vertical scrollbar should not be shown when there is a horizontal scrollbar', function(assert) {
    if(browser.msie && parseInt(browser.version) > 11) {
        assert.ok(true, 'The issue is not fixed for Edge');
        return;
    }

    // arrange
    var rows = [{ values: ['test1', 'test2', 'test3', 'test4'] }],
        columns = [{ dataField: 'field1', width: 300 }, { dataField: 'field2', width: 300 }, { dataField: 'field3', width: 300 }, { dataField: 'field4', width: 300 } ],
        rowsView = this.createRowsView(rows, null, columns, null, { scrolling: { useNative: true } }),
        $testElement = $('#container').width(600);

    // act
    rowsView.render($testElement);
    rowsView.height(700);
    rowsView.resize();

    // assert
    assert.strictEqual(rowsView.getScrollbarWidth(), 0, 'There is no vertical scrollbar');
});

if(browser.webkit) {
    // T606935
    QUnit.test('The vertical scrollbar should not be shown on 200 dpi screens', function(assert) {
        // arrange
        var rows = [{ values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data' }],
            columns = ['field1', 'field2', 'field3', 'field4'],
            rowsView = this.createRowsView(rows, null, columns, null, { scrolling: { useNative: true } }),
            $testElement = $('#container').css('zoom', 2);

        $testElement.parent().wrap($('<div/>').addClass('dx-widget'));
        rowsView._getDevicePixelRatio = function() {
            return 2;
        };

        // act
        rowsView.render($testElement);
        rowsView.height(700);
        rowsView.resize();

        // assert
        assert.strictEqual(rowsView.getScrollbarWidth(), 0, 'There is no vertical scrollbar');
    });
}

// T697699
QUnit.test('The vertical scrollbar should not be shown if showScrollbar is always', function(assert) {
    // arrange
    var rows = [{ values: ['test1'], rowType: 'data' }],
        columns = ['field1'],
        rowsView = this.createRowsView(rows, null, columns, null, { scrolling: { useNative: false, showScrollbar: 'always' } }),
        $testElement = $('#container');

    // act
    rowsView.render($testElement);
    rowsView.height(500);
    rowsView.resize();

    // assert
    assert.strictEqual(rowsView.getScrollable().$content().outerHeight(), rowsView.getScrollable()._container().outerHeight(), 'No vertical scroll');
});

QUnit.module('No data text', {
    beforeEach: function() {
        this.createRowsView = createRowsView;
    },
    afterEach: function() {
        this.dataGrid.dispose();
    }
});

QUnit.test('noDataText container invisible when rowsView with data', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController),
        noDataElement;

    // act
    rowsView.render(container);
    rowsView.resize();
    noDataElement = container.find('.dx-datagrid-nodata');
    // assert
    assert.strictEqual(noDataElement.is('span'), true, 'valid noDataElement');
    assert.strictEqual(noDataElement.css('display'), 'none', 'noDataElement is hidden');

    assert.ok(!noDataElement.is(':visible'), 'noDataElement is hidden');
});

QUnit.test('noDataText container visible when rowsView without data', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [], data: { field: 1 } }],
        dataController = new MockDataController({
            items: [],
            noDataText: 'No Data'
        }),
        rowsView = this.createRowsView(rows, dataController),
        noDataElement;
    // act
    rowsView.render(container);
    rowsView.resize();
    noDataElement = container.find('.dx-datagrid-nodata');
    // assert
    assert.strictEqual(noDataElement.is('span'), true, 'valid noDataElement');
    assert.ok(noDataElement.is(':visible'), 'noDataElement is visible');
    assert.strictEqual(noDataElement.text(), 'No Data');
});

QUnit.test('noDataText is visible after set height', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: []
        }),
        rowsView = this.createRowsView(rows, dataController),
        noDataElement;

    // act
    rowsView.render(container);
    // assert
    rowsView.height(50);
    rowsView.resize();

    noDataElement = container.find('.dx-datagrid-nodata');
    assert.ok(noDataElement.is(':visible'), 'noDataElement is visible');
});

QUnit.test('Update noDataText container', function(assert) {
    // arrange
    var container = $('#container'),
        noDataText = 'Custom no data text',
        rows = [{ values: [], data: { field: 1 } }],
        dataController = new MockDataController({
            items: []
        }),
        rowsView = this.createRowsView(rows, dataController),
        noDataElement;

    this.options.noDataText = noDataText;

    // act
    rowsView.render(container);
    rowsView.height(21);
    rowsView.resize();
    // assert
    noDataElement = container.find('.dx-datagrid-nodata');

    assert.ok(noDataElement.is(':visible'), 'noDataElement is visible');
    assert.strictEqual(noDataElement.text(), noDataText);
    assert.ok(noDataElement.width() > 0);
    assert.ok(noDataElement.height() > 0);
});

// B252554
QUnit.test('noDataText not visible when data is loading', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: []
        }),
        rowsView = this.createRowsView(rows, dataController),
        noDataElement;

    this.options.noDataText = 'Custom no data text';
    rowsView.render(container);

    // act
    rowsView.height(50);
    rowsView.resize();
    noDataElement = container.find('.dx-datagrid-nodata');

    // assert
    assert.ok(noDataElement.is(':visible'), 'noDataElement is visible');

    // act
    dataController.isLoading = function() {
        return true;
    };
    rowsView.height(60);
    rowsView.resize();

    // assert
    assert.ok(!noDataElement.is(':visible'), 'noDataElement is not visible');
});

QUnit.module('Bottom Load Panel', {
    beforeEach: function() {
        this.createRowsView = createRowsView;
    },
    afterEach: function() {
        this.dataGrid.dispose();
    }
});

QUnit.test('Not render bottom Load panel when no appendMode and virtual', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows,
            hasKnownLastPage: false
        }),
        rowsView = this.createRowsView(rows, dataController),
        bottomLoadPanel;

    this.options.scrolling = {
        appendMode: false
    };
    // act
    rowsView.render(container);
    bottomLoadPanel = container.find('.dx-datagrid-bottom-load-panel');

    // assert
    assert.equal(bottomLoadPanel.length, 0);
});

QUnit.test('Bottom Load panel is visible when hasKnownLastPage is false and appendMode', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows,
            hasKnownLastPage: false,
            isLoaded: true
        }),
        rowsView = this.createRowsView(rows, dataController),
        bottomLoadPanel;

    this.options.scrolling = {
        mode: 'infinite'
    };
    // act
    rowsView.render(container);
    bottomLoadPanel = container.find('.dx-datagrid-bottom-load-panel');

    // assert
    assert.equal(bottomLoadPanel.length, 1);
    assert.ok(bottomLoadPanel.is(':visible'));
});

QUnit.test('Bottom Load panel is visible when hasKnownLastPage is false and virtual scrolling enabled', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows,
            virtualItemsCount: {
                begin: 0,
                end: 0
            },
            isLoaded: true,
            hasKnownLastPage: false
        }),
        rowsView = this.createRowsView(rows, dataController),
        bottomLoadPanel;

    this.options.scrolling = {
        mode: 'virtual'
    };
    // act
    rowsView.render(container);
    bottomLoadPanel = container.find('.dx-datagrid-bottom-load-panel');
    // rowsView.height(21);
    // assert
    assert.equal(bottomLoadPanel.length, 1);
    assert.ok(bottomLoadPanel.is(':visible'));
});

QUnit.test('Bottom Load panel is not render when hasKnownLastPage is true', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows,
            hasKnownLastPage: true,
            isLoaded: true
        }),
        rowsView = this.createRowsView(rows, dataController),
        bottomLoadPanel;

    this.options.scrolling = {
        mode: 'infinite'
    };
    // act
    rowsView.render(container);
    bottomLoadPanel = container.find('.dx-datagrid-bottom-load-panel');

    // assert
    assert.strictEqual(bottomLoadPanel.length, 0);
});

QUnit.test('Bottom Load panel is not visible when hasKnownLastPage changed to true from false', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        options = {
            items: rows,
            hasKnownLastPage: false,
            isLoaded: true
        },
        dataController = new MockDataController(options),
        rowsView = this.createRowsView(rows, dataController),
        bottomLoadPanel;

    this.options.scrolling = {
        mode: 'infinite'
    };
    rowsView.render(container);

    // act
    options.hasKnownLastPage = true;
    dataController.changed.fire({ items: [], changeType: 'append' });

    // assert
    bottomLoadPanel = container.find('.dx-datagrid-bottom-load-panel');
    assert.strictEqual(bottomLoadPanel.length, 0);
});

// T129917
QUnit.test('loadPanel options', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController);

    this.options.loadPanel = {
        enabled: true,
        width: 400,
        height: 200,
        showIndicator: false,
        showPane: true,
        text: 'Test',
        indicatorSrc: 'test'
    };

    // act
    rowsView.render(container);

    // assert
    assert.ok(container.find('.dx-loadpanel').length);
    assert.equal(rowsView._loadPanel.option('width'), 400);
    assert.equal(rowsView._loadPanel.option('height'), 200);
    assert.equal(rowsView._loadPanel.option('message'), 'Test');
    assert.equal(rowsView._loadPanel.option('showIndicator'), false);
    assert.equal(rowsView._loadPanel.option('showPane'), true);
    assert.equal(rowsView._loadPanel.option('indicatorSrc'), 'test');
    assert.deepEqual(rowsView._loadPanel.option('container'), rowsView.element().parent());
});

QUnit.test('Load Panel is not visible when Bottom Load Panel is visible and pageIndex is more then 0', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            pageIndex: 1,
            items: rows,
            hasKnownLastPage: false,
            isLoaded: true
        }),
        rowsView = this.createRowsView(rows, dataController),
        bottomLoadPanel;

    this.options.loadPanel = {
        enabled: true
    };
    this.options.scrolling = {
        mode: 'infinite'
    };
    rowsView.render(container);

    // act
    rowsView.setLoading(true);
    bottomLoadPanel = container.find('.dx-datagrid-bottom-load-panel');

    // assert
    assert.strictEqual(bottomLoadPanel.length, 1);
    assert.ok(!rowsView._loadPanel.option('visible'));
});

// T536324
QUnit.test('Load Panel is visible when Bottom Load Panel is visible and pageIndex is 0', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            pageIndex: 0,
            items: rows,
            hasKnownLastPage: false,
            isLoaded: true
        }),
        rowsView = this.createRowsView(rows, dataController),
        bottomLoadPanel;

    this.options.loadPanel = {
        enabled: true
    };
    this.options.scrolling = {
        mode: 'infinite'
    };
    rowsView.render(container);

    // act
    rowsView.setLoading(true);
    bottomLoadPanel = container.find('.dx-datagrid-bottom-load-panel');

    // assert
    assert.strictEqual(bottomLoadPanel.length, 1, 'bottom load panel is rendered');
    assert.ok(rowsView._loadPanel.option('visible'), 'load panel is visible');
});

QUnit.test('Load Panel is visible and bottom load panel is not visible when data is not loaded', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows,
            hasKnownLastPage: false,
            isLoaded: false
        }),
        rowsView = this.createRowsView(rows, dataController),
        bottomLoadPanel;

    this.options.loadPanel = {
        enabled: true
    };
    this.options.scrolling = {
        mode: 'infinite'
    };
    rowsView.render(container);

    // act
    rowsView.setLoading(true);
    bottomLoadPanel = container.find('.dx-datagrid-bottom-load-panel');

    // assert
    assert.strictEqual(bottomLoadPanel.length, 0);
    assert.ok(rowsView._loadPanel.option('visible'));
});

QUnit.test('Remove load panel when changing option loadPanel visible false', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController);

    this.options.loadPanel = {
        enabled: true
    };

    // act
    rowsView.render(container);

    // assert
    assert.ok(container.find('.dx-loadpanel').length);

    // arrange
    this.options.loadPanel = {
        visible: false
    };

    // act
    rowsView.beginUpdate();
    rowsView.optionChanged({ name: 'loadPanel' });
    rowsView.endUpdate();

    // assert
    assert.ok(!container.find('.dx-loadpanel').length);
});

QUnit.test('Change option loadPanel', function(assert) {
    // arrange
    var container = $('#container'),
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows
        }),
        rowsView = this.createRowsView(rows, dataController);

    this.options.loadPanel = {
        enabled: true
    };

    // act
    rowsView.render(container);

    // assert
    assert.ok(container.find('.dx-loadpanel').length);

    // arrange
    this.options.loadPanel.width = 400;
    this.options.loadPanel.height = 200;
    this.options.loadPanel.text = 'Test';

    // act
    rowsView.beginUpdate();
    rowsView.optionChanged({ name: 'loadPanel' });
    rowsView.endUpdate();

    // assert
    assert.ok(container.find('.dx-loadpanel').length);
    assert.equal(rowsView._loadPanel.option('width'), 400);
    assert.equal(rowsView._loadPanel.option('height'), 200);
    assert.equal(rowsView._loadPanel.option('message'), 'Test');
});

QUnit.module('Custom Loading', {
    beforeEach: function() {
        var that = this,
            testElement = $('#container');

        that.items = [{ values: [1], data: { field: 1 } }, { values: [2], data: { field: 2 } }, { values: [3], data: { field: 3 } }];
        that.dataControllerOptions = { items: that.items, isLoaded: false };
        that.dataController = new MockDataController(that.dataControllerOptions);
        that.createRowsView = createRowsView;

        that.clock = sinon.useFakeTimers();

        that.setupDataGrid = function(items, dataController) {
            that.rowsView = that.createRowsView(items || that.items, dataController || that.dataController);
            that.options.loadPanel = {
                enabled: true,
                animation: {
                    test: true
                },
                text: 'Loading...'
            };
            that.rowsView.render(testElement);
        };
    },
    afterEach: function() {
        this.dataGrid.dispose();
        this.clock.restore();
    }
});

QUnit.test('Custom loading message', function(assert) {
    // arrange
    var that = this;

    that.setupDataGrid();

    // act
    that.dataController.loadingChanged.fire(true, 'Test');

    // assert
    assert.equal(that.rowsView._loadPanel.option('message'), 'Test');
});

QUnit.test('Default loading message', function(assert) {
    // arrange
    var that = this;

    that.setupDataGrid();

    // act
    that.dataController.loadingChanged.fire(true);

    // assert
    assert.equal(that.rowsView._loadPanel.option('message'), 'Loading...');
});

QUnit.test('Change loading message from custom to default', function(assert) {
    // arrange
    var that = this;

    that.setupDataGrid();

    // act
    that.dataController.loadingChanged.fire(true, 'Test');
    that.dataController.loadingChanged.fire(false);

    // act
    this.clock.tick(100);

    // assert
    assert.equal(that.rowsView._loadPanel.option('message'), 'Test');
    assert.ok(that.rowsView._loadPanel.option('visible'));

    // act
    this.clock.tick(100);

    // assert
    assert.equal(that.rowsView._loadPanel.option('message'), 'Loading...');
    assert.ok(!that.rowsView._loadPanel.option('visible'));
});

QUnit.test('No animation when data is not loaded', function(assert) {
    // arrange
    var that = this;

    that.setupDataGrid();

    // act
    that.dataController.loadingChanged.fire(true);

    // assert
    assert.ok(!that.rowsView._loadPanel.option('animation'));
    assert.ok(that.rowsView._loadPanel.option('visible'));


    that.dataControllerOptions.isLoaded = true;
    that.dataController.loadingChanged.fire(false);

    // act
    this.clock.tick(200);

    // assert
    assert.ok(that.rowsView._loadPanel.option('animation'));
    assert.ok(!that.rowsView._loadPanel.option('visible'));
});

// T181609(rejected), T387788
QUnit.test('Update loadPanel', function(assert) {
    // arrange
    var that = this,
        $loadPanelElement,
        loadPanelPosition,
        rows = [{ values: [1], data: { field: 1 } }],
        dataController = new MockDataController({
            items: rows
        });

    that.setupDataGrid(rows, dataController);
    that.rowsView.setLoading(true);

    // assert
    $loadPanelElement = $('.dx-loadpanel-content');
    loadPanelPosition = $loadPanelElement.position();
    assert.ok($loadPanelElement.length, 'has load panel');
    assert.ok(that.rowsView._loadPanel.option('visible'), 'visible load panel');

    // act
    that.rowsView._dataController.insertItems([{ values: [2], data: { field: 2 } }, { values: [3], data: { field: 3 } }, { values: [4], data: { field: 4 } }, { values: [5], data: { field: 5 } }]);
    that.rowsView.resize();

    // assert
    $loadPanelElement = $('.dx-loadpanel-content');
    assert.ok($loadPanelElement.length, 'has load panel');
    assert.equal($loadPanelElement.position().top, loadPanelPosition.top, 'position of the load panel is not changed');
    assert.ok(that.rowsView._loadPanel.option('visible'), 'visible load panel');
});
