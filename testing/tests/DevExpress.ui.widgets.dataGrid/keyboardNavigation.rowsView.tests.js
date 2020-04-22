QUnit.testStart(function() {
    const markup = `
        <div>
            <div id="container" class="dx-datagrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(markup);
});

import 'common.css!';
import 'generic_light.css!';

import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import pointerEvents from 'events/pointer';
import eventUtils from 'events/utils';
import eventsEngine from 'events/core/events_engine';
import { setupDataGridModules, MockDataController, MockColumnsController, MockSelectionController } from '../../helpers/dataGridMocks.js';

const CLICK_EVENT = eventUtils.addNamespace('dxpointerdown', 'dxDataGridKeyboardNavigation');

function setupModules(that, modulesOptions, gridModules) {
    const defaultSetCellValue = function(data, value) {
        if(this.serializeValue) {
            value = this.serializeValue(value);
        }
        data[this.dataField] = value;
    };

    that.columns = that.columns || [
        { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1', calculateCellValue: function(data) { return data.Column1; }, setCellValue: defaultSetCellValue },
        { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2', setCellValue: defaultSetCellValue },
        { caption: 'Column 3', visible: true, allowEditing: true, dataField: 'Column3', setCellValue: defaultSetCellValue },
        { caption: 'Column 4', visible: true, allowEditing: true, dataField: 'Column4', setCellValue: defaultSetCellValue }
    ];

    that.options = $.extend(true, { tabIndex: 0 }, that.options, {
        useKeyboard: true,
        keyboardNavigation: {
            enterKeyAction: 'startEdit',
            enterKeyDirection: 'none',
            editOnKeyPress: false
        },
        editing: { },
        showColumnHeaders: true
    });

    that.$element = function() {
        return $('#container');
    };
    that.selectionOptions = {};
    that.dataControllerOptions = that.dataControllerOptions || {
        store: {
            update: function() { return $.Deferred().resolve(); },
            key: $.noop
        },
        pageCount: 10,
        pageIndex: 0,
        pageSize: 6,
        items: [
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 0, data: {} },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 1 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'detail', key: 2 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 3 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 4 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 5 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'group', data: {}, key: 6 },
            { values: ['test1', 'test2', 'test3', 'test4'], summaryCells: [{}, {}, {}, {}], rowType: 'groupFooter', key: 7 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 8 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'data', key: 9 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'group', data: {}, key: 10 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'detail', key: 11 },
            { values: ['test1', 'test2', 'test3', 'test4'], rowType: 'group', data: { isContinuation: true }, key: 12 }
        ]
    };

    gridModules = (gridModules || []).concat([
        'data', 'columns', 'editorFactory',
        'gridView', 'columnHeaders', 'rows', 'grouping',
        'headerPanel', 'search', 'editing', 'keyboardNavigation',
        'summary', 'masterDetail', 'virtualScrolling'
    ]);

    setupDataGridModules(that, gridModules, modulesOptions || {
        initViews: true,
        controllers: {
            selection: new MockSelectionController(that.selectionOptions),
            columns: new MockColumnsController(that.columns),
            data: new MockDataController(that.dataControllerOptions)
        }
    });
}

QUnit.module('Rows view', {
    beforeEach: function() {
        this.items = [
            { data: { name: 'test1', id: 1, date: new Date(2001, 0, 1) }, values: ['test1', 1, '1/01/2001'], rowType: 'data', dataIndex: 0 },
            { data: { name: 'test2', id: 2, date: new Date(2002, 1, 2) }, values: ['test2', 2, '2/02/2002'], rowType: 'data', dataIndex: 1 },
            { data: { name: 'test3', id: 3, date: new Date(2003, 2, 3) }, values: ['test3', 3, '3/03/2003'], rowType: 'data', dataIndex: 2 }];

        this.createRowsView = function(rows, dataController, columns, initDefaultOptions) {

            dataController = dataController || new MockDataController({ items: rows });

            if(!typeUtils.isDefined(columns)) {
                columns = [];
                for(let i = 0; i < rows[0].values.length; i++) {
                    columns.push({});
                }
            }
            const columnsController = new MockColumnsController(columns);

            this.options = {
                disabled: false,
                useKeyboard: true,
                tabIndex: 0
            };
            this.selectionOptions = {};

            const mockDataGrid = {
                options: this.options,
                $element: function() {
                    return $('.dx-datagrid').parent();
                }
            };
            setupDataGridModules(mockDataGrid, ['data', 'columns', 'rows', 'editorFactory', 'editing', 'masterDetail', 'keyboardNavigation'], {
                initViews: true,
                controllers: {
                    columns: columnsController,
                    data: dataController,
                    selection: new MockSelectionController(this.selectionOptions)
                },
                initDefaultOptions: initDefaultOptions
            });

            this.dataGrid = mockDataGrid;
            return mockDataGrid.rowsView;
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        if(this.dispose) {
            this.dispose();
        }
        this.clock.restore();
    }
}, function() {
    // T222258
    QUnit.testInActiveWindow('Focused cell from free space row when view is rendered', function(assert) {
        // arrange
        const $container = $('#container');

        setupModules(this);
        this.gridView.render($container);
        this.keyboardNavigationController._focusedView = this.rowsView;
        this.keyboardNavigationController._isNeedFocus = true;

        const origUpdateFocus = this.keyboardNavigationController._updateFocus;
        this.keyboardNavigationController._updateFocus = function() {
            origUpdateFocus.apply(this, arguments);

            // assert
            assert.ok(true);
        };

        // act
        $($container.find('.dx-freespace-row').find('td').first()).trigger('dxpointerdown');
        this.rowsView.renderCompleted.fire();
    });

    QUnit.testInActiveWindow('Cell is not focused when view is rendered if key is not pressed', function(assert) {
        // arrange, act
        let isCellFocused = false;
        const $container = $('#container');

        setupModules(this);

        // act
        this.gridView.render($container);
        this.keyboardNavigationController._focusedView = this.rowsView;
        this.keyboardNavigationController._isNeedScroll = true;
        this.keyboardNavigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
        this.keyboardNavigationController._focus(this.gridView.element().find('td').eq(4));

        this.clock.tick();

        this.keyboardNavigationController._focusedCellPosition = { columnIndex: 0, rowIndex: 0 };
        this.keyboardNavigationController._focus = function() {
            isCellFocused = true;
        };
        this.rowsView.renderCompleted.fire();

        this.clock.tick();

        // assert
        assert.ok(!isCellFocused);
        assert.ok(!this.keyboardNavigationController._isNeedFocus);
    });

    QUnit.testInActiveWindow('Render rows view with keyboard navigation', function(assert) {
        // arrange
        const rowsView = this.createRowsView(this.items);
        const testElement = $('#container');

        // act
        rowsView.render(testElement);

        // assert
        assert.strictEqual(rowsView.element().attr('tabindex'), undefined, 'no tabindex on rowsView element');
        assert.strictEqual(rowsView.element().find('td[tabIndex]').length, 1, 'cells with tabIndex attr count');
    });

    // T391194, T380140
    QUnit.testInActiveWindow('Tab from focused element before rowsview must focus first cell', function(assert) {
        // arrange
        const rowsView = this.createRowsView(this.items);
        const testElement = $('.dx-datagrid');

        rowsView.render(testElement);
        this.clock.tick();

        // act
        const $focusable = testElement.find('[tabIndex]').first();
        $focusable.focus();
        this.clock.tick();

        // assert
        assert.ok($focusable.is('td'), 'focusable is cell');
        assert.strictEqual($focusable.text(), 'test1', 'focused cell text');
        assert.strictEqual($focusable.index(), 0, 'focused cell columnIndex');
        assert.strictEqual($focusable.parent().index(), 0, 'focused cell rowIndex');
        assert.ok($focusable.is(':focus'), 'focused cell is focused');
        assert.ok($focusable.hasClass('dx-focused'), 'focused cell has dx-focused class');
    });

    QUnit.testInActiveWindow('Skip invalid cell for moving to right', function(assert) {
        // arrange
        const rowsView = this.createRowsView(this.items, null, [{}, {}, {}, {}]);
        const navigationController = this.dataGrid.keyboardNavigationController;

        navigationController._isCellValid = function($cell) {
            const cell = $cell[0];
            return cell.cellIndex > 0 && cell.cellIndex < 2;
        };
        navigationController._focusedView = rowsView;
        navigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };
        rowsView.render($('#container'));

        // assert, act
        const $cell = navigationController._getNextCell.call(navigationController, 'nextInRow');
        assert.equal($cell[0].cellIndex, 3);
    });

    QUnit.testInActiveWindow('Skip invalid cell for moving to left', function(assert) {
        // arrange
        const rowsView = this.createRowsView(this.items, null, [{}, {}, {}, {}]);
        const navigationController = this.dataGrid.keyboardNavigationController;

        navigationController._isCellValid = function($cell) {
            const cell = $cell[0];
            return cell.cellIndex < 3 && cell.cellIndex !== 2 && cell.cellIndex !== 1 && cell.cellIndex >= 0;
        };
        navigationController._focusedView = rowsView;
        navigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 3 };
        rowsView.render($('#container'));

        // assert, act
        const $cell = navigationController._getNextCell.call(navigationController, 'previousInRow');
        assert.equal($cell[0].cellIndex, 0);
    });

    QUnit.test('Focused state is not applied when element is not cell', function(assert) {
        // arrange
        const rowsView = this.createRowsView(this.items, null, [{}, {}, {}, {}]);
        const $element = $('<div>');

        this.dataGrid.getController('keyboardNavigation')._isCellValid = function($cell) {
            return true;
        };

        rowsView.element = function() {
            return {
                attr: commonUtils.noop,
                is: commonUtils.noop
            };
        };
        rowsView.getCellElements = function() {
            return $element;
        };

        // act
        rowsView.renderFocusState();

        // assert
        assert.ok(!$element.attr('tabIndex'));
    });

    QUnit.test('Apply custom tabIndex to rows view on click', function(assert) {
        // arrange
        const rowsView = this.createRowsView(this.items);
        const testElement = $('#container');

        this.options.tabIndex = 5;

        // act
        rowsView.render(testElement);

        const $cell = $(rowsView.element().find('td').first());
        $cell.trigger(CLICK_EVENT);
        assert.equal(rowsView.element().attr('tabIndex'), undefined, 'tabIndex of rowsView');
        assert.equal($cell.attr('tabIndex'), 5, 'tabIndex of clicked cell');
    });

    QUnit.testInActiveWindow('Cell focus should not be disabled after "blur" in the current document (T858241)', function(assert) {
        // arrange
        const rowsView = this.createRowsView(this.items);
        const testElement = $('#container');

        rowsView.render(testElement);

        const $cell0 = $(rowsView.getCellElement(0, 1));
        const $cell1 = $(rowsView.getCellElement(1, 1));

        // act
        $cell0
            .focus()
            .trigger(pointerEvents.down)
            .trigger(pointerEvents.up)
            .trigger('dxclick');

        // assert
        assert.ok($cell0.hasClass('dx-cell-focus-disabled'), 'Cell has disabled focus class');
        assert.notOk($cell0.hasClass('dx-focused'), 'Cell has no .dx-focused');

        $cell1
            .focus()
            .trigger(pointerEvents.down)
            .trigger(pointerEvents.up)
            .trigger('dxclick');

        // assert
        assert.notOk($cell0.hasClass('dx-cell-focus-disabled'), 'Cell has no disabled focus class');
        assert.notOk($cell0.hasClass('dx-focused'), 'Cell has no .dx-focused');

        $cell0
            .focus()
            .trigger(pointerEvents.down)
            .trigger(pointerEvents.up)
            .trigger('dxclick');

        // assert
        assert.ok($cell0.hasClass('dx-cell-focus-disabled'), 'Cell has disabled focus class');
        assert.notOk($cell0.hasClass('dx-focused'), 'Cell has no .dx-focused');

        // act
        eventsEngine.trigger($cell0, eventUtils.createEvent('blur'));

        // assert
        assert.ok($cell0.hasClass('dx-cell-focus-disabled'), 'Cell has no disabled focus class');
        assert.notOk($cell0.hasClass('dx-focused'), 'Cell has no .dx-focused');
    });
});
