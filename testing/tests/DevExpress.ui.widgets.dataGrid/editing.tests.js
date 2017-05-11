"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop;

QUnit.testStart(function() {
    var markup =
'<style>\
    .qunit-fixture-static {\
        position: absolute !important;\
        left: 0 !important;\
        top: 0 !important;\
    }\
    .dx-scrollable-native-ios .dx-scrollable-content {\
        padding: 0 !important;\
    }\
</style>\
<div>\
    <div class="dx-datagrid">\
        <div id="container"></div>\
    </div>\
</div>';

    $("#qunit-fixture").html(markup);
});

require("common.css!");
require("generic_light.css!");

require("ui/data_grid/ui.data_grid");
require("ui/autocomplete");

var fx = require("animation/fx"),
    pointerMock = require("../../helpers/pointerMock.js"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    MockColumnsController = dataGridMocks.MockColumnsController,
    MockDataController = dataGridMocks.MockDataController,
    setupDataGridModules = dataGridMocks.setupDataGridModules,
    getCells = dataGridMocks.getCells,
    devices = require("core/devices"),
    device = devices.real(),
    browser = require("core/utils/browser");

function getInputElements($container) {
    return $container.find("input:not([type='hidden'])");
}

$('body').addClass('dx-viewport');

if(device.deviceType === "desktop" && browser.msie && parseInt(browser.version) <= 10) {
    QUnit.module('Editing in IE', {
        beforeEach: function() {
            var that = this;

            that.dataControllerOptions = {
                items: [
                { key: 'test1', data: { name: 'test1', id: 1, date: new Date(2001, 0, 1), isTested2: true, age: 12 }, values: ['test1', 1, new Date(2001, 0, 1), true, 12], rowType: 'data' },
                { key: 'test2', data: { name: 'test2', id: 2, date: new Date(2002, 1, 2), isTested2: false, age: 15 }, values: ['test2', 2, new Date(2002, 1, 2), false, 15], rowType: 'data' },
                { key: 'test3', data: { name: 'test3', id: 3, date: new Date(2003, 2, 3), isTested2: true, age: 13 }, values: ['test3', 3, new Date(2003, 2, 3), true, 13], rowType: 'data' }]
            };

            that.element = function() {
                return $(".dx-datagrid");
            };

            that.options = {
                columns: [
                    { dataField: 'name', allowEditing: true },
                    { dataField: 'id', dataType: 'number', allowEditing: true },
                    { dataField: 'date', dataType: 'date', allowEditing: true },
                    { dataField: 'isTested', dataType: "boolean", allowEditing: true },
                    { dataField: 'age', dataType: "number", allowEditing: true }],
                editing: {
                    allowUpdating: true,
                    mode: 'batch'
                }
            };

            that.setupOptions = {
                initViews: true,
                controllers: {
                    data: new MockDataController(that.dataControllerOptions)
                }
            };
            that.setupDataGrid = function() {
                setupDataGridModules(that, ['data', 'columns', 'rows', 'columnFixing', 'editing', 'editorFactory'], that.setupOptions);
            };
            that.clock = sinon.useFakeTimers();
            $("#qunit-fixture").addClass("qunit-fixture-static");
        },
        afterEach: function() {
            $("#qunit-fixture").removeClass("qunit-fixture-static");
            this.clock.restore();
            this.dispose();
        }
    });

    //T206032
    QUnit.test('Dropdown editor open popup when click on focus overlay in IE 10', function(assert) {
        //arrange
        var that = this,
            scrollToCallCount = 0,
            originalScrollTo = window.scrollTo,
            testElement = $('#container');

        that.setupDataGrid();

        window.scrollTo = function() {
            scrollToCallCount++;
        };

        that.rowsView.render(testElement);

        var $td = testElement.find('tbody > tr').first().find('td').eq(2);

        //edit
        $td.trigger('dxclick');

        var $dropDownEditor = testElement.find(".dx-dropdowneditor");

        //focus
        that.editorFactoryController.focus($dropDownEditor);
        that.clock.tick();

        var $focusOverlay = that.editorFactoryController._$focusOverlay;

        var $icon = testElement.find('.dx-dropdowneditor-icon');
        var boundingClientRect = $icon[0].getBoundingClientRect();

        //act
        $focusOverlay.trigger($.Event("dxclick", {
            clientX: boundingClientRect.left + 8,
            clientY: boundingClientRect.top + 8
        }));
        that.clock.tick();

        //assert
        assert.equal($(".dx-calendar").length, 1, 'calendar is shown');
        //T231642
        assert.equal(scrollToCallCount, 0, 'scrollTo is not called');
        window.scrollTo = originalScrollTo;
    });

    //T206032
    QUnit.test('Boolean editor when click on highlight outline in IE 10', function(assert) {
        //arrange
        var that = this,
            scrollX = window.pageXOffset || document.documentElement.scrollLeft,
            scrollY = window.pageYOffset || document.documentElement.scrollTop,
            testElement = $('#container');

        that.setupDataGrid();

        that.rowsView.render(testElement);

        var $td = testElement.find('tbody > tr').first().find('td').eq(3);

        var $checkbox = $td.find(".dx-checkbox");
        assert.equal($checkbox.length, 1, 'checkbox exists in cell');
        assert.equal($checkbox.dxCheckBox('option', 'value'), true, 'checkbox value is true');
        var $outline = $td.find('.dx-highlight-outline');

        var $icon = testElement.find('.dx-checkbox-icon');
        window.scrollTo($icon.offset().left, scrollY);
        var boundingClientRect = $icon[0].getBoundingClientRect();

        that.dataController.updateItems = noop;
        //act
        $outline.trigger($.Event("dxclick", {
            clientX: boundingClientRect.left + 5,
            clientY: boundingClientRect.top + 5,
        }));
        this.clock.tick();

        //assert
        assert.equal($checkbox.dxCheckBox('option', 'value'), false, 'checkbox value is false');
        window.scrollTo(scrollX, scrollY);
    });

    //T241970
    QUnit.test("Editing with fixed columns in IE", function(assert) {
        //arrange
        var that = this,
            scrollX = window.pageXOffset || document.documentElement.scrollLeft,
            scrollY = window.pageYOffset || document.documentElement.scrollTop,
            testElement = $('#container');

        that.options.columnFixing = {
            enabled: true
        };
        that.options.columns[0].fixed = true;

        that.setupDataGrid();

        that.rowsView.render(testElement);

        var $fixedCell = testElement.find(".dx-datagrid-content-fixed").find('tbody > tr').first().find('td').eq(1);
        var $td = testElement.find(".dx-datagrid-content:not(.dx-datagrid-content-fixed)").find('tbody > tr').first().find('td').eq(4);
        window.scrollTo($td.offset().left, scrollY);
        var boundingClientRect = $td[0].getBoundingClientRect();

        //act
        $fixedCell.trigger($.Event("dxclick", {
            clientX: boundingClientRect.left + 5,
            clientY: boundingClientRect.top + 5,
        }));
        that.clock.tick();

        $td = testElement.find(".dx-datagrid-content:not(.dx-datagrid-content-fixed)").find('tbody > tr').first().find('td').eq(4);

        //assert
        assert.ok($td.find("input").length, "has input in cell");
        window.scrollTo(scrollX, scrollY);
    });

    //T315857
    QUnit.test("Update the cell value after edit", function(assert) {
        //arrange
        var that = this,
            $input,
            testElement = $("#container");

        that.options.editing = {
            allowUpdating: true,
            mode: "batch"
        };
        that.options.dataSource = [
            { name: 'test1', id: 1, date: new Date(2001, 0, 1), isTested2: true, age: 12 },
            { name: 'test2', id: 2, date: new Date(2002, 1, 2), isTested2: false, age: 15 },
            { name: 'test3', id: 3, date: new Date(2003, 2, 3), isTested2: true, age: 13 }
        ];
        that.setupOptions = {
            initViews: true
        };
        that.setupDataGrid();
        that.rowsView.render(testElement);

        that.editCell(0, 0); //Edit

        //assert
        assert.equal(getInputElements(testElement.find("tbody > tr").first()).length, 1);

        //act
        $input = testElement.find("input").first();
        $input.val("Test");
        $input.trigger($.Event("change", { type: "keyup" }));
        $input.trigger("focusout");
        that.editCell(0, 1);
        that.clock.tick();

        //assert
        assert.ok(testElement.find("td").eq(0).hasClass("dx-cell-modified"), "cell is modified");
        assert.strictEqual(testElement.find("td").eq(0).text(), "Test", "text of the first cell");
    });
}


QUnit.module('Editing', {
    beforeEach: function() {
        this.dataControllerOptions = {
            items: [
            { key: 'test1', data: { name: 'test1', id: 1, date: new Date(2001, 0, 1), isTested: true, isTested2: true }, values: ['test1', 1, new Date(2001, 0, 1), true, true], rowType: 'data' },
            { key: 'test2', data: { name: 'test2', id: 2, date: new Date(2002, 1, 2), isTested: false, isTested2: false }, values: ['test2', 2, new Date(2002, 1, 2), false, false], rowType: 'data' },
            { key: 'test3', data: { name: 'test3', id: 3, date: new Date(2003, 2, 3), isTested: true, isTested2: true }, values: ['test3', 3, new Date(2003, 2, 3), true, true], rowType: 'data' }]
        };

        var defaultSetCellValue = function(data, value) {
            if(this.serializeValue) {
                value = this.serializeValue(value);
            }
            data[this.dataField] = value;
        };

        this.columns = [
            { allowEditing: true, dataField: 'name', defaultSetCellValue: defaultSetCellValue, setCellValue: defaultSetCellValue, dataType: 'string' },
            { allowEditing: true, dataField: 'id', defaultSetCellValue: defaultSetCellValue, setCellValue: defaultSetCellValue, dataType: 'number' },
            { allowEditing: true, dataField: 'date', defaultSetCellValue: defaultSetCellValue, setCellValue: defaultSetCellValue, dataType: 'date', format: 'shortDate', editorOptions: { pickerType: "calendar" } },
            { allowEditing: true, dataField: 'isTested', defaultSetCellValue: defaultSetCellValue, setCellValue: defaultSetCellValue, dataType: 'boolean', showEditorAlways: true },
            { allowEditing: false, dataField: 'isTested2', defaultSetCellValue: defaultSetCellValue, setCellValue: defaultSetCellValue, dataType: 'boolean', showEditorAlways: true },
            { allowEditing: true, calculateCellValue: function(data) { return data.customer && data.customer.name; }, defaultSetCellValue: defaultSetCellValue, setCellValue: function(data, value) { data.customer = { name: value }; }, dataType: 'string' },
            { command: 'edit' }
        ];

        setupDataGridModules(this, ['data', 'columns', 'headerPanel', 'rows', 'pager', 'editing', 'editorFactory', 'keyboardNavigation', 'virtualScrolling'], {
            initViews: true,
            options: { useKeyboard: true },
            controllers: {
                columns: new MockColumnsController(this.columns),
                data: new MockDataController(this.dataControllerOptions)
            }
        });
        this.clock = sinon.useFakeTimers();
        this.find = function($element, selector) {
            var $targetElement = $element.find(selector);
            QUnit.assert.equal($targetElement.length, 1, 'one element with selector ' + '"' + selector + '" found');
            return $targetElement;
        };
        this.click = function($element, selector) {
            var $targetElement = this.find($element, selector);
            $targetElement.trigger('dxclick');
            this.clock.tick();
        };
        this.keyboardNavigationController._focusedView = this.rowsView;
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test('editing with allowUpdating true', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: 'Edit'
        }
    };
    //act
    rowsView.render(testElement);

    //assert
    this.find(testElement.find('tbody > tr').first(), '.dx-link:contains(Edit)');
});

QUnit.test('no Edit link when editing with allowUpdating true and mode is batch', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    //act
    rowsView.render(testElement);

    //assert
    assert.equal(testElement.find('tbody > tr').first().find('a').length, 0);
});

QUnit.test('no Edit link when editing with allowUpdating true and mode is cell', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    //act
    rowsView.render(testElement);

    //assert
    assert.equal(testElement.find('tbody > tr').first().find('a').length, 0);
});

QUnit.test('editing with allowUpdating, allowAdding, allowDeleting false', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: false,
        allowAdding: false,
        allowDeleting: false
    };

    //act
    rowsView.render(testElement);

    //assert
    assert.ok(!testElement.find('tbody > tr').first().find('a').length);
});

QUnit.test('editing with allowDeleting true', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowDeleting: true,
        texts: {
            deleteRow: 'Delete'
        }
    };

    //act
    rowsView.render(testElement);

    //assert
    this.find(testElement.find('tbody > tr').first(), '.dx-link-delete');
});

QUnit.test('Header Panel when editing with allowAdding true', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        headerPanelElement,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        texts: {
            addRow: "Add New Item"
        }
    };

    //act
    headerPanel.render(testElement);
    rowsView.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //assert
    this.find(headerPanelElement, '.dx-icon-edit-button-addrow');
});

QUnit.test('Header Panel when editing with mode batch', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        headerPanelElement,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch',
        texts: {
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    //act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //assert
    var $button = this.find(headerPanelElement, '.dx-datagrid-save-button');
    assert.ok($button.closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'Save changes button disabled by default');

    $button = this.find(headerPanelElement, '.dx-datagrid-cancel-button');
    assert.ok($button.closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'Cancel changes button disabled by default');
});

QUnit.test("Toolbar menu hidden when click on edit button", function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        testElement = $('#container').width(80);

    that.options.editing = {
        allowUpdating: true,
        allowAdding: true,
        mode: "batch",
        texts: {
            addRow: "Add row",
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    //act
    headerPanel.render(testElement);
    rowsView.render(testElement);

    $(".dx-toolbar-menu-container .dx-button").trigger("dxclick");
    that.clock.tick(300);

    //assert
    var $toolbarMenu = $(".dx-dropdownmenu-popup-wrapper");
    assert.ok($toolbarMenu.length, "Toolbar menu shown");

    $(".dx-edit-button").first().trigger("dxclick");
    that.clock.tick(300);

    $toolbarMenu = $(".dx-dropdownmenu-popup-wrapper");
    assert.ok(!$toolbarMenu.length, "Toolbar menu hidden");
});

QUnit.test('Header Panel when editing with mode "cell"', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        headerPanelElement,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    //act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //assert
    var $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok(!$button.length, 'There is no save button');

    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok(!$button.length, 'There is no cancel button');
});

//T112623
QUnit.test('Header Panel when allowUpdating false, allowAdding true, allowDeleting true and mode batch', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        headerPanelElement,
        $button,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        allowDeleting: true,
        allowUpdating: false,
        mode: 'batch',
        texts: {
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    //act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //assert
    $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok($button.length, 'has save changes button');
    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok($button.length, 'has cancel changes button');
});

//T112623
QUnit.test('Header Panel when allowUpdating false, allowAdding false, allowDeleting true and mode batch', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        headerPanelElement,
        $button,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: false,
        allowDeleting: true,
        allowUpdating: false,
        mode: 'batch',
        texts: {
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    //act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //assert
    $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok($button.length, 'has save changes button');
    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok($button.length, 'has cancel changes button');
});

//T112623
QUnit.test('Header Panel when allowUpdating false, allowAdding true, allowDeleting false and mode batch', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        headerPanelElement,
        $button,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        allowDeleting: false,
        allowUpdating: false,
        mode: 'batch',
        texts: {
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    //act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //assert
    $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok($button.length, 'has save changes button');
    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok($button.length, 'has cancel changes button');
});

//T112623
QUnit.test('Header Panel when allowUpdating false, allowAdding false, allowDeleting false and mode batch', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        headerPanelElement,
        $button,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: false,
        allowDeleting: false,
        allowUpdating: false,
        mode: 'batch',
        texts: {
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    //act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //assert
    $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok(!$button.length, 'not has save changes button');
    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok(!$button.length, 'not has cancel changes button');
});

QUnit.test('Save changes button click call saveEditData', function(assert) {
    //arrange
    var headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        headerPanelElement,
        saveEditDataCallCount = 0,
        testElement = $('#container');

    this.options.editing = {
        allowUpdating: true,
        mode: 'batch',
        texts: {
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    assert.ok(this.editingController.hasChanges);
    this.editingController.hasChanges = function() {
        return true;
    };
    assert.ok(this.editingController.saveEditData);
    this.editingController.saveEditData = function() {
        saveEditDataCallCount++;
    };

    headerPanel.render(testElement);
    rowsView.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //act
    testElement.find(".dx-datagrid-save-button").trigger("dxclick");
    this.clock.tick(1000);
    //assert
    assert.equal(saveEditDataCallCount, 1, 'saveEditData called');
});

QUnit.test('Cancel changes button click call cancelEditData', function(assert) {
    //arrange
    var headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        headerPanelElement,
        cancelEditDataCallCount = 0,
        testElement = $('#container');

    this.options.editing = {
        allowUpdating: true,
        mode: 'batch',
        texts: {
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    assert.ok(this.editingController.hasChanges);
    this.editingController.hasChanges = function() {
        return true;
    };
    assert.ok(this.editingController.cancelEditData);
    this.editingController.cancelEditData = function() {
        cancelEditDataCallCount++;
    };

    headerPanel.render(testElement);
    rowsView.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //act
    this.click(headerPanelElement, '.dx-datagrid-cancel-button');

    //assert
    assert.equal(cancelEditDataCallCount, 1, 'cancelEditData called');
});

QUnit.test('Edit Row', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        editRowCallCount = 0,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: "Edit"
        }
    };

    var editRow = that.editingController.editRow;
    that.editingController.editRow = function() {
        editRow.apply(this, arguments);
        editRowCallCount++;
    };
    that.focus = function(element) {
        that.keyboardNavigationController.focus(element);
    };

    rowsView.render(testElement);

    //act
    this.click(testElement.find('tbody > tr').first(), '.dx-link:contains(Edit)');
    this.clock.tick();

    //assert
    assert.equal(editRowCallCount, 1);
    assert.ok(getInputElements(testElement.find('tbody > tr').first()).length);
    assert.deepEqual(that.keyboardNavigationController._focusedCellPosition,
        {
            columnIndex: 0,
            rowIndex: 0
        },
        "focus position"
    );
});

QUnit.test('Edit Row and focus not first input', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: "Edit"
        }
    };
    that.keyboardNavigationController._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };

    rowsView.render(testElement);

    //act
    this.click(testElement.find('tbody > tr').first(), '.dx-link:contains(Edit)');
    this.clock.tick();

    //assert
    assert.ok(getInputElements(testElement.find('tbody > tr').first()).length);
    assert.deepEqual(that.keyboardNavigationController._focusedCellPosition,
        {
            columnIndex: 1,
            rowIndex: 0
        },
        "focus position"
    );
});

QUnit.test('onRowClick not handled when click on Edit link', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        editRowCallCount = 0,
        rowClickCallCount = 0,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: "Edit"
        }
    };
    that.options.onRowClick = function() {
        rowClickCallCount++;
    };
    that.rowsView.optionChanged({ name: 'onRowClick' });

    that.editingController.editRow = function() {
        editRowCallCount++;
    };

    rowsView.render(testElement);

    //act
    this.click(testElement.find('tbody > tr').first(), 'td:last-child');

    //assert
    assert.strictEqual(rowClickCallCount, 1, 'onRowClick handled');

    //act
    this.click(testElement.find('tbody > tr').first(), '.dx-link:contains(Edit)');

    //assert
    assert.strictEqual(editRowCallCount, 1, 'editRow called');
    assert.strictEqual(rowClickCallCount, 1, 'onRowClick not handled');
});

QUnit.test('isEditCell', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch',
        allowUpdating: true
    };

    rowsView.render(testElement);

    //act
    testElement.find('td').first().trigger('dxclick'); // Edit cell

    //assert
    assert.ok(that.editingController.isEditCell(0, 0), 'edit cell');
    assert.ok(!that.editingController.isEditCell(0, 1), 'not edit cell');
    assert.ok(!that.editingController.isEditCell(0, 2), 'not edit cell');
    assert.ok(!that.editingController.isEditCell(1, 0), 'not edit cell');
    assert.ok(!that.editingController.isEditCell(1, 1), 'not edit cell');
    assert.ok(!that.editingController.isEditCell(1, 2), 'not edit cell');
    assert.ok(!that.editingController.isEditCell(2, 0), 'not edit cell');
    assert.ok(!that.editingController.isEditCell(2, 1), 'not edit cell');
    assert.ok(!that.editingController.isEditCell(2, 2), 'not edit cell');
});

QUnit.test('Edit Cell when row mode do not work on cell click', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        editCellCallCount = 0,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true
    };

    var editCell = that.editingController.editCell;
    that.editingController.editCell = function() {
        editCellCallCount++;
        return editCell.apply(this, arguments);
    };

    rowsView.render(testElement);

    //act
    testElement.find('td').first().trigger('dxclick');

    //assert
    assert.equal(editCellCallCount, 1);
    assert.equal(getInputElements(testElement).length, 0);
});

QUnit.test('Edit Cell when batch mode on cell click', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        editCellCallCount = 0,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    var editCell = that.editingController.editCell;
    that.editingController.editCell = function() {
        editCellCallCount++;
        return editCell.apply(this, arguments);
    };

    rowsView.render(testElement);

    //act
    testElement.find('td').first().trigger('dxclick');

    //assert
    assert.equal(editCellCallCount, 1);
    assert.equal(getInputElements(testElement).length, 1);
    assert.equal(testElement.find('td').first().find('input').length, 1);
});

QUnit.test('Edit cell on row click when a table is contained inside a cell', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testRowIndex,
        testColumnIndex,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    that.editingController.editCell = function(rowIndex, columnIndex) {
        testColumnIndex = columnIndex;
        testRowIndex = rowIndex;
    };

    rowsView.render(testElement);

    testElement
        .find(".dx-row:first-child td")
        .eq(1)
        .append($('<table><tr><td><div class="txt"></div></td><td><div class="btn"></div></td></tr></table>'));

    //act
    this.rowsView._rowClick({
        rowIndex: 0,
        jQueryEvent: {
            target: testElement.find(".txt").first()
        }
    });

    //assert
    assert.equal(testColumnIndex, 1, "column index");
    assert.equal(testRowIndex, 0, "row index");
});

//T261231
QUnit.test('Edit Cell when batch mode by API call for readonly cell', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    that.columns[0].allowEditing = false;

    rowsView.render(testElement);

    //act
    that.editCell(0, 0);

    //assert
    assert.equal(getInputElements(testElement).length, 1);
    assert.equal(testElement.find('td').first().find('input').length, 1);

    //act
    this.clock.tick();
    testElement.find('td').first().find('input').trigger("dxclick");
    this.clock.tick();

    //assert
    assert.equal(getInputElements(testElement).length, 1, "editor is not closed");
    assert.equal(testElement.find('td').first().find('input').length, 1, "editor is not closed");
});

QUnit.test('batch mode - correct render boolean cell and functionality on cell click (showEditorAlways)', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        $boolCell;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    that.element = function() {
        return testElement;
    };

    rowsView.render(testElement);

    //act
    $boolCell = testElement.find('td').eq(3);

    //assert
    assert.ok(!$boolCell.hasClass("dx-datagrid-readonly"));
    assert.ok(!$boolCell.hasClass("dx-cell-focus-disabled"), "Cell with boolean editor do not have focus-disabled class");
    //T163474
    assert.ok(!$boolCell.find(".dx-state-readonly").length);

    //act
    $boolCell.trigger('dxclick');
    that.clock.tick();
    $boolCell = testElement.find('td').eq(3);
    //assert
    assert.ok(!$boolCell.hasClass("dx-datagrid-readonly"));
    //T163474
    assert.ok(!$boolCell.find(".dx-state-readonly").length);
});

QUnit.test('batch mode - correct render boolean cell when cancel onEditingStart (showEditorAlways)', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        $boolCell,
        editingStartCount = 0;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    that.options.onEditingStart = function(e) {
        editingStartCount++;
        if(e.key === "test1" && e.column.dataField === "isTested") {
            e.cancel = true;
        }
    };
    that.editingController.optionChanged({ name: "onEditingStart" });

    that.element = function() {
        return testElement;
    };

    rowsView.render(testElement);

    //act
    $boolCell = testElement.find('td').eq(3);

    //assert
    assert.equal(editingStartCount, 3, "onEditingStart call count");
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"));
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "Cell with boolean editor do have focus-disabled class");
    assert.equal($boolCell.find(".dx-state-readonly").length, 1);
});

QUnit.test('batch mode - correct render boolean cell with allowEditing is false', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        $boolCell;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);

    //act
    $boolCell = testElement.find('td').eq(4);

    //assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"), "readonly");
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "boolean editor do not focus on click");
    assert.ok($boolCell.find(".dx-checkbox-checked").length, "checkbox checked");

    //act
    $boolCell.trigger('dxclick');
    $boolCell = testElement.find('td').eq(4);

    //assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"), "readonly");
    assert.ok($boolCell.find(".dx-checkbox-checked").length, "checkbox checked");
});

QUnit.test('row mode - correct render boolean cell and functionality (showEditorAlways)', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: "Edit",
            saveRowChanges: "Save"
        }
    };

    rowsView.render(testElement);

    var $boolCell = testElement.find('td').eq(3);

    //assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"));
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "Cell with boolean editor has focus-disabled class");

    //T163474
    assert.ok($boolCell.find(".dx-state-readonly").length);

    //act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');
    $boolCell = testElement.find('td').eq(3);

    //assert
    assert.ok(!$boolCell.hasClass("dx-datagrid-readonly"));
    assert.ok(!$boolCell.hasClass("dx-cell-focus-disabled"), "Cell with boolean editor in edit row do not have focus-disabled class");

    assert.ok(!$boolCell.find('.dx-widget.dx-state-disabled').length);
    //T163474
    assert.ok(!$boolCell.find(".dx-state-readonly").length);
});

