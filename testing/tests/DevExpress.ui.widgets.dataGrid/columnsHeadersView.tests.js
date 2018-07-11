"use strict";

import "common.css!";
import "generic_light.css!";

import $ from "jquery";
import dataUtils from "core/element_data";
import setTemplateEngine from "ui/set_template_engine";
import typeUtils from "core/utils/type";
import config from "core/config";
import devices from "core/devices";
import { DataSource } from "data/data_source/data_source";
import dataGridMocks from "../../helpers/dataGridMocks.js";
import dateLocalization from "localization/date";

import "ui/data_grid/ui.data_grid";
import "../../../node_modules/hogan.js/dist/hogan-3.0.2.js";
setTemplateEngine("hogan");

$("body").addClass("dx-viewport");
QUnit.testStart(function() {
    var markup =
        '<div id="container" class="dx-datagrid"></div>\
        <div id="containerIE" class="dx-datagrid"></div>';

    $("#qunit-fixture").html(markup);
});

function getText(cell) {
    return $(cell).find(".dx-datagrid-text-content").first().text();
}

QUnit.module('Headers', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.columns = [];
        this.options = {
            showColumnHeaders: true,
            showColumnLines: false
        };

        this.$element = function() {
            return $("#container");
        };

        dataGridMocks.setupDataGridModules(this, ['data', 'columnHeaders', 'filterRow', 'selection', 'editorFactory', 'contextMenu', 'sorting', 'headerFilter'], {
            initViews: true,
            controllers: {
                columns: new dataGridMocks.MockColumnsController(this.columns),
                editing: new dataGridMocks.MockEditingController(),
                selection: {
                    _isSelectAll: false,
                    isSelectAll: function() {
                        return this._isSelectAll;
                    },
                    selectAll: function() {
                        this._isSelectAll = true;
                        this._selectedRowKeys = [1];
                    },
                    deselectAll: function() {
                        this._isSelectAll = false;
                        this._selectedRowKeys = [];
                    },
                    clearSelection: function() {
                        this._isSelectAll = false;
                        this._selectedRowKeys = [];
                    },
                    selectRows: function(keys) {
                        this._isSelectAll = undefined;
                        this._selectedRowKeys = keys;
                    },
                    getSelectedRowKeys: function() {
                        return this._selectedRowKeys || [];
                    },
                    refresh: function() { },
                    selectionChanged: $.Callbacks()
                }
            }
        });

        this.defaultSelectionHeaderTemplate = function(container, options) {
            var column = options.column,
                $cellElement = $(container);

            $cellElement.addClass("dx-editor-cell");
            this.columnHeadersView._renderSelectAllCheckBox($cellElement, column);
            this.columnHeadersView._attachSelectAllCheckBoxClickEvent($cellElement);
        }.bind(this);
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test('Bounding rect is null when no columns', function(assert) {
    // arrange
    var testElement = $('#container');

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.equal(this.columnHeadersView.getBoundingRect(), null, 'Bounding rect is null when it has no columns');
});

QUnit.test('Bounding rect with columns', function(assert) {
    // arrange
    var testElement = $('#container'),
        boundingRect;

    $.extend(this.columns, [
        { caption: 'Column 1' },
        { caption: 'Column 2' },
        { caption: 'Column 3' }
    ]);

    // act
    this.columnHeadersView.render(testElement);
    boundingRect = this.columnHeadersView.getBoundingRect();

    // assert
    assert.ok(typeUtils.isObject(boundingRect) && typeUtils.isDefined(boundingRect.top), 'Bounding rect return object with "top" property when it has columns');
});

QUnit.test("Bounding rect with columns in iOS (T211627)", function(assert) {
    // arrange
    var realDevice = devices.real(),
        currentDevice = devices.current(),
        testElement = $('#container'),
        boundingRect;

    devices.current("iPad");
    devices._realDevice = devices.current();

    $.extend(this.columns, [
        { caption: 'Column 1' },
        { caption: 'Column 2' },
        { caption: 'Column 3' }
    ]);

    // act
    this.columnHeadersView.render(testElement);
    boundingRect = this.columnHeadersView.getBoundingRect();

    // assert
    assert.ok(typeUtils.isObject(boundingRect) && typeUtils.isDefined(boundingRect.top), 'Bounding rect return object with "top" property when it has columns');

    devices.current(currentDevice);
    devices._realDevice = realDevice;
});

QUnit.test('Draw headers', function(assert) {
    // arrange
    var testElement = $('#container'),
        cells,
        i;

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
        { caption: 'Column 4' }, { caption: 'Column 5' }]);

    // act
    this.columnHeadersView.render(testElement);
    cells = dataGridMocks.getCells(testElement);

    // assert
    assert.equal(cells.length, 5, 'headers count');

    // T218997
    for(i = 0; i < cells.length; i++) {
        var headerNumber = i + 1;

        assert.equal(getText(cells[i]), 'Column ' + headerNumber, headerNumber + ' header text');
        assert.ok(cells.eq(i).hasClass('dx-cell-focus-disabled'), 'focus disabled on cell');
        assert.equal(cells.eq(i).attr('role'), 'columnheader', 'Header cell has correct role');
    }
});

QUnit.test('Headers with cssClass', function(assert) {
    // arrange
    var testElement = $('#container'),
        cells;

    $.extend(this.columns, [{ caption: 'Column 1', cssClass: 'customCssClass' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    // act
    this.columnHeadersView.render(testElement);
    cells = dataGridMocks.getCells(testElement);

    // assert
    assert.equal(cells.length, 3, 'headers count');
    assert.ok(cells.eq(0).hasClass('customCssClass'), 'has class customCssClass');
    assert.ok(!cells.eq(1).hasClass('customCssClass'), 'not has class customCssClass');
    assert.ok(!cells.eq(2).hasClass('customCssClass'), 'not has class customCssClass');
});

QUnit.test('Headers with option showColumnLines true', function(assert) {
    // arrange
    var testElement = $('#container'),
        headerRow;

    this.options.showColumnLines = true;

    // act
    this.columnHeadersView.render(testElement);
    headerRow = testElement.find('.dx-header-row');

    // assert
    assert.ok(headerRow.hasClass('dx-column-lines'), 'has class dx-column-lines');
});

QUnit.test('Headers with option showColumnLines false', function(assert) {
    // arrange
    var testElement = $('#container'),
        headerRow;

    // act
    this.columnHeadersView.render(testElement);
    headerRow = testElement.find('.dx-header-row');

    // assert
    assert.ok(!headerRow.hasClass('dx-column-lines'), 'not has class dx-column-lines');
});

QUnit.test('Column widths keeps after render', function(assert) {
    // arrange
    var testElement = $('#container').width(300);

    $.extend(this.columns, [{ caption: 'Column 1', visibleWidth: 200 }, { caption: 'Column 2', visibleWidth: 100 }]);

    // act
    this.columnHeadersView.render(testElement);
    this.columnHeadersView.resize();

    // assert
    assert.deepEqual(this.columnHeadersView.getColumnWidths(), [200, 100]);

    // act
    this.columnHeadersView.render();
    this.columnHeadersView.resize();

    // assert
    assert.deepEqual(this.columnHeadersView.getColumnWidths(), [200, 100]);
});

QUnit.test('Column widths reset after change columns count and render', function(assert) {
    // arrange
    var testElement = $('#containerIE').width(300);

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }]);

    // act
    this.columnHeadersView.render(testElement);
    this.columnHeadersView.setColumnWidths([200, 100]);

    // assert
    assert.deepEqual(this.columnHeadersView.getColumnWidths(), [200, 100]);

    this.columns.push({ caption: 'Column 3' });

    // act
    this.columnHeadersView.render();

    // assert
    assert.deepEqual(this.columnHeadersView.getColumnWidths(), [100, 100, 100]);
});

QUnit.test('Scroll position after set column widths', function(assert) {
    // arrange
    var testElement = $('#containerIE').width(300),
        $scrollContainer;

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }]);

    // act
    this.columnHeadersView.render(testElement);
    this.columnHeadersView.setColumnWidths([400, 100]);
    this.columnHeadersView.scrollTo({ left: 50 });

    // act
    this.columnHeadersView.setColumnWidths([200, 200]);

    // assert
    $scrollContainer = this.columnHeadersView.element().find(".dx-datagrid-scroll-container");
    assert.deepEqual($scrollContainer.scrollLeft(), 50);
});

QUnit.test('Draw grouped column header', function(assert) {
    // arrange
    var testElement = $('#container'),
        cells;

    $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand', cssClass: 'dx-command-expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    // act
    this.columnHeadersView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal(cells.length, 3, 'headers count');
    assert.equal(cells.eq(0).html(), "&nbsp;", '1 group header text');
    assert.ok(cells.eq(0).hasClass('dx-command-expand'), 'dx-command-expand class added'); // T162020
    assert.ok(cells.eq(0).hasClass('dx-datagrid-group-space'), 'dx-datagrid-group-space class added');
    assert.equal(getText(cells[1]), 'Column 2', '2 header text');
    assert.equal(getText(cells[2]), 'Column 3', '3 header text');
});

QUnit.test('Grouped column header after change sorting', function(assert) {
    // arrange
    var testElement = $('#container'),
        cells;

    $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    // act
    this.columnHeadersView.render(testElement);

    this.columns[0].sortOrder = 'desc';
    this.columns[1].sortOrder = 'asc';

    this.columnsController.columnsChanged.fire({ changeTypes: { sorting: true, length: 1 }, optionNames: {} });
    cells = testElement.find('td');

    // assert
    assert.equal(cells.length, 3, 'headers count');
    assert.equal(cells.eq(0).html(), '&nbsp;', '1 group header html');
    assert.ok(cells.eq(1).html().indexOf('dx-sort-up') > 0, '2 header have sort indicator');
    assert.ok(cells.eq(2).html().indexOf('dx-sort') < 0, '3 header no have sort indicator');
});

// B255429
QUnit.test('Updating column header after change grouping', function(assert) {
    // arrange
    var testElement = $('#container'),
        cells;

    $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.columnHeadersView.render(testElement);

    this.columns[1].groupIndex = 1;
    this.columns[1].command = 'expand';

    // act
    this.columnsController.columnsChanged.fire({ changeTypes: { grouping: true, length: 1 }, optionNames: {} });

    // assert
    cells = testElement.find('td');
    assert.equal(cells.length, 3, 'headers count');
    assert.equal(cells.eq(0).html(), '&nbsp;', 'group header text');
    assert.equal(cells.eq(1).text(), 'Column 2', 'header 2 text');
    assert.equal(cells.eq(2).text(), 'Column 3', 'header 3 text');

    // act
    this.dataController.changed.fire({ changeType: 'refresh' });

    // assert
    cells = testElement.find('td');
    assert.equal(cells.length, 3, 'headers count');
    assert.equal(cells.eq(0).html(), '&nbsp;', 'group header 1 text');
    assert.equal(cells.eq(1).html(), '&nbsp;', 'group header 2 text');
    assert.equal(cells.eq(2).text(), 'Column 3', 'header 3 text');
});

