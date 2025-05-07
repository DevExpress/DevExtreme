QUnit.testStart(function() {
    const markup =
        '<!--qunit-fixture-->\
    <div id="container">\
        <div id="treeList">\
        </div>\
    </div>\
';

    $('#qunit-fixture').html(markup);
    // $('body').append(markup);
});

import 'generic_light.css!';
import $ from 'jquery';
import { noop } from 'core/utils/common';
import devices from '__internal/core/m_devices';
import { getOuterHeight } from 'core/utils/size';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import { TreeListWrapper } from '../../helpers/wrappers/dataGridWrappers.js';
import ArrayStore from 'common/data/array_store';
import TreeList from '__internal/grids/tree_list/m_widget';
import pointerMock from '../../helpers/pointerMock.js';
import { CLICK_EVENT } from '../../helpers/grid/keyboardNavigationHelper.js';
import { createEvent } from 'common/core/events/utils/index';

fx.off = true;

const defaultModuleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

const createTreeList = function(options) {
    const treeListElement = $('#treeList').dxTreeList(options);

    QUnit.assert.ok(treeListElement);
    const treeList = treeListElement.dxTreeList('instance');
    return treeList;
};

const generateData = function(count) {
    let i = 1;
    const result = [];

    while(i < count * 2) {
        result.push({ id: i, parentId: 0 }, { id: i + 1, parentId: i });
        i += 2;
    }

    return result;
};

const treeListWrapper = new TreeListWrapper('#container');

