import devices from 'core/devices';
import errors from 'ui/widget/ui.errors';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import pointerMock from '../../helpers/pointerMock.js';
import $ from 'jquery';

const DX_STATE_HOVER_CLASS = 'dx-state-hover';

QUnit.testStart(function() {
    const markup = `
        <div id="container">
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(markup);
});


QUnit.module('Initialization', baseModuleConfig, () => {
    // T837103
    QUnit.test('Enable rows hover with showCheckBoxesMode = onClick', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'hover is disabled for not desktop devices');
            return;
        }

        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'i' }
            ],
            keyExpr: 'i',
            dataSource: [{ i: 1 }, { i: 2 }],
            loadingTimeout: null,
            hoverStateEnabled: true,
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick'
            }
        });
        const $rows = $dataGrid.find('.dx-data-row');
        const $firstRow = $rows.eq(0);
        const $secondRow = $rows.eq(1);

        // act
        $($dataGrid).trigger({ target: $firstRow.get(0), type: 'dxpointerenter', pointerType: 'mouse' });

        const $firstCommandColumn = $firstRow.find('.dx-command-select');
        const $firstCheckBox = $firstCommandColumn.find('.dx-select-checkbox');

        const $secondCommandColumn = $secondRow.find('.dx-command-select');
        const $secondCheckBox = $secondCommandColumn.find('.dx-select-checkbox');

        // assert
        assert.ok($firstRow.hasClass(DX_STATE_HOVER_CLASS), 'hover class');
        assert.ok($firstCheckBox.length, 'checkbox');
        assert.notEqual($firstCommandColumn.css('overflow'), 'hidden', 'command column\'s overflow');

        assert.notOk($secondRow.hasClass(DX_STATE_HOVER_CLASS), 'no hover class');
        assert.ok($secondCheckBox.length, 'checkbox');
        assert.equal($secondCommandColumn.css('overflow'), 'hidden', 'command column\'s overflow');
    });

    // T808614
    QUnit.test('Last row should not jump after selection by click if pager has showInfo', function(assert) {
        const data = [];
        let $lastRowElement;

        for(let i = 0; i < 10; i++) {
            data.push({ id: i + 1 });
        }

        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: data,
            height: 200,
            keyExpr: 'id',
            selection: {
                mode: 'single'
            },
            paging: {
                enabled: true,
                pageSize: 5
            },
            pager: {
                showInfo: true
            }
        });

        // act
        $(dataGrid.getRowElement(0)).trigger('dxclick');
        dataGrid.getScrollable().scrollTo({ y: 200 });

        $lastRowElement = $(dataGrid.getRowElement(4));
        const offset = $lastRowElement.offset();

        $lastRowElement.trigger('dxclick');
        $lastRowElement = $(dataGrid.getRowElement(4));

        // assert
        assert.deepEqual($lastRowElement.offset(), offset, 'last row offset');
    });

    QUnit.testInActiveWindow('onSelectionChanged should not be raised when a command button with a custom image is clicked (T876269)', function(assert) {
        // arrange
        const selectionChanged = sinon.spy();
        const buttonClick = sinon.spy();

        const dataGrid = createDataGrid({
            keyExpr: 'name',
            dataSource: [
                { name: 'Alex', phone: '555555', room: 1 },
                { name: 'Ben', phone: '6666666', room: 2 }
            ],
            selection: {
                mode: 'single'
            },
            columns: [
                {
                    type: 'buttons',
                    width: 100,
                    buttons: [{
                        icon: '.svg',
                        cssClass: 'my-class',
                        onClick: buttonClick
                    }]
                },
                'name', 'phone', 'room'
            ],
            onSelectionChanged: selectionChanged
        });
        this.clock.tick(10);

        const $commandCell = $(dataGrid.getCellElement(0, 0));
        $commandCell.find('.my-class').trigger('click');
        this.clock.tick(10);

        const $firstRow = $(dataGrid.getRowElement(0));

        // assert
        assert.ok(buttonClick.calledOnce, 'button is clicked');
        assert.equal(selectionChanged.callCount, 0, 'selectionChanged is not called');
        assert.notOk($firstRow.hasClass('dx-selection'), 'the first row is not selected');
    });

    QUnit.test('Deferred selection - The onSelectionChanged event should not fire on initial loading if a restored state contains selecitonFilter (T885777)', function(assert) {
        // arrange
        const onSelectionChangedHandler = sinon.spy();
        const gridOptions = {
            keyExpr: 'id',
            dataSource: [{ id: 1 }],
            columns: ['id'],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return { selectionFilter: ['id', '=', 1] };
                }
            },
            selection: {
                mode: 'multiple',
                deferred: true
            },
            onSelectionChanged: onSelectionChangedHandler
        };
        const dataGrid = createDataGrid(gridOptions);
        this.clock.tick(10);

        let selectedKeys;
        dataGrid.getSelectedRowKeys().done(keys => selectedKeys = keys);
        this.clock.tick(10);

        // assert
        assert.deepEqual(selectedKeys, [1]);
        assert.notOk(onSelectionChangedHandler.called, 'onSelectionChanged is not called');
    });

    QUnit.test('selectedRowKeys option', function(assert) {
        // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: {
                    type: 'array', key: 'id', data: [
                        { id: 1, value: 'value 1' },
                        { id: 2, value: 'value 2' },
                        { id: 3, value: 'value 3' }
                    ]
                }
            },
            selectedRowKeys: [2, 3, 4]
        }).dxDataGrid('instance');
        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [2, 3], 'isSelected keys');
        assert.deepEqual(dataGrid.getSelectedRowsData(), [{ id: 2, value: 'value 2' }, { id: 3, value: 'value 3' }], 'isSelected items');
        assert.equal($('#dataGrid').find('.dx-row.dx-selection').length, 2, 'isSelected rows');
    });

    // T1109408
    QUnit.test('Aria-selected should not present if selection.mode is none', function(assert) {
        assert.expect(2);
        // arrange
        $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{ ID: 0 }, { ID: 1 }],
            keyExpr: 'ID',
            columns: ['ID'],
            showBorders: true,
            selection: { mode: 'none' },
        });
        // assert
        $('.dx-data-row').each((ind, item) => assert.notOk(item.hasAttribute('aria-selected')));
    });

    // T1109728
    QUnit.test('Row selection td-tags should not have aria-label attr, but its checkboxes should', function(assert) {
        assert.expect(6);
        // arrange
        $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{ ID: 0 }, { ID: 1 }],
            keyExpr: 'ID',
            columns: ['ID'],
            selection: { mode: 'multiple' },
        }).dxDataGrid('instance');

        // assert
        assert.notOk($('.dx-header-row .dx-command-select').get(0).hasAttribute('aria-label'));
        assert.ok($('.dx-header-row .dx-select-checkbox').get(0).hasAttribute('aria-label'));

        $('.dx-data-row .dx-command-select').each((ind, item) => assert.notOk(item.hasAttribute('aria-label')));
        $('.dx-data-row .dx-select-checkbox').each((ind, item) => assert.ok(item.hasAttribute('aria-label')));
    });

    // T489478
    QUnit.test('Console errors should not be occurs when stateStoring enabled with selectedRowKeys value', function(assert) {
        sinon.spy(errors, 'log');
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [{ id: 1, text: 'Text 1' }]
                }
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        selectedRowKeys: [1]
                    };
                }
            }
        });

        this.clock.tick(10);

        // assert
        assert.ok(dataGrid);
        assert.deepEqual(errors.log.getCalls().length, 0, 'no error maeesages in console');
    });

    // T748677
    QUnit.test('getSelectedRowsData should works if selectedRowKeys is defined and state is empty', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [{ id: 1, text: 'Text 1' }]
                }
            },
            selectedRowKeys: [1],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {};
                }
            }
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [1], 'selectedRowKeys');
        assert.deepEqual(dataGrid.getSelectedRowsData(), [{ id: 1, text: 'Text 1' }], 'getSelectedRowsData result');
    });

    QUnit.test('empty selection should be restored from state storing if selectedRowKeys option is defined', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [{ id: 1, text: 'Text 1' }]
                }
            },
            selectedRowKeys: [1],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        selectedRowKeys: []
                    };
                }
            }
        });

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [], 'selectedRowKeys');
        assert.deepEqual(dataGrid.getSelectedRowsData(), [], 'getSelectedRowsData result');
    });

    QUnit.test('assign null to selectedRowKeys option unselect selected items', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{
                'id': 1,
            }, {
                'id': 2,
            }],
            keyExpr: 'id',
            selectedRowKeys: [1]
        });

        // act
        dataGrid.option('selectedRowKeys', null);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [], 'zero items are selected');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [], 'empty array in option');
    });

    QUnit.test('Checkbox should be vertically aligned at the cell center', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ name: true }],
            loadingTimeout: null,
            selection: {
                mode: 'multiple'
            }
        });

        this.clock.tick(10);

        const $cells = $(dataGrid.element()).find('.dx-editor-inline-block');

        // assert
        assert.equal($cells.length, 3, 'checkbox cell count');
        $cells.each((_, el) => {
            assert.strictEqual($(el).css('vertical-align'), 'middle', 'middle vertical align');
        });
    });

    QUnit.test('SelectAll checkbox should be shown when a certain row is selected and allowSelectAll is disabled (T997734)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }],
            keyExpr: 'id',
            selection: {
                mode: 'multiple',
                allowSelectAll: false
            }
        });

        this.clock.tick(100);
        const $selectAllElement = $(dataGrid.element()).find('.dx-datagrid-headers .dx-command-select .dx-select-checkbox');

        // assert
        assert.ok($selectAllElement.hasClass('dx-state-invisible'), 'select all is invisible initially');

        // act
        $(dataGrid.getCellElement(0, 0)).find('.dx-select-checkbox').trigger('dxclick');
        this.clock.tick(100);

        // assert
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [1], 'selected keys');
        assert.notOk($selectAllElement.hasClass('dx-state-invisible'), 'select all is visible');
    });

    QUnit.test('SelectAll checkbox should be hidden on click when allowSelectAll is disabled (T997734)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }],
            keyExpr: 'id',
            selectedRowKeys: [1],
            selection: {
                mode: 'multiple',
                allowSelectAll: false
            }
        });

        this.clock.tick(100);
        const $selectAllElement = $(dataGrid.element()).find('.dx-datagrid-headers .dx-command-select .dx-select-checkbox');

        // assert
        assert.notOk($selectAllElement.hasClass('dx-state-invisible'), 'select all is visible initially');

        // act
        $selectAllElement.trigger('dxclick');
        this.clock.tick(100);

        // assert
        assert.notOk(dataGrid.option('selectedRowKeys').length, 'no selected keys');
        assert.ok($selectAllElement.hasClass('dx-state-invisible'), 'select all is invisible');
    });

    QUnit.test('SelectAll checkbox should be shown when a certain row is selected and allowSelectAll is disabled (deferred) (T997734)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }],
            keyExpr: 'id',
            selection: {
                mode: 'multiple',
                deferred: true,
                allowSelectAll: false
            }
        });

        this.clock.tick(100);
        const $selectAllElement = $(dataGrid.element()).find('.dx-datagrid-headers .dx-command-select .dx-select-checkbox');

        // assert
        assert.ok($selectAllElement.hasClass('dx-state-invisible'), 'select all is invisible initially');

        // act
        $(dataGrid.getCellElement(0, 0)).find('.dx-select-checkbox').trigger('dxclick');
        this.clock.tick(100);

        // assert
        assert.deepEqual(dataGrid.option('selectionFilter'), ['id', '=', 1], 'selection filter');
        assert.notOk($selectAllElement.hasClass('dx-state-invisible'), 'select all is visible');
    });

    QUnit.test('SelectAll checkbox should be hidden on click when allowSelectAll is disabled (deferred) (T997734)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }],
            keyExpr: 'id',
            selectionFilter: ['id', '=', 1],
            selection: {
                mode: 'multiple',
                deferred: true,
                allowSelectAll: false
            }
        });

        this.clock.tick(100);
        const $selectAllElement = $(dataGrid.element()).find('.dx-datagrid-headers .dx-command-select .dx-select-checkbox');

        // assert
        assert.notOk($selectAllElement.hasClass('dx-state-invisible'), 'select all is visible initially');

        // act
        $selectAllElement.trigger('dxclick');
        this.clock.tick(100);

        // assert
        assert.notOk(dataGrid.option('selectionFilter').length, 'no selection filter');
        assert.ok($selectAllElement.hasClass('dx-state-invisible'), 'select all is invisible');
    });

    QUnit.test('SelectAll checkbox should have correct value on page change when allowSelectAll is page and repaintChangesOnly is true (T1106649)', function(assert) {
        const array = [];
        let i = 100;
        while(i--) {
            array.push({ id: i });
        }
        const dataGrid = createDataGrid({
            dataSource: array,
            keyExpr: 'id',
            repaintChangesOnly: true,
            selection: {
                mode: 'multiple',
                selectAllMode: 'page',
                showCheckboxesMode: 'always',
            },
            paging: {
                pageSize: 10,
            },
        });

        this.clock.tick(10);
        const $dataGridElement = $(dataGrid.element());
        const $selectAllElement = $dataGridElement.find('.dx-datagrid-headers .dx-command-select .dx-select-checkbox');
        const $checkboxElement = $(dataGrid.getCellElement(0, 0));

        // act
        $checkboxElement.trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.ok($selectAllElement.hasClass('dx-checkbox-indeterminate'));

        // act
        $dataGridElement.find('.dx-page').eq(1).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.notOk($selectAllElement.hasClass('dx-checkbox-indeterminate'));

        // act
        $dataGridElement.find('.dx-page').eq(0).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.ok($selectAllElement.hasClass('dx-checkbox-indeterminate'));
    });


    QUnit.test('Disabled item should be selected when single mode is enabled (T1015840)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, disabled: false }, { id: 2, disabled: true }],
            keyExpr: 'id',
            columns: ['id'],
            selection: {
                mode: 'single'
            }
        });

        this.clock.tick(100);

        // act
        $(dataGrid.getRowElement(0)).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [1], 'first row is selected');

        // act
        $(dataGrid.getRowElement(1)).trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [2], 'second row is selected');
    });

    QUnit.test('Disabled item should be selected when single deferred mode is enabled (T1015840)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, disabled: false }, { id: 2, disabled: true }],
            keyExpr: 'id',
            columns: ['id'],
            selection: {
                mode: 'single',
                deferred: true
            }
        });

        this.clock.tick(100);

        let selectedRowKeys;

        // act
        $(dataGrid.getRowElement(0)).trigger('dxclick');
        dataGrid.getSelectedRowKeys().done(keys => {
            selectedRowKeys = keys;
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(selectedRowKeys, [1], 'first row is selected');

        // act
        selectedRowKeys = null;
        $(dataGrid.getRowElement(1)).trigger('dxclick');
        dataGrid.getSelectedRowKeys().done(keys => {
            selectedRowKeys = keys;
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(selectedRowKeys, [2], 'second row is selected');
    });

    QUnit.test('Disabled item should be selected when multiple mode is enabled (T1015840)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, disabled: false }, { id: 2, disabled: true }],
            keyExpr: 'id',
            columns: ['id'],
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            }
        });

        this.clock.tick(100);

        // act
        $(dataGrid.getRowElement(0)).find('.dx-checkbox').trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [1], 'first row is selected');

        // act
        $(dataGrid.getRowElement(1)).find('.dx-checkbox').trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [1, 2], 'both rows are selected');
    });

    QUnit.test('Disabled item should be selected when multiple deferred mode is enabled (T1015840)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1, disabled: false }, { id: 2, disabled: true }],
            keyExpr: 'id',
            columns: ['id'],
            selection: {
                mode: 'multiple',
                deferred: true,
                showCheckBoxesMode: 'always'
            }
        });
        let selectedRowKeys;

        this.clock.tick(100);

        // act
        $(dataGrid.getRowElement(0)).find('.dx-checkbox').trigger('dxclick');
        dataGrid.getSelectedRowKeys().done(keys => {
            selectedRowKeys = keys;
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(selectedRowKeys, [1], 'first row is selected');

        // act
        selectedRowKeys = null;
        $(dataGrid.getRowElement(1)).find('.dx-checkbox').trigger('dxclick');
        dataGrid.getSelectedRowKeys().done(keys => {
            selectedRowKeys = keys;
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(selectedRowKeys, [1, 2], 'both rows are selected');
    });

    QUnit.test('Selection should persist when triggering selection on an already selected row (T1105369)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{
                'id': 1,
            }, {
                'id': 2,
            }],
            keyExpr: 'id',
            focusedRowEnabled: true,
            onFocusedRowChanged: (e) => {
                if(e.row) {
                    e.component.selectRows([e.row.key], false);
                }
            },
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            },
        });
        this.clock.tick(10);

        const $checkBox = $(dataGrid.getRowElement(0)).find('.dx-checkbox');
        // act
        $checkBox.trigger('dxclick');
        this.clock.tick(10);
        $checkBox.trigger('dxpointerdown');
        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [1], 'row is selected');
        assert.ok(dataGrid.isRowFocused(1), 'row is focused');
    });

});

QUnit.module('Virtual row rendering', baseModuleConfig, () => {
    QUnit.test('selection should works correctly if row rendering mode is virtual', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 50; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            loadingTimeout: null,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
            },
            selection: {
                mode: 'multiple'
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false,
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo({ top: 500 });
        dataGrid.selectRows([12], true);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 2, 'visible row count');
        assert.equal(visibleRows[0].key, 11, 'first visible row key');
        assert.equal(visibleRows[1].key, 12, 'selected row key');
        assert.equal(visibleRows[1].isSelected, true, 'isSelected for selected row');
        assert.ok($(dataGrid.getRowElement(1)).hasClass('dx-selection'), 'dx-selection class is added');
    });

    // T726385
    QUnit.test('selectAll should works correctly if selectAllMode is page and row rendering mode is virtual', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 40; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            paging: {
                pageSize: 30
            },
            selection: {
                mode: 'multiple',
                selectAllMode: 'page'
            },
            scrolling: {
                rowRenderingMode: 'virtual'
            }
        }).dxDataGrid('instance');

        this.clock.tick(10);

        // act
        dataGrid.selectAll();
        this.clock.tick(10);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 16, 'visible row count');
        assert.equal(dataGrid.getSelectedRowKeys().length, 30, 'selected row key count equals pageSize');
    });

    // T726385
    QUnit.test('selection after scrolling should works correctly if row rendering mode is virtual', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 30; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            selection: {
                mode: 'single'
            },
            scrolling: {
                rowRenderingMode: 'virtual',
                useNative: false,
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo({ y: 10000 });

        $(dataGrid.getRowElement(0)).trigger('dxclick');

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 1, 'visible row count');
        assert.equal(visibleRows[0].isSelected, true, 'first visible row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [20], 'selected row key count equals pageSize');
    });

    QUnit.test('selection after scrolling should work correctly if remote paging/sorting/filtering and local grouping (T1056403)', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 10; i++) {
            array.push({ group: i, id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            remoteOperations: { sorting: true, filtering: true, paging: true },
            selection: {
                mode: 'single'
            },
            scrolling: {
                mode: 'virtual',
                useNative: false,
            },
            columns: [{ dataField: 'group', groupIndex: 0 }, 'id']
        }).dxDataGrid('instance');

        this.clock.tick(300);

        // act
        dataGrid.getScrollable().scrollTo({ y: 300 });

        $(dataGrid.getRowElement(1)).trigger('dxclick');

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.deepEqual(visibleRows[0].key, [5], 'first visible row key');
        assert.equal(visibleRows[1].key, 5, 'first visible row key');
        assert.equal(visibleRows[1].isSelected, true, 'first visible row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [5], 'selected row key count equals pageSize');
    });

    QUnit.test('selection after paging should work correctly if rowRenderingMode is virtual (T1058757)', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 10; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            selection: {
                mode: 'single'
            },
            paging: {
                pageSize: 5,
                pageIndex: 1
            },
            scrolling: {
                rowRenderingMode: 'virtual'
            },
            columns: ['id']
        }).dxDataGrid('instance');

        this.clock.tick(300);

        // act
        $(dataGrid.getRowElement(0)).trigger('dxclick');

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows[0].key, 6, 'first visible row key');
        assert.equal(visibleRows[0].isSelected, true, 'first visible row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [6], 'selected row key');
    });

    QUnit.test('Selection with Shift should work properly when rowRenderingMode is virtual (T1046809)', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 100; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 500,
            dataSource: array,
            keyExpr: 'id',
            paging: {
                enabled: false,
            },
            scrolling: {
                mode: 'standard',
                useNative: false,
                rowRenderingMode: 'virtual'
            },
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            }
        }).dxDataGrid('instance');

        this.clock.tick(300);

        // act
        $(dataGrid.getRowElement(0)).find('.dx-command-select .dx-checkbox-icon').trigger('dxclick');

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [1], 'first row selected');

        // act
        dataGrid.getScrollable().scrollTo({ top: 2400 });
        this.clock.tick(300);
        pointerMock($(dataGrid.getRowElement(0)).find('.dx-command-select .dx-checkbox-icon')).start({ shiftKey: true }).click(true);
        this.clock.tick(300);

        // assert
        assert.equal(dataGrid.getSelectedRowKeys().length, 71, 'selected rows count');
    });
});

QUnit.module('Async render', baseModuleConfig, () => {
    // T857205
    QUnit.test('selection if renderAsync is true and state storing is used', function(assert) {
        const selectedRowKeys = [1, 2];

        const customLoad = sinon.spy(() => {
            return {
                selectedRowKeys: selectedRowKeys
            };
        });

        // act
        const grid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            keyExpr: 'id',
            loadingTimeout: null,
            renderAsync: true,
            filterRow: {
                visible: true
            },
            selection: {
                mode: 'multiple'
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad
            }
        });

        const $grid = grid.$element();
        this.clock.tick(10);

        const $selectCheckboxes = $grid.find('.dx-select-checkbox');
        const $inputs = $selectCheckboxes.find('input');

        // assert
        assert.equal(customLoad.callCount, 1, 'customLoad was called once');

        assert.deepEqual(grid.getSelectedRowKeys(), selectedRowKeys, 'selected row keys');

        assert.equal($inputs.eq(1).prop('value'), 'true', 'first row checkbox');
        assert.equal($inputs.eq(2).prop('value'), 'true', 'second row checkbox');
        assert.equal($inputs.eq(3).prop('value'), 'false', 'third row checkbox');
    });

    // T899260
    QUnit.test('deferred selection if renderAsync is true and state storing is used', function(assert) {
        const selectionFilter = [['id', '=', 1], 'or', ['id', '=', 2]];

        const customLoad = sinon.spy(() => {
            return {
                selectionFilter: selectionFilter
            };
        });

        // act
        const grid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            keyExpr: 'id',
            loadingTimeout: null,
            renderAsync: true,
            filterRow: {
                visible: true
            },
            selection: {
                mode: 'multiple',
                deferred: true
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad
            }
        });

        const $grid = grid.$element();
        this.clock.tick(10);

        const $selectCheckboxes = $grid.find('.dx-select-checkbox');
        const $inputs = $selectCheckboxes.find('input');

        // assert
        assert.equal(customLoad.callCount, 1, 'customLoad was called once');

        assert.deepEqual(grid.option('selectionFilter'), selectionFilter, 'selected row keys');

        assert.equal($inputs.eq(1).prop('value'), 'true', 'first row checkbox');
        assert.equal($inputs.eq(2).prop('value'), 'true', 'second row checkbox');
        assert.equal($inputs.eq(3).prop('value'), 'false', 'third row checkbox');
    });

    // T899260
    QUnit.test('deferred selection if renderAsync is true', function(assert) {
        const selectionFilter = [['id', '=', 1], 'or', ['id', '=', 2]];

        // act
        const grid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            keyExpr: 'id',
            loadingTimeout: null,
            renderAsync: true,
            selection: {
                mode: 'multiple',
                deferred: true
            },
            selectionFilter: selectionFilter
        });

        const $grid = grid.$element();
        this.clock.tick(10);

        const $selectCheckboxes = $grid.find('.dx-select-checkbox');
        const $inputs = $selectCheckboxes.find('input');

        // assert
        assert.equal($inputs.eq(1).prop('value'), 'true', 'first row checkbox');
        assert.equal($inputs.eq(2).prop('value'), 'true', 'second row checkbox');
        assert.equal($inputs.eq(3).prop('value'), 'false', 'third row checkbox');
    });
});

QUnit.module('Assign options', baseModuleConfig, () => {
    // T360631
    QUnit.test('disabled change when selection enabled', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1 }],
            loadingTimeout: null,
            disabled: true,
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            }
        });

        assert.strictEqual($(dataGrid.$element()).find('.dx-state-disabled').length, 3, 'dx-state-disabled class exists');

        // act
        dataGrid.option('disabled', false);

        // assert
        assert.strictEqual($(dataGrid.$element()).find('.dx-state-disabled').length, 0, 'dx-state-disabled class does not exist');
    });

    QUnit.test('dataSource change with selection', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2 }],
            selection: { mode: 'none' }
        });

        this.clock.tick(10);

        // act
        dataGrid.option({
            dataSource: [{ field1: 1, field2: 2, field3: 3 }],
            selection: { mode: 'none' }
        });
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.columnCount(), 3, 'columnCount after change dataSource');
    });

    QUnit.test('Selection changed handler do not try to get dxCheckBox instance when selection mode is single (T237209)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2 }],
            selection: { mode: 'multiple' }
        });

        this.clock.tick(10);

        // act
        dataGrid.option('selection.mode', 'single');

        // assert
        assert.ok(true);
    });

    // T325867
    QUnit.test('selection.showCheckBoxesMode change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2 }],
            selection: { mode: 'multiple' }
        });

        this.clock.tick(10);

        assert.equal($(dataGrid.$element()).find('.dx-select-checkboxes-hidden').length, 1, 'select checkboxes are hidden');


        // act
        dataGrid.option('selection.showCheckBoxesMode', 'none');
        dataGrid.option('selection.showCheckBoxesMode', 'always');

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-select-checkboxes-hidden').length, 0, 'select checkboxes are not hidden');
        assert.equal($(dataGrid.$element()).find('.dx-select-checkbox').length, 2, 'two select checkboxes');
    });

    // T420180
    QUnit.test('selection.mode change from single to multiple', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            selectedRowKeys: [{ id: 1 }],
            selection: { mode: 'single' }
        });

        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 1, 'one row is selected');


        // act
        dataGrid.option('selection.mode', 'multiple');

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 1, 'one row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ id: 1 }], 'one selected row key via method');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [{ id: 1 }], 'one selected row key via option');
    });

    QUnit.test('selection.mode change from multiple to single and none', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            selectedRowKeys: [{ id: 1 }, { id: 3 }],
            selection: { mode: 'multiple' }
        });

        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 2, 'one row is selected');

        // act
        dataGrid.option('selection.mode', 'single');

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 1, 'one row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ id: 1 }], 'one selected row key via method');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [{ id: 1 }], 'one selected row key via option');

        // act
        dataGrid.option('selection.mode', 'none');

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 0, 'no selected rows');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [], 'no selected row key via method');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [], 'no selected row key via option');
    });

    QUnit.test('selection change without changing mode do not change selectedRowKeys', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }],
            selectedRowKeys: [{ id: 1 }, { id: 3 }],
            selection: { mode: 'none' }
        });

        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 2, 'one row is selected');

        // act
        dataGrid.option('selection', { mode: 'none' });

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-row.dx-selection').length, 2, 'one row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ id: 1 }, { id: 3 }], 'one selected row key via method');
        assert.deepEqual(dataGrid.option('selectedRowKeys'), [{ id: 1 }, { id: 3 }], 'one selected row key via option');
    });

    QUnit.test('selectionMode change', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ a: 1111, b: 222 }],
            selection: { mode: 'single' }
        });
        dataGrid.selectRows({ a: 1111, b: 222 });

        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }]);

        // act
        dataGrid.option('selection.mode', 'none');
        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), []);

        // act
        dataGrid.selectRows({ a: 1111, b: 222 });
        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }]);
    });

    QUnit.test('selectRows after change scrolling', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ a: 1111, b: 222 }]
        });

        this.clock.tick(10);

        // act
        dataGrid.option({
            dataSource: [{ a: 1111, b: 222 }],
            scrolling: {
                mode: 'standard'
            }
        });

        dataGrid.selectRows([{ a: 1111, b: 222 }]);

        this.clock.tick(10);

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }], 'selected row keys');
        assert.equal($(dataGrid.$element()).find('.dx-selection').length, 1, 'one row is selected');
    });

    // T709078
    QUnit.test('selectedRowKeys change several times', function(assert) {
        // arrange
        const selectionChangedSpy = sinon.spy();
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            keyExpr: 'id',
            onSelectionChanged: selectionChangedSpy,
            dataSource: [{ id: 1 }, { id: 2 }]
        });

        const resizingController = dataGrid.getController('resizing');
        sinon.spy(resizingController, 'updateDimensions');

        // act
        dataGrid.beginUpdate();
        dataGrid.option('selectedRowKeys', [1]);
        dataGrid.option('selectedRowKeys', [2]);
        dataGrid.endUpdate();

        // assert
        assert.strictEqual(resizingController.updateDimensions.callCount, 0, 'updateDimensions is not called');
        assert.ok(selectionChangedSpy.called, 'onSelectionChanged is called');
        assert.notOk($(dataGrid.getRowElement(0)).hasClass('dx-selection'), 'no dx-selection on the first row');
        assert.ok($(dataGrid.getRowElement(1)).hasClass('dx-selection'), 'dx-selection on the second row');
    });

    // T1008562
    QUnit.test('selection.showCheckBoxesMode changing does not clear selection', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 1 }, { field1: 2, field2: 2 }],
            keyExpr: 'field1',
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'onClick',
                deferred: true
            },
        });
        dataGrid.selectRows([1]);
        this.clock.tick(10);

        // assert
        let selectedKeysBefore;
        dataGrid.getSelectedRowKeys().done((keys) => selectedKeysBefore = keys);
        this.clock.tick(10);
        assert.deepEqual(selectedKeysBefore, [1]);

        // act
        dataGrid.option('selection.showCheckBoxesMode', 'none');

        // assert
        let selectedKeysAfter;
        dataGrid.getSelectedRowKeys().done((keys) => selectedKeysAfter = keys);
        this.clock.tick(10);
        assert.deepEqual(selectedKeysAfter, [1]);
    });

    // T1136904
    QUnit.test('selection should be reset after changing dataSource and paging at the same time', function(assert) {
        // arrange
        const dataSource1 = [{ a: 1 }, { a: 2 }];
        const dataSource2 = [{ a: 3 }, { a: 4 }];

        const dataGrid = createDataGrid({
            dataSource: dataSource1,
            keyExpr: 'a',
            selectedRowKeys: [1],
            paging: {
                pageSize: 1,
                pageIndex: 1,
            },
            selection: {
                mode: 'multiple',
            },
        });
        this.clock.tick(10);

        // act
        dataGrid.option({
            dataSource: dataSource2,
            paging: {
                pageIndex: 0
            },
        });

        this.clock.tick(100);

        // assert
        assert.deepEqual(dataGrid.option('selectedRowKeys'), []);
    });
});

QUnit.module('columnWidth auto option', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        $('#dataGrid').css('width', 350);
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('SelectAll when allowSelectAll is default', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            selection: { mode: 'multiple' },
            loadingTimeout: null,
            dataSource: [{ id: 1111 }, { id: 2222 }]
        });

        // act
        dataGrid.selectAll();

        // assert
        const selectedRows = dataGrid.getSelectedRowKeys();
        assert.equal(selectedRows.length, 2);
    });

    QUnit.test('SelectAll when allowSelectAll is false', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            selection: { mode: 'multiple', allowSelectAll: false },
            loadingTimeout: null,
            dataSource: [{ id: 1111 }, { id: 2222 }]
        });

        // act
        dataGrid.selectAll();

        // assert
        const selectedRows = dataGrid.getSelectedRowKeys();
        assert.equal(selectedRows.length, 2);
    });

    // T628315
    QUnit.test('Click near selectAll doesn\'t generate infinite loop', function(assert) {
        // arrange, act
        // this.clock.restore();
        const dataGrid = createDataGrid({
            selection: { mode: 'multiple' },
            loadingTimeout: null,
            dataSource: [{ id: 1111 }]
        });

        const $selectAllElement = $(dataGrid.element()).find('.dx-header-row .dx-command-select');
        $selectAllElement.trigger('dxclick');

        // this.clock.tick(10);

        // assert
        assert.equal(dataGrid.getSelectedRowKeys().length, 1);
        assert.equal($selectAllElement.find('.dx-datagrid-text-content').length, 0);
        assert.ok($($selectAllElement).find('.dx-select-checkbox').hasClass('dx-checkbox-checked'));
    });
});