// T208247
QUnit.test('Not updating column header after filtering', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.columnHeadersView.render(testElement);

    var $td = testElement.find('td').first();

    // act
    this.columnsController.columnsChanged.fire({ changeTypes: { columns: true, length: 1 }, optionNames: { filterValue: true, length: 1 }, columnIndex: 0 });
    this.dataController.changed.fire({ changeType: 'refresh' });

    // assert
    assert.strictEqual($td.get(0), testElement.find('td').first().get(0), 'cell is not updated');
});

// S173396
QUnit.test('Height group space when all columns to grouping', function(assert) {
    // arrange
    var testElement = $('#container'),
        cells;

    $.extend(this.columns, [{ headerCaption: 'Column 1', groupIndex: 0, command: 'expand' }, { headerCaption: 'Column 2', groupIndex: 1, command: 'expand' }, { headerCaption: 'Column 3', groupIndex: 2, command: 'expand' }, { command: 'empty' }]);

    // act
    this.columnHeadersView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal(cells.length, 4, 'headers count');
    assert.strictEqual($(cells[0]).html(), '&nbsp;', '1 group space text');
    assert.strictEqual($(cells[1]).html(), '&nbsp;', '2 group space text');
    assert.strictEqual($(cells[2]).html(), '&nbsp;', '3 group space text');
    assert.strictEqual($(cells[3]).html(), '&nbsp;', 'text column with command is empty');
    assert.ok(cells.parent().outerHeight() >= 30, 'height header');
});

QUnit.test('Headers element is hidden when showColumnHeaders is false_B238622', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.showColumnHeaders = false;

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.ok(!this.columnHeadersView.element().is(':visible'), 'headersElement is hidden');
    assert.equal(this.columnHeadersView.element().html(), '', 'headersElement is empty');
});

QUnit.test('Headers element is hidden when dataSource is not loaded', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    var dataSource = new DataSource([]);

    this.dataController.setDataSource(dataSource);

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.ok(!this.dataController.isLoaded(), 'dataSource is not loaded');
    assert.ok(this.columnHeadersView.element().is(':visible'), 'headersElement is visible');
    assert.equal(this.columnHeadersView.element().find('table').length, 1, 'one table is rendered');
    assert.equal(this.columnHeadersView.element().find('tbody > tr').length, 0, 'rows is not rendered');
});


QUnit.test('Headers element is not rendered_B238622', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.showColumnHeaders = undefined;

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.ok(!this.columnHeadersView.element().is(':visible'), 'headersElement is hidden');
    assert.equal(this.columnHeadersView.element().html(), '', 'headersElement is empty');
});

QUnit.test('Headers element is rendered when headers are shown_B238622', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.ok(this.columnHeadersView.element(), 'headersElement is rendered');
    assert.ok(this.columnHeadersView._tableElement, 'table element');
});

QUnit.test('Headers element is rendered when filter row is shown_B238622', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.showColumnHeaders = false;
    this.options.filterRow = { visible: true };

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.ok(this.columnHeadersView.element(), 'headersElement is rendered');
    assert.ok(this.columnHeadersView._tableElement, 'table element');
});

QUnit.test('Draw filterRow', function(assert) {
    // arrange
    var testElement = $('#container'),
        $filterCell;

    $.extend(this.columns, [
            { caption: 'Column 1', allowFiltering: true, calculateFilterExpression: function() { }, alignment: "left" },
            { caption: 'Column 2', allowFiltering: true, calculateFilterExpression: function() { }, alignment: "right" },
            { caption: 'Column 3' }, // not draw filter textbox when allowFiltering is false
            { caption: 'Column 4', allowFiltering: true, calculateFilterExpression: function() { }, groupIndex: 0, command: 'expand' } // B238226
    ]);

    this.options.showColumnHeaders = false;
    this.options.filterRow = { visible: true };

    // act
    this.columnHeadersView.render(testElement);

    $filterCell = testElement.find('.dx-datagrid-filter-row .dx-editor-cell').first();

    // assert
    var inputs = this.columnHeadersView.element().find('input');
    assert.equal($filterCell.attr('aria-label'), 'Column ' + this.columns[0].caption + ', Filter cell');
    assert.equal(inputs.length, 2, 'inputs count');
    assert.equal(inputs.eq(0).css("textAlign"), "left", "left alignment");
    assert.equal(inputs.eq(1).css("textAlign"), "right", "right alignment");
});

QUnit.test('filterRow accessibility structure', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [
        { caption: 'Column 1', allowFiltering: true },
        { caption: 'Column 2', allowFiltering: true }
    ]);

    this.options.filterRow = { visible: true };

    // act
    this.columnHeadersView.render(testElement);

    // assert
    $(".dx-datagrid-filter-row td").each((index, element) => {
        var $element = $(element);
        assert.equal($element.attr("aria-colindex"), index + 1);
        assert.equal($element.attr("role"), "gridcell");
        assert.equal($element.attr("aria-selected"), "false");
    });
});

QUnit.test('Invalidate instead of render when filterRow and sorting option is changed', function(assert) {
    // arrange
    var testElement = $('#container'),
        renderCounter = 0;

    $.extend(this.columns, [
        { caption: 'Column 1', allowFiltering: true, allowSorting: true, calculateFilterExpression: function() { }, alignment: "left" },
        { caption: 'Column 2', allowFiltering: true, allowSorting: true, calculateFilterExpression: function() { }, alignment: "right" },
        { caption: 'Column 3', allowSorting: true },
        { caption: 'Column 4', allowFiltering: true, calculateFilterExpression: function() { }, groupIndex: 0, command: 'expand' } // B238226
    ]);

    this.options.filterRow = { visible: true };

    // act
    this.columnHeadersView.component.isReady = function() {
        return true;
    };
    this.columnHeadersView.render(testElement);

    this.columnHeadersView._renderCore = function() {
        renderCounter++;
    };
    this.columnHeadersView.beginUpdate();
    this.columnHeadersView.optionChanged({ name: "filterRow" });
    this.columnHeadersView.optionChanged({ name: "sorting" });
    this.columnHeadersView.optionChanged({ name: "filterRow" });
    this.columnHeadersView.optionChanged({ name: "sorting" });
    this.columnHeadersView.endUpdate();

    // assert
    assert.equal(renderCounter, 1);
});

QUnit.test('Draw filterRow with date column', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [
            { caption: 'Column 1', index: 0, allowFiltering: true, calculateFilterExpression: function() { }, filterValue: new Date('1996/7/4'), dataType: 'date', format: 'shortDate', parseValue: function(text) { return dateLocalization.parse(text); } }
    ]);

    this.options.showColumnHeaders = false;
    this.options.filterRow = { visible: true };

    // act
    this.columnHeadersView.render(testElement);

    // assert
    var $textEditor = this.columnHeadersView.element().find('.dx-texteditor');
    assert.equal($textEditor.length, 1, 'inputs count');
    assert.deepEqual($textEditor.dxDateBox('instance').option('value'), new Date(1996, 6, 4));
});

QUnit.test('Apply text alignment', function(assert) {
    // arrange
    var testElement = $('#container'),
        cells;

    $.extend(this.columns, [{ caption: 'Column 1', alignment: 'right' }, { caption: 'Column 2', alignment: 'left' }, { caption: 'Column 3', alignment: 'center' }]);

    // act
    this.columnHeadersView.render(testElement);
    cells = testElement.find('td');

    // assert
    assert.equal($(cells[0]).css('text-align'), 'right', 'cell 1');
    assert.equal($(cells[1]).css('text-align'), 'left', 'cell 2');
    assert.equal($(cells[2]).css('text-align'), 'center', 'cell 3');
});

QUnit.test('Add colgroup to table', function(assert) {
    // arrange
    var testElement = $('#container');

    this.columns.push({});

    // act
    this.columnHeadersView.render(testElement);

    // arrange
    assert.equal(testElement.find('table').find('colgroup').children("col").length, 1, '1 col element');
});

QUnit.test('Create col elements by columns collection', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1', width: 30 }, { caption: 'Column 2', width: 50 }, { caption: 'Column 3', width: 73 },
        { caption: 'Column 4' }, { caption: 'Column 5', width: 91 }]);

    // act
    this.columnHeadersView.render(testElement);

    var cols = testElement.find('col');

    // assert
    assert.equal(cols.length, 5, 'columns count');
    assert.equal(cols[0].style.width, '30px', '1 column width');
    assert.equal(cols[1].style.width, '50px', '2 column width');
    assert.equal(cols[2].style.width, '73px', '3 column width');
    assert.equal(cols[3].style.width, '', '4 column width');
    assert.equal(cols[4].style.width, '91px', '5 column width');
});

QUnit.test('Apply sorting when "showColumnLines" option is enabled', function(assert) {
    // arrange
    var $testElement = $('#container');

    $.extend(this.columns, [{ alignment: 'center', sortOrder: 'asc' }, { alignment: 'right', sortOrder: 'asc' },
        { alignment: 'left', sortOrder: 'desc' }, { alignment: 'left', allowSorting: true }]);

    this.options.showColumnLines = true;
    this.options.sorting = {
        mode: "single"
    };

    // act
    this.columnHeadersView.render($testElement);

    // assert
    var $indicatorContainers = $testElement.find('.dx-column-indicators'),
        $headerCells = $testElement.find('.dx-header-row td');

    assert.equal($indicatorContainers.length, 5, 'indicator containers count');

    // first indicator container
    assert.equal($indicatorContainers.eq(0).children().length, 1, "indicator count in first container");
    assert.notStrictEqual($indicatorContainers.eq(0).css("visibility"), "hidden", "indicator is visible");
    assert.ok($indicatorContainers.eq(0).children().hasClass("dx-sort"), "sort indicator");
    assert.ok($indicatorContainers.eq(0).children().hasClass("dx-sort-up"), 'sort up');

    // hidden indicator container
    assert.equal($indicatorContainers.eq(1).children().length, 1, "indicator count in hidden container");
    assert.strictEqual($indicatorContainers.eq(1).css("visibility"), "hidden", "indicator is not visible");
    assert.ok($indicatorContainers.eq(1).children().hasClass("dx-sort"), "sort indicator");
    assert.ok($indicatorContainers.eq(1).children().hasClass("dx-sort-up"), 'sort up');

    // second indicator container
    assert.equal($indicatorContainers.eq(2).children().length, 1, "indicator count in second container");
    assert.notStrictEqual($indicatorContainers.eq(2).css("visibility"), "hidden", "indicator is visible");
    assert.ok($indicatorContainers.eq(2).children().hasClass("dx-sort"), "sort indicator");
    assert.ok($indicatorContainers.eq(2).children().hasClass("dx-sort-up"), 'sort up');

    // third indicator container
    assert.equal($indicatorContainers.eq(3).children().length, 1, "indicator count in third container");
    assert.notStrictEqual($indicatorContainers.eq(3).css("visibility"), "hidden", "indicator is visible");
    assert.ok($indicatorContainers.eq(3).children().hasClass("dx-sort"), "sort indicator");
    assert.ok($indicatorContainers.eq(3).children().hasClass("dx-sort-down"), 'sort down');

    // fourth indicator container (T383079)
    assert.equal($indicatorContainers.eq(4).children().length, 1, "indicator count in fourth container");
    assert.notStrictEqual($indicatorContainers.eq(4).css("visibility"), "hidden", "indicator is visible");
    assert.ok($indicatorContainers.eq(4).children().hasClass("dx-sort"), "sort indicator");
    assert.ok($indicatorContainers.eq(4).children().hasClass("dx-sort-none"), 'sort none');

    assert.equal($headerCells.eq(0).attr("aria-sort"), "ascending", "First column has ascending sort");
    assert.equal($headerCells.eq(1).attr("aria-sort"), "ascending", "Second column has ascending sort");
    assert.equal($headerCells.eq(2).attr("aria-sort"), "descending", "Third column has descending sort");
    assert.equal($headerCells.eq(3).attr("aria-sort"), "none", "Fourth column has no sort");
});

