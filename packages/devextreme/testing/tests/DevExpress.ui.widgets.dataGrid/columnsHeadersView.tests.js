import 'generic_light.css!';

import $ from 'jquery';
import dataUtils from 'core/element_data';
import typeUtils from 'core/utils/type';
import { format } from 'core/utils/string';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import { DataSource } from 'common/data/data_source/data_source';
import dataGridMocks from '../../helpers/dataGridMocks.js';
import { findShadowHostOrDocument } from '../../helpers/dataGridHelper.js';
import dateLocalization from 'common/core/localization/date';
import messageLocalization from 'common/core/localization/message';
import { addShadowDomStyles } from 'core/utils/shadow_dom.js';

import 'ui/data_grid';

const SORT_INDEX_ICON_SELECTOR = '.dx-sort-index-icon';
const SORT_INDEX_INDICATOR_SELECTOR = '.dx-sort-index-indicator';

$('body').addClass('dx-viewport');
QUnit.testStart(function() {
    $('#qunit-fixture').addClass('dx-viewport');

    const markup =
        `<div class="dx-widget">
            <div id="container" class="dx-datagrid"></div>
        </div>
        <div id="containerIE" class="dx-datagrid"></div>`;

    $('#qunit-fixture').html(markup);

    addShadowDomStyles($('#qunit-fixture'));
});

