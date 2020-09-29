import devices from 'core/devices';
import errors from 'ui/widget/ui.errors';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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
        this.clock.tick();

        const $commandCell = $(dataGrid.getCellElement(0, 0));
        $commandCell.find('.my-class').trigger('click');
        this.clock.tick();

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
        this.clock.tick();

        let selectedKeys;
        dataGrid.getSelectedRowKeys().done(keys => selectedKeys = keys);
        this.clock.tick();

        // assert
        assert.deepEqual(selectedKeys, [1]);
        assert.notOk(onSelectionChangedHandler.called, 'onSelectionChanged is not called');
    });

    QUnit.test('selectedRowKeys option', function(assert) {
        // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
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

    // T489478
    QUnit.test('Console errors should not be occurs when stateStoring enabled with selectedRowKeys value', function(assert) {
        sinon.spy(errors, 'log');
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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

        this.clock.tick();

        // assert
        assert.ok(dataGrid);
        assert.deepEqual(errors.log.getCalls().length, 0, 'no error maeesages in console');
    });

    // T748677
    QUnit.test('getSelectedRowsData should works if selectedRowKeys is defined and state is empty', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [1], 'selectedRowKeys');
        assert.deepEqual(dataGrid.getSelectedRowsData(), [{ id: 1, text: 'Text 1' }], 'getSelectedRowsData result');
    });

    QUnit.test('empty selection should be restored from state storing if selectedRowKeys option is defined', function(assert) {
        // act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [], 'selectedRowKeys');
        assert.deepEqual(dataGrid.getSelectedRowsData(), [], 'getSelectedRowsData result');
    });

    QUnit.test('assign null to selectedRowKeys option unselect selected items', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
            selection: {
                mode: 'multiple'
            }
        });

        this.clock.tick();

        const $cells = $(dataGrid.element()).find('.dx-editor-inline-block');

        // assert
        assert.equal($cells.length, 3, 'checkbox cell count');
        $cells.each((_, el) => {
            assert.strictEqual($(el).css('vertical-align'), 'middle', 'middle vertical align');
        });
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
            loadingTimeout: undefined,
            onRowPrepared: function(e) {
                $(e.rowElement).css('height', 50);
            },
            selection: {
                mode: 'multiple'
            },
            scrolling: {
                mode: 'virtual',
                rowRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo({ top: 500 });
        dataGrid.selectRows([12], true);

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 15, 'visible row count');
        assert.equal(visibleRows[0].key, 6, 'first visible row key');
        assert.equal(visibleRows[6].key, 12, 'selected row key');
        assert.equal(visibleRows[6].isSelected, true, 'isSelected for selected row');
        assert.ok($(dataGrid.getRowElement(6)).hasClass('dx-selection'), 'dx-selection class is added');
    });

    // T726385
    QUnit.test('selectAll should works correctly if selectAllMode is page and row rendering mode is virtual', function(assert) {
        // arrange, act
        const array = [];

        for(let i = 1; i <= 30; i++) {
            array.push({ id: i });
        }

        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            loadingTimeout: undefined,
            selection: {
                mode: 'multiple',
                selectAllMode: 'page'
            },
            scrolling: {
                rowRenderingMode: 'virtual'
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.selectAll();

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 10, 'visible row count');
        assert.equal(dataGrid.getSelectedRowKeys().length, 20, 'selected row key count equals pageSize');
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
            loadingTimeout: undefined,
            selection: {
                mode: 'single'
            },
            scrolling: {
                rowRenderingMode: 'virtual',
                useNative: false
            }
        }).dxDataGrid('instance');

        // act
        dataGrid.getScrollable().scrollTo({ y: 10000 });
        $(dataGrid.getRowElement(0)).trigger('dxclick');

        // assert
        const visibleRows = dataGrid.getVisibleRows();
        assert.equal(visibleRows.length, 10, 'visible row count');
        assert.equal(visibleRows[0].isSelected, true, 'first visible row is selected');
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [11], 'selected row key count equals pageSize');
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
            loadingTimeout: undefined,
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
        this.clock.tick();

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
            loadingTimeout: undefined,
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
        this.clock.tick();

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
            loadingTimeout: undefined,
            renderAsync: true,
            selection: {
                mode: 'multiple',
                deferred: true
            },
            selectionFilter: selectionFilter
        });

        const $grid = grid.$element();
        this.clock.tick();

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
            loadingTimeout: undefined,
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

        this.clock.tick(0);

        // act
        dataGrid.option({
            dataSource: [{ field1: 1, field2: 2, field3: 3 }],
            selection: { mode: 'none' }
        });
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.columnCount(), 3, 'columnCount after change dataSource');
    });

    QUnit.test('Selection changed handler do not try to get dxCheckBox instance when selection mode is single (T237209)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2 }],
            selection: { mode: 'multiple' }
        });

        this.clock.tick(0);

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

        this.clock.tick(0);

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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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

        this.clock.tick();

        // act
        dataGrid.option({
            dataSource: [{ a: 1111, b: 222 }],
            scrolling: {
                mode: 'standard'
            }
        });

        dataGrid.selectRows([{ a: 1111, b: 222 }]);

        this.clock.tick();

        // assert
        assert.deepEqual(dataGrid.getSelectedRowKeys(), [{ a: 1111, b: 222 }], 'selected row keys');
        assert.equal($(dataGrid.$element()).find('.dx-selection').length, 1, 'one row is selected');
    });

    // T709078
    QUnit.test('selectedRowKeys change several times', function(assert) {
        // arrange
        const selectionChangedSpy = sinon.spy();
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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
        assert.strictEqual(selectionChangedSpy.callCount, 2, 'onSelectionChanged is called twice');
        assert.notOk($(dataGrid.getRowElement(0)).hasClass('dx-selection'), 'no dx-selection on the first row');
        assert.ok($(dataGrid.getRowElement(1)).hasClass('dx-selection'), 'dx-selection on the second row');
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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
            dataSource: [{ id: 1111 }]
        });

        const $selectAllElement = $(dataGrid.element()).find('.dx-header-row .dx-command-select');
        $selectAllElement.trigger('dxclick');

        // this.clock.tick();

        // assert
        assert.equal(dataGrid.getSelectedRowKeys().length, 1);
        assert.equal($selectAllElement.find('.dx-datagrid-text-content').length, 0);
        assert.ok($($selectAllElement).find('.dx-select-checkbox').hasClass('dx-checkbox-checked'));
    });
});