QUnit.test('Apply sorting when "showColumnLines" option is disabled', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ alignment: 'center', sortOrder: 'asc' }, { alignment: 'right', sortOrder: 'asc' },
        { alignment: 'left', sortOrder: 'desc' }, { alignment: 'left' }]);

    // act
    this.columnHeadersView.render(testElement);

    // assert
    var $indicatorContainers = testElement.find('.dx-column-indicators'),
        $headerCells = testElement.find('.dx-header-row td');

    assert.equal($indicatorContainers.length, 4, 'indicator containers count');

    // hidden indicator container
    assert.equal($indicatorContainers.eq(0).children().length, 1, "indicator count in hidden container");
    assert.strictEqual($indicatorContainers.eq(0).css("visibility"), "hidden", "indicator is not visible");
    assert.ok($indicatorContainers.eq(0).children().hasClass("dx-sort"), "sort indicator");
    assert.ok($indicatorContainers.eq(0).children().hasClass("dx-sort-up"), 'sort up');

    // first indicator container
    assert.strictEqual($headerCells.eq(1).children("." + "dx-datagrid-text-content").css("float"), "none", "float cell content");
    assert.notStrictEqual($indicatorContainers.eq(1).css("visibility"), "hidden", "indicator is visible");
    assert.strictEqual($indicatorContainers.eq(1).css("float"), "none", "float indicator");
    assert.equal($indicatorContainers.eq(1).children().length, 1, "indicator count in first container");
    assert.ok($indicatorContainers.eq(1).children().hasClass("dx-sort"), "sort indicator");
    assert.ok($indicatorContainers.eq(1).children().hasClass("dx-sort-up"), 'sort up');

    // second indicator container
    assert.strictEqual($headerCells.eq(2).children("." + "dx-datagrid-text-content").css("float"), "none", "float cell content");
    assert.notStrictEqual($indicatorContainers.eq(2).css("visibility"), "hidden", "indicator is visible");
    assert.strictEqual($indicatorContainers.eq(2).css("float"), "none", "float indicator");
    assert.equal($indicatorContainers.eq(2).children().length, 1, "indicator count in second container");
    assert.ok($indicatorContainers.eq(2).children().hasClass("dx-sort"), "sort indicator");
    assert.ok($indicatorContainers.eq(2).children().hasClass("dx-sort-up"), 'sort up');

    // third indicator container
    assert.strictEqual($headerCells.eq(3).children("." + "dx-datagrid-text-content").css("float"), "none", "float cell content");
    assert.notStrictEqual($indicatorContainers.eq(3).css("visibility"), "hidden", "indicator is visible");
    assert.strictEqual($indicatorContainers.eq(3).css("float"), "none", "float indicator");
    assert.equal($indicatorContainers.eq(3).children().length, 1, "indicator count in third container");
    assert.ok($indicatorContainers.eq(3).children().hasClass("dx-sort"), "sort indicator");
    assert.ok($indicatorContainers.eq(3).children().hasClass("dx-sort-down"), 'sort down');

    assert.equal($headerCells.eq(0).attr("aria-sort"), "ascending", "First column has ascending sort");
    assert.equal($headerCells.eq(1).attr("aria-sort"), "ascending", "Second column has ascending sort");
    assert.equal($headerCells.eq(2).attr("aria-sort"), "descending", "Third column has descending sort");
    assert.equal($headerCells.eq(3).attr("aria-sort"), "none", "Fourth column has no sort");
});

QUnit.test('Apply sorting by click', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ index: 0, alignment: 'right', allowSorting: true }]);

    // act
    this.columnHeadersView.render(testElement);

    // assert
    var sortElements = testElement.find('.' + "dx-sort");
    assert.equal(sortElements.length, 0, 'sortElements count');


    var headerElement = testElement.find('td');
    sortElements = testElement.find('.' + "dx-sort");
    assert.equal(sortElements.length, 0, 'not sorting');
    assert.equal(headerElement.attr('aria-sort'), 'none');

    // act
    headerElement.trigger("dxclick");

    this.clock.tick();
    // assert
    sortElements = testElement.find('.' + "dx-sort-up");
    assert.equal(sortElements.length, 1, 'up sort');
    assert.equal(headerElement.attr('aria-sort'), 'ascending');

    // act
    headerElement = testElement.find('td');
    headerElement.trigger("dxclick");

    this.clock.tick();
    // assert
    sortElements = testElement.find('.' + "dx-sort-down");
    assert.equal(sortElements.length, 1, 'down sort');
    assert.equal(headerElement.attr('aria-sort'), 'descending');

    // act
    headerElement = testElement.find('td');
    headerElement.eq(0).trigger("dxclick");

    this.clock.tick();

    // assert
    sortElements = testElement.find('.' + "dx-sort");
    assert.ok(!$(sortElements[0]).hasClass("dx-sort-up") && !$(sortElements[0]).hasClass("dx-sort-down"), 'not sorting');
});

QUnit.test('No sort while cell is opened for editing in "batch" mode. T450598', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ index: 0, alignment: 'right', allowSorting: true }]);

    // act
    this.columnHeadersView.render(testElement);

    // assert
    this.options.editing = { "mode": "batch" };
    this.getController("editing")._isEditing = true;

    var headerElement = testElement.find('td');

    // act
    headerElement.trigger("dxclick");
    this.clock.tick();
    // assert
    assert.equal(headerElement.attr('aria-sort'), 'none');
});

QUnit.test('No sort while cell is opened for editing in "cell" mode. T450598', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ index: 0, alignment: 'right', allowSorting: true }]);

    // act
    this.columnHeadersView.render(testElement);

    // assert
    this.options.editing = { "mode": "cell" };
    this.getController("editing")._isEditing = true;

    var headerElement = testElement.find('td');

    // act
    headerElement.trigger("dxclick");
    this.clock.tick();
    // assert
    assert.equal(headerElement.attr('aria-sort'), 'none');
});

QUnit.test('Sort while while cell is opened for editing in "row" mode. T450598', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ index: 0, alignment: 'right', allowSorting: true }]);

    // act
    this.columnHeadersView.render(testElement);

    // assert
    this.options.editing = { "mode": "row" };
    this.getController("editing")._isEditing = true;

    var headerElement = testElement.find('td');

    // act
    headerElement.trigger("dxclick");
    this.clock.tick();
    // assert
    assert.equal(headerElement.attr('aria-sort'), 'ascending');
});

QUnit.test("Apply sorting ascending by click from context menu", function(assert) {
    // arrange
    var testElement = $('#container'),
        popupMenu;

    $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.sorting = {
        mode: "single"
    };

    this.columnHeadersView.render(testElement);
    this.contextMenuView.render(testElement);
    var cells = dataGridMocks.getCells(testElement);

    $(cells[0]).trigger("contextmenu");

    popupMenu = $(".dx-viewport").children(".dx-overlay-wrapper").find(".dx-context-menu").first();

    // act
    popupMenu.find(".dx-menu-item").first().trigger("dxclick");

    this.clock.tick();

    // assert
    assert.equal(testElement.find('td').first().find(".dx-sort-up").length, 1, "has element with class dx-sort-up");
});

QUnit.test("Apply sorting descending by click from context menu", function(assert) {
    // arrange
    var testElement = $('#container'),
        popupMenu;

    $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.sorting = {
        mode: "single"
    };

    this.columnHeadersView.render(testElement);
    this.contextMenuView.render(testElement);
    var cells = dataGridMocks.getCells(testElement);

    $(cells[0]).trigger("contextmenu");

    popupMenu = $(".dx-viewport").children(".dx-overlay-wrapper").find(".dx-context-menu").first();

    // act
    popupMenu.find(".dx-menu-item").eq(1).trigger("dxclick");

    this.clock.tick();

    // assert
    assert.equal(testElement.find('td').first().find(".dx-sort-down").length, 1, "has element with class dx-sort-down");
});

QUnit.test("Clear sorting by click from context menu", function(assert) {
    // arrange
    var testElement = $('#container'),
        popupMenu;

    $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0, sortOrder: 'asc' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.sorting = {
        mode: "single"
    };

    this.columnHeadersView.render(testElement);
    this.contextMenuView.render(testElement);
    var cells = dataGridMocks.getCells(testElement);

    // assert
    assert.equal($(cells[0]).find(".dx-sort-up").length, 1, "has element with class dx-sort-up");

    // arrange
    $(cells[0]).trigger("contextmenu");

    popupMenu = $(".dx-viewport").children(".dx-overlay-wrapper").find(".dx-context-menu").first();

    // act
    popupMenu.find(".dx-menu-item").last().trigger("dxclick");

    this.clock.tick();

    // assert
    assert.equal(testElement.find('td').first().find(".dx-sort-up").length, 0, "not has element with class dx-sort-up");
    assert.equal(testElement.find('td').first().find(".dx-sort-down").length, 0, "not has element with class dx-sort-down");
});

QUnit.test("Get context menu items with sorting column", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0, sortOrder: 'asc' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.sorting = {
        mode: "single",
        ascendingText: "Sort Ascending",
        descendingText: "Sort Descending",
        clearText: "Clear Sorting"
    };

    this.options.onContextMenuPreparing = function(e) {
        items = e.items;
    };

    this.contextMenuController.init();
    this.contextMenuView.render(testElement);

    this.columnHeadersView.render(testElement);
    var cells = dataGridMocks.getCells(testElement);

    // act
    $(cells[0]).trigger("contextmenu");

    // assert
    assert.equal(items.length, 3, "count menu items");
    assert.strictEqual(items[0].text, "Sort Ascending", "text menu item 1");
    assert.strictEqual(items[0].value, "asc", "value menu item 1");
    assert.strictEqual(items[0].icon, "context-menu-sort-asc", "imageCss menu item 1");
    assert.ok(typeUtils.isFunction(items[0].onItemClick), "onItemClick menu item 1");

    assert.strictEqual(items[1].text, "Sort Descending", "text menu item 2");
    assert.strictEqual(items[1].value, "desc", "value menu item 2");
    assert.strictEqual(items[1].icon, "context-menu-sort-desc", "imageCss menu item 2");
    assert.ok(typeUtils.isFunction(items[1].onItemClick), "onItemClick menu item 2");

    assert.strictEqual(items[2].text, "Clear Sorting", "text menu item 3");
    assert.strictEqual(items[2].value, "none", "value menu item 3");
    assert.strictEqual(items[2].icon, "context-menu-sort-none", "imageCss menu item 3");
    assert.ok(typeUtils.isFunction(items[2].onItemClick), "onItemClick menu item 3");
});

