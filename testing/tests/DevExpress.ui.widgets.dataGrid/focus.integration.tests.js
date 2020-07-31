QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid">
            </div>
        </div>
    `;
    const markup = `
        <style>
            .fixed-height {
                height: 400px;
            }
            .qunit-fixture-auto-height {
                position: static !important;
                height: auto !important;
            }
            .dx-scrollable-native-ios .dx-scrollable-content {
                padding: 0 !important;
            }
        </style>

        <!--qunit-fixture-->

        ${gridMarkup}
    `;

    $('#qunit-fixture').html(markup);
});

import $ from 'jquery';
import typeUtils from 'core/utils/type';
import devices from 'core/devices';
import keyboardMock from '../../helpers/keyboardMock.js';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { CLICK_EVENT } from '../../helpers/grid/keyboardNavigationHelper.js';
import { createDataGrid } from '../../helpers/dataGridHelper.js';

const dataGridWrapper = new DataGridWrapper('#dataGrid');

if('chrome' in window && devices.real().deviceType !== 'desktop') {
    // Chrome DevTools device emulation
    // Erase differences in user agent stylesheet
    $('head').append($('<style>').text('input[type=date] { padding: 1px 0; }'));
}

QUnit.module('View\'s focus', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.dataGrid = createDataGrid({
            dataSource: [
                { value: 'value 1', text: 'Awesome' },
                { value: 'value 2', text: 'Best' },
                { value: 'value 3', text: 'Poor' }
            ]
        });

        this.clock.tick(500);
        this.keyboardNavigationController = this.dataGrid.getController('keyboardNavigation');

        this.focusGridCell = function($target) {
            this.dataGrid.focus($target);
            this.clock.tick();
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('try to focus unknown element', function(assert) {
    // arrange

        this.focusGridCell($('.lalala'));

        const $focusedCell = $(this.dataGrid.$element()).find('.dx-focused');

        // assert
        assert.ok(!$focusedCell.length, 'We do not have focused cell in markup');
        assert.ok(!typeUtils.isDefined(this.keyboardNavigationController._focusedView), 'There is no focused view');
    });

    QUnit.test('Focus row element', function(assert) {
    // arrange

        // act
        this.focusGridCell($(this.dataGrid.$element()).find('.dx-datagrid-rowsview td').eq(4));

        const $focusedCell = $(this.dataGrid.$element()).find('.dx-focused');

        // assert
        assert.ok($focusedCell.length, 'We have focused cell in markup');
        assert.equal(this.keyboardNavigationController._focusedView.name, 'rowsView', 'Check that correct view is focused');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
            columnIndex: 0,
            rowIndex: 2
        }, 'Check that correct cell is focused');
    });

    QUnit.testInActiveWindow('DataGrid - Master grid should not render it\'s overlay in detail grid (T818373)', function(assert) {
    // arrange
        let detailGrid;
        const detailRowsViewWrapper = dataGridWrapper.rowsView;

        this.dataGrid.option({
            dataSource: [{ id: 0, value: 'value 1', text: 'Awesome' }],
            keyExpr: 'id',
            masterDetail: {
                enabled: true,
                template: function(container) {
                    detailGrid = $('<div>')
                        .addClass('internal-grid')
                        .dxDataGrid({
                            dataSource: [{ field1: 'test1', field2: 'test2' }],
                            onFocusedCellChanging: e => e.isHighlighted = true
                        })
                        .appendTo(container).dxDataGrid('instance');
                }
            }
        });
        this.clock.tick();

        // act
        this.dataGrid.expandRow(0);
        this.clock.tick();
        $(detailGrid.getCellElement(0, 0)).focus();
        this.clock.tick();

        // assert
        const focusOverlay = detailRowsViewWrapper.getFocusOverlay();
        assert.equal(focusOverlay.getElement().length, 1, 'Detail grid has one focus overlay');
        assert.ok(focusOverlay.isVisible(), 'Detail grid focus overlay is visible');
    });

    QUnit.testInActiveWindow('Not highlight cell if isHighlighted set false in the onFocusedCellChanging event by Tab key (T853599)', function(assert) {
    // arrange
        let focusedCellChangingCount = 0;
        this.dataGrid.option({
            dataSource: [{ name: 'Alex', phone: '111111', room: 6 }],
            keyExpr: 'name',
            onFocusedCellChanging: function(e) {
                ++focusedCellChangingCount;
                e.isHighlighted = false;
            }
        });
        this.clock.tick();

        $(this.dataGrid.getCellElement(0, 0))
            .trigger(CLICK_EVENT);
        this.clock.tick();

        // assert
        assert.equal(this.dataGrid.option('focusedRowIndex'), 0, 'focusedRowIndex');
        assert.equal(this.dataGrid.option('focusedColumnIndex'), 0, 'focusedColumnIndex');

        // act
        const navigationController = this.dataGrid.getController('keyboardNavigation');
        navigationController._keyDownHandler({ key: 'Tab', keyName: 'tab', originalEvent: $.Event('keydown', { target: $(this.dataGrid.getCellElement(0, 0)) }) });
        this.clock.tick();

        // assert
        assert.equal(focusedCellChangingCount, 2, 'onFocusedCellChanging fires count');
        assert.notOk($(this.dataGrid.getCellElement(0, 1)).hasClass('dx-focused'), 'cell is not focused');
    });

    QUnit.test('Focus row element should support native DOM', function(assert) {
    // arrange

        // act
        this.focusGridCell($(this.dataGrid.$element()).find('.dx-datagrid-rowsview td').get(4));

        const $focusedCell = $(this.dataGrid.$element()).find('.dx-focused');

        // assert
        assert.ok($focusedCell.length, 'We have focused cell in markup');
        assert.equal(this.keyboardNavigationController._focusedView.name, 'rowsView', 'Check that correct view is focused');
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, {
            columnIndex: 0,
            rowIndex: 2
        }, 'Check that correct cell is focused');
    });

    // T592731
    QUnit.test('Pressing arrow keys inside editor of the internal grid does not call preventDefault', function(assert) {
    // arrange
        let preventDefaultCalled;
        const eventOptions = {
            preventDefault: function() {
                preventDefaultCalled = true;
            }
        };

        this.dataGrid.option({
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ id: 0, value: 'value 1', text: 'Awesome' }],
                    key: 'id'
                }
            },
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    $('<div>')
                        .addClass('internal-grid')
                        .dxDataGrid({
                            filterRow: {
                                visible: true
                            },
                            columns: [{ dataField: 'field1', filterValue: 'test' }, 'field2'],
                            dataSource: [{ field1: 'test1', field2: 'test2' }]
                        }).appendTo(container);
                }
            }
        });
        this.dataGrid.expandRow(0);
        this.clock.tick();
        const $dateBoxInput = $(this.dataGrid.$element()).find('.internal-grid .dx-datagrid-filter-row').find('.dx-texteditor-input').first();
        $dateBoxInput.focus();
        this.clock.tick();
        const keyboard = keyboardMock($dateBoxInput);

        // act
        keyboard.keyDown('left', eventOptions);
        keyboard.keyDown('right', eventOptions);
        keyboard.keyDown('up', eventOptions);
        keyboard.keyDown('down', eventOptions);

        // assert
        assert.notOk(preventDefaultCalled, 'preventDefault is not called');
    });

    QUnit.test('Pressing symbol keys inside detail grid editor does not change master grid\'s focusedCellPosition', function(assert) {
    // arrange

        this.dataGrid.option({
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ id: 0, value: 'value 1', text: 'Awesome' }],
                    key: 'id'
                }
            },
            masterDetail: {
                enabled: true,
                template: function(container, options) {
                    $('<div>')
                        .addClass('internal-grid')
                        .dxDataGrid({
                            filterRow: {
                                visible: true
                            },
                            columns: [{ dataField: 'field1', filterValue: 'test' }, 'field2'],
                            dataSource: [{ field1: 'test1', field2: 'test2' }]
                        }).appendTo(container);
                }
            }
        });
        this.dataGrid.expandRow(0);
        this.clock.tick();

        // act
        this.keyboardNavigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };
        const $dateBoxInput = $(this.dataGrid.$element()).find('.internal-grid .dx-datagrid-filter-row').find('.dx-texteditor-input').first();
        $dateBoxInput.focus();
        this.clock.tick();
        const keyboard = keyboardMock($dateBoxInput);

        // act
        keyboard.keyDown('1');
        this.clock.tick();

        // assert
        assert.deepEqual(this.keyboardNavigationController._focusedCellPosition, { rowIndex: 0, columnIndex: 1 }, 'Master grid focusedCellPosition is not changed');
    });

    QUnit.test('Should open master detail by click if row is edited in row mode (T845240)', function(assert) {
        ['click', 'dblClick'].forEach(startEditAction => {
        // arrange
            const masterDetailClass = 'master-detail-test';
            this.dataGrid.option({
                loadingTimeout: undefined,
                dataSource: [{ id: 1 }],
                editing: {
                    startEditAction: startEditAction
                },
                masterDetail: {
                    enabled: true,
                    template: function(container, options) {
                        $(`<div class="${masterDetailClass}">Test</div>`).appendTo(container);
                    }
                }
            });

            // assert
            assert.notOk($(this.dataGrid.$element()).find('.' + masterDetailClass).length, 'Master detail is not displayed');

            // act
            this.dataGrid.editRow(0);
            $(this.dataGrid.getCellElement(0, 0)).trigger('dxclick');

            // assert
            assert.ok($(this.dataGrid.$element()).find('.' + masterDetailClass).length, 'Master detail is displayed');
        });
    });

    QUnit.test('DataGrid should regenerate columns and apply filter after dataSource change if columns autogenerate', function(assert) {
    // arrange
        const dataSource0 = {
            store: [
                { id: 0, c0: 'c0_0' },
                { id: 1, c0: 'c0_1' }
            ]
        };
        const dataSource1 = {
            store: [
                { id: 0, c1: 'c1_0' },
                { id: 1, c1: 'c1_1' }
            ]
        };
        let dataSourceChanged = false;
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource0,
            customizeColumns: columns => {
                if(dataSourceChanged) {
                    columns[1].filterValue = 'c1_1';
                }
            }
        });

        // arrange, act
        dataSourceChanged = true;
        dataGrid.option('dataSource', dataSource1);
        const rows = dataGrid.getVisibleRows();
        // assert
        assert.equal(rows.length, 1, 'Row was filtered');
        assert.deepEqual(rows[0].data.id, 1, 'Second row');

        // act
        dataGrid.option('dataSource', dataSource1);
        // assert
        assert.equal(rows.length, 1, 'Row was filtered');
        assert.deepEqual(rows[0].data.id, 1, 'Second row');
    });

    // T671532
    QUnit.testInActiveWindow('Change options do not throw an exception when an element outside the grid is focused', function(assert) {
    // arange
        const $inputElement = $('<input type=\'button\' />').prependTo($('#container'));

        // act
        $inputElement.focus();
        this.dataGrid.option('columnAutoWidth', true);

        // assert
        assert.ok(true, 'no exceptions');
    });

    QUnit.test('onFocusedCellChanging\\onFocusedCellChanged\\onFocusedRowChanging\\onFocusedRowChanged events fire when a group row is clicked and keboardNavigation = true', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1', category: 1 },
                { id: 2, name: 'name2', category: 2 }
            ],
            keyExpr: 'id',
            columns: ['id', 'name', { dataField: 'category', groupIndex: 0 }],
            grouping: {
                autoExpandAll: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group', 'data'], 'rows are rendered');
        assert.deepEqual(dataGrid.option('focusedRowKey'), [2], 'focusedRowKey is set');
        assert.equal(dataGrid.option('focusedRowIndex'), 1, 'focusedRowIndex is set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.ok(onFocusedRowChanging.called, 'onFocusedRowChanging is called');
        assert.ok(onFocusedCellChanged.called, 'onFocusedCellChanged is called');
        assert.ok(onFocusedRowChanged.called, 'onFocusedRowChanged is called');
    });

    QUnit.test('onFocusedCellChanging\\onFocusedCellChanged\\onFocusedRowChanging\\onFocusedRowChanged events fire when a master row is clicked and keboardNavigation = true', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' },
                { id: 2, name: 'name2' }
            ],
            keyExpr: 'id',
            columns: ['id', 'name'],
            masterDetail: {
                enabled: true
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data'], 'data rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data', 'detail'], 'rows are rendered');
        assert.equal(dataGrid.option('focusedRowKey'), 2, 'focusedRowKey is set');
        assert.equal(dataGrid.option('focusedRowIndex'), 1, 'focusedRowIndex is set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.ok(onFocusedRowChanging.called, 'onFocusedRowChanging is called');
        assert.ok(onFocusedCellChanged.called, 'onFocusedCellChanged is called');
        assert.ok(onFocusedRowChanged.called, 'onFocusedRowChanged is called');
    });

    QUnit.test('onFocusedCellChanging\\onFocusedCellChanged\\onFocusedRowChanging\\onFocusedRowChanged events do not fire when a group row is clicked and keboardNavigation = false', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1', category: 1 },
                { id: 2, name: 'name2', category: 2 }
            ],
            keyExpr: 'id',
            columns: ['id', 'name', { dataField: 'category', groupIndex: 0 }],
            grouping: {
                autoExpandAll: false
            },
            keyboardNavigation: {
                enabled: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group', 'data'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.notOk(onFocusedCellChanging.called, 'onFocusedCellChanging is not called');
        assert.notOk(onFocusedRowChanging.called, 'onFocusedRowChanging is not called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('onFocusedCellChanging\\onFocusedCellChanged\\onFocusedRowChanging\\onFocusedRowChanged events do not fire when a master row is clicked and keboardNavigation = false', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' },
                { id: 2, name: 'name2' }
            ],
            keyExpr: 'id',
            columns: ['id', 'name'],
            masterDetail: {
                enabled: true
            },
            keyboardNavigation: {
                enabled: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data', 'detail'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.notOk(onFocusedCellChanging.called, 'onFocusedCellChanging is not called');
        assert.notOk(onFocusedRowChanging.called, 'onFocusedRowChanging is not called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('A group row is not focused if focus is cancelled using the onFocusedCellChanging event', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy(function(e) { e.cancel = true; });
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1', category: 1 },
                { id: 2, name: 'name2', category: 2 }
            ],
            keyExpr: 'id',
            columns: ['id', 'name', { dataField: 'category', groupIndex: 0 }],
            grouping: {
                autoExpandAll: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group', 'data'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.notOk(onFocusedRowChanging.called, 'onFocusedRowChanging is not called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('A master row is not focused if focus is cancelled using the onFocusedCellChanging event', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy(function(e) { e.cancel = true; });
        const onFocusedRowChanging = sinon.spy();
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' },
                { id: 2, name: 'name2' }
            ],
            keyExpr: 'id',
            columns: ['id', 'name'],
            masterDetail: {
                enabled: true
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data', 'detail'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.notOk(onFocusedRowChanging.called, 'onFocusedRowChanging is not called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('A group row is not focused if focus is cancelled using the onFocusedRowChanging event', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy(function(e) { e.cancel = true; });
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1', category: 1 },
                { id: 2, name: 'name2', category: 2 }
            ],
            keyExpr: 'id',
            columns: ['id', 'name', { dataField: 'category', groupIndex: 0 }],
            grouping: {
                autoExpandAll: false
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['group', 'group', 'data'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.ok(onFocusedRowChanging.called, 'onFocusedRowChanging is called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('A master row is not focused if focus is cancelled using the onFocusedRowChanging event', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const onFocusedCellChanging = sinon.spy();
        const onFocusedRowChanging = sinon.spy(function(e) { e.cancel = true; });
        const onFocusedCellChanged = sinon.spy();
        const onFocusedRowChanged = sinon.spy();
        const dataGrid = createDataGrid({
            focusedRowEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' },
                { id: 2, name: 'name2' }
            ],
            keyExpr: 'id',
            columns: ['id', 'name' ],
            masterDetail: {
                enabled: true
            },
            onFocusedCellChanging,
            onFocusedRowChanging,
            onFocusedCellChanged,
            onFocusedRowChanged
        });

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data'], 'group rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');

        // act
        const $command = $(dataGrid.getRowElement(1)).find('.dx-command-expand');
        $command.trigger(CLICK_EVENT).trigger('dxclick');
        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getVisibleRows().map(({ rowType }) => rowType), ['data', 'data', 'detail'], 'rows are rendered');
        assert.notOk(dataGrid.option('focusedRowKey'), 'focusedRowKey is not set');
        assert.equal(dataGrid.option('focusedRowIndex'), -1, 'focusedRowIndex is not set');
        assert.ok(onFocusedCellChanging.called, 'onFocusedCellChanging is called');
        assert.ok(onFocusedRowChanging.called, 'onFocusedRowChanging is called');
        assert.notOk(onFocusedCellChanged.called, 'onFocusedCellChanged is not called');
        assert.notOk(onFocusedRowChanged.called, 'onFocusedRowChanged is not called');
    });

    QUnit.test('Data cell should be focused correctly when a left arrow key is pressed on an adaptive cell in the last data row (T916621)', function(assert) {
        // arrange
        this.dataGrid.dispose();
        const dataGrid = createDataGrid({
            columnHidingEnabled: true,
            dataSource: [
                { id: 1, name: 'name1' }
            ],
            keyExpr: 'id',
            columns: ['id', { dataField: 'name', width: 120 }],
            width: 120
        });

        this.clock.tick();

        const $cell0 = $(dataGrid.getCellElement(0, 0));
        $cell0.trigger(CLICK_EVENT).trigger('dxclick');

        let keyboard = keyboardMock($cell0);
        keyboard.keyDown('right');
        this.clock.tick();

        const $cell1 = $(dataGrid.getCellElement(0, 2));

        // assert
        assert.notOk($cell0.hasClass('dx-focused'), 'cell is not focused');
        assert.ok($cell1.hasClass('dx-command-adaptive'), 'adaptive cell');
        assert.ok($cell1.hasClass('dx-focused'), 'cell is focused');


        keyboard = keyboardMock($cell1);
        keyboard.keyDown('left');
        this.clock.tick();

        // assert
        assert.ok($cell0.hasClass('dx-focused'), 'cell is focused');
    });
});