QUnit.module('Initialization', defaultModuleConfig, () => {
    QUnit.test('Empty options', function(assert) {
        const treeList = createTreeList({});
        const $treeListElement = $(treeList.$element());
        const $noDataElement = $treeListElement.find('.dx-treelist-nodata');

        assert.ok(treeList);
        assert.ok($treeListElement.hasClass('dx-treelist'), 'widget class on the root element');
        assert.ok($noDataElement.length, 'widget have a \'no data\' element');
        assert.ok($noDataElement.is(':visible'), '\'No data\' element is visible');
        assert.ok($treeListElement.children().hasClass('dx-treelist-container'), 'container class on the child');
    });

    QUnit.test('Sorting should be applied on header cell click', function(assert) {
        const treeList = createTreeList({
            columns: ['name', 'age'],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19 },
                { id: 2, parentId: 0, name: 'Name 1', age: 19 },
                { id: 3, parentId: 0, name: 'Name 2', age: 18 }
            ]
        });

        this.clock.tick(10);

        // act
        const $headerCell = $(treeList.$element().find('.dx-header-row td').first());

        $($headerCell).trigger('dxclick');
        this.clock.tick(10);

        // assert
        const $dataRows = $(treeList.$element().find('.dx-data-row'));
        assert.equal($dataRows.eq(0).children().eq(0).text(), 'Name 1', 'row 0 is sorted');
        assert.equal($dataRows.eq(1).children().eq(0).text(), 'Name 2', 'row 1 is sorted');
        assert.equal($dataRows.eq(2).children().eq(0).text(), 'Name 3', 'row 2 is sorted');
        assert.equal(treeList.$element().find('.dx-sort-up').length, 1, 'one sort up indicator');
        assert.equal(treeList.$element().find('.dx-header-row td').first().find('.dx-sort-up').length, 1, 'sort indicator is rendered in first cell');
    });

    QUnit.test('Fixed column should be rendered in separate table', function(assert) {
        // act
        const treeList = createTreeList({
            columns: [{ dataField: 'name', fixed: true }, 'age'],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 19 }
            ],
            columnFixing: {
                legacyMode: true
            }
        });

        this.clock.tick(10);

        // assert
        const $rowElement = $(treeList.getRowElement(0));
        assert.equal($rowElement.length, 2, 'two row elements for one row');
        assert.notEqual($rowElement.eq(0).closest('table').get(0), $rowElement.eq(1).closest('table').get(0), 'row elements are in different tables');
    });

    QUnit.test('Resize columns', function(assert) {
        // arrange
        const treeList = createTreeList({
            width: 400,
            allowColumnResizing: true,
            loadingTimeout: null,
            dataSource: [{ id: 1, firstName: 'Dmitriy', lastName: 'Semenov', room: 101, birthDay: '1992/08/06' }],
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }, { dataField: 'room', width: 100 }, { dataField: 'birthDay', width: 100 }]
        });

        // act
        const resizeController = treeList.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 1 };
        resizeController._setupResizingInfo(-9800);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9750,
                preventDefault: noop
            }
        });

        // assert
        const headersCols = $('.dx-treelist-headers col');
        const rowsCols = $('.dx-treelist-rowsview col');
        assert.equal($(headersCols[1]).css('width'), '150px', 'width of two column - headers view');
        assert.equal($(headersCols[2]).css('width'), '50px', 'width of three column - headers view');
        assert.equal($(rowsCols[1]).css('width'), '150px', 'width of two column - rows view');
        assert.equal($(rowsCols[2]).css('width'), '50px', 'width of three column - rows view');
    });

    QUnit.test('Reordering column', function(assert) {
        // arrange
        const treeList = createTreeList({
            allowColumnReordering: true,
            loadingTimeout: null,
            dataSource: [{ id: 1, firstName: '1', lastName: '2', room: '3', birthDay: '4' }],
            columns: ['firstName', 'lastName', 'room', 'birthDay']
        });

        // act
        const columnController = treeList.getController('columns');
        columnController.moveColumn(0, 3);

        // assert
        const $cellElement = $('#treeList').find('.dx-treelist-rowsview').find('.dx-data-row > td').first();
        const $iconContainer = $('#treeList').find('.dx-treelist-rowsview').find('.dx-treelist-icon-container');
        assert.equal($iconContainer.length, 1, 'count expand icon');
        assert.equal($cellElement.children('.dx-treelist-icon-container').length, 1, 'first cell have expand icon');
        assert.equal($cellElement.text(), '2', 'first cell value');
    });

    QUnit.test('Columns hiding - columnHidingEnabled is true', function(assert) {
        // arrange, act
        let $cellElement;
        const treeList = createTreeList({
            width: 200,
            loadingTimeout: null,
            columnHidingEnabled: true,
            dataSource: [{ id: 1, firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }],
            columns: ['firstName', 'lastName']
        });

        // assert
        $cellElement = $(treeList.$element().find('.dx-header-row > td'));
        assert.equal($cellElement.length, 3, 'count cell');
        assert.equal($cellElement.eq(0).text(), 'First Name', 'caption of the first cell');
        assert.notOk($cellElement.eq(0).hasClass('dx-treelist-hidden-column'), 'first cell is visible');
        assert.ok($cellElement.eq(1).hasClass('dx-treelist-hidden-column'), 'second cell is hidden');
        assert.notOk($cellElement.eq(2).hasClass('dx-command-adaptive-hidden'), 'adaptive cell is visible');

        this.clock.tick(300);

        // act
        treeList.option('width', 800);

        // assert
        $cellElement = $(treeList.$element().find('.dx-header-row > td'));
        assert.equal($cellElement.length, 3, 'count cell');
        assert.equal($cellElement.eq(0).text(), 'First Name', 'caption of the first cell');
        assert.notOk($cellElement.eq(0).hasClass('dx-treelist-hidden-column'), 'first cell is visible');
        assert.equal($cellElement.eq(1).text(), 'Last Name', 'caption of the second cell');
        assert.notOk($cellElement.eq(1).hasClass('dx-treelist-hidden-column'), 'second cell is visible');
        assert.ok($cellElement.eq(2).hasClass('dx-command-adaptive-hidden'), 'adaptive cell is hidden');
    });

    QUnit.test('Height rows view', function(assert) {
        // arrange, act
        const treeList = createTreeList({
            height: 200,
            showColumnHeaders: false,
            loadingTimeout: null,
            columnHidingEnabled: true,
            dataSource: [
                { id: 1, name: 'Name 1', age: 10 },
                { id: 2, name: 'Name 2', age: 11 },
                { id: 3, name: 'Name 3', age: 12 },
                { id: 4, name: 'Name 4', age: 13 },
                { id: 5, name: 'Name 5', age: 14 },
                { id: 6, name: 'Name 6', age: 15 },
                { id: 7, name: 'Name 7', age: 16 }
            ]
        });

        // assert
        assert.equal(getOuterHeight(treeList.$element().find('.dx-treelist-rowsview')), 200, 'height rows view');
    });

    QUnit.test('Virtual scrolling enabled by default and should render two virtual rows', function(assert) {
        const treeList = createTreeList({
            height: 50,
            paging: { pageSize: 2, pageIndex: 1 },
            columns: ['name', 'age'],
            scrolling: {
                useNative: false,
                prerenderedRowCount: 0
            },
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 19 },
                { id: 2, parentId: 0, name: 'Name 2', age: 19 },
                { id: 3, parentId: 0, name: 'Name 3', age: 18 },
                { id: 4, parentId: 0, name: 'Name 4', age: 18 },
                { id: 5, parentId: 0, name: 'Name 5', age: 18 },
                { id: 6, parentId: 0, name: 'Name 6', age: 18 },
                { id: 7, parentId: 0, name: 'Name 7', age: 18 },
                { id: 8, parentId: 0, name: 'Name 8', age: 18 }
            ]
        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal(treeList.option('scrolling.mode'), 'virtual', 'scrolling mode is virtual');
        const $rowsViewTables = $(treeList.$element().find('.dx-treelist-rowsview table'));
        assert.equal($rowsViewTables.length, 1, 'one table are rendered');
        assert.equal($rowsViewTables.eq(0).find('.dx-data-row').length, 1, 'data rows in table');
        assert.equal($rowsViewTables.eq(0).find('.dx-virtual-row').length, 2, 'two virtual rows in table');
        assert.equal($rowsViewTables.eq(0).find('.dx-freespace-row').length, 1, 'one freespace row in table');
    });


    QUnit.testInActiveWindow('Ctrl + left/right keys should collapse/expand row', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
            return;
        }
        const treeList = createTreeList({
            columns: ['name', 'age'],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 19 },
                { id: 2, parentId: 0, name: 'Name 2', age: 19 },
                { id: 3, parentId: 2, name: 'Name 3', age: 18 }
            ]
        });
        const navigationController = treeList.getController('keyboardNavigation');

        this.clock.tick(10);

        treeList.focus($(treeList.getCellElement(1, 0)));
        this.clock.tick(10);

        // act
        navigationController._rowsViewKeyDownHandler({ keyName: 'rightArrow', key: 'ArrowRight', ctrl: true, originalEvent: $.Event('keydown', { target: treeList.getCellElement(1, 0), ctrlKey: true }) });
        this.clock.tick(10);

        // assert
        assert.ok(treeList.isRowExpanded(2), 'second row is expanded');

        // act
        navigationController._rowsViewKeyDownHandler({ keyName: 'leftArrow', key: 'ArrowLeft', ctrl: true, originalEvent: $.Event('keydown', { target: treeList.getCellElement(1, 0), ctrlKey: true }) });
        this.clock.tick(10);

        // assert
        assert.notOk(treeList.isRowExpanded(2), 'second row is collapsed');
    });

    // T917248
    QUnit.testInActiveWindow('Row should be selected via space key press on check box', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard navigation is disabled for not desktop devices');
            return;
        }
        const treeList = createTreeList({
            columns: ['name', 'age'],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 19 },
                { id: 2, parentId: 1, name: 'Name 2', age: 19 }
            ],
            selection: {
                mode: 'multiple',
                recursive: true
            },
            expandedRowKeys: [1]
        });

        this.clock.tick(10);

        const $target = $(treeList.getCellElement(1, 0)).find('.dx-select-checkbox');

        treeList.focus($target.get(0));
        this.clock.tick(10);

        // act
        $target.trigger(createEvent('keydown', { target: $target.get(0), key: ' ' }));
        this.clock.tick(10);

        // assert
        const $checkBoxes = treeList.$element().find('.dx-select-checkbox');
        for(let i = 0; i < $checkBoxes.length; i++) {
            assert.equal($checkBoxes.eq(i).attr('aria-checked'), 'true', 'checkbox is checked');
        }

        assert.deepEqual(treeList.getSelectedRowKeys(), [2], 'row was selected');
    });

    // T917248
    QUnit.testInActiveWindow('Row should not be selected after click on expand icon', function(assert) {
        const treeList = createTreeList({
            columns: ['name', 'age'],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 19 },
                { id: 2, parentId: 1, name: 'Name 2', age: 19 }
            ],
            selection: {
                mode: 'multiple'
            }
        });

        this.clock.tick(10);

        $('.dx-treelist-collapsed').trigger('dxclick');

        this.clock.tick(10);

        // assert
        const $checkBoxes = treeList.$element().find('.dx-select-checkbox');
        for(let i = 0; i < $checkBoxes.length; i++) {
            assert.equal($checkBoxes.eq(i).attr('aria-checked'), 'false', 'checkbox is checked');
        }

        assert.deepEqual(treeList.getSelectedRowKeys(), [], 'row was not selected');
    });

    QUnit.test('Filter Row', function(assert) {
        const treeList = createTreeList({
            filterRow: {
                visible: true
            },
            columns: ['name', { dataField: 'age', filterValue: 19 }],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19 },
                { id: 2, parentId: 0, name: 'Name 1', age: 19 },
                { id: 3, parentId: 0, name: 'Name 2', age: 18 }
            ]
        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal(treeList.$element().find('.dx-data-row').length, 2, 'two filtered rows are rendered');
        assert.equal(treeList.$element().find('.dx-treelist-filter-row').length, 1, 'filter row is rendered');
    });

    // T516918
    QUnit.test('Filter menu items should have icons', function(assert) {
        // arrange
        const treeList = createTreeList({
            filterRow: {
                visible: true
            },
            columns: ['name', { dataField: 'age', filterValue: 19 }],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19 },
                { id: 2, parentId: 0, name: 'Name 1', age: 19 },
                { id: 3, parentId: 0, name: 'Name 2', age: 18 }
            ]
        });

        this.clock.tick(10);

        // act
        const $filterMenuElement = $(treeList.$element().find('.dx-treelist-filter-row').find('.dx-menu').first().find('.dx-menu-item'));
        $($filterMenuElement).trigger('dxclick'); // show menu

        // assert
        const $menuItemElements = $('.dx-overlay-wrapper').find('.dx-menu-item');
        assert.ok($menuItemElements.length > 0, 'has filter menu items');
        assert.equal($menuItemElements.first().find('.dx-icon').css('fontFamily'), 'DXIcons', 'first item has icon');
    });

    QUnit.test('Header Filter', function(assert) {
        const treeList = createTreeList({
            headerFilter: {
                visible: true
            },
            columns: ['name', { dataField: 'age', filterValues: [19] }],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19 },
                { id: 2, parentId: 0, name: 'Name 1', age: 19 },
                { id: 3, parentId: 0, name: 'Name 2', age: 18 }
            ]
        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal(treeList.$element().find('.dx-data-row').length, 2, 'two filtered rows are rendered');
        assert.equal(treeList.$element().find('.dx-header-filter').length, 2, 'two header filter icons area rendered');
    });

    QUnit.test('Expanding of all items should work correctly after clearing filter', function(assert) {
        const treeList = createTreeList({
            headerFilter: {
                visible: true
            },
            autoExpandAll: true,
            columns: ['name', { dataField: 'age', filterValues: [19], allowFiltering: true }, 'gender'],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19, gender: 'male' },
                { id: 2, parentId: 1, name: 'Name 1', age: 19, gender: 'female' },
                { id: 3, parentId: 1, name: 'Name 2', age: 18, gender: 'male' },
                { id: 4, parentId: 2, name: 'Name 4', age: 19, gender: 'male' },
                { id: 5, parentId: 2, name: 'Name 5', age: 20, gender: 'female' },
                { id: 6, parentId: 3, name: 'Name 6', age: 18, gender: 'male' }
            ]
        });

        this.clock.tick(10);
        assert.equal(treeList.$element().find('.dx-data-row').length, 3, 'filtered rows are rendered');
        treeList.filter('gender', '=', 'male');
        this.clock.tick(10);
        assert.equal(treeList.$element().find('.dx-data-row').length, 3, 'filtered rows are rendered');

        // act
        treeList.clearFilter();
        this.clock.tick(10);

        // assert
        assert.equal(treeList.$element().find('.dx-data-row').length, 6, 'six filtered rows are rendered');
    });

    QUnit.test('Items should be collapsed after clearing filter, autoExpandAll = false', function(assert) {
        const treeList = createTreeList({
            headerFilter: {
                visible: true
            },
            autoExpandAll: false,
            columns: ['name', { dataField: 'age', filterValues: [19], allowFiltering: true }],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19 },
                { id: 2, parentId: 1, name: 'Name 1', age: 19 },
                { id: 3, parentId: 2, name: 'Name 2', age: 18 },
                { id: 4, parentId: 0, name: 'Name 4', age: 19 },
                { id: 5, parentId: 4, name: 'Name 5', age: 20 },
                { id: 6, parentId: 5, name: 'Name 6', age: 18 }
            ]
        });

        this.clock.tick(10);
        assert.equal(treeList.$element().find('.dx-data-row').length, 3, 'filtered rows are rendered');

        // act
        treeList.clearFilter();
        this.clock.tick(10);

        // assert
        assert.equal(treeList.$element().find('.dx-data-row').length, 2, 'two rows are rendered');
    });

    QUnit.test('Search Panel', function(assert) {
        const treeList = createTreeList({
            columns: ['name', 'age'],
            searchPanel: {
                visible: true,
                text: 'Name 1'
            },
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19 },
                { id: 2, parentId: 0, name: 'Name 1', age: 19 },
                { id: 3, parentId: 0, name: 'Name 2', age: 18 }
            ]
        });

        // act
        this.clock.tick(10);


        // assert
        const $element = treeList.$element();
        const $searchBox = $element.find('.dx-toolbar .dx-searchbox');
        assert.equal($element.find('.dx-data-row').length, 1, 'one filtered row is rendered');
        assert.equal($searchBox.length, 1, 'searchPanel is rendered');
        assert.equal($searchBox.dxTextBox('instance').option('value'), 'Name 1', 'searchPanel text is applied');
        assert.equal($searchBox.find('input').attr('aria-label'), 'Search in the tree list', 'aria-label');
    });

    QUnit.test('Selectable treeList should have right default options', function(assert) {
        const treeList = createTreeList({
            columns: ['name', 'age'],
            selection: { mode: 'multiple' },
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19 },
                { id: 2, parentId: 0, name: 'Name 1', age: 19 },
                { id: 3, parentId: 0, name: 'Name 2', age: 18 }
            ]
        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal(treeList.option('selection.showCheckBoxesMode'), 'always', 'showCheckBoxesMode is always');
    });

    QUnit.test('Click on selectCheckBox shouldn\'t render editor, editing & selection', function(assert) {
        createTreeList({
            columns: ['name', 'age'],
            selection: { mode: 'multiple' },
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19 }
            ]
        });

        // act
        this.clock.tick(10);
        const $selectCheckbox = $('#treeList').find('.dx-treelist-cell-expandable').eq(0).find('.dx-select-checkbox').eq(0);
        $($selectCheckbox).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.notOk($('#treeList').find('.dx-texteditor').length, 'Editing textEditor wasn\'t rendered');
    });

    // T857405
    QUnit.test('Assign new values using the promise parameter in the onInitNewRow', function(assert) {
        // arrange
        let visibleRows;

        const rowData = { room: 42 };

        const treeList = createTreeList({
            editing: {
                allowAdding: true,
                mode: 'row'
            },
            dataSource: [],
            columns: ['room'],
            onInitNewRow: function(e) {
                e.promise = $.Deferred();
                setTimeout(() => {
                    e.data = rowData;
                    e.promise.resolve();
                }, 500);
            }
        });

        // act
        treeList.addRow();

        visibleRows = treeList.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 0);

        // act
        this.clock.tick(500);

        treeList.saveEditData();
        this.clock.tick(10);

        visibleRows = treeList.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'row was added');
        assert.deepEqual(visibleRows[0].data, rowData, 'row data');
    });

    // T742147
    QUnit.test('Selection checkbox should be rendered if first column is lookup', function(assert) {
        const treeList = createTreeList({
            columns: [{
                dataField: 'nameId',
                lookup: {
                    dataSource: [{ id: 1, name: 'Name 1' }],
                    valueExpr: 'id',
                    displayExpr: 'name'
                }
            }, 'age'],
            selection: {
                mode: 'multiple'
            },
            dataSource: [
                { id: 1, parentId: 0, nameId: 1, age: 19 }
            ]
        });

        // act
        this.clock.tick(10);

        // assert
        const $firstDataCell = $(treeList.getCellElement(0, 0));
        assert.equal($firstDataCell.find('.dx-select-checkbox.dx-checkbox').length, 1, 'first cell contains select checkbox');
        assert.equal($firstDataCell.find('.dx-treelist-text-content').text(), 'Name 1', 'first cell text');
    });

    QUnit.test('Filter row should not contains selection checkboxes', function(assert) {
        createTreeList({
            columns: ['name', 'age'],
            selection: { mode: 'multiple' },
            filterRow: {
                visible: true
            },
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 3', age: 19 }
            ]
        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal($('#treeList').find('.dx-treelist-filter-row').length, 1, 'filter row is rendered');
        assert.equal($('#treeList').find('.dx-checkbox').length, 2, 'selection chebkboxes are rendered');
        assert.equal($('#treeList').find('.dx-treelist-filter-row .dx-checkbox').length, 0, 'no selection chebkboxes in filter row');
    });

    QUnit.test('Aria accessibility', function(assert) {
        // arrange, act
        const treeList = createTreeList({
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 19 },
                { id: 2, parentId: 1, name: 'Name 2', age: 19 },
                { id: 3, parentId: 2, name: 'Name 3', age: 18 },
                { id: 4, parentId: 0, name: 'Name 4', age: 18 }
            ],
            expandedRowKeys: [1]
        });

        this.clock.tick(10);

        // assert
        const $treeList = $(treeList.$element());

        assert.equal($treeList.find('.dx-gridbase-container').attr('role'), 'group', 'treeList base container - value of \'role\' attribute');

        const $headerTable = $treeList.find('.dx-treelist-headers table').first();
        assert.equal($headerTable.attr('role'), 'presentation', 'header table - value of \'role\' attribute');

        const $dataTable = $treeList.find('.dx-treelist-rowsview table').first();
        assert.equal($dataTable.attr('role'), 'presentation', 'data table - value of \'role\' attribute');

        const $dataRows = $dataTable.find('.dx-data-row');
        assert.equal($dataRows.eq(0).attr('aria-expanded'), 'true', 'first data row - value of \'aria-expanded\' attribute');
        assert.equal($dataRows.eq(0).attr('aria-level'), '1', 'first data row - value of \'aria-level\' attribute');
        assert.equal($dataRows.eq(1).attr('aria-expanded'), 'false', 'second data row - value of \'aria-expanded\' attribute');
        assert.equal($dataRows.eq(1).attr('aria-level'), '2', 'second data row - value of \'aria-level\' attribute');
        assert.equal($dataRows.eq(2).attr('aria-expanded'), undefined, 'third data row hasn\'t the \'aria-expanded\' attribute');
        assert.equal($dataRows.eq(2).attr('aria-level'), '1', 'third data row - value of \'aria-level\' attribute');
    });

    QUnit.test('Command buttons should contains aria-label accessibility attribute if rendered as icons (T755185)', function(assert) {
        // arrange
        const columnsWrapper = treeListWrapper.columns;
        const treeList = createTreeList({
            dataSource: [
                { id: 0, parentId: -1, c0: 'c0' },
                { id: 1, parentId: 0, c0: 'c1' }
            ],
            columns: [
                {
                    type: 'buttons',
                    buttons: ['add', 'edit', 'delete', 'save', 'cancel']
                },
                'id'
            ],
            editing: {
                allowUpdating: true,
                allowDeleting: true,
                useIcons: true
            }
        });

        this.clock.tick(10);

        // assert
        columnsWrapper.getCommandButtons().each((_, button) => {
            const ariaLabel = $(button).attr('aria-label');
            assert.ok(ariaLabel && ariaLabel.length, `aria-label '${ariaLabel}'`);
        });

        // act
        treeList.editRow(0);
        // assert
        columnsWrapper.getCommandButtons().each((_, button) => {
            const ariaLabel = $(button).attr('aria-label');
            assert.ok(ariaLabel && ariaLabel.length, `aria-label '${ariaLabel}'`);
        });
    });

    // T632028
    QUnit.test('Display context menu', function(assert) {
        // arrange, act
        const contextMenuItems = [{ text: 'test' }];
        const treeList = createTreeList({
            dataSource: [
                { id: 1 }
            ],
            onContextMenuPreparing: function($event) {
                $event.items = contextMenuItems;
            }
        });

        this.clock.tick(10);

        const $cellElement = $(treeList.getCellElement(0, 0));
        $cellElement.trigger('contextmenu');
        const contextMenuInstance = treeList.getView('contextMenuView').element().dxContextMenu('instance');

        // assert
        assert.ok(contextMenuInstance);
        assert.deepEqual(contextMenuInstance.option('items'), contextMenuItems);
    });

    QUnit.test('filterSyncEnabled is working in TreeList', function(assert) {
        // act
        const treeList = createTreeList({
            filterSyncEnabled: true,
            columns: [{ dataField: 'field', allowHeaderFiltering: true, filterValues: [2] }]
        });

        // act
        treeList.columnOption('field', { filterValues: [2, 1] });

        // assert
        assert.deepEqual(treeList.option('filterValue'), ['field', 'anyof', [2, 1]]);
    });

    QUnit.test('filterBulider is working in TreeList', function(assert) {
        // arrange
        const handlerInit = sinon.spy();

        // act
        const treeList = createTreeList({
            filterBuilder: {
                onInitialized: handlerInit
            },
            columns: [{ dataField: 'field' }]
        });

        // assert
        assert.equal(handlerInit.called, 0);

        // act
        treeList.option('filterBuilderPopup.visible', true);

        // assert
        assert.equal(handlerInit.called, 1);
    });

    // T812031
    QUnit.test('Change filterPanel.visible to false', function(assert) {
        // arrange
        // act
        const treeList = createTreeList({
            dataSource: [],
            filterPanel: {
                visible: true
            },
            columns: [{ dataField: 'field' }]
        });

        this.clock.tick(10);

        // assert
        assert.ok(treeList.$element().find('.dx-treelist-filter-panel').is(':visible'), 'filter panel is visible');

        // act
        treeList.option('filterPanel.visible', false);

        // assert
        assert.notOk(treeList.$element().find('.dx-treelist-filter-panel').is(':visible'), 'filter panel is hidden');
    });

    QUnit.test('TreeList with paging', function(assert) {
        // arrange, act
        const treeList = createTreeList({
            autoExpandAll: true,
            dataSource: generateData(5),
            paging: {
                pageSize: 5
            },
            pager: {
                visible: true,
                showPageSizeSelector: true,
                allowedPageSizes: [2, 5, 8]
            }
        });

        this.clock.tick(10);

        // assert
        const $treeListElement = $(treeList.$element());
        assert.strictEqual($treeListElement.find('.dx-treelist-pager').length, 1, 'has pager');
        assert.strictEqual($treeListElement.find('.dx-page').length, 2, 'number of containers for page');
        assert.ok($treeListElement.find('.dx-page').first().hasClass('dx-selection'), 'current page - first');
        assert.strictEqual($treeListElement.find('.dx-page-size').length, 3, 'number of containers for page sizes');
    });

    // T969977
    QUnit.test('HeaderPanel should not have bottom border', function(assert) {
        // arrange
        const treeList = createTreeList({
            dataSource: [],
            columnChooser: {
                enabled: true
            },
            showBorders: true,
            columns: ['test']
        });

        this.clock.tick(10);
        const $treeList = $(treeList.$element());
        const $headerPanel = $treeList.find('.dx-treelist-header-panel');

        // assert
        assert.equal($headerPanel.css('border-bottom-width'), '0px', 'bottom border width');
    });

    // T1136079
    QUnit.test('No exceptions when a custom command button\'s template is defined', function(assert) {
        // arrange, act
        createTreeList({
            dataSource: [
                { id: 0, parentId: -1, c0: 'c0' },
                { id: 1, parentId: 0, c0: 'c1' }
            ],
            columns: [
                {
                    type: 'buttons',
                    buttons: [{
                        template: () => {
                            return $('<span>test</span>');
                        }
                    }]
                },
                'id',
                'c0'
            ]
        });

        this.clock.tick(100);

        // assert
        assert.ok(true, 'not exception');
    });
});