function getText(cell) {
    return $(cell).find('.dx-datagrid-text-content').first().text();
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
            return $('#container');
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
            const column = options.column;
            const $cellElement = $(container);

            $cellElement.addClass('dx-editor-cell');
            this.columnHeadersView._renderSelectAllCheckBox($cellElement, column);
            this.columnHeadersView._attachSelectAllCheckBoxClickEvent($cellElement);
        }.bind(this);
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
}, () => {

    QUnit.test('Bounding rect is null when no columns', function(assert) {
        // arrange
        const testElement = $('#container');

        // act
        this.columnHeadersView.render(testElement);

        // assert
        assert.equal(this.columnHeadersView.getBoundingRect(), null, 'Bounding rect is null when it has no columns');
    });

    QUnit.test('Bounding rect with columns', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [
            { caption: 'Column 1' },
            { caption: 'Column 2' },
            { caption: 'Column 3' }
        ]);

        // act
        this.columnHeadersView.render(testElement);
        const boundingRect = this.columnHeadersView.getBoundingRect();

        // assert
        assert.ok(typeUtils.isObject(boundingRect) && typeUtils.isDefined(boundingRect.top), 'Bounding rect return object with "top" property when it has columns');
    });

    QUnit.test('Bounding rect with columns in iOS (T211627)', function(assert) {
        // arrange
        const realDevice = devices.real();
        const currentDevice = devices.current();
        const testElement = $('#container');

        devices.current('iPad');
        devices._realDevice = devices.current();

        $.extend(this.columns, [
            { caption: 'Column 1' },
            { caption: 'Column 2' },
            { caption: 'Column 3' }
        ]);

        // act
        this.columnHeadersView.render(testElement);
        const boundingRect = this.columnHeadersView.getBoundingRect();

        // assert
        assert.ok(typeUtils.isObject(boundingRect) && typeUtils.isDefined(boundingRect.top), 'Bounding rect return object with "top" property when it has columns');

        devices.current(currentDevice);
        devices._realDevice = realDevice;
    });

    QUnit.test('Draw headers', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
            { caption: 'Column 4' }, { caption: 'Column 5' }]);

        // act
        this.columnHeadersView.render(testElement);
        const cells = dataGridMocks.getCells(testElement);

        // assert
        assert.equal(cells.length, 5, 'headers count');

        // T218997
        for(let i = 0; i < cells.length; i++) {
            const headerNumber = i + 1;

            assert.equal(getText(cells[i]), 'Column ' + headerNumber, headerNumber + ' header text');
            assert.ok(cells.eq(i).hasClass('dx-cell-focus-disabled'), 'focus disabled on cell');
            assert.equal(cells.eq(i).attr('role'), 'columnheader', 'Header cell has correct role');
        }
    });

    QUnit.test('Headers with cssClass', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', cssClass: 'customCssClass' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        // act
        this.columnHeadersView.render(testElement);
        const cells = dataGridMocks.getCells(testElement);

        // assert
        assert.equal(cells.length, 3, 'headers count');
        assert.ok(cells.eq(0).hasClass('customCssClass'), 'has class customCssClass');
        assert.ok(!cells.eq(1).hasClass('customCssClass'), 'not has class customCssClass');
        assert.ok(!cells.eq(2).hasClass('customCssClass'), 'not has class customCssClass');
    });

    QUnit.test('Headers with option showColumnLines true', function(assert) {
        // arrange
        const testElement = $('#container');

        this.options.showColumnLines = true;

        // act
        this.columnHeadersView.render(testElement);
        const headerRow = testElement.find('.dx-header-row');

        // assert
        assert.ok(headerRow.hasClass('dx-column-lines'), 'has class dx-column-lines');
    });

    QUnit.test('Headers with option showColumnLines false', function(assert) {
        // arrange
        const testElement = $('#container');

        // act
        this.columnHeadersView.render(testElement);
        const headerRow = testElement.find('.dx-header-row');

        // assert
        assert.ok(!headerRow.hasClass('dx-column-lines'), 'not has class dx-column-lines');
    });

    QUnit.test('Column widths keeps after render', function(assert) {
        // arrange
        const testElement = $('#container').width(300);

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
        const testElement = $('#containerIE').width(300);

        $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }]);

        // act
        this.columnHeadersView.render(testElement);
        this.columnHeadersView.setColumnWidths({ widths: [200, 100] });

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
        const testElement = $('#containerIE').width(300);

        $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }]);

        // act
        this.columnHeadersView.render(testElement);
        this.columnHeadersView.setColumnWidths({ widths: [400, 100] });
        this.columnHeadersView.scrollTo({ left: 50 });

        // act
        this.columnHeadersView.setColumnWidths({ widths: [200, 200] });

        // assert
        const $scrollContainer = this.columnHeadersView.element().find('.dx-datagrid-scroll-container');
        assert.deepEqual($scrollContainer.scrollLeft(), 50);
    });

    QUnit.test('Draw grouped column header', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand', cssClass: 'dx-command-expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        // act
        this.columnHeadersView.render(testElement);
        const cells = testElement.find('td');

        // assert
        assert.equal(cells.length, 3, 'headers count');
        assert.equal(cells.eq(0).html(), '&nbsp;', '1 group header text');
        assert.ok(cells.eq(0).hasClass('dx-command-expand'), 'dx-command-expand class added'); // T162020
        assert.ok(cells.eq(0).hasClass('dx-datagrid-group-space'), 'dx-datagrid-group-space class added');
        assert.equal(getText(cells[1]), 'Column 2', '2 header text');
        assert.equal(getText(cells[2]), 'Column 3', '3 header text');
    });

    QUnit.test('Grouped column header after change sorting', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        // act
        this.columnHeadersView.render(testElement);

        this.columns[0].sortOrder = 'desc';
        this.columns[1].sortOrder = 'asc';

        this.columnsController.columnsChanged.fire({ changeTypes: { sorting: true, length: 1 }, optionNames: {} });
        const cells = testElement.find('td');

        // assert
        assert.equal(cells.length, 3, 'headers count');
        assert.equal(cells.eq(0).html(), '&nbsp;', '1 group header html');
        assert.ok(cells.eq(1).html().indexOf('dx-sort-up') > 0, '2 header have sort indicator');
        assert.ok(cells.eq(2).html().indexOf('dx-sort') < 0, '3 header no have sort indicator');
    });

    // B255429
    QUnit.test('Updating column header after change grouping', function(assert) {
        // arrange
        const testElement = $('#container');
        let cells;

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
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.columnHeadersView.render(testElement);

        const $td = testElement.find('td').first();

        // act
        this.columnsController.columnsChanged.fire({ changeTypes: { columns: true, length: 1 }, optionNames: { filterValue: true, length: 1 }, columnIndex: 0 });
        this.dataController.changed.fire({ changeType: 'refresh' });

        // assert
        assert.strictEqual($td.get(0), testElement.find('td').first().get(0), 'cell is not updated');
    });

    // S173396
    QUnit.test('Height group space when all columns to grouping', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [
            { headerCaption: 'Column 1', groupIndex: 0, command: 'expand' },
            { headerCaption: 'Column 2', groupIndex: 1, command: 'expand' },
            { headerCaption: 'Column 3', groupIndex: 2, command: 'expand' }
        ]);

        // act
        this.columnHeadersView.render(testElement);
        const cells = testElement.find('td');

        // assert
        assert.equal(cells.length, 3, 'headers count');
        assert.strictEqual($(cells[0]).html(), '&nbsp;', '1 group space text');
        assert.strictEqual($(cells[1]).html(), '&nbsp;', '2 group space text');
        assert.strictEqual($(cells[2]).html(), '&nbsp;', '3 group space text');

        assert.ok(cells.parent().outerHeight() >= 30, 'height header');
    });

    QUnit.test('Headers element is hidden when showColumnHeaders is false_B238622', function(assert) {
        // arrange
        const testElement = $('#container');

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
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        const dataSource = new DataSource([]);

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
        const testElement = $('#container');

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
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', groupIndex: 0, command: 'expand' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        // act
        this.columnHeadersView.render(testElement);

        // assert
        assert.ok(this.columnHeadersView.element(), 'headersElement is rendered');
        assert.ok(this.columnHeadersView._tableElement, 'table element');
    });

    QUnit.test('Headers element is rendered when filter row is shown_B238622', function(assert) {
        // arrange
        const testElement = $('#container');

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
        const testElement = $('#container');

        $.extend(this.columns, [
            { caption: 'Column 1', allowFiltering: true, calculateFilterExpression: function() { }, alignment: 'left' },
            { caption: 'Column 2', allowFiltering: true, calculateFilterExpression: function() { }, alignment: 'right' },
            { caption: 'Column 3' }, // not draw filter textbox when allowFiltering is false
            { caption: 'Column 4', allowFiltering: true, calculateFilterExpression: function() { }, groupIndex: 0, command: 'expand' } // B238226
        ]);

        this.options.showColumnHeaders = false;
        this.options.filterRow = { visible: true };

        // act
        this.columnHeadersView.render(testElement);

        const $filterCell = testElement.find('.dx-datagrid-filter-row .dx-editor-cell').first();

        // assert
        const inputs = this.columnHeadersView.element().find('input');

        assert.equal($filterCell.attr('aria-label'), messageLocalization.format('dxDataGrid-ariaFilterCell'), 'Filter cell aria-label');
        assert.equal(inputs.length, 2, 'inputs count');
        assert.equal(inputs.eq(0).css('textAlign'), 'left', 'left alignment');
        assert.equal(inputs.eq(1).css('textAlign'), 'right', 'right alignment');
    });

    QUnit.test('filterRow accessibility structure', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [
            { caption: 'Column 1', allowFiltering: true },
            { caption: 'Column 2', allowFiltering: true }
        ]);

        this.options.filterRow = { visible: true };

        // act
        this.columnHeadersView.render(testElement);

        // assert
        $('.dx-datagrid-filter-row td').each((index, element) => {
            const $element = $(element);
            assert.equal($element.attr('aria-colindex'), index + 1);
            assert.equal($element.attr('role'), 'gridcell');
            assert.notOk(element.hasAttribute('aria-selected'), 'element has no aria-selected attribute'); // T1093760
        });
    });

    QUnit.test('Header columns accessibility structure', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [
            { caption: 'Column 1', allowFiltering: true },
            { caption: 'Column 2', allowFiltering: true }
        ]);

        this.options.headerFilter = { visible: true };
        this.options.selection = { mode: 'multiple' };

        // act
        this.columnHeadersView.render(testElement);
        // assert
        $('.dx-header-row > td').each((_, element) => {
            assert.equal($(element).attr('tabindex'), 0, 'header column element tabindex');
        });
        $('.dx-header-row .dx-header-filter').each((_, element) => {
            assert.equal($(element).attr('tabindex'), 0, 'headerFilter element tabindex');
        });
        assert.notOk($('.dx-header-row .dx-checkbox-container').attr('tabindex'), 'SelectAll checkbox tabindex');

        // arrange, act
        this.options.useLegacyKeyboardNavigation = true;
        this.columnHeadersView.render(testElement);
        // assert
        $('.dx-header-row > td').each((_, element) => {
            assert.equal($(element).attr('tabindex'), undefined, 'header column element tabindex');
        });
        $('.dx-header-row .dx-header-filter').each((_, element) => {
            assert.equal($(element).attr('tabindex'), undefined, 'headerFilter element tabindex');
        });
        assert.notOk($('.dx-header-row .dx-checkbox-container').attr('tabindex'), 'SelectAll checkbox tabindex');
    });

    QUnit.test('Invalidate instead of render when filterRow and sorting option is changed', function(assert) {
        // arrange
        const testElement = $('#container');
        let renderCounter = 0;

        $.extend(this.columns, [
            { caption: 'Column 1', allowFiltering: true, allowSorting: true, calculateFilterExpression: function() { }, alignment: 'left' },
            { caption: 'Column 2', allowFiltering: true, allowSorting: true, calculateFilterExpression: function() { }, alignment: 'right' },
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
        this.columnHeadersView.optionChanged({ name: 'filterRow' });
        this.columnHeadersView.optionChanged({ name: 'sorting' });
        this.columnHeadersView.optionChanged({ name: 'filterRow' });
        this.columnHeadersView.optionChanged({ name: 'sorting' });
        this.columnHeadersView.endUpdate();

        // assert
        assert.equal(renderCounter, 1);
    });

    QUnit.test('Draw filterRow with date column', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [
            { caption: 'Column 1', index: 0, allowFiltering: true, calculateFilterExpression: function() { }, filterValue: new Date('1996/7/4'), dataType: 'date', format: 'shortDate', parseValue: function(text) { return dateLocalization.parse(text); } }
        ]);

        this.options.showColumnHeaders = false;
        this.options.filterRow = { visible: true };

        // act
        this.columnHeadersView.render(testElement);

        // assert
        const $textEditor = this.columnHeadersView.element().find('.dx-texteditor');
        assert.equal($textEditor.length, 1, 'inputs count');
        assert.deepEqual($textEditor.dxDateBox('instance').option('value'), new Date(1996, 6, 4));
    });

    QUnit.test('Apply text alignment', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', alignment: 'right' }, { caption: 'Column 2', alignment: 'left' }, { caption: 'Column 3', alignment: 'center' }]);

        // act
        this.columnHeadersView.render(testElement);
        const cells = testElement.find('td');

        // assert
        assert.equal($(cells[0]).css('text-align'), 'right', 'cell 1');
        assert.equal($(cells[1]).css('text-align'), 'left', 'cell 2');
        assert.equal($(cells[2]).css('text-align'), 'center', 'cell 3');
    });

    QUnit.test('Add colgroup to table', function(assert) {
        // arrange
        const testElement = $('#container');

        this.columns.push({});

        // act
        this.columnHeadersView.render(testElement);

        // arrange
        assert.equal(testElement.find('table').find('colgroup').children('col').length, 1, '1 col element');
    });

    QUnit.test('Create col elements by columns collection', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', width: 30 }, { caption: 'Column 2', width: 50 }, { caption: 'Column 3', width: 73 },
            { caption: 'Column 4' }, { caption: 'Column 5', width: 91 }]);

        // act
        this.columnHeadersView.render(testElement);

        const cols = testElement.find('col');

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
        const $testElement = $('#container');

        $.extend(this.columns, [
            { alignment: 'center', sortOrder: 'asc' },
            { alignment: 'right', sortOrder: 'asc' },
            { alignment: 'left', sortOrder: 'desc' },
            { alignment: 'left', allowSorting: true }
        ]);

        this.options.showColumnLines = true;
        this.options.sorting = {
            mode: 'single'
        };

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $indicatorContainers = $testElement.find('.dx-column-indicators');
        const $headerCells = $testElement.find('.dx-header-row td');

        assert.equal($indicatorContainers.length, 5, 'indicator containers count');

        // first indicator container
        assert.equal($indicatorContainers.eq(0).children().length, 1, 'indicator count in first container');
        assert.notStrictEqual($indicatorContainers.eq(0).css('visibility'), 'hidden', 'indicator is visible');
        assert.ok($indicatorContainers.eq(0).children().hasClass('dx-sort'), 'sort indicator');
        assert.ok($indicatorContainers.eq(0).children().hasClass('dx-sort-up'), 'sort up');

        // hidden indicator container
        assert.equal($indicatorContainers.eq(1).children().length, 1, 'indicator count in hidden container');
        assert.strictEqual($indicatorContainers.eq(1).css('visibility'), 'hidden', 'indicator is not visible');
        assert.ok($indicatorContainers.eq(1).children().hasClass('dx-sort'), 'sort indicator');
        assert.ok($indicatorContainers.eq(1).children().hasClass('dx-sort-up'), 'sort up');

        // second indicator container
        assert.equal($indicatorContainers.eq(2).children().length, 1, 'indicator count in second container');
        assert.notStrictEqual($indicatorContainers.eq(2).css('visibility'), 'hidden', 'indicator is visible');
        assert.ok($indicatorContainers.eq(2).children().hasClass('dx-sort'), 'sort indicator');
        assert.ok($indicatorContainers.eq(2).children().hasClass('dx-sort-up'), 'sort up');

        // third indicator container
        assert.equal($indicatorContainers.eq(3).children().length, 1, 'indicator count in third container');
        assert.notStrictEqual($indicatorContainers.eq(3).css('visibility'), 'hidden', 'indicator is visible');
        assert.ok($indicatorContainers.eq(3).children().hasClass('dx-sort'), 'sort indicator');
        assert.ok($indicatorContainers.eq(3).children().hasClass('dx-sort-down'), 'sort down');

        // fourth indicator container (T383079)
        assert.equal($indicatorContainers.eq(4).children().length, 1, 'indicator count in fourth container');
        assert.notStrictEqual($indicatorContainers.eq(4).css('visibility'), 'hidden', 'indicator is visible');
        assert.ok($indicatorContainers.eq(4).children().hasClass('dx-sort'), 'sort indicator');
        assert.ok($indicatorContainers.eq(4).children().hasClass('dx-sort-none'), 'sort none');

        assert.equal($headerCells.eq(0).attr('aria-sort'), 'ascending', 'First column has ascending sort');
        assert.equal($headerCells.eq(1).attr('aria-sort'), 'ascending', 'Second column has ascending sort');
        assert.equal($headerCells.eq(2).attr('aria-sort'), 'descending', 'Third column has descending sort');
        assert.equal($headerCells.eq(3).attr('aria-sort'), 'none', 'Fourth column has no sort');
    });

    QUnit.test('Apply sorting when "showColumnLines" option is disabled', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ alignment: 'center', sortOrder: 'asc' }, { alignment: 'right', sortOrder: 'asc' },
            { alignment: 'left', sortOrder: 'desc' }, { alignment: 'left' }]);

        // act
        this.columnHeadersView.render(testElement);

        // assert
        const $indicatorContainers = testElement.find('.dx-column-indicators');
        const $headerCells = testElement.find('.dx-header-row td');

        assert.equal($indicatorContainers.length, 4, 'indicator containers count');

        // hidden indicator container
        assert.equal($indicatorContainers.eq(0).children().length, 1, 'indicator count in hidden container');
        assert.strictEqual($indicatorContainers.eq(0).css('visibility'), 'hidden', 'indicator is not visible');
        assert.ok($indicatorContainers.eq(0).children().hasClass('dx-sort'), 'sort indicator');
        assert.ok($indicatorContainers.eq(0).children().hasClass('dx-sort-up'), 'sort up');

        // first indicator container
        assert.strictEqual($headerCells.eq(1).children('.' + 'dx-datagrid-text-content').css('float'), 'none', 'float cell content');
        assert.notStrictEqual($indicatorContainers.eq(1).css('visibility'), 'hidden', 'indicator is visible');
        assert.strictEqual($indicatorContainers.eq(1).css('float'), 'none', 'float indicator');
        assert.equal($indicatorContainers.eq(1).children().length, 1, 'indicator count in first container');
        assert.ok($indicatorContainers.eq(1).children().hasClass('dx-sort'), 'sort indicator');
        assert.ok($indicatorContainers.eq(1).children().hasClass('dx-sort-up'), 'sort up');

        // second indicator container
        assert.strictEqual($headerCells.eq(2).children('.' + 'dx-datagrid-text-content').css('float'), 'none', 'float cell content');
        assert.notStrictEqual($indicatorContainers.eq(2).css('visibility'), 'hidden', 'indicator is visible');
        assert.strictEqual($indicatorContainers.eq(2).css('float'), 'none', 'float indicator');
        assert.equal($indicatorContainers.eq(2).children().length, 1, 'indicator count in second container');
        assert.ok($indicatorContainers.eq(2).children().hasClass('dx-sort'), 'sort indicator');
        assert.ok($indicatorContainers.eq(2).children().hasClass('dx-sort-up'), 'sort up');

        // third indicator container
        assert.strictEqual($headerCells.eq(3).children('.' + 'dx-datagrid-text-content').css('float'), 'none', 'float cell content');
        assert.notStrictEqual($indicatorContainers.eq(3).css('visibility'), 'hidden', 'indicator is visible');
        assert.strictEqual($indicatorContainers.eq(3).css('float'), 'none', 'float indicator');
        assert.equal($indicatorContainers.eq(3).children().length, 1, 'indicator count in third container');
        assert.ok($indicatorContainers.eq(3).children().hasClass('dx-sort'), 'sort indicator');
        assert.ok($indicatorContainers.eq(3).children().hasClass('dx-sort-down'), 'sort down');

        assert.equal($headerCells.eq(0).attr('aria-sort'), 'ascending', 'First column has ascending sort');
        assert.equal($headerCells.eq(1).attr('aria-sort'), 'ascending', 'Second column has ascending sort');
        assert.equal($headerCells.eq(2).attr('aria-sort'), 'descending', 'Third column has descending sort');
        assert.equal($headerCells.eq(3).attr('aria-sort'), 'none', 'Fourth column has no sort');
    });

    QUnit.test('Apply sorting by click', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ index: 0, alignment: 'right', allowSorting: true }]);

        // act
        this.columnHeadersView.render(testElement);

        // assert
        let sortElements = testElement.find('.dx-sort:not(.dx-sort-none)');
        assert.equal(sortElements.length, 0, 'sortElements count');


        let headerElement = testElement.find('td');
        sortElements = testElement.find('.dx-sort:not(.dx-sort-none)');
        assert.equal(sortElements.length, 0, 'not sorting');
        assert.equal(headerElement.attr('aria-sort'), 'none');

        // act
        headerElement.trigger('dxclick');

        this.clock.tick(10);
        // assert
        sortElements = testElement.find('.' + 'dx-sort-up');
        assert.equal(sortElements.length, 1, 'up sort');
        assert.equal(headerElement.attr('aria-sort'), 'ascending');

        // act
        headerElement = testElement.find('td');
        headerElement.trigger('dxclick');

        this.clock.tick(10);
        // assert
        sortElements = testElement.find('.' + 'dx-sort-down');
        assert.equal(sortElements.length, 1, 'down sort');
        assert.equal(headerElement.attr('aria-sort'), 'descending');

        // act
        headerElement = testElement.find('td');
        headerElement.eq(0).trigger('dxclick');

        this.clock.tick(10);

        // assert
        sortElements = testElement.find('.' + 'dx-sort');
        assert.ok(!$(sortElements[0]).hasClass('dx-sort-up') && !$(sortElements[0]).hasClass('dx-sort-down'), 'not sorting');
    });

    QUnit.test('No sort while cell is opened for editing in "batch" mode. T450598', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ index: 0, alignment: 'right', allowSorting: true }]);

        // act
        this.columnHeadersView.render(testElement);

        // assert
        this.options.editing = { 'mode': 'batch' };
        this.getController('editing')._isEditing = true;

        const headerElement = testElement.find('td');

        // act
        headerElement.trigger('dxclick');
        this.clock.tick(10);
        // assert
        assert.equal(headerElement.attr('aria-sort'), 'none');
    });

    QUnit.test('No sort while cell is opened for editing in "cell" mode. T450598', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ index: 0, alignment: 'right', allowSorting: true }]);

        // act
        this.columnHeadersView.render(testElement);

        // assert
        this.options.editing = { 'mode': 'cell' };
        this.getController('editing')._isEditing = true;

        const headerElement = testElement.find('td');

        // act
        headerElement.trigger('dxclick');
        this.clock.tick(10);
        // assert
        assert.equal(headerElement.attr('aria-sort'), 'none');
    });

    QUnit.test('Sort while while cell is opened for editing in "row" mode. T450598', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ index: 0, alignment: 'right', allowSorting: true }]);

        // act
        this.columnHeadersView.render(testElement);

        // assert
        this.options.editing = { 'mode': 'row' };
        this.getController('editing')._isEditing = true;

        const headerElement = testElement.find('td');

        // act
        headerElement.trigger('dxclick');
        this.clock.tick(10);
        // assert
        assert.equal(headerElement.attr('aria-sort'), 'ascending');
    });

    QUnit.test('Apply sorting ascending by click from context menu', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.sorting = {
            mode: 'single'
        };

        this.columnHeadersView.render(testElement);
        this.contextMenuView.render(testElement);
        const cells = dataGridMocks.getCells(testElement);

        $(cells[0]).trigger('contextmenu');

        const popupMenu = $('.dx-viewport').children('.dx-overlay-wrapper').find('.dx-context-menu').first();

        // act
        popupMenu.find('.dx-menu-item').first().trigger('dxclick');

        this.clock.tick(10);

        // assert
        assert.equal(testElement.find('td').first().find('.dx-sort-up').length, 1, 'has element with class dx-sort-up');
    });

    QUnit.test('Apply sorting descending by click from context menu', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.sorting = {
            mode: 'single'
        };

        this.columnHeadersView.render(testElement);
        this.contextMenuView.render(testElement);
        const cells = dataGridMocks.getCells(testElement);

        $(cells[0]).trigger('contextmenu');

        const popupMenu = $('.dx-viewport').children('.dx-overlay-wrapper').find('.dx-context-menu').first();

        // act
        popupMenu.find('.dx-menu-item').eq(1).trigger('dxclick');

        this.clock.tick(10);

        // assert
        assert.equal(testElement.find('td').first().find('.dx-sort-down').length, 1, 'has element with class dx-sort-down');
    });

    QUnit.test('Clear sorting by click from context menu', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0, sortOrder: 'asc' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.sorting = {
            mode: 'single'
        };

        this.columnHeadersView.render(testElement);
        this.contextMenuView.render(testElement);
        const cells = dataGridMocks.getCells(testElement);

        // assert
        assert.equal($(cells[0]).find('.dx-sort-up').length, 1, 'has element with class dx-sort-up');

        // arrange
        $(cells[0]).trigger('contextmenu');

        const popupMenu = $('.dx-viewport').children('.dx-overlay-wrapper').find('.dx-context-menu').first();

        // act
        popupMenu.find('.dx-menu-item').last().trigger('dxclick');

        this.clock.tick(10);

        // assert
        assert.equal(testElement.find('td').first().find('.dx-sort-up').length, 0, 'not has element with class dx-sort-up');
        assert.equal(testElement.find('td').first().find('.dx-sort-down').length, 0, 'not has element with class dx-sort-down');
    });

    QUnit.test('Get context menu items with sorting column', function(assert) {
        // arrange
        const testElement = $('#container');
        let items;

        $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0, sortOrder: 'asc' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.sorting = {
            mode: 'single',
            ascendingText: 'Sort Ascending',
            descendingText: 'Sort Descending',
            clearText: 'Clear Sorting'
        };

        this.options.onContextMenuPreparing = function(e) {
            items = e.items;
        };

        this.contextMenuController.init();
        this.contextMenuView.render(testElement);

        this.columnHeadersView.render(testElement);
        const cells = dataGridMocks.getCells(testElement);

        // act
        $(cells[0]).trigger('contextmenu');

        // assert
        assert.equal(items.length, 3, 'count menu items');
        assert.strictEqual(items[0].text, 'Sort Ascending', 'text menu item 1');
        assert.strictEqual(items[0].value, 'asc', 'value menu item 1');
        assert.strictEqual(items[0].icon, 'context-menu-sort-asc', 'imageCss menu item 1');
        assert.ok(typeUtils.isFunction(items[0].onItemClick), 'onItemClick menu item 1');

        assert.strictEqual(items[1].text, 'Sort Descending', 'text menu item 2');
        assert.strictEqual(items[1].value, 'desc', 'value menu item 2');
        assert.strictEqual(items[1].icon, 'context-menu-sort-desc', 'imageCss menu item 2');
        assert.ok(typeUtils.isFunction(items[1].onItemClick), 'onItemClick menu item 2');

        assert.strictEqual(items[2].text, 'Clear Sorting', 'text menu item 3');
        assert.strictEqual(items[2].value, 'none', 'value menu item 3');
        assert.strictEqual(items[2].icon, 'context-menu-sort-none', 'imageCss menu item 3');
        assert.ok(typeUtils.isFunction(items[2].onItemClick), 'onItemClick menu item 3');
    });

    // T431994
    QUnit.test('Get context menu items with sorting column after change sorting', function(assert) {
        // arrange
        const testElement = $('#container');
        let items;

        $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true, index: 0, sortOrder: 'asc' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.sorting = {
            mode: 'single'
        };

        this.options.onContextMenuPreparing = function(e) {
            items = e.items;
        };

        const getVisibleColumns = this.columnsController.getVisibleColumns;

        this.columnsController.getVisibleColumns = function() {
            const columns = getVisibleColumns.apply(this, arguments);
            return $.extend(true, [], columns);
        };

        this.contextMenuController.init();
        this.contextMenuView.render(testElement);
        this.columnHeadersView.render(testElement);

        // act
        this.columns[0].sortOrder = undefined;

        this.columnsController.columnsChanged.fire({ changeTypes: { sorting: true, length: 1 }, optionNames: {} });

        const cells = dataGridMocks.getCells(testElement);
        $(cells[0]).trigger('contextmenu');

        // assert
        assert.equal(items.length, 3, 'count menu items');
        assert.strictEqual(items[0].value, 'asc', 'value menu item 1');
        assert.strictEqual(items[0].icon, 'context-menu-sort-asc', 'imageCss menu item 1');
        assert.strictEqual(items[0].disabled, false, 'disabled menu item 1');

        assert.strictEqual(items[1].value, 'desc', 'value menu item 2');
        assert.strictEqual(items[1].icon, 'context-menu-sort-desc', 'imageCss menu item 2');
        assert.strictEqual(items[1].disabled, false, 'disabled menu item 2');

        assert.strictEqual(items[2].value, 'none', 'value menu item 3');
        assert.strictEqual(items[2].icon, 'context-menu-sort-none', 'imageCss menu item 3');
        assert.strictEqual(items[2].disabled, true, 'disabled menu item 3');
    });

    QUnit.test('Get context menu items without sorting column', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.sorting = {
            mode: 'single'
        };

        this.columnHeadersView.render(testElement);
        const cells = dataGridMocks.getCells(testElement);

        // act
        const items = this.columnHeadersView.getContextMenuItems($(cells[0]));

        // T386078
        // assert
        assert.ok(!items, 'count menu items');
    });

    QUnit.test('Show context menu when click on header', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowSorting: true }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.sorting = {
            mode: 'single',
            ascendingText: 'Sort Ascending',
            descendingText: 'Sort Descending',
            clearText: 'Clear Sorting'
        };

        this.columnHeadersView.render(testElement);
        this.contextMenuView.render(testElement);
        const cells = dataGridMocks.getCells(testElement);

        // act
        $(cells[0]).trigger('contextmenu');

        assert.equal($('.dx-viewport').children('.dx-overlay-wrapper').find('.dx-context-menu').length, 1, 'has popup menu');
        assert.strictEqual($('.dx-viewport').children('.dx-overlay-wrapper').find('.dx-context-menu').first().find('.dx-menu-item-text').eq(0).text(), 'Sort Ascending', 'text item 1');
        assert.strictEqual($('.dx-viewport').children('.dx-overlay-wrapper').find('.dx-context-menu').first().find('.dx-menu-item-text').eq(1).text(), 'Sort Descending', 'text item 2');
        assert.strictEqual($('.dx-viewport').children('.dx-overlay-wrapper').find('.dx-context-menu').first().find('.dx-menu-item-text').eq(2).text(), 'Clear Sorting', 'text item 3');
    });

    QUnit.test('Apply sorting by click using column indexes', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ index: 1 }, { index: 0, alignment: 'right', allowSorting: true, sortOrder: 'desc' }]);

        // act
        this.columnHeadersView.render(testElement);

        // assert
        assert.equal(testElement.find('td').last().find('.dx-sort:not(.dx-sort-none)').length, 1);

        // act
        testElement.find('td').last().trigger('dxclick');

        this.clock.tick(10);
        // assert
        assert.strictEqual(testElement.find('td').last().find('.dx-sort:not(.dx-sort-none)').length, 0);
    });

    QUnit.test('Apply alignment for sorting', function(assert) {
        // arrange
        const columns = [{ alignment: 'right', sortOrder: 'asc', allowSorting: true }, { alignment: 'left', sortOrder: 'asc', allowSorting: true }, { alignment: 'center', sortOrder: 'asc', allowSorting: true }];
        const testElement = $('#container');

        this.options.showColumnLines = true;

        // act, assert
        this.columnHeadersView._applyColumnState({
            name: 'sort',
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
            name: 'sort',
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
            name: 'sort',
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
        const testElement = $('#container');

        $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);

        this.options.selection = { allowSelectAll: true };

        // act
        this.columnHeadersView.render(testElement);
        const checkBox = testElement.find('.dx-checkbox');
        checkBox.trigger('dxclick');

        // assert
        assert.ok(this.selectionController.isSelectAll(), 'select all');
    });

    QUnit.test('Select all checkbox state when isSelected items exists', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);
        this.selectionController.selectRows([1]);

        this.options.selection = { allowSelectAll: true };

        // act
        this.columnHeadersView.render(testElement);
        const checkBox = testElement.find('.dx-checkbox');

        // assert
        assert.strictEqual(checkBox.length, 1);
        assert.strictEqual(checkBox.dxCheckBox('instance').option('value'), undefined, 'intermediate checkbox value ');
    });

    QUnit.test('Click Select all checkbox when isSelected items exists', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);
        this.selectionController.selectRows([1]);

        this.options.selection = { allowSelectAll: true };

        this.columnHeadersView.render(testElement);
        const checkBox = testElement.find('.dx-checkbox');
        // act
        checkBox.trigger('dxclick');

        // assert
        assert.ok(this.selectionController.isSelectAll(), 'select all');
        assert.strictEqual(checkBox.dxCheckBox('instance').option('value'), true, 'checkbox value false');
        assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), true, 'checkbox is visible');
    });

    QUnit.test('Select all button when isSelected items exists and when allowSelectAll is false', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);

        this.selectionController.selectRows([1]);

        this.options.selection = { allowSelectAll: false };

        // act
        this.columnHeadersView.render(testElement);
        const checkBox = testElement.find('.dx-checkbox');

        // assert
        assert.strictEqual(checkBox.length, 1);
        assert.strictEqual(checkBox.dxCheckBox('instance').option('value'), undefined, 'intermediate checkbox value');

        // act
        checkBox.trigger('dxclick');

        // assert
        assert.ok(!this.selectionController.isSelectAll(), 'select all');
        assert.strictEqual(checkBox.dxCheckBox('instance').option('value'), false, 'checkbox value false');
        assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), false, 'checkbox is not visible');
    });

    QUnit.test('Select all is not work when allowSelectAll is false', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);

        this.options.selection = { allowSelectAll: false };

        this.columnHeadersView.render(testElement);
        const checkBox = testElement.find('.dx-checkbox');
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
    QUnit.test('onCellClick event should be fired after clicking on \'Select All\' checkbox', function(assert) {
        // arrange
        let cellClickEventFired;
        const testElement = $('#container');

        $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);
        this.options.selection = { allowSelectAll: true };
        this.options.onCellClick = function() {
            cellClickEventFired = true;
        };
        this.columnHeadersView.init();
        this.columnHeadersView.render(testElement);

        // act
        const checkBox = testElement.find('.dx-checkbox');
        checkBox.trigger('dxclick');

        // assert
        assert.ok(cellClickEventFired, 'onCellClick event is fired');
    });

    QUnit.test('Unselect all is completed', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ command: 'select', dataType: 'boolean', headerCellTemplate: this.defaultSelectionHeaderTemplate }, { index: 0 }, { index: 1 }]);

        this.options.selection = { allowSelectAll: false };
        this.dataController.items = function() {
            return [{}];
        };
        this.selectionController.selectAll();

        // act
        this.columnHeadersView.render(testElement);
        const checkBox = testElement.find('.dx-checkbox');
        assert.strictEqual(checkBox.length, 1, 'checkbox exists');
        assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), true, 'checkbox is visible');
        checkBox.trigger('dxclick');

        // assert
        assert.ok(!this.selectionController.isSelectAll(), 'not select all');
        assert.strictEqual(checkBox.dxCheckBox('instance').option('visible'), false, 'checkbox is not visible');
    });

    QUnit.test('Cursor is changed when column has allowSorting', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ allowSorting: true }, { allowReordering: true }, { allowHiding: true }, {}, { allowSorting: true, allowReordering: true, allowHiding: true }]);
        this.options.sorting = { mode: 'single' };

        // act
        this.columnHeadersView.render(testElement);

        // assert
        const cells = testElement.find('td');
        assert.ok($(cells[0]).hasClass('dx-datagrid-action'), 'cursor style of cells 0');
        assert.ok(!$(cells[1]).hasClass('dx-datagrid-action'), 'cursor style of cells 1');
        assert.ok(!$(cells[2]).hasClass('dx-datagrid-action'), 'cursor style of cells 2');
        assert.ok(!$(cells[3]).hasClass('dx-datagrid-action'), 'cursor style of cells 3');
        assert.ok($(cells[4]).hasClass('dx-datagrid-action'), 'cursor style of cells 4');
    });

    QUnit.test('Check correct work getColumnsWidth without columns', function(assert) {
        // act
        this.columnHeadersView.render($('#container'));
        // assert
        assert.deepEqual(this.columnHeadersView.getColumnWidths(), [], 'empty column widths');
    });

    QUnit.test('render headers with correct text width when sorting', function(assert) {
        // arrange
        const $testElement = $('#container').width(50);

        $.extend(this.columns, [
            { alignment: 'left', sortOrder: 'asc', allowSorting: true, caption: 'testtesttesttesttesttest1' },
            { alignment: 'left', caption: 'testtesttesttesttesttest2' }
        ]);

        this.columnHeadersView.render($testElement);

        // assert
        const $cellElement = $testElement.find('.dx-header-row td').eq(0);
        const $cellContentElement = $cellElement.children('.dx-datagrid-text-content');

        assert.ok($cellContentElement.width() < $cellElement.width(), 'width of the cell content');
    });

    QUnit.test('recalculate headers text width on windowResize', function(assert) {
        // arrange
        const $testElement = $('#container').width(100);

        $.extend(this.columns, [
            { alignment: 'left', sortOrder: 'asc', allowSorting: true, caption: 'testtesttesttesttesttest1' },
            { alignment: 'left', caption: 'testtesttesttesttesttest2' }
        ]);

        this.columnHeadersView.render($testElement);

        const $cellElement = $testElement.find('.dx-header-row td').eq(0);
        const $cellContentElement = $cellElement.children('.dx-datagrid-text-content');

        // assert
        const width = $cellContentElement.width();
        assert.ok(width < $cellElement.width(), 'width of the cell content');

        // act
        $testElement.width(50);

        // assert
        assert.ok($cellContentElement.width() < width, 'width of the cell content');
    });

    QUnit.test('Add class nowrap when wordWrapEnabled false', function(assert) {
        // arrange
        const testElement = $('#container');

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
        const testElement = $('#container');

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
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
            { caption: 'Column 4' }, { caption: 'Column 5' }]);

        this.options.wordWrapEnabled = true;
        this.options.columnAutoWidth = true;

        // act
        this.columnHeadersView.render(testElement);

        // assert
        assert.ok(!$('.dx-datagrid-headers').hasClass('dx-datagrid-nowrap'), 'no has class dx-datagrid-nowrap');
    });

    // B254106
    QUnit.test('Not get header elements when showColumnHeaders false', function(assert) {
        // arrange
        const testElement = $('#container');

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
        const headerElements = this.columnHeadersView.getColumnElements();

        // assert
        assert.ok(!testElement.find('.dx-header-row').length, 'not draw header columns');
        assert.ok(!headerElements, 'not get header elements ');
    });

    QUnit.test('Custom function headerCellTemplate for column', function(assert) {
        // arrange
        const that = this;
        let headerCellTemplateOptions;
        const testElement = $('#container');

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
        const columnElements = that.columnHeadersView.getColumnElements();

        // assert
        assert.equal(columnElements.length, 3);
        assert.equal(getText(columnElements.eq(0)), 'Column 1');
        assert.equal(getText(columnElements.eq(1)), 'Column 2');
        assert.equal(getText(columnElements.eq(2)), 'Test');
        assert.equal(headerCellTemplateOptions.column.caption, 'Column 3', 'headerCellTemplate option column.caption');
        assert.equal(headerCellTemplateOptions.columnIndex, 2, 'headerCellTemplate option columnIndex');
    });

    QUnit.test('Custom headerCellTemplate as string selector for column with jquery template', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        $.extend(that.columns, [
            { caption: 'Column 1' },
            { caption: 'Column 2' },
            {
                caption: 'Column3',
                headerCellTemplate: '#jqHeaderColumnTemplate'
            }
        ]);

        this._getTemplate = function(selector) {
            assert.equal(selector, '#jqHeaderColumnTemplate');
            return {
                render: function(options) {
                    options.container.append('<b>' + options.model.caption + '</b>');
                    options.deferred && options.deferred.resolve();
                }
            };
        };

        // act
        that.columnHeadersView.render(testElement);
        const columnElements = that.columnHeadersView.getColumnElements();

        // assert
        assert.equal(columnElements.length, 3);
        assert.equal(columnElements.last().find('b').length, 1);
    });

    // T117339
    QUnit.test('Allow dragging when allowReordering true', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowReordering: true }, { caption: 'Column 2', allowReordering: true }]);

        this.options.allowColumnReordering = true;

        // act
        this.columnHeadersView.render(testElement);

        const isAllowDragging = this.columnHeadersView.allowDragging(this.columns[0]);

        // assert
        assert.ok(isAllowDragging, 'allow dragging');
    });

    QUnit.test('Allow dragging when many there are columns and one has allowReordering=true', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowReordering: false }, { caption: 'Column 2', allowReordering: true }]);

        this.options.allowColumnReordering = true;

        // act
        this.columnHeadersView.render(testElement);

        // assert
        assert.notOk(this.columnHeadersView.allowDragging(this.columns[0]), 'not allow dragging');
        assert.ok(this.columnHeadersView.allowDragging(this.columns[1]), 'allow dragging');
    });

    // T117339
    QUnit.test('Not allow dragging when allowReordering true and one column', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowReordering: true }]);

        this.options.allowColumnReordering = true;

        // act
        this.columnHeadersView.render(testElement);

        const isAllowDragging = this.columnHeadersView.allowDragging(this.columns[0]);

        // assert
        assert.notOk(isAllowDragging, 'not allow dragging');
    });

    // T117339
    QUnit.test('Not allow dragging when allowReordering false', function(assert) {
        // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowReordering: false }, { caption: 'Column 2', allowReordering: false }]);

        this.options.allowColumnReordering = false;

        // act
        this.columnHeadersView.render(testElement);

        const isAllowDragging = this.columnHeadersView.allowDragging(this.columns[0]);

        // act, assert
        assert.notOk(isAllowDragging, 'not allow dragging');
    });

    QUnit.test('Headers with option onCellPrepared', function(assert) {
        // arrange
        const testElement = $('#container');
        let resultOptions;
        let countCallCellPrepared = 0;

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
        assert.equal(countCallCellPrepared, 5, 'countCallCellPrepared');
        assert.equal(resultOptions.columnIndex, 2, 'columnIndex');
        assert.strictEqual(resultOptions.rowType, 'header', 'rowType');
        assert.deepEqual(resultOptions.column, { caption: 'Column 3' }, 'column');
    });

    QUnit.test('onCellPrepared - header with sorting and headerFilter', function(assert) {
        // arrange
        const $testElement = $('#container');
        let resultOptions;
        let countCallCellPrepared = 0;

        $.extend(this.columns, [{ caption: 'Column 1', sortOrder: 'asc', allowFiltering: true }]);

        this.options.headerFilter = { visible: true };
        this.options.onCellPrepared = function(options) {
            countCallCellPrepared++;
            resultOptions = options;

            // assert
            assert.equal(typeUtils.isRenderer(options.cellElement), !!config().useJQuery, 'has header filter');
            assert.ok($(options.cellElement).find('.dx-header-filter').length, 'has header filter');
            assert.ok($(options.cellElement).find('.dx-sort-up').length, 'has sort');
        };
        this.columnHeadersView.init();

        // act
        this.columnHeadersView.render($testElement);

        // assert
        assert.equal(countCallCellPrepared, 1, 'count call cellPrepared');
        assert.equal(resultOptions.columnIndex, 0, 'columnIndex');
        assert.strictEqual(resultOptions.rowType, 'header', 'rowType');
        assert.deepEqual(resultOptions.column, this.columns[0], 'column');
    });

    QUnit.test('Headers with option onRowPrepared', function(assert) {
        // arrange
        const testElement = $('#container');
        let resultOptions;
        let countCallRowPrepared = 0;

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
        assert.equal(countCallRowPrepared, 1, 'countCallRowPrepared');
        assert.ok(dataUtils.data($(resultOptions.rowElement).get(0), 'options'), 'has row options');
        assert.strictEqual(resultOptions.rowType, 'header', 'rowType');
        assert.deepEqual(resultOptions.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }, { caption: 'Column 4' }, { caption: 'Column 5' }], 'columns');
    });

    QUnit.test('Invalidate instead of render for options', function(assert) {
        // arrange
        let renderCounter = 0;
        this.columnHeadersView.render($('#container'));
        this.columnHeadersView.renderCompleted.add(function() {
            renderCounter++;
        });

        // act
        this.columnHeadersView.component.isReady = function() {
            return true;
        };
        this.columnHeadersView.beginUpdate();
        this.columnHeadersView.optionChanged({ name: 'showColumnHeaders' });
        this.columnHeadersView.optionChanged({ name: 'wordWrapEnabled' });
        this.columnHeadersView.optionChanged({ name: 'showColumnLines' });
        this.columnHeadersView.endUpdate();

        // assert
        assert.equal(renderCounter, 1, 'count of rendering');
    });

    QUnit.test('getHeadersRowHeight with band columns', function(assert) {
        // arrange
        const $testElement = $('#container');

        $.extend(this.columns, [
            [
                { caption: 'Column 1', rowspan: 2, index: 0 },
                { caption: 'Band column 1', isBand: true, colspan: 2, index: 1 }
            ],
            [
                { caption: 'Column 2', ownerBand: 'Band column 1', index: 2 },
                { caption: 'Column 3', ownerBand: 'Band column 1', index: 3 }
            ],
            [
                { caption: 'Column 1', rowspan: 2, index: 0 },
                { caption: 'Column 2', ownerBand: 'Band column 1', index: 2 },
                { caption: 'Column 3', ownerBand: 'Band column 1', index: 3 }
            ]
        ]);

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $headerRowElements = this.columnHeadersView._getRowElements();
        assert.equal($headerRowElements.length, 2, 'count row');
        assert.roughEqual(this.columnHeadersView.getHeadersRowHeight(), $($headerRowElements).toArray().reduce((sum, row) => sum + $(row).height(), 0), 1, 'height of the headers');
    });

    QUnit.test('Header with headerFilter - alignment cell content', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.headerFilter = { visible: true };
        $.extend(this.columns, [
            { caption: 'Column 1', allowFiltering: true, alignment: 'left' },
            { caption: 'Column 2', allowFiltering: true, alignment: 'center' },
            { caption: 'Column 3', allowFiltering: true, alignment: 'right' }
        ]);

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $headerCellContent = $testElement.find('.dx-header-row .dx-datagrid-text-content');
        assert.ok($headerCellContent.eq(0).hasClass('dx-header-filter-indicator'), 'first cell content has dx-header-filter-indicator class');
        assert.notOk($headerCellContent.eq(0).hasClass('dx-sort-indicator'), 'first cell content hasn\'t dx-sort-indicator class');
        assert.ok($headerCellContent.eq(0).hasClass('dx-text-content-alignment-left'), 'first cell content has margin right');
        assert.notOk($headerCellContent.eq(0).hasClass('dx-text-content-alignment-right'), 'first cell content hasn\'t margin left');

        assert.ok($headerCellContent.eq(1).hasClass('dx-header-filter-indicator'), 'second cell content has dx-header-filter-indicator class');
        assert.notOk($headerCellContent.eq(1).hasClass('dx-sort-indicator'), 'second cell content hasn\'t dx-sort-indicator class');
        assert.ok($headerCellContent.eq(1).hasClass('dx-text-content-alignment-left'), 'second cell content has margin right');
        assert.ok($headerCellContent.eq(1).hasClass('dx-text-content-alignment-right'), 'second cell content has margin left');

        assert.ok($headerCellContent.eq(2).hasClass('dx-header-filter-indicator'), 'third cell content has dx-header-filter-indicator class');
        assert.notOk($headerCellContent.eq(2).hasClass('dx-sort-indicator'), 'third cell content hasn\'t dx-sort-indicator class');
        assert.notOk($headerCellContent.eq(2).hasClass('dx-text-content-alignment-left'), 'third cell content hasn\'t margin right');
        assert.ok($headerCellContent.eq(2).hasClass('dx-text-content-alignment-right'), 'third cell content has margin left');
    });

    QUnit.test('Header with sorting - alignment cell content', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.sorting = { mode: 'single' };
        $.extend(this.columns, [
            { caption: 'Column 1', allowSorting: true, sortOrder: 'asc', alignment: 'left' },
            { caption: 'Column 2', allowSorting: true, alignment: 'center' },
            { caption: 'Column 3', allowSorting: true, sortOrder: 'desc', alignment: 'right' }
        ]);

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $headerCellContent = $testElement.find('.dx-header-row .dx-datagrid-text-content');
        assert.notOk($headerCellContent.eq(0).hasClass('dx-header-filter-indicator'), 'first cell content has dx-header-filter-indicator class');
        assert.ok($headerCellContent.eq(0).hasClass('dx-sort-indicator'), 'first cell content hasn\'t dx-sort-indicator class');
        assert.ok($headerCellContent.eq(0).hasClass('dx-text-content-alignment-left'), 'first cell content has margin right');
        assert.notOk($headerCellContent.eq(0).hasClass('dx-text-content-alignment-right'), 'first cell content hasn\'t margin left');

        assert.notOk($headerCellContent.eq(1).hasClass('dx-header-filter-indicator'), 'second cell content has dx-header-filter-indicator class');
        assert.notOk($headerCellContent.eq(1).hasClass('dx-sort-indicator'), 'second cell content hasn\'t dx-sort-indicator class');
        assert.ok($headerCellContent.eq(1).hasClass('dx-text-content-alignment-left'), 'second cell content has margin right');
        assert.ok($headerCellContent.eq(1).hasClass('dx-text-content-alignment-right'), 'second cell content has margin left');

        assert.notOk($headerCellContent.eq(2).hasClass('dx-header-filter-indicator'), 'third cell content has dx-header-filter-indicator class');
        assert.ok($headerCellContent.eq(2).hasClass('dx-sort-indicator'), 'third cell content hasn\'t dx-sort-indicator class');
        assert.notOk($headerCellContent.eq(2).hasClass('dx-text-content-alignment-left'), 'third cell content hasn\'t margin right');
        assert.ok($headerCellContent.eq(2).hasClass('dx-text-content-alignment-right'), 'third cell content has margin left');
    });

    QUnit.test('Header with sorting and headerFilter - alignment cell content', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.sorting = { mode: 'single' };
        this.options.headerFilter = { visible: true };
        $.extend(this.columns, [
            { caption: 'Column 1', allowFiltering: true, allowSorting: true, sortOrder: 'asc', alignment: 'left' },
            { caption: 'Column 2', allowFiltering: true, allowSorting: true, alignment: 'center' },
            { caption: 'Column 3', allowFiltering: true, allowSorting: true, sortOrder: 'desc', alignment: 'right' }
        ]);

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $headerCellContent = $testElement.find('.dx-header-row .dx-datagrid-text-content');
        assert.ok($headerCellContent.eq(0).hasClass('dx-header-filter-indicator'), 'first cell content has dx-header-filter-indicator class');
        assert.ok($headerCellContent.eq(0).hasClass('dx-sort-indicator'), 'first cell content hasn\'t dx-sort-indicator class');
        assert.ok($headerCellContent.eq(0).hasClass('dx-text-content-alignment-left'), 'first cell content has margin right');
        assert.notOk($headerCellContent.eq(0).hasClass('dx-text-content-alignment-right'), 'first cell content hasn\'t margin left');

        assert.ok($headerCellContent.eq(1).hasClass('dx-header-filter-indicator'), 'second cell content has dx-header-filter-indicator class');
        assert.notOk($headerCellContent.eq(1).hasClass('dx-sort-indicator'), 'second cell content hasn\'t dx-sort-indicator class');
        assert.ok($headerCellContent.eq(1).hasClass('dx-text-content-alignment-left'), 'second cell content has margin right');
        assert.ok($headerCellContent.eq(1).hasClass('dx-text-content-alignment-right'), 'second cell content has margin left');

        assert.ok($headerCellContent.eq(2).hasClass('dx-header-filter-indicator'), 'third cell content has dx-header-filter-indicator class');
        assert.ok($headerCellContent.eq(2).hasClass('dx-sort-indicator'), 'third cell content hasn\'t dx-sort-indicator class');
        assert.notOk($headerCellContent.eq(2).hasClass('dx-text-content-alignment-left'), 'third cell content hasn\'t margin right');
        assert.ok($headerCellContent.eq(2).hasClass('dx-text-content-alignment-right'), 'third cell content has margin left');
    });

    QUnit.test('Header without sorting and headerFilter - alignment cell content', function(assert) {
        // arrange
        const $testElement = $('#container');

        $.extend(this.columns, [
            { caption: 'Column 1', alignment: 'left' },
            { caption: 'Column 2', alignment: 'center' },
            { caption: 'Column 3', alignment: 'right' }
        ]);

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $headerCellContent = $testElement.find('.dx-header-row .dx-datagrid-text-content');
        assert.notOk($headerCellContent.eq(0).hasClass('dx-header-filter-indicator'), 'first cell content has dx-header-filter-indicator class');
        assert.notOk($headerCellContent.eq(0).hasClass('dx-sort-indicator'), 'first cell content hasn\'t dx-sort-indicator class');
        assert.notOk($headerCellContent.eq(0).hasClass('dx-text-content-alignment-left'), 'first cell content has margin right');
        assert.notOk($headerCellContent.eq(0).hasClass('dx-text-content-alignment-right'), 'first cell content hasn\'t margin left');

        assert.notOk($headerCellContent.eq(1).hasClass('dx-header-filter-indicator'), 'second cell content has dx-header-filter-indicator class');
        assert.notOk($headerCellContent.eq(1).hasClass('dx-sort-indicator'), 'second cell content hasn\'t dx-sort-indicator class');
        assert.notOk($headerCellContent.eq(1).hasClass('dx-text-content-alignment-left'), 'second cell content has margin right');
        assert.notOk($headerCellContent.eq(1).hasClass('dx-text-content-alignment-right'), 'second cell content has margin left');

        assert.notOk($headerCellContent.eq(2).hasClass('dx-header-filter-indicator'), 'third cell content has dx-header-filter-indicator class');
        assert.notOk($headerCellContent.eq(2).hasClass('dx-sort-indicator'), 'third cell content hasn\'t dx-sort-indicator class');
        assert.notOk($headerCellContent.eq(2).hasClass('dx-text-content-alignment-left'), 'third cell content hasn\'t margin right');
        assert.notOk($headerCellContent.eq(2).hasClass('dx-text-content-alignment-right'), 'third cell content has margin left');
    });

    // T497346
    QUnit.test('Header should have alignment if there\'s no dataSource and sorting is enabled', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.sorting = { mode: 'single' };
        $.extend(this.columns, [
            { caption: 'Column 1', allowSorting: true },
            { caption: 'Column 2', allowSorting: true },
            { caption: 'Column 3', allowSorting: true }
        ]);

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $headerCellContent = $testElement.find('.dx-header-row .dx-datagrid-text-content');
        assert.ok($headerCellContent.eq(0).hasClass('dx-text-content-alignment-left'), 'alignment is left');
        assert.ok($headerCellContent.eq(1).hasClass('dx-text-content-alignment-left'), 'alignment is left');
        assert.ok($headerCellContent.eq(2).hasClass('dx-text-content-alignment-left'), 'alignment is left');
    });

    // T598499
    QUnit.test('Not set title attribute when cell text isn\'t trimmed in dx-datagrid-text-content container', function(assert) {
        // arrange
        const $testElement = $('#container').addClass('dx-widget');

        this.options.cellHintEnabled = true;
        this.options.sorting = { mode: 'single' };
        $.extend(this.columns, [{ caption: 'First Name', allowSorting: true }, { caption: 'Last Name', allowSorting: true }]);
        this.columnHeadersView.render($testElement);
        const $cellElements = dataGridMocks.getCells($testElement);

        // act
        const $firstContentElement = $cellElements.first().find('.dx-datagrid-text-content');
        $firstContentElement.trigger('mousemove');

        // assert
        assert.strictEqual($firstContentElement.attr('title'), undefined, 'not has attribute title in first cell');

        // act
        const $lastContentElement = $cellElements.last().find('.dx-datagrid-text-content');
        $lastContentElement.trigger('mousemove');

        // assert
        assert.strictEqual($lastContentElement.attr('title'), undefined, 'not has attribute title in last cell');
    });

    // T904770
    QUnit.test('caption line-height should be correct for buttons column with icons', function(assert) {
        // arrange
        const $testElement = $('#container').addClass('dx-widget');

        this.options.editing = { mode: 'row', useIcons: true, allowUpdating: true };
        this.columns.unshift({ caption: '#', type: 'buttons', cssClass: 'dx-command-edit dx-command-edit-with-icons' }, { caption: 'Column 1' });

        // act
        this.columnHeadersView.render($testElement);
        const $cellElements = dataGridMocks.getCells($testElement);

        // assert
        assert.ok($cellElements.eq(0).hasClass('dx-command-edit-with-icons'), 'command column has with-icons class');
        assert.roughEqual(parseFloat($cellElements.eq(0).css('line-height')), 19, 0.1, 'command column line-height');
        assert.roughEqual(parseFloat($cellElements.eq(1).css('line-height')), 19, 0.1, 'data column line-height');
    });
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
                    groupByThisColumn: 'Group by This Column',
                    ungroup: 'Ungroup',
                    ungroupAll: 'Ungroup All'
                }
            },
            groupPanel: {
                visible: true
            },
        };

        this.element = function() {
            return $('#container');
        };

        dataGridMocks.setupDataGridModules(this, ['data', 'columnHeaders', 'filterRow', 'selection', 'editorFactory', 'contextMenu', 'headerFilter', 'grouping', 'headerPanel'], {
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
}, () => {

    QUnit.test('Get context menu items with grouping operations (default column)', function(assert) {
        // arrange
        const $testElement = $('#container');
        let items;

        $.extend(this.columns, [{ caption: 'Column 1', allowSorting: false, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.onContextMenuPreparing = function(e) {
            items = e.items;
        };

        this.contextMenuController.init();
        this.contextMenuView.render($testElement);

        this.columnHeadersView.render($testElement);
        const cells = dataGridMocks.getCells($testElement);

        // act
        $(cells[0]).trigger('contextmenu');

        // assert
        assert.equal(items.length, 2, 'count menu items');
        assert.strictEqual(items[0].text, 'Group by This Column', 'text menu item 1');
        assert.strictEqual(items[0].value, 'group', 'value menu item 1');

        assert.strictEqual(items[1].text, 'Ungroup All', 'text menu item 2');
        assert.strictEqual(items[1].value, 'ungroupAll', 'value menu item 2');
    });

    QUnit.test('Get context menu items with grouping operations (showWhenGrouped column)', function(assert) {
        // arrange
        const $testElement = $('#container');
        let items;

        $.extend(this.columns, [{ caption: 'Column 1', allowSorting: false, showWhenGrouped: true, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.onContextMenuPreparing = function(e) {
            items = e.items;
        };

        this.contextMenuController.init();
        this.contextMenuView.render($testElement);

        this.columnHeadersView.render($testElement);
        const cells = dataGridMocks.getCells($testElement);

        // act
        $(cells[0]).trigger('contextmenu');

        // assert
        assert.equal(items.length, 3, 'count menu items');
        assert.strictEqual(items[0].text, 'Group by This Column', 'text menu item 1');
        assert.strictEqual(items[0].value, 'group', 'value menu item 1');

        assert.strictEqual(items[1].text, 'Ungroup', 'text menu item 2');
        assert.strictEqual(items[1].value, 'ungroup', 'value menu item 2');

        assert.strictEqual(items[2].text, 'Ungroup All', 'text menu item 3');
        assert.strictEqual(items[2].value, 'ungroupAll', 'value menu item 3');
    });

    QUnit.test('Grouped column caption should displayed when the showWhenGrouped option is enabled (T752775)', function(assert) {
        // arrange
        const that = this;
        const columnHeadersView = that.columnHeadersView;
        const $testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', showWhenGrouped: true, groupIndex: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        // act
        columnHeadersView.render($testElement);

        // assert
        const $groupedColumnElement = $(columnHeadersView.getCellElement(0, 0));
        assert.strictEqual($groupedColumnElement.text(), 'Column 1', 'caption for grouped column displayed');
    });

    QUnit.test('Get context menu items with grouping operations (grouped panel item)', function(assert) {
        // arrange
        const $testElement = $('#container');
        let contextMenuArgs;

        $.extend(this.columns, [{ caption: 'Column 1', allowSorting: false, groupIndex: 0, index: 0 }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        this.options.onContextMenuPreparing = function(e) {
            contextMenuArgs = e;
        };

        this.contextMenuController.init();
        this.contextMenuView.render($testElement);

        this.columnHeadersView.render($testElement);
        this.headerPanel.render($testElement);

        const $groupedColumn = $testElement.find('.dx-group-panel-item').first();

        // act
        $groupedColumn.trigger('contextmenu');

        // assert
        const items = contextMenuArgs.items;

        assert.equal(contextMenuArgs.target, 'headerPanel', 'context menu target');
        // T390121
        assert.deepEqual(contextMenuArgs.column, this.columns[0], 'context menu column');

        assert.equal(items.length, 2, 'count menu items');

        assert.strictEqual(items[0].text, 'Ungroup', 'text menu item 1');
        assert.strictEqual(items[0].value, 'ungroup', 'value menu item 1');

        assert.strictEqual(items[1].text, 'Ungroup All', 'text menu item 2');
        assert.strictEqual(items[1].value, 'ungroupAll', 'value menu item 2');
    });
});

QUnit.module('Headers with grouping and chooser', {
    beforeEach: function() {
        const that = this;

        that.clock = sinon.useFakeTimers();

        that.$element = function() {
            return $('#container');
        };

        that.setupDataGrid = function(options) {
            dataGridMocks.setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'grouping', 'columnChooser', 'headerPanel'], {
                initViews: true,
                controllers: {
                    data: new dataGridMocks.MockDataController({ items: [] })
                },
                options: options
            });
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
}, () => {
    QUnit.test('Check header text when all columns are grouped', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.setupDataGrid({
            showColumnHeaders: true,
            columns: [
                { caption: 'Column 1', groupIndex: 0 },
                { caption: 'Column 2', groupIndex: 1 }
            ],
            groupPanel: { visible: true }
        });

        // act
        this.columnHeadersView.render($testElement);

        const emptyCell = $('.dx-header-row td:not(.dx-command-expand)');

        // assert
        assert.strictEqual(emptyCell.find('.dx-datagrid-text-content').length, 1, 'cell content rendered');
        assert.strictEqual(emptyCell.text(), messageLocalization.format('dxDataGrid-emptyHeaderWithGroupPanelText'));
    });

    QUnit.test('Check header text when all columns are grouped but group panel is not visible', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.setupDataGrid({
            showColumnHeaders: true,
            columns: [
                { caption: 'Column 1', groupIndex: 0 },
                { caption: 'Column 2', groupIndex: 1 }
            ],
            groupPanel: { visible: false }
        });

        // act
        this.columnHeadersView.render($testElement);

        const emptyCell = $('.dx-header-row td:not(.dx-command-expand)');

        // assert
        assert.strictEqual(emptyCell.html(), '&nbsp;', 'no message');
    });

    QUnit.test('Check header text when all columns are hidden in column chooser', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.setupDataGrid({
            showColumnHeaders: true,
            columns: [
                { caption: 'Column 1', visible: false },
                { caption: 'Column 2', visible: false }
            ],
            columnChooser: { enabled: true }
        });

        // act
        this.columnHeadersView.render($testElement);

        const emptyCell = $('.dx-header-row td:not(.dx-command-expand)');

        // assert
        const columnChooserTitle = messageLocalization.format('dxDataGrid-emptyHeaderColumnChooserText');
        const text = format(messageLocalization.format('dxDataGrid-emptyHeaderWithColumnChooserText'), columnChooserTitle);

        assert.strictEqual(emptyCell.find('.dx-datagrid-text-content').length, 1, 'cell content rendered');
        assert.strictEqual(emptyCell.text(), text);

        // act
        const columnChooserLink = emptyCell.find('.dx-datagrid-text-content .dx-link');

        // assert
        assert.strictEqual(columnChooserLink.length, 1, 'link for column chooser created');
        assert.strictEqual(columnChooserLink.text(), columnChooserTitle);

        // act
        let chooserOpened = false;
        this.columnChooserView.showColumnChooser = () => chooserOpened = true;

        columnChooserLink.trigger('click');

        // assert
        assert.ok(chooserOpened, 'chooser has been opened');
    });

    QUnit.test('Check header text when all columns are hidden but column chooser is not enabled', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.setupDataGrid({
            showColumnHeaders: true,
            columns: [
                { caption: 'Column 1', visible: false },
                { caption: 'Column 2', visible: false }
            ],
            columnChooser: { enabled: false }
        });

        // act
        this.columnHeadersView.render($testElement);

        const emptyCell = $('.dx-header-row td:not(.dx-command-expand)');

        // assert
        assert.strictEqual(emptyCell.html(), '&nbsp;', 'no message');
    });

    QUnit.test('Check header text when all columns are hidden in column chooser or grouped in group panel', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.setupDataGrid({
            showColumnHeaders: true,
            columns: [
                { caption: 'Column 1', visible: false },
                { caption: 'Column 2', groupIndex: 0 }
            ],
            columnChooser: { enabled: true },
            groupPanel: { visible: true }
        });

        // act
        this.columnHeadersView.render($testElement);

        const emptyCell = $('.dx-header-row td:not(.dx-command-expand)');

        // assert
        const columnChooserTitle = messageLocalization.format('dxDataGrid-emptyHeaderColumnChooserText');
        const text = format(messageLocalization.format('dxDataGrid-emptyHeaderWithColumnChooserAndGroupPanelText'), columnChooserTitle);

        assert.strictEqual(emptyCell.find('.dx-datagrid-text-content').length, 1, 'cell content rendered');
        assert.strictEqual(emptyCell.text(), text);

        // act
        const columnChooserLink = emptyCell.find('.dx-datagrid-text-content .dx-link');

        // assert
        assert.strictEqual(columnChooserLink.length, 1, 'link for column chooser created');
        assert.strictEqual(columnChooserLink.text(), columnChooserTitle);

        // act
        let chooserOpened = false;
        this.columnChooserView.showColumnChooser = () => chooserOpened = true;

        columnChooserLink.trigger('click');

        // assert
        assert.ok(chooserOpened, 'chooser has been opened');
    });

    QUnit.test('Check header text when all columns are hidden or grouped but column chooser and group panel are not enabled', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.setupDataGrid({
            showColumnHeaders: true,
            columns: [
                { caption: 'Column 1', visible: false },
                { caption: 'Column 2', groupIndex: 0 }
            ],
            columnChooser: { enabled: false },
            groupPanel: { visible: false }
        });

        // act
        this.columnHeadersView.render($testElement);

        const emptyCell = $('.dx-header-row td:not(.dx-command-expand)');

        // assert
        assert.strictEqual(emptyCell.html(), '&nbsp;', 'no message');
    });
});

QUnit.module('Headers with band columns', {
    beforeEach: function() {
        const that = this;

        that.clock = sinon.useFakeTimers();

        that.columns = [];
        that.$element = function() {
            return $('#container');
        };
        that.options = {
            showColumnHeaders: true
        };

        that.setupDataGrid = function() {
            that.options.columns = that.columns;
            dataGridMocks.setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'contextMenu', 'sorting', 'filterRow', 'editorFactory'], {
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
}, () => {

    QUnit.test('Draw band columns', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = [{ caption: 'Band column 1', columns: ['Column1', 'Column2'] }, 'Column3', { caption: 'Band column 2', columns: ['Column4', 'Column5'] }];
        this.setupDataGrid();

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $trElements = $testElement.find('tbody > tr');
        const $cells = $trElements.find('td');
        assert.equal($trElements.length, 2, 'count row');
        assert.equal($trElements.first().children().length, 3, 'count cell of the first row');
        assert.equal($trElements.last().children().length, 4, 'count cell of the second row');
        assert.equal($cells.length, 7, 'count cell');

        // first row
        assert.equal($cells.eq(0).text(), 'Band column 1', 'text of the first cell of the first row');
        assert.equal($cells.eq(0).attr('colspan'), 2, 'colspan of the first cell of the first row');

        assert.equal($cells.eq(1).text(), 'Column 3', 'text of the second cell of the first row');
        assert.equal($cells.eq(1).attr('rowspan'), 2, 'rowspan of the second cell of the first row');

        assert.equal($cells.eq(2).text(), 'Band column 2', 'text of the third cell of the first row');
        assert.equal($cells.eq(2).attr('colspan'), 2, 'colspan of the third cell of the first row');

        // second row
        assert.equal($cells.eq(3).text(), 'Column 1', 'text of the first cell of the second row');
        assert.equal($cells.eq(4).text(), 'Column 2', 'text of the second cell of the second row');
        assert.equal($cells.eq(5).text(), 'Column 4', 'text of the third cell of the second row');
        assert.equal($cells.eq(6).text(), 'Column 5', 'text of the fourth cell of the second row');
    });

    QUnit.test('Draw band columns(complex hierarchy)', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = ['Column1', {
            caption: 'Band column 1', columns: ['Column2', {
                caption: 'Band column 2', columns: ['Column3', {
                    caption: 'Band column 3', columns: ['Column4', {
                        caption: 'Band column 4', columns: ['Column5', {
                            caption: 'Band column 5', columns: ['Column6']
                        }]
                    }]
                }]
            }]
        }];
        this.setupDataGrid();

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $trElements = $testElement.find('tbody > tr');
        const $cells = $trElements.find('td');
        assert.equal($trElements.length, 6, 'count row');
        assert.equal($trElements.eq(0).children().length, 2, 'count cell of the first row');
        assert.equal($trElements.eq(1).children().length, 2, 'count cell of the second row');
        assert.equal($trElements.eq(2).children().length, 2, 'count cell of the third row');
        assert.equal($trElements.eq(3).children().length, 2, 'count cell of the fourth row');
        assert.equal($trElements.eq(4).children().length, 2, 'count cell of the fifth row');
        assert.equal($trElements.eq(5).children().length, 1, 'count cell of the sixth row');
        assert.equal($cells.length, 11, 'count cell');

        // first row
        assert.equal($cells.eq(0).text(), 'Column 1', 'text of the first cell of the first row');
        assert.equal($cells.eq(0).attr('rowspan'), 6, 'rowspan of the first cell of the first row');

        assert.equal($cells.eq(1).text(), 'Band column 1', 'text of the second cell of the first row');
        assert.equal($cells.eq(1).attr('colspan'), 5, 'colspan of the second cell of the first row');

        // second row
        assert.equal($cells.eq(2).text(), 'Column 2', 'text of the first cell of the second row');
        assert.equal($cells.eq(2).attr('rowspan'), 5, 'rowspan of the first cell of the second row');

        assert.equal($cells.eq(3).text(), 'Band column 2', 'text of the second cell of the second row');
        assert.equal($cells.eq(3).attr('colspan'), 4, 'colspan of the second cell of the second row');

        // third row
        assert.equal($cells.eq(4).text(), 'Column 3', 'text of the first cell of the third row');
        assert.equal($cells.eq(4).attr('rowspan'), 4, 'rowspan of the first cell of the third row');

        assert.equal($cells.eq(5).text(), 'Band column 3', 'text of the second cell of the third row');
        assert.equal($cells.eq(5).attr('colspan'), 3, 'colspan of the second cell of the third row');

        // fourth row
        assert.equal($cells.eq(6).text(), 'Column 4', 'text of the first cell of the fourth row');
        assert.equal($cells.eq(6).attr('rowspan'), 3, 'rowspan of the first cell of the fourth row');

        assert.equal($cells.eq(7).text(), 'Band column 4', 'text of the second cell of the fourth row');
        assert.equal($cells.eq(7).attr('colspan'), 2, 'colspan of the second cell of the fourth row');

        // fifth row
        assert.equal($cells.eq(8).text(), 'Column 5', 'text of the first cell of the fifth row');
        assert.equal($cells.eq(8).attr('rowspan'), 2, 'rowspan of the first cell of the fifth row');

        assert.equal($cells.eq(9).text(), 'Band column 5', 'text of the second cell of the fifth row');
        assert.ok(!$cells.eq(9).attr('colspan'), 'colspan of the second cell of the fifth row');

        // sixth row
        assert.equal($cells.eq(10).text(), 'Column 6', 'text of the first cell of the sixth row');
        assert.ok(!$cells.eq(10).attr('rowspan'), 'rowspan of the first cell of the sixth row');
    });

    QUnit.test('getColumnElements when there is band columns', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = [{ caption: 'Band column 1', columns: ['Column1', 'Column2'] }, 'Column3', { caption: 'Band column 2', columns: ['Column4', 'Column5'] }];
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);

        // act
        const $columnElements = this.columnHeadersView.getColumnElements();

        // assert
        assert.equal($columnElements.length, 5, 'count data column');
        assert.strictEqual($columnElements.eq(0).text(), 'Column 1', 'text of the first cell');
        assert.strictEqual($columnElements.eq(1).text(), 'Column 2', 'text of the second cell');
        assert.strictEqual($columnElements.eq(2).text(), 'Column 3', 'text of the third cell');
        assert.strictEqual($columnElements.eq(3).text(), 'Column 4', 'text of the fourth cell');
        assert.strictEqual($columnElements.eq(4).text(), 'Column 5', 'text of the fifth cell');
    });

    QUnit.test('getColumnElements with rowIndex when there is band columns', function(assert) {
        // arrange
        let $columnElements;
        const $testElement = $('#container');


        this.columns = [{ caption: 'Band column 1', columns: ['Column1', 'Column2'] }, 'Column3', { caption: 'Band column 2', columns: ['Column4', 'Column5'] }];
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);

        // act
        $columnElements = this.columnHeadersView.getColumnElements(0);

        // assert
        assert.equal($columnElements.length, 3, 'count column');
        assert.strictEqual($columnElements.eq(0).text(), 'Band column 1', 'text of the first cell');
        assert.strictEqual($columnElements.eq(1).text(), 'Column 3', 'text of the second cell');
        assert.strictEqual($columnElements.eq(2).text(), 'Band column 2', 'text of the third cell');

        // act
        $columnElements = this.columnHeadersView.getColumnElements(1);

        // assert
        assert.equal($columnElements.length, 4, 'count column');
        assert.strictEqual($columnElements.eq(0).text(), 'Column 1', 'text of the first cell');
        assert.strictEqual($columnElements.eq(1).text(), 'Column 2', 'text of the second cell');
        assert.strictEqual($columnElements.eq(2).text(), 'Column 4', 'text of the third cell');
        assert.strictEqual($columnElements.eq(3).text(), 'Column 5', 'text of the fourth cell');
    });

    QUnit.test('getColumnElements by band column', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = [{ caption: 'Band column 1', columns: ['Column1', 'Column2'] }, 'Column3', { caption: 'Band column 2', columns: ['Column4', 'Column5'] }];
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);

        // act
        const $columnElements = this.columnHeadersView.getColumnElements(1, 4);

        // assert
        assert.equal($columnElements.length, 2, 'count column');
        assert.strictEqual($columnElements.eq(0).text(), 'Column 4', 'text of the first cell');
        assert.strictEqual($columnElements.eq(1).text(), 'Column 5', 'text of the second cell');
    });

    QUnit.test('Allow dragging when allowReordering true', function(assert) {
        // arrange
        this.columns = [{ caption: 'Band column 1', columns: ['Column1', 'Column2'] }];
        this.options.allowColumnReordering = true;
        this.setupDataGrid();

        // act
        const firstColumnAllowDragging = this.columnHeadersView.allowDragging(this.columnsController.getVisibleColumns(1)[0]);

        // assert
        assert.ok(firstColumnAllowDragging, 'first column can be dragged');
    });

    QUnit.test('Not allow dragging when allowReordering true and only one band column', function(assert) {
        // arrange
        this.columns = [{ caption: 'Band column 1', columns: ['Column1', 'Column2'] }];
        this.options.allowColumnReordering = true;
        this.setupDataGrid();

        // act
        const bandColumnAllowDragging = this.columnHeadersView.allowDragging(this.columnsController.getVisibleColumns(0)[0]);

        // assert
        assert.notOk(bandColumnAllowDragging, 'band column can not be dragged');
    });

    QUnit.test('Not allow dragging when allowReordering true and one column', function(assert) {
        // arrange
        this.columns = [{ caption: 'Band column 1', columns: ['Column1'] }];
        this.options.allowColumnReordering = true;
        this.setupDataGrid();

        // act
        const columnAllowDragging = this.columnHeadersView.allowDragging(this.columnsController.getVisibleColumns(1)[0]);

        // assert
        assert.notOk(columnAllowDragging, 'not allow dragging');
    });

    // T360137
    QUnit.test('Apply sorting ascending by click from context menu', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = ['Column1', { caption: 'Band column 1', columns: [{ caption: 'Column2', allowSorting: true }, 'Column3'] }];
        this.options.sorting = {
            mode: 'single'
        };
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.contextMenuView.render($testElement);

        const $cell = $testElement.find('tbody > tr').eq(1).children().first();
        $cell.trigger('contextmenu');

        const $popupMenu = $('.dx-viewport').children('.dx-overlay-wrapper').find('.dx-context-menu').first();

        // act
        $popupMenu.find('.dx-menu-item').first().trigger('dxclick');

        this.clock.tick(10);

        // assert
        assert.equal($cell.find('.dx-sort-up').length, 1, 'has element with class dx-sort-up');
        assert.strictEqual(this.columnsController.getVisibleColumns(1)[0].sortOrder, 'asc', 'sort order of the first cell of the second row');
    });

    QUnit.test('set rows opacity for band column', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = ['Column1', { caption: 'Band column 1', columns: ['Column2', { caption: 'Band column 2', columns: ['Column3'] }] }];
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);

        // act
        this.columnHeadersView.toggleDraggableColumnClass(1, true);

        const $cellElements = $testElement.find('td');

        // assert
        assert.equal($cellElements.length, 5, 'count column');
        assert.equal($cellElements.eq(0).css('opacity'), 1, 'opacity of the first cell of the first row');
        assert.equal($cellElements.eq(1).css('opacity'), 1, 'opacity of the second cell of the first row');
        assert.equal($cellElements.eq(2).css('opacity'), 0.5, 'opacity of the first cell of the second row');
        assert.equal($cellElements.eq(3).css('opacity'), 0.5, 'opacity of the second cell of the second row');
        assert.equal($cellElements.eq(4).css('opacity'), 0.5, 'opacity of the first cell of the third row');
    });

    // T360139
    QUnit.test('getColumnWidths with band columns', function(assert) {
        // arrange
        const $testElement = $('#container').width(450);

        this.columns = [
            { caption: 'Column1', width: 150 },
            {
                caption: 'Band column 1',
                columns: [
                    { caption: 'Column2', width: 100 },
                    {
                        caption: 'Band column 2',
                        columns: [
                            { caption: 'Column3', width: 200 }
                        ]
                    }
                ]
            }
        ];
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);

        // act
        const widths = this.columnHeadersView.getColumnWidths();

        // assert
        assert.equal(widths.length, 3, 'widths of the columns');
        assert.equal(widths[0], 150, 'width of the first cell of the first row');
        assert.equal(widths[1], 100, 'width of the first cell of the second row');
        assert.equal(widths[2], 200, 'width of the first cell of the third row');
    });

    // T377673
    QUnit.test('getColumnElements by band column with hidden children where filter row is visible', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.filterRow = { visible: true };
        this.columns = ['Column1', 'Column2', 'Column3', { caption: 'Band column 2', columns: [{ dataField: 'Column4', visible: false }, { dataField: 'Column5', visible: false }] }];
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);

        // act
        const $columnElements = this.columnHeadersView.getColumnElements(1, 3);

        // assert
        assert.ok(!$columnElements, 'no cells');
    });

    QUnit.test('DataGrid headers has dx-header-multi-row class for multi-row headers (bands)', function(assert) {
        // arrange
        const $testElement = $('#container');
        this.columns = [{ caption: 'Band column 1', columns: ['Column1', 'Column2'] }, 'Column3', { caption: 'Band column 2', columns: ['Column4', 'Column5'] }];
        this.setupDataGrid();

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $headers = $testElement.find('.dx-datagrid-headers');
        assert.ok($headers.hasClass('dx-header-multi-row'));
    });

    QUnit.test('DataGrid headers has no dx-header-multi-row class for single-row headers', function(assert) {
        // arrange
        const $testElement = $('#container');
        this.columns = [{ caption: 'Band column 1' }, 'Column3', { caption: 'Band column 2' }];
        this.setupDataGrid();

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $headers = $testElement.find('.dx-datagrid-headers');
        assert.notOk($headers.hasClass('dx-header-multi-row'));
    });

    // T652025
    QUnit.test('The grid should ignore the width of the band column', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = [
            {
                caption: 'Band column 1',
                columns: [
                    { caption: 'Column2' }
                ],
                width: 100
            },
            {
                caption: 'Band column 2',
                columns: [
                    { caption: 'Column3' }
                ],
                width: 200
            }
        ];
        this.options.columnAutoWidth = true;
        this.setupDataGrid();

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $bandColumnElements = $testElement.find('.dx-header-row').first().children();
        assert.strictEqual($bandColumnElements.length, 2, 'band column count');

        assert.strictEqual($bandColumnElements.get(0).style.width, '');
        assert.strictEqual($bandColumnElements.get(0).style.minWidth, '');
        assert.strictEqual($bandColumnElements.get(0).style.maxWidth, '');

        assert.strictEqual($bandColumnElements.get(1).style.width, '');
        assert.strictEqual($bandColumnElements.get(1).style.minWidth, '');
        assert.strictEqual($bandColumnElements.get(1).style.maxWidth, '');
    });

    // T670569
    QUnit.test('Filter row does not have rowspan attribute when band column is enabled', function(assert) {
        const $testElement = $('#container');

        this.columns = [
            {
                caption: 'Band column 1',
                width: 100
            },
            {
                caption: 'Band column 2',
                columns: [
                    { caption: 'Column3' }
                ],
                width: 200
            }
        ];

        this.options.filterRow = { visible: true };
        this.setupDataGrid();

        this.columnHeadersView.render($testElement);

        const $filterRowFirstColumnElement = $testElement.find('.dx-datagrid-filter-row').first().children().eq(0);
        assert.strictEqual($filterRowFirstColumnElement.attr('rowspan'), undefined);
    });

    // T881055, T895531
    QUnit.test('Column header should not overlap filterRow when grouped and showWhenGrouped', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = [{
            caption: 'Band column',
            columns: [{
                caption: 'Column3',
                showWhenGrouped: true,
                groupIndex: 0
            }]
        }];

        this.options.filterRow = { visible: true };
        this.setupDataGrid();

        this.columnHeadersView.render($testElement);

        // act
        const $headerCells = $testElement.find('.dx-row.dx-column-lines.dx-header-row').children();

        // assert
        assert.equal($headerCells.length, 4, 'header cell count');

        $headerCells.each((_, headerCellElement) => {
            assert.strictEqual($(headerCellElement).attr('rowspan'), undefined);
        });
    });

    // T1193153
    QUnit.test('setColumnWidths - the command column should have the correct minWidth, width, maxWidth when there are band columns', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns = [{
            caption: 'Band column 1',
            columns: [{
                caption: 'column 1',
                width: 150
            }]
        }, {
            caption: 'Default column'
        }, {
            type: 'buttons',
            width: 50,
            command: 'edit',
            visible: true,
            cssClass: 'dx-command-edit',
        }];
        this.options.columnAutoWidth = true;
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);

        // act
        this.columnHeadersView.setColumnWidths({ widths: [150, 666, 50] });

        // assert
        const commandCell = $testElement.find('td').get(2);
        assert.ok($(commandCell).hasClass('dx-command-edit'), 'command column');
        assert.strictEqual(commandCell.style.width, '50px', 'width of the command column');
        assert.strictEqual(commandCell.style.minWidth, '50px', 'minWidth of the command column');
        assert.strictEqual(commandCell.style.maxWidth, '50px', 'maxWidth of the command column');
    });
});

