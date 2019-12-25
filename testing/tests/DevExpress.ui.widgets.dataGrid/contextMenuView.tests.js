import $ from 'jquery';

QUnit.testStart(function() {
    var markup =
'<div>\
        <div id="container"  class="dx-datagrid">\
            <table id="columnHeaders"><tr class="dx-row"><td></td><td></td></tr></table>\
            <table id="rows"><tr class="dx-row"><td></td><td></td></tr></table>\
        </div>\
        <div id="secondContainer"  class="dx-datagrid"></div>\
</div>';

    $('#qunit-fixture').html(markup);
});

import 'common.css!';

import 'ui/data_grid/ui.data_grid';

import dataGridMocks from '../../helpers/dataGridMocks.js';

var MockColumnsController = dataGridMocks.MockColumnsController,
    MockDataController = dataGridMocks.MockDataController,
    setupDataGridModules = dataGridMocks.setupDataGridModules;


QUnit.module('Context menu', {
    beforeEach: function() {
        this.element = function() {
            return $('#container');
        };
        var that = this;
        setupDataGridModules(this, ['contextMenu'], {
            initViews: true,
            views: {
                columnHeadersView: {
                    element: function() {
                        return $('#columnHeaders');
                    },
                    getRowIndex: function() {
                        return 0;
                    },
                    _getRows: function() {
                        return [{ rowType: 'header' }];
                    },
                    getColumns: function() {
                        return [{ dataField: 'field1' }, { dataField: 'field2' }];
                    },
                    getContextMenuItems: function($targetElement) {
                        return that.contextMenuItems1;
                    }
                },
                rowsView: {
                    element: function() {
                        return $('#rows');
                    },
                    getRowIndex: function() {
                        return 1;
                    },
                    _getRows: function() {
                        return [{ rowType: 'data', rowIndex: 0 }, { rowType: 'data', rowIndex: 1 }];
                    },
                    getColumns: function() {
                        return [{ dataField: 'field1' }, { dataField: 'field2' }];
                    },
                    getContextMenuItems: function($targetElement) {
                        return that.contextMenuItems2;
                    }
                }
            }
        });
    },
    afterEach: function() {
        this.dispose();
    }
});

QUnit.test('Render context menu', function(assert) {
    // arrange
    var testElement = $('#container');

    // act
    this.contextMenuView.render(testElement);

    // assert
    assert.ok(this.contextMenuView.element().dxContextMenu('instance')._initialized, 'dxContextMenu initialized');
    assert.ok(this.contextMenuView.element().dxContextMenu('instance').$element().parent().hasClass('dx-datagrid'), 'parent context menu');
    assert.ok(testElement.hasClass('dx-datagrid'), 'has class dx-datagrid');
});

QUnit.test('Show context menu with defined menu items', function(assert) {
    // arrange
    var that = this,
        contextMenuInstance,
        contextMenu = that.contextMenuView,
        testElement = $('#container');

    that.contextMenuItems1 = [
        { text: 'asc' },
        { text: 'desc' },
        { text: 'none' }
    ];

    // act
    contextMenu.render(testElement);
    $('#columnHeaders').children().trigger('contextmenu');
    contextMenuInstance = contextMenu.element().dxContextMenu('instance');

    // assert
    assert.ok(contextMenuInstance._overlay.$content().find('.dx-submenu').first().is(':visible'), 'visible context menu');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').first().text(), 'asc', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').eq(1).text(), 'desc', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').last().text(), 'none', 'text item');
});

QUnit.test('Not show context menu with undefined menu items', function(assert) {
    // arrange
    var that = this,
        contextMenuInstance,
        contextMenu = that.contextMenuView,
        testElement = $('#container');

    // act
    contextMenu.render(testElement);
    $('#columnHeaders').children().trigger('contextmenu');
    contextMenuInstance = contextMenu.element().dxContextMenu('instance');

    // assert
    assert.ok(!contextMenuInstance._overlay, 'not visible context menu');
});