QUnit.test('row mode - correct render editor cell and functionality (showEditorAlways)', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.columns[0].showEditorAlways = true;
    that.columnsController = new MockColumnsController(that.columns);

    that.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: "Edit",
            saveRowChanges: "Save"
        }
    };

    rowsView.render(testElement);

    var $editorCell = testElement.find('td').first();

    //assert
    assert.ok($editorCell.hasClass("dx-datagrid-readonly"));
    assert.ok($editorCell.hasClass("dx-cell-focus-disabled"), "editor do not focus on click");

    //T163474
    assert.ok($editorCell.find(".dx-state-readonly").length);

    //act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');
    $editorCell = testElement.find('td').first();

    //assert
    assert.ok(!$editorCell.hasClass("dx-datagrid-readonly"));
    assert.ok(!$editorCell.hasClass("dx-cell-focus-disabled"), "editor can be focused on click");

    assert.ok(!$editorCell.find('.dx-widget.dx-state-disabled').length);
    //T163474
    assert.ok(!$editorCell.find(".dx-state-readonly").length);
});

QUnit.test('row mode - correct render boolean cell with allowEditing is false', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        $boolCell;

    that.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: "Edit",
            saveRowChanges: "Save"
        }
    };

    rowsView.render(testElement);

    //act
    $boolCell = testElement.find('td').eq(4);

    //assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"), "readonly");
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "boolean editor do not focus on click");
    assert.ok($boolCell.find(".dx-checkbox-checked").length, "checkbox checked");

    //act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');
    $boolCell = testElement.find('td').eq(4);
    $boolCell.trigger('dxclick');

    //assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"), "readonly");
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "boolean editor do not focus on click");
    assert.ok($boolCell.find(".dx-checkbox-checked").length, "checkbox checked");
});

QUnit.test("Enable readOnly for editor", function(assert) {
    //arrange
    var options = {
            column: {
                showEditorAlways: true
            },
            rowType: "data"
        },
        template = this.editingController.getColumnTemplate(options),
        $container = $("<div>");

    //act
    template($container, options);

    //assert
    assert.ok($container.children().eq(0).dxTextBox("instance").option("readOnly"));
});

//T124946
QUnit.test('Api method editCell when allowUpdating false', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: false,
        mode: 'batch'
    };

    rowsView.render(testElement);

    //act
    that.editingController.editCell(0, 0);

    //assert
    assert.equal(getInputElements(testElement).length, 1);
    assert.equal(testElement.find('td').first().find('input').length, 1);
});

//T310531
QUnit.test('Api method editCell with column by dataField', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch'
    };

    rowsView.render(testElement);

    //act
    that.editingController.editCell(0, "id");

    //assert
    assert.equal(getInputElements(testElement).length, 1);
    assert.equal(getInputElements(testElement.find('td').eq(1)).length, 1);
});

//T310531
QUnit.test('Api method editCell with column by wrong dataField', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch'
    };

    rowsView.render(testElement);

    //act
    that.editingController.editCell(0, "unknown");

    //assert
    assert.equal(getInputElements(testElement).length, 0);
});


//T124946
QUnit.test('Api method editCell with button', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        $input = $("<input/>", {
            type: "button",
            click: function(e) {
                that.editingController.editCell(0, 0);
            }
        }).appendTo(testElement);

    that.options.editing = {
        allowUpdating: false,
        mode: 'batch'
    };

    rowsView.render(testElement);

    //act
    $input.trigger("click");

    //assert
    assert.equal(getInputElements(testElement).length, 2);
    assert.equal(testElement.find('td').first().find('input').length, 1);
});

//T113719
QUnit.test('Edit Cell with editCellTemplate when batch mode on cell click', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.columns[0].editCellTemplate = function(container, options) {
        $("<div>").dxAutocomplete({
            items: ["test1", "test2", "test3"],
            value: options.value,
            onValueChanged: function(e) {
                options.setValue(e.value);
            }
        }).appendTo(container);
    };
    that.columns[0].alignment = "right";

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);

    //act
    testElement.find('td').first().trigger('dxclick');

    //assert
    assert.equal(getInputElements(testElement).length, 1, 'created 1 editor only');
    assert.equal(testElement.find('td').first().find('input').length, 1, 'editor created in first td');
    assert.equal(testElement.find('td').first().find('input').css('text-align'), "right", 'editor input has right alignment');
    assert.equal(testElement.find('td').first().find('.dx-autocomplete').length, 1, 'autocomplete widget created');
    assert.ok(testElement.find('td').hasClass("dx-editor-cell"), 'dx-editor-cell class added');
});

QUnit.test('Remove Row without message', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        removeKey,
        testElement = $('#container');

    that.options.editing = {
        allowDeleting: true,
        texts: {
            deleteRow: "Delete",
            confirmDeleteMessage: null
        }
    };
    that.dataControllerOptions.store = {
        remove: function(key) {
            removeKey = key;
            return $.Deferred().resolve(key);
        }
    };

    rowsView.render(testElement);

    assert.ok(!this.dataController.refreshed, 'not refreshed data');
    //act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)');

    //assert
    assert.strictEqual(removeKey, 'test1', 'removeKey');
    assert.ok(this.dataController.refreshed, 'refreshed data');
});

QUnit.test('Remove row when batch editing', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        removeKey,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch',
        allowDeleting: true,
        texts: {
            deleteRow: "Delete",
            undeleteRow: "Undelete",
            confirmDeleteMessage: "TestMessage"
        }
    };
    that.dataControllerOptions.store = {
        remove: function(key) {
            removeKey = key;
            return $.Deferred().resolve(key);
        }
    };

    rowsView.render(testElement);

    assert.ok(!this.dataController.refreshed, 'not refreshed data');
    //act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)');
    this.editingController.saveEditData();

    //assert
    assert.strictEqual(removeKey, 'test1', 'removeKey');
    assert.ok(this.dataController.refreshed, 'refreshed data');
});

QUnit.test('Remove row with message', function(assert) {
    fx.off = true;
    try {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            removeKey,
            testElement = $('#container'),
            body = $('body');

        that.options.editing = {
            allowDeleting: true,
            texts: {
                deleteRow: "Delete",
                confirmDeleteMessage: "TestMessage",
                confirmDeleteTitle: "TestTitle"
            }
        };
        that.dataControllerOptions.store = {
            remove: function(key) {
                removeKey = key;
                return $.Deferred().resolve(key);
            }
        };

        rowsView.render(testElement);

        //assert
        assert.ok(!this.dataController.refreshed, 'not refreshed data');

        //act
        this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)'); //show confirm

        //assert
        assert.ok(body.find('.dx-dialog').length, 'has dialog');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-popup-title').first().text(), 'TestTitle', 'confirm title');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-dialog-message').first().text(), 'TestMessage', 'confirm message');


        //act
        //this.clock.tick(5000);
        body.find('.dx-dialog').first().find('.dx-dialog-button').first().trigger('dxclick'); // delete

        //assert
        assert.ok(!body.find('.dx-dialog').length, 'not has dialog');
        assert.strictEqual(removeKey, 'test1', 'removeKey');
        assert.ok(this.dataController.refreshed, 'refreshed data');
    } finally {
        fx.off = false;
    }
});

QUnit.test('Remove row with message ("cell" edit mode)', function(assert) {
    fx.off = true;
    try {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            removeKey,
            testElement = $('#container'),
            body = $('body');

        that.options.editing = {
            allowDeleting: true,
            mode: "cell",
            texts: {
                deleteRow: "Delete",
                confirmDeleteMessage: "TestMessage",
                confirmDeleteTitle: "TestTitle"
            }
        };
        that.dataControllerOptions.store = {
            remove: function(key) {
                removeKey = key;
                return $.Deferred().resolve(key);
            }
        };

        rowsView.render(testElement);

        //assert
        assert.ok(!this.dataController.refreshed, 'not refreshed data');

        //act
        this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)'); //show confirm

        //assert
        assert.ok(body.find('.dx-dialog').length, 'has dialog');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-popup-title').first().text(), 'TestTitle', 'confirm title');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-dialog-message').first().text(), 'TestMessage', 'confirm message');

        //act
        body.find('.dx-dialog').first().find('.dx-dialog-button').first().trigger('dxclick'); // delete

        //assert
        assert.ok(!body.find('.dx-dialog').length, 'not has dialog');
        assert.strictEqual(removeKey, 'test1', 'removeKey');
        assert.ok(this.dataController.refreshed, 'refreshed data');
    } finally {
        fx.off = false;
    }
});

QUnit.test('Not remove row with message', function(assert) {
    fx.off = true;
    try {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            removeKey,
            testElement = $('#container'),
            body = $('body').addClass('dx-viewport');

        that.options.editing = {
            allowDeleting: true,
            texts: {
                confirmDeleteMessage: "TestMessage",
                confirmDeleteTitle: "TestTitle"
            }
        };
        that.dataControllerOptions.store = {
            remove: function(key) {
                removeKey = key;
                return $.Deferred().resolve(key);
            }
        };

        rowsView.render(testElement);

        //assert
        assert.ok(!this.dataController.refreshed, 'not refreshed data');

        //act
        testElement.find('tbody > tr').first().find('a').trigger('dxclick'); //show confirm
        this.clock.tick();

        //assert
        assert.ok(body.find('.dx-dialog').length, 'has dialog');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-popup-title').first().text(), 'TestTitle', 'confirm title');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-dialog-message').first().text(), 'TestMessage', 'confirm message');

        //act
        body.find('.dx-dialog').first().find('.dx-dialog-button').last().trigger('dxclick'); // delete

        //assert
        assert.ok(!body.find('.dx-dialog').length, 'not has dialog');
        assert.ok(!removeKey, 'removeKey');
        assert.ok(!this.dataController.refreshed, 'not refreshed data');
    } finally {
        fx.off = false;
    }
});

QUnit.test('Save Row', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        updateArgs,
        cells;

    that.options.editing = {
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save",
            editRow: "Edit"
        }
    };

    that.dataControllerOptions.store = {
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');

    var changedCount = 0;
    that.dataController.changed.add(function() {
        changedCount++;
    });

    testElement.find('input').first().val('Test update row');
    testElement.find('input').first().trigger('change');
    assert.strictEqual(changedCount, 0, "changed is not called");

    //act
    this.click(testElement.find('tbody > tr').first(), '.dx-link-save');
    cells = getCells(testElement);

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.deepEqual(updateArgs, ['test1', { "name": "Test update row" }]);
});

QUnit.test('Save Row for calculated column', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        updateArgs,
        cells;

    that.options.editing = {
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save",
            editRow: "Edit"
        }
    };

    that.dataControllerOptions.store = {
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');

    testElement.find('tbody > tr').first().find('input').last().val('Test name');
    testElement.find('tbody > tr').first().find('input').last().trigger('change');

    //act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Save)');
    cells = getCells(testElement);

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.deepEqual(updateArgs, ['test1', { customer: { name: "Test name" } }]);
});

//T174245
QUnit.test("Save row without changes data", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true
    };

    rowsView.render(testElement);

    //act
    that.editRow(0);

    //assert
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-edit-row"), "has edit row");
    assert.ok(getInputElements(testElement.find('tbody > tr').first()).length, "has input");

    //act
    that.saveEditData();

    //assert
    assert.ok(!testElement.find('tbody > tr').first().hasClass("dx-edit-row"), "not has edit row");
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0, "not has input");
});

QUnit.test('Serialize value before saving', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        updateArgs,
        serializingValue,
        cells;

    that.options.editing = {
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save",
            editRow: "Edit"
        }
    };

    that.columns[0].serializeValue = function(value) {
        serializingValue = value;
        return value + " serialized";
    };

    that.dataControllerOptions.store = {
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');

    testElement.find('input').first().val('Test update row');
    testElement.find('input').first().trigger('change');

    //act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Save)');
    cells = getCells(testElement);

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.equal(serializingValue, "Test update row");
    assert.deepEqual(updateArgs, ['test1', { "name": "Test update row serialized" }]);
});

QUnit.test('Cancel Editing Row when row mode', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        texts: {
            cancelRowChanges: "Cancel",
            editRow: "Edit"
        }
    };

    rowsView.render(testElement);

    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');

    //act
    assert.ok(getInputElements(testElement.find('tbody > tr').first()).length);
    this.click(testElement.find('tbody > tr').first(), '.dx-link-cancel');

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
});

QUnit.test('Close Editing Cell when batch mode on click outside dataGrid', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch',
        texts: {
            editRow: "Edit"
        }
    };

    that.dataControllerOptions.store = {
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    testElement.find('td').first().trigger('dxclick'); //Edit
    this.clock.tick();

    //act
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);
    testElement.find('input').first().val('Test update cell');
    testElement.find('input').first().trigger('change');

    //act
    $(document).trigger('dxclick');
    this.clock.tick();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.ok(!updateArgs, 'no update');

    this.editingController.saveEditData();

    assert.deepEqual(updateArgs, ['test1', { "name": "Test update cell" }]);
});

//T113152
QUnit.test('Not close Editing Cell in batch mode on click editor popup', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);
    testElement.find('tbody > tr').first().find('td').eq(2).trigger('dxclick'); //Edit

    var $calendarIcon = testElement.find('.dx-dropdowneditor-icon');
    assert.equal($calendarIcon.length, 1, 'calendar icons count');
    $calendarIcon.trigger('dxclick');

    var $calendar = $(".dx-calendar");
    assert.equal($calendar.length, 1, 'popup calendar count');

    //act
    this.clock.tick();
    $calendar.trigger('dxclick');
    this.clock.tick();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, 'editor count');
    assert.equal($(".dx-calendar").length, 1, 'popup calendar count');
});

//T318313
QUnit.test('Close Editing Cell when grid in popup', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        $popupContent,
        popupInstance = $("<div/>").appendTo($('#container')).dxPopup({
            contentTemplate: function($contentElement) {
                rowsView.render($("<div/>").appendTo($contentElement));
            }
        }).data("dxPopup");

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    popupInstance.show();
    $popupContent = popupInstance.overlayContent();
    $popupContent.find("td").first().trigger("dxclick");
    that.clock.tick();

    //assert
    assert.equal(getInputElements($popupContent).length, 1, "has input");

    //act
    $popupContent.trigger("dxclick");
    that.clock.tick();

    //assert
    assert.equal(getInputElements($popupContent).length, 0, "not has input");
});

//T213164
QUnit.test('Not close Editing Cell in batch mode on click detached element', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);
    testElement.find('tbody > tr').first().find('td').eq(2).trigger('dxclick'); //Edit

    var $calendarIcon = testElement.find('.dx-dropdowneditor-icon');
    assert.equal($calendarIcon.length, 1, 'calendar icons count');
    $calendarIcon.trigger('dxclick');

    var $calendar = $(".dx-calendar");
    assert.equal($calendar.length, 1, 'popup calendar count');

    var $otherMonthDay = $calendar.find(".dx-calendar-other-month").first();
    assert.equal($otherMonthDay.length, 1, 'over month day element');

    //act
    this.clock.tick();
    $otherMonthDay.trigger('dxclick');
    this.clock.tick();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, 'editor count');
    assert.equal(testElement.find('.dx-datebox').length, 1, 'datebox count');
});

if(!device.win) {
    //T110581
    QUnit.testInActiveWindow('Not close Editing Cell in batch mode on click focus overlay', function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.editing = {
            allowUpdating: true,
            mode: 'batch'
        };

        rowsView.render(testElement);
        that.element = function() {
            return testElement;
        };
        testElement.find('tbody > tr').first().find('td').eq(2).trigger('dxclick'); //Edit

        this.clock.tick();
        var $focusOverlay = testElement.find('.dx-datagrid-focus-overlay');
        assert.equal($focusOverlay.length, 1, 'focus overlay count');

        //act
        $focusOverlay.trigger('dxclick');
        this.clock.tick();

        //assert
        assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, 'editor count');
        assert.equal($(".dx-datagrid-focus-overlay").length, 1, 'focus overlay count');
    });
}

QUnit.test('Save changes when batch mode', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs = [],
        removeKeys = [],
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        allowDeleting: true,
        mode: 'batch',
        texts: {
            editRow: "Edit",
            deleteRow: "Delete"
        }
    };

    that.dataControllerOptions.store = {
        update: function(key, values) {
            updateArgs.push([key, values]);
            return $.Deferred().resolve(key, values);
        },
        remove: function(key) {
            removeKeys.push(key);
            return $.Deferred().resolve(key);
        }
    };

    rowsView.render(testElement);

    //act
    testElement.find('td').eq(0).trigger('dxclick'); //Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1);
    getInputElements(testElement).eq(0).val('Test1');
    getInputElements(testElement).eq(0).trigger('change');

    testElement.find('tbody > tr').eq(1).find('td').eq(0).trigger('dxclick'); //Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(1)).length, 1);
    getInputElements(testElement).eq(0).val('Test2');
    getInputElements(testElement).eq(0).trigger('change');

    this.click(testElement.find('tbody > tr').eq(2), 'a:contains(Delete)');

    //act
    this.editingController.saveEditData();

    //assert
    assert.deepEqual(updateArgs, [['test1', { "name": "Test1" }], ['test2', { "name": "Test2" }]]);
    assert.deepEqual(removeKeys, ['test3']);
});

QUnit.test('Cancel changes when batch mode', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs = [],
        removeKeys = [],
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        allowDeleting: true,
        mode: 'batch',
        texts: {
            editRow: "Edit",
            deleteRow: "Delete"
        }
    };

    that.dataControllerOptions.store = {
        update: function(key, values) {
            updateArgs.push([key, values]);
            return $.Deferred().resolve(key, values);
        },
        remove: function(key) {
            removeKeys.push(key);
            return $.Deferred().resolve(key);
        }
    };

    rowsView.render(testElement);

    //act
    testElement.find('td').eq(0).trigger('dxclick'); //Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1);
    testElement.find('input').eq(0).val('Test1');
    testElement.find('input').eq(0).trigger('change');

    testElement.find('tbody > tr').eq(1).find('td').eq(0).trigger('dxclick'); //Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(1)).length, 1);
    testElement.find('input').eq(0).val('Test2');
    testElement.find('input').eq(0).trigger('change');

    this.click(testElement.find('tbody > tr').eq(2), 'a:contains(Delete)');

    //act
    this.editingController.cancelEditData();
    this.editingController.saveEditData();


    //assert
    assert.deepEqual(updateArgs, []);
    assert.deepEqual(removeKeys, []);
});

//T407180
QUnit.test('Save changes when batch mode when one the changes is canceled from event', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs = [],
        removeKeys = [],
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        allowDeleting: true,
        mode: 'batch',
        texts: {
            editRow: "Edit",
            deleteRow: "Delete"
        }
    };

    that.options.onRowRemoving = function(e) {
        e.cancel = true;
    };

    that.dataControllerOptions.store = {
        update: function(key, values) {
            updateArgs.push([key, values]);
            return $.Deferred().resolve(key, values);
        },
        remove: function(key) {
            removeKeys.push(key);
            return $.Deferred().resolve(key);
        }
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowRemoving" });

    //act
    testElement.find('td').eq(0).trigger('dxclick'); //Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1);
    testElement.find('input').eq(0).val('Test1');
    testElement.find('input').eq(0).trigger('change');

    this.click(testElement.find('tbody > tr').eq(2), 'a:contains(Delete)');

    assert.ok(!that.dataController.refreshed, 'data is not refreshed');

    //act
    this.editingController.saveEditData();

    //assert
    assert.deepEqual(updateArgs, [['test1', { "name": "Test1" }]]);
    assert.deepEqual(removeKeys, []);
    assert.ok(that.dataController.refreshed, 'data is refreshed');
});

QUnit.test('Close Editing Cell when batch mode on click inside freespace row', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    that.dataControllerOptions.store = {
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    testElement.find('td').first().trigger('dxclick'); //Edit
    this.clock.tick();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, 'has input');

    //arrange
    testElement.find('input').first().val('Test update cell');
    testElement.find('input').first().trigger('change');

    //act
    testElement.find(".dx-freespace-row").first().trigger('dxclick');

    this.clock.tick();
    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0, 'not has input');
    assert.ok(!updateArgs, 'no update');
});

QUnit.test('Save Editing Cell when batch mode on click another cell', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs,
        testElement = $('#container'),
        testInput;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    that.dataControllerOptions.store = {
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };


    rowsView.render(testElement);
    testElement.find('td').eq(1).trigger('dxclick'); //Second cell

    //act
    testInput = getInputElements(testElement.find('tbody > tr')).first();
    assert.equal(testInput.length, 1);
    testInput.val(11);
    testInput.trigger('change');

    testElement.find('td').eq(0).trigger('dxclick');
    testInput = getInputElements(testElement.find('tbody > tr').first());

    assert.equal(testInput.length, 1);
    testInput.val('Test22');
    testInput.trigger('change');

    //assert
    assert.deepEqual(updateArgs, undefined);

    //act
    this.editingController.saveEditData();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.deepEqual(updateArgs, ['test1', { id: 11, name: "Test22" }]);
});

QUnit.test('Cancel Editing Row after change page', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: "Edit",
            saveRowChanges: "Save"
        }
    };

    rowsView.render(testElement);
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');

    assert.ok(getInputElements(testElement.find('tbody > tr').first()).length);
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Save)');

    //act
    that.dataController.pageIndex(1);
    that.editingController.update(); //TODO
    that.dataController.updateItems();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    this.find(testElement.find('tbody > tr').first(), 'a:contains(Edit)');
});

QUnit.test("Title of delete dialog is not displayed when title text is empty or undefined", function(assert) {
    //arrange
    var isTitleHidden;

    this.options.editing = {
        allowUpdating: true,
        texts: {
            confirmDeleteMessage: "Test"
        }
    };

    //act
    this.editingController.deleteRow(0);
    isTitleHidden = $(".dx-popup-title").length === 0;
    $(".dx-popup").remove();

    //assert
    assert.ok(isTitleHidden);
});

QUnit.test("Title of delete dialog is displayed when title text is defined", function(assert) {
    //arrange
    var isTitleShown;

    this.options.editing = {
        allowUpdating: true,
        texts: {
            confirmDeleteMessage: "Test",
            confirmDeleteTitle: "Title"
        }
    };

    //act
    this.editingController.deleteRow(0);

    isTitleShown = $(".dx-popup-title").length === 1;
    $(".dx-popup").remove();

    //assert
    assert.ok(isTitleShown);
});

QUnit.test('Close editing cell when cell is contained table inside', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        isCellClosed = false,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    that.columns[0].allowEditing = false;

    rowsView.render(testElement);

    testElement
        .find(".dx-row:first-child td")
        .eq(1)
        .append($('<table><tr><td><div class="txt"><input></input></div></td><td><div class="btn"></div></td></tr></table>'));

    that.editingController.init();
    that.editingController.isEditing = function() {
        return true;
    };
    that.editingController.closeEditCell = function() {
        isCellClosed = true;
    };

    //act
    that.editingController._saveEditorHandler({
        target: testElement.find(".txt input")[0]
    });

    //assert
    assert.ok(!isCellClosed);
});

/*
TODO Unstable test
asyncTest('Focus on first editor after Edit Click', function () {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.applyOptions({
        editing: {
            allowAdding: true
        }
    });
    rowsView.render(testElement);

    //act
    testElement.find('tbody > tr').first().find('a').trigger('click'); //New

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 3);
    setTimeout(function () {
        assert.equal(testElement.find("input:focus").val(), testElement.find('input')[0].value);

    });
});
*/

//T287356
QUnit.test('Not apply column options to cell editor', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        textEditor,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    that.columns[0].disabled = true;
    rowsView.render(testElement);

    //act
    testElement.find('td').first().trigger('dxclick');

    //assert
    textEditor = testElement.find('td').first().find(".dx-texteditor").first().data("dxTextBox");
    assert.ok(textEditor, "textBox");
    assert.ok(!textEditor.option("disabled"), "disabled false");
});

QUnit.test('Apply column editorOptions to cell editor', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        textEditor,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    that.columns[0].editorOptions = { disabled: true };
    rowsView.render(testElement);

    //act
    testElement.find('td').first().trigger('dxclick');

    //assert
    textEditor = testElement.find('td').first().find(".dx-texteditor").first().data("dxTextBox");
    assert.ok(textEditor, "textBox");
    assert.ok(textEditor.option("disabled"), "disabled true");
});

if(browser.msie && parseInt(browser.version) <= 11) {
    QUnit.test("Update value immediately on the keyup event for row edit mode", function(assert) {
        //arrange
        this.options.editing = {
            allowUpdating: true,
            mode: 'row'
        };

        this.editingController._editRowIndex = 0;

        var resultValue,
            $editor = $("<div/>").appendTo($("#container")),
            template = this.editingController.getColumnTemplate({
                rowType: "data",
                row: {
                    rowIndex: 0
                },
                column: {
                    allowEditing: true,
                    setCellValue: $.noop
                }
            });

        //act
        template($editor, {
            setValue: function(value) {
                resultValue = value;
            }
        });
        var $input = $editor.find("input").first();

        $input
            .val("new value")
            .trigger("keyup");

        //assert
        assert.equal(resultValue, "new value");
    });

    QUnit.test("Update value immediately on the keyup event for form edit mode", function(assert) {
        //arrange
        this.options.editing = {
            allowUpdating: true,
            mode: 'form'
        };

        this.editingController._editRowIndex = 0;

        var resultValue,
            $editor = $("<div/>").appendTo($("#container")),
            template = this.editingController.getColumnTemplate({
                rowType: "data",
                row: {
                    rowIndex: 0
                },
                column: {
                    allowEditing: true,
                    setCellValue: $.noop
                }
            });

        //act
        template($editor, {
            setValue: function(value) {
                resultValue = value;
            }
        });
        var $input = $editor.find("input").first();

        $input
            .val("new value")
            .trigger("keyup");

        //assert
        assert.equal(resultValue, "new value");
    });
}