// T431994
QUnit.test("Get context menu items with sorting column after change sorting", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0, sortOrder: 'asc' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.sorting = {
        mode: "single"
    };

    this.options.onContextMenuPreparing = function(e) {
        items = e.items;
    };

    var getVisibleColumns = this.columnsController.getVisibleColumns;

    this.columnsController.getVisibleColumns = function() {
        var columns = getVisibleColumns.apply(this, arguments);
        return $.extend(true, [], columns);
    };

    this.contextMenuController.init();
    this.contextMenuView.render(testElement);
    this.columnHeadersView.render(testElement);

    // act
    this.columns[0].sortOrder = undefined;

    this.columnsController.columnsChanged.fire({ changeTypes: { sorting: true, length: 1 }, optionNames: {} });

    var cells = dataGridMocks.getCells(testElement);
    $(cells[0]).trigger("contextmenu");

    // assert
    assert.equal(items.length, 3, "count menu items");
    assert.strictEqual(items[0].value, "asc", "value menu item 1");
    assert.strictEqual(items[0].icon, "context-menu-sort-asc", "imageCss menu item 1");
    assert.strictEqual(items[0].disabled, false, "disabled menu item 1");

    assert.strictEqual(items[1].value, "desc", "value menu item 2");
    assert.strictEqual(items[1].icon, "context-menu-sort-desc", "imageCss menu item 2");
    assert.strictEqual(items[1].disabled, false, "disabled menu item 2");

    assert.strictEqual(items[2].value, "none", "value menu item 3");
    assert.strictEqual(items[2].icon, "context-menu-sort-none", "imageCss menu item 3");
    assert.strictEqual(items[2].disabled, true, "disabled menu item 3");
});

QUnit.test("Get context menu items without sorting column", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.sorting = {
        mode: "single"
    };

    this.columnHeadersView.render(testElement);
    var cells = dataGridMocks.getCells(testElement);

    // act
    items = this.columnHeadersView.getContextMenuItems($(cells[0]));

    // T386078
    // assert
    assert.ok(!items, "count menu items");
});

QUnit.test("Show context menu when click on header", function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.sorting = {
        mode: "single",
        ascendingText: "Sort Ascending",
        descendingText: "Sort Descending",
        clearText: "Clear Sorting"
    };

    this.columnHeadersView.render(testElement);
    this.contextMenuView.render(testElement);
    var cells = dataGridMocks.getCells(testElement);

    // act
    $(cells[0]).trigger("contextmenu");

    assert.equal($(".dx-viewport").children(".dx-overlay-wrapper").find(".dx-context-menu").length, 1, "has popup menu");
    assert.strictEqual($(".dx-viewport").children(".dx-overlay-wrapper").find(".dx-context-menu").first().find(".dx-menu-item-text").eq(0).text(), "Sort Ascending", "text item 1");
    assert.strictEqual($(".dx-viewport").children(".dx-overlay-wrapper").find(".dx-context-menu").first().find(".dx-menu-item-text").eq(1).text(), "Sort Descending", "text item 2");
    assert.strictEqual($(".dx-viewport").children(".dx-overlay-wrapper").find(".dx-context-menu").first().find(".dx-menu-item-text").eq(2).text(), "Clear Sorting", "text item 3");
});

QUnit.test('Apply sorting by click using column indexes', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ index: 1 }, { index: 0, alignment: 'right', allowSorting: true, sortOrder: 'desc' }]);

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.equal(testElement.find('td').last().find('.' + "dx-sort").length, 1);

    // act
    testElement.find('td').last().trigger("dxclick");

    this.clock.tick();
    // assert
    assert.strictEqual(testElement.find('td').last().find('.' + "dx-sort").length, 0);
});

QUnit.test('Apply alignment for sorting', function(assert) {
    // arrange
    var columns = [{ alignment: 'right', sortOrder: 'asc', allowSorting: true }, { alignment: 'left', sortOrder: 'asc', allowSorting: true }, { alignment: 'center', sortOrder: 'asc', allowSorting: true }],
        testElement = $('#container');

    this.options.showColumnLines = true;

    // act, assert
    this.columnHeadersView._applyColumnState({
        name: "sort",
        rootElement: testElement,
        column: columns[0],
        showColumnLines: true
    });
    assert.equal(testElement.find('.dx-sort').length, 1, 'dx-sort container count');
    assert.equal(testElement.find('.dx-sort').parent().css('float'), 'left', 'left alignment');
    assert.ok(testElement.find('.dx-sort').hasClass('dx-sort-up'), 'sort up class');
    testElement.empty();

    // act, assert
    this.columnHeadersView._applyColumnState({
        name: "sort",
        rootElement: testElement,
        column: columns[1],
        showColumnLines: true
    });
    assert.equal(testElement.find('.dx-sort').length, 1, 'dx-sort container count');
    assert.equal(testElement.find('.dx-sort').parent().css('float'), 'right', 'right alignment');
    assert.ok(testElement.find('.dx-sort').hasClass('dx-sort-up'), 'sort up class');
    testElement.empty();

    // act, assert
    this.columnHeadersView._applyColumnState({
        name: "sort",
        rootElement: testElement,
        column: columns[2],
        showColumnLines: true
    });
    assert.equal(testElement.find('.dx-sort').length, 1, 'dx-sort container count');
    assert.equal(testElement.find('.dx-sort').parent().css('float'), 'right', 'center alignment');
    assert.ok(testElement.find('.dx-sort').hasClass('dx-sort-up'), 'sort up class');
});

QUnit.test('Select all is completed', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);

    this.options.selection = { allowSelectAll: true };

    // act
    this.columnHeadersView.render(testElement);
    var checkBox = testElement.find('.dx-checkbox');
    checkBox.trigger("dxclick");

    // assert
    assert.ok(this.selectionController.isSelectAll(), 'select all');
});

QUnit.test('Select all checkbox state when isSelected items exists', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);
    this.selectionController.selectRows([1]);

    this.options.selection = { allowSelectAll: true };

    // act
    this.columnHeadersView.render(testElement);
    var checkBox = testElement.find('.dx-checkbox');

    // assert
    assert.strictEqual(checkBox.length, 1);
    assert.strictEqual(checkBox.dxCheckBox('instance').option('value'), undefined, 'intermediate checkbox value ');
});

QUnit.test('Click Select all checkbox when isSelected items exists', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);
    this.selectionController.selectRows([1]);

    this.options.selection = { allowSelectAll: true };

    this.columnHeadersView.render(testElement);
    var checkBox = testElement.find('.dx-checkbox');
    // act
    checkBox.trigger("dxclick");

    // assert
    assert.ok(this.selectionController.isSelectAll(), 'select all');
    assert.strictEqual(checkBox.dxCheckBox('instance').option('value'), true, 'checkbox value false');
    assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), true, 'checkbox is visible');
});

QUnit.test('Select all button when isSelected items exists and when allowSelectAll is false', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);

    this.selectionController.selectRows([1]);

    this.options.selection = { allowSelectAll: false };

    // act
    this.columnHeadersView.render(testElement);
    var checkBox = testElement.find('.dx-checkbox');

    // assert
    assert.strictEqual(checkBox.length, 1);
    assert.strictEqual(checkBox.dxCheckBox('instance').option('value'), undefined, 'intermediate checkbox value');

    // act
    checkBox.trigger("dxclick");

    // assert
    assert.ok(!this.selectionController.isSelectAll(), 'select all');
    assert.strictEqual(checkBox.dxCheckBox('instance').option('value'), false, 'checkbox value false');
    assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), false, 'checkbox is not visible');
});

QUnit.test('Select all is not work when allowSelectAll is false', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);

    this.options.selection = { allowSelectAll: false };

    this.columnHeadersView.render(testElement);
    var checkBox = testElement.find('.dx-checkbox');
    assert.strictEqual(checkBox.length, 1);
    assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), false, 'checkbox is not visible');

    // act
    checkBox.trigger('dxclick');

    // assert
    assert.ok(!this.selectionController.isSelectAll(), 'not isSelectAll');
    assert.strictEqual(checkBox.dxCheckBox('instance').option('value'), false, 'checkbox value');
    assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), false, 'checkbox is not visible');
});

// T546876
QUnit.test("onCellClick event should be fired after clicking on 'Select All' checkbox", function(assert) {
    // arrange
    var checkBox,
        cellClickEventFired,
        testElement = $('#container');

    $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);
    this.options.selection = { allowSelectAll: true };
    this.options.onCellClick = function() {
        cellClickEventFired = true;
    };
    this.columnHeadersView.init();
    this.columnHeadersView.render(testElement);

    // act
    checkBox = testElement.find('.dx-checkbox');
    checkBox.trigger("dxclick");

    // assert
    assert.ok(cellClickEventFired, "onCellClick event is fired");
});

QUnit.test('Unselect all is completed', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);

    this.options.selection = { allowSelectAll: false };
    this.selectionController.selectAll();

    // act
    this.columnHeadersView.render(testElement);
    var checkBox = testElement.find('.dx-checkbox');
    assert.strictEqual(checkBox.length, 1, 'checkbox exists');
    assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), true, 'checkbox is visible');
    checkBox.trigger("dxclick");

    // assert
    assert.ok(!this.selectionController.isSelectAll(), 'not select all');
    assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), false, 'checkbox is not visible');
});

QUnit.test('Cursor is changed when column has allowSorting', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ allowSorting: true }, { allowReordering: true }, { allowHiding: true }, {}, { allowSorting: true, allowReordering: true, allowHiding: true }]);
    this.options.sorting = { mode: 'single' };

    // act
    this.columnHeadersView.render(testElement);

    // assert
    var cells = testElement.find('td');
    assert.ok($(cells[0]).hasClass("dx-datagrid-action"), 'cursor style of cells 0');
    assert.ok(!$(cells[1]).hasClass("dx-datagrid-action"), 'cursor style of cells 1');
    assert.ok(!$(cells[2]).hasClass("dx-datagrid-action"), 'cursor style of cells 2');
    assert.ok(!$(cells[3]).hasClass("dx-datagrid-action"), 'cursor style of cells 3');
    assert.ok($(cells[4]).hasClass("dx-datagrid-action"), 'cursor style of cells 4');
});