QUnit.test('Show context menu when several views', function(assert) {
    // arrange
    var that = this,
        contextMenuInstance,
        contextMenu = that.contextMenuView,
        testElement = $('#container'),
        text,
        onItemClick = function() {
            text = this.text;
        };

    that.contextMenuItems1 = [
        { text: 'asc1', onItemClick: onItemClick },
        { text: 'desc1', onItemClick: onItemClick },
        { text: 'none1', onItemClick: onItemClick }
    ];

    that.contextMenuItems2 = [
        { text: 'asc2', onItemClick: onItemClick },
        { text: 'desc2', onItemClick: onItemClick },
        { text: 'none2', onItemClick: onItemClick }
    ];

    // act
    contextMenu.render(testElement);
    $('#columnHeaders').children().trigger('contextmenu');

    contextMenuInstance = contextMenu.element().dxContextMenu('instance');

    // assert
    assert.ok(contextMenuInstance._overlay.$content().find('.dx-submenu').first().is(':visible'), 'visible context menu');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').first().text(), 'asc1', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').eq(1).text(), 'desc1', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').last().text(), 'none1', 'text item');

    // act
    $(contextMenuInstance._overlay.$content().find('.dx-menu-item').first()).trigger('dxclick');

    // assert
    assert.strictEqual(text, 'asc1', 'first item text of first view');

    // act
    $('#rows').children().trigger('contextmenu');

    // assert
    assert.ok(contextMenuInstance._overlay.$content().find('.dx-submenu').first().is(':visible'), 'visible context menu');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').first().text(), 'asc2', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').eq(1).text(), 'desc2', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').last().text(), 'none2', 'text item');

    // act
    $(contextMenuInstance._overlay.$content().find('.dx-menu-item').first()).trigger('dxclick');

    // assert
    assert.strictEqual(text, 'asc2', 'first item text of first view');
});

QUnit.test('Datagrid save \'rtlEnabled\' class after contextMenu\'s invalidate', function(assert) {
    // arrange
    var rtlClass = 'dx-rtl',
        testElement = $('#secondContainer'),
        contextMenu = this.contextMenuView,
        instance;

    testElement.dxDataGrid({ rtlEnabled: true });

    // act
    contextMenu.render(testElement);
    testElement.trigger('contextmenu');
    instance = contextMenu.element().dxContextMenu('instance');

    // assert
    assert.ok(testElement.hasClass(rtlClass), 'first render - rtl is on');

    // act
    instance.option('items', [{ text: 'asc' }, { text: 'desc' }]);

    // assert
    assert.ok(testElement.hasClass(rtlClass), 'after invalidate on items change - rtl option save value');
});

QUnit.module('Context menu with rowsView', {
    beforeEach: function() {
        var that = this;

        that.element = function() {
            return $('#secondContainer');
        };

        that.items = [
            { data: { Column1: 'test1', Column2: 'test2' }, values: ['test1', 'test2'], rowType: 'data', dataIndex: 0 },
            { data: { Column1: 'test3', Column2: 'test4' }, values: ['test3', 'test4'], rowType: 'data', dataIndex: 1 },
            { data: { Column1: 'test5', Column2: 'test6' }, values: ['test5', 'test6'], rowType: 'data', dataIndex: 2 }
        ];

        that.columns = [{ dataField: 'Column1' }, { dataField: 'Column2' }];

        that.setupDataGrid = function() {
            setupDataGridModules(that, ['contextMenu', 'rows', 'masterDetail'], {
                initViews: true,
                controllers: {
                    columns: new MockColumnsController(that.columns),
                    data: new MockDataController({ items: that.items })
                }
            });
        };
    },
    afterEach: function() {
        this.dispose();
    }
});