QUnit.module('Editing with real dataController', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.array = [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1, stateId: 0, state: { name: "state 1" } },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2, stateId: 1, state: { name: "state 2" } },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3, stateId: 0, state: { name: "state 1" } },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4, stateId: 1, state: { name: "state 2" } },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5, stateId: 0, state: { name: "state 1" } },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6, stateId: 1, state: { name: "state 2" } },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7, stateId: 0, state: { name: "state 1" } }
        ];
        this.columns = ['name', 'age', { dataField: "lastName", allowEditing: false }, { dataField: 'phone' }, 'room'];
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'row'
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: {
                asyncLoadEnabled: false,
                store: this.array,
                paginate: true
            },
            masterDetail: {
                enabled: false,
                template: function($container, options) {
                    $container.dxDataGrid({
                        columns: ['name'],
                        dataSource: [{ name: 'test1' }, { name: 'test2' }]
                    });
                }
            }
        };

        setupDataGridModules(this, ['data', 'columns', 'rows', 'masterDetail', 'editing', 'editorFactory', 'selection', 'headerPanel', 'columnFixing'], {
            initViews: true
        });

        this.find = function($element, selector) {
            var $targetElement = $element.find(selector);
            QUnit.assert.equal($targetElement.length, 1, 'one element with selector ' + '"' + selector + '" found');
            return $targetElement;
        };
        this.click = function($element, selector) {
            var $targetElement = this.find($element, selector);
            $targetElement.trigger('dxclick');
            this.clock.tick();
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

//B254105
QUnit.test('Reset editing after refresh dataSource', function(assert) {
    //arrange
    var that = this;
    this.rowsView.render($('#container'));

    that.editRow(2);

    //assert
    assert.equal(that.editingController._editRowIndex, 2);

    //act
    that.dataController.refresh();

    //assert
    assert.equal(that.editingController._editRowIndex, -1);
});

//B254503
QUnit.test('no editing column when not has columns', function(assert) {
    //arrange
    var that = this,
        visibleColumns;

    that.options.columns = [];

    that.options.editing = {
        allowUpdating: true
    };

    that.columnsController.reset();
    that.columnsController.init();

    //act
    visibleColumns = that.columnsController.getVisibleColumns();

    //assert
    assert.ok(!visibleColumns.length, 'not has columns');
});

QUnit.test('Close Editing Cell and edit new cell on click', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        headerPanel = this.headerPanel,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch',
        texts: {
            cancelGridChanges: "Cancel changes",
            saveGridChanges: "Save changes"
        }
    };
    headerPanel.render(testElement);
    rowsView.render(testElement);

    var headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();
    testElement.find('td').first().trigger('dxclick'); //Edit

    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);
    testElement.find('input').first().val('Test update cell');

    assert.ok(this.find(headerPanelElement, '.dx-datagrid-save-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'save changes button disabled');
    assert.ok(this.find(headerPanelElement, '.dx-datagrid-cancel-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'cancel changes button disabled');

    testElement.find('input').first().trigger('change');
    assert.ok(testElement.find('td').first().hasClass("dx-cell-modified"));
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-save-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'save changes button enabled');
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-cancel-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'cancel changes button enabled');
    //act
    testElement.find('tbody > tr').first().find('td').eq(1).trigger('dxclick');

    //assert
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-modified"));
    assert.ok(testElement.find('td').first().hasClass("dx-cell-modified"));
    assert.ok(!testElement.find('td').eq(1).hasClass("dx-cell-modified"));
    assert.equal(getInputElements(testElement).length, 1, 'inputs count');
    assert.equal(getInputElements(testElement.find('tbody > tr').first().find('td').eq(1)).length, 1, 'inputs count  in first row second column');

    //act
    that.dataController.refresh();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0, 'inputs count');
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-save-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'save changes button enabled');
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-cancel-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'cancel changes button enabled');
});

//T181661
QUnit.test('Close Editing Cell on hold', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);

    //act
    that.editCell(0, 0); //Edit

    //assert
    assert.ok(testElement.find('tbody > tr').first().find("td").first().hasClass("dx-editor-cell"), "has editor");
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, "has input");

    //act
    var mouse = pointerMock(testElement.find('tbody td').eq(1))
        .start()
        .down()
        .wait(750);

    that.clock.tick(750);
    mouse.up();

    //assert
    assert.ok(!testElement.find('tbody > tr').first().find("td").first().hasClass("dx-editor-cell"), "not has editor");
    assert.ok(!getInputElements(testElement.find('tbody > tr').first()).length, "not has input");
});

//T458921
QUnit.test('Cancel Editing Row should not update all rows when form mode', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: "form"
    };

    rowsView.render(testElement);

    that.editRow(0);

    //act
    var $oldRowElements = testElement.find('tbody > tr');
    that.cancelEditData();

    //assert
    var $rowElements = testElement.find('tbody > tr');
    assert.equal(getInputElements($rowElements.first()).length, 0);
    assert.notStrictEqual($oldRowElements.get(0), $rowElements.get(0), "row 0 is changed");
    assert.notStrictEqual($oldRowElements.get(1), $rowElements.get(1), "row 1 is changed");
    assert.strictEqual($oldRowElements.get(2), $rowElements.get(2), "row 2 is not changed");
});

QUnit.test('Edit number cell via keyboard arrows (arrow up key)', function(assert) {
    //arrange
    var $testElement = $('#container'),
        $testInput;

    var UP_KEY = 38;

    this.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    this.headerPanel.render($testElement);
    this.rowsView.render($testElement);

    //act
    $testElement.find('td').eq(1).trigger('dxclick'); //Edit

    assert.equal(getInputElements($testElement.find('tbody > tr').first()).length, 1, "editor was created");

    $testInput = getInputElements($testElement).first();
    $testInput
        .val('15')
        .trigger($.Event('keydown', { which: UP_KEY }));

    this.editingController.closeEditCell();

    this.clock.tick();

    //assert
    assert.equal($testElement.find('td').eq(1).text(), '16', 'we will keep value that we increment by arrow up key');
});

QUnit.test('Edit number cell via keyboard arrows (arrow down key)', function(assert) {
    //arrange
    var $testElement = $('#container'),
        $testInput;

    var DOWN_KEY = 40;

    this.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    this.headerPanel.render($testElement);
    this.rowsView.render($testElement);

    //act
    $testElement.find('td').eq(1).trigger('dxclick'); //Edit

    assert.equal(getInputElements($testElement.find('tbody > tr').first()).length, 1, "editor was created");

    $testInput = getInputElements($testElement).first();
    $testInput
        .val('15')
        .trigger($.Event('keydown', { which: DOWN_KEY }));

    this.editingController.closeEditCell();

    this.clock.tick();

    //assert
    assert.equal($testElement.find('td').eq(1).text(), "14", "we will keep value that we decrement by arrow down key");
});

//T136710
QUnit.test('Close Editing Number Cell and edit next cell on tab key', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        headerPanel = this.headerPanel,
        testElement = $('#container');

    var TAB_KEY = 9,
        $input;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    headerPanel.render(testElement);
    rowsView.render(testElement);

    //act
    testElement.find('td').eq(1).trigger('dxclick'); //Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);

    $input = getInputElements(testElement).first();

    $input.val('15');
    $input.change();
    $input.trigger($.Event('keydown', { which: TAB_KEY }));
    this.editingController.closeEditCell();
    this.clock.tick();

    //assert
    assert.ok(!testElement.find('td').eq(1).hasClass("dx-cell-modified"), 'cell is not modified');

    //act
    testElement.find('td').eq(1).trigger('dxclick'); //Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);

    $input = getInputElements(testElement).first();
    $input.val('20');
    $input.change();
    $input.trigger($.Event('keydown', { which: TAB_KEY }));

    this.editingController.closeEditCell();
    this.clock.tick();

    //assert
    assert.ok(testElement.find('td').eq(1).hasClass("dx-cell-modified"), 'cell is modified');
});

//T150178
QUnit.test("Remove the inserted row with edit mode batch and hidden column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: "batch",
        allowAdding: true,
        allowDeleting: true
    };

    that.options.columns = ['name', 'age', "lastName"];

    rowsView.render(testElement);

    that.columnsController.optionChanged({ name: 'columns', fullName: 'columns' });
    that.dataController.optionChanged({ name: 'columns', fullName: 'columns' });

    that.columnOption(2, { visible: false });

    //act
    that.addRow();

    //assert
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-inserted"), "has row inserted");

    //act
    that.deleteRow(0);

    //assert
    assert.ok(!testElement.find('tbody > tr').first().hasClass("dx-row-inserted"), "not has row inserted");
});

QUnit.test("Edit row when set onEditingStart", function(assert) {
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true
    };

    that.options.onEditingStart = function(params) {
        assert.deepEqual(params.data, {
            "age": 15,
            "lastName": "John",
            "name": "Alex",
            "phone": "555555",
            "room": 1
        }, "parameter data");
        assert.deepEqual(params.key, {
            "age": 15,
            "lastName": "John",
            "name": "Alex",
            "phone": "555555",
            "room": 1
        }, "parameter key");
        assert.ok(!params.cancel, "parameter cancel");
        assert.ok(!params.isBuffered, "parameter isBuffered");
    };

    rowsView.render(testElement);
    that.editingController.init();

    //act
    that.editRow(0);

    //assert
    assert.equal(getInputElements(testElement).length, 4, "has input");

    //arrange
    that.cancelEditData();

    that.options.onEditingStart = function(params) {
        params.cancel = true;
    };
    that.editingController.optionChanged({ name: "onEditingStart" });

    //act
    that.editRow(0);

    //assert
    assert.equal(testElement.find("input").length, 0, "not has input");
});

QUnit.test("Edit cell when set onEditingStart", function(assert) {
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: "batch",
        allowUpdating: true
    };

    that.options.onEditingStart = function(params) {
        assert.deepEqual(params.data, {
            "age": 15,
            "lastName": "John",
            "name": "Alex",
            "phone": "555555",
            "room": 1
        }, "parameter data");
        assert.deepEqual(params.column, that.columnsController.getVisibleColumns()[0], "parameter column");
        assert.deepEqual(params.key, {
            "age": 15,
            "lastName": "John",
            "name": "Alex",
            "phone": "555555",
            "room": 1
        }, "parameter key");
        assert.ok(!params.cancel, "parameter cancel");
    };

    that.editingController.init();
    rowsView.render(testElement);

    //act
    that.editCell(0, 0);

    //assert
    assert.equal(testElement.find("input").length, 1, "has input");

    //arrange
    that.cancelEditData();

    that.options.onEditingStart = function(params) {
        params.cancel = true;
    };
    that.editingController.optionChanged({ name: "onEditingStart" });

    //act
    that.editRow(0);

    //assert
    assert.equal(testElement.find("input").length, 0, "not has input");
});

QUnit.test("Edit inserted row when edit mode batch and set onEditingStart", function(assert) {
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: "batch",
        allowUpdating: true
    };

    that.options.onEditingStart = function(params) {
        assert.ok(params.data.__KEY__);
        delete params.data.__KEY__;
        assert.deepEqual(params.data, {}, "parameter data");
        assert.ok(!params.cancel, "parameter cancel");
    };

    that.editingController.init();
    rowsView.render(testElement);

    //act
    that.addRow();
    that.editCell(0, 0);

    //assert
    assert.equal(testElement.find("input").length, 1, "has input");
});

//T181647
QUnit.test("Edit other row after inserting row when edit mode row", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        allowUpdating: true
    };

    rowsView.render(testElement);

    //act
    that.addRow();
    that.editRow(2);

    //assert
    assert.ok(!rowsView.element().find('tbody > tr').first().hasClass("dx-row-inserted"), "no has inserted row");
    assert.ok(rowsView.element().find('tbody > tr').eq(1).hasClass("dx-edit-row"), "has edit row");
});

QUnit.test('Insert Row', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        headerPanelElement,
        $newRow,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };

    headerPanel.render(testElement);
    rowsView.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //act
    this.click(headerPanelElement, '.dx-datagrid-addrow-button');

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 4);

    //act
    testElement.find('tbody > tr').first().find('input').first().val('Test update row');
    testElement.find('tbody > tr').first().find('input').first().trigger('change');

    $newRow = testElement.find('tbody > tr').first();
    this.click($newRow, 'a:contains(Save)');

    //assert
    assert.equal($newRow.find('input').length, 0);
    assert.ok($newRow.hasClass("dx-row-inserted"));
    assert.equal(this.array.length, 8, 'items count');
    assert.ok(this.array[7].__KEY__);
    delete this.array[7].__KEY__;
    assert.deepEqual(this.array[7], { "name": "Test update row" });
});

QUnit.test('Insert Row without dataSource', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.dataSource.store = [];
    that.options.editing = {
        allowAdding: true
    };

    rowsView.render(testElement);
    that.dataController.init();

    //assert
    assert.ok(!rowsView._getRowElements().length, "not rows");

    //act
    that.addRow();

    //assert
    assert.equal(rowsView._getRowElements().length, 1, "count rows");
    assert.equal(rowsView._getTableElement().find(".dx-row-inserted").length, 1, "insert row");
});

QUnit.test("Insert row when set onInitNewRow", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    that.options.editing = {
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };

    that.options.onInitNewRow = function(params) {
        //assert
        assert.ok(params.data.__KEY__);
        delete params.data.__KEY__;
        assert.deepEqual(params.data, {}, "parameter data");

        params.data = { name: "Test" };
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onInitNewRow" });

    //assert
    assert.equal(testElement.find(".dx-data-row").length, 7, "count rows");

    //act
    that.addRow();

    //assert
    assert.equal(testElement.find(".dx-data-row").length, 8, "count rows");
    assert.equal(getInputElements(testElement).length, 4, "has inputs");
    assert.strictEqual(testElement.find('tbody > tr').first().find("input").first().val(), "Test", "value first input");

    //act
    that.saveEditData();

    //assert
    assert.equal(testElement.find(".dx-data-row").length, 8, "count rows");
    assert.equal(testElement.find("input").length, 0, "not has inputs");
    assert.strictEqual(testElement.find(".dx-data-row").last().find("td").first().text(), "Test", "text first cell");
});

QUnit.test("Insert row when set onRowInserting", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        originalInsert = that.dataController.store().insert,
        testElement = $("#container");

    that.options.editing = {
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };

    that.dataController.store().insert = function(values) {
        //assert
        assert.deepEqual(values, {
            Test1: "test1",
            Test2: "test2"
        }, "update values");

        return originalInsert.apply(this, arguments);
    };

    that.options.onRowInserting = function(params) {
        //assert
        assert.ok(params.data.__KEY__);
        delete params.data.__KEY__;
        assert.deepEqual(params.data, {}, "parameter data");
        assert.ok(!params.cancel, "parameter cancel");

        params.data = {
            Test1: "test1",
            Test2: "test2"
        };
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowInserting" });

    //assert
    assert.equal(testElement.find(".dx-data-row").length, 7, "count rows");

    //act
    that.addRow();

    //assert
    assert.equal(testElement.find(".dx-data-row").length, 8, "count rows");
    assert.equal(getInputElements(testElement).length, 4, "has inputs");

    //act
    that.saveEditData();

    //assert
    assert.equal(testElement.find(".dx-data-row").length, 8, "count rows");
    assert.equal(testElement.find("input").length, 0, "not has inputs");

    //arrange
    that.dataController.store().insert = originalInsert;
    that.options.onRowInserting = function(params) {
        params.cancel = true;
    };
    that.editingController.optionChanged({ name: "onRowInserting" });

    //act
    that.addRow();

    //assert
    assert.equal(testElement.find(".dx-data-row").length, 9, "count rows");
    assert.equal(getInputElements(testElement).length, 4, "has inputs");

    //act
    that.saveEditData();

    //assert
    assert.equal(testElement.find(".dx-data-row").length, 9, "count rows");
    assert.equal(getInputElements(testElement).length, 4, "has inputs");
});

QUnit.test("Insert row when set onRowInserted", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    that.options.editing = {
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };

    that.options.onRowInserted = function(params) {
        //assert
        assert.ok(params.data.__KEY__);
        assert.deepEqual(params.key, params.data, "parameter key");  // T457499
        delete params.data.__KEY__;
        assert.deepEqual(params.data, { name: "Test" }, "parameter data");
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowInserted" });

    //act
    that.addRow();

    //assert
    assert.equal(getInputElements(testElement).length, 4, "has inputs");

    //act
    testElement.find("input").first().val("Test");
    testElement.find("input").first().trigger("change");

    //act
    that.saveEditData();

    //assert
    assert.equal(testElement.find("input").length, 0, "not has inputs");
});

//T457499
QUnit.test("onRowInserted - Check key after insert row when custom store", function(assert) {
    //arrange
    var that = this,
        countCallOnRowInserted = 0,
        rowsView = this.rowsView,
        $testElement = $("#container");

    that.options.editing = {
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };
    that.options.dataSource = {
        key: "fieldTest",
        load: function() {
            var d = $.Deferred();

            d.resolve(this.array);

            return d.promise();
        },
        insert: function(values) {
            var d = $.Deferred();
            return d.resolve("testKey").promise();
        }
    };

    that.options.onRowInserted = function(params) {
        countCallOnRowInserted++;

        //assert
        assert.deepEqual(params.data, {}, "parameter data");
        assert.strictEqual(params.key, "testKey", "parameter key");
    };

    that.dataController.init();
    rowsView.render($testElement);
    that.editingController.optionChanged({ name: "onRowInserted" });

    //act
    that.addRow();
    that.saveEditData();

    //assert
    assert.strictEqual(countCallOnRowInserted, 1, "count call onRowInserted");
});

//T147816
QUnit.test("Insert rows with edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container"),
        parameters = [];

    that.options.editing = {
        mode: "batch",
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };

    that.options.onRowInserted = function(params) {
        parameters.push(params);
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowInserted" });

    //act
    that.addRow();
    that.editCell(0, 0);

    testElement.find("input").first().val("Test");
    testElement.find("input").first().trigger("change");

    that.closeEditCell();
    that.clock.tick();

    that.addRow();

    $.when(that.saveEditData()).done(function() {
        //assert
        assert.ok(parameters[0].data.__KEY__);
        assert.deepEqual(parameters[0].key, parameters[0].data, "parameter key the first inserted row"); // T457499
        delete parameters[0].data.__KEY__;
        assert.deepEqual(parameters[0].data, {
            name: "Test"
        }, "parameter data the first inserted row");
        assert.ok(parameters[1].data.__KEY__);
        assert.deepEqual(parameters[1].key, parameters[1].data, "parameter key the second inserted row"); // T457499
        delete parameters[1].data.__KEY__;
        assert.deepEqual(parameters[1].data, {}, "parameter data the second inserted row");
    });
});

//T278457
QUnit.test("Insert several rows and remove they with edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container"),
        removeParameters = [];

    that.options.editing = {
        mode: "batch",
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };

    that.options.onRowRemoved = function(params) {
        removeParameters.push(params);
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowRemoved" });

    //act
    that.addRow();
    that.addRow();
    that.saveEditData();

    that.deleteRow(7);
    that.deleteRow(8);

    $.when(that.saveEditData()).done(function() {
        //assert
        assert.equal(removeParameters.length, 2, "remove count");
        assert.ok(removeParameters[0].data.__KEY__, "internal key field exists for inserted row 0");
        assert.ok(removeParameters[1].data.__KEY__, "internal key field exists for inserted row 1");
        assert.notEqual(removeParameters[0].data.__KEY__, removeParameters[1].__KEY__, "internal keys is not equals");

        delete removeParameters[0].data.__KEY__;
        delete removeParameters[1].data.__KEY__;
        assert.deepEqual(removeParameters[0].data, {}, "parameter data the first removed row");
        assert.deepEqual(removeParameters[1].data, {}, "parameter data the second removed row");
    });
});

QUnit.test('Insert Row when batch editing', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        headerPanelElement,
        testElement = $('#container'),
        cells;

    that.options.editing = {
        allowAdding: true,
        allowUpdating: true,
        mode: 'batch',
        texts: {
            addRow: "Add New Item",
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    headerPanel.render(testElement);
    rowsView.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel');

    //act
    this.addRow();
    this.clock.tick(300);

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1, 'When insert row and batch editing - focus first cell');

    //T147811
    cells = testElement.find('tbody > tr').eq(0).find('td');
    assert.ok(cells.eq(0).hasClass("dx-editor-cell"), "first cell of the inserted row has editor");
    assert.equal(cells.eq(1).html(), "&nbsp;", "text in the second cell of the inserted row");
    assert.equal(cells.eq(2).html(), "&nbsp;", "text of the third cell of the inserted row");
    assert.equal(cells.eq(3).html(), "&nbsp;", "text of the fourth cell of the inserted row");
    assert.equal(cells.eq(4).html(), "&nbsp;", "text of the fifth cell of the inserted row");

    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-save-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'save changes button enabled');
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-cancel-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'cancel changes button enabled');

    //act
    testElement.find('td').first().trigger('dxclick');
    testElement.find('input').first().val('Test update row');
    testElement.find('input').first().trigger('change');

    //act
    testElement.find('td').eq(1).trigger('dxclick');

    //assert
    assert.ok(testElement.find('td').first().hasClass("dx-cell-modified"));
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-inserted"));

    //act
    this.click(headerPanelElement, '.dx-datagrid-save-button');

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.equal(this.array.length, 8, 'items count');
    assert.ok(this.array[7].__KEY__);
    delete this.array[7].__KEY__;
    assert.deepEqual(this.array[7], { "name": "Test update row" });
    assert.ok(this.find(headerPanelElement, '.dx-datagrid-save-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'save changes button disabled');
    assert.ok(this.find(headerPanelElement, '.dx-datagrid-cancel-button').closest(".dx-toolbar-item").hasClass("dx-state-disabled"), 'cancel changes button disabled');
});

QUnit.test('Insert Row when "cell" edit mode', function(assert) {
    //arrange
    var that = this,
        headerPanel = that.headerPanel,
        rowsView = that.rowsView,
        headerPanelElement,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        allowUpdating: true,
        mode: 'cell'
    };
    headerPanel.render(testElement);
    rowsView.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel');

    //act
    that.addRow();
    that.clock.tick();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1, 'When insert row and cell editing - focus first cell');

    //act
    testElement.find('td').first().trigger('dxclick');
    testElement.find('input').first().val('Test update row');
    testElement.find('input').first().trigger('change');

    //act
    testElement.find('td').eq(1).trigger('dxclick');

    //assert
    assert.ok(testElement.find('td').first().hasClass("dx-cell-modified"));
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-inserted"));

    //act
    testElement.find('td').eq(5).trigger('dxclick');

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.equal(that.array.length, 8, 'items count');
    assert.ok(that.array[7].__KEY__);
    delete that.array[7].__KEY__;
    assert.deepEqual(that.array[7], { "name": "Test update row" });
    assert.ok(!testElement.find('.' + "dx-cell-modified").length);
    assert.ok(!testElement.find('.' + "dx-row-inserted").length);
});

QUnit.test('Insert Row when "cell" edit mode and the new value is not accepted yet', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        testElement = $('#container'),
        hasNewValue;

    that.options.editing = {
        allowAdding: true,
        allowUpdating: true,
        mode: 'cell'
    };
    headerPanel.render(testElement);
    rowsView.render(testElement);

    //act
    testElement
        .find('td')
        .first()
        .trigger('dxclick');

    testElement
        .find('input')
        .first()
        .val("modifiedValue")
        .trigger("change");

    that.addRow();
    this.clock.tick();
    hasNewValue = !!testElement.find("td:contains(modifiedValue)").length;

    //assert
    assert.ok(hasNewValue);
});

QUnit.testInActiveWindow('Insert Row after scrolling', function(assert) {
    //arrange
    var that = this,
        done = assert.async(),
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        headerPanelElement,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };

    headerPanel.render(testElement);
    rowsView.render(testElement);
    rowsView.height(10);
    rowsView.resize();

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    rowsView.scrollChanged.add(function() {
        //act
        that.click(headerPanelElement, '.dx-datagrid-addrow-button');

        //assert
        assert.strictEqual(rowsView.getTopVisibleItemIndex(), 1);
        assert.equal(getInputElements(testElement.find('tbody > tr').eq(1)).length, 4);

        //act
        testElement.find('input').first().val('Test');
        testElement.find('input').first().trigger('change');

        that.click(testElement.find('tbody > tr').eq(1), '.dx-link:contains(Save)');

        //assert
        assert.equal(getInputElements(testElement).length, 0, 'inputs count');
        assert.equal(that.array.length, 8, 'items count');
        delete that.array[7].__KEY__;
        assert.deepEqual(that.array[7], { name: 'Test' }, 'added item');
        done();
    });

    //TODO check why scrollTop(30) do not work for ie9
    rowsView.element().dxScrollable('instance').scrollTo(25);
});

QUnit.test("Update cell when edit mode batch and set onRowUpdating", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        originalUpdate = that.dataController.store().update,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save"
        }
    };

    that.dataController.store().update = function(key, values) {
        //assert
        assert.deepEqual(values, {
            age: 15,
            lastName: "John",
            name: "Test1",
            phone: "555555",
            room: 1,
            stateId: 0,
            state: { name: "state 1" }
        }, "update values");

        return originalUpdate.apply(this, arguments);
    };

    that.options.onRowUpdating = function(params) {
        //assert
        assert.deepEqual(params.newData, {
            name: "Test1",
        }, "parameter new data");
        assert.deepEqual(params.oldData, {
            age: 15,
            lastName: "John",
            name: "Alex",
            phone: "555555",
            room: 1,
            stateId: 0,
            state: { name: "state 1" }
        }, "parameter oldData");
        assert.deepEqual(params.key, {
            age: 15,
            lastName: "John",
            name: "Alex",
            phone: "555555",
            room: 1,
            stateId: 0,
            state: { name: "state 1" }
        }, "parameter key");
        assert.ok(!params.cancel, "parameter cancel");

        params.newData = $.extend({}, params.oldData, params.newData);
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowUpdating" });

    //act
    that.editCell(0, 0);
    that.clock.tick();

    //assert
    assert.equal(testElement.find("input").length, 1, "count input");

    //act
    testElement.find("input").first().val("Test1");
    testElement.find("input").first().trigger("change");

    $(document).trigger("dxclick"); // Save
    that.clock.tick();

    //assert
    assert.equal(testElement.find("input").length, 0, "count input");
    assert.strictEqual(testElement.find('tbody > tr').first().find("td").first().text(), "Test1", "text first cell");
    assert.equal(testElement.find(".dx-highlight-outline").length, 1, "has element with class name dx-highlight-outline");

    //act
    that.saveEditData();

    //assert
    assert.equal(testElement.find(".dx-highlight-outline").length, 0, "not has element with class name dx-highlight-outline");

    //arrange
    that.dataController.store().update = originalUpdate;
    that.options.onRowUpdating = function(params) {
        params.cancel = true;
    };
    that.editingController.optionChanged({ name: "onRowUpdating" });

    //act
    that.editCell(0, 0);
    that.clock.tick();

    //assert
    assert.equal(testElement.find("input").length, 1, "count input");

    //act
    testElement.find("input").first().val("Test2");
    testElement.find("input").first().trigger("change");

    $(document).trigger("dxclick"); // Save
    that.clock.tick();

    //assert
    assert.equal(testElement.find("input").length, 0, "count input");
    assert.strictEqual(testElement.find('tbody > tr').first().find("td").first().text(), "Test2", "text first cell");
    assert.equal(testElement.find(".dx-highlight-outline").length, 1, "has element with class name dx-highlight-outline");

    //act
    that.saveEditData();

    //assert
    assert.equal(testElement.find(".dx-highlight-outline").length, 1, "has element with class name dx-highlight-outline");
});

