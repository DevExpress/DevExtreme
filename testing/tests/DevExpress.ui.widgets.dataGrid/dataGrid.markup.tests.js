import $ from 'jquery';
import windowUtils from 'core/utils/window';

import 'ui/data_grid';

import 'common.css!';


QUnit.testStart(function() {
    var markup =
        '<div id="dataGrid"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('DataGrid markup', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('markup init', function(assert) {
    var $element = $('#dataGrid').dxDataGrid(),
        $container = $element.children(),
        $headersView = $container.children('.dx-datagrid-headers'),
        $rowsView = $container.children('.dx-datagrid-rowsview');

    assert.ok($element.hasClass('dx-widget'), 'dx-widget');
    assert.ok($container.hasClass('dx-datagrid'), 'dx-datagrid');
    assert.equal($headersView.length, 1, 'headers view');
    assert.equal($headersView.find('td').length, 0, 'headers view has no cell');
    assert.equal($rowsView.length, 1, 'rows view');
    assert.ok($rowsView.hasClass('dx-empty'), 'rows view is empty');
    assert.equal($rowsView.find('td').length, 0, 'rows view has no cell');
});

QUnit.test('markup with dataSource', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        dataSource: [{ id: 1, name: 'Alex' }]
    });

    this.clock.tick(30);

    var $container = $element.children(),
        $headersView = $container.children('.dx-datagrid-headers'),
        $rowsView = $container.children('.dx-datagrid-rowsview');

    assert.ok($element.hasClass('dx-widget'), 'dx-widget');
    assert.ok($container.hasClass('dx-datagrid'), 'dx-datagrid');

    assert.equal($headersView.length, 1, 'headers view');
    assert.equal($headersView.find('td').length, 2, 'headers view has 2 cells');
    assert.equal($headersView.find('td').eq(1).text(), 'Name', 'second column title');

    assert.equal($rowsView.length, 1, 'rows view');
    assert.notOk($rowsView.hasClass('dx-empty'), 'rows view is not empty');
    assert.equal($rowsView.find('.dx-data-row').length, 1, 'data row count');
    assert.equal($rowsView.find('.dx-data-row td').length, 2, 'rows view has 2 data cells');
    assert.equal($rowsView.find('td').length, 4, 'rows view has 4 cells');
    assert.equal($rowsView.find('td').eq(1).text(), 'Alex', 'second data cell value');
});

QUnit.test('markup with column width', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        dataSource: [{ id: 1, name: 'Alex' }],
        columns: ['id', { dataField: 'name', width: 200 }]
    });

    this.clock.tick(30);

    var $container = $element.children(),
        $headersView = $container.children('.dx-datagrid-headers'),
        $rowsView = $container.children('.dx-datagrid-rowsview');

    assert.ok($element.hasClass('dx-widget'), 'dx-widget');
    assert.ok($container.hasClass('dx-datagrid'), 'dx-datagrid');

    assert.equal($headersView.length, 1, 'headers view');
    assert.equal($headersView.find('col').get(0).style.width, '', 'headers first col width');
    assert.equal($headersView.find('col').get(1).style.width, '200px', 'headers second col width');

    assert.equal($rowsView.length, 1, 'rows view');
    assert.equal($rowsView.find('col').get(0).style.width, '', 'rows first col width');
    assert.equal($rowsView.find('col').get(1).style.width, '200px', 'rows second col width');
});

QUnit.test('markup with fixed column', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        dataSource: [{ id: 1, name: 'Alex' }],
        columns: ['id', { dataField: 'name', fixed: true }]
    });

    this.clock.tick(30);

    assert.equal($element.find('.dx-datagrid-content-fixed').length, 2, 'There are two fixed tables');
});