QUnit.module('Option Changed', defaultModuleConfig, () => {

    QUnit.test('Change dataSource, selectedRowKeys and scrolling options together', function(assert) {
        // arrange
        const treeList = createTreeList({});
        this.clock.tick(30);

        // act
        treeList.option({
            dataSource: [{ id: 1 }],
            selectedRowKeys: [1],
            scrolling: { mode: 'virtual' }
        });
        this.clock.tick(30);

        // assert
        assert.strictEqual(treeList.getVisibleRows().length, 1, 'row count');
    });

    // T575440
    QUnit.test('Change options and call selectRows', function(assert) {
        // arrange

        const createOptions = function() {
            return {
                dataSource: [{
                    id: 1,
                    text: 'Brazil'
                }, {
                    id: 2,
                    text: 'Spain'
                }, {
                    id: 3,
                    text: 'USA'
                }],
                selectedRowKeys: [1, 2, 3],
                selection: {
                    mode: 'multiple',
                    recursive: true
                },
                scrolling: {
                    mode: 'virtual'
                }
            };
        };

        const treeList = createTreeList(createOptions());
        this.clock.tick(30);

        // act
        treeList.option(createOptions());
        treeList.selectRows([1, 2, 3]);
        this.clock.tick(30);

        // assert
        assert.strictEqual(treeList.getSelectedRowsData().length, 3, 'selected rows');
    });

    // T576806
    QUnit.test('Pages should be correctly loaded after change dataSource and selectedRowKeys options', function(assert) {
        const treeList = createTreeList({
            height: 1500,
            autoExpandAll: true
        });

        this.clock.tick(300);

        // act
        treeList.option({
            dataSource: generateData(20),
            selectedRowKeys: [1]
        });
        this.clock.tick(10);

        // assert
        assert.strictEqual(treeList.getVisibleRows().length, 40, 'row count');
    });

    // T591390
    QUnit.test('Change expandedRowKeys', function(assert) {
        // arrange
        const treeList = createTreeList({
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 16 },
                { id: 2, parentId: 1, name: 'Name 2', age: 17 },
                { id: 3, parentId: 2, name: 'Name 3', age: 18 }
            ]
        });
        this.clock.tick(30);

        // assert
        assert.strictEqual(treeList.getVisibleRows().length, 1, 'row count');

        // act
        treeList.option('expandedRowKeys', [1, 2]);
        this.clock.tick(30);

        // assert
        assert.strictEqual(treeList.getVisibleRows().length, 3, 'row count');
    });

    QUnit.test('TreeList with columnAutoWidth should be rendered', function(assert) {
        // act
        const treeList = createTreeList({
            columnAutoWidth: true,
            columns: ['name', 'age'],
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 19 }
            ]
        });

        this.clock.tick(10);

        // assert
        assert.equal(treeList.$element().find('.dx-treelist-headers .dx-header-row').length, 1, 'header row is rendered');
        assert.equal(treeList.$element().find('.dx-treelist-rowsview .dx-data-row').length, 1, 'data row is rendered');
    });

    QUnit.test('Virtual columns', function(assert) {
        // arrange, act
        const columns = [];

        for(let i = 1; i <= 20; i++) {
            columns.push('field' + i);
        }

        const treeList = createTreeList({
            width: 200,
            columnWidth: 50,
            dataSource: [{}],
            columns: columns,
            scrolling: {
                columnRenderingMode: 'virtual'
            }
        });

        this.clock.tick(10);

        // assert
        assert.equal(treeList.getVisibleColumns().length, 6, 'visible column count');
    });

    QUnit.test('Call getSelectedRowKeys with \'leavesOnly\' parameter and wrong selectedKeys after dataSource change', function(assert) {
        const treeList = createTreeList({
            dataSource: [
                { id: 1, field1: 'test1' },
                { id: 2, parentId: 1, field1: 'test2' },
                { id: 3, field1: 'test3' }
            ],
            selection: {
                mode: 'multiple',
                recursive: true
            },
            selectedRowKeys: [1, 3],
        });
        this.clock.tick(30);

        // act
        treeList.option({
            dataSource: [
                { id: 1, field1: 'test1' },
                { id: 2, parentId: 1, field1: 'test2' }
            ]
        });

        // assert
        assert.deepEqual(treeList.getSelectedRowKeys('leavesOnly'), [], 'dataSource is not loaded yet');

        this.clock.tick(30);
        assert.deepEqual(treeList.getSelectedRowKeys('leavesOnly'), [2], 'dataSource is reloaded');
    });

    // T664886
    QUnit.test('Highlight searchText in expandable column', function(assert) {
        const treeList = createTreeList({
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 16 },
                { id: 2, parentId: 1, name: 'Name 2', age: 17 },
                { id: 3, parentId: 2, name: 'Name', age: 18 }
            ],
            searchPanel: {
                text: '3'
            }
        });
        const searchTextSelector = '.dx-treelist-search-text';

        this.clock.tick(30);

        assert.equal(treeList.$element().find(searchTextSelector).length, 1);
    });

    // T835655
    QUnit.test('Change searchPanel.text', function(assert) {
        const treeList = createTreeList({
            dataSource: [
                { id: 1, parentId: 0, name: 'Name 1', age: 16 },
                { id: 2, parentId: 1, name: 'Name 2', age: 17 },
                { id: 3, parentId: 2, name: 'Name', age: 18 }
            ],
            searchPanel: {
                visible: true,
                text: '3'
            }
        });
        const searchPanelSelector = '.dx-treelist-search-panel';
        let $searchInput;

        this.clock.tick(30);

        // act, assert
        $searchInput = treeList.$element().find(searchPanelSelector).find('input');

        assert.equal($searchInput.val(), '3', 'search text');

        // act
        treeList.option('searchPanel.text', 'new text');

        $searchInput = treeList.$element().find(searchPanelSelector).find('input');

        // assert
        assert.equal($searchInput.val(), 'new text', 'search text');
    });

    // T846709
    ['standard', 'virual'].forEach((rowRenderingMode) => {
        QUnit.test(`Modified expand state should be displayed correctly when repaintChangesOnly is true and scrolling.rowRenderingMode is ${rowRenderingMode}`, function(assert) {
            // arrange
            const data = generateData(2);
            const treeList = createTreeList({
                dataSource: data,
                autoExpandAll: true,
                repaintChangesOnly: true,
                scrolling: {
                    rowRenderingMode: rowRenderingMode
                },
                columns: ['id']
            });

            this.clock.tick(30);

            // act
            data[1].parentId = data[3].id;
            treeList.option('dataSource', [...data]);
            this.clock.tick(30);

            // assert
            const $rowElements = $(treeList.element()).find('.dx-treelist-rowsview').find('.dx-data-row');
            assert.strictEqual($rowElements.length, 3, 'node count');
            assert.strictEqual($rowElements.eq(0).find('.dx-treelist-empty-space').length, 1, 'first node - first level');
            assert.strictEqual($rowElements.eq(0).children().first().text(), '1', 'first node - first cell text');
            assert.strictEqual($rowElements.eq(1).find('.dx-treelist-empty-space').length, 1, 'second node - first level');
            assert.strictEqual($rowElements.eq(1).children().first().text(), '3', 'second node - first cell text');
            assert.strictEqual($rowElements.eq(2).find('.dx-treelist-empty-space').length, 2, 'third node - second level');
            assert.strictEqual($rowElements.eq(2).children().first().text(), '4', 'third node - first cell text');
            assert.strictEqual($rowElements.eq(2).children().first().find('.dx-treelist-collapsed').length, 1, 'third node has an expand icon');
        });
    });

    QUnit.test('The select checkbox should be displayed after changing expand state when repaintChangesOnly is true', function(assert) {
        // arrange
        const data = generateData(2);
        const treeList = createTreeList({
            dataSource: data,
            autoExpandAll: true,
            repaintChangesOnly: true,
            selection: {
                mode: 'multiple'
            },
            columns: ['id']
        });

        this.clock.tick(30);

        // act
        data[1].parentId = data[3].id;
        treeList.option('dataSource', [...data]);
        this.clock.tick(30);

        // assert
        const $rowElements = $(treeList.element()).find('.dx-treelist-rowsview').find('.dx-data-row');
        assert.strictEqual($rowElements.length, 3, 'node count');
        assert.strictEqual($rowElements.eq(0).find('.dx-treelist-empty-space').length, 1, 'first node - first level');
        assert.strictEqual($rowElements.eq(0).children().first().text(), '1', 'first node - first cell text');
        assert.strictEqual($rowElements.eq(1).find('.dx-treelist-empty-space').length, 1, 'second node - first level');
        assert.strictEqual($rowElements.eq(1).children().first().text(), '3', 'second node - first cell text');
        assert.strictEqual($rowElements.eq(2).find('.dx-treelist-empty-space').length, 2, 'third node - second level');
        assert.strictEqual($rowElements.eq(2).children().first().text(), '4', 'third node - first cell text');

        const $expandIcon = $rowElements.eq(2).children().first().find('.dx-treelist-collapsed');
        assert.strictEqual($expandIcon.length, 1, 'third node has an expand icon');
        assert.ok($expandIcon.next().hasClass('dx-select-checkbox'), 'third node has a select checkbox');
    });

    // T861052
    QUnit.test('The child node position should be updated after changing dataSource when rowRenderingMode is "virtual" and repaintChangesOnly is true', function(assert) {
        // arrange
        const array = [
            { id: 1, parentId: 0, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) }
        ];
        const treeList = createTreeList({
            dataSource: array,
            autoExpandAll: true,
            loadingTimeout: null,
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            rootValue: 0,
            columns: ['field1', 'field2', 'field3'],
            repaintChangesOnly: true,
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual'
            }
        });

        // assert
        let rows = treeList.getVisibleRows();
        assert.strictEqual(rows[0].level, 0, 'level of the first node');
        assert.strictEqual(rows[1].level, 1, 'level of the second node');
        assert.strictEqual(rows[2].level, 2, 'level of the third node');

        // act
        array[2].parentId = 1;
        treeList.option('dataSource', array);

        // assert
        rows = treeList.getVisibleRows();
        assert.strictEqual(rows[0].level, 0, 'level of the first node');
        assert.strictEqual(rows[1].level, 1, 'level of the second node');
        assert.strictEqual(rows[2].level, 1, 'level of the third node');
    });
});

