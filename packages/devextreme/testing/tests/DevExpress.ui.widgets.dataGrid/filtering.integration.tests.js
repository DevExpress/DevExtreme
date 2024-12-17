import $ from 'jquery';
import { EdmLiteral } from 'common/data/odata/utils';
import commonUtils from 'core/utils/common';
import devices from '__internal/core/m_devices';
import ArrayStore from 'common/data/array_store';
import gridCoreUtils from '__internal/grids/grid_core/m_utils';
import fx from 'common/core/animation/fx';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import { getEmulatorStyles } from '../../helpers/stylesHelper.js';

const dataGridWrapper = new DataGridWrapper('#dataGrid');

fx.off = true;

QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid">
            </div>
        </div>
    `;

    const markup = `
        <style nonce="qunit-test">
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
            ${getEmulatorStyles()}
        </style>

        <!--qunit-fixture-->

        ${gridMarkup}
    `;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Initialization', baseModuleConfig, () => {
    QUnit.test('DataGrid - Should hide filter row menu after losing it\'s focus', function(assert) {
        // arrange
        const filterRowWrapper = dataGridWrapper.filterRow;

        createDataGrid({
            filterRow: { visible: true },
            dataSource: [{ field1: '1', field2: '2' }]
        });
        this.clock.tick(10);

        // act
        const $menu = filterRowWrapper.getMenuElement(0);
        $menu.focus();

        const menuInstance = $menu.dxMenu('instance');
        const $root = $(menuInstance.itemElements().get(0));
        menuInstance._showSubmenu($root);
        const subMenu = menuInstance._visibleSubmenu;

        // assert
        assert.ok(subMenu._isVisible(), 'submenu exists');

        // act
        $menu.blur();

        // assert
        assert.notOk(subMenu._isVisible(), 'submenu is hidden');
    });

    // T860356 - Deprecated change
    // T1257970 - New change for Contrast Accessibility WCAG Standard
    QUnit.test('Filter row\'s menu icons and text should have similar colors', function(assert) {
        // arrange
        const filterRowWrapper = dataGridWrapper.filterRow;

        createDataGrid({
            filterRow: { visible: true },
            dataSource: [{ field1: '1' }]
        });
        this.clock.tick(10);

        // act
        const $menu = filterRowWrapper.getMenuElement(0);
        $menu.focus();

        const menuInstance = $menu.dxMenu('instance');
        const $root = $(menuInstance.itemElements().get(0));
        menuInstance._showSubmenu($root);
        const subMenu = menuInstance._visibleSubmenu;

        // assert
        const $items = $('.dx-datagrid.dx-filter-menu.dx-overlay-content').find('.dx-menu-item-has-icon');

        assert.ok(subMenu._isVisible(), 'submenu exists');
        assert.ok($items.length, 'menu items');

        let $currentItem;
        for(let i = 0; i < $items.length; i++) {
            $currentItem = $items.eq(i);

            assert.equal($currentItem.find('.dx-menu-item-text').css('color'), $currentItem.find('.dx-icon').css('color'), 'colors are similar');
        }
    });

    // T837684
    QUnit.test('There are no exceptions when changing a filterValue to an array and selectedFilterOperation to \'between\' for date column', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ field: new Date(1992, 7, 6) }, { field: new Date(1992, 7, 9) }],
            filterRow: { visible: true },
            columns: [{ dataField: 'field', dataType: 'date' }]
        });

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 2, 'row count');

        try {
            // act
            dataGrid.option('columns[0].filterValue', [new Date(1992, 7, 5), new Date(1992, 7, 7)]);
            dataGrid.option('columns[0].selectedFilterOperation', 'between');

            // assert
            assert.ok(true, 'no exceptions');
            assert.strictEqual(dataGrid.getVisibleRows().length, 1, 'row count');
        } catch(e) {
            // assert
            assert.ok(false, 'exception');
        }
    });

    // T832870
    QUnit.test('onEditorPreparing event should not be fired twice for each column if state storing and filter row are used', function(assert) {
        let onEditorPreparingCallCount = 0;

        createDataGrid({
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            dataSource: [{ field1: 'data', field2: 'data2' }],
            onEditorPreparing: function(e) {
                onEditorPreparingCallCount++;
            },
            filterRow: {
                visible: true
            },
            stateStoring: {
                enabled: true
            }
        });

        // act
        this.clock.tick(10);

        // assert
        assert.equal(onEditorPreparingCallCount, 2, 'onEditorPreparing call count');
    });

    // T735143
    QUnit.test('Apply state with paging and filtering if filterPanel is visible', function(assert) {
        const dataGrid = createDataGrid({
            columns: ['id'],
            dataSource: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
            paging: {
                pageSize: 2,
                pageIndex: 1
            },
            filterPanel: {
                visible: true
            },
            headerFilter: {
                visible: true
            },
            filterRow: {
                visible: true
            }
        });

        this.clock.tick(10);

        // act
        dataGrid.state({ pageIndex: 1, pageSize: 2, filterValue: ['id', '<>', 1] });
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.pageIndex(), 1, 'pageIndex is applied');
        assert.equal(dataGrid.getVisibleRows().length, 1, 'rows are filtered');
    });

    QUnit.testInActiveWindow('Filter row editor should have focus after _synchronizeColumns (T638737)', function(assert) {
        $('#qunit-fixture').css('position', 'static');
        // arrange, act
        const dataGrid = createDataGrid({
            filterRow: { visible: true },
            editing: { allowAdding: true },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' }
            ],
            dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }]
        });

        this.clock.tick(10);

        const $input = $(dataGrid.$element()).find('.dx-editor-cell').first().find('.dx-texteditor-input');
        $input.focus().val('1').trigger('change');

        const selectionRangeArgs = [];

        const oldSetSelectionRange = gridCoreUtils.setSelectionRange;
        gridCoreUtils.setSelectionRange = function(element, range) {
            oldSetSelectionRange.apply(this, arguments);
            selectionRangeArgs.push([element, range]);
        };

        this.clock.tick(10);

        gridCoreUtils.setSelectionRange = oldSetSelectionRange;

        // assert
        const $focusedInput = dataGrid.$element().find('.dx-editor-cell .dx-texteditor-input:focus');
        assert.equal(dataGrid.getVisibleRows().length, 1, 'filter was applied');
        assert.ok($focusedInput.length, 'filter cell has focus after filter applyed');
        // T662207
        if(devices.real().deviceType === 'desktop') {
            assert.deepEqual(selectionRangeArgs, [[$focusedInput.get(0), { selectionStart: 1, selectionEnd: 1 }]], 'setSelectionRange args');
        }

        $('#qunit-fixture').css('position', '');
    });

    // T596274
    QUnit.testInActiveWindow('Resize a column with the \'between\' filter should not throw an exception', function(assert) {
        // arrange
        let $filterRangeContent;

        fx.off = true;

        try {
            const dataGrid = $('#dataGrid').dxDataGrid({
                width: 200,
                allowColumnResizing: true,
                loadingTimeout: null,
                filterRow: {
                    visible: true
                },
                dataSource: [{ name: 'Bob', age: 16 }],
                columns: [
                    { dataField: 'name', width: 100 },
                    { dataField: 'age', width: 100, selectedFilterOperation: 'between' }
                ]
            });
            const instance = dataGrid.dxDataGrid('instance');

            $filterRangeContent = $('#dataGrid').find('.dx-datagrid-filter-row').find('.dx-filter-range-content').first();
            $filterRangeContent.focus();
            this.clock.tick(10);

            // assert
            assert.strictEqual($('.dx-overlay-wrapper.dx-datagrid-filter-range-overlay').length, 1, 'has overlay wrapper');

            // act
            const resizeController = instance.getController('columnsResizer');
            resizeController._startResizing({
                event: {
                    data: resizeController,
                    type: 'touchstart',
                    pageX: -9900,
                    pageY: -9990,
                    preventDefault: function() { },
                    stopPropagation: function() { }
                }
            });
            resizeController._moveSeparator({
                event: {
                    data: resizeController,
                    pageX: -9850,
                    preventDefault: commonUtils.noop
                }
            });
            resizeController._endResizing({
                event: {
                    data: resizeController
                }
            });

            // assert
            assert.strictEqual(instance.columnOption(0, 'width'), 150);
            assert.strictEqual(instance.columnOption(1, 'width'), 50);
        } catch(e) {
            // assert
            assert.ok(false, 'exception');
        } finally {
            fx.off = false;
        }
    });

    // T162735, T406593
    QUnit.test('Load count on start when stateStoring enabled with search/filterRow values', function(assert) {
        let loadCallCount = 0;
        let loadFilter;
        let contentReadyCallCount = 0;
        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            remoteOperations: { filtering: true, sorting: true, paging: true },
            dataSource: {
                load: function(options) {
                    loadCallCount++;
                    loadFilter = options.filter;
                    return $.Deferred().resolve([{ field1: 'text1', field2: 100 }, { field1: 'text2', field2: 200 }], { totalCount: 2 });
                }
            },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        columns: [{ dataField: 'field1', dataType: 'string', visibleIndex: 0 }, { dataField: 'field2', dataType: 'number', visibleIndex: 1 }],
                        searchText: '200'
                    };
                }
            }

        });

        this.clock.tick(10);
        assert.ok(dataGrid);
        assert.equal(contentReadyCallCount, 1, 'contentReady is called once');
        assert.equal(loadCallCount, 1, '1 load count on start');
        assert.deepEqual(loadFilter, [['field1', 'contains', '200'], 'or', ['field2', '=', 200]]);
    });

    // T802967
    QUnit.test('calculateFilterExpression should not be called infinite times if it returns function and scrolling mode is virtual', function(assert) {
        const data = [];
        for(let i = 0; i < 25; i++) {
            data.push({ test: i });
        }
        let calculateFilterExpressionCallCount = 0;
        try {
            createDataGrid({
                height: 1000,
                loadingTimeout: null,
                scrolling: {
                    mode: 'virtual'
                },
                columns: [{
                    selectedFilterOperation: '=',
                    filterValue: [],
                    dataField: 'test',
                    dataType: 'number',
                    calculateFilterExpression: function(filterValues) {
                        calculateFilterExpressionCallCount++;
                        return function() {
                            return filterValues.length === 0;
                        };
                    }
                }],
                dataSource: data
            });

        } catch(err) {
            assert.ok(false, 'the error is thrown');
        } finally {
            assert.equal(calculateFilterExpressionCallCount, 3, 'calculateFilterExpression call count');
        }
    });

    // T802967
    QUnit.test('getCombinedFilter should work correctly if filterPanel is visible and calculateFilterExpression returns function', function(assert) {
        const data = [];
        for(let i = 0; i < 21; i++) {
            data.push({ test: i });
        }
        let calculateFilterExpressionCallCount = 0;
        const grid = createDataGrid({
            loadingTimeout: null,
            dataSource: data,
            filterPanel: { visible: true },
            columns: [{
                selectedFilterOperation: '=',
                filterValue: 0,
                dataField: 'test',
                calculateFilterExpression: function() {
                    calculateFilterExpressionCallCount++;
                    return function() {
                        return true;
                    };
                }
            }]
        });

        assert.equal(calculateFilterExpressionCallCount, 3, 'calculateFilterExpression call count');
        assert.ok(grid.getCombinedFilter(), 'combined filter');
        assert.equal(calculateFilterExpressionCallCount, 4, 'calculateFilterExpression call count');
    });

    function createRemoteDataSourceWithGroupPaging(arrayStore, key) {
        return {
            key,
            load: function(options) {
                const d = $.Deferred();
                setTimeout(function() {
                    const result = {};
                    arrayStore.load(options).done(function(data) {
                        result.data = data;

                        if(options.group) {
                            data.forEach(item => {
                                item.count = item.items.length;
                                item.items = null;
                            });
                        }
                    });
                    if(options.requireGroupCount) {
                        arrayStore.load({ filter: options.filter, group: options.group }).done(function(groupedData) {
                            result.groupCount = groupedData.length;
                        });
                    }
                    if(options.requireTotalCount) {
                        arrayStore.totalCount(options).done(function(totalCount) {
                            result.totalCount = totalCount;
                        });
                    }

                    d.resolve(result);
                }, 10);

                return d;
            }
        };
    }
    // T716207
    QUnit.test('Filtering should works correctly if groupPaging is enabled and group is expanded', function(assert) {
        // arrange

        const arrayStore = new ArrayStore([
            { id: 1, group: 'group', type: 1 },
            { id: 2, group: 'group', type: 1 },
            { id: 3, group: 'group', type: 1 },
            { id: 4, group: 'group', type: 2 }
        ]);
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: createRemoteDataSourceWithGroupPaging(arrayStore, 'id'),
            remoteOperations: { groupPaging: true },
            height: 400,
            filterSyncEnabled: true,
            loadingTimeout: null,
            scrolling: {
                mode: 'virtual'
            },
            grouping: {
                autoExpandAll: false
            },
            paging: {
                pageSize: 2
            },
            columns: [{
                dataField: 'group',
                groupIndex: 0
            }, {
                dataField: 'id'
            }, {
                dataField: 'type'
            }]
        }).dxDataGrid('instance');
        this.clock.tick(500);

        dataGrid.expandRow(['group']);
        this.clock.tick(500);

        // act
        dataGrid.columnOption('type', 'filterValue', 1);
        this.clock.tick(500);

        // assert
        assert.notOk(dataGrid.getDataSource().isLoading(), 'not loading');
        assert.equal(dataGrid.getVisibleRows().length, 4, 'visible row count is correct');
    });

    // T655083
    QUnit.test('Virtual rows should be hidden after filtering if cellTemplate is asynchronous', function(assert) {
        const items = [];
        for(let i = 0; i < 100; i++) {
            items.push({ id: i + 1 });
        }

        const dataGrid = createDataGrid({
            height: 500,
            dataSource: items,
            scrolling: {
                mode: 'virtual'
            },
            columns: [{
                dataField: 'id',
                cellTemplate: function($container, options) {
                    setTimeout(function() {
                        $('<div>').text(options.text).appendTo($container);
                    });
                }
            }]
        });

        // act
        this.clock.tick(300);

        // assert
        assert.equal(dataGrid.$element().find('.dx-virtual-row').length, 1, '1 virtual rows');

        // act
        dataGrid.columnOption('id', 'filterValue', '99');
        this.clock.tick(300);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 1, '1 visible row');
        assert.equal(dataGrid.$element().find('.dx-virtual-row').length, 0, 'no virtual rows');
    });

    QUnit.test('filterRow, command column and showEditorAlways column should render asynchronously if renderAsync is true', function(assert) {
        let cellPreparedCells = [];

        // act
        createDataGrid({
            dataSource: [{ id: 1, boolean: true }],
            loadingTimeout: null,
            renderAsync: true,
            filterRow: {
                visible: true
            },
            selection: {
                mode: 'multiple'
            },
            onCellPrepared: function(e) {
                cellPreparedCells.push(e.rowType + '-' + (e.column.command || e.column.dataField));
            }
        });


        // assert
        assert.deepEqual(cellPreparedCells, [
            'header-id', 'header-boolean',
            'filter-select', 'header-select',
            'data-id'
        ], 'synchronous cellPrepared calls');

        // act
        cellPreparedCells = [];
        this.clock.tick(10);

        // assert
        assert.deepEqual(cellPreparedCells, [
            'filter-id', 'filter-boolean', // filter row is async
            'data-select', // command column is async
            'data-boolean' // showEditorAlways column is async
        ], 'asynchronous cellPrepared calls');
    });

    QUnit.test('Column\'s filterValue is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', 'name']
        });
        this.clock.tick(10);

        // act
        const filterValue = 'test2';
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue }]);
        this.clock.tick(10);
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValue);
    });

    QUnit.test('Column\'s filterValue is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', 'name']
        });
        this.clock.tick(10);

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        const filterValue = 'test2';
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue }]);
        this.clock.tick(10);
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValue);
    });

    QUnit.test('Columns\'s selectedFilterOperation is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const filterValue = 'test1';
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValue }]
        });
        this.clock.tick(10);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValue);

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, selectedFilterOperation: '<>' }]);
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, 'test2');
    });

    QUnit.test('Columns\'s selectedFilterOperation is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const filterValue = 'test1';
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValue }]
        });
        this.clock.tick(10);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValue);

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, selectedFilterOperation: '<>' }]);
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, 'test2');
    });

    QUnit.test('Columns\'s allowFiltering is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const filterValue = 'test1';
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValue }]
        });
        this.clock.tick(10);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, allowFiltering: false }]);
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 2, 'two rows are displayed');
    });

    QUnit.test('Columns\'s allowFiltering is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const filterValue = 'test1';
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValue }]
        });
        this.clock.tick(10);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, allowFiltering: false }]);
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 2, 'two rows are displayed');
    });

    QUnit.test('Columns\'s filterValues is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const filterValues = ['test1'];
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', 'name']
        });
        this.clock.tick(10);

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues }]);
        this.clock.tick(10);
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValues[0]);
    });

    QUnit.test('Columns\'s filterValues is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const filterValues = ['test1'];
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', 'name']
        });
        this.clock.tick(10);

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues }]);
        this.clock.tick(10);
        const visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValues[0]);
    });

    QUnit.test('Columns\'s filterType is applied at runtime (T898619)', function(assert) {
        // arrange, act
        const filterValues = ['test1'];
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValues }]
        });
        this.clock.tick(10);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValues[0]);

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues, filterType: 'exclude' }]);
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, 'test2');
    });

    QUnit.test('Columns\'s filterType is applied at runtime while dataSource is reloading (T898619)', function(assert) {
        // arrange, act
        const filterValues = ['test1'];
        const dataGrid = createDataGrid({
            dataSource: {
                store: {
                    type: 'array',
                    key: 'id',
                    data: [
                        { id: 1, name: 'test1' },
                        { id: 2, name: 'test2' }
                    ]
                }
            },
            columns: ['id', { dataField: 'name', filterValues }]
        });
        this.clock.tick(10);
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValues[0]);

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues, filterType: 'exclude' }]);
        this.clock.tick(10);
        visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, 'test2');
    });

    QUnit.test('filterRow.visible change after clearFilter', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{ a: 1111, b: 222 }]
        });

        this.clock.tick(10);

        // act
        dataGrid.clearFilter();
        dataGrid.option('filterRow.visible', true);

        this.clock.tick(10);

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-filter-row').length, 1, 'filter row is rendered');

        assert.strictEqual(dataGrid.getView('columnHeadersView')._requireReady, false, 'columnHeadersView requireReady is false');
        assert.strictEqual(dataGrid.getView('rowsView')._requireReady, false, 'rowsView requireReady is false');
    });

    // T818434
    QUnit.test('State reset should reset filtering', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            columns: [{ dataField: 'field1' }, { dataField: 'field2' }],
            filterPanel: { visible: true },
            dataSource: [{ field1: 'test1', field2: 1 }, { field1: 'test2', field2: 2 }]
        });
        let filter;

        this.clock.tick(10);

        // act
        filter = ['field1', '=', 'test1'];
        dataGrid.option('filterValue', filter);

        // assert
        assert.deepEqual(dataGrid.option('filterValue'), filter, 'dataGrid\'s filter');

        // act
        dataGrid.state(null);
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.option('filterValue'), undefined, 'dataGrid\'s filter');

        // act
        filter = ['field2', '=', 1];
        dataGrid.option('filterValue', filter);

        // assert
        assert.deepEqual(dataGrid.option('filterValue'), filter, 'dataGrid\'s filter');

        // act
        dataGrid.state(null);
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.option('filterValue'), undefined, 'dataGrid\'s filter');

        // act
        filter = [['field1', '=', 'test1'], 'and', ['field2', '=', 1]];
        dataGrid.option('filterValue', filter);

        // assert
        assert.deepEqual(dataGrid.option('filterValue'), filter, 'dataGrid\'s filter');

        // act
        dataGrid.state(null);
        this.clock.tick(10);

        // assert
        assert.equal(dataGrid.option('filterValue'), undefined, 'dataGrid\'s filter');
    });

    // T548906
    QUnit.test('Filtering on load when virtual scrolling', function(assert) {
        // arrange
        const generateDataSource = function(count) {
            const result = [];
            for(let i = 0; i < count; ++i) {
                result.push({ firstName: 'name_' + i, lastName: 'lastName_' + i });
            }
            return result;
        };
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            height: 50,
            dataSource: generateDataSource(10),
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 2
            },
            columns: [
                { dataField: 'firstName', filterValue: 'name_5' },
                'lastName'
            ]
        });

        const items = dataGrid.getDataSource().items();

        // assert
        assert.equal(items.length, 1, '1 item in dataSource');
        assert.equal(items[0].firstName, 'name_5', 'filtered row \'firstName\' field value');
        assert.equal(items[0].lastName, 'lastName_5', 'filtered row \'lastName\' field value');
    });

    // T731090
    QUnit.test('DataGrid should hide load panel after filtering to no data if focused row is enabled', function(assert) {
        // arrange
        const generateDataSource = function(count) {
            const result = [];
            for(let i = 1; i <= count; ++i) {
                result.push({ id: i });
            }
            return result;
        };
        const dataGrid = createDataGrid({
            height: 100,
            dataSource: generateDataSource(100),
            keyExpr: 'id',
            focusedRowEnabled: true,
            focusedRowKey: 1,
            scrolling: {
                mode: 'virtual'
            }
        });

        this.clock.tick(10);

        dataGrid.pageIndex(5);
        this.clock.tick(10);

        // act
        dataGrid.filter(['id', '=', 666]);
        this.clock.tick(10);

        // assert
        assert.strictEqual(dataGrid.getVisibleRows().length, 0, 'no rows');
        assert.strictEqual(dataGrid.getController('data').isLoading(), false, 'no loading');
    });

    QUnit.test('search text when scrolling mode virtual and one column is not defined', function(assert) {
        // arrange, act

        const dataSource = [
            { 'CompanyName': 'K&S Music' },
            { 'CompanyName': 'Super Mart of the West' },
            { 'CompanyName': 'Electronics Depot' },
            { 'CompanyName': 'K&S Music' },
            { 'CompanyName': 'Kiwi Market' }
        ];

        const dataGrid = createDataGrid({
            dataSource: dataSource,
            loadingTimeout: null,
            scrolling: {
                mode: 'virtual'
            },
            searchPanel: {
                text: 'Kiwi'
            },
            paging: {
                pageSize: 2
            },
            columns: ['CompanyName', 'Undefined']
        }
        );

        assert.equal(dataGrid.getVisibleRows().length, 1, 'items were filtered');
    });

    // T820316
    QUnit.test('Error should not be thrown when searching text in calculated column with lookup', function(assert) {
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [{ text: 'text', num: 1 }, { text: 'text', num: 2 }],
            searchPanel: {
                visible: true
            },
            columns: [{
                calculateCellValue: function(rowData) {
                    return rowData.num;
                },
                allowFiltering: true,
                lookup: {
                    dataSource: [{ id: 1, name: 'one' }, { id: 2, name: 'two' }],
                    valueExpr: 'id',
                    displayExpr: 'name'
                }
            }, 'text']
        });

        try {
            dataGrid.option('searchPanel.text', 'one');
            this.clock.tick(10);
        } catch(e) {
            assert.ok(false, 'error was thrown');
        }

        const visibleRows = dataGrid.getVisibleRows();

        assert.equal(visibleRows.length, 1, 'one row is visible');
        assert.deepEqual(visibleRows[0].data, { text: 'text', num: 1 }, 'visible row\'s data');
    });

    QUnit.test('Should not display all rows when no search results and lookup is used (T1059631)', function(assert) {
        // arrange
        let loadingTimes = 0;
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                load(e) {
                    loadingTimes += 1;
                    return [{ text: 'text', num: 1 }, { text: 'text', num: 2 }];
                }
            },
            searchPanel: {
                visible: true
            },
            columns: [{
                dataField: 'num',
                allowFiltering: true,
                lookup: {
                    dataSource: [{ id: 1, name: 'one' }, { id: 2, name: 'two' }],
                    valueExpr: 'id',
                    displayExpr: 'name'
                }
            }]
        });

        // act
        this.clock.tick(10);

        // assert
        const visibleRowsBeforeSearch = dataGrid.getVisibleRows();
        assert.strictEqual(visibleRowsBeforeSearch.length, 2, 'two visible rows');

        // act
        dataGrid.option('searchPanel.text', 'three');
        this.clock.tick(10);

        // assert
        const visibleRowsAfterSearch = dataGrid.getVisibleRows();
        assert.strictEqual(visibleRowsAfterSearch.length, 0, 'no visible rows');
        assert.strictEqual(loadingTimes, 1, 'doesn\'t load items if no search results');
    });

    QUnit.test('Should not display all rows when no search results and lookup is used (remoteOperations: true, additionalFilter is used) (T1059631)', function(assert) {
        // arrange
        let loadingTimes = 0;
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: {
                load() {
                    loadingTimes += 1;
                    return $.Deferred().resolve({
                        data: [{ text: 'text', num: 1 }, { text: 'text', num: 2 }],
                        totalCount: 2,
                    });
                }
            },
            filterValue: ['num', '<=', '2'],
            searchPanel: {
                visible: true
            },
            remoteOperations: true,
            columns: [{
                dataField: 'num',
                allowFiltering: true,
                lookup: {
                    dataSource: [{ id: 1, name: 'one' }, { id: 2, name: 'two' }],
                    valueExpr: 'id',
                    displayExpr: 'name'
                }
            }]
        });

        // act
        this.clock.tick(10);

        // assert
        const visibleRowsBeforeSearch = dataGrid.getVisibleRows();
        assert.strictEqual(visibleRowsBeforeSearch.length, 2, 'two visible rows');
        assert.strictEqual(loadingTimes, 2, 'loads before search request');

        // act
        dataGrid.option('searchPanel.text', 'three');
        this.clock.tick(10);

        // assert
        const visibleRowsAfterSearch = dataGrid.getVisibleRows();
        assert.strictEqual(visibleRowsAfterSearch.length, 0, 'no visible rows');
        assert.strictEqual(loadingTimes, 2, 'doesn\'t load items if no search results');
    });

    QUnit.test('Correct number parsing in search', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            dataSource: [
                { number: 1, string: 'FIC112' },
                { number: 1, string: 'FIC115' },
                { number: 1, string: 'FIC233' },
                { number: 1, string: 'PIC122' },
                { number: 1, string: 'PIC123' },
                { number: 1, string: 'PIC125' },
            ],
            searchPanel: {
                visible: true
            },
            columns: [{
                dataField: 'number',
                format: '#'
            }, 'string']
        });

        // act
        dataGrid.option('searchPanel.text', 'FIC1');
        this.clock.tick(10);

        // assert
        const visibleRows = dataGrid.getVisibleRows();

        assert.equal(visibleRows.length, 2, 'row are filtered');
        assert.deepEqual(visibleRows.map(i => i.data.string), ['FIC112', 'FIC115'], 'number rows are not shown');
    });

    QUnit.test('search editor have not been recreated when search text is changed', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            searchPanel: {
                visible: true,
            },
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        });
        const searchEditor = $(dataGrid.$element()).find('.dx-datagrid-search-panel').dxTextBox('instance');
        // act
        dataGrid.option('searchPanel.text', '123');
        // assert
        assert.strictEqual(searchEditor.option('value'), '123');
    });

    // T744851
    QUnit.test('search editor value should be changed when search text is changed if grid is rendered in toolbar', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            onToolbarPreparing: function(e) {
                e.toolbarOptions.items.unshift({
                    location: 'before',
                    template: function() {
                        return $('<div>').dxDataGrid({
                            loadingTimeout: null,
                            searchPanel: {
                                visible: true
                            }
                        });
                    }
                });
            },
            searchPanel: {
                visible: true,
            },
            dataSource: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
        });
        const $searchEditors = $(dataGrid.$element()).find('.dx-datagrid-search-panel');

        // act
        dataGrid.option('searchPanel.text', '123');

        // assert
        assert.strictEqual($searchEditors.eq(0).dxTextBox('instance').option('value'), '', 'first search editor is not changed');
        assert.strictEqual($searchEditors.eq(1).dxTextBox('instance').option('value'), '123', 'second search editor is changed');
    });

    QUnit.test('search editor have not been recreated on typing', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: null,
            remoteOperations: { filtering: true, sorting: true, paging: true },
            searchPanel: {
                visible: true,
            },
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ a: 1, b: 2 }, { a: 2, b: 1 }]
                }
            }
        });
        const searchEditor = $(dataGrid.$element()).find('.dx-datagrid-search-panel').dxTextBox('instance');
        // act
        searchEditor.option('value', '123');
        // assert
        assert.strictEqual(searchEditor, $(dataGrid.$element()).find('.dx-datagrid-search-panel').dxTextBox('instance'));
    });

    // T414555
    QUnit.test('Apply state when search text and grouping are changed', function(assert) {
        let loadingCount = 0;
        const dataGrid = createDataGrid({
            columns: [
                'ID',
                { dataField: 'Terms', groupIndex: 0 },
                'Employee'
            ],
            dataSource: {
                store: {
                    type: 'array',
                    data: [{
                        'ID': 47,
                        'Terms': '30 Days',
                        'Employee': 'Clark Morgan'
                    }],
                    onLoading: function() {
                        loadingCount++;
                    }
                }
            },
            stateStoring: {
                ignoreColumnOptionNames: []
            }
        });

        this.clock.tick(10);

        assert.equal(dataGrid.columnOption('groupIndex:0').dataField, 'Terms', 'grouped column exists');

        loadingCount = 0;

        const strState = {
            'columns': [
                { 'visibleIndex': 0, 'dataField': 'ID', 'dataType': 'number', 'visible': true },
                { 'visibleIndex': 1, 'dataField': 'Terms', 'dataType': 'string', 'visible': true, 'sortOrder': 'asc', 'sortIndex': 0 },
                { 'visibleIndex': 2, 'dataField': 'Employee', 'dataType': 'string', 'visible': true }],
            'searchText': 'A',
            'pageIndex': 0,
            'pageSize': 0,
            'allowedPageSizes': []
        };

        // act
        dataGrid.state(strState);
        this.clock.tick(10);

        // assert
        assert.ok(!dataGrid.columnOption('groupIndex:0'), 'no grouped columns');
        assert.equal(dataGrid.option('searchPanel.text'), 'A', 'search panel text is applied');
        assert.equal(loadingCount, 1, 'loading count');
    });

    // T443177
    QUnit.test('Show searchPanel via option method', function(assert) {
        // arrange
        const dataGrid = createDataGrid({});

        // act
        dataGrid.option('searchPanel.visible', true);

        // assert
        const $headerPanelElement = $($(dataGrid.$element()).find('.dx-datagrid-header-panel'));
        assert.ok($headerPanelElement.length, 'has headerPanel');
        assert.ok($headerPanelElement.find('.dx-datagrid-search-panel').length, 'has searchPanel');
    });

    // T702241
    QUnit.test('Scroll position headers after changing of headerFilter setting', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            scrolling: {
                useNative: false
            },
            columns: [
                { dataField: 'firstName', width: 200 },
                { dataField: 'lastName', width: 200 }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');
        let $headersView;

        // act
        this.clock.tick(10);

        $headersView = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        $headersView.scrollLeft(200);
        $($headersView).trigger('scroll');

        dataGrid.option('headerFilter.visible', true);

        // assert
        $headersView = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        assert.equal($headersView.scrollLeft(), 200);
    });

    // T364210
    QUnit.test('Load count on start when EdmLiteral in calculatedFilterExpression is used and scrolling mode is virtual', function(assert) {
        let loadCallCount = 0;
        let contentReadyCallCount = 0;
        const dataGrid = createDataGrid({
            onContentReady: function() {
                contentReadyCallCount++;
            },
            height: 100,
            remoteOperations: {
                paging: true, filtering: true
            },
            loadingTimeout: null,
            scrolling: {
                mode: 'virtual'
            },
            columns: [{
                dataField: 'test',
                selectedFilterOperation: '>',
                filterValue: 50,
                dataType: 'number',
                calculateFilterExpression: function(value, filterOperation) {
                    value = new EdmLiteral(value + 'm');
                    return [this.dataField, filterOperation || '=', value];
                }
            }],
            dataSource: {
                pageSize: 5,
                load: function(options) {
                    loadCallCount++;
                    return $.Deferred().resolve([{}, {}, {}, {}, {}], { totalCount: 100 });
                }
            }
        });

        assert.ok(dataGrid);
        assert.equal(loadCallCount, 1, 'one load count on start');
        assert.equal(contentReadyCallCount, 1, 'one contentReady on start');
    });


    // T1072812
    QUnit.test('getCombinedFilter returns actual value when called in onOptionChanged', function(assert) {
        let filterChangedCount = 0;

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'column1' }],
            dataSource: [],
            loadingTimeout: null,
            filterRow: {
                visible: true,
            },
            onOptionChanged: (e) => {
                const filter = e.component.getCombinedFilter();

                if(filterChangedCount === 0) {
                    assert.strictEqual(filter[2], 35);
                } else if(filterChangedCount === 1) {
                    assert.strictEqual(filter, undefined);
                }

                filterChangedCount++;
            },
        });

        dataGrid.columnOption(0, 'filterValue', 35);
        dataGrid.columnOption(0, 'filterValue', null);
    });

    // T1118433
    QUnit.test('getCombinedFilter returns actual value when called in onOptionChanged with filterSyncEnabled', function(assert) {
        let filterChangedCount = 0;

        const dataGrid = createDataGrid({
            columns: [{ dataField: 'column1' }],
            dataSource: [],
            loadingTimeout: null,
            filterSyncEnabled: true,
            filterRow: {
                visible: true,
            },
            onOptionChanged: (e) => {
                if(e.fullName !== 'filterValue') {
                    return;
                }

                const filter = e.component.getCombinedFilter();

                if(filterChangedCount === 0) {
                    assert.strictEqual(filter[2], 35);
                } else if(filterChangedCount === 1) {
                    assert.strictEqual(filter, undefined);
                }

                filterChangedCount++;
            },
        });

        dataGrid.columnOption(0, 'filterValue', 35);
        dataGrid.columnOption(0, 'filterValue', null);
    });

    // T1122553
    QUnit.test('dataGrid should not make second request after changing filterRow selectbox value', function(assert) {
        // arrange
        const load = sinon.spy(function(loadOptions) {
            return new ArrayStore([
                { column1: 1, column2: 1 },
                { column1: 2, column2: 2 },
            ]).load(loadOptions).then(data => ({
                data,
                totalCount: 2,
            }));
        });
        createDataGrid({
            columns: [{
                dataField: 'column1',
                allowFiltering: true,
                visible: false,
            }, {
                dataField: 'column2',
                allowFiltering: true,
                lookup: {
                    dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                    valueExpr: 'id',
                    displayExpr: 'value'
                }
            }],
            dataSource: { load },
            filterRow: {
                visible: true,
            },
            remoteOperations: true,
        });

        this.clock.tick(10);

        // act
        const selectBox = $('.dx-datagrid-filter-row').find('.dx-selectbox').eq(0).dxSelectBox('instance');

        selectBox.open();
        this.clock.tick(10);

        selectBox.option('value', 1);
        this.clock.tick(10);

        // assert

        const groupRequests = load.getCalls().map(l => l.args[0]).filter(l => l.group);

        assert.deepEqual(groupRequests.length, 1);
    });

    // T1122553
    QUnit.test('dataGrid should not make second request after changing filterRow selectbox value with resetting other filter', function(assert) {
        // arrange
        const load = sinon.spy(function(loadOptions) {
            return new ArrayStore([
                { column1: 1, column2: 1 },
                { column1: 2, column2: 2 },
            ]).load(loadOptions).then(data => ({
                data,
                totalCount: 2,
            }));
        });
        createDataGrid({
            columns: [{
                dataField: 'column1',
                allowFiltering: true,
            }, {
                dataField: 'column2',
                allowFiltering: true,
                lookup: {
                    dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                    valueExpr: 'id',
                    displayExpr: 'value'
                }
            }],
            dataSource: { load },
            filterRow: {
                visible: true,
            },
            remoteOperations: true,
        });

        this.clock.tick(10);

        // act
        const numberBox = $('.dx-datagrid-filter-row').find('.dx-numberbox').eq(0).dxNumberBox('instance');
        const selectBox = $('.dx-datagrid-filter-row').find('.dx-selectbox').eq(0).dxSelectBox('instance');

        selectBox.open(); // first request on opening
        this.clock.tick(10);

        numberBox.option('value', 'test'); // second request because of filter changing
        this.clock.tick(10);
        numberBox.option('value', ''); // third request because of filter changing
        this.clock.tick(10);

        selectBox.option('value', 1); // NO request cause changing lookup filter itself
        this.clock.tick(10);

        // assert

        const groupRequests = load.getCalls().map(l => l.args[0]).filter(l => l.group);

        assert.deepEqual(groupRequests.length, 3);
    });

    // T1093656, T1096053
    QUnit.testInActiveWindow('Filter row editor should have focus when filterPanel is visible', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            filterRow: { visible: true },
            columns: [
                { dataField: 'field1' },
                {
                    dataField: 'field2',
                    filterValue: 4,
                    selectedFilterOperation: '='
                }
            ],
            filterPanel: {
                visible: true
            },
            dataSource: [{ field1: 1, field2: 2 }, { field1: 3, field2: 4 }]
        });

        this.clock.tick(100);

        // assert
        assert.equal(dataGrid.getVisibleRows().length, 1, 'row count');

        // act
        const $input = $(dataGrid.$element()).find('.dx-datagrid-filter-row').first().find('.dx-texteditor-input').first();
        $input
            .trigger('focus')
            .val('1')
            .trigger('change');
        this.clock.tick(100);

        // assert
        const $focusedInput = $(dataGrid.$element()).find('.dx-datagrid-filter-row .dx-texteditor-input:focus');
        assert.deepEqual($focusedInput.get(0), $input.get(0), 'filter cell has focus after filter applyed');
        assert.strictEqual(dataGrid.getVisibleRows().length, 0, 'row count after filtering');
        assert.deepEqual(dataGrid.option('filterValue'), [['field2', '=', 4], 'and', ['field1', '=', 1]], 'filterValue');
    });

    // T1129825
    QUnit.testInActiveWindow('Header filter indicator should restore focus after closing header filter', function(assert) {
        // arrange
        createDataGrid({
            headerFilter: { visible: true },
            columns: [
                { dataField: 'field1' },
            ],
            filterPanel: {
                visible: true
            },
        });

        this.clock.tick(100);

        // act
        $('.dx-header-filter').trigger('dxclick');
        this.clock.tick(10);
        $('.dx-button').eq(1).trigger('dxclick');
        this.clock.tick(600);

        // assert
        assert.ok($('.dx-header-filter').is(':focus'), 'header filter indicator has focus');
    });

    // T1129825
    QUnit.test('Filter should be updated after changing filterOperation when calculateFilterExpression returns getter func', function(assert) {
        // arrange
        const grid = createDataGrid({
            dataSource: [{ a: 'asd' }],
            columns: [{
                dataField: 'a',
                filterValue: 'a',
                selectedFilterOperation: '=',
                calculateFilterExpression: function(filterValue, selectedFilterOperation) {
                    function getter(data) {
                        if(selectedFilterOperation === 'contains') {
                            return data.a.includes(filterValue);
                        } else if(selectedFilterOperation === '=') {
                            return data.a === filterValue;
                        }
                    }

                    return [getter, '=', true];
                }
            }],
        });

        this.clock.tick(100);

        // assert
        assert.strictEqual(grid.getVisibleRows().length, 0);

        // act
        grid.option('columns[0].selectedFilterOperation', 'contains');
        this.clock.tick(100);

        // assert
        assert.strictEqual(grid.getVisibleRows().length, 1);
        assert.deepEqual(grid.getVisibleRows()[0].data, { a: 'asd' });
    });

    QUnit.test('Date in filter data should be serialized to string in correct format when focusedRowKey is set (T1147560)', function(assert) {
        const actualFilterValues = [];
        const expectedFilterValues = [
            [
                'Id', '=', 3
            ],
            [
                [
                    ['Date', '<', '10.00.00__31/00/2022'],
                    'or',
                    ['Date', '=', null]
                ],
                'or',
                [
                    ['Date', '=', '10.00.00__31/00/2022'],
                    'and',
                    [
                        [
                            ['Id', '<', 0],
                            'or',
                            ['Id', '=', null]
                        ],
                        'or',
                        [
                            ['Id', '=', 0],
                            'and',
                            ['Id', '<', 3]
                        ]
                    ]
                ]
            ]
        ];
        const loadedData = [
            {
                Id: 0,
                Date: new Date(2023, 0, 0, 10),
            },
            {
                Id: 1,
                Date: new Date(2023, 0, 1, 10),
            }
        ];
        const store = new ArrayStore({
            data: [],
            key: 'Id',
        });
        const originLoad = store.load;
        store.load = sinon.spy(function(loadOptions) {
            loadOptions.filter && actualFilterValues.push(loadOptions.filter);
            return originLoad.call(store, loadOptions).then(() => {
                return {
                    data: loadedData,
                    totalCount: 4,
                };
            });
        });

        createDataGrid({
            dataSource: {
                store,
            },
            columns: [
                {
                    dataField: 'Id',
                },
                {
                    dataField: 'Date',
                    dataType: 'date',
                    sortOrder: 'asc',
                },
            ],
            dateSerializationFormat: 'HH.mm.ss__dd/mm/yyyy',
            remoteOperations: true,
            focusedRowKey: 3,
            focusedRowEnabled: true,
        });

        this.clock.tick(100);

        assert.equal(actualFilterValues.length, expectedFilterValues.length);
        assert.deepEqual(actualFilterValues[0], expectedFilterValues[0]);
        assert.deepEqual(actualFilterValues[1], expectedFilterValues[1]);
    });

    // T1147719
    QUnit.test('When columns are auto-generated and filterValue is set, error should not be thrown', function(assert) {
        try {
            const grid = createDataGrid({
                dataSource: [{ id: 0 }, { id: 1 }, { id: 2 }],
                keyExpr: 'id',
                filterValue: ['id', '=', '1'],
                filterPanel: { visible: true },
            });
            this.clock.tick(10);

            const rows = grid.getVisibleRows();

            assert.strictEqual(rows.length, 1, 'Rows filtered');
            assert.strictEqual(rows[0].data.id, 1);
        } catch(err) {
            assert.ok(false, 'error is thrown');
        }
    });

    // T1147719
    QUnit.test('When columns are auto-generated, filterValue is set and dataSource was set later, error should not be thrown', function(assert) {
        try {
            const grid = createDataGrid({
                dataSource: undefined,
                keyExpr: 'id',
                filterValue: ['id', '=', '1'],
                filterPanel: { visible: true },
            });

            this.clock.tick(10);

            grid.option('dataSource', [{ id: 0 }, { id: 1 }, { id: 2 }]);

            this.clock.tick(10);

            const rows = grid.getVisibleRows();

            assert.strictEqual(rows.length, 1, 'Rows filtered');
            assert.strictEqual(rows[0].data.id, 1);
        } catch(err) {
            assert.ok(false, 'error is thrown');
        }
    });

    // T1195882
    QUnit.test('Remote data source - check the number of requests when filterValue is specified for a column without dataType, and filterSyncEnabled and syncLookupFilterValues are enabled', function(assert) {
        // arrange, act
        const store = new ArrayStore([{ CustomerID: 0 }, { CustomerID: 1 }]);
        const lookupStore = new ArrayStore([{ value: 0, text: 'test1' }, { value: 1, text: 'test2' }]);
        const loadSpy = sinon.spy((loadOptions) => store.load(loadOptions));
        const lookupLoadSpy = sinon.spy((loadOptions) => lookupStore.load(loadOptions));

        createDataGrid({
            dataSource: {
                load: loadSpy,
                totalCount: () => 2,
            },
            columns: [{
                dataField: 'CustomerID',
                lookup: {
                    dataSource: {
                        load: lookupLoadSpy
                    },
                    valueExpr: 'value',
                    displayExpr: 'text'
                },
                filterValue: 0
            }],
            headerFilter: { visible: true },
            filterRow: { visible: true },
            filterSyncEnabled: true,
            syncLookupFilterValues: true,
            remoteOperations: true
        });

        this.clock.tick(100);

        // assert
        // first load - load all lookup data
        // second load - load data without filter
        // third load - load relevant lookup data
        // fourth load - load data with filter
        assert.strictEqual(lookupLoadSpy.callCount, 1, 'lookup load count');
        assert.strictEqual(loadSpy.callCount, 3, 'load count');
    });

    // T1195882
    QUnit.test('Remote data source - check the number of requests when filterValue is specified for a column with dataType, and filterSyncEnabled and syncLookupFilterValues are enabled', function(assert) {
        // arrange, act
        const store = new ArrayStore([{ CustomerID: 0 }, { CustomerID: 1 }]);
        const lookupStore = new ArrayStore([{ value: 0, text: 'test1' }, { value: 1, text: 'test2' }]);
        const loadSpy = sinon.spy((loadOptions) => store.load(loadOptions));
        const lookupLoadSpy = sinon.spy((loadOptions) => lookupStore.load(loadOptions));

        createDataGrid({
            dataSource: {
                load: loadSpy,
                totalCount: () => 2,
            },
            columns: [{
                dataField: 'CustomerID',
                dataType: 'number',
                lookup: {
                    dataSource: {
                        load: lookupLoadSpy
                    },
                    valueExpr: 'value',
                    displayExpr: 'text'
                },
                filterValue: 0
            }],
            headerFilter: { visible: true },
            filterRow: { visible: true },
            filterSyncEnabled: true,
            syncLookupFilterValues: true,
            remoteOperations: true
        });

        this.clock.tick(100);

        // assert
        // first load - load all lookup data
        // second load - load data with filter
        // third load - load relevant lookup data
        assert.strictEqual(lookupLoadSpy.callCount, 1, 'lookup load count');
        assert.strictEqual(loadSpy.callCount, 2, 'load count');
    });
});