QUnit.test("Update cell when edit mode batch and cancel in onRowUpdating is deferred and resolved", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save"
        }
    };

    sinon.spy(that.dataController.store(), "update");

    var cancelDeferred = $.Deferred();

    that.options.onRowUpdating = function(params) {

        cancelDeferred.done(function() {
            params.newData.room = 666;
        });

        params.cancel = cancelDeferred;
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowUpdating" });

    //act
    that.editCell(0, 0);
    that.clock.tick();

    //assert
    assert.equal(testElement.find("input").length, 1, "count input");

    //act
    testElement.find("input").first().val("Test1");
    testElement.find("input").first().trigger("change");

    //$(document).trigger("dxclick"); // Save
    //that.clock.tick();
    that.saveEditData();

    //assert
    assert.ok(!that.dataController.store().update.called, "update is not called");

    //act
    cancelDeferred.resolve();

    //assert
    assert.equal(that.dataController.store().update.callCount, 1, "update called one time");
    assert.deepEqual(that.dataController.store().update.lastCall.args, [ that.array[0], { name: "Test1", room: 666 } ], "update args");
});

QUnit.test("Update cell when edit mode batch and cancel in onRowUpdating is deferred and resolved with true", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save"
        }
    };

    sinon.spy(that.dataController.store(), "update");

    var dataErrors = [];

    that.dataController.dataErrorOccurred.add(function(e) {
        dataErrors.push(e);
    });


    var cancelDeferred = $.Deferred();

    that.options.onRowUpdating = function(params) {

        cancelDeferred.done(function() {
            params.newData.room = 666;
        });

        params.cancel = cancelDeferred;
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowUpdating" });

    //act
    that.editCell(0, 0);
    that.clock.tick();

    //assert
    assert.equal(testElement.find("input").length, 1, "count input");

    //act
    testElement.find("input").first().val("Test1");
    testElement.find("input").first().trigger("change");

    that.saveEditData();

    //assert
    assert.ok(!that.dataController.store().update.called, "update is not called");

    //act
    cancelDeferred.resolve(true);

    //assert
    assert.ok(!that.dataController.store().update.called, "update is not called");
    assert.ok(!dataErrors.length, "no data errors");
});

QUnit.test("Update cell when edit mode batch and cancel in onRowUpdating is deferred and rejected", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save"
        }
    };

    sinon.spy(that.dataController.store(), "update");

    var cancelDeferred = $.Deferred();

    that.options.onRowUpdating = function(params) {

        cancelDeferred.done(function() {
            params.newData.room = 666;
        });

        params.cancel = cancelDeferred;
    };

    var dataErrors = [];

    that.dataController.dataErrorOccurred.add(function(e) {
        dataErrors.push(e);
    });

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowUpdating" });

    //act
    that.editCell(0, 0);
    that.clock.tick();

    //assert
    assert.equal(testElement.find("input").length, 1, "count input");

    //act
    testElement.find("input").first().val("Test1");
    testElement.find("input").first().trigger("change");

    that.saveEditData();
    cancelDeferred.reject("Test Error Message");

    //assert
    assert.ok(!that.dataController.store().update.called, "update is not called");

    assert.deepEqual(dataErrors.length, 1, "data errors count");
    assert.ok(dataErrors[0] instanceof Error, "error has Error type");
    assert.equal(dataErrors[0].message, "Test Error Message", "error message");
});

QUnit.test("Update cell when edit mode bath and set onRowUpdated", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save"
        }
    };

    that.options.onRowUpdated = function(params) {
        //assert
        assert.deepEqual(params.data, { name: "Test" }, "parameter data");
        assert.deepEqual(params.key, {
            "age": 15,
            "lastName": "John",
            "name": "Test",
            "phone": "555555",
            "room": 1
        }, "parameter key");
    };

    rowsView.render(testElement);
    that.editingController.init();

    //act
    that.editCell(0, 0);
    that.clock.tick();

    //assert
    assert.equal(testElement.find("input").length, 1, "count input");

    //act
    testElement.find("input").first().val("Test");
    testElement.find("input").first().trigger("change");

    $(document).trigger("dxclick"); // Save
    that.clock.tick();

    //assert
    assert.equal(testElement.find("input").length, 0, "count input");
    assert.strictEqual(testElement.find('tbody > tr').first().find("td").first().text(), "Test", "text first cell");
    assert.equal(testElement.find(".dx-highlight-outline").length, 1, "has element with class name dx-highlight-outline");

    //act
    that.saveEditData();

    //assert
    assert.equal(testElement.find(".dx-highlight-outline").length, 0, "not has element with class name dx-highlight-outline");
});

QUnit.test("Highlight modified boolean editor", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        booleanColumnIndex = that.options.columns.length,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save"
        }
    };

    rowsView.render(testElement);
    that.editingController.init();

    that.addColumn({ dataField: 'booleanField', dataType: 'boolean' });

    //act
    that.editCell(0, booleanColumnIndex);
    that.clock.tick();

    var $checkbox = testElement.find(".dx-row").first().find(".dx-checkbox");

    //assert
    assert.equal($checkbox.length, 1, "count input");

    //act
    $checkbox.trigger("dxclick");

    $(document).trigger("dxclick"); // Save
    that.clock.tick();

    //assert
    $checkbox = testElement.find(".dx-row").first().find(".dx-checkbox");
    assert.ok($checkbox.parent().hasClass("dx-highlight-outline"), 'checkbox parent is dx-highlight-outline');
    assert.ok($checkbox.parent().parent().hasClass("dx-editor-cell"), 'cell has dx-editor-cell class');
    assert.ok($checkbox.parent().parent().hasClass("dx-editor-inline-block"), 'cell has dx-editor-inline-block class');
    assert.ok($checkbox.parent().parent().hasClass("dx-cell-modified"), 'cell has dx-cell-modified class');
});

//T389185
QUnit.test("Not highlight calculated column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save"
        }
    };

    rowsView.render(testElement);
    that.editingController.init();

    that.addColumn({ calculateCellValue: function() { return "calculated"; } });

    //act
    that.cellValue(0, 0, "test");
    that.clock.tick();

    assert.equal(testElement.find(".dx-row").first().find(".dx-cell-modified").length, 1, "one modified value");
    assert.ok(testElement.find(".dx-row").first().children().eq(0).hasClass("dx-cell-modified"), 1, "first cell is modified");
});

//T246535
QUnit.test("oldData on rowUpdating for checkbox editor", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        rowUpdatingCallCount = 0,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true
    };

    that.options.onRowUpdating = function(e) {
        //assert
        assert.deepEqual(e.oldData, {
            age: 15,
            lastName: "John",
            name: "Alex",
            phone: "555555",
            room: 1,
            stateId: 0,
            state: { name: "state 1" }
        }, "oldData on rowUpdating");

        assert.deepEqual(e.newData, {
            booleanField: true
        }, "data on rowUpdating");
        rowUpdatingCallCount++;
    };
    that.options.columns.push({ dataField: "booleanField", dataType: "boolean" });

    that.columnsController.reset();
    that.editingController.optionChanged({ name: "onRowUpdating" });
    rowsView.render(testElement);

    var $checkbox = testElement.find(".dx-row").first().find(".dx-checkbox");
    //act

    $checkbox.trigger("dxclick");
    that.editingController.saveEditData();

    //assert
    assert.ok($checkbox.length, "checkbox found");
    assert.equal(rowUpdatingCallCount, 1, "rowUpdating call count");
});

//T172738
QUnit.test("Highlight modified with option showEditorAlways true on column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        cell,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true
    };

    rowsView.render(testElement);
    that.editingController.init();

    //act
    that.columnOption(0, { showEditorAlways: true });

    //assert
    cell = rowsView.element().find("td").first();
    assert.ok(cell.find(".dx-texteditor").length, "has editor");
    assert.ok(cell.children().hasClass("dx-highlight-outline"), "has element with class dx-highlight-outline");
    assert.ok(!cell.hasClass("dx-cell-modified"), "not has class dx-cell-modified");

    //act
    cell.find("input").val("Test");
    cell.find("input").trigger("change");

    //assert
    assert.ok(cell.hasClass("dx-cell-modified"), "has class dx-cell-modified");
});

QUnit.test("onEditingStart should not have key if row is inserted and showEditorAlways true on column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true
    };

    rowsView.render(testElement);

    that.columnOption(0, { showEditorAlways: true });

    var editingStartKeys = [];
    that.options.onEditingStart = function(e) {
        editingStartKeys.push(e.key);
    };
    that.editingController.optionChanged({ name: "onEditingStart" });

    //act
    that.addRow();
    that.clock.tick();

    //assert
    assert.deepEqual(editingStartKeys, [undefined, undefined], "onEditingStart called twice with undefined key");
});

QUnit.test('Cancel Inserting Row after change page', function(assert) {
    //arrange
    var that = this,
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        headerPanelElement,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        texts: {
            addRow: "Add New Item"
        }
    };

    headerPanel.render(testElement);
    rowsView.render(testElement);

    this.dataController.pageSize(3);


    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    //act
    that.click(headerPanelElement, '.dx-datagrid-addrow-button');

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 4);

    //act
    this.dataController.pageIndex(1);

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
});

QUnit.test('Remove row and Recover row when batch editing', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch',
        allowDeleting: true,
        texts: {
            deleteRow: "Delete",
            undeleteRow: "Undelete",
            confirmDeleteMessage: "TestMessage"
        }
    };

    rowsView.render(testElement);
    this.editingController.init();

    //act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)');

    //assert
    assert.equal(this.find(testElement.find('tbody > tr').first(), '.dx-link-undelete').text(), 'Undelete', 'Delete link changed to Undelete');
    assert.ok(testElement.find('tbody > tr').eq(0).hasClass("dx-row-removed"));
    assert.ok(!testElement.find('tbody > tr').eq(1).hasClass("dx-row-removed"));

    //act
    this.click(testElement.find('tbody > tr').first(), '.dx-link-undelete');

    //assert
    assert.equal(this.find(testElement.find('tbody > tr').first(), '.dx-link').text(), 'Delete', 'Recover link changed to Delete');
    assert.ok(!testElement.find('tbody > tr').eq(0).hasClass("dx-row-removed"));

    //act
    this.editingController.saveEditData();

    //assert
    assert.equal(this.array.length, 7, 'items count not changed');
});

QUnit.test("Remove row when set onRowRemoving", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowDeleting: true,
        texts: {
            deleteRow: "Delete",
            undeleteRow: "Undelete",
            confirmDeleteMessage: "TestMessage"
        }
    };



    that.options.onRowRemoving = function(params) {
        assert.deepEqual(params.data, that.array[0], "parameter data");
        assert.deepEqual(params.key, that.array[0], "parameter key");
        assert.ok(!params.cancel, "parameter cancel");

        params.cancel = true;
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowRemoving" });

    //assert
    assert.equal(testElement.find('.dx-data-row').length, 7, "count rows");

    //act
    that.deleteRow(0);
    $(".dx-dialog-button").first().trigger("dxclick");

    //assert
    assert.equal(testElement.find('.dx-data-row').length, 7, "count rows");

    //arrange
    that.options.onRowRemoving = function(params) {
        params.cancel = false;
    };
    that.editingController.optionChanged({ name: "onRowRemoving" });

    //act
    that.deleteRow(0);
    $(".dx-dialog-button").first().trigger("dxclick");

    //assert
    assert.equal(testElement.find('.dx-data-row').length, 6, "count rows");
});

QUnit.test("Remove row when set onRowRemoved", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowDeleting: true,
        texts: {
            deleteRow: "Delete",
            undeleteRow: "Undelete",
            confirmDeleteMessage: "TestMessage"
        }
    };

    that.options.onRowRemoved = function(params) {
        assert.deepEqual(params.key,
            {
                "age": 15,
                "lastName": "John",
                "name": "Alex",
                "phone": "555555",
                "room": 1
            }, "parameter key");
        //T148294
        assert.deepEqual(params.data,
            {
                "age": 15,
                "lastName": "John",
                "name": "Alex",
                "phone": "555555",
                "room": 1
            }, "parameter data");
    };

    rowsView.render(testElement);
    that.editingController.init();

    //assert
    assert.equal(testElement.find('.dx-data-row').length, 7, "count rows");

    //act
    that.deleteRow(0);
    $(".dx-dialog-button").first().trigger("dxclick");

    //assert
    assert.equal(testElement.find('.dx-data-row').length, 6, "count rows");
});

//T100624
QUnit.test('Edit Cell when the width of the columns in percent', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        textEditor;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);

    that.options.columns = [
            { dataField: 'name', width: '60%' },
            { dataField: 'age', width: '40%' }
    ];

    that.columnsController.optionChanged({ name: 'columns', fullName: 'columns' });
    that.dataController.optionChanged({ name: 'columns', fullName: 'columns' });

    //act
    testElement.find('td').first().trigger('dxclick');

    //assert
    assert.equal(testElement.find('td').first().find('input').length, 1, "has input");
    textEditor = testElement.find(".dx-texteditor");
    assert.equal(textEditor.length, 1, "text editor");
    assert.ok(!textEditor[0].style.width, "not width text editor");
});

QUnit.test("Close current editor when clicked on not editable cells_B255594", function(assert) {
    //arrange
    var isCloseEditCell,
        testElement = $('#container');

    this.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };

    this.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    this.editingController.closeEditCell = function() {
        isCloseEditCell = true;
    };

    this.editingController._editRowIndex = 0;

    this.rowsView.render(testElement);
    this.selectionController.init();

    //act
    $(".dx-select-checkbox").closest("td").first().trigger("dxclick");

    //assert
    assert.ok(isCloseEditCell, "current editor is closed");
});

//T107779
QUnit.test('Column currency format after editing', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch',
        allowUpdating: true
    };

    that.options.columns = ["name", { dataField: 'age', format: "currency", precision: 3 }];

    rowsView.render(testElement);

    that.columnsController.optionChanged({ name: 'columns', fullName: 'columns' });
    that.dataController.optionChanged({ name: 'columns', fullName: 'columns' });

    //assert
    assert.equal(testElement.find('td').first().next().text(), "$15.000", "cell text before editing");

    //act
    testElement.find('td').first().next().trigger("dxclick");
    this.clock.tick();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, "has input");
    assert.equal(testElement.find('td').first().next().find('input').val(), 15, "value input");

    //act
    testElement.find('td').first().next().find('input').val('123');
    testElement.find('td').first().next().find('input').trigger('change');
    $(document).trigger("dxclick");

    this.clock.tick();

    //assert
    assert.ok(!getInputElements(testElement.find('tbody > tr').first()).length, "not has input");
    assert.equal(testElement.find('td').first().next().text(), "$123.000", "cell text after editing");
});

QUnit.test('Add highlight outline by batch edit mode_T118843', function(assert) {
    //arrange
    var that = this,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    this.rowsView.render(testElement);
    testElement.find('td').eq(1).trigger('dxclick');

    //act
    testElement.find('input').first().val('11');
    testElement.find('input').first().trigger('change');

    testElement.find('td').eq(0).trigger('dxclick');

    //assert
    assert.ok(testElement.find(".dx-highlight-outline").length > 0, "highlight outline");

});

QUnit.test("Empty space symbol is added when value is null_T123257", function(assert) {
    var that = this,
        $outlineElement,
        testElement = $('#container'),
        inputElement;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    this.rowsView.render(testElement);
    testElement.find('td').eq(1).trigger('dxclick');
    inputElement = getInputElements(testElement).first();

    //act
    inputElement.val("");
    inputElement.trigger('change');

    testElement.find('td').eq(0).trigger('dxclick');

    $outlineElement = testElement.find(".dx-highlight-outline");

    //assert
    assert.strictEqual($outlineElement.text(), $("<div>&nbsp;</div>").text(), "empty text");
});

//T136710
QUnit.test('Add highlight outline by batch edit mode when delayed template used (KO)', function(assert) {
    //arrange
    var that = this,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    that._getTemplate = function(name) {
        if(name === '#test') {
            return {
                render: function(options) {
                    options.container.text('test_' + options.model.text);
                }
            };
        }
    },
    that.rowsView.render(testElement);

    that.columnsController.columnOption(0, 'cellTemplate', '#test');

    testElement.find('td').eq(0).trigger('dxclick');

    //act
    testElement.find('input').first().val('Test11');
    testElement.find('input').first().trigger('change');

    that.editingController.closeEditCell();
    that.clock.tick();

    //assert
    var $elementWithOutline = testElement.find('td').first().find(".dx-highlight-outline");
    assert.strictEqual($elementWithOutline.length, 1, "highlight outline");
    assert.strictEqual($elementWithOutline.text(), 'test_Test11', "text in outline element");
});


QUnit.test("Append editorCell css class for row editing", function(assert) {
    //arrange
    var that = this,
        $cells,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: "row"
    };

    rowsView.render(testElement);

    //act
    this.editingController.editRow(0);
    $cells = testElement.find(".dx-editor-cell");

    //assert
    assert.equal($cells.length, 4, "length of cells");
    assert.equal($cells[0].cellIndex, 0);
    assert.equal($cells[1].cellIndex, 1);
    assert.equal($cells[2].cellIndex, 3);
    assert.equal($cells[3].cellIndex, 4);
});

//T136485
QUnit.test("Batch editing with complex keys", function(assert) {
    //arrange
    var $testElement = $("#container"),
        dataField = "name",
        newValue = "Alex1";

    this.options.editing = {
        allowUpdating: true,
        mode: "batch"
    };

    this.rowsView.render($testElement);

    //act
    this.editingController.updateFieldValue({
        cellElement: $testElement.find("td").first(),
        key: this.array[0],
        column: { dataField: dataField, setCellValue: function(data, value) { data[dataField] = value; } }
    }, newValue);
    this.dataController.reload();

    //assert
    assert.equal(this.dataController.items()[0].data[dataField], newValue);
});

QUnit.test('Close editing cell when using "cell" edit mode on click outside dataGrid and save data', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    that.options.onRowUpdating = function(params) {
        updateArgs = params.newData;
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowUpdating" });
    testElement.find('td').first().trigger('dxclick'); //Edit
    this.clock.tick();

    //act
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);
    testElement.find('input').first().val('Test update cell');
    testElement.find('input').first().trigger('change');

    //act
    $(document).trigger('dxclick');
    this.clock.tick();

    //assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.deepEqual(updateArgs, { "name": "Test update cell" });
});

QUnit.test("When select all items editing row must have not 'dx-selection' class", function(assert) {
    //arrange
    var testElement = $('#container'),
        rowClass = "dx-row",
        rowSelectionClass = "dx-selection";

    this.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };

    this.options.editing = {
        allowUpdating: true,
        mode: 'row'
    };

    this.editingController._editRowIndex = 0;

    this.rowsView.render(testElement);

    //act
    this.selectAll();

    //assert
    assert.ok(!testElement.find('.' + rowClass).eq(0).hasClass(rowSelectionClass), 'row that editing now has no selection class');
    assert.ok(testElement.find('.' + rowClass).eq(1).hasClass(rowSelectionClass), 'row that not editing now has selection class');
});

//T186404
QUnit.test("When select all items row with modified cell must have 'dx-selection' class", function(assert) {
    //arrange
    var testElement = $('#container'),
        rowClass = "dx-row",
        rowSelectionClass = "dx-selection";

    this.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };

    this.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    this.rowsView.render(testElement);

    this.editingController.updateFieldValue({
        key: { name: "Alex", age: 15, lastName: "John", phone: "555555", room: 1 },
        column: { dataField: 'name' }
    }, "Alex111");

    this.dataController.updateItems();

    //act
    this.selectAll();

    //assert
    var $rows = testElement.find('.' + rowClass);
    assert.ok($rows.eq(0).hasClass(rowSelectionClass), 'row has selection class');
    assert.ok($rows.eq(1).hasClass(rowSelectionClass), 'row has selection class');
});

//B255559
QUnit.test("Selection don't working for a inserted row", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        testElement = $('#container');

    that.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };

    that.options.editing = {
        allowAdding: true,
        mode: 'batch'
    };

    rowsView.render(testElement);
    that.selectionController.init();

    //act
    that.addRow();

    //assert
    assert.ok(!rowsView.element().find(".dx-row").first().find(".dx-select-checkbox").length, "not has checkbox for inserted row");
    assert.ok(rowsView.element().find(".dx-row").eq(1).find(".dx-select-checkbox").length, "has checkbox for data row");

    //act
    that.selectionController.changeItemSelection(0);

    //assert
    assert.ok(!rowsView.element().find("tr").first().hasClass("dx-selection"), "not selected a inserted row");
    assert.ok(!that.getSelectedRowKeys().length, "not selected row keys");
});

//T195944, T292164
QUnit.testInActiveWindow('Save edit data in cell mode on value change when showEditorAlways is true', function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        saveEditDataCallCount = 0,
        selectBoxInstance,
        saveEditData = that.editingController.saveEditData,
        testElement = $('#container');

    that.options.columns[0] = {
        dataField: "name",
        showEditorAlways: true,
        lookup: {
            dataSource: [{ id: 1, name: "test1" }, { id: 2, name: "test2" }],
            displayExpr: 'name',
            valueExpr: 'id'
        }
    };

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };
    that.element = function() {
        return testElement;
    };

    that.editingController.saveEditData = function() {
        saveEditDataCallCount++;
        return saveEditData.apply(this, arguments);
    };

    rowsView.render(testElement);
    that.columnsController.init();

    selectBoxInstance = rowsView.getCellElement(0, 0).find(".dx-selectbox").data("dxSelectBox");

    //assert
    assert.strictEqual(selectBoxInstance.NAME, "dxSelectBox", "has selectBox");

    //act
    that.editCell(0, 0);

    selectBoxInstance.option("value", 2);
    that.clock.tick();

    //assert
    assert.equal(saveEditDataCallCount, 1, "save edit data called once");
    assert.strictEqual(getInputElements(rowsView.getCellElement(0, 0)).val(), "test2", "value input");
    assert.ok(rowsView.getCellElement(0, 0).find(".dx-selectbox").hasClass("dx-state-focused"), "editor is focused");
});

//T425994, T429166, T469944
QUnit.testInActiveWindow('Cell should save focus state after data saving in cell editing mode', function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        saveEditDataCallCount = 0,
        editor,
        saveEditData = that.editingController.saveEditData,
        testElement = $('#container');

    that.options.loadingTimeout = 30;

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    that.element = function() {
        return testElement;
    };

    that.editingController.saveEditData = function() {
        saveEditDataCallCount++;
        return saveEditData.apply(this, arguments);
    };

    rowsView.render(testElement);
    that.columnsController.init();

    that.editCell(0, 0);

    editor = rowsView.getCellElement(0, 0).find(".dx-textbox").data("dxTextBox");

    //act
    editor.option("value", "test2");
    var $cell = that.getCellElement(0, 1);
    $cell.trigger("dxclick");
    that.clock.tick(30);

    //assert
    assert.equal(saveEditDataCallCount, 1, "save edit data called once");
    assert.strictEqual(rowsView.getCellElement(0, 0).text(), "test2", "value input");
    assert.ok(rowsView.getCellElement(0, 1).find(".dx-widget").hasClass("dx-state-focused"), "editor is focused");
});

//T383760
QUnit.testInActiveWindow('Update be called once in cell mode on value change for boolean editor', function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        updateCallCount = 0,
        testElement = $('#container');

    that.options.columns[0] = {
        dataField: "checked",
        dataType: "boolean"
    };

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };
    that.element = function() {
        return testElement;
    };

    var oldUpdate = that.dataController.store().update;

    var updateDeferred = $.Deferred();
    that.dataController.store().update = function() {
        updateCallCount++;
        oldUpdate.apply(this, arguments);
        return updateDeferred;
    };

    rowsView.render(testElement);
    that.columnsController.init();

    var $checkBox = rowsView.getCellElement(0, 0).find(".dx-checkbox");

    //assert
    assert.strictEqual($checkBox.length, 1, "has checkBox");

    //act
    $checkBox.focus().trigger("dxclick");

    updateDeferred.resolve();
    that.clock.tick();

    //assert
    assert.equal(updateCallCount, 1, "update called once");
    assert.ok(rowsView.getCellElement(0, 0).find(".dx-checkbox").hasClass("dx-checkbox-checked"), "value is changed");
    assert.ok(rowsView.getCellElement(0, 0).find(".dx-checkbox").hasClass("dx-state-focused"), "editor is focused");
});