QUnit.test('markup with columns resizing/reordering', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        allowColumnResizing: true,
        allowColumnReordering: true,
        dataSource: [{ id: 1, name: 'Alex' }]
    });

    this.clock.tick(30);

    var $separator = $element.find('.dx-datagrid-columns-separator'),
        $tracker = $element.find('.dx-datagrid-tracker'),
        $dragHeader = $element.find('.dx-datagrid-drag-header');

    assert.equal($separator.length, 1, 'separator is rendered');
    assert.equal($tracker.length, 1, 'tracker is rendered');
    assert.equal($dragHeader.length, 1, 'drag header is rendered');
});

QUnit.test('markup with virtual scrolling', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        height: 100,
        paging: { pageSize: 4 },
        scrolling: { mode: 'virtual' },
        columns: ['id'],
        dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    });

    this.clock.tick(300);
    var $virtualRows = $element.find('.dx-datagrid-rowsview .dx-datagrid-table .dx-virtual-row');
    assert.equal($virtualRows.length, 1, 'one virtual row is rendered');
    assert.ok(parseInt($virtualRows.eq(0).children().get(0).style.height) > 20, 'first virtual row height');
});

QUnit.test('markup with editing', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        editing: {
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true
        },
        dataSource: [{ id: 1, name: 'Alex' }]
    });

    this.clock.tick(30);

    var $editCell = $element.find('.dx-data-row .dx-command-edit');
    assert.equal($editCell.length, 1, 'one command edit column in data rows');
    assert.equal($editCell.get(0).style.textAlign, 'center', 'text-align style for edit column');
    assert.equal($element.find('colgroup col').last().get(0).style.width, windowUtils.hasWindow() ? '100px' : 'auto', 'width style for edit command column');
});

QUnit.test('markup with grouping', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        dataSource: [{ id: 1, name: 'Alex' }],
        columns: ['id', { dataField: 'name', groupIndex: 0 }]
    });

    this.clock.tick(30);

    assert.equal($element.find('.dx-command-expand').length, 4, 'four command expand cells: header + group + data + freeSpace');
    assert.equal($element.find('.dx-group-row').length, 1, 'one group row is rendered');
});

QUnit.test('markup with column hiding', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        columnHidingEnabled: true,
        dataSource: [{ id: 1, name: 'Alex' }]
    });

    this.clock.tick(30);

    assert.equal($element.find('.dx-command-adaptive').length, 3, 'three command expand cells: header + data + freeSpace');
    if(!windowUtils.hasWindow()) {
        assert.equal($element.find('colgroup col').last().get(0).style.width, 'auto', 'width style for adaptive command column');
    }
});

QUnit.test('markup with pager', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        paging: { pageSize: 2 },
        pager: {
            showPageSizeSelector: true,
            showNavigationButtons: true,
            showInfo: true
        },
        dataSource: [{ id: 1, name: 'Alex1' }, { id: 2, name: 'Alex2' }, { id: 3, name: 'Alex3' }]
    });

    this.clock.tick(30);
    var $pagerView = $element.find('.dx-datagrid-pager');
    assert.equal($pagerView.length, 1, 'pager view is rendered');
    assert.ok($pagerView.hasClass('dx-pager'), 'pager is rendered');
    assert.equal($pagerView.children().length, windowUtils.hasWindow() ? 2 : 1, 'pager content is rendered');
    assert.equal($pagerView.find('.dx-pages .dx-page').length, windowUtils.hasWindow() ? 2 : 1, 'page size count');
    assert.equal($pagerView.find('.dx-pages .dx-page').eq(0).text(), windowUtils.hasWindow() ? '1' : '', 'page size text');
});

QUnit.test('markup with virtual columns', function(assert) {
    var $element = $('#dataGrid').dxDataGrid({
        width: 400,
        columnWidth: 100,
        scrolling: { columnRenderingMode: 'virtual' },
        dataSource: [{}],
        columns: ['field1', 'field2', 'field3', 'field4', 'field5', 'field6', 'field7', 'field8']
    });

    this.clock.tick(30);

    assert.equal($element.find('.dx-header-row').children().length, windowUtils.hasWindow() ? 6 : 8, 'column count');
});