QUnit.module('Multiple sorting', {
    beforeEach: function() {
        const that = this;

        that.clock = sinon.useFakeTimers();

        that.$element = function() {
            return $('#container');
        };

        that.setupDataGrid = function(options) {
            if(!options.columns) {
                options.columns = [{
                    dataField: 'field1'
                }, {
                    dataField: 'field2',
                    sortIndex: 1,
                    sortOrder: 'asc'
                }, {
                    dataField: 'field3',
                    sortIndex: 0,
                    sortOrder: 'asc'
                }];
            }
            dataGridMocks.setupDataGridModules(that, ['data', 'columns', 'headerFilter', 'columnHeaders', 'sorting', 'gridView', 'rows'], {
                initViews: true,
                initDefaultOptions: true,
                options: options
            });
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
}, () => {

    QUnit.test('Sort index icons should be rendered by default', function(assert) {
        // arrange
        const $testElement = this.$element().addClass('dx-widget');
        const options = {
            sorting: {
                mode: 'multiple'
            }
        };

        this.setupDataGrid(options);

        // act
        this.columnHeadersView.render($testElement);
        const $headerCells = $testElement.find('.dx-header-row').children();

        // assert
        assert.equal($headerCells.eq(0).find(SORT_INDEX_ICON_SELECTOR).text(), '', 'first column\'s sort index');
        assert.equal($headerCells.eq(1).find(SORT_INDEX_ICON_SELECTOR).text(), '2', 'second column\'s sort index');
        assert.equal($headerCells.eq(2).find(SORT_INDEX_ICON_SELECTOR).text(), '1', 'third column\'s sort index');
    });

    QUnit.test('Sort index icons should be rendered when showSortIndexes is true', function(assert) {
        // arrange
        const $testElement = this.$element().addClass('dx-widget');
        const options = {
            sorting: {
                showSortIndexes: true,
                mode: 'multiple'
            },
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field2',
                sortIndex: 0,
                sortOrder: 'asc'
            }]
        };
        let $headerCells;

        this.setupDataGrid(options);

        // act
        this.columnHeadersView.render($testElement);
        $headerCells = $testElement.find('.dx-header-row').children();

        // assert
        assert.notOk($testElement.find(SORT_INDEX_ICON_SELECTOR).length, 'no sort indexes');
        assert.notOk($testElement.find(SORT_INDEX_INDICATOR_SELECTOR).length, 'no sort index indicators');

        // act
        this.columnOption(0, 'sortOrder', 'asc');
        $headerCells = $testElement.find('.dx-header-row').children();

        // assert
        assert.equal($headerCells.eq(0).find(SORT_INDEX_ICON_SELECTOR).text(), '2', 'first column\'s sort index');
        assert.equal($headerCells.eq(1).find(SORT_INDEX_ICON_SELECTOR).text(), '1', 'second column\'s sort index');

        assert.ok($headerCells.eq(0).find(SORT_INDEX_INDICATOR_SELECTOR).length, 'first column\'s sort index indicator');
        assert.ok($headerCells.eq(1).find(SORT_INDEX_INDICATOR_SELECTOR).length, 'second column\'s sort index indicator');

        // act
        this.columnOption(1, 'sortOrder', null);
        $headerCells = $testElement.find('.dx-header-row').children();

        // assert
        assert.notOk($testElement.find(SORT_INDEX_ICON_SELECTOR).length, 'no sort indexes');
        assert.notOk($testElement.find(SORT_INDEX_INDICATOR_SELECTOR).length, 'no sort index indicators');
    });

    QUnit.test('Sort index icons should not be rendered when showSortIndexes is false', function(assert) {
        // arrange
        const $testElement = this.$element().addClass('dx-widget');
        const options = {
            sorting: {
                showSortIndexes: false,
                mode: 'multiple'
            }
        };

        this.setupDataGrid(options);

        // act
        this.columnHeadersView.render($testElement);

        // assert
        assert.notOk($testElement.find(SORT_INDEX_ICON_SELECTOR).length, 'no sort indexes');
    });

    function checkHeaderWidths(assert, that, options, widthDiffs) {
        // arrange
        const $testElement = that.$element().addClass('dx-widget');
        let $headerCell;
        let headerCellTextWidth;
        let headerCellWidth;

        that.setupDataGrid(options);

        // act
        that.columnHeadersView.render($testElement);
        that.rowsView.render($testElement);
        that.resizingController.updateDimensions();

        $headerCell = $testElement.find('.dx-header-row').children().eq(0);
        const etalonHeaderCellTextWidth = $headerCell.find('.dx-datagrid-text-content').eq(0).width();
        const etalonHeaderCellWidth = $headerCell.width();

        // assert
        assert.ok(etalonHeaderCellTextWidth, 'header text width');
        assert.ok(etalonHeaderCellWidth, 'header cell width');

        // act
        that.columnOption(1, 'sortOrder', null);
        that.resizingController.updateDimensions();

        $headerCell = $testElement.find('.dx-header-row').children().eq(0);
        headerCellTextWidth = $headerCell.find('.dx-datagrid-text-content').eq(0).width();
        headerCellWidth = $headerCell.width();

        // assert
        assert.equal(Math.floor(headerCellWidth), Math.floor(etalonHeaderCellWidth + widthDiffs.cellWidthDiff), 'header cell width');
        assert.equal(Math.floor(headerCellTextWidth), Math.floor(etalonHeaderCellTextWidth + widthDiffs.textContentWidthDiff), 'header text width');

        // act
        that.columnOption(1, 'sortOrder', 'asc');
        that.resizingController.updateDimensions();

        $headerCell = $testElement.find('.dx-header-row').children().eq(0);
        headerCellTextWidth = $headerCell.find('.dx-datagrid-text-content').eq(0).width();
        headerCellWidth = $headerCell.width();

        // assert
        assert.equal(Math.floor(headerCellWidth), Math.floor(etalonHeaderCellWidth), 'header cell width');
        assert.equal(Math.floor(headerCellTextWidth), Math.floor(etalonHeaderCellTextWidth), 'header text width');
    }

    QUnit.test('Check header widths', function(assert) {
        // arrange
        const options = {
            columns: [{
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 0,
                width: 100,
            }, {
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 1
            }],
            sorting: {
                mode: 'multiple'
            }
        };

        checkHeaderWidths(assert, this, options, {
            textContentWidthDiff: 12,
            cellWidthDiff: 0
        });
    });

    QUnit.test('Check header widths: column with headerFilter', function(assert) {
        // arrange
        const options = {
            sorting: { mode: 'multiple' },
            headerFilter: { visible: true },
            columns: [{
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 0,
                width: 100,
            }, {
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 1
            }]
        };

        checkHeaderWidths(assert, this, options, {
            textContentWidthDiff: 12,
            cellWidthDiff: 0
        });
    });

    QUnit.test('Check header widths: column with center alignment', function(assert) {
        // arrange
        const options = {
            sorting: { mode: 'multiple' },
            columns: [{
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 0,
                width: 100,
                alignment: 'center'
            }, {
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 1
            }]
        };

        checkHeaderWidths(assert, this, options, {
            textContentWidthDiff: 12,
            cellWidthDiff: 0
        });
    });

    QUnit.test('Check header widths: column with center alignment and headerFilter', function(assert) {
        // arrange
        const options = {
            sorting: { mode: 'multiple' },
            headerFilter: { visible: true },
            columns: [{
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 0,
                width: 100,
                alignment: 'center'
            }, {
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 1
            }]
        };

        checkHeaderWidths(assert, this, options, {
            textContentWidthDiff: 12,
            cellWidthDiff: 0
        });
    });

    QUnit.test('Check header widths with columnAutoWidth', function(assert) {
        // arrange
        const options = {
            sorting: { mode: 'multiple' },
            columnAutoWidth: true,
            columns: [{
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 0
            }, {
                dataField: 'aaaaaaaaaaaaaaa',
                sortOrder: 'asc',
                sortIndex: 1
            }]
        };

        this.$element().width(200);

        checkHeaderWidths(assert, this, options, {
            textContentWidthDiff: 0,
            cellWidthDiff: -12
        });
    });

    ['ctrlKey', 'metaKey'].forEach((key) => {
        QUnit.test(`${key} + click should reset sort order`, function(assert) {
            // arrange
            const $testElement = this.$element().addClass('dx-widget');
            const options = {
                sorting: {
                    mode: 'multiple'
                }
            };

            this.setupDataGrid(options);

            // act
            this.columnHeadersView.render($testElement);
            const $headerCells = $testElement.find('.dx-header-row').children();

            $headerCells.eq(1).trigger($.Event('dxclick', { [key]: true }));
            this.clock.tick(10);

            const cols = this.columnsController.getVisibleColumns();
            assert.strictEqual(cols[0].sortOrder, undefined, 'first column has not sort order');
            assert.strictEqual(cols[1].sortOrder, undefined, 'second column has not sort order');
            assert.strictEqual(cols[2].sortOrder, 'asc', 'third column has sort order');
        });
    });

    QUnit.test('Column headers should have correct aria-roledescription', function(assert) {
        // arrange
        const $testElement = this.$element().addClass('dx-widget');
        const options = {
            sorting: {
                mode: 'multiple'
            }
        };

        this.setupDataGrid(options);

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $headerCells = $testElement.find('.dx-header-row td');
        const ariaColumnHeader = messageLocalization.format('dxDataGrid-ariaColumnHeader');
        const getAriaSortIndex = (index = 0) => {
            return `${ariaColumnHeader}, ${messageLocalization.format('dxDataGrid-ariaSortIndex', index + 1)}`;
        };

        assert.equal($headerCells.eq(0).attr('aria-roledescription'), undefined, 'First column has correct aria-roledescription');
        assert.equal($headerCells.eq(1).attr('aria-roledescription'), getAriaSortIndex(1), 'Second column has correct aria-roledescription');
        assert.equal($headerCells.eq(2).attr('aria-roledescription'), getAriaSortIndex(0), 'Third column has correct aria-roledescription');

        // act
        $headerCells.eq(0).trigger($.Event('dxclick', { shiftKey: true }));
        this.clock.tick(10);

        // assert
        assert.equal($headerCells.eq(0).attr('aria-roledescription'), getAriaSortIndex(2), 'First column has correct aria-roledescription');
        assert.equal($headerCells.eq(1).attr('aria-roledescription'), getAriaSortIndex(1), 'Second column has correct aria-roledescription');
        assert.equal($headerCells.eq(2).attr('aria-roledescription'), getAriaSortIndex(0), 'Third column has correct aria-roledescription');

        // act
        $headerCells.eq(0).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.equal($headerCells.eq(0).attr('aria-roledescription'), undefined, 'First column has correct aria-roledescription');
        assert.equal($headerCells.eq(1).attr('aria-roledescription'), undefined, 'Second column has correct aria-roledescription');
        assert.equal($headerCells.eq(2).attr('aria-roledescription'), undefined, 'Third column has correct aria-roledescription');
    });
});