QUnit.test('Check correct work getColumnsWidth without columns', function(assert) {
    // act
    this.columnHeadersView.render($('#container'));
    // assert
    assert.deepEqual(this.columnHeadersView.getColumnWidths(), [], 'empty column widths');
});

QUnit.test('render headers with correct text width when sorting', function(assert) {
    // arrange
    var $cellElement,
        $cellContentElement,
        $testElement = $('#container').width(50);

    $.extend(this.columns, [
        { alignment: "left", sortOrder: 'asc', allowSorting: true, caption: 'testtesttesttesttesttest1' },
        { alignment: "left", caption: 'testtesttesttesttesttest2' }
    ]);

    this.columnHeadersView.render($testElement);

    // assert
    $cellElement = $testElement.find(".dx-header-row td").eq(0);
    $cellContentElement = $cellElement.children(".dx-datagrid-text-content");

    assert.ok($cellContentElement.width() < $cellElement.width(), "width of the cell content");
});

QUnit.test('recalculate headers text width on windowResize', function(assert) {
    // arrange
    var $cellElement,
        $cellContentElement,
        $testElement = $('#container').width(100),
        width;

    $.extend(this.columns, [
        { alignment: "left", sortOrder: 'asc', allowSorting: true, caption: 'testtesttesttesttesttest1' },
        { alignment: "left", caption: 'testtesttesttesttesttest2' }
    ]);

    this.columnHeadersView.render($testElement);

    $cellElement = $testElement.find(".dx-header-row td").eq(0);
    $cellContentElement = $cellElement.children(".dx-datagrid-text-content");

    // assert
    width = $cellContentElement.width();
    assert.ok(width < $cellElement.width(), "width of the cell content");

    // act
    $testElement.width(50);

    // assert
    assert.ok($cellContentElement.width() < width, "width of the cell content");
});

QUnit.test('Add class nowrap when wordWrapEnabled false', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
        { caption: 'Column 4' }, { caption: 'Column 5' }]);

    this.options.wordWrapEnabled = false;

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.ok($('.dx-datagrid-headers').hasClass('dx-datagrid-nowrap'));
});

QUnit.test('Remove class nowrap when wordWrapEnabled true', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
        { caption: 'Column 4' }, { caption: 'Column 5' }]);

    this.options.wordWrapEnabled = true;

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.ok(!$('.dx-datagrid-headers').hasClass('dx-datagrid-nowrap'));
});

// T257668
QUnit.test('Remove class nowrap when wordWrapEnabled true and columnAutoWidth true', function(assert) {
    // arrange
    var testElement = $('#container');

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
        { caption: 'Column 4' }, { caption: 'Column 5' }]);

    this.options.wordWrapEnabled = true;
    this.options.columnAutoWidth = true;

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.ok(!$('.dx-datagrid-headers').hasClass('dx-datagrid-nowrap'), "no has class dx-datagrid-nowrap");
});

// B254106
QUnit.test('Not get header elements when showColumnHeaders false', function(assert) {
    // arrange
    var testElement = $('#container'),
        headerElements;

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
        { caption: 'Column 4' }, { caption: 'Column 5' }]);

    this.options = {
        showColumnHeaders: false,
        filterRow: {
            visible: true
        }
    };

    this.columnHeadersView.render(testElement);

    // act
    headerElements = this.columnHeadersView.getColumnElements();

    // assert
    assert.ok(!testElement.find('.dx-header-row').length, 'not draw header columns');
    assert.ok(!headerElements, 'not get header elements ');
});

QUnit.test('Custom function headerCellTemplate for column', function(assert) {
    // arrange
    var that = this,
        columnElements,
        headerCellTemplateOptions,
        testElement = $('#container');

    $.extend(that.columns, [
        { caption: 'Column 1' },
        { caption: 'Column 2' },
        {
            caption: 'Column 3', headerCellTemplate: function(container, options) {
                $(container).text('Test');
                headerCellTemplateOptions = options;
            }
        }
    ]);

    // act
    that.columnHeadersView.render(testElement);
    columnElements = that.columnHeadersView.getColumnElements();

    // assert
    assert.equal(columnElements.length, 3);
    assert.equal(getText(columnElements.eq(0)), 'Column 1');
    assert.equal(getText(columnElements.eq(1)), 'Column 2');
    assert.equal(getText(columnElements.eq(2)), 'Test');
    assert.equal(headerCellTemplateOptions.column.caption, 'Column 3', 'headerCellTemplate option column.caption');
    assert.equal(headerCellTemplateOptions.columnIndex, 2, 'headerCellTemplate option columnIndex');
});

QUnit.test('Custom headerCellTemplate as string selector for column with hogan', function(assert) {
    // arrange
    var that = this,
        columnElements,
        testElement = $('#container');

    $.extend(that.columns, [
        { caption: 'Column 1' },
        { caption: 'Column 2' },
        {
            caption: 'Column3',
            headerCellTemplate: '#hoganHeaderColumnTemplate'
        }
    ]);

    this._getTemplate = function(selector) {
        assert.equal(selector, '#hoganHeaderColumnTemplate');
        return {
            render: function(options) {
                options.container.append('<b>' + options.model.caption + '</b>');
            }
        };
    };

    // act
    that.columnHeadersView.render(testElement);
    columnElements = that.columnHeadersView.getColumnElements();

    // assert
    assert.equal(columnElements.length, 3);
    assert.equal(columnElements.last().find('b').length, 1);
});

// T117339
QUnit.test("Allow dragging when allowReordering true", function(assert) {
    // arrange
    var testElement = $('#container'),
        draggingPanels = [this.columnHeadersView, { allowDragging: function() { return false; } }, { allowDragging: function() { return false; } }];

    $.extend(this.columns, [{ caption: 'Column 1', allowReordering: true }, { caption: 'Column 2', allowReordering: true }]);

    this.options.allowColumnReordering = true;

    // act
    this.columnHeadersView.render(testElement);

    // act, assert
    assert.ok(this.columnHeadersView.allowDragging({ caption: 'Column 1', allowReordering: true }, draggingPanels), "allow dragging");
});

// T117339
QUnit.test("Not allow dragging when allowReordering true and one column", function(assert) {
    // arrange
    var testElement = $('#container'),
        draggingPanels = [this.columnHeadersView, { allowDragging: function() { return false; } }, { allowDragging: function() { return false; } }];

    $.extend(this.columns, [{ caption: 'Column 1', allowReordering: true }]);

    this.options.allowColumnReordering = true;

    // act
    this.columnHeadersView.render(testElement);

    // act, assert
    assert.ok(!this.columnHeadersView.allowDragging({ caption: 'Column 1', allowReordering: true }, draggingPanels), "not allow dragging");
});

// T117339
QUnit.test("Not allow dragging when allowReordering false", function(assert) {
    // arrange
    var testElement = $('#container'),
        draggingPanels = [this.columnHeadersView, { allowDragging: function() { return false; } }, { allowDragging: function() { return false; } }];

    $.extend(this.columns, [{ caption: 'Column 1', allowReordering: false }, { caption: 'Column 2', allowReordering: false }]);

    this.options.allowColumnReordering = false;

    // act
    this.columnHeadersView.render(testElement);

    // act, assert
    assert.ok(!this.columnHeadersView.allowDragging({ caption: 'Column 1', allowReordering: false }, draggingPanels), "not allow dragging");
});

QUnit.test("Headers with option onCellPrepared", function(assert) {
    // arrange
    var testElement = $('#container'),
        resultOptions,
        countCallCellPrepared = 0;

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
        { caption: 'Column 4' }, { caption: 'Column 5' }]);

    this.options.onCellPrepared = function(options) {
        countCallCellPrepared++;
        if(options.columnIndex === 2) {
            resultOptions = options;
        }
    };

    this.columnHeadersView.init();

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.equal(countCallCellPrepared, 5, "countCallCellPrepared");
    assert.equal(resultOptions.columnIndex, 2, "columnIndex");
    assert.strictEqual(resultOptions.rowType, "header", "rowType");
    assert.deepEqual(resultOptions.column, { caption: "Column 3" }, "column");
});

QUnit.test("onCellPrepared - header with sorting and headerFilter", function(assert) {
    // arrange
    var $testElement = $('#container'),
        resultOptions,
        countCallCellPrepared = 0;

    $.extend(this.columns, [{ caption: 'Column 1', sortOrder: "asc", allowFiltering: true }]);

    this.options.headerFilter = { visible: true };
    this.options.onCellPrepared = function(options) {
        countCallCellPrepared++;
        resultOptions = options;

        // assert
        assert.equal(typeUtils.isRenderer(options.cellElement), !!config().useJQuery, "has header filter");
        assert.ok($(options.cellElement).find(".dx-header-filter").length, "has header filter");
        assert.ok($(options.cellElement).find(".dx-sort-up").length, "has sort");
    };
    this.columnHeadersView.init();

    // act
    this.columnHeadersView.render($testElement);

    // assert
    assert.equal(countCallCellPrepared, 1, "count call cellPrepared");
    assert.equal(resultOptions.columnIndex, 0, "columnIndex");
    assert.strictEqual(resultOptions.rowType, "header", "rowType");
    assert.deepEqual(resultOptions.column, this.columns[0], "column");
});

QUnit.test("Headers with option onRowPrepared", function(assert) {
    // arrange
    var testElement = $('#container'),
        resultOptions,
        countCallRowPrepared = 0;

    $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
        { caption: 'Column 4' }, { caption: 'Column 5' }]);

    this.options.onRowPrepared = function(options) {
        countCallRowPrepared++;
        resultOptions = options;
    };

    this.columnHeadersView.init();

    // act
    this.columnHeadersView.render(testElement);

    // assert
    assert.equal(countCallRowPrepared, 1, "countCallRowPrepared");
    assert.ok(dataUtils.data($(resultOptions.rowElement).get(0), "options"), "has row options");
    assert.strictEqual(resultOptions.rowType, "header", "rowType");
    assert.deepEqual(resultOptions.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }, { caption: 'Column 4' }, { caption: 'Column 5' }], "columns");
});

QUnit.test("Invalidate instead of render for options", function(assert) {
    // arrange
    var renderCounter = 0;
    this.columnHeadersView.render($('#container'));
    this.columnHeadersView.renderCompleted.add(function() {
        renderCounter++;
    });

    // act
    this.columnHeadersView.component.isReady = function() {
        return true;
    };
    this.columnHeadersView.beginUpdate();
    this.columnHeadersView.optionChanged({ name: "showColumnHeaders" });
    this.columnHeadersView.optionChanged({ name: "wordWrapEnabled" });
    this.columnHeadersView.optionChanged({ name: "showColumnLines" });
    this.columnHeadersView.endUpdate();

    // assert
    assert.equal(renderCounter, 1, "count of rendering");
});