//T246542
QUnit.test('Error during save changes in batch mode', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs = [],
        dataErrors = [],
        updatedArgs = [],
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        allowDeleting: true,
        mode: 'batch',
        texts: {
            editRow: "Edit",
            deleteRow: "Delete"
        }
    };
    that.options.dataSource = {
        load: function() {
            return that.array;
        },
        update: function(key, values) {
            var d = $.Deferred();

            setTimeout(function() {
                updateArgs.push([key, values]);
                if(updateArgs.length < 3) {
                    d.reject("My Error " + updateArgs.length);
                } else {
                    d.resolve();
                }
            });

            return d;
        }
    };

    that.options.onRowUpdated = function(e) {
        updatedArgs.push(e);
    };

    that.editingController.optionChanged({ name: "onRowUpdated" });

    that.dataController.dataErrorOccurred.add(function(e) {
        dataErrors.push(e);
    });

    rowsView.render(testElement);
    that.dataController.optionChanged({ name: "dataSource" });

    assert.ok(!this.hasEditData(), 'not has edit data');


    var editCell = function(rowIndex, columnIndex, text) {
        testElement.find('tbody > tr').eq(rowIndex).find('td').eq(columnIndex).trigger('dxclick'); //Edit
        assert.equal(testElement.find('tbody > tr').eq(rowIndex).find('input').length, 1);
        testElement.find('input').eq(0).val(text);
        testElement.find('input').eq(0).trigger('change');
    };

    //act
    editCell(0, 0, "Test1");
    editCell(1, 0, "Test2");
    editCell(2, 0, "Test3");

    //act
    this.editingController.saveEditData();
    this.clock.tick();


    //assert
    assert.deepEqual(updateArgs.length, 3, 'update count');
    assert.deepEqual(updatedArgs.length, 3, 'update count');
    assert.deepEqual(updatedArgs[0].error.message, "My Error 1", 'update 0 error');
    assert.deepEqual(updatedArgs[1].error.message, "My Error 2", 'update 1 error');
    assert.deepEqual(updatedArgs[2].error, undefined, 'update 2 error');

    assert.strictEqual(dataErrors.length, 2, 'data errors count');
    assert.strictEqual(dataErrors[0].message, "My Error 1", 'data error 1');
    assert.strictEqual(dataErrors[1].message, "My Error 2", 'data error 2');

    assert.ok(this.editingController.hasChanges(), 'has changes');
    assert.ok(this.hasEditData(), 'has edit data');

    var items = this.dataController.items();
    assert.equal(items.length, 7);
    assert.deepEqual(items[0].modifiedValues, ["Test1", undefined, undefined, undefined, undefined], "row 0 modified");
    assert.equal(items[0].data.name, "Test1", "row 0 name");
    assert.deepEqual(items[1].modifiedValues, ["Test2", undefined, undefined, undefined, undefined], "row 1 modified");
    assert.equal(items[1].data.name, "Test2", "row 1 name");
    assert.deepEqual(items[2].modifiedValues, undefined, "row 2 modified");
    assert.equal(items[2].data.name, "Vadim", "row 2 name");
    assert.deepEqual(items[3].modifiedValues, undefined, "row 3 modified");
    assert.equal(items[3].data.name, "Dmitry", "row 3 name");
});

QUnit.test("Add edit data with save array without extend_T256598", function(assert) {
    //arrange
    this.editingController._editData = [{
        data: { A: [11, 12] },
        key: 1,
        test: "test"
    }];

    //act
    this.editingController._addEditData({
        data: { A: [13] },
        key: 1,
        type: "number"
    });

    //assert
    assert.deepEqual(this.editingController._editData[0], {
        key: 1,
        data: { A: [13] },
        test: "test",
        type: "number"
    });
});

QUnit.test("isEditing parameter of the row when edit mode is 'row'", function(assert) {
    //arrange
    this.rowsView.render($("#container"));

    //act
    this.editRow(0);

    //assert
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.ok(this.dataController.items()[0].isEditing, "isEditing parameter");
});

QUnit.test("isEditing parameter of the cell when edit mode is 'batch'", function(assert) {
    //arrange
    var isEditingCell,
        isEditingRow;

    this.options.onCellPrepared = function(e) {
        if(e.rowIndex === 0 && e.columnIndex === 0) {
            isEditingCell = e.isEditing;
            isEditingRow = e.row.isEditing;
        }
    };
    this.options.editing = {
        mode: 'batch'
    };

    this.rowsView.init();
    this.rowsView.render($("#container"));

    //act
    this.editCell(0, 0);

    //assert
    assert.equal(this.editingController._editColumnIndex, 0, "edit cell index");
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.ok(isEditingCell, "isEditing parameter of the cell");
    assert.ok(isEditingRow, "isEditing parameter of the row");
});

//T316439
QUnit.testInActiveWindow('Hide focus overlay before update on editing cell', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowEditing: true,
        mode: 'batch'
    };
    rowsView.render(testElement);
    that.element = function() {
        return testElement;
    };

    that.editCell(0, 0);
    that.clock.tick();

    //assert
    assert.ok(testElement.find('.dx-datagrid-focus-overlay').is(":visible"), 'visible focus overlay');

    //act
    that.editCell(0, 1);

    //assert
    assert.ok(!testElement.find('.dx-datagrid-focus-overlay').is(":visible"), 'not visible focus overlay');
    that.clock.tick();
    assert.ok(testElement.find('.dx-datagrid-focus-overlay').is(":visible"), 'visible focus overlay');
});

QUnit.test("Get first editable column index when form edit mode", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.masterDetail = {
        enabled: true
    };

    that.options.editing = {
        allowUpdating: true,
        mode: "form"
    };

    rowsView.render(testElement);

    that.editRow(0);

    //act
    var editableIndex = this.editingController.getFirstEditableColumnIndex();

    //assert
    assert.equal(editableIndex, 0, "editable index");
});

QUnit.test("Get first editable column index when form edit mode and custom form items is defined", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.masterDetail = {
        enabled: true
    };

    that.options.editing = {
        allowUpdating: true,
        mode: "form",
        form: {
            items: [
                {
                    itemType: "group",
                    items: ["phone", "room"]
                },
                {
                    itemType: "group",
                    items: ["name", "age"]
                }
            ]
        }
    };

    rowsView.render(testElement);

    that.editRow(0);

    //act
    var editableIndex = this.editingController.getFirstEditableColumnIndex();

    //assert
    assert.equal(editableIndex, 3, "editable index");
});

QUnit.test("Get correct first editable column index when form edit mode and form items are changed dynamically", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.masterDetail = {
        enabled: true
    };

    that.options.editing = {
        allowUpdating: true,
        mode: "form"
    };

    rowsView.render(testElement);

    that.editRow(0);

    //act
    this.editingController.option("editing.form", { items: ["phone", "room"] });
    this.editingController.optionChanged({ name: "editing" });

    that.editRow(0);

    var editableIndex = this.editingController.getFirstEditableColumnIndex();

    //assert
    assert.equal(editableIndex, 3, "editable index");
});

QUnit.test("Get correct first editable column index when visible option for item set via formItem option", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.masterDetail = {
        enabled: true
    };

    that.options.editing = {
        allowUpdating: true,
        mode: "form"
    };

    rowsView.render(testElement);

    that.columnsController.columnOption("name", {
        formItem: {
            visible: false
        }
    });

    that.editRow(0);

    var editableIndex = this.editingController.getFirstEditableColumnIndex();

    //assert
    assert.equal(editableIndex, 1, "editable index");
});

if(device.ios || device.android) {
    //T322738
    QUnit.testInActiveWindow("Native click is used when allowUpdating is true", function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.columns = ["name", "age"];
        that.options.editing = {
            allowUpdating: true,
            mode: 'batch'
        };

        rowsView.render(testElement);

        //assert
        assert.ok(testElement.find('table').hasClass("dx-native-click"), "native click is used");
    });

    //T322738
    QUnit.testInActiveWindow("Native click is not used when allowUpdating is false", function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.editing = {
            allowUpdating: false,
            mode: 'batch'
        };
        //act
        rowsView.render(testElement);

        //assert
        assert.ok(!testElement.find('table').hasClass("dx-native-click"), "native click is not used");
    });
}

if(!devices.win8) {
    //T105941
    QUnit.testInActiveWindow("Focused cell when editing cell in batch mode", function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.scrolling = {
            useNative: false
        };
        that.options.columns = ["name", "age"];
        that.options.editing = {
            allowUpdating: true,
            mode: 'batch'
        };

        rowsView.render(testElement);
        that.columnsController.init();
        that.element = function() {
            return testElement;
        };

        //act
        testElement.find('tbody > tr').first().find("td").first().trigger('dxclick'); //Edit
        that.clock.tick();

        //assert
        var $focusOverlay = testElement.find('.dx-datagrid-focus-overlay');
        assert.equal($focusOverlay.length, 1, 'focus overlay count');

        assert.equal(testElement.find('tbody > tr').first().find("td").first().outerWidth(), browser.mozilla ? $focusOverlay.outerWidth() : $focusOverlay.outerWidth() - 1, 'width focus overlay');

        //T192066
        var $editor = testElement.find('tbody > tr').first().find('td.dx-focused');

        assert.ok($editor.length, 'focused cell');
        assert.ok($editor.find(".dx-textbox").length, 'has textbox');
        assert.equal(that.editorFactoryController.focus().get(0), $editor.get(0));
    });

    QUnit.testInActiveWindow("Focused cell when editing cell in batch mode when fixed columns", function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.scrolling = {
            useNative: false
        };
        that.options.columns = [{ dataField: "name", fixed: true }, "age"];
        that.options.editing = {
            allowUpdating: true,
            mode: 'batch'
        };

        rowsView.render(testElement);
        that.columnsController.init();
        that.element = function() {
            return testElement;
        };

        //act
        testElement.find('.dx-datagrid-content-fixed tbody > tr').first().find("td").first().trigger('dxclick'); //Edit
        that.clock.tick();

        //assert
        var $focusOverlay = testElement.find('.dx-datagrid-focus-overlay');
        assert.equal($focusOverlay.length, 1, 'focus overlay count');

        assert.equal(testElement.find('.dx-datagrid-content-fixed tbody > tr').first().find("td").first().outerWidth(), browser.mozilla ? $focusOverlay.outerWidth() : $focusOverlay.outerWidth() - 1, 'width focus overlay');

        //T192066
        var $editor = testElement.find('.dx-datagrid-content-fixed tbody > tr').first().find('td.dx-focused');

        assert.ok($editor.length, 'focused cell');
        assert.ok($editor.find(".dx-textbox").length, 'has textbox');
        assert.equal(that.editorFactoryController.focus().get(0), $editor.get(0));
    });

    //T180058
    QUnit.testInActiveWindow("Focused last cell width when editing cell in batch mode", function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.scrolling = {
            useNative: false
        };
        that.options.columns = ["name", "age"];
        that.options.editing = {
            allowUpdating: true,
            mode: 'batch'
        };

        rowsView.render(testElement);
        that.columnsController.init();
        that.element = function() {
            return testElement;
        };

        //act
        testElement.find('tbody > tr').first().find("td").last().trigger('dxclick'); //Edit
        that.clock.tick();

        //assert
        var $focusOverlay = testElement.find('.dx-datagrid-focus-overlay');
        assert.equal($focusOverlay.length, 1, 'focus overlay count');

        assert.equal(testElement.find('tbody > tr').first().find("td").last().outerWidth(), browser.mozilla ? $focusOverlay.outerWidth() - 1 : $focusOverlay.outerWidth(), 'width focus overlay');
    });

    QUnit.test("Lookup editor with calculateDisplayValue", function(assert) {
        //arrange
        var that = this,
            rowsView = that.rowsView,
            testElement = $('#container');

        that.options.columns.push({
            dataField: "stateId",
            calculateDisplayValue: "state.name",
            lookup: {
                dataSource: [{ id: 1, name: "state 1" }, { id: 2, name: "state 2" }],
                displayExpr: 'name',
                valueExpr: 'id'
            }
        });
        that.options.editing = {
            allowUpdating: true,
            mode: 'batch'
        };
        rowsView.render(testElement);
        that.columnsController.init();

        //act
        that.editCell(0, 5);
        that.clock.tick();
        var $selectBox = rowsView.getCellElement(0, 5).find(".dx-selectbox");
        $selectBox.dxSelectBox("instance").option("value", 2);
        that.closeEditCell();
        that.clock.tick();

        //assert
        var $cell = testElement.find(".dx-row").first().children("td").eq(5);

        assert.ok(!that.columnOption("stateId").lookup.items, "no items in lookup");
        assert.equal($cell.find(".dx-widget").length, 0, "no widgets in cell");
        assert.ok($cell.hasClass("dx-cell-modified"), "cell is modified");
        assert.equal($cell.text(), "state 2", "display text");
    });

    QUnit.test("Lookup editor in row mode do not update row", function(assert) {
        //arrange
        var that = this,
            rowsView = that.rowsView,
            testElement = $('#container');

        that.options.columns.push({
            dataField: "stateId",
            calculateDisplayValue: "state.name",
            lookup: {
                dataSource: [{ id: 1, name: "state 1" }, { id: 2, name: "state 2" }],
                displayExpr: 'name',
                valueExpr: 'id'
            }
        });
        that.options.editing = {
            allowUpdating: true,
            mode: 'batch'
        };
        rowsView.render(testElement);
        that.columnsController.init();

        //act
        that.editCell(0, 5);
        that.clock.tick();
        var $selectBox = rowsView.getCellElement(0, 5).find(".dx-selectbox");
        var $cellBeforeChange = testElement.find(".dx-row").first().children("td").eq(5);
        $selectBox.dxSelectBox("instance").option("value", 2);
        that.clock.tick();
        var $cellAfterChange = testElement.find(".dx-row").first().children("td").eq(5);

        //assert
        assert.equal($cellBeforeChange.get(0), $cellAfterChange.get(0), "cell element is not changed");
        assert.ok($cellAfterChange.hasClass("dx-cell-modified"), "cell is modified");
        assert.equal(getInputElements($cellAfterChange).val(), "state 2", "display text");
    });

    //T379396
    QUnit.test("Lookup editor must be closed after save edit data when rowsView have no scrollable", function(assert) {
        //arrange
        var that = this,
            rowsView = that.rowsView,
            testElement = $('#container');

        that.options.columns.push({
            dataField: "stateId",
            lookup: {
                dataSource: [{ id: 0, name: "state 1" }, { id: 1, name: "state 2" }],
                displayExpr: 'name',
                valueExpr: 'id'
            }
        });
        that.options.editing = {
            allowUpdating: true,
            mode: 'row'
        };
        rowsView.render(testElement);
        that.columnsController.init();

        //act
        that.editRow(0);

        var $selectBox = rowsView.getCellElement(0, 5).find(".dx-selectbox");

        $selectBox.dxSelectBox("instance").open();
        $selectBox.dxSelectBox("instance").close();
        that.clock.tick(500);

        assert.equal($selectBox.find(".dx-scrollable").length, 1, "scrollable is rendered in selectbox");
        $selectBox.dxSelectBox("instance").option("value", 1);

        that.saveEditData();

        //assert
        var $cell = rowsView.getCellElement(0, 5);
        assert.equal(testElement.find("input").length, 0, "no editors");
        assert.ok($cell.is(":visible"), "cell is visible");
        assert.equal($cell.find(".dx-selectbox").length, 0, "no selectbox");
        assert.equal($cell.text(), "state 2", "lookup text");
    });

    QUnit.test("Lookup editor with dataSource function", function(assert) {
        //arrange
        var that = this,
            rowsView = that.rowsView,
            testElement = $('#container');

        var dataSourceArgs;

        that.options.columns.push({
            dataField: "stateId",
            lookup: {
                dataSource: function(options) {
                    dataSourceArgs = options;
                    return {
                        filter: options.data && ["room", "=", options.data.room],
                        store: [{ id: 1, room: 1, name: "state 1" }, { id: 2, room: 2, name: "state 2" }, { id: 3, room: 3, name: "state 3" }]
                    };
                },
                displayExpr: 'name',
                valueExpr: 'id'
            }
        });
        that.options.editing = {
            allowUpdating: true,
            mode: 'batch'
        };
        rowsView.render(testElement);
        that.columnsController.init();

        //act
        that.editCell(0, 5);
        that.clock.tick();

        //assert
        var $selectBox = rowsView.getCellElement(0, 5).find(".dx-selectbox");

        assert.equal($selectBox.length, 1, 'selectbox is created');
        assert.equal(dataSourceArgs.key, that.array[0], 'dataSource arg key');
        assert.equal(dataSourceArgs.data, that.array[0], 'dataSource arg data');

        assert.deepEqual($selectBox.dxSelectBox("instance").option("dataSource.filter"), ["room", "=", 1], 'selectbox item count');
    });

    QUnit.test('Change value with custom setCellValue', function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.editing = {
            mode: "row",
            allowUpdating: true,
            texts: {
                saveRowChanges: "Save",
                editRow: "Edit"
            }
        };
        that.options.columns[0] = {
            dataField: "name",
            setCellValue: function(data, value) {
                data[this.dataField] = value;
                data.phone = "";
            }
        };

        rowsView.render(testElement);
        that.columnsController.init();

        that.editingController.editRow(0);

        assert.equal(testElement.find('tbody > tr').first().find('input').eq(0).val(), "Alex");
        assert.equal(getInputElements(testElement.find('tbody > tr').first()).eq(2).val(), "555555");

        //act
        testElement.find('tbody > tr').first().find('input').eq(0).val('Test name');
        testElement.find('tbody > tr').first().find('input').eq(0).trigger('change');

        //assert
        assert.equal(testElement.find('tbody > tr').first().find('input').eq(0).val(), "Test name");
        assert.equal(getInputElements(testElement.find('tbody > tr').first()).eq(2).val(), "");
    });


    QUnit.test('cellValue', function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.editing = {
            mode: "row",
            allowUpdating: true,
            texts: {
                saveRowChanges: "Save",
                editRow: "Edit"
            }
        };

        rowsView.render(testElement);

        this.columnOption("age", "visible", false);
        var changedCount = 0;
        that.dataController.changed.add(function() {
            changedCount++;
        });

        //act, assert
        assert.equal(this.cellValue(0, 0), "Alex", "get cell value by rowIndex, columnIndex");
        assert.equal(this.cellValue(0, "phone"), "555555", "get cell value by rowIndex, dataField");
        assert.equal(this.cellValue(0, "age"), 15, "get cell value by rowIndex and invisible dataField");

        assert.strictEqual(this.cellValue(10, 0), undefined, "get cell value by wrong rowIndex");
        assert.strictEqual(this.cellValue(0, "wrong"), undefined, "get cell value by wrong column");

        //act
        this.cellValue(0, 0, "Test name");
        this.cellValue(0, "age", 66);

        //assert
        assert.strictEqual(changedCount, 2, "changed is called after cellValue");
        assert.equal(testElement.find('tbody > tr').first().find('td').eq(0).text(), "Test name");
        assert.equal(this.cellValue(0, 0), "Test name", "get cell value by rowIndex, columnIndex");
        assert.equal(this.cellValue(0, "age"), 66, "get cell value by rowIndex and invisible dataField");

        assert.equal(testElement.find('tbody > tr').first().find('td').eq(1).text(), "John");

        //act
        this.columnOption("age", "visible", true);

        //assert
        assert.equal(testElement.find('tbody > tr').first().find('td').eq(1).text(), "66");
    });

    //T501819
    QUnit.test('Change array cell value in batch edit mode', function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.editing = {
            mode: "batch",
            allowUpdating: true
        };

        that.array[0].arr = [1, 3];

        that.addColumn("arr");

        rowsView.render(testElement);

        //act
        that.cellValue(0, "arr", [3]);

        //assert
        assert.deepEqual(that.cellValue(0, "arr"), [3], "value in grid is changed correctly");
        assert.deepEqual(that.array[0].arr, [1, 3], "value in array is not changed");
    });

    //T440578
    QUnit.test('cellValue should works with beginUpdate/endUpdate', function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        rowsView.render(testElement);

        var changes = [];
        that.dataController.changed.add(function(e) {
            changes.push(e);
        });

        //act
        this.dataController.beginUpdate();

        this.cellValue(0, 0, "Test1");
        this.cellValue(0, 1, 101);

        this.cellValue(1, 0, "Test2");
        this.cellValue(1, 1, 102);

        this.dataController.endUpdate();

        //assert
        assert.strictEqual(changes.length, 1, "changed is called once after several cellValue");
        assert.strictEqual(changes[0].changeType, "refresh", "changeType is refresh");

        assert.equal(testElement.find('tbody > tr').eq(0).find('td').eq(0).text(), "Test1");
        assert.equal(testElement.find('tbody > tr').eq(0).find('td').eq(1).text(), "101");
        assert.equal(testElement.find('tbody > tr').eq(1).find('td').eq(0).text(), "Test2");
        assert.equal(testElement.find('tbody > tr').eq(1).find('td').eq(1).text(), "102");

        assert.equal(this.cellValue(0, 0), "Test1");
        assert.equal(this.cellValue(0, 1), 101);
        assert.equal(this.cellValue(1, 0), "Test2");
        assert.equal(this.cellValue(1, 1), 102);
    });

    //T355235
    QUnit.test('cellValue in onCellPrepared', function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        var values = [];
        var prevRowValues = [];

        that.options.onCellPrepared = function(e) {
            if(e.rowType === "data" && e.columnIndex === 0) {
                values.push(e.value);
                prevRowValues.push(that.cellValue(e.rowIndex - 1, e.columnIndex));
            }
        };
        rowsView.init();

        //act
        rowsView.render(testElement);


        //assert
        assert.deepEqual(values, ["Alex", "Dan", "Vadim", "Dmitry", "Sergey", "Kate", "Dan"], "values for first column");
        assert.deepEqual(prevRowValues, [undefined, "Alex", "Dan", "Vadim", "Dmitry", "Sergey", "Kate"], "prev row values for first column");
    });

    //T319885
    QUnit.testInActiveWindow("Focused lookup column with showEditorAlways is enabled", function(assert) {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "focus is not actual for mobile devices");
            return;
        }

        //arrange
        var that = this,
            callCountFocusEditingCell = 0,
            rowsView = this.rowsView,
            $testElement = $('#container');

        that.options.columns = [{
            dataField: "name",
            lookup: {
                dataSource: [{ id: 1, name: "test1" }, { id: 2, name: "test2" }],
                displayExpr: 'name',
                valueExpr: 'id'
            },
            showEditorAlways: true
        }, "age"];
        that.options.editing = {
            allowUpdating: true,
            mode: 'cell'
        };

        rowsView.render($testElement);
        that.columnsController.init();
        that.element = function() {
            return $testElement;
        };

        that.editingController._focusEditingCell = function() {
            callCountFocusEditingCell++;
        };

        //act
        $testElement.find("tbody > tr").first().find("td").first().find(".dx-selectbox-container").trigger("dxclick"); //Edit
        that.clock.tick();

        //assert
        var $focusOverlay = $testElement.find('.dx-datagrid-focus-overlay');
        assert.equal($focusOverlay.length, 1, 'focus overlay count');
        assert.ok(!callCountFocusEditingCell, "not call focusEditingCell");
    });

    //T266499
    QUnit.test("columnOption in onEditingStart and onInitNewRow", function(assert) {
        //arrange
        var that = this,
            rowsView = this.rowsView,
            initNewRowCallCount = 0,
            editingStartCallCount = 0,
            $testElement = $('#container');

        that.options.editing = {
            mode: 'row'
        };

        that.options.onInitNewRow = function(e) {
            initNewRowCallCount++;
            that.columnOption("name", "allowEditing", true);
        };

        that.options.onEditingStart = function(e) {
            editingStartCallCount++;
            that.columnOption("name", "allowEditing", false);
        };

        that.editingController.optionChanged({ name: "onInitNewRow" });
        that.editingController.optionChanged({ name: "onEditingStart" });

        rowsView.render($testElement);

        //act
        that.editRow(0);

        //assert
        assert.equal($testElement.find(".dx-edit-row").eq(0).children().eq(0).find("input").length, 0, "first edit row cell is not editable");

        //act
        that.cancelEditData();
        that.addRow();
        that.clock.tick();

        //assert
        assert.equal($testElement.find(".dx-edit-row").length, 1, "one edit row");
        assert.equal($testElement.find(".dx-edit-row").eq(0).children().eq(0).find("input").length, 1, "first added row cell is editable");
        assert.equal(initNewRowCallCount, 1, "initNewRow call count");
        assert.equal(editingStartCallCount, 1, "editingStart call count");
    });
}

QUnit.module('Editing with validation', {
    beforeEach: function() {
        this.array = [
                { name: 'Alex', age: 15, lastName: "John", },
                { name: 'Dan', age: 16, lastName: "Skip" },
                { name: 'Vadim', age: 17, lastName: "Dog" }
        ];
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'row',
                allowUpdating: true,
                allowAdding: true
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: ['name', 'age', "lastName"],
            dataSource: {
                asyncLoadEnabled: false,
                store: this.array,
                paginate: true
            }
        };

        this.element = function() {
            return $(".dx-datagrid");
        };

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'editing', 'masterDetail', 'grouping', 'editorFactory', 'errorHandling', 'validating', 'filterRow', 'adaptivity'], {
            initViews: true
        });

        this.applyOptions = function(options) {
            $.extend(true, this.options, options);
            this.dataController.init();
            this.columnsController.init();
            this.editingController.init();
            this.validatingController.init();
        };

        this.columnHeadersView.getColumnCount = function() {
            return 3;
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("CheckBox should save intermediate state after validation when editing mode is batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name', {
            dataField: 'boolean',
            dataType: "boolean",
            validationRules: [{ type: "required" }]
        }]
    });

    that.editCell(0, 0);
    rowsView.element().find('.dx-textbox').dxTextBox("instance").option("value", "Test");

    //act
    that.saveEditData();
    that.clock.tick();

    var $checkbox = rowsView.element().find('tbody > tr').first().find("td .dx-checkbox").first();

    //assert
    assert.strictEqual($checkbox.dxCheckBox("instance").option("value"), undefined, "checkbox value is undefined");
    assert.ok($checkbox.hasClass("dx-checkbox-indeterminate"), "checkbox has intermediate class");
});

QUnit.test("Edit cell when edit mode batch and set validate in column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //act
    that.editCell(0, 1);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    //act
    that.editCell(0, 1);

    inputElement = getInputElements(testElement).first();
    inputElement.val(99);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

QUnit.test("Save edit data when edit mode batch and set validate in column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        scrolling: {
            mode: "standard"
        },
        editing: {
            mode: "batch"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    //act
    that.editCell(1, 1);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    var saveEditDataResult = that.saveEditData();

    cells = rowsView.element().find("td");

    //assert
    assert.equal(saveEditDataResult.state(), "resolved");
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(cells.eq(4).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(4).children().first().hasClass("dx-highlight-outline"), "has highlight");

    //act
    that.editCell(1, 1);

    inputElement = getInputElements(testElement).first();
    inputElement.val(99);
    inputElement.trigger('change');

    saveEditDataResult = that.saveEditData();

    cells = rowsView.element().find("td");

    //assert
    assert.equal(saveEditDataResult.state(), "resolved");
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(!cells.eq(4).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(4).children().first().hasClass("dx-highlight-outline"), "not has highlight");
});

