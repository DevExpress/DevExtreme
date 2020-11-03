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
    // $(gridMarkup).appendTo('body');
});

import $ from 'jquery';
import { EdmLiteral } from 'data/odata/utils';
import commonUtils from 'core/utils/common';
import devices from 'core/devices';
import browser from 'core/utils/browser';
import ArrayStore from 'data/array_store';
import gridCoreUtils from 'ui/grid_core/ui.grid_core.utils';
import fx from 'animation/fx';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

const dataGridWrapper = new DataGridWrapper('#dataGrid');

if('chrome' in window && devices.real().deviceType !== 'desktop') {
    // Chrome DevTools device emulation
    // Erase differences in user agent stylesheet
    $('head').append($('<style>').text('input[type=date] { padding: 1px 0; }'));
}

fx.off = true;

QUnit.module('Initialization', baseModuleConfig, () => {
    QUnit.test('DataGrid - Should hide filter row menu after losing it\'s focus', function(assert) {
        // arrange
        const filterRowWrapper = dataGridWrapper.filterRow;

        createDataGrid({
            filterRow: { visible: true },
            dataSource: [{ field1: '1', field2: '2' }]
        });
        this.clock.tick();

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
        if(browser.msie && browser.version <= 11) {
            const event = document.createEvent('Event');
            event.initEvent('blur', true, true);
            $menu[0].dispatchEvent(event);
        } else {
            $menu.blur();
        }

        // assert
        assert.notOk(subMenu._isVisible(), 'submenu is hidden');
    });

    // T860356
    QUnit.test('Filter row\'s menu icons and text should have different colors', function(assert) {
        // arrange
        const filterRowWrapper = dataGridWrapper.filterRow;

        createDataGrid({
            filterRow: { visible: true },
            dataSource: [{ field1: '1' }]
        });
        this.clock.tick();

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

            assert.notEqual($currentItem.find('.dx-menu-item-text').css('color'), $currentItem.find('.dx-icon').css('color'), 'colors are different');
        }
    });

    // T837684
    QUnit.test('There are no exceptions when changing a filterValue to an array and selectedFilterOperation to \'between\' for date column', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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
        this.clock.tick();

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

        this.clock.tick();

        // act
        dataGrid.state({ pageIndex: 1, pageSize: 2, filterValue: ['id', '<>', 1] });
        this.clock.tick();

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

        this.clock.tick();

        const $input = $(dataGrid.$element()).find('.dx-editor-cell').first().find('.dx-texteditor-input');
        $input.focus().val('1').trigger('change');

        const selectionRangeArgs = [];

        const oldSetSelectionRange = gridCoreUtils.setSelectionRange;
        gridCoreUtils.setSelectionRange = function(element, range) {
            oldSetSelectionRange.apply(this, arguments);
            selectionRangeArgs.push([element, range]);
        };

        this.clock.tick();

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
                loadingTimeout: undefined,
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
            this.clock.tick();

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

        this.clock.tick();
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
                loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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

        assert.equal(calculateFilterExpressionCallCount, 6, 'calculateFilterExpression call count');
        assert.ok(grid.getCombinedFilter(), 'combined filter');
        assert.equal(calculateFilterExpressionCallCount, 7, 'calculateFilterExpression call count');
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
            loadingTimeout: undefined,
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
        this.clock.tick(100);

        dataGrid.expandRow(['group']);
        this.clock.tick(100);

        // act
        dataGrid.columnOption('type', 'filterValue', 1);
        this.clock.tick(100);

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
            loadingTimeout: undefined,
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
        this.clock.tick();

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
        this.clock.tick();

        // act
        const filterValue = 'test2';
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue }]);
        this.clock.tick();
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
        this.clock.tick();

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        const filterValue = 'test2';
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue }]);
        this.clock.tick();
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
        this.clock.tick();
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValue);

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, selectedFilterOperation: '<>' }]);
        this.clock.tick();
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
        this.clock.tick();
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
        this.clock.tick();
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
        this.clock.tick();
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValue, allowFiltering: false }]);
        this.clock.tick();
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
        this.clock.tick();
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
        this.clock.tick();
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
        this.clock.tick();

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues }]);
        this.clock.tick();
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
        this.clock.tick();

        // act
        dataGrid.option('filterPanel.visible', true); // causes reloading a data source
        const dataSource = dataGrid.getDataSource();

        // assert
        assert.ok(dataSource.isLoading(), 'dataSource is loading');

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues }]);
        this.clock.tick();
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
        this.clock.tick();
        let visibleRows = dataGrid.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 1, 'a single row is displayed');
        assert.equal(visibleRows[0].data.name, filterValues[0]);

        // act
        dataGrid.option('columns', ['id', { dataField: 'name', filterValues, filterType: 'exclude' }]);
        this.clock.tick();
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
        this.clock.tick();
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
        this.clock.tick();
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

        this.clock.tick();

        // act
        dataGrid.clearFilter();
        dataGrid.option('filterRow.visible', true);

        this.clock.tick();

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

        this.clock.tick(0);

        // act
        filter = ['field1', '=', 'test1'];
        dataGrid.option('filterValue', filter);

        // assert
        assert.deepEqual(dataGrid.option('filterValue'), filter, 'dataGrid\'s filter');

        // act
        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.option('filterValue'), undefined, 'dataGrid\'s filter');

        // act
        filter = ['field2', '=', 1];
        dataGrid.option('filterValue', filter);

        // assert
        assert.deepEqual(dataGrid.option('filterValue'), filter, 'dataGrid\'s filter');

        // act
        dataGrid.state(null);
        this.clock.tick(0);

        // assert
        assert.equal(dataGrid.option('filterValue'), undefined, 'dataGrid\'s filter');

        // act
        filter = [['field1', '=', 'test1'], 'and', ['field2', '=', 1]];
        dataGrid.option('filterValue', filter);

        // assert
        assert.deepEqual(dataGrid.option('filterValue'), filter, 'dataGrid\'s filter');

        // act
        dataGrid.state(null);
        this.clock.tick(0);

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
            loadingTimeout: undefined,
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

        this.clock.tick();

        dataGrid.pageIndex(5);
        this.clock.tick();

        // act
        dataGrid.filter(['id', '=', 666]);
        this.clock.tick();

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
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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
            this.clock.tick();
        } catch(e) {
            assert.ok(false, 'error was thrown');
        }

        const visibleRows = dataGrid.getVisibleRows();

        assert.equal(visibleRows.length, 1, 'one row is visible');
        assert.deepEqual(visibleRows[0].data, { text: 'text', num: 1 }, 'visible row\'s data');
    });

    QUnit.test('search editor have not been recreated when search text is changed', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
            onToolbarPreparing: function(e) {
                e.toolbarOptions.items.unshift({
                    location: 'before',
                    template: function() {
                        return $('<div>').dxDataGrid({
                            loadingTimeout: undefined,
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
            loadingTimeout: undefined,
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

        this.clock.tick();

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
        this.clock.tick();

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
        this.clock.tick();

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
            loadingTimeout: undefined,
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
});