QUnit.test('Context menu with option onContextMenuPreparing', function(assert) {
    // arrange
    var that = this,
        contextMenuInstance,
        contextMenuOptions,
        $testElement = $('#secondContainer');

    that.options = {
        onContextMenuPreparing: function(options) {
            if(options.target === 'content') {
                contextMenuOptions = options;
                options.items = [
                    { text: 'Test1' },
                    { text: 'Test2' },
                    { text: 'Test3' }
                ];
            }
        }
    };

    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.contextMenuView.render($testElement);

    // act
    $('#columnHeaders').children().trigger('contextmenu');

    contextMenuInstance = that.contextMenuView.element().dxContextMenu('instance');

    // assert
    assert.ok(!contextMenuInstance._overlay, 'not visible context menu');

    // act
    $($testElement.find('td').eq(3)).trigger('contextmenu');

    // assert
    assert.ok(contextMenuInstance._overlay.$content().find('.dx-submenu').first().is(':visible'), 'visible context menu');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').first().text(), 'Test1', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').eq(1).text(), 'Test2', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').last().text(), 'Test3', 'text item');
    assert.strictEqual(contextMenuOptions.rowIndex, 1, 'rowIndex');
    assert.strictEqual(contextMenuOptions.row.rowType, 'data', 'rowType');
    assert.strictEqual(contextMenuOptions.columnIndex, 1, 'columnIndex');
    assert.strictEqual(contextMenuOptions.column.dataField, 'Column2', 'dataField');
});

// T403458
QUnit.test('Context menu with option onContextMenuPreparing when no data and scrollbar', function(assert) {
    // arrange
    var that = this,
        $rowsViewElement,
        contextMenuInstance,
        $testElement = $('#secondContainer');

    that.options = {
        onContextMenuPreparing: function(options) {
            if(options.target === 'content') {
                options.items = [
                    { text: 'Test1' },
                    { text: 'Test2' },
                    { text: 'Test3' }
                ];
            }
        }
    };

    that.items = [];
    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.contextMenuView.render($testElement);

    // act
    $('#columnHeaders').children().trigger('contextmenu');

    contextMenuInstance = that.contextMenuView.element().dxContextMenu('instance');

    // assert
    $rowsViewElement = $testElement.find('.dx-datagrid-rowsview').first();
    assert.ok($rowsViewElement.length, 'has rows view');
    assert.ok(!$rowsViewElement.hasClass('dx-scrollable'), 'no scrollbar');
    assert.ok(!contextMenuInstance._overlay, 'not visible context menu');

    // act
    $($testElement.find('.dx-datagrid-rowsview').first()).trigger('contextmenu');

    // assert
    assert.ok(contextMenuInstance._overlay.$content().find('.dx-submenu').first().is(':visible'), 'visible context menu');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').first().text(), 'Test1', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').eq(1).text(), 'Test2', 'text item');
    assert.strictEqual(contextMenuInstance._overlay.$content().find('li').last().text(), 'Test3', 'text item');
});

QUnit.test('Context menu should not be shown without items', function(assert) {
    // arrange
    var that = this,
        contextMenuInstance,
        contextMenuItems = [{ text: 'test' }],
        $testElement = $('#secondContainer');

    that.options = {
        onContextMenuPreparing: function(options) {
            if(options.target === 'content') {
                options.items = contextMenuItems;
            }
        }
    };

    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.contextMenuView.render($testElement);

    contextMenuInstance = that.contextMenuView.element().dxContextMenu('instance');

    // act
    $($testElement.find('td').eq(3)).trigger('contextmenu');
    contextMenuInstance.hide();

    contextMenuItems = null;
    $($testElement.find('td').eq(3)).trigger('contextmenu');

    // assert
    assert.notOk(contextMenuInstance.option('visible'), 'visible context menu');
});