QUnit.module('Headers with RTL', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = function() {
            return $('#container');
        };

        this.setupDataGrid = function(options) {
            dataGridMocks.setupDataGridModules(this, ['data', 'columns', 'headerFilter', 'columnHeaders', 'sorting', 'gridView', 'rows'], {
                initViews: true,
                initDefaultOptions: true,
                options: options
            });
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
}, () => {

    // T862537
    QUnit.test('Header with sorting and headerFilter', function(assert) {
        // arrange
        const $testElement = this.$element().addClass('dx-widget');

        $testElement.css('direction', 'rtl');
        const options = {
            rtlEnabled: true,
            sorting: { mode: 'multiple' },
            showColumnLines: false,
            headerFilter: { visible: true },
            columns: [
                { caption: 'Column 1', allowFiltering: true, allowSorting: true, sortOrder: 'asc', alignment: 'left' },
                { caption: 'Column 2', allowFiltering: true, allowSorting: true, alignment: 'center' },
                { caption: 'Column 3', allowFiltering: true, allowSorting: true, sortOrder: 'desc', alignment: 'right' }
            ]
        };

        // act
        this.setupDataGrid(options);
        this.columnHeadersView.render($testElement);

        // assert
        const $headerCellContent = $testElement.find('.dx-header-row .dx-datagrid-text-content');
        const $headerCellIndicators = $testElement.find('.dx-header-row .dx-column-indicators');

        assert.ok($headerCellContent.eq(0).offset().left < $headerCellIndicators.eq(0).offset().left, 'indicators are on the right');

        assert.ok($headerCellIndicators.eq(1).hasClass('dx-visibility-hidden'), 'indicator is hidden');

        assert.ok($headerCellContent.eq(1).offset().left > $headerCellIndicators.eq(2).offset().left, 'indicators are on the left');
        assert.notOk($headerCellIndicators.eq(2).hasClass('dx-visibility-hidden'), 'indicator is not hidden');

        assert.ok($headerCellContent.eq(2).offset().left > $headerCellIndicators.eq(3).offset().left, 'indicators are on the left');
    });
});