QUnit.test("Save edit data for inserted row when set validate in column and edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name', 'age', {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }]
    });

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(cells.eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(2).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    that.editCell(0, 2);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    testElement.find('input').first().val("Test");
    testElement.find('input').first().trigger('change');

    that.closeEditCell();
    that.clock.tick();
    that.saveEditData();

    cells = rowsView.element().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 0, "not has input");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
    assert.strictEqual(cells.eq(11).text(), "Test", "text cell 12");
    assert.ok(!cells.eq(11).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(11).children().first().hasClass("dx-highlight-outline"), "not has highlight");
});

//T420231
QUnit.test("Invalid date cell must be highlighted in batch editing mode for inserted row", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name', 'age', {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }]
    });

    //act
    that.addRow();
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(cells.eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(2).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

//T186431
QUnit.test("Save edit data for inserted row without validation in columns and edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        }
    });

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();

    //assert
    assert.equal(testElement.find(".dx-row-inserted").length, 1, "have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    that.saveEditData();

    //assert
    assert.ok(!testElement.find(".dx-row-inserted").length, "not have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

//T183300
QUnit.test("Edit the inserted row for the first time when set validate in columns, edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name', 'age', {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }]
    });

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();

    //assert
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    that.editCell(0, 2);
    cells = rowsView.element().find("td");
    that.editorFactoryController.focus(cells.eq(2));

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.ok(!cells.eq(2).hasClass("dx-datagrid-invalid"), "not has validation");
});

QUnit.test("Insert row with set validate in columns, edit mode batch and hidden column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name',
            {
                dataField: 'age',
                validationRules: [{ type: "range", min: 1, max: 100 }]
            },
            {
                dataField: "lastName",
                visible: false,
                validationRules: [{ type: "required" }]
            }]
    });

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();
    that.editorFactoryController.focus(cells.eq(1));
    that.editCell(0, 1);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    testElement.find('input').first().val(99);
    testElement.find('input').first().trigger('change');

    that.closeEditCell();
    that.clock.tick();

    //assert
    assert.equal(getInputElements(testElement).length, 0, "not has input");
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(1).children().first().hasClass("dx-highlight-outline"), "not has highlight");

    //act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(cells.parent().hasClass("dx-row-inserted"), "not save the edit data");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

QUnit.test("Button inside the selectBox is not clicked", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        selectBoxButton,
        testElement = $('#container');

    that.options.columns[0] = {
        dataField: "name",
        lookup: {
            dataSource: [{ id: 1, name: "test1" }, { id: 2, name: "test2" }],
            displayExpr: 'name',
            valueExpr: 'id'
        }
    };
    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    rowsView.render(testElement);
    that.columnsController.init();

    //act
    that.editCell(0, 0);
    that.clock.tick();
    selectBoxButton = rowsView.getCellElement(0, 0).find(".dx-selectbox .dx-dropdowneditor-button").data("dxButton");
    selectBoxButton.element().trigger("dxclick");

    //assert
    assert.ok($(".dx-dropdowneditor-overlay").length > 0);
});

//T174596
QUnit.test("Validation after inserting several rows and saving in batch edit mode", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        check = function() {
            cells = rowsView.element().find("td");
            assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
            assert.ok(cells.eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
            assert.ok(cells.eq(4).hasClass("dx-datagrid-invalid"), "failed validation");
            assert.ok(cells.eq(5).hasClass("dx-datagrid-invalid"), "failed validation");
        };

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name',
            {
                dataField: 'age',
                validationRules: [{ type: "required" }, { type: "range", min: 1, max: 100 }]
            },
            {
                dataField: "lastName",
                validationRules: [{ type: "required" }]
            }]
    });

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();
    that.addRow();

    //assert
    assert.equal(testElement.find('tbody > tr').length, 6, "count rows");

    //act
    that.saveEditData();

    //assert
    check();

    //act
    that.editCell(0, 1);

    //assert
    check();
});

//T181732
QUnit.test("Validation during editing inserted row when edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: [
            {
                dataField: "name",
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'age',
                validationRules: [{ type: "range", min: 1, max: 100 }]
            },
            {
                dataField: "lastName",
                validationRules: [{ type: "required" }]
            }]
    });

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //act
    that.editCell(0, 1);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(99);
    inputElement.trigger('change');

    //act
    that.dataController.changed.empty(); // changed empty called for disable rendering rowsView

    that.editCell(0, 0);

    //assert
    cells = rowsView.element().find('tbody > tr').first().find("td");
    assert.ok(!cells.eq(0).hasClass("dx-datagrid-invalid"), "not have validate");
    assert.ok(!cells.eq(0).children().first().hasClass("dx-highlight-outline"), "not has highlight");

    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validate");
    assert.ok(cells.eq(1).hasClass("dx-cell-modified"), "modified cell");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    assert.ok(!cells.eq(2).hasClass("dx-datagrid-invalid"), "not have validate");
    assert.ok(!cells.eq(2).children().first().hasClass("dx-highlight-outline"), "not has highlight");
});

//T183295
QUnit.test("Focused cell with validation when edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        callBackFunc,
        testElement = $('#container');

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: [
            "name",
            {
                dataField: "age",
                validationRules: [{ type: "range", min: 1, max: 100 }]
            },
            "lastName"]
    });

    callBackFunc = function() {
        //assert
        assert.ok(testElement.find("td").eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
        assert.ok(testElement.find("td").eq(1).children().hasClass("dx-highlight-outline"), "has highlight");
        //assert.ok(testElement.find("td").eq(1).children().hasClass("dx-focused"), "has class dx-focused");

        that.editorFactoryController.focused.remove(callBackFunc);
    };
    that.editorFactoryController.focused.add(callBackFunc);

    //act
    that.editCell(0, 1); // edit cell

    testElement.find("input").val(101); // change value
    testElement.find("input").trigger("change");

    that.closeEditCell(); // close edit cell
    that.clock.tick();

    that.editCell(0, 1); // edit cell
    that.editorFactoryController.focus(testElement.find("td").eq(1).children()); // focus cell
    that.clock.tick();
});

QUnit.test("Edit row when set validate in column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    that.columnsController.optionChanged('columns');
    that.dataController.optionChanged('columns');

    //act
    that.editRow(0);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 3, "has input");
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    inputElement = getInputElements(testElement).eq(1);
    inputElement.val(101);
    inputElement.trigger('change');

    var saveEditDataResult = that.saveEditData();

    //assert
    cells = rowsView.element().find('tbody > tr').first().find("td");
    assert.equal(getInputElements(testElement).length, 3, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");
    assert.equal(saveEditDataResult.state(), "resolved");

    //act
    inputElement = getInputElements(testElement).eq(1);
    inputElement.val(99);
    inputElement.trigger('change');

    saveEditDataResult = that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 0, "not has input");
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(1).children().first().hasClass("dx-highlight-outline"), "not has highlight");
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");
    assert.equal(saveEditDataResult.state(), "resolved");
});

QUnit.test("Insert row when set validate in column and edit mode row", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        columns: ['name', 'age',
            {
                dataField: "lastName",
                validationRules: [{ type: "required" }]
            }]
    });

    that.columnsController.optionChanged('columns');
    that.dataController.optionChanged('columns');

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();

    //assert
    assert.equal(getInputElements(testElement).length, 3, "has input");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(cells.eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(2).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    inputElement = getInputElements(testElement).eq(2);
    inputElement.val("Test");
    inputElement.trigger('change');

    that.saveEditData();

    cells = rowsView.element().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 0, "not has input");
    assert.strictEqual(cells.eq(14).text(), "Test", "text cell 12");
    assert.ok(!cells.eq(14).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(14).children().first().hasClass("dx-highlight-outline"), "not has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

QUnit.test("Insert row with set validate in columns, edit mode row and hidden column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells;

    rowsView.render(testElement);

    that.applyOptions({
        columns: ['name',
            {
                dataField: 'age',
                validationRules: [{ type: "range", min: 1, max: 100 }]
            },
            {
                dataField: "lastName",
                visible: false,
                validationRules: [{ type: "required" }]
            }]
    });

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 2, "has input");
    assert.ok(cells.parent().hasClass("dx-row-inserted"), "has row inserted");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    testElement.find('input').eq(1).val(99);
    testElement.find('input').eq(1).trigger('change');

    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 2, "has input");
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(cells.parent().hasClass("dx-row-inserted"), "not save the edit data");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

QUnit.test("Show tooltip on focus with set validate in column and edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $('#container'),
        $cells,
        $overlayElement,
        overlayInstance,
        $inputElement;

    rowsView.render($testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name',
            {
                dataField: 'age',
                validationRules: [{ type: "range", min: 1, max: 100 }]
            },
            'lastName'
        ]
    });

    that.editorFactoryController._getFocusedElement = function($dataGridElement) {
        return $testElement.find("input");
    };

    $cells = rowsView.element().find('tbody > tr').first().find("td");

    //act
    that.editCell(0, 1);

    //assert
    assert.equal(getInputElements($testElement).length, 1, "has input");

    //act
    $inputElement = getInputElements($testElement).first();
    $inputElement.val(101);
    $inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    $cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(!getInputElements($testElement).length, "not has input");
    assert.ok($cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok($cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    //act
    $cells.eq(1).trigger("dxclick");
    that.clock.tick();

    $cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    $overlayElement = $cells.eq(1).find(".dx-overlay");
    assert.equal(getInputElements($testElement).length, 1, "has input");
    assert.equal($overlayElement.length, 1, "has overlay element");

    //T335660
    overlayInstance = $overlayElement.dxOverlay("instance");
    assert.ok(overlayInstance, "has overlay instance");
    assert.ok(overlayInstance.option("target").hasClass("dx-highlight-outline"), "target of the overlay");

    //act
    $inputElement = getInputElements($testElement).first();
    $inputElement.val(99);
    $inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    $cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(!getInputElements($testElement).length, "not has input");

    //act
    $cells.eq(1).trigger("dxclick");
    that.clock.tick();

    //assert
    assert.equal(getInputElements($testElement).length, 1, "has input");
    assert.ok(!$cells.eq(1).find(".dx-tooltip").length, "not has tooltip");
});

//T183197
QUnit.test("Show tooltip on focus for last row with set validate in column and edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);
    that.options.dataSource.store = [{ name: "Alex", age: 15, lastName: "John" }];
    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name',
            {
                dataField: 'age',
                validationRules: [{ type: "range", min: 1, max: 100 }]
            },
            'lastName'
        ]
    });
    rowsView.resize();

    that.editorFactoryController._getFocusedElement = function($dataGridElement) {
        return testElement.find("input");
    };

    cells = rowsView.element().find(".dx-data-row").last().find("td");

    //assert
    assert.ok(!rowsView.element().find(".dx-freespace-row").is(":visible"), "visible freespace row");

    //act
    cells.eq(1).trigger("dxclick");
    that.clock.tick();

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find(".dx-data-row").last().find("td");

    //assert
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    //act
    cells.eq(1).trigger("dxclick");
    that.clock.tick();

    cells = rowsView.element().find(".dx-data-row").last().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.equal(cells.eq(1).find(".dx-overlay").length, 1, "has tooltip");
    assert.ok(rowsView.element().find(".dx-freespace-row").is(":visible"), "visible freespace row");
    assert.ok(rowsView.element().find(".dx-freespace-row").height() > 0, "freespace row has height ");
});

//T200857
QUnit.test("Show tooltip on focus when one row with set validate in column and edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);
    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name',
            {
                dataField: 'age',
                validationRules: [{ type: "range", min: 1, max: 100 }]
            },
            'lastName'
        ]
    });
    rowsView.resize();

    that.editorFactoryController._getFocusedElement = function($dataGridElement) {
        return testElement.find("input");
    };

    cells = rowsView.element().find(".dx-data-row").last().find("td");

    //assert
    assert.ok(!rowsView.element().find(".dx-freespace-row").is(":visible"), "visible freespace row");

    //act
    cells.eq(1).trigger("dxclick");
    that.clock.tick();

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find(".dx-data-row").last().find("td");

    //assert
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    //act
    cells.eq(1).trigger("dxclick");
    that.clock.tick();

    cells = rowsView.element().find(".dx-data-row").last().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.equal(cells.eq(1).find(".dx-overlay").length, 1, "has tooltip");
    assert.ok(!rowsView.element().find(".dx-freespace-row").is(":visible"), "visible freespace row");
});

//T470216
QUnit.test("Tooltip should be positioned by left side when the drop-down editor is shown", function(assert) {
    //arrange
    var that = this,
        tooltipInstance,
        selectBoxInstance,
        rowsView = that.rowsView,
        $testElement = $("#container");

    rowsView.render($testElement);
    that.applyOptions({
        editing: {
            mode: "batch",
            allowUpdating: true
        },
        columns: [
            "age",
            "lastName",
            {
                dataField: "name",
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: that.array,
                    displayExpr: "name",
                    valueExpr: "name"
                }
            }
        ]
    });
    that.editorFactoryController._getFocusedElement = function() {
        return $testElement.find("input");
    };

    that.cellValue(0, 2, "");
    that.editCell(0, 2);
    that.clock.tick();

    //assert
    tooltipInstance = $testElement.find("tbody td").eq(2).find(".dx-overlay.dx-invalid-message").dxOverlay("instance");
    assert.ok($testElement.find("tbody td").eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(tooltipInstance.option("visible"), "tooltip is visible");
    assert.strictEqual(tooltipInstance.option("position").my, "top left", "position.my of the tooltip");
    assert.strictEqual(tooltipInstance.option("position").at, "bottom left", "position.at of the tooltip");

    //act
    getInputElements($testElement.find("tbody td").eq(2)).trigger("dxclick");
    that.clock.tick();

    //assert
    selectBoxInstance = $testElement.find("tbody td").eq(2).find(".dx-selectbox").dxSelectBox("instance");
    tooltipInstance = $testElement.find("tbody td").eq(2).find(".dx-overlay.dx-invalid-message").dxOverlay("instance");
    assert.ok(tooltipInstance.option("visible"), "tooltip is visible");
    assert.ok(selectBoxInstance.option("opened"), "drop-down editor is shown");
    assert.strictEqual(tooltipInstance.option("position").my, "top right", "position.my of the tooltip");
    assert.strictEqual(tooltipInstance.option("position").at, "top left", "position.at of the tooltip");
});

QUnit.test("Show error rows on save inserted rows when set validate in column and edit mode batch", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name', 'age', {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }],
        onRowValidating: function(options) {
            options.errorText = "Test";
        }
    });

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();
    that.addRow();
    that.addRow();

    //assert
    assert.equal(testElement.find('tbody > tr').length, 7, "count rows");

    //act
    that.saveEditData();

    cells = rowsView.element().find("td");

    //assert
    assert.ok(cells.eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(2).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.ok(cells.eq(6).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(6).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.ok(cells.eq(10).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(10).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 10, "count rows");
    assert.ok(testElement.find('tbody > tr').eq(1).hasClass("dx-error-row"), "has error row 1");
    assert.ok(testElement.find('tbody > tr').eq(3).hasClass("dx-error-row"), "has error row 2");
    assert.ok(testElement.find('tbody > tr').eq(5).hasClass("dx-error-row"), "has error row 3");
});

//T241920
QUnit.testInActiveWindow("Cell editor invalid value don't miss focus on saveEditData", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "row"
        },
        columns: ["name", "age", {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }]
    });

    //act
    this.editRow(0);
    that.clock.tick();
    var $input = rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input");

    $input.focus();
    that.clock.tick();

    //assert
    $input = rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input");
    assert.ok($input.is(":focus"), "Text editor is focused before call saveEditData");

    //act
    $input.val("");
    $input.trigger("change");

    $input = rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input");
    $input.focus();

    that.saveEditData();
    that.clock.tick();

    //assert
    assert.ok($input.is(":focus"), "Text editor is focused after call saveEditData");
    assert.ok(testElement.find(".dx-invalid-message").is(":visible"));
});

//T284398
QUnit.testInActiveWindow("Show invalid message on focus for an invalid cell of the inserted row", function(assert) {
    //arrange
    var that = this,
        $highlight,
        rowsView = this.rowsView,
        testElement = $("#container");

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "row"
        },
        columns: ["name", "age", {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }]
    });

    this.addRow();

    var $input = rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input");

    $input.focus();
    assert.ok($input.is(":focus"), "Text editor is focused before call saveEditData");
    assert.ok(!$input.closest("td").hasClass("dx-datagrid-invalid"), "passed validation");

    //assert
    that.saveEditData();
    that.clock.tick();

    //act
    $input.focus();
    that.clock.tick();

    //assert
    assert.ok($input.is(":focus"), "Text editor is focused after call saveEditData");
    assert.ok($input.closest("td").hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(testElement.find(".dx-invalid-message").is(":visible"), "visible invalid message");

    //act
    $input.val("123");
    $input.trigger("change");
    that.clock.tick();
    $input = rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input");

    //assert
    $highlight = $input.closest(".dx-highlight-outline");
    assert.ok($highlight.length, "has highlight");
    assert.ok(!$input.closest("td").hasClass("dx-datagrid-invalid"), "not has class dx-datagrid-invalid on cell");
});

QUnit.test('Show error row on save inserted Row after scrolling when set validate in column and edit mode row', function(assert) {
    //arrange
    var done = assert.async(),
        that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);
    rowsView.height(50);
    rowsView.resize();

    that.applyOptions({
        columns: ['name', 'age', {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }],
        onRowValidating: function(options) {
            options.errorText = "Test";
        }
    });

    rowsView.scrollChanged.add(function() {
        //act
        that.addRow();

        //assert
        assert.strictEqual(rowsView.getTopVisibleItemIndex(), 1, "top visible item index");
        assert.equal(getInputElements(testElement.find('tbody > tr').eq(1)).length, 3);
        assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

        //act
        that.saveEditData();

        //assert
        assert.equal(testElement.find('tbody > tr').length, 6, "count rows");
        assert.ok(testElement.find('tbody > tr').eq(1).hasClass("dx-row-inserted"), "has inserted row");
        assert.ok(testElement.find('tbody > tr').eq(2).hasClass("dx-error-row"), "has error row");
        assert.strictEqual(testElement.find('tbody > tr').eq(2).text(), "Test");
        done();
    });

    rowsView.element().dxScrollable('instance').scrollTo(25);
});

//T417962
QUnit.test('Show error row on saving invalid row when there is grouping', function(assert) {
    //arrange
    var that = this,
        $editRow,
        rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    that.applyOptions({
        columns: [{
            dataField: 'name', groupIndex: 0,
            autoExpandGroup: true
        }, 'age', {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }],
        onRowValidating: function(options) {
            options.errorText = "Test";
            options.isValid = false;
        }
    });

    //assert
    assert.equal($testElement.find('tbody > tr').length, 7, "count rows (3 group rows + 3 data rows + 1 freespace row)");

    //arrange
    that.editRow(1);

    //assert
    $editRow = $testElement.find('tbody > tr').eq(1);
    assert.ok($editRow.hasClass("dx-edit-row"), "edit row");

    //arrange
    $editRow.find("input").last().val("test");
    $editRow.find("input").last().trigger("change");

    //act
    that.saveEditData();

    //assert
    assert.equal($testElement.find('tbody > tr').length, 8, "count rows (3 group rows + 3 data rows + 1 error row + 1 freespace row)");
    assert.ok($testElement.find('tbody > tr').eq(0).hasClass("dx-group-row"), "group row (first row)");
    assert.ok($testElement.find('tbody > tr').eq(1).hasClass("dx-data-row"), "data row (second row)");
    assert.ok($testElement.find('tbody > tr').eq(2).hasClass("dx-error-row"), "error row (third row)");
});

QUnit.test('Show error row on saving row when key is set incorrectly', function(assert) {
    //arrange
    var that = this,
        $editRow,
        rowsView = this.rowsView,
        $testElement = $('#container');

    that.columnHeadersView.render($testElement);
    rowsView.render($testElement);

    that.applyOptions({
        errorRowEnabled: true,
        showColumnHeaders: true,
        dataSource: {
            store: {
                type: "array",
                key: "wrong",
                data: this.array
            }
        }
    });

    //act
    that.editRow(0);
    $editRow = $testElement.find('tbody > tr').eq(1);
    $editRow.find('input').first().val("Tom");
    $editRow.find('input').first().trigger('change');

    //assert
    assert.ok($testElement.find('.dx-error-row').length, "error row");
});

//T186431
QUnit.test("Save edit data for inserted row without validation in columns and edit mode row", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();

    //assert
    assert.equal(testElement.find(".dx-row-inserted").length, 1, "have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    that.saveEditData();

    //assert
    assert.ok(!testElement.find(".dx-row-inserted").length, "not have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

QUnit.test("Edit cell when edit mode cell and set validate in column", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    //act
    that.editCell(0, 1);
    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.editCell(0, 2);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    //act
    that.editCell(0, 2);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

QUnit.testInActiveWindow("Show the revert button when an edit cell to invalid value when the edit mode cell is enabled", function(assert) {
    //arrange
    var testElement = $('#container'),
        $cells,
        inputElement;

    this.rowsView.render(testElement);

    this.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    //act
    this.editCell(0, 1);

    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    inputElement = getInputElements($cells).first();
    inputElement.val(101);
    inputElement.trigger('change');

    var showRevertButton = this.editorFactoryController._showRevertButton,
        that = this,
        $cellWithRevertButton;

    this.editorFactoryController._showRevertButton = function($cell, $targetElement) {
        $cellWithRevertButton = $cell;
        $.proxy(showRevertButton, that.editorFactoryController)($cell, $targetElement);
    };

    this.editCell(0, 2);
    this.clock.tick();

    //assert
    assert.equal($cellWithRevertButton.index(), 1, "cell index where the revert button is located");
    assert.equal($cellWithRevertButton.parent().index(), 0, "row index where the revert button is located");
    assert.equal($(".dx-datagrid-revert-tooltip").length, 2, "tooltip with revert button");
    assert.equal($(".dx-revert-button").length, 1, "revert button");
    //T494489
    assert.equal($(".dx-revert-button").closest(testElement).length, 1, "revert button is rendered in DataGrid container");
});

//T297742
QUnit.testInActiveWindow("Show the revert button when an edit cell, server returns error and the edit mode cell is enabled", function(assert) {
    //arrange
    var testElement = $('#container'),
        $cells,
        inputElement;

    this.rowsView.render(testElement);

    this.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', {
            dataField: 'age'
        }, "lastName"]
    });

    this.dataController.store().update = function() {
        return $.Deferred().reject("Test Error");
    };

    //act
    this.editCell(0, 1);

    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    inputElement = getInputElements($cells).first();
    inputElement.val(101);
    inputElement.trigger('change');

    var showRevertButton = this.editorFactoryController._showRevertButton,
        that = this,
        $cellWithRevertButton;

    this.editorFactoryController._showRevertButton = function($cell, $targetElement) {
        $cellWithRevertButton = $cell;
        $.proxy(showRevertButton, that.editorFactoryController)($cell, $targetElement);
    };

    this.editCell(0, 2);
    this.clock.tick();

    //assert
    assert.equal($cellWithRevertButton.index(), 1, "cell index where the revert button is located");
    assert.equal($cellWithRevertButton.parent().index(), 0, "row index where the revert button is located");
    assert.equal($(".dx-datagrid-revert-tooltip").length, 2, "tooltip with revert button");
    assert.equal($(".dx-revert-button").length, 1, "revert button");
});