// T316422
QUnit.test('Context menu with option onContextMenuPreparing for group row', function(assert) {
    // arrange
    var that = this,
        contextMenuInstance,
        contextMenuPreparingArg,
        $testElement = $('#secondContainer');

    that.options = {
        onContextMenuPreparing: function(options) {
            if(options.target === 'content') {
                contextMenuPreparingArg = options;
                options.items = [{ text: 'test' }];
            }
        }
    };

    that.items = [{ rowType: 'group', groupIndex: 0, isExpanded: true, values: ['Test'] }, { rowType: 'data', values: [null, null] }];
    that.columns[0].groupIndex = 0;

    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.contextMenuView.render($testElement);

    // act
    $('#columnHeaders').children().trigger('contextmenu');

    contextMenuInstance = that.contextMenuView.element().dxContextMenu('instance');

    // assert
    assert.ok(!contextMenuInstance._overlay, 'not visible context menu');

    // act
    $($testElement.find('td').eq(1)).trigger('contextmenu');

    // assert
    assert.ok(contextMenuInstance._overlay.$content().find('.dx-submenu').first().is(':visible'), 'visible context menu');
    assert.strictEqual(contextMenuPreparingArg.rowIndex, 0, 'rowIndex');
    assert.strictEqual(contextMenuPreparingArg.row.rowType, 'group', 'rowType');
    assert.strictEqual(contextMenuPreparingArg.columnIndex, 1, 'columnIndex');
    assert.strictEqual(contextMenuPreparingArg.column.dataField, 'Column1', 'dataField');
});

QUnit.test('Context menu with option onContextMenuPreparing for detail row if template contains table (T813135)', function(assert) {
    // arrange
    var that = this,
        contextMenuPreparingArg,
        $testElement = $('#secondContainer');

    that.options = {
        onContextMenuPreparing: function(options) {
            if(options.target === 'content') {
                contextMenuPreparingArg = options;
            }
        },
        masterDetail: {
            template: function() {
                return $('<table><tr><td>1</td><td>2</td><td class=\'my-cell-3\'>3</td></tr></table>');
            }
        }
    };

    that.items = [
        { data: { Column1: 'test1' }, values: ['test1'], rowType: 'data', dataIndex: 0 },
        { data: { Column1: 'test1' }, values: ['test1'], rowType: 'detail', dataIndex: 0 },
    ];

    that.columns = [{ dataField: 'Column1' }];

    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.contextMenuView.render($testElement);

    // act
    $('.my-cell-3').trigger('contextmenu');

    // assert
    assert.ok(contextMenuPreparingArg, 'onContextMenuPreparing is called');
    assert.strictEqual(contextMenuPreparingArg.rowIndex, 1, 'rowIndex');
    assert.strictEqual(contextMenuPreparingArg.row.rowType, 'detail', 'rowType');
    assert.strictEqual(contextMenuPreparingArg.columnIndex, 0, 'columnIndex');
    assert.strictEqual(contextMenuPreparingArg.column.command, 'detail', 'column type');
});

// T827323
QUnit.test('Context menu should works if rowTemplate is defined', function(assert) {
    // arrange
    var that = this,
        contextMenuPreparingArg,
        $testElement = $('#secondContainer');

    that.options = {
        onContextMenuPreparing: function(options) {
            if(options.target === 'content') {
                contextMenuPreparingArg = options;
            }
        },
        rowTemplate: function(container, options) {
            var data = options.data;
            $(container).append('<tbody class=\'employee dx-row\'>' +
                '<tr class=\'main-row\'>' +
                    '<td class=\'click-me\'>CLICK ME</td>' +
                '</tr>' +
                '<tr class=\'notes-row\'>' +
                    '<td><div>' + data.id + '</div></td>' +
                '</tr>' +
            '</tbody>');
        }
    };

    that.items = [
        { data: { id: 1 }, values: [1], rowType: 'data', dataIndex: 0 },
        { data: { id: 2 }, values: [2], rowType: 'data', dataIndex: 1 },
    ];

    that.columns = [{ dataField: 'Column1' }];

    that.setupDataGrid();
    that.rowsView.render($testElement);
    that.contextMenuView.render($testElement);

    // act
    $('.click-me').eq(1).trigger('contextmenu');

    // assert
    assert.ok(contextMenuPreparingArg, 'onContextMenuPreparing is called');
    assert.strictEqual(contextMenuPreparingArg.rowIndex, 1, 'rowIndex');
    assert.strictEqual(contextMenuPreparingArg.row.rowType, 'data', 'rowType');
    assert.strictEqual(contextMenuPreparingArg.columnIndex, undefined, 'columnIndex');
});