QUnit.test("getHeadersRowHeight with band columns", function(assert) {
    // arrange
    var $trElements,
        $testElement = $('#container');

    $.extend(this.columns, [
        [
            { caption: "Column 1", rowspan: 2, index: 0 },
            { caption: "Band column 1", isBand: true, colspan: 2, index: 1 }
        ],
        [
            { caption: "Column 2", ownerBand: "Band column 1", index: 2 },
            { caption: "Column 3", ownerBand: "Band column 1", index: 3 }
        ],
        [
            { caption: "Column 1", rowspan: 2, index: 0 },
            { caption: "Column 2", ownerBand: "Band column 1", index: 2 },
            { caption: "Column 3", ownerBand: "Band column 1", index: 3 }
        ]
    ]);

    // act
    this.columnHeadersView.render($testElement);

    // assert
    $trElements = $testElement.find("tbody > tr");
    assert.equal($trElements.length, 2, "count row");
    assert.equal(this.columnHeadersView.getHeadersRowHeight(), $trElements.first().height() * $trElements.length, "height of the headers");
});

QUnit.test("Header with headerFilter - alignment cell content", function(assert) {
    // arrange
    var $headerCellContent,
        $testElement = $('#container');

    this.options.headerFilter = { visible: true };
    $.extend(this.columns, [
        { caption: 'Column 1', allowFiltering: true, alignment: "left" },
        { caption: 'Column 2', allowFiltering: true, alignment: "center" },
        { caption: 'Column 3', allowFiltering: true, alignment: "right" }
    ]);

    // act
    this.columnHeadersView.render($testElement);

    // assert
    $headerCellContent = $testElement.find(".dx-header-row .dx-datagrid-text-content");
    assert.ok($headerCellContent.eq(0).hasClass("dx-header-filter-indicator"), "first cell content has dx-header-filter-indicator class");
    assert.notOk($headerCellContent.eq(0).hasClass("dx-sort-indicator"), "first cell content hasn't dx-sort-indicator class");
    assert.ok($headerCellContent.eq(0).hasClass("dx-text-content-alignment-left"), "first cell content has margin right");
    assert.notOk($headerCellContent.eq(0).hasClass("dx-text-content-alignment-right"), "first cell content hasn't margin left");

    assert.ok($headerCellContent.eq(1).hasClass("dx-header-filter-indicator"), "second cell content has dx-header-filter-indicator class");
    assert.notOk($headerCellContent.eq(1).hasClass("dx-sort-indicator"), "second cell content hasn't dx-sort-indicator class");
    assert.ok($headerCellContent.eq(1).hasClass("dx-text-content-alignment-left"), "second cell content has margin right");
    assert.ok($headerCellContent.eq(1).hasClass("dx-text-content-alignment-right"), "second cell content has margin left");

    assert.ok($headerCellContent.eq(2).hasClass("dx-header-filter-indicator"), "third cell content has dx-header-filter-indicator class");
    assert.notOk($headerCellContent.eq(2).hasClass("dx-sort-indicator"), "third cell content hasn't dx-sort-indicator class");
    assert.notOk($headerCellContent.eq(2).hasClass("dx-text-content-alignment-left"), "third cell content hasn't margin right");
    assert.ok($headerCellContent.eq(2).hasClass("dx-text-content-alignment-right"), "third cell content has margin left");
});

QUnit.test("Header with sorting - alignment cell content", function(assert) {
    // arrange
    var $headerCellContent,
        $testElement = $('#container');

    this.options.sorting = { mode: "single" };
    $.extend(this.columns, [
        { caption: 'Column 1', allowSorting: true, sortOrder: "asc", alignment: "left" },
        { caption: 'Column 2', allowSorting: true, alignment: "center" },
        { caption: 'Column 3', allowSorting: true, sortOrder: "desc", alignment: "right" }
    ]);

    // act
    this.columnHeadersView.render($testElement);

    // assert
    $headerCellContent = $testElement.find(".dx-header-row .dx-datagrid-text-content");
    assert.notOk($headerCellContent.eq(0).hasClass("dx-header-filter-indicator"), "first cell content has dx-header-filter-indicator class");
    assert.ok($headerCellContent.eq(0).hasClass("dx-sort-indicator"), "first cell content hasn't dx-sort-indicator class");
    assert.ok($headerCellContent.eq(0).hasClass("dx-text-content-alignment-left"), "first cell content has margin right");
    assert.notOk($headerCellContent.eq(0).hasClass("dx-text-content-alignment-right"), "first cell content hasn't margin left");

    assert.notOk($headerCellContent.eq(1).hasClass("dx-header-filter-indicator"), "second cell content has dx-header-filter-indicator class");
    assert.notOk($headerCellContent.eq(1).hasClass("dx-sort-indicator"), "second cell content hasn't dx-sort-indicator class");
    assert.ok($headerCellContent.eq(1).hasClass("dx-text-content-alignment-left"), "second cell content has margin right");
    assert.ok($headerCellContent.eq(1).hasClass("dx-text-content-alignment-right"), "second cell content has margin left");

    assert.notOk($headerCellContent.eq(2).hasClass("dx-header-filter-indicator"), "third cell content has dx-header-filter-indicator class");
    assert.ok($headerCellContent.eq(2).hasClass("dx-sort-indicator"), "third cell content hasn't dx-sort-indicator class");
    assert.notOk($headerCellContent.eq(2).hasClass("dx-text-content-alignment-left"), "third cell content hasn't margin right");
    assert.ok($headerCellContent.eq(2).hasClass("dx-text-content-alignment-right"), "third cell content has margin left");
});

QUnit.test("Header with sorting and headerFilter - alignment cell content", function(assert) {
    // arrange
    var $headerCellContent,
        $testElement = $('#container');

    this.options.sorting = { mode: "single" };
    this.options.headerFilter = { visible: true };
    $.extend(this.columns, [
        { caption: 'Column 1', allowFiltering: true, allowSorting: true, sortOrder: "asc", alignment: "left" },
        { caption: 'Column 2', allowFiltering: true, allowSorting: true, alignment: "center" },
        { caption: 'Column 3', allowFiltering: true, allowSorting: true, sortOrder: "desc", alignment: "right" }
    ]);

    // act
    this.columnHeadersView.render($testElement);

    // assert
    $headerCellContent = $testElement.find(".dx-header-row .dx-datagrid-text-content");
    assert.ok($headerCellContent.eq(0).hasClass("dx-header-filter-indicator"), "first cell content has dx-header-filter-indicator class");
    assert.ok($headerCellContent.eq(0).hasClass("dx-sort-indicator"), "first cell content hasn't dx-sort-indicator class");
    assert.ok($headerCellContent.eq(0).hasClass("dx-text-content-alignment-left"), "first cell content has margin right");
    assert.notOk($headerCellContent.eq(0).hasClass("dx-text-content-alignment-right"), "first cell content hasn't margin left");

    assert.ok($headerCellContent.eq(1).hasClass("dx-header-filter-indicator"), "second cell content has dx-header-filter-indicator class");
    assert.notOk($headerCellContent.eq(1).hasClass("dx-sort-indicator"), "second cell content hasn't dx-sort-indicator class");
    assert.ok($headerCellContent.eq(1).hasClass("dx-text-content-alignment-left"), "second cell content has margin right");
    assert.ok($headerCellContent.eq(1).hasClass("dx-text-content-alignment-right"), "second cell content has margin left");

    assert.ok($headerCellContent.eq(2).hasClass("dx-header-filter-indicator"), "third cell content has dx-header-filter-indicator class");
    assert.ok($headerCellContent.eq(2).hasClass("dx-sort-indicator"), "third cell content hasn't dx-sort-indicator class");
    assert.notOk($headerCellContent.eq(2).hasClass("dx-text-content-alignment-left"), "third cell content hasn't margin right");
    assert.ok($headerCellContent.eq(2).hasClass("dx-text-content-alignment-right"), "third cell content has margin left");
});

QUnit.test("Header without sorting and headerFilter - alignment cell content", function(assert) {
    // arrange
    var $headerCellContent,
        $testElement = $('#container');

    $.extend(this.columns, [
        { caption: 'Column 1', alignment: "left" },
        { caption: 'Column 2', alignment: "center" },
        { caption: 'Column 3', alignment: "right" }
    ]);

    // act
    this.columnHeadersView.render($testElement);

    // assert
    $headerCellContent = $testElement.find(".dx-header-row .dx-datagrid-text-content");
    assert.notOk($headerCellContent.eq(0).hasClass("dx-header-filter-indicator"), "first cell content has dx-header-filter-indicator class");
    assert.notOk($headerCellContent.eq(0).hasClass("dx-sort-indicator"), "first cell content hasn't dx-sort-indicator class");
    assert.notOk($headerCellContent.eq(0).hasClass("dx-text-content-alignment-left"), "first cell content has margin right");
    assert.notOk($headerCellContent.eq(0).hasClass("dx-text-content-alignment-right"), "first cell content hasn't margin left");

    assert.notOk($headerCellContent.eq(1).hasClass("dx-header-filter-indicator"), "second cell content has dx-header-filter-indicator class");
    assert.notOk($headerCellContent.eq(1).hasClass("dx-sort-indicator"), "second cell content hasn't dx-sort-indicator class");
    assert.notOk($headerCellContent.eq(1).hasClass("dx-text-content-alignment-left"), "second cell content has margin right");
    assert.notOk($headerCellContent.eq(1).hasClass("dx-text-content-alignment-right"), "second cell content has margin left");

    assert.notOk($headerCellContent.eq(2).hasClass("dx-header-filter-indicator"), "third cell content has dx-header-filter-indicator class");
    assert.notOk($headerCellContent.eq(2).hasClass("dx-sort-indicator"), "third cell content hasn't dx-sort-indicator class");
    assert.notOk($headerCellContent.eq(2).hasClass("dx-text-content-alignment-left"), "third cell content hasn't margin right");
    assert.notOk($headerCellContent.eq(2).hasClass("dx-text-content-alignment-right"), "third cell content has margin left");
});

// T497346
QUnit.test("Header should have alignment if there's no dataSource and sorting is enabled", function(assert) {
    // arrange
    var $headerCellContent,
        $testElement = $("#container");

    this.options.sorting = { mode: "single" };
    $.extend(this.columns, [
        { caption: 'Column 1', allowSorting: true },
        { caption: 'Column 2', allowSorting: true },
        { caption: 'Column 3', allowSorting: true }
    ]);

    // act
    this.columnHeadersView.render($testElement);

    // assert
    $headerCellContent = $testElement.find(".dx-header-row .dx-datagrid-text-content");
    assert.ok($headerCellContent.eq(0).hasClass("dx-text-content-alignment-left"), "alignment is left");
    assert.ok($headerCellContent.eq(1).hasClass("dx-text-content-alignment-left"), "alignment is left");
    assert.ok($headerCellContent.eq(2).hasClass("dx-text-content-alignment-left"), "alignment is left");
});