QUnit.testInActiveWindow("Change hint for revert button", function(assert) {
    //arrange
    var testElement = $('#container');

    this.rowsView.render(testElement);

    this.applyOptions({
        editing: {
            mode: "cell",
            texts: {
                validationCancelChanges: "Cancel test bla"
            }
        },
        columns: ["name", {
            dataField: "age",
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    //act
    this.editCell(0, 1);

    var $cells = this.rowsView.element().find("tbody > tr").first().find("td");
    var $input = getInputElements($cells).first();
    $input.val(101);
    $input.trigger("change");
    this.clock.tick();

    //assert
    assert.equal($(".dx-revert-button").attr("title"), "Cancel test bla", "hint for revert button");
});

QUnit.test("Revert is hidden when value is valid", function(assert) {
    //arrange
    var testElement = $('#container'),
        $revertButton,
        $cells;

    this.rowsView.render(testElement);

    this.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    //act
    this.editCell(0, 1);

    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    $cells.find('input').first().val(101);
    $cells.find('input').first().trigger('change');

    this.editCell(0, 2);
    this.clock.tick();

    this.editCell(0, 1);
    this.clock.tick();

    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    $cells.find('input').first().val(16);
    $cells.find('input').first().trigger('change');

    this.editCell(0, 2);
    this.clock.tick();

    //assert
    $revertButton = $(".dx-revert-button");
    assert.equal($(".dx-datagrid-revert-tooltip").length, 0, "tooltip with revert button is not shown");
    assert.equal($revertButton.length, 0, "revert button is not shown");
});

QUnit.testInActiveWindow("Revert to an old value when the revert button is clicked", function(assert) {
    //arrange
    var testElement = $('#container'),
        $revertButton,
        $cells,
        $input;

    this.rowsView.render(testElement);

    this.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    //act
    this.editCell(0, 1);

    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    $input = getInputElements($cells).first();
    $input.val(101);
    $input.trigger('change');
    this.clock.tick();

    $revertButton = $(".dx-revert-button");

    //assert
    assert.equal($revertButton.length, 1, "revert button is shown");

    //act
    $revertButton.trigger("dxclick");
    this.clock.tick();

    //assert
    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    $revertButton = $(".dx-revert-button");
    assert.equal($cells.eq(1).text(), "15", "old value");
    assert.equal($(".dx-datagrid-revert-tooltip").length, 0, "tooltip with revert button is not shown");
    assert.equal($revertButton.length, 0, "revert button is not shown");
});

QUnit.test("Revert button is not shown when the height light css class is not applied", function(assert) {
    //arrange
    var testElement = $('#container'),
        $cells;

    this.rowsView.render(testElement);

    this.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    //act
    this.editCell(0, 1);

    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    this.editorFactoryController._showRevertButton($cells.eq(0));

    //assert
    assert.equal($(".dx-datagrid-revert-tooltip").length, 0);
});

QUnit.testInActiveWindow("Save a valid value for an invalid cell when focus in other invalid cell", function(assert) {
    //arrange
    var testElement = $('#container'),
        $cells,
        $input;

    this.rowsView.render(testElement);

    this.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: [
            {
                dataField: 'name',
                validationRules: [{ type: "compare", comparisonTarget: function() {
                    return "Test";
                } }]
            },
            {
                dataField: 'age',
                validationRules: [{ type: "range", min: 16, max: 100 }]
            }, "lastName"]
    });

    //act
    this.editCell(0, 1);
    this.clock.tick();

    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    $input = getInputElements($cells).first();
    $input.val(99);
    $input.trigger('change');

    this.editCell(1, 1);
    this.clock.tick();

    this.editCell(0, 0);
    this.clock.tick();

    //assert
    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    assert.equal(getInputElements($cells).val(), "Alex", "text of cell 0 row 0");

    //act
    var showRevertButton = this.editorFactoryController._showRevertButton,
        that = this,
        $cellWithRevertButton;

    this.editorFactoryController._showRevertButton = function($cell, $targetElement) {
        $cellWithRevertButton = $cell;
        $.proxy(showRevertButton, that.editorFactoryController)($cell, $targetElement);
    };
    this.editCell(0, 1);
    this.clock.tick();

    //assert
    $cells = this.rowsView.element().find('tbody > tr').first().find("td");
    assert.equal($cellWithRevertButton.index(), 0, "cell index where the revert button is located");
    assert.equal($cellWithRevertButton.parent().index(), 0, "row index where the revert button is located");
    assert.equal(getInputElements($cells).val(), "Alex", "text of cell 0 row 0");
    assert.equal($cells.eq(1).text(), "99", "text of cell 1 row 0");
});

QUnit.test("Keep cell editing when onRowUpdating is canceled (cell edit mode)", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        editingController = that.editingController,
        testElement = $('#container'),
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', 'age', "lastName"],
        onRowUpdating: function(e) {
            e.cancel = true;
        }
    });

    that.editingController.optionChanged({ name: "onRowUpdating" });

    //act
    that.editCell(0, 1);
    that.clock.tick();

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');
    that.clock.tick();

    that.editCell(0, 2);
    that.clock.tick();

    //assert
    assert.equal(editingController._editRowIndex, 0, "Correct editRowIndex");
    assert.equal(editingController._editColumnIndex, 1, "Second cell still editing");
});

QUnit.test("Insert row when set validate in column and edit mode cell", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    that.editCell(0, 1);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.editCell(1, 1);

    cells = rowsView.element().find("td");

    //assert
    //equal(getInputElements(testElement).length, 1, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    that.editCell(1, 1);
    that.clock.tick();

    cells = rowsView.element().find("td");

    //assert
    assert.ok(getInputElements(testElement).length, "not has input");
    assert.ok(!cells.find(".dx-datagrid-invalid").length, "not validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

QUnit.test('Edit cell with edit mode batch and change page', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    that.dataController.pageSize(2);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");

    //act
    that.editCell(0, 1);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 0, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    //act
    that.dataController.pageIndex(1);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "not failed validation");
    assert.equal(testElement.find('tbody > tr').length, 2, "count rows");

    //act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

//T495625
QUnit.test('Row with invalid values should move to current page after saving if cancel updating in onRowUpdating event', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        onRowUpdating: function(e) {
            e.cancel = true;
        },
        editing: {
            mode: "batch"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });
    that.editingController.optionChanged({ name: "onRowUpdating" });


    that.dataController.pageSize(2);

    //act
    that.editCell(0, 1);
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');
    that.dataController.pageIndex(1);

    //assert
    assert.equal(testElement.find('.dx-data-row').length, 1, "row count before save");

    //act
    that.editCell(0, 1);
    inputElement = getInputElements(testElement).first();
    inputElement.val(50);
    inputElement.trigger('change');
    that.closeEditCell();
    that.clock.tick();
    that.saveEditData();

    //assert
    assert.equal(testElement.find('.dx-data-row').length, 2, "row count after save");
    assert.equal(testElement.find('.dx-data-row').eq(0).children().eq(1).text(), "101", "first row age value");
    assert.equal(testElement.find('.dx-data-row').eq(0).find(".dx-datagrid-invalid").length, 1, "first row contains invalid value");
    assert.equal(testElement.find('.dx-data-row').eq(1).children().eq(1).text(), "50", "second row age value");
    assert.equal(testElement.find('.dx-data-row').eq(1).find(".dx-datagrid-invalid").length, 0, "second row does not contain invalid value");
    assert.equal(testElement.find('.dx-data-row').eq(1).find(".dx-cell-modified").length, 1, "second row contains modified value");
});

QUnit.test('Edit cell with edit mode batch and sorting', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        sorting: {
            mode: "single"
        },
        editing: {
            mode: "batch"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }],
            allowSorting: true
        }, "lastName"]
    });

    that.dataController.pageSize(2);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");

    //act
    that.editCell(0, 1);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 0, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    //act
    that.columnsController.changeSortOrder(1, "desc");

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "not failed validation");
    assert.ok(!cells.eq(1).children().first().hasClass("dx-highlight-outline"), "not has highlight");
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");

    //act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

QUnit.test('Edit cell with edit mode batch and filtering', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        cells,
        inputElement;

    rowsView.render(testElement);
    this.columnHeadersView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.editCell(0, 1);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(getInputElements(testElement).length, 0, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    //act
    that.columnsController.columnOption(1, "filterValue", 17);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "not failed validation");
    assert.ok(!cells.eq(1).children().first().hasClass("dx-highlight-outline"), "not has highlight");
    assert.equal(testElement.find('tbody > tr').length, 2, "count rows");

    //act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    //assert
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

//T186431
QUnit.test("Save edit data for inserted row without validation in columns and edit mode cell", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "cell"
        }
    });

    //assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    //act
    that.addRow();

    //assert
    assert.equal(testElement.find(".dx-row-inserted").length, 1, "have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    //act
    that.saveEditData();

    //assert
    assert.ok(!testElement.find(".dx-row-inserted").length, "not have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

//T238387
QUnit.test('Call onRowValidating when validation passed for edit mode batch', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        countCallOnRowValidating = 0,
        testElement = $('#container');

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: 'batch',
            allowUpdating: true
        },
        columns: ['name', 'age', {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }],
        onRowValidating: function() {
            countCallOnRowValidating++;
        }
    });

    that.editCell(0, 0);

    //assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    //act
    testElement.find('input').first().val("Tom");
    testElement.find('input').first().trigger('change');

    //act
    that.saveEditData();

    assert.strictEqual(testElement.find("tbody > tr").first().find("td").first().text(), "Tom", "text an updated cell");
    assert.equal(countCallOnRowValidating, 1, "count call onRowValidating");
});

//T238387
QUnit.test('Call onRowValidating when validation passed for edit mode row', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        countCallOnRowValidating = 0,
        testElement = $('#container');

    rowsView.render(testElement);

    that.applyOptions({
        columns: ['name', 'age', {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }],
        onRowValidating: function() {
            countCallOnRowValidating++;
        }
    });

    that.editRow(0);

    //assert
    assert.equal(getInputElements(testElement).length, 3, "has input");

    //act
    testElement.find('input').first().val("Tom");
    testElement.find('input').first().trigger('change');

    //act
    that.saveEditData();

    assert.strictEqual(testElement.find("tbody > tr").first().find("td").first().text(), "Tom", "text an updated cell");
    assert.equal(countCallOnRowValidating, 1, "count call onRowValidating");
});

//T330770
QUnit.test('Do not call onRowValidating on row deleting for edit mode row', function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        countCallOnRowValidating = 0,
        testElement = $('#container');

    rowsView.render(testElement);

    that.applyOptions({
        columns: ['name', 'age', {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }],
        onRowValidating: function() {
            countCallOnRowValidating++;
        }
    });

    //act
    that.deleteRow(0);

    assert.strictEqual(testElement.find("tbody > tr").first().find("td").first().text(), "Dan", "First row is removed");
    assert.equal(countCallOnRowValidating, 0, "onRowValidating in not called");
});

//T393606
QUnit.test("Not create validator for group column with validationRules when edit mode is 'row'", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        $rowElement,
        $testElement = $('#container');

    rowsView.render($testElement);
    that.applyOptions({
        columns: [{ dataField: 'name', validationRules: [{ type: "required" }] }, 'age', {
            dataField: "lastName",
            groupIndex: 0,
            autoExpandGroup: true,
            validationRules: [{ type: "required" }]
        }]
    });

    //act
    that.editRow(1);

    //assert
    $rowElement = $testElement.find(".dx-data-row").first();
    assert.ok($rowElement.hasClass("dx-edit-row"), "has edit row");
    assert.equal($rowElement.children(".dx-validator").length, 1, "count cell with validation");
    assert.ok($rowElement.children().eq(1).hasClass("dx-validator"), "has validation on first cell");
});

//T393606
QUnit.test("Not create validator for group column with validationRules when edit mode is 'form'", function(assert) {
    //arrange
    var that = this,
        rowsView = that.rowsView,
        $rowElement,
        $testElement = $('#container');

    rowsView.render($testElement);
    that.applyOptions({
        editing: {
            mode: "form",
            allowUpdating: true
        },
        columns: [{ dataField: 'name', validationRules: [{ type: "required" }] }, 'age', {
            dataField: "lastName",
            groupIndex: 0,
            autoExpandGroup: true,
            validationRules: [{ type: "required" }]
        }],
        masterDetail: {
            enabled: false
        }
    });

    //act
    that.editRow(1);

    //assert
    $rowElement = $testElement.find("tbody > tr").eq(1);
    assert.ok($rowElement.hasClass("dx-datagrid-edit-form"), "has edit form");
    assert.equal($rowElement.find(".dx-validator").length, 2, "count cell with validation");
    assert.ok(!$rowElement.children(".dx-datagrid-group-space").hasClass("dx-validator"), "no validator in group space cell");
});

//T472946
QUnit.test("Inserting row - Editor should not be validated when edit mode is 'form'", function(assert) {
    //arrange
    var $editorElements,
        $testElement = $('#container');

    this.rowsView.render($testElement);

    this.applyOptions({
        editing: {
            mode: "form",
            allowAdding: true
        },
        columns: [
            {
                dataField: 'name',
                validationRules: [{ type: "required" }]
            }, "age", "lastName"]
    });

    //act
    this.addRow();
    this.clock.tick();

    //assert
    $editorElements = $testElement.find('tbody > tr').first().find("td").first().find(".dx-texteditor");
    assert.strictEqual($editorElements.length, 3, "count editor");
    assert.notOk($editorElements.first().hasClass("dx-invalid"), "valid value of the first editor");
});

QUnit.test("It's impossible to save new data when editing form is invalid", function(assert) {
    //arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        $formRow,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "form",
            allowUpdating: true,
            form: {
                items: [{
                    dataField: 'name',
                    isRequired: true
                }]
            }
        },
        columns: ['name', 'age']
    });

    //act
    that.editRow(0);
    $formRow = rowsView.getRow(0);

    inputElement = getInputElements(testElement).first();
    inputElement.val("");
    inputElement.trigger('change');

    that.saveEditData();
    that.clock.tick();

    //assert
    assert.equal(that.editingController._editRowIndex, 0, "first row is still editing");
    assert.equal($formRow.find(".dx-invalid").length, 1, "There is one invalid editor in first row");
});


QUnit.module('Editing with real dataController with grouping, masterDetail', {
    beforeEach: function() {
        this.array = [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2 },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3 },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4 },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5 },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6 },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
        ];
        this.columns = ['name', 'age', { dataField: "lastName", allowEditing: false }, 'phone', 'room'];
        this.options = {
            errorRowEnabled: true,
            editing: {
                allowUpdating: true,
                mode: 'row'
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: {
                asyncLoadEnabled: false,
                store: this.array,
                paginate: true
            },
            grouping: {
                autoExpandAll: true
            },
            masterDetail: {
                enabled: false,
                template: function($container, options) {
                    $container.dxDataGrid({
                        loadingTimeout: 0,
                        columns: ['name'],
                        dataSource: [{ name: 'test1' }, { name: 'test2' }]
                    });
                }
            }
        };

        setupDataGridModules(this, ['data', 'columns', 'rows', 'editing', 'editorFactory', 'selection', 'headerPanel', 'grouping', 'masterDetail'], {
            initViews: true
        });

        this.applyOptions = function(options) {
            $.extend(true, this.options, options);
            this.columnsController.init();
        };
        this.clock = sinon.useFakeTimers();
        // this.find = function($element, selector) {
        //     var $targetElement = $element.find(selector);
        //     assert.equal($targetElement.length, 1, 'one element with selector ' + '"' + selector + '" found');
        //     return $targetElement;
        // };
        this.click = function($element, selector) {
            var $targetElement = this.find($element, selector);
            $targetElement.trigger('dxclick');
            this.clock.tick();
        };

    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("When showing dxDataGrid in detail, 'select all' function of master grid must select only master's rows", function(assert) {
    //arrange
    var testElement = $('#container'),
        rowClass = "dx-row",
        rowSelectionClass = "dx-selection";

    this.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };

    this.editingController._editRowIndex = 0;

    //act
    this.rowsView.render(testElement);
    this.dataController.expandRow(this.dataController.getKeyByRowIndex(2));
    this.clock.tick();
    this.selectAll();

    //assert
    assert.ok(!testElement.find('.' + rowClass).first().hasClass(rowSelectionClass), 'row that editing now has no selection class');
    assert.equal(testElement.find('.' + rowClass).length, 13, "1 header row, 7 content rows, 3 detail row (1 header and 2 content), 2 freespace row");
    assert.equal(testElement.find('.' + rowSelectionClass).length, 6, "7 rows - 1 row that edit, 2 detail row doesn't selected");
});

//T174302
QUnit.test("Insert row without column with group closed", function(assert) {
    //arrange
    var that = this,
        testElement = $('#container');

    that.rowsView.render(testElement);

    that.applyOptions({
        editing: {
            allowAdding: true,
            mode: 'batch'
        },
        masterDetail: {
            enabled: true
        }
    });

    //assert
    assert.equal(testElement.find(".dx-datagrid-group-closed").length, 7, "count columns with group closed");

    //act
    that.addRow();

    //assert
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-inserted"), "have inserted row");
    assert.ok(!testElement.find('tbody > tr').first().find(".dx-datagrid-group-closed").length, "doesn't have column with group closed");
});

//T187148
QUnit.test("Grouping when columns with showEditorAlways true", function(assert) {
    //arrange
    var that = this,
        testElement = $('#container');

    that.rowsView.render(testElement);

    //act
    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: [{ dataField: "name", showEditorAlways: true }, { dataField: "age", showEditorAlways: true, groupIndex: 0 }, { dataField: "lastName", showEditorAlways: true }]
    });

    //assert
    assert.ok(that.rowsView.element().find('tbody > tr').first().hasClass("dx-group-row"), "group row");
    assert.ok(!that.rowsView.element().find('tbody > tr').first().find("td").last().find(".dx-texteditor").length, "doesn't have editor");
    assert.ok(that.rowsView.element().find('tbody > tr').eq(1).find("td").first().hasClass("dx-datagrid-group-space"), "has group space");
    assert.ok(!that.rowsView.element().find('tbody > tr').eq(1).find("td").first().hasClass("dx-editor-cell"), "group space not have class is dx-editor-cell");
});

//T199291
QUnit.test("Grouping when column with showWhenGrouped true", function(assert) {
    //arrange
    var that = this,
        testElement = $('#container');

    that.rowsView.render(testElement);

    //act
    that.options.columns = [];
    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: [{ dataField: "name", showEditorAlways: true }, { dataField: "age", showEditorAlways: true, groupIndex: 0, showWhenGrouped: true }, { dataField: "lastName", showEditorAlways: true }]
    });

    //assert
    assert.ok(that.rowsView.element().find('tbody > tr').eq(1).find("td").eq(2).hasClass("dx-editor-cell"), "has class is dx-editor-cell");
});

QUnit.test("Form is not validated when value of editor without validation rules is changed", function(assert) {
    var that = this,
        rowsView = this.rowsView,
        $input,
        testElement = $('#container');

    that.options.onEditorPreparing = function(e) {
        if(e.dataField === "name") {
            e.editorOptions.value = "";
        }
    };
    that.options.editing.form = {
        colCount: 4,
        customizeItem: function(item) {
            if(item.dataField === "age") {
                item.cssClass = "test";
            }
        }
    };

    this.editorFactoryController.init();
    rowsView.render(testElement);

    //act
    that.editRow(0);
    $input = testElement.find(".test input").first();
    $input.val("123");
    $input.change();

    //assert
    assert.equal(testElement.find(".dx-invalid").length, 0);
});

//T469436
QUnit.test("isEditing parameter of the row when there is grouping and edit mode is 'row'", function(assert) {
    //arrange
    var $rowElements;

    this.rowsView.render($("#container"));
    this.applyOptions({
        columns: ["name", "lastName", { dataField: "age", groupIndex: 0 }]
    });

    //assert
    $rowElements = this.rowsView.element().find('tbody > tr');
    assert.ok($rowElements.eq(0).hasClass("dx-group-row"), "group row");
    assert.ok($rowElements.eq(1).hasClass("dx-data-row"), "data row");

    //act
    this.editRow(1);

    //assert
    assert.equal(this.editingController._editRowIndex, 1, "edit row index");
    assert.ok(this.dataController.items()[1].isEditing, "second item is edited");
});

var generateDataSource = function(countItem, countColumn) {
    var items = [];

    for(var i = 1; i <= countItem; i++) {
        var item = {};
        for(var j = 1; j <= countColumn; j++) {
            item['column' + j] = 'Item' + i.toString() + j.toString();
        }
        items.push(item);
    }

    return items;
};

QUnit.module('Editing with scrolling', {
    beforeEach: function() {
        this.options = {
            dataSource: generateDataSource(11, 2),
            columns: [{ dataField: "column1", allowEditing: true }, "column2"],
            onRowPrepared: function(e) {
                e.rowElement.height(34);
            },
            paging: {
                pageSize: 4
            },
            editing: {
                mode: "batch",
                allowAdding: true,
                allowUpdating: true
            }
        };

        this.setupDataGrid = function() {
            setupDataGridModules(this, ['data', 'columns', 'rows', 'pager', 'editing', 'editorFactory', 'virtualScrolling', 'validating'], {
                initViews: true
            });
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.dispose();
    }
});

//T258714
QUnit.test("Uploading items when virtual scrolling after insert row", function(assert) {
    //arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(150);
    this.rowsView.resize();

    //assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    //act
    this.addRow();
    this.rowsView.scrollTo({ y: 100 });

    //assert
    items = this.dataController.items();
    assert.equal(this.dataController.pageIndex(), 0, "page index");
    assert.equal(items.length, 9, "count items");
    assert.ok(items[0].inserted, "insert item");
});

//T258714
QUnit.test("Change page index when virtual scrolling after insert row", function(assert) {
    //arrange
    var testElement = $('#container'),
        changeType,
        items;

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.options.dataSource = generateDataSource(100, 2);

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(150);
    this.rowsView.resize();

    //assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    //arrange
    this.addRow();
    this.rowsView.scrollTo({ y: 150 }); //append
    this.rowsView.scrollTo({ y: 300 }); //append

    //assert
    assert.equal(this.dataController.pageIndex(), 2, "page index");

    this.dataController.changed.add(function(args) {
        changeType = args.changeType;
    });

    //act
    this.rowsView.scrollTo({ y: 150 });

    //assert
    items = this.dataController.items();
    assert.strictEqual(changeType, "pageIndex", "change type");
    assert.equal(this.dataController.pageIndex(), 1, "page index");
    assert.equal(items.length, 17, "items count");
    assert.ok(items[0].inserted, "insert item");
});

//T258714
QUnit.test("Uploading items when infinite scrolling after insert row", function(assert) {
    //arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "infinite",
        useNative: false
    };

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(150);
    this.rowsView.resize();

    //assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    //act
    this.addRow();
    this.rowsView.scrollTo({ y: 150 });

    //assert
    items = this.dataController.items();
    //assert.equal(this.dataController.pageIndex(), 1, "page index");
    assert.equal(items.length, 9, "count items");
    assert.ok(items[0].inserted, "insert item");
});

//T258714
QUnit.test("Change position of the inserted row when virtual scrolling", function(assert) {
    //arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.options.dataSource = generateDataSource(100, 2);

    this.setupDataGrid();
    this.rowsView.render(testElement);
    this.rowsView.height(150);
    this.rowsView.resize();

    //assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    //arrange
    this.rowsView.scrollTo({ y: 3500 });

    //assert
    items = this.dataController.items();
    assert.equal(this.dataController.pageIndex(), 23, "page index");
    assert.equal(items.length, 8, "count items");

    //act
    this.addRow();

    //assert
    items = this.dataController.items();
    assert.equal(items.length, 9, "count items");
    assert.ok(items[4].inserted, "insert item");

    //act
    this.rowsView.scrollTo({ y: 0 });

    //assert
    items = this.dataController.items();
    assert.equal(this.dataController.pageIndex(), 0, "page index");
    assert.equal(items.length, 9, "count items");
    assert.ok(items[0].inserted, "insert item");
});

//T258714
QUnit.test("Edit row after the virtual scrolling when there is inserted row", function(assert) {
    //arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.options.dataSource = generateDataSource(100, 2);

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(150);
    this.rowsView.resize();

    //assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    //arrange
    this.addRow();
    this.rowsView.scrollTo({ y: 150 });

    //assert
    items = this.dataController.items();
    //assert.equal(this.dataController.pageIndex(), 1, "page index");
    assert.equal(items.length, 13, "count items");
    assert.ok(items[0].inserted, "insert item");

    //act
    this.editCell(5, 0);

    //assert
    assert.equal(testElement.find("input").length, 1, "has input");
    assert.equal(testElement.find("input").val(), "Item51", "text edit cell");
});

//T343567
QUnit.test("Save edit data with set onRowValidating and infinite scrolling", function(assert) {
    //arrange
    var that = this,
        $cell,
        testElement = $('#container'),
        items;

    that.options.scrolling = {
        mode: "infinite",
        useNative: false
    };

    that.options.onRowValidating = function(e) {
        e.isValid = false;
    };

    that.options.dataSource = generateDataSource(100, 2);

    that.setupDataGrid();
    that.rowsView.render(testElement);
    that.rowsView.height(200);
    that.rowsView.resize();

    //assert
    items = that.dataController.items();
    assert.equal(that.dataController.pageIndex(), 0, "page index");
    assert.equal(items.length, 8, "count items");

    //arrange
    that.editCell(3, 0);

    //assert
    assert.equal(testElement.find("input").length, 1, "has input");

    //arrange
    testElement.find("input").val("test");
    testElement.find("input").trigger("change");

    //assert
    assert.strictEqual(testElement.find("input").val(), "test", "value of the input");

    //act
    that.saveEditData();

    //assert
    $cell = testElement.find("tbody > tr").eq(3).children().first();
    assert.strictEqual($cell.text(), "test", "value of the cell");
    assert.ok($cell.find(".dx-highlight-outline").length, "has highlight");
});

QUnit.test("Save inserted data with set onRowValidating and infinite scrolling", function(assert) {
    //arrange
    var that = this,
        testElement = $('#container'),
        items;

    that.options.scrolling = {
        mode: "infinite",
        useNative: false
    };

    that.options.onRowValidating = function(e) {
        e.isValid = false;
    };

    that.options.dataSource = generateDataSource(100, 2);

    that.setupDataGrid();
    that.rowsView.render(testElement);
    that.rowsView.height(200);
    that.rowsView.resize();

    //assert
    assert.equal(that.dataController.pageIndex(), 0, "page index");
    assert.equal(that.dataController.items().length, 8, "count items");

    //arrange
    that.rowsView.scrollTo({ y: 500 });

    //assert
    assert.equal(that.dataController.pageIndex(), 2, "page index");
    assert.equal(that.dataController.items().length, 16, "count items");

    //arrange
    that.addRow();
    that.clock.tick();

    //assert
    assert.equal(that.dataController.items().length, 17, "count items");

    //arrange
    that.rowsView.scrollTo({ y: 0 });

    //assert
    assert.equal(that.dataController.pageIndex(), 0, "page index");

    //act
    that.saveEditData();

    //assert
    items = that.dataController.items();
    assert.equal(items.length, 17, "count items");
    assert.ok(items[0].inserted, "inserted item");
});

//T258714
QUnit.test("Edit row after the infinite scrolling when there is inserted row", function(assert) {
    //arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "infinite",
        useNative: false
    };

    this.options.dataSource = generateDataSource(100, 2);

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(150);
    this.rowsView.resize();

    //assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    //arrange
    this.addRow();
    this.rowsView.scrollTo({ y: 150 });

    //assert
    items = this.dataController.items();
    //assert.equal(this.dataController.pageIndex(), 1, "page index");
    assert.equal(items.length, 9, "count items");
    assert.ok(items[0].inserted, "insert item");

    //act
    this.editCell(5, 0);

    //assert
    assert.equal(testElement.find("input").length, 1, "has input");
    assert.equal(testElement.find("input").val(), "Item51", "text edit cell");
});