QUnit.module('Render templates with renderAsync', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.setupDataGrid = function(options) {
            dataGridMocks.setupDataGridModules(this, ['data', 'columns', 'headerFilter', 'columnHeaders', 'sorting', 'gridView', 'rows'], {
                initViews: true,
                initDefaultOptions: true,
                options: options
            });
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
}, () => {

    [true, false].forEach((templatesRenderAsynchronously) => {
        [true, false].forEach((renderAsync) => {
            QUnit.test(`Render column with headerCellTemplate when renderAsync = ${renderAsync} and templatesRenderAsynchronously=${templatesRenderAsynchronously}`, function(assert) {
                // arrange
                assert.expect(3);

                const $testElement = $('#container');
                const options = {
                    columns: [{
                        dataField: 'name',
                        headerCellTemplate: '#testTemplate'
                    }],
                    renderAsync,
                    templatesRenderAsynchronously
                };

                this.setupDataGrid(options);
                this._getTemplate = function() {
                    return {
                        render: function(options) {
                            const container = $(options.container).get(0);

                            // assert
                            if(templatesRenderAsynchronously && renderAsync === false) {
                                assert.strictEqual($(container).closest(findShadowHostOrDocument(container)).length, 0, 'container is detached to DOM');
                            } else {
                                assert.strictEqual($(container).closest(findShadowHostOrDocument(container)).length, 1, 'container is attached to DOM');
                            }
                            setTimeout(() => {
                                options.deferred && options.deferred.resolve();
                            }, 50);
                        }
                    };
                };

                // act
                this.columnHeadersView.render($testElement);

                // assert
                assert.strictEqual(this.columnHeadersView._templateDeferreds.size, 1, 'templateDeferreds array isn\'t empty');
                this.clock.tick(50);

                // assert
                assert.strictEqual(this.columnHeadersView._templateDeferreds.size, 0, 'templateDeferreds array is empty');
            });
        });
    });
    // T1139245 - DataGrid - It is not possible to reorder columns when headerCellRender is used in React
    QUnit.test('The renderCompleted should raise then content has rendered', function(assert) {
        const $testElement = $('#container');
        const options = {
            columns: [{
                dataField: 'name',
                headerCellTemplate: '#testTemplate'
            }],
            renderAsync: false,
            templatesRenderAsynchronously: true
        };

        this.setupDataGrid(options);
        this._getTemplate = function() {
            return {
                render: function(options) {
                    setTimeout(() => {
                        options.deferred && options.deferred.resolve();
                    }, 50);
                }
            };
        };
        let renderCompletedCall = false;
        this.columnHeadersView.renderCompleted.add(() => { renderCompletedCall = true; });

        // act
        this.columnHeadersView.render($testElement);
        assert.ok(!renderCompletedCall, 'renderCompleted isnt fired because template isnt rendered');
        this.clock.tick(50);
        assert.ok(renderCompletedCall, 'renderCompleted fired after template is rendered');
    });
});