QUnit.module('Expand/Collapse rows', () => {

    // T627926
    QUnit.test('Nodes should not be shifted after expanding node on last page', function(assert) {
        // arrange
        const clock = sinon.useFakeTimers();
        const treeList = createTreeList({
            height: 120,
            loadingTimeout: null,
            paging: {
                enabled: true,
                pageSize: 2
            },
            scrolling: {
                mode: 'virtual',
                prerenderedRowCount: 0
            },
            expandedRowKeys: [1],
            dataSource: [
                { name: 'Category1', id: 1 },
                { name: 'SubCategory1', id: 2, parentId: 1 },
                { name: 'SubCategory2', id: 3, parentId: 1 },
                { name: 'Category2', id: 4 },
                { name: 'Category3', id: 5 },
                { name: 'Category4', id: 6 },
                { name: 'Category7', id: 7 },
                { name: 'Category5', id: 8 },
                { name: 'SubCategory3', id: 9, parentId: 8 },
                { name: 'SubCategory5', id: 12, parentId: 9 },
                { name: 'SubCategory4', id: 10, parentId: 8 },
                { name: 'Category6', id: 11 }
            ]
        });
        const scrollable = treeList.getScrollable();
        const isNativeScrolling = devices.real().deviceType !== 'desktop' || devices.real().mac;

        try {
            scrollable.scrollTo({ y: 300 }); // scroll to the last page
            isNativeScrolling && $(scrollable.container()).trigger('scroll');
            clock.tick(10);

            const topVisibleRowData = treeList.getTopVisibleRowData();

            // assert
            assert.strictEqual(treeList.pageIndex(), 3, 'page index');
            assert.strictEqual(treeList.pageCount(), 5, 'page count');

            // act
            treeList.expandRow(8);
            treeList.expandRow(9);

            // assert
            assert.strictEqual(treeList.pageIndex(), 3, 'page index');
            assert.strictEqual(treeList.pageCount(), 6, 'page count');
            assert.deepEqual(treeList.getTopVisibleRowData(), topVisibleRowData, 'top visible row data has not changed');
        } finally {
            clock.restore();
        }
    });

    // T648005
    QUnit.test('Scrollbar position must be kept after expanding node when the treelist container has max-height', function(assert) {
        // arrange
        $('#treeList').css('max-height', 400);

        const done = assert.async();
        const treeList = createTreeList({
            loadingTimeout: null,
            scrolling: {
                mode: 'virtual',
                useNative: false
            },
            dataSource: generateData(100)
        });

        treeList.getScrollable().scrollTo({ y: 1000 });

        setTimeout(function() {
            // act
            treeList.expandRow(69);

            setTimeout(function() {
                // assert
                assert.ok($(treeList.element()).find('.dx-treelist-rowsview .dx-scrollbar-vertical > .dx-scrollable-scroll').position().top > 0, 'scrollbar position top');
                done();
            }, 310);
        });
    });

    // T692068
    QUnit.test('Expand row if repaintChangesOnly is true', function(assert) {
        // arrange
        const treeList = createTreeList({
            height: 120,
            loadingTimeout: null,
            repaintChangesOnly: true,
            dataSource: [
                { id: 1, name: 'node_1' },
                { id: 2, name: 'node_1_1', parentId: 1 },
                { id: 3, name: 'node_1_2', parentId: 1 }
            ]
        });

        // act
        treeList.expandRow(1);

        // assert
        assert.strictEqual(treeList.getVisibleRows()[0].isExpanded, true, 'first row has corrent isExpanded state');
        assert.strictEqual($(treeList.getRowElement(0)).find('.dx-treelist-expanded').length, 1, 'first row has expanded icon');
    });

    // T742885
    QUnit.test('Expand node after filtering when it has many children and they are selected', function(assert) {
        // arrange
        const clock = sinon.useFakeTimers();

        try {
            const treeList = createTreeList({
                loadingTimeout: 30,
                height: 200,
                dataSource: {
                    store: {
                        type: 'array',
                        data: [{
                            field1: 'test1',
                            items: [{
                                field1: 'test2'
                            }, {
                                field1: 'test2'
                            }, {
                                field1: 'test2'
                            }, {
                                field1: 'test2'
                            }, {
                                field1: 'test2'
                            }, {
                                field1: 'test2'
                            }, {
                                field1: 'test2'
                            }, {
                                field1: 'test2'
                            }]
                        }]
                    },
                    pageSize: 2
                },
                scrolling: {
                    mode: 'virtual'
                },
                selection: {
                    mode: 'multiple'
                },
                itemsExpr: 'items',
                dataStructure: 'tree',
                columns: [{ dataField: 'field1', dataType: 'string', filterValues: ['test2'] }],
                onContentReady: function(e) {
                    e.component.selectRows([2, 3, 4, 5, 6, 7, 8, 9]);
                }
            });

            clock.tick(500);

            // act
            treeList.collapseRow(1);
            clock.tick(100);

            // assert
            const items = treeList.getVisibleRows();
            assert.strictEqual(items.length, 1, 'row count');
            assert.notOk(treeList.isRowExpanded(1), 'first node is collapsed');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('The aria-expanded attribute should be changed on row expand when repaintChangesOnly is enabled (T993557)', function(assert) {
        // arrange
        const clock = sinon.useFakeTimers();

        try {
            const treeList = createTreeList({
                loadingTimeout: 0,
                dataSource: {
                    store: {
                        type: 'array',
                        key: 'id',
                        data: [
                            { id: 1, name: 'test1', parentId: -1 },
                            { id: 2, name: 'test2', parentId: 1 }
                        ]
                    }
                },
                rootValue: -1,
                repaintChangesOnly: true
            });

            clock.tick(10);
            let $rowElement = $(treeList.getRowElement(treeList.getRowIndexByKey(1)));

            // assert
            assert.strictEqual($rowElement.attr('aria-expanded'), 'false', 'row is collapsed by default');

            // act
            treeList.expandRow(1);
            clock.tick(10);
            $rowElement = $(treeList.getRowElement(treeList.getRowIndexByKey(1)));

            // assert
            assert.strictEqual($rowElement.attr('aria-expanded'), 'true', 'row is expanded after expandRow');

            // act
            treeList.collapseRow(1);
            clock.tick(10);
            $rowElement = $(treeList.getRowElement(treeList.getRowIndexByKey(1)));

            // assert
            assert.strictEqual($rowElement.attr('aria-expanded'), 'false', 'row is collapsed after collapseRow');
        } finally {
            clock.restore();
        }
    });
});

QUnit.module('Focused Row', defaultModuleConfig, () => {

    QUnit.test('TreeList with focusedRowEnabled and focusedRowIndex 0', function(assert) {
        // arrange, act
        const treeList = createTreeList({
            dataSource: generateData(5),
            focusedRowEnabled: true,
            focusedRowIndex: 0
        });

        this.clock.tick(10);

        // assert
        assert.ok($(treeList.getRowElement(0)).hasClass('dx-row-focused'), 'first row is focused');
    });

    QUnit.test('TreeList with focusedRowKey', function(assert) {
        // arrange, act
        const treeList = createTreeList({
            height: 105,
            keyExpr: 'id',
            dataSource: generateData(10),
            paging: {
                pageSize: 4
            },
            focusedRowEnabled: true,
            focusedRowKey: 12,
            scrolling: {
                prerenderedRowCount: 0
            }
        });

        this.clock.tick(10);

        // assert
        assert.equal(treeList.pageIndex(), 1, 'page is changed');
        assert.deepEqual(treeList.option('expandedRowKeys'), [11], 'focus parent is expanded');
        assert.ok($(treeList.getRowElement(treeList.getRowIndexByKey(12))).hasClass('dx-row-focused'), 'focused row is visible');
    });

    QUnit.test('TreeList with remoteOperations and focusedRowKey', function(assert) {
        // arrange, act
        const treeList = createTreeList({
            height: 105,
            keyExpr: 'id',
            dataSource: generateData(10),
            remoteOperations: true,
            paging: {
                pageSize: 4
            },
            focusedRowEnabled: true,
            focusedRowKey: 12,
            scrolling: {
                prerenderedRowCount: 0
            }
        });

        this.clock.tick(10);

        // assert
        assert.equal(treeList.pageIndex(), 1, 'page is changed');
        assert.deepEqual(treeList.option('expandedRowKeys'), [11], 'focus parent is expanded');
        assert.ok($(treeList.getRowElement(treeList.getRowIndexByKey(12))).hasClass('dx-row-focused'), 'focused row is visible');
    });

    QUnit.test('TreeList with remoteOperations(filtering, sorting, grouping) and focusedRowKey should not generate repeated node', function(assert) {
        // arrange, act
        const treeList = createTreeList({
            dataSource: [
                { 'Task_ID': 1, 'Task_Parent_ID': 0 },
                { 'Task_ID': 3, 'Task_Parent_ID': 1 },
                { 'Task_ID': 4, 'Task_Parent_ID': 2 },
                { 'Task_ID': 5, 'Task_Parent_ID': 3 }
            ],
            keyExpr: 'Task_ID',
            parentIdExpr: 'Task_Parent_ID',
            remoteOperations: {
                filtering: true,
                sorting: true,
                grouping: true
            },
            focusedRowEnabled: true,
            focusedRowKey: 5
        });

        this.clock.tick(10);

        // arrange
        const childrenNodes = treeList.getNodeByKey(1).children;

        // assert
        assert.equal(childrenNodes.length, 1, 'children nodes count');
        assert.equal(childrenNodes[0].key, 3, 'children node key');
    });

    QUnit.testInActiveWindow('TreeList should focus the corresponding group row if group collapsed and inner data row was focused', function(assert) {
        // arrange
        const treeList = createTreeList({
            keyExpr: 'id',
            dataSource: generateData(10),
            focusedRowEnabled: true,
            expandedRowKeys: [3],
            focusedRowKey: 4
        });

        this.clock.tick(10);

        // act
        treeList.collapseRow(3);

        this.clock.tick(10);

        // assert
        assert.equal(treeList.isRowExpanded(3), false, 'parent node collapsed');
        assert.equal(treeList.option('focusedRowKey'), 3, 'parent node focused');
    });

    QUnit.test('TreeList should focus only one focused row (T827201)', function(assert) {
        // arrange
        const rowsViewWrapper = treeListWrapper.rowsView;
        const treeList = createTreeList({
            keyExpr: 'id',
            dataSource: generateData(10),
            focusedRowEnabled: true,
            focusedRowKey: 3
        });

        this.clock.tick(10);

        // assert
        const rowIndex = treeList.getRowIndexByKey(3);
        assert.ok(rowsViewWrapper.getDataRow(rowIndex).isFocusedRow(), 'Row 3 is a focused row');

        // act
        $(treeList.getCellElement(4, 1)).trigger(CLICK_EVENT);
        this.clock.tick(10);

        // assert
        assert.notOk(rowsViewWrapper.getDataRow(rowIndex).isFocusedRow(), 'Row 3 is not a focused row');
        assert.ok(rowsViewWrapper.getDataRow(4).isFocusedRow(), 'Row 4 is a focused row');
    });

    QUnit.test('TreeList navigateTo', function(assert) {
        // arrange
        const treeList = createTreeList({
            height: 100,
            loadingTimeout: null,
            dataSource: generateData(10),
            paging: {
                pageSize: 4
            },
            scrolling: {
                useNative: false
            }
        });
        this.clock.tick(300);
        const callback = sinon.spy();

        // act
        const d = treeList.navigateToRow(12);
        d.done(callback);

        this.clock.tick(10);

        // assert
        assert.strictEqual(d.state(), 'resolved', 'promise is resolved');
        assert.strictEqual(callback.getCall(0).args[0], 6, 'promise value is correct');

        assert.deepEqual(treeList.option('expandedRowKeys'), [11], 'parent node is expanded');
        assert.equal(treeList.pageIndex(), 1, 'page is changed');
        assert.ok(treeList.getRowIndexByKey(12) >= 0, 'key is visible');
    });

    QUnit.test('TreeList navigateTo to the same page with expand', function(assert) {
        // arrange
        const treeList = createTreeList({
            loadingTimeout: null,
            dataSource: generateData(10),
            paging: {
                pageSize: 4
            }
        });
        const callback = sinon.spy();

        // act
        this.clock.tick(10);

        const d = treeList.navigateToRow(2);
        d.done(callback);

        this.clock.tick(10);

        // assert
        assert.strictEqual(d.state(), 'resolved', 'promise is resolved');
        assert.strictEqual(callback.getCall(0).args[0], 1, 'promise value is correct');

        assert.deepEqual(treeList.option('expandedRowKeys'), [1], 'parent node is expanded');
        assert.equal(treeList.pageIndex(), 0, 'page is not changed');
        assert.ok(treeList.getRowIndexByKey(2) >= 0, 'key is visible');
    });

    // T969796
    QUnit.test('TreeList navigateTo to the collapsed child row when scrolling is standard', function(assert) {
        // arrange
        const treeList = createTreeList({
            loadingTimeout: null,
            height: 100,
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, {
                id: 5,
                parent_id: 4
            }],
            scrolling: {
                mode: 'standard',
            },
            paging: {
                enabled: true
            },
            keyExpr: 'id',
            parentIdExpr: 'parent_id',
            columns: ['id']
        });
        const callback = sinon.spy();

        const d = treeList.navigateToRow(5);
        d.done(callback);

        $(treeList.getScrollable().container()).trigger('scroll');
        this.clock.tick(10);

        // assert
        assert.strictEqual(d.state(), 'resolved', 'promise is resolved');
        assert.strictEqual(callback.getCall(0).args[0], 4, 'promise value is correct');

        assert.deepEqual(treeList.option('expandedRowKeys'), [4], 'parent node is expanded');
        assert.ok(treeList.getRowIndexByKey(5) >= 0, 'key is visible');
    });

    // T697860
    QUnit.test('dataSource change with columns should force one loading only', function(assert) {
        const loadingSpy = sinon.spy();

        const options = {
            dataSource: new DataSource({
                load: function() {
                    const d = $.Deferred();

                    setTimeout(function() {
                        d.resolve([{ id: 1 }, { id: 2 }, { id: 3 }]);
                    });

                    return d;
                }
            }),
            paging: {
                pageSize: 2
            },
            columns: ['id']
        };

        const treeList = createTreeList(options);

        this.clock.tick(10);

        options.dataSource.store().on('loading', loadingSpy);

        // act
        treeList.option(options);
        this.clock.tick(10);

        // assert
        assert.equal(loadingSpy.callCount, 1, 'loading called once');
        assert.equal(treeList.getVisibleRows().length, 3, 'visible row count');
    });

    QUnit.test('Should not generate exception when selection mode is multiple and focusedRowKey is set for the nested node (T735585)', function(assert) {
        const options = {
            dataSource: [
                { id: 0, parentId: -1, c0: 'C0_0', c1: 'c1_0' },
                { id: 1, parentId: 0, c0: 'C0_0', c1: 'c1_0' }
            ],
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            selection: { mode: 'single' },
            focusedRowEnabled: true,
            focusedRowKey: 1,
            expandedRowKeys: [1],
            onFocusedRowChanged: e => {
                if(e.row && e.row.data) {
                    e.component.selectRows([e.row.key], true);
                }
            }
        };

        try {
            // act
            createTreeList(options);
            this.clock.tick(10);

            // arrange
            options.selection.mode = 'multiple';

            // act
            createTreeList(options);
            this.clock.tick(10);
        } catch(e) {
            // assert
            assert.ok(false, e.message);
        }

        // assert
        assert.ok(true, 'No exceptions');
    });

    ['virtual', 'standard'].forEach((scrollingMode) => {
        // T993300
        QUnit.test(`The focused row should not be changed after filtering when scrolling.mode = ${scrollingMode}`, function(assert) {
            // arrange
            const treeList = createTreeList({
                height: 100,
                keyExpr: 'id',
                dataSource: generateData(6),
                paging: {
                    enabled: scrollingMode === 'standard',
                    pageSize: 4
                },
                scrolling: {
                    mode: scrollingMode,
                    prerenderedRowCount: 0,
                    useNative: true
                },
                focusedRowEnabled: true,
                focusedRowKey: 12,
                columns: ['id']
            });

            this.clock.tick(300);

            // act
            treeList.searchByText('3');
            this.clock.tick(300);

            // assert
            const visibleRows = treeList.getVisibleRows();
            assert.strictEqual(visibleRows.length, 1, 'count node');
            assert.strictEqual(visibleRows[0].key, 3, 'key node');
            assert.strictEqual(treeList.option('focusedRowKey'), 12, 'focused row key');

            // act
            treeList.searchByText('');
            this.clock.tick(300);
            $(treeList.getScrollable().content()).trigger('scroll');

            // assert
            assert.strictEqual(treeList.pageIndex(), 1, 'page is changed');
            assert.deepEqual(treeList.option('expandedRowKeys'), [11], 'focus parent is expanded');
            assert.ok($(treeList.getRowElement(treeList.getRowIndexByKey(12))).hasClass('dx-row-focused'), 'focused row is visible');
        });

        // T996500
        QUnit.test(`The focused row should be restored after cleaning the filter when scrolling.mode = ${scrollingMode}`, function(assert) {
            // arrange
            const treeList = createTreeList({
                height: 100,
                keyExpr: 'id',
                dataSource: generateData(10),
                paging: {
                    enabled: scrollingMode === 'standard',
                    pageSize: 5
                },
                scrolling: {
                    mode: scrollingMode
                },
                focusedRowEnabled: true,
                focusedRowKey: 2,
                columns: ['id']
            });

            this.clock.tick(200);

            // assert
            assert.strictEqual(treeList.option('focusedRowKey'), 2, 'focused row key');
            assert.strictEqual(treeList.option('focusedRowIndex'), 1, 'focused row index');

            // act
            treeList.searchByText(3);
            this.clock.tick(200);

            // assert
            const visibleRows = treeList.getVisibleRows();
            assert.strictEqual(visibleRows.length, 1, 'count node');
            assert.strictEqual(visibleRows[0].key, 3, 'key node');
            assert.strictEqual(treeList.option('focusedRowKey'), 2, 'focused row key');
            assert.strictEqual(treeList.option('focusedRowIndex'), 1, 'focused row index');

            // act
            treeList.searchByText('');
            this.clock.tick(200);

            // assert
            assert.strictEqual(treeList.pageIndex(), 0, 'page is changed');
            assert.deepEqual(treeList.option('expandedRowKeys'), [1], 'focus parent is expanded');
            assert.strictEqual(treeList.option('focusedRowKey'), 2, 'focused row key');
            assert.strictEqual(treeList.option('focusedRowIndex'), 1, 'focused row index');
            assert.ok($(treeList.getRowElement(treeList.getRowIndexByKey(2))).hasClass('dx-row-focused'), 'focused row is visible');
        });
    });

    QUnit.test('Editor should be focused after adding row if some cell was focused (T1023022)', function(assert) {
        // arrange
        const treeList = createTreeList({
            height: 100,
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            dataSource: [{ id: 1, parentId: 0 }],
            loadingTimeout: null,
            editing: {
                mode: 'cell',
                allowAdding: true,
            },
            columns: ['id'],
        });

        // act
        treeList.focus(treeList.getCellElement(0, 0));
        treeList.addRow(1);
        this.clock.tick(10);

        // assert
        const $firstCellInAddedRow = $(treeList.getCellElement(1, 0));
        assert.ok($firstCellInAddedRow.hasClass('dx-editor-cell'), 'editor is rendered');
        assert.ok($firstCellInAddedRow.hasClass('dx-focused'), 'editor is focused');
    });

    [true, false].forEach(withColumns => {
        QUnit.testInActiveWindow(`Row should be focused correctly when dataSource and focusedRowKey are changed simultaneously ${withColumns ? 'with columns' : 'without columns'} (T1062545)`, function(assert) {
            // arrange
            const focusedRowIndices = [];
            const config = {
                dataSource: [
                    {
                        id: 1,
                        name: 'name 1',
                        hasChildren: true,
                        children: []
                    },
                    {
                        id: 3,
                        name: 'name 3',
                        hasChildren: false,
                        children: []
                    }
                ],
                keyExpr: 'id',
                dataStructure: 'tree',
                rootValue: null,
                itemsExpr: 'children',
                focusedRowEnabled: true,
                repaintChangesOnly: true,
                hasItemsExpr: 'hasChildren',
                focusedRowKey: 1,
                onFocusedRowChanged: function(e) {
                    focusedRowIndices.push(e.rowIndex);
                }
            };
            if(withColumns) {
                config.columns = [
                    {
                        dataField: 'name'
                    }
                ];
            }
            const treeList = createTreeList(config);
            this.clock.tick(300);

            // assert
            assert.deepEqual(focusedRowIndices, [0], 'initial focused row indices');

            // act
            treeList.expandRow(1);
            this.clock.tick(300);

            // assert
            assert.equal($(treeList.element()).find('.dx-treelist-expanded').length, 1, 'one expanded row');

            // act
            treeList.option('dataSource', [
                {
                    id: 1,
                    name: 'name 1',
                    hasChildren: true,
                    children: [
                        {

                            id: 2,
                            name: 'name 2',
                            hasChildren: false,
                            children: []
                        }
                    ]
                },
                {
                    id: 3,
                    name: 'name 3',
                    hasChildren: false,
                    children: []
                }

            ]);
            treeList.option('focusedRowKey', 2);
            this.clock.tick(300);
            const $focusedRowElement = $(treeList.element()).find('.dx-row-focused');

            // assert
            assert.deepEqual(focusedRowIndices, [0, 1], 'focused row indices');
            assert.equal($focusedRowElement.length, 1, 'one row is marked as focused');
            assert.strictEqual($focusedRowElement.attr('aria-rowindex'), '2', 'aria-rowindex');
        });
    });
});

QUnit.module('Scroll', defaultModuleConfig, () => {

    // T757537
    QUnit.test('TreeList should not hang when scrolling', function(assert) {
        // arrange
        const treeList = createTreeList({
            dataSource: [
                { id: 1, parentId: 0 },
                { id: 2, parentId: 0 },
                { id: 3, parentId: 0 },
                { id: 4, parentId: 0 },
                { id: 5, parentId: 0 },
                { id: 6, parentId: 0 },
                { id: 7, parentId: 0 },
                { id: 8, parentId: 0 },
                { id: 9, parentId: 0 },
                { id: 10, parentId: 0 },
                { id: 11, parentId: 0 },
                { id: 12, parentId: 0 },
                { id: 13, parentId: 0 },
                { id: 14, parentId: 0 },
                { id: 15, parentId: 0 }
            ],
            paging: {
                pageSize: 5
            },
            height: 200,
            columnAutoWidth: true,
            scrolling: {
                useNative: false
            }
        });
        const done = assert.async();

        this.clock.tick(100);
        this.clock.restore();
        const scrollable = treeList.getScrollable();

        // act
        scrollable.scrollTo({ y: 200 });
        scrollable.scrollTo({ y: 500 });

        setTimeout(function() {
            // assert
            assert.ok(treeList.pageIndex() > 0, 'page index');
            done();
        }, 1000);
    });

    // T806141
    QUnit.test('TreeList should correctly load data when filtering is remote and sorting is applied', function(assert) {
        // arrange
        const loadSpy = sinon.spy();
        const data = [{ id: 0, parentId: '', hasItems: true }, { id: 1, parentId: 0, hasItems: false }];
        const treeList = createTreeList({
            dataSource: {
                load: function(options) {
                    loadSpy(options);
                    if(options.filter && options.filter[2] !== '') {
                        return $.Deferred().resolve([data[1]]);
                    }
                    return $.Deferred().resolve([data[0]]);
                }
            },
            remoteOperations: {
                filtering: true
            },
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            hasItemsExpr: 'hasItems',
            rootValue: '',
            showBorders: true,
            columns: [
                { dataField: 'id', sortOrder: 'asc' }
            ]
        });

        this.clock.tick(100);

        // act
        $('#treeList').find('.dx-treelist-collapsed').trigger('dxclick');
        this.clock.tick(100);
        this.clock.restore();

        // assert
        assert.equal(loadSpy.callCount, 2, 'load call count');

        assert.deepEqual(loadSpy.args[0][0].filter, ['parentId', '=', ''], 'first load arguments');
        assert.deepEqual(loadSpy.args[1][0].filter, ['parentId', '=', 0], 'second load arguments');

        assert.equal($(treeList.getCellElement(0, 0)).text(), '0', 'first row first cell');
        assert.equal($(treeList.getCellElement(1, 0)).text(), '1', 'second row first cell');

        loadSpy.resetHistory();
    });

    // T991320
    QUnit.test('TreeList should load data once on expand after scrolling', function(assert) {
        // arrange
        const loadSpy = sinon.spy();
        const treeList = createTreeList({
            height: 100,
            dataSource: {
                load: function(options) {
                    loadSpy(options);
                    const d = $.Deferred();
                    setTimeout(() => {
                        const items = [];

                        if(options.filter[2] === 2) {
                            items.push({ id: 201, parentId: 2 });

                        } else if(options.filter[2] === -1) {
                            for(let i = 1; i <= 6; i++) {
                                items.push({ id: i, parentId: -1 });
                            }
                        }

                        d.resolve(items);

                    });
                    return d;

                }
            },
            remoteOperations: {
                filtering: true
            },
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            rootValue: -1,
            columns: [
                { dataField: 'id' }
            ],
            paging: {
                pageSize: 5
            },
            scrolling: {
                useNative: false
            }
        });

        this.clock.tick(100);

        // act
        treeList.getScrollable().scrollTo({ y: 10 });
        this.clock.tick(100);

        treeList.expandRow(2);
        this.clock.tick(100);

        // assert
        assert.equal(loadSpy.callCount, 2, 'load call count');

        assert.deepEqual(loadSpy.args[0][0].filter, ['parentId', '=', -1], 'first load arguments');
        assert.deepEqual(loadSpy.args[1][0].filter, ['parentId', '=', 2], 'second load arguments');
    });

    // T806547
    QUnit.test('TreeList should correctly switch dx-row-alt class for fixed column after expand if repaintChangesOnly = true', function(assert) {
        // arrange
        const treeList = createTreeList({
            rowAlternationEnabled: true,
            autoExpandAll: false,
            repaintChangesOnly: true,
            columns: [{
                dataField: 'id',
                fixed: true
            }, 'field'],
            columnFixing: {
                legacyMode: true
            },
            dataSource: [{
                id: 1,
                parentId: 0,
                field: 'data'
            }, {
                id: 2,
                parentId: 1,
                field: 'data'
            }, {
                id: 3,
                parentId: 0,
                field: 'data'
            }]
        });

        this.clock.tick(100);

        // act
        treeList.expandRow(1);
        this.clock.tick(10);
        const $row = $(treeList.getRowElement(2));

        // assert
        assert.notOk($row.eq(0).hasClass('dx-row-alt'), 'unfixed table row element');
        assert.notOk($row.eq(1).hasClass('dx-row-alt'), 'fixed table row element');
    });

    QUnit.test('TreeList should reshape data after update dataSource if reshapeOnPush set true (T815367)', function(assert) {
        // arrange
        const treeList = createTreeList({
            dataSource: {
                store: [{
                    ID: 1,
                    Head_ID: 0,
                    Name: 'John'
                }],
                reshapeOnPush: true
            },
            keyExpr: 'ID',
            parentIdExpr: 'Head_ID',
            columns: ['Name'],
            expandedRowKeys: [1]
        });
        this.clock.tick(10);

        // act
        treeList.getDataSource().store().push([{
            type: 'insert',
            data: { ID: 2, Head_ID: 1, Name: 'Alex' }
        }]);
        this.clock.tick(10);

        // arrange
        const $row = $(treeList.getRowElement(1));

        // assert
        assert.ok($row && $row.text() === 'Alex', 'pushed item displays');
    });

    QUnit.test('TreeList should not reshape data after expand row (T815367)', function(assert) {
        // arrange
        const onNodesInitializedSpy = sinon.spy();
        const treeList = createTreeList({
            dataSource: {
                store: [
                    { ID: 1, Head_ID: 0, Name: 'John' },
                    { ID: 2, Head_ID: 1, Name: 'Alex' }
                ],
                reshapeOnPush: true
            },
            keyExpr: 'ID',
            parentIdExpr: 'Head_ID',
            columns: ['Name'],
            expandedRowKeys: [],
            onNodesInitialized: onNodesInitializedSpy
        });
        this.clock.tick(10);

        // act
        treeList.expandRow(1);
        this.clock.tick(10);

        // assert
        assert.equal(onNodesInitializedSpy.callCount, 1, 'data did not reshape');
    });

    QUnit.test('TreeList should not occur an exception on an attempt to remove the non-existing key from the store (T827142)', function(assert) {
        // arrange
        const store = new ArrayStore({
            data: [
                { id: 1, parentId: 0, age: 19 },
                { id: 2, parentId: 1, age: 16 }
            ],
            key: 'id',
            reshapeOnPush: true
        });

        createTreeList({
            dataSource: {
                store: store
            },
            keyExpr: 'id',
            parentIdExpr: 'parentId',
        });
        this.clock.tick(10);

        // act
        store.push([{ type: 'remove', key: 100 }]);
        this.clock.tick(10);

        // assert
        assert.ok(true, 'exception does not occur');
    });

    QUnit.test('TreeList should filter data with unreachable items (T816921)', function(assert) {
        // arrange
        const treeList = createTreeList({
            dataSource: [
                { ID: 1, Head_ID: 0, Name: 'John' },
                { ID: 2, Head_ID: 1, Name: 'Alex' },
                { ID: 3, Head_ID: 100, Name: 'Alex' }
            ],
            keyExpr: 'ID',
            parentIdExpr: 'Head_ID',
            loadingTimeout: null,
            searchPanel: {
                visible: true,

                // act
                text: 'Alex'
            }
        });

        // assert
        assert.equal(treeList.getVisibleRows().length, 2, 'filtered row count');
    });
});

QUnit.module('Virtual scrolling', defaultModuleConfig, () => {
    QUnit.test('New mode. Expand/collapse button should be updated on click', function(assert) {
        // arrange
        const treeList = createTreeList({
            dataSource: [
                { ID: 1, Head_ID: 0, Name: 'John' },
                { ID: 2, Head_ID: 1, Name: 'Alex' },
                { ID: 3, Head_ID: 100, Name: 'Alex' }
            ],
            keyExpr: 'ID',
            parentIdExpr: 'Head_ID',
            loadingTimeout: undefined,
            scrolling: {
                mode: 'virtual',
                legacyMode: false
            },
        });

        // act
        $(treeList.getCellElement(0, 0)).find('.dx-treelist-collapsed').trigger('dxclick');

        // assert
        assert.strictEqual($(treeList.getCellElement(0, 0)).find('.dx-treelist-expanded').length, 1, 'row expanded');

        // act
        $(treeList.getCellElement(0, 0)).find('.dx-treelist-expanded').trigger('dxclick');

        // assert
        assert.strictEqual($(treeList.getCellElement(0, 0)).find('.dx-treelist-collapsed').length, 1, 'row collapsed');
    });
});


QUnit.module('Row dragging', defaultModuleConfig, () => {

    // T831020
    QUnit.test('The draggable row should have correct markup when defaultOptions is specified', function(assert) {
        // arrange
        TreeList.defaultOptions({
            options: {
                filterRow: {
                    visible: true
                },
                groupPanel: {
                    visible: true
                },
                filterPanel: {
                    visible: true
                }
            }
        });

        try {
            const treeList = createTreeList({
                dataSource: [
                    { ID: 1, Head_ID: 0, Name: 'John' },
                    { ID: 2, Head_ID: 0, Name: 'Alex' }
                ],
                keyExpr: 'ID',
                parentIdExpr: 'Head_ID',
                rowDragging: {
                    allowReordering: true
                }
            });

            this.clock.tick(10);

            // act
            pointerMock(treeList.getCellElement(0, 0)).start().down().move(100, 100);

            // assert
            const $draggableRow = $('body').children('.dx-sortable-dragging');
            assert.strictEqual($draggableRow.length, 1, 'has draggable row');

            const $visibleView = $draggableRow.find('.dx-gridbase-container').children(':visible');
            assert.strictEqual($visibleView.length, 1, 'markup of the draggable row is correct');
            assert.ok($visibleView.hasClass('dx-treelist-rowsview'), 'rowsview is visible');
        } finally {
            TreeList.defaultOptions({
                options: {
                    filterRow: {
                        visible: false
                    },
                    groupPanel: {
                        visible: false
                    },
                    filterPanel: {
                        visible: false
                    }
                }
            });
        }
    });
});

QUnit.module('Selection', defaultModuleConfig, () => {

    // T861403
    [true, false].forEach(recursive => {
        QUnit.test(`Select and deselect all rows if filter is applied, filterMode is matchOnly and recursive=${recursive}`, function(assert) {
            // arrange
            const selectedRowKeys = recursive ? [1, 2] : [2];
            const treeList = createTreeList({
                dataSource: [{
                    id: 1,
                    parent_id: 0,
                    data: 'some'
                }, {
                    id: 2,
                    parent_id: 1,
                    data: 'some2'
                }],
                columns: ['id', 'data'],
                filterValue: ['data', '=', 'some2'],
                keyExpr: 'id',
                parentIdExpr: 'parent_id',
                filterMode: 'matchOnly',
                selection: {
                    recursive,
                    mode: 'multiple'
                }
            });

            this.clock.tick(10);

            // act
            const $selectCheckBoxes = $('.dx-select-checkbox');
            $selectCheckBoxes.eq(0).trigger('dxclick');

            // assert
            assert.equal($selectCheckBoxes.eq(0).attr('aria-checked'), 'true', 'selectAll checkbox is checked');
            assert.equal($selectCheckBoxes.eq(1).attr('aria-checked'), 'true', 'first row\'s checkbox is checked');
            assert.deepEqual(treeList.getSelectedRowKeys(), selectedRowKeys, 'selected row keys');
            assert.deepEqual(treeList.option('selectedRowKeys'), selectedRowKeys, 'selected row keys');

            // act
            $selectCheckBoxes.eq(0).trigger('dxclick');

            // assert
            assert.equal($selectCheckBoxes.eq(0).attr('aria-checked'), 'false', 'selectAll checkbox is not checked');
            assert.equal($selectCheckBoxes.eq(1).attr('aria-checked'), 'false', 'first row\'s checkbox is not checked');
            assert.deepEqual(treeList.getSelectedRowKeys(), [], 'selected row keys');
            assert.deepEqual(treeList.option('selectedRowKeys'), [], 'selected row keys');
        });
    });

    QUnit.test('Rows should be selected correctly with Shift', function(assert) {
        // arrange
        const items = [{
            id: 1,
            parentId: 0,
            name: 'Name 1'
        }, {
            id: 2,
            parentId: 1,
            name: 'Name 2'
        }, {
            id: 3,
            parentId: 1,
            name: 'Name 3'
        }, {
            id: 4,
            parentId: 1,
            name: 'Name 4'
        }, {
            id: 5,
            parentId: 4,
            name: 'Name 5'
        }];

        const treeList = createTreeList({
            dataSource: items,
            selection: {
                mode: 'multiple'
            },
            columns: ['name'],
            autoExpandAll: true
        });

        this.clock.tick(300);

        // act
        $(treeList.element()).find('.dx-treelist-rowsview .dx-checkbox:eq(1)').trigger('dxclick');

        // assert
        assert.deepEqual(treeList.getSelectedRowKeys(), [2], 'selected key');

        // act
        const pointer = pointerMock($(treeList.element()).find('.dx-treelist-rowsview .dx-checkbox:eq(4)'));
        pointer.start({ shiftKey: true }).down().up();
        this.clock.tick(300);

        // assert
        assert.deepEqual(treeList.getSelectedRowKeys(), [2, 5, 4, 3], 'selected keys with Shift');
    });

    QUnit.test('Rows should be selected correctly with Shift when recursive selection is enabled (T1072845)', function(assert) {
        // arrange
        const items = [{
            ID: 1,
            Parent_ID: 0,
            Name: 'Test1'
        }, {
            ID: 2,
            Parent_ID: 1,
            Name: 'Test2'
        }, {
            ID: 3,
            Parent_ID: 2,
            Name: 'Test3'
        }, {
            ID: 4,
            Parent_ID: 3,
            Name: 'Test4'
        }, {
            ID: 5,
            Parent_ID: 3,
            Name: 'Test5'
        }, {
            ID: 6,
            Parent_ID: 3,
            Name: 'Test6'
        }, {
            ID: 7,
            Parent_ID: 3,
            Name: 'Test7'
        }, {
            ID: 8,
            Parent_ID: 1,
            Name: 'Test8'
        }, {
            ID: 9,
            Parent_ID: 1,
            Name: 'Test9'
        }];

        const treeList = createTreeList({
            dataSource: items,
            keyExpr: 'ID',
            parentIdExpr: 'Parent_ID',
            showRowLines: true,
            showBorders: true,
            columnAutoWidth: true,
            selection: {
                mode: 'multiple',
                recursive: true,
            },
            columns: ['Name'],
            height: 400,
            expandedRowKeys: [1, 2, 3]
        });

        const getSelectedRowIndices = () => {
            const selectedIndices = [];
            $(treeList.element()).find('.dx-data-row.dx-selection').each((_, element) => selectedIndices.push($(element).index()));
            return selectedIndices;
        };

        this.clock.tick(300);

        // act
        $(treeList.element()).find('.dx-treelist-rowsview .dx-checkbox:eq(3)').trigger('dxclick');

        // assert
        assert.deepEqual(treeList.getSelectedRowKeys(), [4], 'selected key');
        assert.deepEqual(getSelectedRowIndices(), [3], 'selected index');

        // act
        let pointer = pointerMock($(treeList.element()).find('.dx-treelist-rowsview .dx-checkbox:eq(6)'));
        pointer.start({ shiftKey: true }).down().up();
        this.clock.tick(300);

        // assert
        assert.deepEqual(treeList.getSelectedRowKeys(), [4, 7, 6, 5], 'selected keys with Shift');
        assert.deepEqual(getSelectedRowIndices(), [1, 2, 3, 4, 5, 6], 'selected indices with Shift');

        // act
        $(treeList.element()).find('.dx-treelist-rowsview .dx-checkbox:eq(2)').trigger('dxclick');

        // assert
        assert.equal(treeList.getSelectedRowKeys().length, 0, 'no selected keys');
        assert.equal(getSelectedRowIndices().length, 0, 'no selected indices');

        // act
        $(treeList.element()).find('.dx-treelist-rowsview .dx-checkbox:eq(1)').trigger('dxclick');

        // assert
        assert.deepEqual(treeList.getSelectedRowKeys(), [2], 'selected key after the second row click');
        assert.deepEqual(getSelectedRowIndices(), [1, 2, 3, 4, 5, 6], 'selected indices after the second row click');

        // act
        pointer = pointerMock($(treeList.element()).find('.dx-treelist-rowsview .dx-checkbox:eq(8)'));
        pointer.start({ shiftKey: true }).down().up();
        this.clock.tick(300);

        assert.deepEqual(treeList.getSelectedRowKeys(), [2, 9, 8, 7, 6, 5, 4, 3], 'selected keys after the last row click with Shift');
        assert.deepEqual(getSelectedRowIndices(), [0, 1, 2, 3, 4, 5, 6, 7, 8], 'selected indices after the last row click with Shift');
    });
});