QUnit.module('Edit Form', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.array = [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2 },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3 },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4 },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5 },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6 },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
        ];
        this.columns = [{
            dataField: 'name',
            validationRules: [{ type: 'required' }]
        }, 'age', {
            dataField: "lastName",
            allowEditing: false,
            validationRules: [{ type: 'required' }]
        }, { dataField: 'phone' }, 'room'];

        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: 'form',
                allowUpdating: true
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: {
                asyncLoadEnabled: false,
                store: this.array,
                paginate: true
            },
            masterDetail: {
                enabled: false,
                template: function($container, options) {
                    $container.dxDataGrid({
                        columns: ['name'],
                        dataSource: [{ name: 'test1' }, { name: 'test2' }]
                    });
                }
            }
        };

        this.setupModules = function(that) {
            setupDataGridModules(that, ['data', 'columns', 'rows', 'masterDetail', 'editing', 'editorFactory', 'selection', 'headerPanel', 'columnFixing', 'validating'], {
                initViews: true
            });
        };

        this.find = function($element, selector) {
            var $targetElement = $element.find(selector);
            QUnit.assert.equal($targetElement.length, 1, 'one element with selector ' + '"' + selector + '" found');
            return $targetElement;
        };
        // this.click = function($element, selector) {
        //     var $targetElement = thatfind($element, selector);
        //     $targetElement.trigger('dxclick');
        //     this.clock.tick();
        // };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("Edit link call editRow", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing.form = {
        colCount: 4
    };

    that.editingController.editRow = sinon.spy();

    rowsView.render(testElement);

    var rowIndex = 2;

    //act
    var $links = testElement.find(".dx-row").eq(rowIndex).find(".dx-link-edit");
    assert.equal($links.length, 1, "edit links count");
    $links.eq(0).trigger("dxclick");
    this.clock.tick();

    //assert
    assert.equal(that.editingController.editRow.callCount, 1, "editRow called");
    assert.deepEqual(that.editingController.editRow.getCall(0).args, [rowIndex], "editRow args");
});

QUnit.test("Render detail form row", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing.form = {
        colCount: 4
    };

    rowsView.render(testElement);

    //act
    that.editRow(0);

    //assert
    assert.equal(that.dataController.items()[0].rowType, "detail", "first row type is detail");
    assert.equal(that.dataController.items()[1].rowType, "data", "second row type is data");

    var $firstRow = testElement.find(".dx-row").eq(0);

    assert.equal($firstRow.hasClass("dx-master-detail-row"), 1, "first row is master detail row");
    assert.equal($firstRow.find(".dx-form").length, 1, "first row has form");
    assert.equal($firstRow.find(".dx-button").length, 2, "first row has two buttons");
    assert.equal($firstRow.find(".dx-texteditor").length, 5, "5 editors in form");

    var form = $firstRow.find(".dx-form").dxForm("instance");

    assert.equal(form.option("colCount"), 4, "colCount option from editing.form.colCount");
    var items = form._testResultItems;
    assert.equal(items.length, 5, "form items count");
    assert.equal(items[1].dataField, "age", "item 1 dataField");
    assert.equal(items[1].column.index, 1, "item 1 column index");
    assert.ok(items[1].template, "item 1 template is defined");
    assert.equal(items[1].label.text, "Age", "item 1 template is defined");
    assert.ok($firstRow.find(".dx-texteditor").eq(1).data("dxNumberBox"), "item 1 editor type is number");
    assert.strictEqual(this.columns[2].allowEditing, false, "column 2 allowEditing false");
    assert.ok($firstRow.find(".dx-texteditor").eq(2).hasClass("dx-state-readonly"), "column 2 is read only");
});

QUnit.test("Render detail form row several times", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing.form = {
        colCount: 4
    };

    rowsView.render(testElement);

    //act
    that.editRow(0);
    that.editRow(1);

    //assert
    assert.equal(that.dataController.items()[0].rowType, "data", "first row type is detail");
    assert.equal(that.dataController.items()[1].rowType, "detail", "second row type is data");

    var $firstRow = testElement.find(".dx-row").eq(0);
    var $secondRow = testElement.find(".dx-row").eq(1);

    assert.ok($firstRow.hasClass("dx-data-row"), "first row is data row");
    assert.equal($firstRow.find(".dx-form").length, 0, "first row has form");
    assert.equal($firstRow.find(".dx-button").length, 0, "first row has two buttons");

    assert.ok($secondRow.hasClass("dx-master-detail-row"), "second row is master detail row");
    assert.equal($secondRow.find(".dx-form").length, 1, "second row has form");
    assert.equal($secondRow.find(".dx-button").length, 2, "second row has two buttons");
});

QUnit.test("Render detail form row with custom editCellTemplate", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    var editCellTemplateOptions;

    rowsView.render(testElement);

    this.columnOption("phone", "editCellTemplate", function($container, options) {
        $container.addClass("test-editor");
        editCellTemplateOptions = options;
    });

    //act
    that.editRow(0);

    //assert
    var $firstRow = testElement.find(".dx-row").eq(0);
    assert.equal($firstRow.find(".dx-form").length, 1, "first row has form");
    assert.equal($firstRow.find(".test-editor").length, 1, "editCellTemplate is rendered in edit form");
    assert.equal(editCellTemplateOptions.column.dataField, "phone", "editCellTemplate options column");
    assert.equal(editCellTemplateOptions.rowType, "detail", "editCellTemplate rowType");
    assert.equal(editCellTemplateOptions.columnIndex, 3, "editCellTemplate columnIndex");
    assert.equal(editCellTemplateOptions.rowIndex, 0, "editCellTemplate rowIndex");
    assert.equal(editCellTemplateOptions.value, "555555", "editCellTemplate value");
    assert.equal(typeof editCellTemplateOptions.setValue, "function", "editCellTemplate setValue exists");
});

//T434382
QUnit.test("Render detail form with band columns", function(assert) {
    //arrange
    var that = this,
        form,
        items,
        $testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true
    };
    that.options.columns = [{ caption: "Person data", columns: ["name", "lastName"] }, "age"];

    that.setupModules(that);
    that.rowsView.render($testElement);

    //act
    that.editRow(0);

    //assert
    form = $testElement.find("tbody > tr").first().find(".dx-form").dxForm("instance");
    items = form._testResultItems;
    assert.equal(items.length, 3, "form items count");
    assert.equal(items[0].dataField, "name", "dataField of the first item");
    assert.equal(items[1].dataField, "lastName", "dataField of the second item");
    assert.equal(items[2].dataField, "age", "dataField of the third item");
});

QUnit.test("customizeItem handler", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    var customizeItems = [];
    that.options.editing.form = {
        customizeItem: function(item) {
            customizeItems.push(item);
        }
    };


    rowsView.render(testElement);

    this.columnOption("phone", "formItem", {
        visible: false
    });

    //act
    that.editRow(0);

    //assert
    assert.equal(customizeItems.length, 5, "customizeItem call count");
    assert.equal(customizeItems[3].dataField, "phone", "phone item");
    assert.strictEqual(customizeItems[3].visible, false, "phone item visibility form column.form");
    assert.ok(customizeItems[3].template, "phone item template is defined");
});

QUnit.test("Custom items", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true,
        form: {
            items: [{
                dataField: "name"
            }, {
                dataField: "phone"
            }, {
                dataField: "custom"
            }]
        }
    };

    rowsView.render(testElement);

    //act
    that.editRow(0);

    //assert
    var formItems = testElement.find(".dx-form").dxForm("instance")._testResultItems;

    assert.equal(formItems.length, 3, "form item count");
    assert.equal(formItems[0].column.dataField, "name", "form item 0 column");
    assert.equal(formItems[1].column.dataField, "phone", "form item 1 column");
    assert.ok(!formItems[2].column, "form item 2 no column");
    assert.ok(formItems[0].template, "form item 0 have template");
    assert.ok(formItems[1].template, "form item 1 have template");
    assert.ok(!formItems[2].template, "form item 2 have no template");
});

QUnit.test("Save and cancel buttons", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing.texts = {
        saveRowChanges: "Save",
        cancelRowChanges: "Cancel"
    };

    rowsView.render(testElement);

    that.editingController.saveEditData = sinon.spy();
    that.editingController.cancelEditData = sinon.spy();

    that.editRow(0);

    //assert
    var $formCell = testElement.find(".dx-master-detail-cell");

    var $buttonsContainer = $formCell.find(".dx-datagrid-form-buttons-container");

    assert.equal($formCell.length, 1, "form cell count");
    assert.equal($buttonsContainer.length, 1, "buttons container exists");
    var $buttons = $buttonsContainer.find(".dx-button");
    assert.equal($buttons.length, 2, "two buttons in buttons container");
    assert.equal($buttons.eq(0).text(), "Save", "first button text");
    assert.equal($buttons.eq(1).text(), "Cancel", "second button text");

    //act
    $buttons.eq(0).trigger("dxclick");

    //assert
    assert.equal(that.editingController.saveEditData.callCount, 1, "Save button call saveEditData");
    assert.equal(that.editingController.cancelEditData.callCount, 0, "Save button do not call cancelEditData");

    //act
    $buttons.eq(1).trigger("dxclick");

    //assert
    assert.equal(that.editingController.saveEditData.callCount, 1, "Save button do not call saveEditData");
    assert.equal(that.editingController.cancelEditData.callCount, 1, "Save button call cancelEditData");
});

QUnit.test("Save data via the save button", function(assert) {
    var $buttons,
        testElement = $('#container');

    this.options.columns = ["name", "age", "lastName", "phone", "room"];
    this.options.editing.texts = {
        saveRowChanges: "Save",
        cancelRowChanges: "Cancel"
    };

    this.setupModules(this);

    this.rowsView.render(testElement);

    this.editRow(0);
    testElement.find("input").first().val("Test123");
    testElement.find("input").first().trigger("change");

    //act
    $buttons = testElement.find(".dx-master-detail-cell .dx-datagrid-form-buttons-container .dx-button");
    $buttons.eq(0).trigger("dxclick");

    //assert
    assert.equal(testElement.find(".dx-row").eq(0).children().eq(0).text(), "Test123", "first cell saved");
    assert.equal(testElement.find(".dx-row").eq(0).children().eq(2).text(), "John", "third cell is not saved");
});

QUnit.test("Edit and save form", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    //act
    that.editRow(0);
    testElement.find("input").first().val("Test123");
    testElement.find("input").first().trigger("change");
    that.saveEditData();


    //assert
    assert.ok(testElement.find(".dx-row").eq(0).hasClass("dx-data-row"), "first row is data row after save");
    assert.equal(testElement.find(".dx-row").eq(0).children().eq(0).text(), "Test123", "first cell saved");
    assert.equal(testElement.find(".dx-row").eq(0).children().eq(2).text(), "John", "third cell is not saved");
});

QUnit.test("Cancel edit form", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save",
            cancelRowChanges: "Cancel",
        }
    };

    rowsView.render(testElement);

    //act
    that.editRow(0);
    that.cancelEditData();

    //assert
    assert.ok(testElement.find(".dx-row").eq(0).hasClass("dx-data-row"), "first row is data row after save");
});

QUnit.test("Data is not saved when an invisible column contains a validation rules", function(assert) {
    this.options.columns = [{
        dataField: "name",
        visible: false,
        validationRules: [{ type: 'required' }]
    }, "age"];

    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    //act
    that.addRow();
    that.saveEditData();

    //assert
    assert.equal($(".dx-datagrid-edit-form .dx-invalid").length, 1, "invalid form items count");
});

QUnit.test("Edit and save form with invalid data", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    var rowValidatingArgs = [];

    that.element = function() {
        return testElement;
    };
    that.options.onRowValidating = function(e) {
        rowValidatingArgs.push(e);
    };

    that.validatingController.optionChanged({ name: "onRowValidating" });

    rowsView.render(testElement);


    //act
    that.editRow(0);
    testElement.find("input").eq(0).val("");
    testElement.find("input").eq(0).trigger("change");
    that.saveEditData();

    testElement.find("input").eq(0).focus();

    this.clock.tick();

    //assert
    assert.ok(testElement.find(".dx-row").eq(0).hasClass("dx-master-detail-row"), "first row is master detail");
    assert.ok(testElement.find(".dx-row").eq(0).find(".dx-texteditor").eq(0).hasClass("dx-invalid"), "first editor is invalid");
    assert.strictEqual(rowValidatingArgs.length, 1, "onRowValidating call count");
    assert.strictEqual(rowValidatingArgs[0].isValid, false, "isValid false");
    assert.strictEqual(rowValidatingArgs[0].brokenRules.length, 1, "brokenRules count");
    //T309532
    assert.equal(testElement.find(".dx-row").eq(0).find(".dx-texteditor").eq(0).find(".dx-overlay").length, 1, "invalid message exists");
});

//T309524
QUnit.test("Custom items with editorOptions", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true,
        form: {
            items: [{
                editorOptions: {
                    readOnly: true
                },
                dataField: "name"
            }, {
                dataField: "phone"
            }, {
                dataField: "custom"
            }]
        }
    };

    rowsView.render(testElement);

    //act
    that.editRow(0);

    //assert
    var $textEditors = testElement.find(".dx-form .dx-texteditor");

    assert.equal($textEditors.length, 3, "text editor count");
    assert.equal($textEditors.eq(0).dxTextBox("instance").option("readOnly"), true, "item 0 readOnly true from editorOptions");
    assert.equal($textEditors.eq(1).dxTextBox("instance").option("readOnly"), false, "item 1 readOnly false by default");
});

QUnit.test("Custom items with editorOptions in column", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true,
        form: {
            items: [{
                dataField: "name"
            }, {
                dataField: "phone"
            }, {
                dataField: "custom"
            }]
        }
    };

    rowsView.render(testElement);

    that.columnOption(0, "editorOptions", { readOnly: true });

    //act
    that.editRow(0);

    //assert
    var $textEditors = testElement.find(".dx-form .dx-texteditor");

    assert.equal($textEditors.length, 3, "text editor count");
    assert.equal($textEditors.eq(0).dxTextBox("instance").option("readOnly"), true, "item 0 readOnly true from column editorOptions");
    assert.equal($textEditors.eq(1).dxTextBox("instance").option("readOnly"), false, "item 1 readOnly false by default");
});

QUnit.testInActiveWindow("Focus editor after click on a label", function(assert) {
    this.setupModules(this);

    var rowsView = this.rowsView,
        $labels,
        testElement = $('#container');

    this.options.editing.form = {
        colCount: 4
    };

    rowsView.render(testElement);

    //act
    this.editRow(0);
    $labels = testElement.find(".dx-datagrid-edit-form label");

    $labels.eq(0).click();
    assert.ok(testElement.find("input[id*='name']").parent().parent().hasClass("dx-state-focused"), "input with 'name' id");
    $labels.eq(1).click();
    assert.ok(testElement.find("input[id*='age']").parent().parent().hasClass("dx-state-focused"), "input with 'age' id");
    $labels.eq(2).click();
    assert.ok(testElement.find("input[id*='lastName']").parent().parent().hasClass("dx-state-focused"), "input with 'lastName' id");
    $labels.eq(3).click();
    assert.ok(testElement.find("input[id*='phone']").parent().parent().hasClass("dx-state-focused"), "input with 'phone' id");
    $labels.eq(4).click();
    assert.ok(testElement.find("input[id*='room']").parent().parent().hasClass("dx-state-focused"), "input with 'room' id");
});

//T369851
QUnit.test("no Edit link when editing with allowAdding true", function(assert) {
    //arrange
    this.options.editing = {
        mode: "form",
        allowAdding: true
    };
    this.setupModules(this);

    var rowsView = this.rowsView,
        $cells,
        $testElement = $('#container');

    //act
    rowsView.render($testElement);

    //assert
    $cells = $testElement.find('tbody > tr').first().children();
    assert.equal($cells.length, 5, "count cell");
    assert.ok(!$cells.last().hasClass("dx-command-edit"), "last cell hasn't 'dx-command-edit' class");
});

//T425138
QUnit.test("getCellElement", function(assert) {
    //arrange
    var that = this,
        $editorElements,
        $testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true
    };

    that.setupModules(that);
    that.rowsView.render($testElement);

    //act
    that.editRow(1);

    //assert
    $editorElements = $testElement.find(".dx-datagrid-edit-form-item");
    assert.equal($editorElements.length, 5, "count editor of the form");
    assert.deepEqual(that.getCellElement(1, 0)[0], $editorElements[0], "first editor");
    assert.deepEqual(that.getCellElement(1, "age")[0], $editorElements[1], "second editor");
});

//T425138
QUnit.test("getCellElement when form with custom items", function(assert) {
    //arrange
    var that = this,
        $editorElements,
        $testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true,
        form: {
            items: [{ dataField: "age" }, { dataField: "name" }]
        }
    };

    that.setupModules(that);
    that.rowsView.render($testElement);

    //act
    that.editRow(0);

    //assert
    $editorElements = $testElement.find(".dx-datagrid-edit-form-item");
    assert.equal($editorElements.length, 2, "count editor of the form");
    assert.deepEqual(that.getCellElement(0, 0)[0], $editorElements[1], "second editor");
    assert.deepEqual(that.getCellElement(0, "age")[0], $editorElements[0], "first editor");
});

//T435429
QUnit.test("Render editors after repaint of form", function(assert) {
    //arrange
    this.setupModules(this);

    var that = this,
        formInstance,
        $firstRow,
        rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    that.editRow(0);

    $firstRow = $testElement.find(".dx-row").eq(0);
    assert.equal($firstRow.hasClass("dx-master-detail-row"), 1, "first row is master detail row");
    assert.equal($firstRow.find(".dx-form").length, 1, "first row has form");
    assert.equal($firstRow.find(".dx-button").length, 2, "first row has two buttons");
    assert.equal($firstRow.find(".dx-texteditor").length, 5, "5 editors in form");

    //act
    formInstance = $firstRow.find(".dx-form").dxForm("instance");
    formInstance.repaint();

    //assert
    assert.equal($firstRow.find(".dx-texteditor").length, 5, "5 editors in form");
});

QUnit.test("Values of the editors should be correct after repaint on form", function(assert) {
    //arrange
    this.setupModules(this);

    var that = this,
        formInstance,
        $firstRow,
        $textEditors,
        rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    that.editRow(0);

    $firstRow = $testElement.find(".dx-row").eq(0);

    //act
    formInstance = $firstRow.find(".dx-form").dxForm("instance");
    $textEditors = $testElement.find(".dx-form .dx-texteditor");
    $textEditors.eq(0).dxTextBox("instance").option("value", "Bob");
    formInstance.repaint();

    //assert
    assert.equal($testElement.find(".dx-form .dx-texteditor").eq(0).dxTextBox("instance").option("value"), "Bob", "value is correct after repaint");
});


QUnit.module('Editing - "popup" mode', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.array = [
                { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 },
                { name: 'Dan', age: 16, lastName: "Skip", phone: "553355", room: 2 },
                { name: 'Vadim', age: 17, lastName: "Dog", phone: "225555", room: 3 },
                { name: 'Dmitry', age: 18, lastName: "Cat", phone: "115555", room: 4 },
                { name: 'Sergey', age: 18, lastName: "Larry", phone: "550055", room: 5 },
                { name: 'Kate', age: 20, lastName: "Glock", phone: "501555", room: 6 },
                { name: 'Dan', age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
        ];
        this.columns = [{
            dataField: 'name',
            validationRules: [{ type: 'required' }]
        }, 'age', {
            dataField: "lastName",
            validationRules: [{ type: 'required' }]
        }, { dataField: 'phone' }, 'room'];

        this.options = {
            editing: {
                mode: 'popup',
                allowUpdating: true
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: {
                asyncLoadEnabled: false,
                store: this.array,
                paginate: true
            }
        };

        this.$testElement = $("#container");

        this.setupModules = function(that) {
            setupDataGridModules(that, ['data', 'columns', 'rows', 'masterDetail', 'editing', 'editorFactory', 'selection', 'headerPanel', 'columnFixing', 'validating'], {
                initViews: true
            });

            this.editingController.component.element = function() {
                return this.$testElement;
            };
        };

        this.renderRowsView = function() {
            this.rowsView.render(this.$testElement);
        };

        this.preparePopupHelpers = function() {
            this.$editPopup = this.$testElement.find(".dx-datagrid-edit-popup");
            this.editPopupInstance = this.$editPopup.dxPopup("instance");
            this.getEditPopupContent = function() { return this.editPopupInstance.content(); };
            this.isEditingPopupVisible = function() { return this.editPopupInstance.option("visible"); };
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("Show editing popup on row adding", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    //act
    that.addRow();
    that.clock.tick();
    that.preparePopupHelpers();
    that.clock.tick();

    var $editingForm = that.getEditPopupContent().find(".dx-form");

    //assert
    assert.equal(that.$editPopup.length, 1, "There is one editing popup");
    assert.equal($editingForm.length, 1, "There is dxForm into popup");
    assert.ok(that.isEditingPopupVisible(), "Editing popup is visible");
    assert.equal($editingForm.find(".dx-texteditor").length, that.columns.length, "The expected count of editors are rendered");
    assert.equal($editingForm.find(".dx-texteditor input").val(), "", "Editor has empty initial value");
});

QUnit.testInActiveWindow("Focus the first editor at popup shown", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    //act
    that.addRow();
    that.clock.tick();
    that.preparePopupHelpers();
    that.clock.tick(700);

    var $editor = that.getEditPopupContent().find(".dx-form .dx-texteditor").first();

    //assert
    assert.ok($editor.hasClass("dx-state-focused"), "The first editor is focused");
});

QUnit.test("Show editing popup on row editing", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    //act
    that.editRow(0);
    that.clock.tick();
    that.preparePopupHelpers();

    var $editingForm = that.getEditPopupContent().find(".dx-form");

    //assert
    assert.equal(that.$editPopup.length, 1, "There is one editing popup");
    assert.equal($editingForm.length, 1, "There is dxForm into popup");
    assert.ok(that.isEditingPopupVisible(), "Editing popup is visible");
    assert.equal($editingForm.find(".dx-texteditor").length, that.columns.length, "The expected count of editors are rendered");
    assert.equal($editingForm.find(".dx-texteditor input").val(), that.array[0].name, "Editor has correct initial value");
});

QUnit.test("Editing popup hide on cancelEditData", function(assert) {
    var that = this;

    this.setupModules(that);
    this.renderRowsView();

    //act
    that.editRow(0);
    that.clock.tick();
    that.cancelEditData();
    that.clock.tick();
    that.preparePopupHelpers();

    //assert
    assert.ok(!that.isEditingPopupVisible(), "Editing popup is hidden");
});

QUnit.test("Try to add row with invalid data", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    //act
    that.addRow();
    that.clock.tick();
    that.saveEditData();
    that.clock.tick();
    that.preparePopupHelpers();

    var $invalidValidators = that.getEditPopupContent().find(".dx-invalid");

    //assert
    assert.ok(that.isEditingPopupVisible(), "Editing popup is visible");
    assert.equal($invalidValidators.length, 2, "There are 2 invalid fields");
});

QUnit.test("Save the row with an invalid data after update it's values", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    //act
    that.addRow();
    that.clock.tick();
    that.saveEditData();
    that.clock.tick();
    that.preparePopupHelpers();

    var $textBoxes = that.getEditPopupContent().find(".dx-textbox");

    $textBoxes.eq(0).dxTextBox("instance").option("value", "John");
    $textBoxes.eq(1).dxTextBox("instance").option("value", "Dow");
    that.saveEditData();

    var $newRow = that.rowsView.getRow(7);

    //assert
    assert.ok(!that.isEditingPopupVisible(), "Editing popup is hidden");
    assert.equal($newRow.text().replace(/\s/g, ""), "JohnDow", "New row contains correct data");
});

QUnit.test("Other fields didn't validate after update one dataField", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    //act
    that.addRow();
    that.clock.tick();
    that.preparePopupHelpers();

    var $textBoxes = that.getEditPopupContent().find(".dx-textbox");

    $textBoxes.eq(0).dxTextBox("instance").option("value", "John");
    that.clock.tick();

    var $invalidValidators = that.getEditPopupContent().find(".dx-invalid");

    //assert
    assert.equal($invalidValidators.length, 0, "There are no invalid fields");
});

QUnit.test("Save the row after editing", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    //act
    that.editRow(0);
    that.clock.tick();
    that.preparePopupHelpers();

    var $textBoxes = that.getEditPopupContent().find(".dx-textbox");

    $textBoxes.eq(0).dxTextBox("instance").option("value", "Mary");
    that.saveEditData();
    that.preparePopupHelpers();

    var $newRow = that.rowsView.getRow(0);

    //assert
    assert.ok(!that.isEditingPopupVisible(), "Editing popup is hidden");
    assert.equal($newRow.text().replace(/\s/g, ""), "Mary15John5555551", "Row contains new data");
});

QUnit.test("editing.popup options should apply to editing popup", function(assert) {
    var that = this;

    that.options.editing.popup = { fullScreen: true };
    that.setupModules(that);
    that.renderRowsView();

    //act
    that.editRow(0);
    that.clock.tick();
    that.preparePopupHelpers();

    //assert
    assert.ok(that.editPopupInstance.option("fullScreen"), "Editing popup shown in fullScreen mode");
});

QUnit.test("Cancel edit data when popup hide not after click on 'save' or 'cancel' button", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();
    that.clock.tick();

    var cancelEditDataSpy = sinon.spy(that.editingController, "cancelEditData");

    //act
    that.editRow(0);
    that.clock.tick();

    that.preparePopupHelpers();
    that.editPopupInstance.hide();
    that.clock.tick(600);

    //assert
    assert.ok(cancelEditDataSpy.calledOnce, "cancelEditData was called one time after the popup hide");
});

QUnit.test("EditorPreparing event have the correct parameters", function(assert) {
    var that = this,
        spyHandler = sinon.spy(),
        expectedProperties = ["parentType", "value", "setValue", "width", "cancel", "editorElement", "readOnly", "editorName", "editorOptions", "dataField", "row"];

    that.options.onEditorPreparing = spyHandler;
    that.setupModules(that);
    that.renderRowsView();
    that.clock.tick();

    //act
    that.editRow(0);
    that.clock.tick();

    var spyArgs = spyHandler.getCall(0).args;

    //assert
    expectedProperties.forEach(function(item) {
        assert.ok(spyArgs[0].hasOwnProperty(item), "The '" + item + "' property existed");
    });
});