// T598499
QUnit.test("Not set title attribute when cell text isn't trimmed in dx-datagrid-text-content container", function(assert) {
    // arrange
    var $testElement = $("#container").addClass("dx-widget"),
        $cellElements,
        $firstContentElement,
        $lastContentElement;

    this.options.cellHintEnabled = true;
    this.options.sorting = { mode: "single" };
    $.extend(this.columns, [{ caption: "First Name", allowSorting: true }, { caption: "Last Name", allowSorting: true }]);
    this.columnHeadersView.render($testElement);
    $cellElements = dataGridMocks.getCells($testElement);

    // act
    $firstContentElement = $cellElements.first().find(".dx-datagrid-text-content");
    $firstContentElement.trigger("mousemove");

    // assert
    assert.strictEqual($firstContentElement.attr("title"), undefined, "not has attribute title in first cell");

    // act
    $lastContentElement = $cellElements.last().find(".dx-datagrid-text-content");
    $lastContentElement.trigger("mousemove");

    // assert
    assert.strictEqual($lastContentElement.attr("title"), undefined, "not has attribute title in last cell");
});

QUnit.module('Headers with grouping', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.columns = [];
        this.options = {
            showColumnHeaders: true,
            showColumnLines: false,
            grouping: {
                contextMenuEnabled: true,
                texts: {
                    groupByThisColumn: "Group by This Column",
                    ungroup: "Ungroup",
                    ungroupAll: "Ungroup All"
                }
            },
            groupPanel: {
                visible: true
            },
        };

        this.element = function() {
            return $("#container");
        };

        dataGridMocks.setupDataGridModules(this, ['data', 'columnHeaders', 'filterRow', 'selection', 'editorFactory', 'contextMenu', 'headerFilter', 'grouping', "headerPanel"], {
            initViews: true,
            controllers: {
                columns: new dataGridMocks.MockColumnsController(this.columns),
                selection: {
                    _isSelectAll: false,
                    isSelectAll: function() {
                        return this._isSelectAll;
                    },
                    selectAll: function() {
                        this._isSelectAll = true;
                        this._selectedRowKeys = [1];
                    },
                    deselectAll: function() {
                        this._isSelectAll = false;
                        this._selectedRowKeys = [];
                    },
                    clearSelection: function() {
                        this._isSelectAll = false;
                        this._selectedRowKeys = [];
                    },
                    selectRows: function(keys) {
                        this._isSelectAll = undefined;
                        this._selectedRowKeys = keys;
                    },
                    getSelectedRowKeys: function() {
                        return this._selectedRowKeys || [];
                    },
                    refresh: function() { },
                    selectionChanged: $.Callbacks()
                }
            }
        });
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("Get context menu items with grouping operations (default column)", function(assert) {
    // arrange
    var $testElement = $('#container'),
        items;

    $.extend(this.columns, [{ caption: 'Column 1', allowSorting: false, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.onContextMenuPreparing = function(e) {
        items = e.items;
    };

    this.contextMenuController.init();
    this.contextMenuView.render($testElement);

    this.columnHeadersView.render($testElement);
    var cells = dataGridMocks.getCells($testElement);

    // act
    $(cells[0]).trigger("contextmenu");

    // assert
    assert.equal(items.length, 2, "count menu items");
    assert.strictEqual(items[0].text, "Group by This Column", "text menu item 1");
    assert.strictEqual(items[0].value, "group", "value menu item 1");

    assert.strictEqual(items[1].text, "Ungroup All", "text menu item 2");
    assert.strictEqual(items[1].value, "ungroupAll", "value menu item 2");
});

QUnit.test("Get context menu items with grouping operations (showWhenGrouped column)", function(assert) {
    // arrange
    var $testElement = $('#container'),
        items;

    $.extend(this.columns, [{ caption: 'Column 1', allowSorting: false, showWhenGrouped: true, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.onContextMenuPreparing = function(e) {
        items = e.items;
    };

    this.contextMenuController.init();
    this.contextMenuView.render($testElement);

    this.columnHeadersView.render($testElement);
    var cells = dataGridMocks.getCells($testElement);

    // act
    $(cells[0]).trigger("contextmenu");

    // assert
    assert.equal(items.length, 3, "count menu items");
    assert.strictEqual(items[0].text, "Group by This Column", "text menu item 1");
    assert.strictEqual(items[0].value, "group", "value menu item 1");

    assert.strictEqual(items[1].text, "Ungroup", "text menu item 2");
    assert.strictEqual(items[1].value, "ungroup", "value menu item 2");

    assert.strictEqual(items[2].text, "Ungroup All", "text menu item 3");
    assert.strictEqual(items[2].value, "ungroupAll", "value menu item 3");
});

QUnit.test("Get context menu items with grouping operations (grouped panel item)", function(assert) {
    // arrange
    var $testElement = $('#container'),
        contextMenuArgs;

    $.extend(this.columns, [{ caption: 'Column 1', allowSorting: false, groupIndex: 0, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

    this.options.onContextMenuPreparing = function(e) {
        contextMenuArgs = e;
    };

    this.contextMenuController.init();
    this.contextMenuView.render($testElement);

    this.columnHeadersView.render($testElement);
    this.headerPanel.render($testElement);

    var $groupedColumn = $testElement.find(".dx-group-panel-item").first();

    // act
    $groupedColumn.trigger("contextmenu");

    // assert
    var items = contextMenuArgs.items;

    assert.equal(contextMenuArgs.target, "headerPanel", "context menu target");
    // T390121
    assert.deepEqual(contextMenuArgs.column, this.columns[0], "context menu column");

    assert.equal(items.length, 2, "count menu items");

    assert.strictEqual(items[0].text, "Ungroup", "text menu item 1");
    assert.strictEqual(items[0].value, "ungroup", "value menu item 1");

    assert.strictEqual(items[1].text, "Ungroup All", "text menu item 2");
    assert.strictEqual(items[1].value, "ungroupAll", "value menu item 2");
});

QUnit.module('Headers with band columns', {
    beforeEach: function() {
        var that = this;

        that.clock = sinon.useFakeTimers();

        that.columns = [];
        that.$element = function() {
            return $("#container");
        };
        that.options = {
            showColumnHeaders: true
        };

        that.setupDataGrid = function() {
            that.options.columns = that.columns;
            dataGridMocks.setupDataGridModules(that, ["data", "columns", "columnHeaders", "contextMenu", "sorting", "filterRow", "editorFactory"], {
                initViews: true,
                controllers: {
                    data: new dataGridMocks.MockDataController({ items: [] })
                }
            });
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("Draw band columns", function(assert) {
        // arrange
    var $cells,
        $trElements,
        $testElement = $('#container');

    this.columns = [{ caption: "Band column 1", columns: ["Column1", "Column2"] }, "Column3", { caption: "Band column 2", columns: ["Column4", "Column5"] }];
    this.setupDataGrid();

        // act
    this.columnHeadersView.render($testElement);

        // assert
    $trElements = $testElement.find("tbody > tr");
    $cells = $trElements.find("td");
    assert.equal($trElements.length, 2, "count row");
    assert.equal($trElements.first().children().length, 3, "count cell of the first row");
    assert.equal($trElements.last().children().length, 4, "count cell of the second row");
    assert.equal($cells.length, 7, "count cell");

        // first row
    assert.equal($cells.eq(0).text(), "Band column 1", "text of the first cell of the first row");
    assert.equal($cells.eq(0).attr("colspan"), 2, "colspan of the first cell of the first row");

    assert.equal($cells.eq(1).text(), "Column 3", "text of the second cell of the first row");
    assert.equal($cells.eq(1).attr("rowspan"), 2, "rowspan of the second cell of the first row");

    assert.equal($cells.eq(2).text(), "Band column 2", "text of the third cell of the first row");
    assert.equal($cells.eq(2).attr("colspan"), 2, "colspan of the third cell of the first row");

        // second row
    assert.equal($cells.eq(3).text(), "Column 1", "text of the first cell of the second row");
    assert.equal($cells.eq(4).text(), "Column 2", "text of the second cell of the second row");
    assert.equal($cells.eq(5).text(), "Column 4", "text of the third cell of the second row");
    assert.equal($cells.eq(6).text(), "Column 5", "text of the fourth cell of the second row");
});

QUnit.test("Draw band columns(complex hierarchy)", function(assert) {
        // arrange
    var $cells,
        $trElements,
        $testElement = $('#container');

    this.columns = ["Column1", {
        caption: "Band column 1", columns: ["Column2", {
            caption: "Band column 2", columns: ["Column3", {
                caption: "Band column 3", columns: ["Column4", {
                    caption: "Band column 4", columns: ["Column5", {
                        caption: "Band column 5", columns: ["Column6"]
                    }]
                }]
            }]
        }]
    }];
    this.setupDataGrid();

        // act
    this.columnHeadersView.render($testElement);

        // assert
    $trElements = $testElement.find("tbody > tr");
    $cells = $trElements.find("td");
    assert.equal($trElements.length, 6, "count row");
    assert.equal($trElements.eq(0).children().length, 2, "count cell of the first row");
    assert.equal($trElements.eq(1).children().length, 2, "count cell of the second row");
    assert.equal($trElements.eq(2).children().length, 2, "count cell of the third row");
    assert.equal($trElements.eq(3).children().length, 2, "count cell of the fourth row");
    assert.equal($trElements.eq(4).children().length, 2, "count cell of the fifth row");
    assert.equal($trElements.eq(5).children().length, 1, "count cell of the sixth row");
    assert.equal($cells.length, 11, "count cell");

        // first row
    assert.equal($cells.eq(0).text(), "Column 1", "text of the first cell of the first row");
    assert.equal($cells.eq(0).attr("rowspan"), 6, "rowspan of the first cell of the first row");

    assert.equal($cells.eq(1).text(), "Band column 1", "text of the second cell of the first row");
    assert.equal($cells.eq(1).attr("colspan"), 5, "colspan of the second cell of the first row");

        // second row
    assert.equal($cells.eq(2).text(), "Column 2", "text of the first cell of the second row");
    assert.equal($cells.eq(2).attr("rowspan"), 5, "rowspan of the first cell of the second row");

    assert.equal($cells.eq(3).text(), "Band column 2", "text of the second cell of the second row");
    assert.equal($cells.eq(3).attr("colspan"), 4, "colspan of the second cell of the second row");

        // third row
    assert.equal($cells.eq(4).text(), "Column 3", "text of the first cell of the third row");
    assert.equal($cells.eq(4).attr("rowspan"), 4, "rowspan of the first cell of the third row");

    assert.equal($cells.eq(5).text(), "Band column 3", "text of the second cell of the third row");
    assert.equal($cells.eq(5).attr("colspan"), 3, "colspan of the second cell of the third row");

        // fourth row
    assert.equal($cells.eq(6).text(), "Column 4", "text of the first cell of the fourth row");
    assert.equal($cells.eq(6).attr("rowspan"), 3, "rowspan of the first cell of the fourth row");

    assert.equal($cells.eq(7).text(), "Band column 4", "text of the second cell of the fourth row");
    assert.equal($cells.eq(7).attr("colspan"), 2, "colspan of the second cell of the fourth row");

        // fifth row
    assert.equal($cells.eq(8).text(), "Column 5", "text of the first cell of the fifth row");
    assert.equal($cells.eq(8).attr("rowspan"), 2, "rowspan of the first cell of the fifth row");

    assert.equal($cells.eq(9).text(), "Band column 5", "text of the second cell of the fifth row");
    assert.ok(!$cells.eq(9).attr("colspan"), "colspan of the second cell of the fifth row");

        // sixth row
    assert.equal($cells.eq(10).text(), "Column 6", "text of the first cell of the sixth row");
    assert.ok(!$cells.eq(10).attr("rowspan"), "rowspan of the first cell of the sixth row");
});

QUnit.test("getColumnElements when there is band columns", function(assert) {
    // arrange
    var $columnElements,
        $testElement = $('#container');

    this.columns = [{ caption: "Band column 1", columns: ["Column1", "Column2"] }, "Column3", { caption: "Band column 2", columns: ["Column4", "Column5"] }];
    this.setupDataGrid();
    this.columnHeadersView.render($testElement);

    // act
    $columnElements = this.columnHeadersView.getColumnElements();

    // assert
    assert.equal($columnElements.length, 5, "count data column");
    assert.strictEqual($columnElements.eq(0).text(), "Column 1", "text of the first cell");
    assert.strictEqual($columnElements.eq(1).text(), "Column 2", "text of the second cell");
    assert.strictEqual($columnElements.eq(2).text(), "Column 3", "text of the third cell");
    assert.strictEqual($columnElements.eq(3).text(), "Column 4", "text of the fourth cell");
    assert.strictEqual($columnElements.eq(4).text(), "Column 5", "text of the fifth cell");
});

QUnit.test("getColumnElements with rowIndex when there is band columns", function(assert) {
    // arrange
    var $columnElements,
        $testElement = $('#container');


    this.columns = [{ caption: "Band column 1", columns: ["Column1", "Column2"] }, "Column3", { caption: "Band column 2", columns: ["Column4", "Column5"] }];
    this.setupDataGrid();
    this.columnHeadersView.render($testElement);

    // act
    $columnElements = this.columnHeadersView.getColumnElements(0);

    // assert
    assert.equal($columnElements.length, 3, "count column");
    assert.strictEqual($columnElements.eq(0).text(), "Band column 1", "text of the first cell");
    assert.strictEqual($columnElements.eq(1).text(), "Column 3", "text of the second cell");
    assert.strictEqual($columnElements.eq(2).text(), "Band column 2", "text of the third cell");

    // act
    $columnElements = this.columnHeadersView.getColumnElements(1);

    // assert
    assert.equal($columnElements.length, 4, "count column");
    assert.strictEqual($columnElements.eq(0).text(), "Column 1", "text of the first cell");
    assert.strictEqual($columnElements.eq(1).text(), "Column 2", "text of the second cell");
    assert.strictEqual($columnElements.eq(2).text(), "Column 4", "text of the third cell");
    assert.strictEqual($columnElements.eq(3).text(), "Column 5", "text of the fourth cell");
});

QUnit.test("getColumnElements by band column", function(assert) {
    // arrange
    var $columnElements,
        $testElement = $('#container');

    this.columns = [{ caption: "Band column 1", columns: ["Column1", "Column2"] }, "Column3", { caption: "Band column 2", columns: ["Column4", "Column5"] }];
    this.setupDataGrid();
    this.columnHeadersView.render($testElement);

    // act
    $columnElements = this.columnHeadersView.getColumnElements(1, 4);

    // assert
    assert.equal($columnElements.length, 2, "count column");
    assert.strictEqual($columnElements.eq(0).text(), "Column 4", "text of the first cell");
    assert.strictEqual($columnElements.eq(1).text(), "Column 5", "text of the second cell");
});

QUnit.test("Allow dragging when allowReordering true", function(assert) {
    // arrange
    this.columns = [{ caption: "Band column 1", columns: ["Column1", "Column2"] }];
    this.options.allowColumnReordering = true;
    this.setupDataGrid();

    // act, assert
    assert.ok(this.columnHeadersView.allowDragging(this.columnsController.getVisibleColumns(1)[0]), "allow dragging");
});

QUnit.test("Not allow dragging when allowReordering true and only one band column", function(assert) {
    // arrange
    this.columns = [{ caption: "Band column 1", columns: ["Column1", "Column2"] }];
    this.options.allowColumnReordering = true;
    this.setupDataGrid();

    // act, assert
    assert.ok(!this.columnHeadersView.allowDragging(this.columnsController.getVisibleColumns(0)[0]), "not allow dragging");
});

QUnit.test("Not allow dragging when allowReordering true and one column", function(assert) {
    // arrange
    this.columns = [{ caption: "Band column 1", columns: ["Column1"] }];
    this.options.allowColumnReordering = true;
    this.setupDataGrid();

    // act, assert
    assert.ok(!this.columnHeadersView.allowDragging(this.columnsController.getVisibleColumns(1)[0]), "not allow dragging");
});

// T360137
QUnit.test("Apply sorting ascending by click from context menu", function(assert) {
    // arrange
    var $testElement = $('#container'),
        $popupMenu,
        $cell;

    this.columns = ["Column1", { caption: "Band column 1", columns: [{ caption: "Column2", allowSorting: true }, "Column3"] }];
    this.options.sorting = {
        mode: "single"
    };
    this.setupDataGrid();
    this.columnHeadersView.render($testElement);
    this.contextMenuView.render($testElement);

    $cell = $testElement.find("tbody > tr").eq(1).children().first();
    $cell.trigger("contextmenu");

    $popupMenu = $(".dx-viewport").children(".dx-overlay-wrapper").find(".dx-context-menu").first();

    // act
    $popupMenu.find(".dx-menu-item").first().trigger("dxclick");

    this.clock.tick();

    // assert
    assert.equal($cell.find(".dx-sort-up").length, 1, "has element with class dx-sort-up");
    assert.strictEqual(this.columnsController.getVisibleColumns(1)[0].sortOrder, "asc", "sort order of the first cell of the second row");
});

QUnit.test("setRowsOpacity for band column", function(assert) {
    // arrange
    var $cellElements,
        $testElement = $('#container');

    this.columns = ["Column1", { caption: "Band column 1", columns: ["Column2", { caption: "Band column 2", columns: ["Column3"] }] }];
    this.setupDataGrid();
    this.columnHeadersView.render($testElement);

    // act
    this.columnHeadersView.setRowsOpacity(1, "0.5");

    $cellElements = $testElement.find("td");

    // assert
    assert.equal($cellElements.length, 5, "count column");
    assert.equal($cellElements.eq(0).css("opacity"), 1, "opacity of the first cell of the first row");
    assert.equal($cellElements.eq(1).css("opacity"), 1, "opacity of the second cell of the first row");
    assert.equal($cellElements.eq(2).css("opacity"), 0.5, "opacity of the first cell of the second row");
    assert.equal($cellElements.eq(3).css("opacity"), 0.5, "opacity of the second cell of the second row");
    assert.equal($cellElements.eq(4).css("opacity"), 0.5, "opacity of the first cell of the third row");
});

// T360139
QUnit.test("getColumnWidths with band columns", function(assert) {
    // arrange
    var widths,
        $testElement = $('#container').width(450);

    this.columns = [
        { caption: "Column1", width: 150 },
        {
            caption: "Band column 1",
            columns: [
                { caption: "Column2", width: 100 },
                {
                    caption: "Band column 2",
                    columns: [
                        { caption: "Column3", width: 200 }
                    ]
                }
            ]
        }
    ];
    this.setupDataGrid();
    this.columnHeadersView.render($testElement);

    // act
    widths = this.columnHeadersView.getColumnWidths();

    // assert
    assert.equal(widths.length, 3, "widths of the columns");
    assert.equal(widths[0], 150, "width of the first cell of the first row");
    assert.equal(widths[1], 100, "width of the first cell of the second row");
    assert.equal(widths[2], 200, "width of the first cell of the third row");
});

// T377673
QUnit.test("getColumnElements by band column with hidden children where filter row is visible", function(assert) {
    // arrange
    var $columnElements,
        $testElement = $('#container');

    this.options.filterRow = { visible: true };
    this.columns = ["Column1", "Column2", "Column3", { caption: "Band column 2", columns: [{ dataField: "Column4", visible: false }, { dataField: "Column5", visible: false }] }];
    this.setupDataGrid();
    this.columnHeadersView.render($testElement);

    // act
    $columnElements = this.columnHeadersView.getColumnElements(1, 3);

    // assert
    assert.ok(!$columnElements, "no cells");
});

QUnit.test("DataGrid headers has dx-header-multi-row class for multi-row headers (bands)", function(assert) {
    // arrange
    var $testElement = $('#container');
    this.columns = [{ caption: "Band column 1", columns: ["Column1", "Column2"] }, "Column3", { caption: "Band column 2", columns: ["Column4", "Column5"] }];
    this.setupDataGrid();

    // act
    this.columnHeadersView.render($testElement);

    // assert
    var $headers = $testElement.find(".dx-datagrid-headers");
    assert.ok($headers.hasClass("dx-header-multi-row"));
});

QUnit.test("DataGrid headers has no dx-header-multi-row class for single-row headers", function(assert) {
    // arrange
    var $testElement = $('#container');
    this.columns = [{ caption: "Band column 1" }, "Column3", { caption: "Band column 2" }];
    this.setupDataGrid();

    // act
    this.columnHeadersView.render($testElement);

    // assert
    var $headers = $testElement.find(".dx-datagrid-headers");
    assert.notOk($headers.hasClass("dx-header-multi-row"));
});

// T652025
QUnit.test("The grid should ignore the width of the band column", function(assert) {
    // arrange
    var $bandColumnElements,
        $testElement = $('#container');

    this.columns = [
        {
            caption: "Band column 1",
            columns: [
                { caption: "Column2" }
            ],
            width: 100
        },
        {
            caption: "Band column 2",
            columns: [
                { caption: "Column3" }
            ],
            width: 200
        }
    ];
    this.options.columnAutoWidth = true;
    this.setupDataGrid();

    // act
    this.columnHeadersView.render($testElement);

    // assert
    $bandColumnElements = $testElement.find(".dx-header-row").first().children();
    assert.strictEqual($bandColumnElements.length, 2, "band column count");

    assert.strictEqual($bandColumnElements.get(0).style.width, "");
    assert.strictEqual($bandColumnElements.get(0).style.minWidth, "");
    assert.strictEqual($bandColumnElements.get(0).style.maxWidth, "");

    assert.strictEqual($bandColumnElements.get(1).style.width, "");
    assert.strictEqual($bandColumnElements.get(1).style.minWidth, "");
    assert.strictEqual($bandColumnElements.get(1).style.maxWidth, "");
});
