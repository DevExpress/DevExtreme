import $ from "jquery";
import renderer from "core/renderer";
import eventsEngine from "events/core/events_engine";
import keyboardMock from "../../helpers/keyboardMock.js";
import pointerEvents from "events/pointer";
import { Deferred } from "core/utils/deferred";

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
    <div id="container">\
        <div class="dx-datagrid">\
    </div>\
</div>';

    $("#qunit-fixture").html(markup);
});

import "common.css!";
import "generic_light.css!";

import "ui/data_grid/ui.data_grid";
import "ui/autocomplete";
import "ui/color_box";

import fx from "animation/fx";
import pointerMock from "../../helpers/pointerMock.js";
import { MockColumnsController, MockDataController, setupDataGridModules, getCells } from "../../helpers/dataGridMocks.js";
import domUtils from "core/utils/dom";
import browser from "core/utils/browser";
import typeUtils from "core/utils/type";
import commonUtils from "core/utils/common";
import config from "core/config";
import errors from "ui/widget/ui.errors";
import devices from "core/devices";

const device = devices.real();

function getInputElements($container) {
    return $container.find("input:not([type='hidden'])");
}

$('body').addClass('dx-viewport');

QUnit.module('Editing', {
    beforeEach: function() {
        this.$element = () => $("#container");
        this.gridContainer = $("#container > .dx-datagrid");

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
            options: {
                keyboardNavigation: {
                    enabled: true
                }
            },
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
            var isLink = $targetElement.hasClass("dx-link");
            var event = $.Event(isLink ? "click" : "dxclick");
            $($targetElement).trigger(event);
            this.clock.tick();
            return event;
        };
        this.keyboardNavigationController._focusedView = this.rowsView;
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test('editing with allowUpdating true', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        texts: {
            editRow: 'Edit'
        }
    };
    // act
    rowsView.render(testElement);

    // assert
    var $link = this.find(testElement.find('tbody > tr').first(), '.dx-link:contains(Edit)');
    assert.equal($link.attr("href"), "#", "href is defined"); // T622126
});

QUnit.test('no Edit link when editing with allowUpdating true and mode is batch', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').first().find('a').length, 0);
});

QUnit.test('no Edit link when editing with allowUpdating true and mode is cell', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').first().find('a').length, 0);
});

QUnit.test('editing with allowUpdating, allowAdding, allowDeleting false', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: false,
        allowAdding: false,
        allowDeleting: false
    };

    // act
    rowsView.render(testElement);

    // assert
    assert.ok(!testElement.find('tbody > tr').first().find('a').length);
});

QUnit.test('editing with allowDeleting true', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowDeleting: true,
        texts: {
            deleteRow: 'Delete'
        }
    };

    // act
    rowsView.render(testElement);

    // assert
    this.find(testElement.find('tbody > tr').first(), '.dx-link-delete');
});

QUnit.test('Header Panel when editing with allowAdding true', function(assert) {
    // arrange
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

    // act
    headerPanel.render(testElement);
    rowsView.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    // assert
    this.find(headerPanelElement, '.dx-icon-edit-button-addrow');
});

QUnit.test('Header Panel when editing with mode batch', function(assert) {
    // arrange
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

    // act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    // assert
    var $button = this.find(headerPanelElement, '.dx-datagrid-save-button');
    assert.ok($button.hasClass("dx-state-disabled"), 'Save changes button disabled by default');

    $button = this.find(headerPanelElement, '.dx-datagrid-cancel-button');
    assert.ok($button.hasClass("dx-state-disabled"), 'Cancel changes button disabled by default');
});

QUnit.test("Toolbar menu hidden when click on edit button", function(assert) {
    // arrange
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

    // act
    headerPanel.render(testElement);
    rowsView.render(testElement);

    $(".dx-toolbar-menu-container .dx-button").trigger("dxclick");
    that.clock.tick(300);

    // assert
    var $toolbarMenu = $(".dx-dropdownmenu-popup-wrapper");
    assert.ok($toolbarMenu.length, "Toolbar menu shown");

    $(".dx-edit-button").first().trigger("dxclick");
    that.clock.tick(300);

    $toolbarMenu = $(".dx-dropdownmenu-popup-wrapper");
    assert.ok(!$toolbarMenu.length, "Toolbar menu hidden");
});

QUnit.test('Header Panel when editing with mode "cell"', function(assert) {
    // arrange
    var that = this,
        headerPanel = this.headerPanel,
        headerPanelElement,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    // act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    // assert
    var $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok(!$button.length, 'There is no save button');

    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok(!$button.length, 'There is no cancel button');
});

// T112623
QUnit.test('Header Panel when allowUpdating false, allowAdding true, allowDeleting true and mode batch', function(assert) {
    // arrange
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

    // act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    // assert
    $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok($button.length, 'has save changes button');
    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok($button.length, 'has cancel changes button');
});

// T112623
QUnit.test('Header Panel when allowUpdating false, allowAdding false, allowDeleting true and mode batch', function(assert) {
    // arrange
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

    // act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    // assert
    $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok($button.length, 'has save changes button');
    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok($button.length, 'has cancel changes button');
});

// T112623
QUnit.test('Header Panel when allowUpdating false, allowAdding true, allowDeleting false and mode batch', function(assert) {
    // arrange
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

    // act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    // assert
    $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok($button.length, 'has save changes button');
    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok($button.length, 'has cancel changes button');
});

// T112623
QUnit.test('Header Panel when allowUpdating false, allowAdding false, allowDeleting false and mode batch', function(assert) {
    // arrange
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

    // act
    headerPanel.render(testElement);

    headerPanelElement = testElement.find('.dx-datagrid-header-panel').first();

    // assert
    $button = headerPanelElement.find('.dx-datagrid-save-button');
    assert.ok(!$button.length, 'not has save changes button');
    $button = headerPanelElement.find('.dx-datagrid-cancel-button');
    assert.ok(!$button.length, 'not has cancel changes button');
});

QUnit.test('Save changes button click call saveEditData', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        rowsView = this.rowsView,
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

    // act
    testElement.find(".dx-datagrid-save-button").trigger("dxclick");
    this.clock.tick(1000);
    // assert
    assert.equal(saveEditDataCallCount, 1, 'saveEditData called');
});

QUnit.test('Cancel changes button click call cancelEditData', function(assert) {
    // arrange
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

    // act
    $(headerPanelElement).find(".dx-datagrid-cancel-button").trigger("dxclick");

    // assert
    assert.equal(cancelEditDataCallCount, 0, 'cancelEditData is not called'); // T630875

    // act
    this.clock.tick();

    // assert
    assert.equal(cancelEditDataCallCount, 1, 'cancelEditData is called');
});

QUnit.test('Edit Row', function(assert) {
    // arrange
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

    // act
    var event = this.click(testElement.find('tbody > tr').first(), '.dx-link:contains(Edit)');
    this.clock.tick();

    // assert
    assert.equal(editRowCallCount, 1);
    assert.ok(getInputElements(testElement.find('tbody > tr').first()).length);
    assert.deepEqual(that.keyboardNavigationController._focusedCellPosition,
        {
            columnIndex: 0,
            rowIndex: 0
        },
        "focus position"
    );
    assert.ok(event.isDefaultPrevented(), "default is prevented"); // T643785
    assert.ok(event.isPropagationStopped(), "propagation is stopped");
});

QUnit.test('Edit Row and focus not first input', function(assert) {
    // arrange
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

    // act
    this.click(testElement.find('tbody > tr').first(), '.dx-link:contains(Edit)');
    this.clock.tick();

    // assert
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
    // arrange
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

    // act
    this.click(testElement.find('tbody > tr').first(), 'td:last-child');

    // assert
    assert.strictEqual(rowClickCallCount, 1, 'onRowClick handled');

    // act
    this.click(testElement.find('tbody > tr').first(), '.dx-link:contains(Edit)');

    // assert
    assert.strictEqual(editRowCallCount, 1, 'editRow called');
    assert.strictEqual(rowClickCallCount, 1, 'onRowClick not handled');
});

QUnit.test('isEditCell', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch',
        allowUpdating: true
    };

    rowsView.render(testElement);

    // act
    testElement.find('td').first().trigger('dxclick'); // Edit cell

    // assert
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
    // arrange
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

    // act
    testElement.find('td').first().trigger('dxclick');

    // assert
    assert.equal(editCellCallCount, 1);
    assert.equal(getInputElements(testElement).length, 0);
});

QUnit.test('Edit Cell when batch mode on cell click', function(assert) {
    // arrange
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

    // act
    testElement.find('td').first().trigger('dxclick');

    // assert
    assert.equal(editCellCallCount, 1);
    assert.equal(getInputElements(testElement).length, 1);
    assert.equal(testElement.find('td').first().find('input').length, 1);
});

QUnit.test('Edit cell on row click when a table is contained inside a cell', function(assert) {
    // arrange
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

    // act
    this.rowsView._rowClick({
        rowIndex: 0,
        event: {
            target: testElement.find(".txt").first()
        }
    });

    // assert
    assert.equal(testColumnIndex, 1, "column index");
    assert.equal(testRowIndex, 0, "row index");
});

// T261231
QUnit.test('Edit Cell when batch mode by API call for readonly cell', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    that.columns[0].allowEditing = false;

    rowsView.render(testElement);

    // act
    that.editCell(0, 0);

    // assert
    assert.equal(getInputElements(testElement).length, 1);
    assert.equal(testElement.find('td').first().find('input').length, 1);

    // act
    this.clock.tick();
    testElement.find('td').first().find('input').trigger("dxclick");
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement).length, 1, "editor is not closed");
    assert.equal(testElement.find('td').first().find('input').length, 1, "editor is not closed");
});

QUnit.test('batch mode - correct render boolean cell and functionality on cell click (showEditorAlways)', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        $boolCell;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    that.$element = function() {
        return testElement;
    };

    rowsView.render(testElement);

    // act
    $boolCell = testElement.find('td').eq(3);

    // assert
    assert.ok(!$boolCell.hasClass("dx-datagrid-readonly"));
    assert.ok(!$boolCell.hasClass("dx-cell-focus-disabled"), "Cell with boolean editor do not have focus-disabled class");
    // T163474
    assert.ok(!$boolCell.find(".dx-state-readonly").length);

    // act
    $($boolCell).trigger('dxclick');
    that.clock.tick();
    $boolCell = testElement.find('td').eq(3);
    // assert
    assert.ok(!$boolCell.hasClass("dx-datagrid-readonly"));
    // T163474
    assert.ok(!$boolCell.find(".dx-state-readonly").length);
});

QUnit.test('batch mode - correct render boolean cell when cancel onEditingStart (showEditorAlways)', function(assert) {
    // arrange
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

    that.$element = function() {
        return testElement;
    };

    rowsView.render(testElement);

    // act
    $boolCell = testElement.find('td').eq(3);

    // assert
    assert.equal(editingStartCount, 3, "onEditingStart call count");
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"));
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "Cell with boolean editor do have focus-disabled class");
    assert.equal($boolCell.find(".dx-state-readonly").length, 1);
});

QUnit.test('batch mode - correct render boolean cell with allowEditing is false', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        $boolCell;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);

    // act
    $boolCell = testElement.find('td').eq(4);

    // assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"), "readonly");
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "boolean editor do not focus on click");
    assert.ok($boolCell.find(".dx-checkbox-checked").length, "checkbox checked");

    // act
    $($boolCell).trigger('dxclick');
    $boolCell = testElement.find('td').eq(4);

    // assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"), "readonly");
    assert.ok($boolCell.find(".dx-checkbox-checked").length, "checkbox checked");
});

QUnit.test('row mode - correct render boolean cell and functionality (showEditorAlways)', function(assert) {
    // arrange
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

    // assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"));
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "Cell with boolean editor has focus-disabled class");

    // T163474
    assert.ok($boolCell.find(".dx-state-readonly").length);

    // act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');
    $boolCell = testElement.find('td').eq(3);

    // assert
    assert.ok(!$boolCell.hasClass("dx-datagrid-readonly"));
    assert.ok(!$boolCell.hasClass("dx-cell-focus-disabled"), "Cell with boolean editor in edit row do not have focus-disabled class");

    assert.ok(!$boolCell.find('.dx-widget.dx-state-disabled').length);
    // T163474
    assert.ok(!$boolCell.find(".dx-state-readonly").length);
});

QUnit.test('row mode - correct render editor cell and functionality (showEditorAlways)', function(assert) {
    // arrange
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

    // assert
    assert.ok($editorCell.hasClass("dx-datagrid-readonly"));
    assert.ok($editorCell.hasClass("dx-cell-focus-disabled"), "editor do not focus on click");

    // T163474
    assert.ok($editorCell.find(".dx-state-readonly").length);

    // act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');
    $editorCell = testElement.find('td').first();

    // assert
    assert.ok(!$editorCell.hasClass("dx-datagrid-readonly"));
    assert.ok(!$editorCell.hasClass("dx-cell-focus-disabled"), "editor can be focused on click");

    assert.ok(!$editorCell.find('.dx-widget.dx-state-disabled').length);
    // T163474
    assert.ok(!$editorCell.find(".dx-state-readonly").length);
});

QUnit.test('row mode - correct render boolean cell with allowEditing is false', function(assert) {
    // arrange
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

    // act
    $boolCell = testElement.find('td').eq(4);

    // assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"), "readonly");
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "boolean editor do not focus on click");
    assert.ok($boolCell.find(".dx-checkbox-checked").length, "checkbox checked");

    // act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');
    $boolCell = testElement.find('td').eq(4);
    $($boolCell).trigger('dxclick');

    // assert
    assert.ok($boolCell.hasClass("dx-datagrid-readonly"), "readonly");
    assert.ok($boolCell.hasClass("dx-cell-focus-disabled"), "boolean editor do not focus on click");
    assert.ok($boolCell.find(".dx-checkbox-checked").length, "checkbox checked");
});

QUnit.test("Enable readOnly for editor", function(assert) {
    // arrange
    var options = {
            column: {
                showEditorAlways: true
            },
            rowType: "data"
        },
        template = this.editingController.getColumnTemplate(options),
        $container = $("<div>");

    // act
    template($container, options);

    // assert
    assert.ok($container.children().eq(0).dxTextBox("instance").option("readOnly"));
});

// T124946
QUnit.test('Api method editCell when allowUpdating false', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: false,
        mode: 'batch'
    };

    rowsView.render(testElement);

    // act
    that.editingController.editCell(0, 0);

    // assert
    assert.equal(getInputElements(testElement).length, 1);
    assert.equal(testElement.find('td').first().find('input').length, 1);
});

// T310531
QUnit.test('Api method editCell with column by dataField', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch'
    };

    rowsView.render(testElement);

    // act
    that.editingController.editCell(0, "id");

    // assert
    assert.equal(getInputElements(testElement).length, 1);
    assert.equal(getInputElements(testElement.find('td').eq(1)).length, 1);
});

// T310531
QUnit.test('Api method editCell with column by wrong dataField', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch'
    };

    rowsView.render(testElement);

    // act
    that.editingController.editCell(0, "unknown");

    // assert
    assert.equal(getInputElements(testElement).length, 0);
});


// T124946
QUnit.test('Api method editCell with button', function(assert) {
    // arrange
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

    // act
    $($input).trigger("click");

    // assert
    assert.equal(getInputElements(testElement).length, 2);
    assert.equal(testElement.find('td').first().find('input').length, 1);
});

// T113719
QUnit.test('Edit Cell with editCellTemplate when batch mode on cell click', function(assert) {
    // arrange
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

    // act
    testElement.find('td').first().trigger('dxclick');

    // assert
    assert.equal(getInputElements(testElement).length, 1, 'created 1 editor only');
    assert.equal(testElement.find('td').first().find('input').length, 1, 'editor created in first td');
    assert.equal(testElement.find('td').first().find('input').css('text-align'), "right", 'editor input has right alignment');
    assert.equal(testElement.find('td').first().find('.dx-autocomplete').length, 1, 'autocomplete widget created');
    assert.ok(testElement.find('td').hasClass("dx-editor-cell"), 'dx-editor-cell class added');
});

QUnit.test('Remove Row without message', function(assert) {
    // arrange
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
        key: function() { },
        remove: function(key) {
            removeKey = key;
            return $.Deferred().resolve(key);
        }
    };

    rowsView.render(testElement);

    assert.ok(!this.dataController.refreshed, 'not refreshed data');
    // act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)');

    // assert
    assert.strictEqual(removeKey, 'test1', 'removeKey');
    assert.ok(this.dataController.refreshed, 'refreshed data');
});

QUnit.test('Remove row when batch editing', function(assert) {
    // arrange
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
        key: function() { },
        remove: function(key) {
            removeKey = key;
            return $.Deferred().resolve(key);
        }
    };

    rowsView.render(testElement);

    assert.ok(!this.dataController.refreshed, 'not refreshed data');
    // act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)');
    this.editingController.saveEditData();

    // assert
    assert.strictEqual(removeKey, 'test1', 'removeKey');
    assert.ok(this.dataController.refreshed, 'refreshed data');
});

QUnit.test('Remove row with message', function(assert) {
    fx.off = true;
    try {
        // arrange
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
            key: function() { },
            remove: function(key) {
                removeKey = key;
                return $.Deferred().resolve(key);
            }
        };

        rowsView.render(testElement);

        // assert
        assert.ok(!this.dataController.refreshed, 'not refreshed data');

        // act
        this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)'); // show confirm

        // assert
        assert.ok(body.find('.dx-dialog').length, 'has dialog');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-popup-title').first().text(), 'TestTitle', 'confirm title');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-dialog-message').first().text(), 'TestMessage', 'confirm message');


        // act
        // this.clock.tick(5000);
        body.find('.dx-dialog').first().find('.dx-dialog-button').first().trigger('dxclick'); // delete

        // assert
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
        // arrange
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
            key: function() { },
            remove: function(key) {
                removeKey = key;
                return $.Deferred().resolve(key);
            }
        };

        rowsView.render(testElement);

        // assert
        assert.ok(!this.dataController.refreshed, 'not refreshed data');

        // act
        this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)'); // show confirm

        // assert
        assert.ok(body.find('.dx-dialog').length, 'has dialog');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-popup-title').first().text(), 'TestTitle', 'confirm title');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-dialog-message').first().text(), 'TestMessage', 'confirm message');

        // act
        body.find('.dx-dialog').first().find('.dx-dialog-button').first().trigger('dxclick'); // delete

        // assert
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
        // arrange
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
            key: function() { },
            remove: function(key) {
                removeKey = key;
                return $.Deferred().resolve(key);
            }
        };

        rowsView.render(testElement);

        // assert
        assert.ok(!this.dataController.refreshed, 'not refreshed data');

        // act
        testElement.find('tbody > tr').first().find('a').trigger('click'); // show confirm
        this.clock.tick();

        // assert
        assert.ok(body.find('.dx-dialog').length, 'has dialog');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-popup-title').first().text(), 'TestTitle', 'confirm title');
        assert.strictEqual(body.find('.dx-dialog').first().find('.dx-dialog-message').first().text(), 'TestMessage', 'confirm message');

        // act
        body.find('.dx-dialog').first().find('.dx-dialog-button').last().trigger('dxclick'); // delete

        // assert
        assert.ok(!body.find('.dx-dialog').length, 'not has dialog');
        assert.ok(!removeKey, 'removeKey');
        assert.ok(!this.dataController.refreshed, 'not refreshed data');
    } finally {
        fx.off = false;
    }
});

QUnit.test('Save Row', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        updateArgs;

    that.options.editing = {
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save",
            editRow: "Edit"
        }
    };

    that.dataControllerOptions.store = {
        key: function() { },
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

    // act
    this.click(testElement.find('tbody > tr').first(), '.dx-link-save');
    getCells(testElement);

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.deepEqual(updateArgs, ['test1', { "name": "Test update row" }]);
});

QUnit.test('Save Row for calculated column', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        updateArgs;

    that.options.editing = {
        allowUpdating: true,
        texts: {
            saveRowChanges: "Save",
            editRow: "Edit"
        }
    };

    that.dataControllerOptions.store = {
        key: function() { },
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');

    testElement.find('tbody > tr').first().find('input').last().val('Test name');
    testElement.find('tbody > tr').first().find('input').last().trigger('change');

    // act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Save)');
    getCells(testElement);

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.deepEqual(updateArgs, ['test1', { customer: { name: "Test name" } }]);
});

// T174245
QUnit.test("Save row without changes data", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true
    };

    rowsView.render(testElement);

    // act
    that.editRow(0);

    // assert
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-edit-row"), "has edit row");
    assert.ok(getInputElements(testElement.find('tbody > tr').first()).length, "has input");

    // act
    that.saveEditData();

    // assert
    assert.ok(!testElement.find('tbody > tr').first().hasClass("dx-edit-row"), "not has edit row");
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0, "not has input");
});

QUnit.test('Serialize value before saving', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        updateArgs,
        serializingValue;

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
        key: function() { },
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Edit)');

    testElement.find('input').first().val('Test update row');
    testElement.find('input').first().trigger('change');

    // act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Save)');
    getCells(testElement);

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.equal(serializingValue, "Test update row");
    assert.deepEqual(updateArgs, ['test1', { "name": "Test update row serialized" }]);
});

QUnit.test('Cancel Editing Row when row mode', function(assert) {
    // arrange
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

    // act
    assert.ok(getInputElements(testElement.find('tbody > tr').first()).length);
    this.click(testElement.find('tbody > tr').first(), '.dx-link-cancel');

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
});

QUnit.test('Close Editing Cell when batch mode on click outside dataGrid', function(assert) {
    // arrange
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
        key: function() { },
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    testElement.find('td').first().trigger('dxclick'); // Edit
    this.clock.tick();

    // act
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);
    testElement.find('input').first().val('Test update cell');
    testElement.find('input').first().trigger('change');

    // act
    $(document).trigger('dxpointerdown');
    $(document).trigger('dxclick');
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.ok(!updateArgs, 'no update');

    this.editingController.saveEditData();

    assert.deepEqual(updateArgs, ['test1', { "name": "Test update cell" }]);
});

// T749034
QUnit.test('Changed value should be saved on click outside dataGrid on mobile devices when cell editing mode', function(assert) {
    if(devices.real().deviceType === "desktop") {
        assert.ok(true, "test is not actual for desktop");
        return;
    }
    // arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell',
        texts: {
            editRow: "Edit"
        }
    };

    that.dataControllerOptions.store = {
        key: function() { },
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    testElement.find('td').first().trigger('dxclick'); // Edit
    this.clock.tick();

    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);

    // act
    testElement.find('input').first().val('Test update cell');
    $(document).trigger('dxpointerdown');
    testElement.find('input').first().trigger('change');
    $(document).trigger('dxclick');
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.deepEqual(updateArgs, ['test1', { "name": "Test update cell" }]);
});

// T113152
QUnit.test('Not close Editing Cell in batch mode on click editor popup', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);
    testElement.find('tbody > tr').first().find('td').eq(2).trigger('dxclick'); // Edit

    var $calendarIcon = testElement.find('.dx-dropdowneditor-icon');
    assert.equal($calendarIcon.length, 1, 'calendar icons count');
    $($calendarIcon).trigger('dxclick');

    var $calendar = $(".dx-calendar");
    assert.equal($calendar.length, 1, 'popup calendar count');

    // act
    this.clock.tick();
    $($calendar).trigger('dxpointerdown');
    $($calendar).trigger('dxclick');
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, 'editor count');
    assert.equal($(".dx-calendar").length, 1, 'popup calendar count');
});

// T727856
QUnit.test('Not close Editing Cell in batch mode on down in editing cell and up in another cell', function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "focus is not actual for mobile devices");
        return;
    }
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);
    testElement.find('tbody > tr').first().find('td').eq(2).trigger('dxclick'); // Edit
    this.clock.tick();

    // act
    testElement.find('tbody > tr').first().find('td').eq(2).trigger('dxpointerdown');
    testElement.find('tbody').first().trigger('dxclick'); // chrome 73+
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, 'editor is not closed');
});

// T318313
QUnit.test('Close Editing Cell when grid in popup', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $popupContent,
        popupInstance = $("<div/>").appendTo($('#container')).dxPopup({
            contentTemplate: function($contentElement) {
                rowsView.render($("<div/>").appendTo($contentElement));
            }
        }).dxPopup("instance");

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    popupInstance.show();
    $popupContent = popupInstance.overlayContent();
    $($popupContent.find("td").first()).trigger("dxclick");
    that.clock.tick();

    // assert
    assert.equal(getInputElements($popupContent).length, 1, "has input");

    // act
    $($popupContent).trigger("dxpointerdown");
    $($popupContent).trigger("dxclick");
    that.clock.tick();

    // assert
    assert.equal(getInputElements($popupContent).length, 0, "not has input");
});

// T213164
QUnit.test('Not close Editing Cell in batch mode on click detached element', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);
    testElement.find('tbody > tr').first().find('td').eq(2).trigger('dxclick'); // Edit

    var $calendarIcon = testElement.find('.dx-dropdowneditor-icon');
    assert.equal($calendarIcon.length, 1, 'calendar icons count');
    $($calendarIcon).trigger('dxclick');

    var $calendar = $(".dx-calendar");
    assert.equal($calendar.length, 1, 'popup calendar count');

    var $otherMonthDay = $calendar.find(".dx-calendar-other-month").first();
    assert.equal($otherMonthDay.length, 1, 'over month day element');

    // act
    this.clock.tick();
    $($otherMonthDay).trigger('dxpointerdown');
    $($otherMonthDay).trigger('dxclick');
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, 'editor count');
    assert.equal(testElement.find('.dx-datebox').length, 1, 'datebox count');
});


// T110581
QUnit.testInActiveWindow('Not close Editing Cell in batch mode on click focus overlay', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(that.gridContainer);
    that.gridContainer.find('tbody > tr').first().find('td').eq(2).trigger('dxclick'); // Edit

    this.clock.tick();
    var $focusOverlay = that.gridContainer.find('.dx-datagrid-focus-overlay');
    assert.equal($focusOverlay.length, 1, 'focus overlay count');

    // act
    $($focusOverlay).trigger('dxpointerdown');
    $($focusOverlay).trigger('dxclick');
    this.clock.tick();

    // assert
    assert.equal(getInputElements(that.gridContainer.find('tbody > tr').first()).length, 1, 'editor count');
    assert.equal($(".dx-datagrid-focus-overlay").length, 1, 'focus overlay count');
});


QUnit.test('Save changes when batch mode', function(assert) {
    // arrange
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
        key: function() { },
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

    // act
    testElement.find('td').eq(0).trigger('dxclick'); // Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1);
    getInputElements(testElement).eq(0).val('Test1');
    getInputElements(testElement).eq(0).trigger('change');

    testElement.find('tbody > tr').eq(1).find('td').eq(0).trigger('dxclick'); // Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(1)).length, 1);
    getInputElements(testElement).eq(0).val('Test2');
    getInputElements(testElement).eq(0).trigger('change');

    this.click(testElement.find('tbody > tr').eq(2), 'a:contains(Delete)');

    // act
    this.editingController.saveEditData();

    // assert
    assert.deepEqual(updateArgs, [['test1', { "name": "Test1" }], ['test2', { "name": "Test2" }]]);
    assert.deepEqual(removeKeys, ['test3']);
});

// T501010
QUnit.test('Save changes on save button click when batch mode', function(assert) {
    // arrange
    var that = this,
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        updateArgs = [],
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    that.dataControllerOptions.store = {
        key: function() { },
        update: function(key, values) {
            updateArgs.push([key, values]);
            return $.Deferred().resolve(key, values);
        }
    };

    headerPanel.render(testElement);
    rowsView.render(testElement);

    testElement.find('td').eq(0).trigger('dxclick'); // Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1);
    getInputElements(testElement).eq(0).val('Test1');
    getInputElements(testElement).eq(0).trigger('change');

    testElement.find('tbody > tr').eq(1).find('td').eq(0).trigger('dxclick'); // Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(1)).length, 1);
    getInputElements(testElement).eq(0).val('Test2');

    var $saveButton = testElement.find(".dx-datagrid-save-button");
    var mouse = pointerMock($saveButton).start();

    // act
    mouse.down();
    getInputElements(testElement).eq(0).trigger('change');
    mouse.up();

    this.clock.tick();

    // assert
    assert.deepEqual(updateArgs, [['test1', { "name": "Test1" }], ['test2', { "name": "Test2" }]], "changed rows are saved");
});

QUnit.test('Cancel changes when batch mode', function(assert) {
    // arrange
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
        key: function() { },
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

    // act
    testElement.find('td').eq(0).trigger('dxclick'); // Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1);
    testElement.find('input').eq(0).val('Test1');
    testElement.find('input').eq(0).trigger('change');

    testElement.find('tbody > tr').eq(1).find('td').eq(0).trigger('dxclick'); // Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(1)).length, 1);
    testElement.find('input').eq(0).val('Test2');
    testElement.find('input').eq(0).trigger('change');

    this.click(testElement.find('tbody > tr').eq(2), 'a:contains(Delete)');

    // act
    this.editingController.cancelEditData();
    this.editingController.saveEditData();


    // assert
    assert.deepEqual(updateArgs, []);
    assert.deepEqual(removeKeys, []);
});

// T407180
QUnit.test('Save changes when batch mode when one the changes is canceled from event', function(assert) {
    // arrange
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
        key: function() { },
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

    // act
    testElement.find('td').eq(0).trigger('dxclick'); // Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1);
    testElement.find('input').eq(0).val('Test1');
    testElement.find('input').eq(0).trigger('change');

    this.click(testElement.find('tbody > tr').eq(2), 'a:contains(Delete)');

    assert.ok(!that.dataController.refreshed, 'data is not refreshed');

    // act
    this.editingController.saveEditData();
    this.clock.tick();

    // assert
    assert.deepEqual(updateArgs, [['test1', { "name": "Test1" }]]);
    assert.deepEqual(removeKeys, []);
    assert.ok(that.dataController.refreshed, 'data is refreshed');
    assert.deepEqual(that.editingController._editData, [{ key: "test3", oldData: that.dataControllerOptions.items[2].data, type: "remove" }], "edit data");
});

QUnit.test('Close Editing Cell when batch mode on click inside freespace row', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        updateArgs,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    that.dataControllerOptions.store = {
        key: function() { },
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };

    rowsView.render(testElement);
    testElement.find('td').first().trigger('dxclick'); // Edit
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, 'has input');

    // arrange
    testElement.find('input').first().val('Test update cell');
    testElement.find('input').first().trigger('change');

    // act
    testElement.find(".dx-freespace-row").first().trigger('dxpointerdown');
    testElement.find(".dx-freespace-row").first().trigger('dxclick');

    this.clock.tick();
    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0, 'not has input');
    assert.ok(!updateArgs, 'no update');
});

QUnit.test('Save Editing Cell when batch mode on click another cell', function(assert) {
    // arrange
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
        key: function() { },
        update: function(key, values) {
            updateArgs = [key, values];
            return $.Deferred().resolve(key, values);
        }
    };


    rowsView.render(testElement);
    testElement.find('td').eq(1).trigger('dxclick'); // Second cell

    // act
    testInput = getInputElements(testElement.find('tbody > tr')).first();
    assert.equal(testInput.length, 1);
    testInput.val(11);
    testInput.trigger('change');

    testElement.find('td').eq(0).trigger('dxclick');
    testInput = getInputElements(testElement.find('tbody > tr').first());

    assert.equal(testInput.length, 1);
    testInput.val('Test22');
    testInput.trigger('change');

    // assert
    assert.deepEqual(updateArgs, undefined);

    // act
    this.editingController.saveEditData();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.deepEqual(updateArgs, ['test1', { id: 11, name: "Test22" }]);
});

QUnit.test('Cancel Editing Row after change page', function(assert) {
    // arrange
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

    // act
    that.dataController.pageIndex(1);
    that.editingController.update(); // TODO
    that.dataController.updateItems();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    this.find(testElement.find('tbody > tr').first(), 'a:contains(Edit)');
});

QUnit.test("Title of delete dialog is not displayed when title text is empty or undefined", function(assert) {
    // arrange
    var isTitleHidden;

    this.options.editing = {
        allowUpdating: true,
        texts: {
            confirmDeleteMessage: "Test"
        }
    };

    // act
    this.editingController.deleteRow(0);
    isTitleHidden = $(".dx-popup-title").length === 0;
    $(".dx-popup").remove();

    // assert
    assert.ok(isTitleHidden);
});

QUnit.test("Title of delete dialog is displayed when title text is defined", function(assert) {
    // arrange
    var isTitleShown;

    this.options.editing = {
        allowUpdating: true,
        texts: {
            confirmDeleteMessage: "Test",
            confirmDeleteTitle: "Title"
        }
    };

    // act
    this.editingController.deleteRow(0);

    isTitleShown = $(".dx-popup-title").length === 1;
    $(".dx-popup").remove();

    // assert
    assert.ok(isTitleShown);
});

QUnit.test('Close editing cell when cell is contained table inside', function(assert) {
    // arrange
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

    // act
    that.editingController._saveEditorHandler({
        target: testElement.find(".txt input")[0]
    });

    // assert
    assert.ok(!isCellClosed);
});

/*
TODO Unstable test
asyncTest('Focus on first editor after Edit Click', function () {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.applyOptions({
        editing: {
            allowAdding: true
        }
    });
    rowsView.render(testElement);

    // act
    testElement.find('tbody > tr').first().find('a').trigger('click'); // New

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 3);
    setTimeout(function () {
        assert.equal(testElement.find("input:focus").val(), testElement.find('input')[0].value);

    });
});
*/

// T287356
QUnit.test('Not apply column options to cell editor', function(assert) {
    // arrange
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

    // act
    testElement.find('td').first().trigger('dxclick');

    // assert
    textEditor = testElement.find('td').first().find(".dx-texteditor").first().dxTextBox("instance");
    assert.ok(textEditor, "textBox");
    assert.ok(!textEditor.option("disabled"), "disabled false");
});

QUnit.test('Apply column editorOptions to cell editor', function(assert) {
    // arrange
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

    // act
    testElement.find('td').first().trigger('dxclick');

    // assert
    textEditor = testElement.find('td').first().find(".dx-texteditor").first().dxTextBox("instance");
    assert.ok(textEditor, "textBox");
    assert.ok(textEditor.option("disabled"), "disabled true");
});

// T529043
QUnit.test("The first cell should not be switched to the editing state when clicking on grid inside cellTemplate", function(assert) {
    // arrange
    var that = this,
        $mainTable,
        $internalTable,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    that.dataControllerOptions.items.length = 1;
    that.columns.length = 1;
    that.columns.push({
        caption: "Test",
        allowEditing: false,
        cellTemplate: function() {
            return $("<table/>").append("<tbody><tr class='dx-row'><td>Test666</td><td>Test777</td></tr></tbody>");
        }
    });
    rowsView.render($testElement);

    $mainTable = $(rowsView.element().children(".dx-datagrid-content").children("table"));
    $internalTable = $mainTable.find("tbody > tr").first().children().last().find("table");

    // assert
    assert.strictEqual($internalTable.length, 1, "table inside the second cell");

    // act
    $($internalTable.find("td").first()).trigger("dxclick");

    // assert
    $mainTable = $(rowsView.element().children(".dx-datagrid-content").children("table"));
    assert.strictEqual($mainTable.find("input").length, 0, "hasn't input");
    assert.notOk($mainTable.find("tbody > tr").first().children().first().hasClass("dx-editor-cell"), 0, "first cell isn't editable");
});

// T531154
QUnit.test("The cell should be editable after cancel removing the row", function(assert) {
    // arrange
    var that = this,
        $cellElement,
        countCallOnRowRemoving = 0,
        rowsView = that.rowsView,
        $testElement = $("#container");

    that.options.editing = {
        allowUpdating: true,
        allowDeleting: true,
        mode: "cell",
        texts: {
            confirmDeleteMessage: ""
        }
    };
    that.options.onRowRemoving = function(e) {
        countCallOnRowRemoving++;
        e.cancel = $.Deferred().resolve(true);
    };

    rowsView.render($testElement);
    that.editingController.optionChanged({ name: "onRowRemoving" });

    that.deleteRow(0);
    that.clock.tick();

    // act
    that.editCell(0, 0);

    // assert
    $cellElement = $(rowsView.element().find("tbody > tr").first().children().first());
    assert.strictEqual(countCallOnRowRemoving, 1, "count call onRowRemoving event");
    assert.ok($cellElement.hasClass("dx-editor-cell"), "cell is editable");
    assert.ok($cellElement.find("input").length > 0, "has input");
});

QUnit.test("Edit Row with useIcons is true", function(assert) {
    // arrange
    var $editCellElement,
        $testElement = $("#container");

    this.options.editing = {
        mode: "row",
        allowUpdating: true,
        allowDeleting: true,
        useIcons: true,
        texts: {
            editRow: "Edit",
            deleteRow: "Delete",
            saveRowChanges: "Save",
            cancelRowChanges: "Cancel"
        }
    };

    this.editingController.init();
    this.rowsView.render($testElement);

    // assert
    $editCellElement = $testElement.find("tbody > tr").first().children().last();
    assert.ok($editCellElement.hasClass("dx-command-edit-with-icons"), "the edit cell has icons");
    assert.strictEqual($editCellElement.find(".dx-link").length, 2, "icon count");
    assert.ok($editCellElement.find(".dx-link").first().hasClass("dx-icon-edit"), "icon edit");
    assert.strictEqual($editCellElement.find(".dx-icon-edit").attr("title"), "Edit", "title of the icon edit");
    assert.strictEqual($editCellElement.find(".dx-icon-edit").text(), "", "text of the icon edit");
    assert.ok($editCellElement.find(".dx-link").last().hasClass("dx-icon-trash"), "icon trash");
    assert.strictEqual($editCellElement.find(".dx-icon-trash").attr("title"), "Delete", "title of the icon trash");
    assert.strictEqual($editCellElement.find(".dx-icon-trash").text(), "", "text of the icon trash");

    // act
    this.editRow(0);

    $editCellElement = $testElement.find("tbody > tr").first().children().last();
    assert.ok($editCellElement.hasClass("dx-command-edit-with-icons"), "the edit cell has icons");
    assert.strictEqual($editCellElement.find(".dx-link").length, 2, "icon count");
    assert.ok($editCellElement.find(".dx-link").first().hasClass("dx-icon-save"), "icon save");
    assert.strictEqual($editCellElement.find(".dx-icon-save").attr("title"), "Save", "title of the icon save");
    assert.strictEqual($editCellElement.find(".dx-icon-save").text(), "", "text of the icon save");
    assert.ok($editCellElement.find(".dx-link").last().hasClass("dx-icon-revert"), "icon revert");
    assert.strictEqual($editCellElement.find(".dx-icon-revert").attr("title"), "Cancel", "title of the icon revert");
    assert.strictEqual($editCellElement.find(".dx-icon-revert").text(), "", "text of the icon revert");
});

if(browser.msie && parseInt(browser.version) <= 11) {
    QUnit.test("Update value for row edit mode", function(assert) {
        // arrange
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

        // act
        template($editor, {
            setValue: function(value) {
                resultValue = value;
            }
        });
        var $input = $editor.find("input").first();
        var keyboard = keyboardMock($input);
        keyboard.type("new value");
        keyboard.change();

        // assert
        assert.equal(resultValue, "new value");
    });

    QUnit.test("Update value for form edit mode", function(assert) {
        // arrange
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

        // act
        template($editor, {
            setValue: function(value) {
                resultValue = value;
            }
        });
        var $input = $editor.find("input").first();
        var keyboard = keyboardMock($input);
        keyboard.type("new value");
        keyboard.change();

        // assert
        assert.equal(resultValue, "new value");
    });

    QUnit.test("Do not update value on keyup event for row edit mode", function(assert) {
        // arrange
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

        // act
        template($editor, {
            setValue: function(value) {
                resultValue = value;
            }
        });
        $editor.find("input").first()
            .val("new value")
            .trigger("keyup");

        // assert
        assert.equal(resultValue, undefined);
    });

    QUnit.test("Do not update value on keyup event for form edit mode", function(assert) {
        // arrange
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

        // act
        template($editor, {
            setValue: function(value) {
                resultValue = value;
            }
        });
        $editor.find("input").first()
            .val("new value")
            .trigger("keyup");

        // assert
        assert.equal(resultValue, undefined);
    });
}

// T620297
QUnit.test("The text of the colorBox should not be overlaps in a grid cell", function(assert) {
    // arrange
    var DEFAULT_COLORBOX_INPUT_PADDING_LEFT = "40px";

    var rowsView = this.rowsView,
        $testElement = $("#container");

    this.columns.length = 0;
    this.columns.push({ allowEditing: true, dataField: "color", showEditorAlways: true });
    this.dataControllerOptions.items = [{ key: "test1", data: { name: "test1", color: "#2D4372" }, values: ["#2D4372"], rowType: "data" }];
    this.options.onEditorPreparing = function(e) {
        if(e.dataField === "color") {
            e.editorName = "dxColorBox";
        }
    };
    this.editorFactoryController.init();

    // act
    rowsView.render($testElement);

    // assert
    assert.strictEqual($(this.getCellElement(0, 0)).find(".dx-colorbox-input").css("paddingLeft"), DEFAULT_COLORBOX_INPUT_PADDING_LEFT, "padding left");
});

// T682033
QUnit.testInActiveWindow("Focus overlay should not be shown in batch editing mode when editing is disabled", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: false,
    };
    that.options.tabIndex = 0;
    rowsView.render($testElement);
    that.$element = function() {
        return $(".dx-datagrid").parent();
    };

    // act
    var $firstCell = $testElement.find("tbody > tr > td").first();
    $firstCell.focus();
    $firstCell.trigger(pointerEvents.up);
    that.clock.tick();

    // assert
    assert.notOk($testElement.find(".dx-datagrid-focus-overlay").is(":visible"), "not visible focus overlay");
});

// T713844
QUnit.test("Set editor mode via editorOptions", function(assert) {
    // arrange
    var that = this,
        textEditor,
        rowsView = this.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    that.columns[0].editorOptions = { mode: "password" };
    rowsView.render($testElement);

    // act
    $testElement.find('td').first().trigger('dxclick');

    // assert
    textEditor = $testElement.find('td').first().find(".dx-texteditor").first().dxTextBox("instance");
    assert.strictEqual(textEditor.option("mode"), "password", "editor mode");
});

QUnit.test("Batch mode - Edit cell on click (startEditAction is 'click')", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $("#container");

    that.options.editing = {
        allowUpdating: true,
        mode: "batch",
        startEditAction: "click"
    };
    sinon.spy(that.editingController, "editCell");

    rowsView.render($testElement);

    // act
    $testElement.find("td").first().trigger("dxclick");

    // assert
    assert.strictEqual(that.editingController.editCell.callCount, 1, "count call editCell");
    assert.strictEqual(getInputElements($testElement).length, 1, "has input");
    assert.strictEqual($testElement.find("td").first().find("input").length, 1);
});

QUnit.test("Batch mode - Edit Cell on double click (startEditAction is 'dblClick')", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $("#container");

    that.options.editing = {
        allowUpdating: true,
        mode: "batch",
        startEditAction: "dblClick"
    };
    sinon.spy(that.editingController, "editCell");

    rowsView.render($testElement);

    // act
    $testElement.find("td").first().trigger("dxdblclick");

    // assert
    assert.strictEqual(that.editingController.editCell.callCount, 1, "count call editCell");
    assert.strictEqual(getInputElements($testElement).length, 1, "has input");
    assert.strictEqual($testElement.find("td").first().find("input").length, 1);
});

QUnit.test("Batch mode - Closing edited cell should work on click when startEditAction is 'dblClick'", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $("#container");

    that.options.editing = {
        allowUpdating: true,
        mode: "batch",
        startEditAction: "dblClick"
    };
    sinon.spy(that.editingController, "editCell");

    rowsView.render($testElement);

    // act
    $testElement.find("td").first().trigger("dxdblclick");

    // assert
    assert.strictEqual(that.editingController.editCell.callCount, 1, "count call editCell");
    assert.strictEqual(getInputElements($testElement).length, 1, "has input");
    assert.strictEqual($testElement.find("td").first().find("input").length, 1);

    // arrange
    sinon.spy(that.editingController, "closeEditCell");

    // act
    $testElement.find("td").eq(1).trigger("dxclick");
    that.clock.tick();

    // assert
    assert.strictEqual(that.editingController.closeEditCell.callCount, 1, "count call closeEditCell");
    assert.strictEqual(getInputElements($testElement).length, 0, "hasn't input");
});

QUnit.test("Batch mode - Clicking on the edited cell should not close it when startEditAction is 'dblClick'", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $("#container");

    that.options.editing = {
        allowUpdating: true,
        mode: "batch",
        startEditAction: "dblClick"
    };
    rowsView.render($testElement);

    $testElement.find("td").first().trigger("dxdblclick");

    // assert
    assert.strictEqual(getInputElements($testElement).length, 1, "has input");
    assert.strictEqual($testElement.find("td").first().find("input").length, 1);

    // act
    $testElement.find("td").first().trigger("dxclick");
    that.clock.tick();

    // assert
    assert.strictEqual(getInputElements($testElement).length, 1, "has input");
});

QUnit.test("Batch mode - The allowUpdating callback should not be called on click when startEditAction is 'dblClick'", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        allowUpdating = sinon.spy();

    that.options.editing = {
        allowUpdating: allowUpdating,
        mode: "batch",
        startEditAction: "dblClick"
    };
    rowsView.render(that.gridContainer);
    allowUpdating.reset();

    // act
    that.gridContainer.find("td").first().trigger("click");

    // assert
    assert.strictEqual(allowUpdating.callCount, 0, "allowUpdating isn't called");
});

QUnit.module('Editing with real dataController', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = () => $("#container");
        this.gridContainer = $("#container > .dx-datagrid");

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
            tabIndex: 0,
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

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'gridView', 'masterDetail', 'editing', 'editorFactory', 'selection', 'headerPanel', 'columnFixing', 'validating', 'search'], {
            initViews: true
        });

        this.find = function($element, selector) {
            var $targetElement = $element.find(selector);
            QUnit.assert.equal($targetElement.length, 1, 'one element with selector ' + '"' + selector + '" found');
            return $targetElement;
        };
        this.click = function($element, selector) {
            var $targetElement = this.find($element, selector);
            var isLink = $targetElement.hasClass("dx-link");
            $($targetElement).trigger(isLink ? 'click' : 'dxclick');
            this.clock.tick();
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

// B254105
QUnit.test('Reset editing after refresh dataSource', function(assert) {
    // arrange
    var that = this;
    this.rowsView.render($('#container'));

    that.editRow(2);

    // assert
    assert.equal(that.editingController._editRowIndex, 2);

    // act
    that.dataController.refresh();

    // assert
    assert.equal(that.editingController._editRowIndex, -1);
});

// B254503
QUnit.test('no editing column when not has columns', function(assert) {
    // arrange
    var that = this,
        visibleColumns;

    that.options.columns = [];

    that.options.editing = {
        allowUpdating: true
    };

    that.columnsController.reset();
    that.columnsController.init();

    // act
    visibleColumns = that.columnsController.getVisibleColumns();

    // assert
    assert.ok(!visibleColumns.length, 'not has columns');
});

QUnit.test('Close Editing Cell and edit new cell on click', function(assert) {
    // arrange
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
    testElement.find('td').first().trigger('dxclick'); // Edit

    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);
    testElement.find('input').first().val('Test update cell');

    assert.ok(this.find(headerPanelElement, '.dx-datagrid-save-button').hasClass("dx-state-disabled"), 'save changes button disabled');
    assert.ok(this.find(headerPanelElement, '.dx-datagrid-cancel-button').hasClass("dx-state-disabled"), 'cancel changes button disabled');

    testElement.find('input').first().trigger('change');
    assert.ok(testElement.find('td').first().hasClass("dx-cell-modified"));
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-save-button').hasClass("dx-state-disabled"), 'save changes button enabled');
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-cancel-button').hasClass("dx-state-disabled"), 'cancel changes button enabled');
    // act
    testElement.find('tbody > tr').first().find('td').eq(1).trigger('dxclick');

    // assert
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-modified"));
    assert.ok(testElement.find('td').first().hasClass("dx-cell-modified"));
    assert.ok(!testElement.find('td').eq(1).hasClass("dx-cell-modified"));
    assert.equal(getInputElements(testElement).length, 1, 'inputs count');
    assert.equal(getInputElements(testElement.find('tbody > tr').first().find('td').eq(1)).length, 1, 'inputs count  in first row second column');

    // act
    that.dataController.refresh();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0, 'inputs count');
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-save-button').hasClass("dx-state-disabled"), 'save changes button enabled');
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-cancel-button').hasClass("dx-state-disabled"), 'cancel changes button enabled');
});

// T181661
QUnit.test('Close Editing Cell on hold', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(testElement);

    // act
    that.editCell(0, 0); // Edit

    // assert
    assert.ok(testElement.find('tbody > tr').first().find("td").first().hasClass("dx-editor-cell"), "has editor");
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, "has input");

    // act
    var mouse = pointerMock(testElement.find('tbody td').eq(1))
        .start()
        .down()
        .wait(750);

    that.clock.tick(750);
    mouse.up();

    // assert
    assert.ok(!testElement.find('tbody > tr').first().find("td").first().hasClass("dx-editor-cell"), "not has editor");
    assert.ok(!getInputElements(testElement.find('tbody > tr').first()).length, "not has input");
});

// T458921
QUnit.test('Cancel Editing Row should not update all rows when form mode', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: "form"
    };

    rowsView.render(testElement);

    that.editRow(0);

    // act
    var $oldRowElements = testElement.find('tbody > tr');
    that.cancelEditData();

    // assert
    var $rowElements = testElement.find('tbody > tr');
    assert.equal(getInputElements($rowElements.first()).length, 0);
    assert.notStrictEqual($oldRowElements.get(0), $rowElements.get(0), "row 0 is changed");
    assert.notStrictEqual($oldRowElements.get(1), $rowElements.get(1), "row 1 is changed");
    assert.strictEqual($oldRowElements.get(2), $rowElements.get(2), "row 2 is not changed");
});

// T677605
QUnit.test('The "Cancel" button of the Editing form should be clicked once to close it when rowTemplate is used', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: "form"
    };

    that.options.rowTemplate = function(container) {
        var markup = $("<tbody class='dx-row'></tbody>");
        markup.appendTo(container);
    };

    rowsView.render(testElement);

    that.editRow(0);

    // assert
    var $editElement = testElement.find('.dx-edit-row');
    assert.strictEqual($editElement.length, 2);
    assert.ok($editElement.first().is("tbody"), "wrapping element");
    assert.ok($editElement.last().is("tr"), "wrapped element");

    // act
    that.cancelEditData();

    // assert
    $editElement = testElement.find('.dx-edit-row');
    assert.equal($editElement.length, 0);
});

QUnit.test('Edit number cell via keyboard arrows (arrow up key)', function(assert) {
    // arrange
    var $testElement = $('#container'),
        $testInput;

    var UP_KEY = "ArrowUp";

    this.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    this.headerPanel.render($testElement);
    this.rowsView.render($testElement);

    // act
    $($testElement.find('td').eq(1)).trigger('dxclick'); // Edit

    assert.equal(getInputElements($testElement.find('tbody > tr').first()).length, 1, "editor was created");

    $testInput = getInputElements($testElement).first();
    $testInput
        .val('15')
        .trigger($.Event('keydown', { key: UP_KEY }));

    this.editingController.closeEditCell();

    this.clock.tick();

    // assert
    assert.equal($testElement.find('td').eq(1).text(), '16', 'we will keep value that we increment by arrow up key');
});

QUnit.test('Edit number cell via keyboard arrows (arrow down key)', function(assert) {
    // arrange
    var $testElement = $('#container'),
        $testInput;

    var DOWN_KEY = "ArrowDown";

    this.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    this.headerPanel.render($testElement);
    this.rowsView.render($testElement);

    // act
    $($testElement.find('td').eq(1)).trigger('dxclick'); // Edit

    assert.equal(getInputElements($testElement.find('tbody > tr').first()).length, 1, "editor was created");

    $testInput = getInputElements($testElement).first();
    $testInput
        .val('15')
        .trigger($.Event('keydown', { key: DOWN_KEY }));

    this.editingController.closeEditCell();

    this.clock.tick();

    // assert
    assert.equal($testElement.find('td').eq(1).text(), "14", "we will keep value that we decrement by arrow down key");
});

// T136710
QUnit.test('Close Editing Number Cell and edit next cell on tab key', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        headerPanel = this.headerPanel,
        testElement = $('#container');

    var TAB_KEY = "Tab",
        $input;

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };
    headerPanel.render(testElement);
    rowsView.render(testElement);

    // act
    testElement.find('td').eq(1).trigger('dxclick'); // Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);

    $input = getInputElements(testElement).first();

    $input.val('15');
    $input.change();
    $($input).trigger($.Event('keydown', { key: TAB_KEY }));
    this.editingController.closeEditCell();
    this.clock.tick();

    // assert
    assert.ok(!testElement.find('td').eq(1).hasClass("dx-cell-modified"), 'cell is not modified');

    // act
    testElement.find('td').eq(1).trigger('dxclick'); // Edit
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);

    $input = getInputElements(testElement).first();
    $input.val('20');
    $input.change();
    $($input).trigger($.Event('keydown', { key: TAB_KEY }));

    this.editingController.closeEditCell();
    this.clock.tick();

    // assert
    assert.ok(testElement.find('td').eq(1).hasClass("dx-cell-modified"), 'cell is modified');
});

// T150178
QUnit.test("Remove the inserted row with edit mode batch and hidden column", function(assert) {
    // arrange
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

    // act
    that.addRow();

    // assert
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-inserted"), "has row inserted");

    // act
    that.deleteRow(0);

    // assert
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

    // act
    that.editRow(0);

    // assert
    assert.equal(getInputElements(testElement).length, 4, "has input");

    // arrange
    that.cancelEditData();

    that.options.onEditingStart = function(params) {
        params.cancel = true;
    };
    that.editingController.optionChanged({ name: "onEditingStart" });

    // act
    that.editRow(0);

    // assert
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

    // act
    that.editCell(0, 0);

    // assert
    assert.equal(testElement.find("input").length, 1, "has input");

    // arrange
    that.cancelEditData();

    that.options.onEditingStart = function(params) {
        params.cancel = true;
    };
    that.editingController.optionChanged({ name: "onEditingStart" });

    // act
    that.editRow(0);

    // assert
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

    // act
    that.addRow();
    that.editCell(0, 0);

    // assert
    assert.equal(testElement.find("input").length, 1, "has input");
});

// T181647
QUnit.test("Edit other row after inserting row when edit mode row", function(assert) {
    // arrange
    var that = this,
        rowsView = that.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        allowUpdating: true
    };

    rowsView.render(testElement);

    // act
    that.addRow();
    that.editRow(2);

    // assert
    assert.ok(!rowsView.element().find('tbody > tr').first().hasClass("dx-row-inserted"), "no has inserted row");
    assert.ok(rowsView.element().find('tbody > tr').eq(1).hasClass("dx-edit-row"), "has edit row");
});

QUnit.test('Insert Row', function(assert) {
    // arrange
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

    // act
    this.click(headerPanelElement, '.dx-datagrid-addrow-button');

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 4);

    // act
    testElement.find('tbody > tr').first().find('input').first().val('Test update row');
    testElement.find('tbody > tr').first().find('input').first().trigger('change');

    $newRow = testElement.find('tbody > tr').first();
    this.click($newRow, 'a:contains(Save)');

    // assert
    assert.equal($newRow.find('input').length, 0);
    assert.ok($newRow.hasClass("dx-row-inserted"));
    assert.equal(this.array.length, 8, 'items count');
    assert.ok(this.array[7].__KEY__);
    delete this.array[7].__KEY__;
    assert.deepEqual(this.array[7], { "name": "Test update row" });
});

QUnit.test('Insert Row without dataSource', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.dataSource.store = [];
    that.options.editing = {
        allowAdding: true
    };

    rowsView.render(testElement);
    that.dataController.init();

    // assert
    assert.ok(!rowsView._getRowElements().length, "not rows");

    // act
    that.addRow();

    // assert
    assert.equal(rowsView._getRowElements().length, 1, "count rows");
    assert.equal(rowsView._getTableElement().find(".dx-row-inserted").length, 1, "insert row");
});

QUnit.test("Insert row when set onInitNewRow", function(assert) {
    // arrange
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
        // assert
        assert.ok(params.data.__KEY__);
        delete params.data.__KEY__;
        assert.deepEqual(params.data, {}, "parameter data");

        params.data = { name: "Test" };
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onInitNewRow" });

    // assert
    assert.equal(testElement.find(".dx-data-row").length, 7, "count rows");

    // act
    that.addRow();

    // assert
    assert.equal(testElement.find(".dx-data-row").length, 8, "count rows");
    assert.equal(getInputElements(testElement).length, 4, "has inputs");
    assert.strictEqual(testElement.find('tbody > tr').first().find("input").first().val(), "Test", "value first input");

    // act
    that.saveEditData();

    // assert
    assert.equal(testElement.find(".dx-data-row").length, 8, "count rows");
    assert.equal(testElement.find("input").length, 0, "not has inputs");
    assert.strictEqual(testElement.find(".dx-data-row").last().find("td").first().text(), "Test", "text first cell");
});

QUnit.test("Insert row when set onRowInserting", function(assert) {
    // arrange
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
        // assert
        assert.deepEqual(values, {
            Test1: "test1",
            Test2: "test2"
        }, "update values");

        return originalInsert.apply(this, arguments);
    };

    that.options.onRowInserting = function(params) {
        // assert
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

    // assert
    assert.equal(testElement.find(".dx-data-row").length, 7, "count rows");

    // act
    that.addRow();

    // assert
    assert.equal(testElement.find(".dx-data-row").length, 8, "count rows");
    assert.equal(getInputElements(testElement).length, 4, "has inputs");

    // act
    that.saveEditData();

    // assert
    assert.equal(testElement.find(".dx-data-row").length, 8, "count rows");
    assert.equal(testElement.find("input").length, 0, "not has inputs");

    // arrange
    that.dataController.store().insert = originalInsert;
    that.options.onRowInserting = function(params) {
        params.cancel = true;
    };
    that.editingController.optionChanged({ name: "onRowInserting" });

    // act
    that.addRow();

    // assert
    assert.equal(testElement.find(".dx-data-row").length, 9, "count rows");
    assert.equal(getInputElements(testElement).length, 4, "has inputs");

    // act
    that.saveEditData();

    // assert
    assert.equal(testElement.find(".dx-data-row").length, 9, "count rows");
    assert.equal(getInputElements(testElement).length, 4, "has inputs");
});

QUnit.test("Insert row when set onRowInserted", function(assert) {
    // arrange
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
        // assert
        assert.ok(params.data.__KEY__);
        assert.deepEqual(params.key, params.data, "parameter key"); // T457499
        delete params.data.__KEY__;
        assert.deepEqual(params.data, { name: "Test" }, "parameter data");
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowInserted" });

    // act
    that.addRow();

    // assert
    assert.equal(getInputElements(testElement).length, 4, "has inputs");

    // act
    testElement.find("input").first().val("Test");
    testElement.find("input").first().trigger("change");

    // act
    that.saveEditData();

    // assert
    assert.equal(testElement.find("input").length, 0, "not has inputs");
});

// T457499
QUnit.test("onRowInserted - Check key after insert row when custom store", function(assert) {
    // arrange
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
            return d.resolve({ fieldTest: "testKey" }).promise();
        }
    };

    that.options.onRowInserted = function(params) {
        countCallOnRowInserted++;

        // assert
        assert.deepEqual(params.data, { fieldTest: "testKey" }, "parameter data"); // T726008
        assert.strictEqual(params.key, "testKey", "parameter key");
    };

    that.dataController.init();
    rowsView.render($testElement);
    that.editingController.optionChanged({ name: "onRowInserted" });

    // act
    that.addRow();
    that.saveEditData();

    // assert
    assert.strictEqual(countCallOnRowInserted, 1, "count call onRowInserted");
});

QUnit.test("onRowUpdated - Check data after update row when custom store", function(assert) {
    // arrange
    var that = this,
        countCallOnRowUpdated = 0,
        rowsView = this.rowsView,
        $testElement = $("#container");

    that.options.editing = {
        allowUpdating: true
    };
    that.options.dataSource = {
        load: function() {
            var d = $.Deferred();

            d.resolve(that.array);

            return d.promise();
        },
        update: function(key, values) {
            var d = $.Deferred();
            return d.resolve({ id: 2, name: "Updated", fromServer: true }).promise();
        }
    };

    that.options.onRowUpdated = function(params) {
        countCallOnRowUpdated++;

        // assert
        assert.deepEqual(params.data, { id: 2, name: "Updated", fromServer: true }, "parameter data"); // T726008
        assert.strictEqual(params.key, that.array[1], "parameter key");
    };

    that.dataController.init();
    rowsView.render($testElement);
    that.editingController.optionChanged({ name: "onRowUpdated" });

    // act
    that.cellValue(1, "name", "Updated");
    that.saveEditData();

    // assert
    assert.strictEqual(countCallOnRowUpdated, 1, "count call onRowUpdated");
});

// T147816
QUnit.test("Insert rows with edit mode batch", function(assert) {
    // arrange
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

    // act
    that.addRow();
    that.editCell(0, 0);

    testElement.find("input").first().val("Test");
    testElement.find("input").first().trigger("change");

    that.closeEditCell();
    that.clock.tick();

    that.addRow();

    $.when(that.saveEditData()).done(function() {
        // assert
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

// T278457
QUnit.test("Insert several rows and remove they with edit mode batch", function(assert) {
    // arrange
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

    // act
    that.addRow();
    that.addRow();
    that.saveEditData();

    that.deleteRow(7);
    that.deleteRow(8);

    $.when(that.saveEditData()).done(function() {
        // assert
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

// T808395
QUnit.test("First cell should be focused after inserting new row if startEditAction is 'dblClick'", function(assert) {
    // arrange
    var that = this,
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        mode: 'batch',
        startEditAction: "dblClick"
    };

    headerPanel.render(testElement);
    rowsView.render(testElement);

    // act
    this.addRow();
    this.clock.tick(300);

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1, 'first row has editor');
});

QUnit.test('Insert Row when batch editing', function(assert) {
    // arrange
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

    // act
    this.addRow();
    this.clock.tick(300);

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1, 'When insert row and batch editing - focus first cell');

    // T147811
    cells = testElement.find('tbody > tr').eq(0).find('td');
    assert.ok(cells.eq(0).hasClass("dx-editor-cell"), "first cell of the inserted row has editor");
    assert.equal(cells.eq(1).html(), "&nbsp;", "text in the second cell of the inserted row");
    assert.equal(cells.eq(2).html(), "&nbsp;", "text of the third cell of the inserted row");
    assert.equal(cells.eq(3).html(), "&nbsp;", "text of the fourth cell of the inserted row");
    assert.equal(cells.eq(4).html(), "&nbsp;", "text of the fifth cell of the inserted row");

    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-save-button').hasClass("dx-state-disabled"), 'save changes button enabled');
    assert.ok(!this.find(headerPanelElement, '.dx-datagrid-cancel-button').hasClass("dx-state-disabled"), 'cancel changes button enabled');

    // act
    testElement.find('td').first().trigger('dxclick');
    testElement.find('input').first().val('Test update row');
    testElement.find('input').first().trigger('change');

    // act
    testElement.find('td').eq(1).trigger('dxclick');

    // assert
    assert.ok(testElement.find('td').first().hasClass("dx-cell-modified"));
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-inserted"));

    // act
    this.click(headerPanelElement, '.dx-datagrid-save-button');

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.equal(this.array.length, 8, 'items count');
    assert.ok(this.array[7].__KEY__);
    delete this.array[7].__KEY__;
    assert.deepEqual(this.array[7], { "name": "Test update row" });
    assert.ok(this.find(headerPanelElement, '.dx-datagrid-save-button').hasClass("dx-state-disabled"), 'save changes button disabled');
    assert.ok(this.find(headerPanelElement, '.dx-datagrid-cancel-button').hasClass("dx-state-disabled"), 'cancel changes button disabled');
});

QUnit.test('Insert Row when "cell" edit mode', function(assert) {
    // arrange
    var that = this,
        headerPanel = that.headerPanel,
        rowsView = that.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        allowUpdating: true,
        mode: 'cell'
    };
    headerPanel.render(testElement);
    rowsView.render(testElement);

    // act
    that.addRow();
    that.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').eq(0)).length, 1, 'When insert row and cell editing - focus first cell');

    // act
    testElement.find('td').first().trigger('dxclick');
    testElement.find('input').first().val('Test update row');
    testElement.find('input').first().trigger('change');

    // act
    testElement.find('td').eq(1).trigger('dxclick');

    // assert
    assert.ok(testElement.find('td').first().hasClass("dx-cell-modified"));
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-inserted"));

    // act
    testElement.find('td').eq(5).trigger('dxclick');

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.equal(that.array.length, 8, 'items count');
    assert.ok(that.array[7].__KEY__);
    delete that.array[7].__KEY__;
    assert.deepEqual(that.array[7], { "name": "Test update row" });
    assert.ok(!testElement.find('.' + "dx-cell-modified").length);
    assert.ok(!testElement.find('.' + "dx-row-inserted").length);
});

QUnit.test('Insert Row when "cell" edit mode and the new value is not accepted yet', function(assert) {
    // arrange
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

    // act
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

    // assert
    assert.ok(hasNewValue);
});

QUnit.testInActiveWindow('Insert Row after scrolling', function(assert) {
    // arrange
    var that = this,
        done = assert.async(),
        headerPanel = this.headerPanel,
        rowsView = this.rowsView,
        headerPanelElement;

    that.options.editing = {
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };

    headerPanel.render(that.gridContainer);
    rowsView.render(that.gridContainer);
    rowsView.height(10);
    rowsView.resize();

    headerPanelElement = that.gridContainer.find('.dx-datagrid-header-panel').first();

    rowsView.scrollChanged.add(function() {
        // act
        that.click(headerPanelElement, '.dx-datagrid-addrow-button');

        // assert
        assert.strictEqual(rowsView.getTopVisibleItemIndex(), 1);
        assert.equal(getInputElements(that.gridContainer.find('tbody > tr').eq(1)).length, 4);

        // act
        that.gridContainer.find('input').first().val('Test');
        that.gridContainer.find('input').first().trigger('change');

        that.click(that.gridContainer.find('tbody > tr').eq(1), '.dx-link:contains(Save)');

        // assert
        assert.equal(getInputElements(that.gridContainer).length, 0, 'inputs count');
        assert.equal(that.array.length, 8, 'items count');
        delete that.array[7].__KEY__;
        assert.deepEqual(that.array[7], { name: 'Test' }, 'added item');
        done();
    });

    rowsView.element().dxScrollable('instance').scrollTo(45);
});

QUnit.test("Update cell when edit mode batch and set onRowUpdating", function(assert) {
    // arrange
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
        // assert
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
        // assert
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

    // act
    that.editCell(0, 0);
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 1, "count input");

    // act
    testElement.find("input").first().val("Test1");
    testElement.find("input").first().trigger("change");

    $(document).trigger("dxpointerdown"); // Save
    $(document).trigger("dxclick"); // Save
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 0, "count input");
    assert.strictEqual(testElement.find('tbody > tr').first().find("td").first().text(), "Test1", "text first cell");
    assert.equal(testElement.find(".dx-highlight-outline").length, 1, "has element with class name dx-highlight-outline");

    // act
    that.saveEditData();

    // assert
    assert.equal(testElement.find(".dx-highlight-outline").length, 0, "not has element with class name dx-highlight-outline");

    // arrange
    that.dataController.store().update = originalUpdate;
    that.options.onRowUpdating = function(params) {
        params.cancel = true;
    };
    that.editingController.optionChanged({ name: "onRowUpdating" });

    // act
    that.editCell(0, 0);
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 1, "count input");

    // act
    testElement.find("input").first().val("Test2");
    testElement.find("input").first().trigger("change");

    $(document).trigger("dxpointerdown"); // Save
    $(document).trigger("dxclick"); // Save
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 0, "count input");
    assert.strictEqual(testElement.find('tbody > tr').first().find("td").first().text(), "Test2", "text first cell");
    assert.equal(testElement.find(".dx-highlight-outline").length, 1, "has element with class name dx-highlight-outline");

    // act
    that.saveEditData();

    // assert
    assert.equal(testElement.find(".dx-highlight-outline").length, 1, "has element with class name dx-highlight-outline");
});

QUnit.test("Update cell when edit mode batch and cancel in onRowUpdating is deferred and resolved", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 0);
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 1, "count input");

    // act
    testElement.find("input").first().val("Test1");
    testElement.find("input").first().trigger("change");

    // $(document).trigger("dxclick"); // Save
    // that.clock.tick();
    that.saveEditData();

    // assert
    assert.ok(!that.dataController.store().update.called, "update is not called");

    // act
    cancelDeferred.resolve();

    // assert
    assert.equal(that.dataController.store().update.callCount, 1, "update called one time");
    assert.deepEqual(that.dataController.store().update.lastCall.args, [ that.array[0], { name: "Test1", room: 666 } ], "update args");
});

QUnit.test("Update cell when edit mode batch and cancel in onRowUpdating is Promise and resolved", function(assert) {
    // arrange
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

    var resolve,
        cancelPromise = new Promise(function(onResolve) {
            resolve = onResolve;
        });

    that.options.onRowUpdating = function(params) {

        cancelPromise.then(function() {
            params.newData.room = 666;
        });

        params.cancel = cancelPromise;
    };

    rowsView.render(testElement);
    that.editingController.optionChanged({ name: "onRowUpdating" });

    // act
    that.editCell(0, 0);
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 1, "count input");

    // act
    testElement.find("input").first().val("Test1");
    testElement.find("input").first().trigger("change");

    // $(document).trigger("dxclick"); // Save
    // that.clock.tick();
    that.saveEditData();

    // assert
    assert.ok(!that.dataController.store().update.called, "update is not called");
    cancelPromise.then(function() {
        assert.equal(that.dataController.store().update.callCount, 1, "update called one time");
        assert.deepEqual(that.dataController.store().update.lastCall.args, [ that.array[0], { name: "Test1", room: 666 } ], "update args");
    });

    // act
    resolve();

    return cancelPromise;
});

QUnit.test("Update cell when edit mode batch and cancel in onRowUpdating is deferred and resolved with true", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 0);
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 1, "count input");

    // act
    testElement.find("input").first().val("Test1");
    testElement.find("input").first().trigger("change");

    that.saveEditData();

    // assert
    assert.ok(!that.dataController.store().update.called, "update is not called");

    // act
    cancelDeferred.resolve(true);

    // assert
    assert.ok(!that.dataController.store().update.called, "update is not called");
    assert.ok(!dataErrors.length, "no data errors");
});

QUnit.test("Update cell when edit mode batch and cancel in onRowUpdating is deferred and rejected", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 0);
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 1, "count input");

    // act
    testElement.find("input").first().val("Test1");
    testElement.find("input").first().trigger("change");

    that.saveEditData();
    cancelDeferred.reject("Test Error Message");

    // assert
    assert.ok(!that.dataController.store().update.called, "update is not called");

    assert.deepEqual(dataErrors.length, 1, "data errors count");
    assert.ok(dataErrors[0] instanceof Error, "error has Error type");
    assert.equal(dataErrors[0].message, "Test Error Message", "error message");
});

QUnit.test("Update cell when edit mode bath and set onRowUpdated", function(assert) {
    // arrange
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
        // assert
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

    // act
    that.editCell(0, 0);
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 1, "count input");

    // act
    testElement.find("input").first().val("Test");
    testElement.find("input").first().trigger("change");

    $(document).trigger("dxpointerdown"); // Save
    $(document).trigger("dxclick"); // Save
    that.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 0, "count input");
    assert.strictEqual(testElement.find('tbody > tr').first().find("td").first().text(), "Test", "text first cell");
    assert.equal(testElement.find(".dx-highlight-outline").length, 1, "has element with class name dx-highlight-outline");

    // act
    that.saveEditData();

    // assert
    assert.equal(testElement.find(".dx-highlight-outline").length, 0, "not has element with class name dx-highlight-outline");
});

QUnit.test("Highlight modified boolean editor", function(assert) {
    // arrange
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

    // act
    that.editCell(0, booleanColumnIndex);
    that.clock.tick();

    var $checkbox = testElement.find(".dx-row").first().find(".dx-checkbox");

    // assert
    assert.equal($checkbox.length, 1, "count input");

    // act
    $($checkbox).trigger("dxclick");

    $(document).trigger("dxpointerdown"); // Save
    $(document).trigger("dxclick"); // Save
    that.clock.tick();

    // assert
    $checkbox = testElement.find(".dx-row").first().find(".dx-checkbox");
    assert.ok($checkbox.parent().hasClass("dx-highlight-outline"), 'checkbox parent is dx-highlight-outline');
    assert.ok($checkbox.parent().parent().hasClass("dx-editor-cell"), 'cell has dx-editor-cell class');
    assert.ok($checkbox.parent().parent().hasClass("dx-editor-inline-block"), 'cell has dx-editor-inline-block class');
    assert.ok($checkbox.parent().parent().hasClass("dx-cell-modified"), 'cell has dx-cell-modified class');
});

// T389185
QUnit.test("Not highlight calculated column", function(assert) {
    // arrange
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

    // act
    that.cellValue(0, 0, "test");
    that.clock.tick();

    assert.equal(testElement.find(".dx-row").first().find(".dx-cell-modified").length, 1, "one modified value");
    assert.ok(testElement.find(".dx-row").first().children().eq(0).hasClass("dx-cell-modified"), 1, "first cell is modified");
});

// T246535
QUnit.test("oldData on rowUpdating for checkbox editor", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        rowUpdatingCallCount = 0,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true
    };

    that.options.onRowUpdating = function(e) {
        // assert
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
    // act

    $($checkbox).trigger("dxclick");
    that.editingController.saveEditData();

    // assert
    assert.ok($checkbox.length, "checkbox found");
    assert.equal(rowUpdatingCallCount, 1, "rowUpdating call count");
});

QUnit.test("onRowUpdating should raise once if eventArgs.cancel is true for the checkBox data editor in cell edit mode (T656376)", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        rowUpdatingCallCount = 0,
        testElement = $("#container"),
        $checkbox;

    that.options.editing = {
        mode: "cell",
        allowUpdating: true
    };

    that.options.onRowUpdating = function(e) {
        ++rowUpdatingCallCount;
        e.cancel = true;
    };
    that.options.columns.push({ dataField: "booleanField", dataType: "boolean" });

    that.columnsController.reset();
    that.editingController.optionChanged({ name: "onRowUpdating" });
    rowsView.render(testElement);

    // act
    $checkbox = testElement.find(".dx-row").first().find(".dx-checkbox");
    $($checkbox).trigger("dxclick");

    // assert
    assert.ok($checkbox.length, "checkbox found");
    assert.equal(rowUpdatingCallCount, 1, "rowUpdating call count");
});

// T172738
QUnit.test("Highlight modified with option showEditorAlways true on column", function(assert) {
    // arrange
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

    // act
    that.columnOption(0, { showEditorAlways: true });

    // assert
    cell = rowsView.element().find("td").first();
    assert.ok(cell.find(".dx-texteditor").length, "has editor");
    assert.ok(cell.children().hasClass("dx-highlight-outline"), "has element with class dx-highlight-outline");
    assert.ok(!cell.hasClass("dx-cell-modified"), "not has class dx-cell-modified");

    // act
    var $input = $(cell.find("input"));
    $input.val("Test");
    $input.trigger("change");

    // assert
    assert.ok(cell.hasClass("dx-cell-modified"), "has class dx-cell-modified");
});

QUnit.test("onEditingStart should not have key if row is inserted and showEditorAlways true on column", function(assert) {
    // arrange
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

    // act
    that.addRow();
    that.clock.tick();

    // assert
    assert.deepEqual(editingStartKeys, [undefined, undefined], "onEditingStart called twice with undefined key");
});

QUnit.test("onRowUpdating should have oldData parameter if modify column with showEditorAlways true and with validationRules", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    that.options.editing = {
        mode: "batch",
        allowUpdating: true
    };

    rowsView.render(testElement);

    that.columnOption(0, { showEditorAlways: true, validationRules: [{ type: "required" }] });

    var onRowUpdatingArgs = [];
    that.options.onRowUpdating = function(e) {
        onRowUpdatingArgs.push(e);
    };
    that.editingController.optionChanged({ name: "onRowUpdating" });

    // act
    that.cellValue(0, 0, "Test");
    that.saveEditData();
    that.clock.tick();

    // assert
    assert.equal(onRowUpdatingArgs.length, 1, "onRowUpdating called once");
    assert.deepEqual(onRowUpdatingArgs[0].oldData, this.array[0], "onEditingStart have oldData parameter");
});

QUnit.test('Cancel Inserting Row after change page', function(assert) {
    // arrange
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

    // act
    that.click(headerPanelElement, '.dx-datagrid-addrow-button');

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 4);

    // act
    this.dataController.pageIndex(1);

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
});

QUnit.test('Remove row and Recover row when batch editing', function(assert) {
    // arrange
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

    // act
    this.click(testElement.find('tbody > tr').first(), 'a:contains(Delete)');

    // assert
    assert.equal(this.find(testElement.find('tbody > tr').first(), '.dx-link-undelete').text(), 'Undelete', 'Delete link changed to Undelete');
    assert.ok(testElement.find('tbody > tr').eq(0).hasClass("dx-row-removed"));
    assert.ok(!testElement.find('tbody > tr').eq(1).hasClass("dx-row-removed"));

    // act
    this.click(testElement.find('tbody > tr').first(), '.dx-link-undelete');

    // assert
    assert.equal(this.find(testElement.find('tbody > tr').first(), '.dx-link').text(), 'Delete', 'Recover link changed to Delete');
    assert.ok(!testElement.find('tbody > tr').eq(0).hasClass("dx-row-removed"));

    // act
    this.editingController.saveEditData();

    // assert
    assert.equal(this.array.length, 7, 'items count not changed');
});

QUnit.test("Remove row when set onRowRemoving", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 7, "count rows");

    // act
    that.deleteRow(0);
    $(".dx-dialog-button").first().trigger("dxclick");

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 7, "count rows");

    // arrange
    that.options.onRowRemoving = function(params) {
        params.cancel = false;
    };
    that.editingController.optionChanged({ name: "onRowRemoving" });

    // act
    that.deleteRow(0);
    that.clock.tick();
    $(".dx-dialog-button").first().trigger("dxclick");

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 6, "count rows");
});

// T677915
QUnit.test("Edit data should be reseted after remove error", function(assert) {
    var that = this,
        testElement = $('#container');

    that.options.editing = {
        mode: "cell",
        allowDeleting: true,
        texts: {
            confirmDeleteMessage: null
        }
    };

    that.getDataSource().store().remove = function() {
        return $.Deferred().reject("Test Error");
    };

    that.rowsView.render(testElement);

    // act
    that.deleteRow(0);

    // assert
    assert.notOk(that.hasEditData(), "no edit data");
});

QUnit.test("Remove row when set onRowRemoved", function(assert) {
    // arrange
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
        // T148294
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

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 7, "count rows");

    // act
    that.deleteRow(0);
    $(".dx-dialog-button").first().trigger("dxclick");

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 6, "count rows");
});

// T741746
QUnit.test("deleteRow should not work if adding is started", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowDeleting: true
    };

    rowsView.render(testElement);
    that.editingController.init();

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 7, "row count");

    // act
    that.addRow();
    that.deleteRow(2);

    // assert
    assert.ok(that.editingController.isEditing(), "editing is started");
    assert.equal(testElement.find('.dx-data-row').length, 8, "row is not removed");

    // act
    that.cancelEditData();
    that.deleteRow(2);

    // assert
    assert.notOk(that.editingController.isEditing(), "no editing");
    assert.equal(testElement.find('.dx-data-row').length, 6, "row is removed");
});

// T804894
QUnit.test("addRow should not work if updating is started with validation error", function(assert) {
    // arrange
    var that = this,
        testElement = $('#container');

    that.options.editing = {
        mode: "cell"
    };

    that.options.onRowValidating = function(e) {
        e.isValid = false;
    };

    that.validatingController.optionChanged({ name: "onRowValidating" });

    that.rowsView.render(testElement);
    that.editingController.init();

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 7, "row count");

    // act
    that.editCell(0, 0);
    that.cellValue(0, 0, "Test");
    that.addRow();

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 7, "row is not added");

    // act
    that.cancelEditData();
    that.addRow();

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 8, "row is added");
});

// T100624
QUnit.test('Edit Cell when the width of the columns in percent', function(assert) {
    // arrange
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

    // act
    testElement.find('td').first().trigger('dxclick');

    // assert
    assert.equal(testElement.find('td').first().find('input').length, 1, "has input");
    textEditor = testElement.find(".dx-texteditor");
    assert.equal(textEditor.length, 1, "text editor");
    assert.ok(!textEditor[0].style.width, "not width text editor");
});

QUnit.test("Close current editor when clicked on not editable cells_B255594", function(assert) {
    // arrange
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

    // act
    $(".dx-select-checkbox").closest("td").first().trigger("dxpointerdown");
    $(".dx-select-checkbox").closest("td").first().trigger("dxclick");

    // assert
    assert.ok(isCloseEditCell, "current editor is closed");
});

// T107779
QUnit.test('Column currency format after editing', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        mode: 'batch',
        allowUpdating: true
    };

    that.options.columns = ["name", { dataField: 'age', format: { type: "currency", precision: 3 } }];

    rowsView.render(testElement);

    that.columnsController.optionChanged({ name: 'columns', fullName: 'columns' });
    that.dataController.optionChanged({ name: 'columns', fullName: 'columns' });

    // assert
    assert.equal(testElement.find('td').first().next().text(), "$15.000", "cell text before editing");

    // act
    testElement.find('td').first().next().trigger("dxclick");
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1, "has input");
    assert.equal(testElement.find('td').first().next().find('input').val(), 15, "value input");

    // act
    testElement.find('td').first().next().find('input').val('123');
    testElement.find('td').first().next().find('input').trigger('change');
    $(document).trigger("dxpointerdown");
    $(document).trigger("dxclick");

    this.clock.tick();

    // assert
    assert.ok(!getInputElements(testElement.find('tbody > tr').first()).length, "not has input");
    assert.equal(testElement.find('td').first().next().text(), "$123.000", "cell text after editing");
});

QUnit.test('Add highlight outline by batch edit mode_T118843', function(assert) {
    // arrange
    var that = this,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    this.rowsView.render(testElement);
    testElement.find('td').eq(1).trigger('dxclick');

    // act
    testElement.find('input').first().val('11');
    testElement.find('input').first().trigger('change');

    testElement.find('td').eq(0).trigger('dxclick');

    // assert
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

    // act
    inputElement.val("");
    inputElement.trigger('change');

    testElement.find('td').eq(0).trigger('dxclick');

    $outlineElement = testElement.find(".dx-highlight-outline");

    // assert
    assert.strictEqual($outlineElement.text(), $("<div>&nbsp;</div>").text(), "empty text");
});

// T136710
QUnit.test('Add highlight outline by batch edit mode when delayed template used (KO)', function(assert) {
    // arrange
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

    // act
    testElement.find('input').first().val('Test11');
    testElement.find('input').first().trigger('change');

    that.editingController.closeEditCell();
    that.clock.tick();

    // assert
    var $elementWithOutline = testElement.find('td').first().find(".dx-highlight-outline");
    assert.strictEqual($elementWithOutline.length, 1, "highlight outline");
    assert.strictEqual($elementWithOutline.text(), 'test_Test11', "text in outline element");
});


QUnit.test("Append editorCell css class for row editing", function(assert) {
    // arrange
    var that = this,
        $cells,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: "row"
    };

    rowsView.render(testElement);

    // act
    this.editingController.editRow(0);
    $cells = testElement.find(".dx-editor-cell");

    // assert
    assert.equal($cells.length, 4, "length of cells");
    assert.equal($cells[0].cellIndex, 0);
    assert.equal($cells[1].cellIndex, 1);
    assert.equal($cells[2].cellIndex, 3);
    assert.equal($cells[3].cellIndex, 4);
});

// T136485
QUnit.test("Batch editing with complex keys", function(assert) {
    // arrange
    var $testElement = $("#container"),
        dataField = "name",
        newValue = "Alex1";

    this.options.editing = {
        allowUpdating: true,
        mode: "batch"
    };

    this.rowsView.render($testElement);

    // act
    this.editingController.updateFieldValue({
        cellElement: $testElement.find("td").first(),
        key: this.array[0],
        column: { dataField: dataField, setCellValue: function(data, value) { data[dataField] = value; } }
    }, newValue);
    this.dataController.reload();

    // assert
    assert.equal(this.dataController.items()[0].data[dataField], newValue);
});

QUnit.test('Close editing cell when using "cell" edit mode on click outside dataGrid and save data', function(assert) {
    // arrange
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
    testElement.find('td').first().trigger('dxclick'); // Edit
    this.clock.tick();

    // act
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);
    testElement.find('input').first().val('Test update cell');
    testElement.find('input').first().trigger('change');

    // act
    $(document).trigger('dxpointerdown');
    $(document).trigger('dxclick');
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.deepEqual(updateArgs, { "name": "Test update cell" });
});

QUnit.test('Cell should be closed on click outside dataGrid after changes in several cells if "cell" edit mode', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    that.options.loadingTimeout = 0;

    rowsView.render(testElement);
    this.editCell(0, 0);
    this.clock.tick();

    // act
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);
    testElement.find('input').first().val('Test update cell');
    testElement.find('input').first().trigger('change');

    this.editCell(0, 2);
    this.clock.tick();

    // act
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 1);
    testElement.find('input').first().val('Test update cell 2');
    testElement.find('input').first().trigger('change');

    // act
    $(document).trigger('dxpointerdown');
    $(document).trigger('dxclick');
    this.clock.tick();

    // assert
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).length, 0);
    assert.notOk(this.editingController.isEditing(), "editing cell is closed");
});

QUnit.test("When select all items editing row must have not 'dx-selection' class", function(assert) {
    // arrange
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

    // act
    this.selectAll();

    // assert
    assert.ok(!testElement.find('.' + rowClass).eq(0).hasClass(rowSelectionClass), 'row that editing now has no selection class');
    assert.ok(testElement.find('.' + rowClass).eq(1).hasClass(rowSelectionClass), 'row that not editing now has selection class');
});

// T186404
QUnit.test("When select all items row with modified cell must have 'dx-selection' class", function(assert) {
    // arrange
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

    // act
    this.selectAll();

    // assert
    var $rows = testElement.find('.' + rowClass);
    assert.ok($rows.eq(0).hasClass(rowSelectionClass), 'row has selection class');
    assert.ok($rows.eq(1).hasClass(rowSelectionClass), 'row has selection class');
});

// B255559
QUnit.test("Selection don't working for a inserted row", function(assert) {
    // arrange
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

    // act
    that.addRow();

    // assert
    assert.ok(!rowsView.element().find(".dx-row").first().find(".dx-select-checkbox").length, "not has checkbox for inserted row");
    assert.ok(rowsView.element().find(".dx-row").eq(1).find(".dx-select-checkbox").length, "has checkbox for data row");

    // act
    that.selectionController.changeItemSelection(0);

    // assert
    assert.ok(!rowsView.element().find("tr").first().hasClass("dx-selection"), "not selected a inserted row");
    assert.ok(!that.getSelectedRowKeys().length, "not selected row keys");
});

// T195944, T292164
QUnit.testInActiveWindow('Save edit data in cell mode on value change when showEditorAlways is true', function(assert) {
    // arrange
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
    that.$element = function() {
        return testElement;
    };

    that.editingController.saveEditData = function() {
        saveEditDataCallCount++;
        return saveEditData.apply(this, arguments);
    };

    rowsView.render(testElement);
    that.columnsController.init();

    selectBoxInstance = $(rowsView.getCellElement(0, 0)).find(".dx-selectbox").dxSelectBox("instance");

    // assert
    assert.strictEqual(selectBoxInstance.NAME, "dxSelectBox", "has selectBox");

    // act
    that.editCell(0, 0);

    selectBoxInstance.option("value", 2);
    that.clock.tick();

    // assert
    assert.equal(saveEditDataCallCount, 1, "save edit data called once");
    assert.strictEqual(getInputElements($(rowsView.getCellElement(0, 0))).val(), "test2", "value input");
    assert.ok($(rowsView.getCellElement(0, 0)).find(".dx-selectbox").hasClass("dx-state-focused"), "editor is focused");
});

// T425994, T429166, T469944
QUnit.testInActiveWindow('Cell should save focus state after data saving in cell editing mode', function(assert) {
    // arrange
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

    that.$element = function() {
        return testElement;
    };

    that.editingController.saveEditData = function() {
        saveEditDataCallCount++;
        return saveEditData.apply(this, arguments);
    };

    rowsView.render(testElement);
    that.columnsController.init();

    that.editCell(0, 0);

    editor = $(rowsView.getCellElement(0, 0)).find(".dx-textbox").dxTextBox("instance");

    // act
    editor.option("value", "test2");
    var $cell = that.getCellElement(0, 1);
    $($cell).trigger("dxclick");
    that.clock.tick(30);

    // assert
    assert.equal(saveEditDataCallCount, 1, "save edit data called once");
    assert.strictEqual($(rowsView.getCellElement(0, 0)).text(), "test2", "value input");
    assert.ok($(rowsView.getCellElement(0, 1)).find(".dx-widget").hasClass("dx-state-focused"), "editor is focused");
});

// T463800
QUnit.testInActiveWindow('Focus should not returns to previous cell after data saving in cell editing mode', function(assert) {
    // arrange
    var that = this,
        rowsView = that.rowsView,
        editor,
        testElement = $('#container');

    that.options.loadingTimeout = 30;
    that.options.columns[0] = { dataField: "name", showEditorAlways: true };

    that.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    that.$element = function() {
        return testElement;
    };

    rowsView.render(testElement);
    that.columnsController.init();

    that.editCell(0, 0);

    editor = $(rowsView.getCellElement(0, 0)).find(".dx-textbox").dxTextBox("instance");

    // act
    editor.option("value", "test2");
    that.editCell(0, 1);
    that.clock.tick(30);

    // assert
    assert.strictEqual($(rowsView.getCellElement(0, 0)).find("input").val(), "test2", "value input");
    assert.ok($(rowsView.getCellElement(0, 1)).find(".dx-widget").hasClass("dx-state-focused"), "editor is focused");
});

// T383760
QUnit.testInActiveWindow('Update be called once in cell mode on value change for boolean editor', function(assert) {
    // arrange
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
    that.$element = function() {
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

    var $checkBox = $(rowsView.getCellElement(0, 0)).find(".dx-checkbox");

    // assert
    assert.strictEqual($checkBox.length, 1, "has checkBox");

    // act
    that.editCell(0, 0);
    $checkBox.focus().trigger("dxclick");

    updateDeferred.resolve();
    that.clock.tick();

    // assert
    assert.equal(updateCallCount, 1, "update called once");
    assert.ok($(rowsView.getCellElement(0, 0)).find(".dx-checkbox").hasClass("dx-checkbox-checked"), "value is changed");
    assert.ok($(rowsView.getCellElement(0, 0)).find(".dx-checkbox").hasClass("dx-state-focused"), "editor is focused");
});

// T246542
QUnit.test('Error during save changes in batch mode', function(assert) {
    // arrange
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
        testElement.find('tbody > tr').eq(rowIndex).find('td').eq(columnIndex).trigger('dxclick'); // Edit
        assert.equal(testElement.find('tbody > tr').eq(rowIndex).find('input').length, 1);
        testElement.find('input').eq(0).val(text);
        testElement.find('input').eq(0).trigger('change');
    };

    // act
    editCell(0, 0, "Test1");
    editCell(1, 0, "Test2");
    editCell(2, 0, "Test3");

    // act
    this.editingController.saveEditData();
    this.clock.tick();


    // assert
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

// T555797
QUnit.testInActiveWindow('Focus position should be correct after editing in cell editing mode if data source is remote', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        allowDeleting: true,
        mode: 'cell'
    };
    that.$element = function() {
        return $testElement;
    };

    that.options.dataSource = {
        load: function() {
            return that.array;
        },
        update: function(key, values) {
            var d = $.Deferred();

            setTimeout(function() {
                $.extend(true, that.array[0], values);
                d.resolve();
            }, 100);

            return d;
        }
    };

    rowsView.render($testElement);
    that.dataController.optionChanged({ name: "dataSource" });

    // act
    that.cellValue(0, 0, "Test");
    that.editCell(0, 1);
    this.clock.tick(100);

    // assert
    assert.ok(!this.hasEditData(), 'edit data is empty');
    assert.equal(that.array[0].name, "Test", "value is saved");
    assert.ok($(":focus").hasClass("dx-texteditor-input"), "editor is focused");
    assert.ok($(this.getCellElement(0, 1)).hasClass("dx-focused"), "new edit cell is focused");
});

QUnit.testInActiveWindow('Focus position should be retured after editing in cell editing mode if remote updating return error', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        allowDeleting: true,
        mode: 'cell'
    };
    that.$element = function() {
        return $testElement;
    };

    that.options.dataSource = {
        load: function() {
            return that.array;
        },
        update: function(key, values) {
            var d = $.Deferred();

            setTimeout(function() {
                d.reject("Error");
            }, 100);

            return d;
        }
    };

    rowsView.render($testElement);
    that.dataController.optionChanged({ name: "dataSource" });

    // act
    that.editCell(0, 0);
    that.cellValue(0, 0, "Test");
    that.editCell(0, 1);
    this.clock.tick(100);

    // assert
    assert.ok(this.hasEditData(), 'edit data is not empty');
    assert.ok($(":focus").hasClass("dx-texteditor-input"), "editor is focused");
    assert.ok($(this.getCellElement(0, 0)).hasClass("dx-focused"), "new edit cell is focused");
});

QUnit.test("Add edit data with save array without extend_T256598", function(assert) {
    // arrange
    this.editingController._editData = [{
        data: { A: [11, 12] },
        key: 1,
        test: "test"
    }];

    // act
    this.editingController._addEditData({
        data: { A: [13] },
        key: 1,
        type: "number"
    });

    // assert
    assert.deepEqual(this.editingController._editData[0], {
        key: 1,
        isValid: true,
        data: { A: [13] },
        test: "test",
        type: "number"
    });
});

QUnit.test("isEditing parameter of the row when edit mode is 'row'", function(assert) {
    // arrange
    this.rowsView.render($("#container"));

    // act
    this.editRow(0);

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.ok(this.dataController.items()[0].isEditing, "isEditing parameter");
});

QUnit.test("isEditing parameter of the cell when edit mode is 'batch'", function(assert) {
    // arrange
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

    // act
    this.editCell(0, 0);

    // assert
    assert.equal(this.editingController._editColumnIndex, 0, "edit cell index");
    assert.equal(this.editingController._editRowIndex, 0, "edit row index");
    assert.ok(isEditingCell, "isEditing parameter of the cell");
    assert.ok(isEditingRow, "isEditing parameter of the row");
});

// T316439
QUnit.testInActiveWindow('Hide focus overlay before update on editing cell', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView;

    that.options.editing = {
        allowEditing: true,
        mode: 'batch'
    };
    rowsView.render(that.gridContainer);

    that.editCell(0, 0);
    that.clock.tick();

    // assert
    assert.ok(that.gridContainer.find('.dx-datagrid-focus-overlay').is(":visible"), 'visible focus overlay');

    // act
    that.editCell(0, 1);

    // assert
    assert.ok(!that.gridContainer.find('.dx-datagrid-focus-overlay').is(":visible"), 'not visible focus overlay');
    that.clock.tick();
    assert.ok(that.gridContainer.find('.dx-datagrid-focus-overlay').is(":visible"), 'visible focus overlay');
});

QUnit.test("Get first editable column index when form edit mode", function(assert) {
    // arrange
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

    // act
    var editableIndex = this.editingController.getFirstEditableColumnIndex();

    // assert
    assert.equal(editableIndex, 0, "editable index");
});

QUnit.test("Get first editable column index when form edit mode and custom form items is defined", function(assert) {
    // arrange
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

    // act
    var editableIndex = this.editingController.getFirstEditableColumnIndex();

    // assert
    assert.equal(editableIndex, 1, "editable index");
});

QUnit.test("Get correct first editable column index when form edit mode and form items are changed dynamically", function(assert) {
    // arrange
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

    // act
    this.editingController.option("editing.form", { items: ["phone", "room"] });
    this.editingController.optionChanged({ name: "editing" });

    that.editRow(0);

    var editableIndex = this.editingController.getFirstEditableColumnIndex();

    // assert
    assert.equal(editableIndex, 0, "editable index");
});

QUnit.test("Get correct first editable column index when visible option for item set via formItem option", function(assert) {
    // arrange
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

    // assert
    assert.equal(editableIndex, 0, "editable index");
});

// T664284
QUnit.test("Form should be updated after change editing.form options if editing mode is popup", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.$element = function() {
        return testElement;
    };

    that.options.editing = {
        allowUpdating: true,
        mode: "popup",
        form: {
            items: ["room"]
        },
        popup: {
            animation: false
        }
    };

    rowsView.render(testElement);

    that.editRow(0);

    // act
    this.editingController.option("editing.form.items", ["phone", "room"]);
    this.editingController.optionChanged({ name: "editing", fullName: "editing.form.items" });

    // assert
    assert.equal($(".dx-datagrid-edit-form-item").length, 2, "two form items are visible");
});

// T528580
QUnit.test("Save edit data when update fails in batch edit mode", function(assert) {
    // arrange
    var that = this,
        deferreds = [],
        rowsView = this.rowsView,
        $testElement = $('#container');

    that.options.editing.mode = "batch";
    that.options.dataSource = {
        load: function() {
            return that.array;
        },
        update: function(key, value) {
            var d = $.Deferred();
            deferreds.push(d);
            return d.promise();
        }
    };
    that.dataController.init();
    rowsView.render($testElement);

    that.cellValue(0, 0, "Test1");
    that.cellValue(1, 0, "Test2");
    that.saveEditData();

    // assert
    assert.strictEqual(deferreds.length, 2, "count of deferred updates");

    // act
    deferreds[1].reject();
    deferreds[0].resolve();

    // assert
    assert.deepEqual(that.editingController._editData.length, 1, "count of edit data");
    assert.deepEqual(that.editingController._editData[0].data, { name: "Test2" }, "new data");
    assert.deepEqual(that.editingController._editData[0].oldData, that.array[1], "old data");
});

// T539602
QUnit.test("loadingChanged should be called before editing oeprations", function(assert) {
    // arrange
    var that = this,
        deferreds = [],
        rowsView = this.rowsView,
        loadingChangedArgs = [],
        $testElement = $('#container');

    that.options.editing.mode = "batch";
    that.options.dataSource = {
        load: function() {
            return that.array;
        },
        update: function(key, value) {
            var d = $.Deferred();
            deferreds.push(d);
            return d.promise();
        }
    };
    that.dataController.init();
    rowsView.render($testElement);
    that.getDataSource().on("loadingChanged", function(isLoading) {
        loadingChangedArgs.push(isLoading);
    });

    // act
    that.cellValue(0, 0, "Test1");
    that.saveEditData();

    // assert
    assert.strictEqual(deferreds.length, 1, "count of deferred updates");
    assert.deepEqual(loadingChangedArgs, [true], "loading changed args after updating start");


    // act
    deferreds[0].resolve();

    // assert
    assert.deepEqual(loadingChangedArgs, [true, false, true, false], "loading changed args after updating end");
});

// T533546
QUnit.testInActiveWindow("The lookup column should keep focus after changing value when it has 'setCellValue' option", function(assert) {
    // arrange
    var that = this,
        $cellElement,
        lookupInstance,
        rowsView = that.rowsView,
        $testElement = $("#container");

    that.options.columns[0] = {
        dataField: "name",
        lookup: {
            dataSource: ["test1", "test2"]
        },
        setCellValue: function(rowData, value) {
            this.defaultSetCellValue(rowData, value);
        }
    };
    that.options.editing = {
        allowUpdating: true,
        mode: "cell"
    };
    that.$element = function() {
        return $testElement;
    };
    rowsView.render($testElement);
    that.columnsController.init();

    that.editCell(0, 0);
    that.clock.tick();

    // assert
    $cellElement = $(rowsView.element().find("tbody > tr").first().children().first());
    assert.ok($cellElement.hasClass("dx-focused"), "cell is focused");

    lookupInstance = rowsView.element().find(".dx-selectbox").dxSelectBox("instance");
    assert.ok(lookupInstance, "has lookup");

    // act
    lookupInstance.option("value", "test1");
    that.clock.tick();

    // assert
    $cellElement = $(rowsView.element().find("tbody > tr").first().children().first());
    assert.ok($cellElement.hasClass("dx-focused"), "cell is focused");
});

QUnit.testInActiveWindow("The focus should be saved after changing value in cascade non-lookup column in row editing mode", function(assert) {
    // arrange
    var that = this,
        $cellElement,
        rowsView = that.rowsView,
        $testElement = $("#container");

    that.options.columns[0] = {
        dataField: "name",
        setCellValue: function(rowData, value) {
            this.defaultSetCellValue(rowData, value);
        }
    };
    that.options.editing = {
        allowUpdating: true,
        mode: "row"
    };
    that.$element = function() {
        return $testElement;
    };
    rowsView.render($testElement);
    that.columnsController.init();

    that.editRow(0);
    that.clock.tick();

    var $input1 = $(rowsView.getCellElement(0, 0)).find(".dx-texteditor-input");
    var $input2 = $(rowsView.getCellElement(0, 1)).find(".dx-texteditor-input");

    // act
    $input1.val('Test name');
    $input2.focus();
    if(device.deviceType === "desktop") {
        $input2.get(0).setSelectionRange(1, 2);
    }
    $input1.trigger('change');
    that.clock.tick();

    // assert
    $cellElement = $(rowsView.getCellElement(0, 1));
    $input2 = $cellElement.find('.dx-texteditor-input');
    assert.ok($cellElement.hasClass("dx-focused"), "second cell is focused");
    if(device.deviceType === "desktop") {
        assert.equal($input2.get(0).selectionStart, 1, "selectionStart is correct");
        assert.equal($input2.get(0).selectionEnd, 2, "selectionEnd is correct");
    }
});

QUnit.testInActiveWindow("The focus should be saved after changing value in cascade non-lookup column in batch editing mode", function(assert) {
    // arrange
    var that = this,
        rowsView = that.rowsView,
        $testElement = $("#container");

    that.options.columns[0] = {
        dataField: "name",
        setCellValue: function(rowData, value) {
            this.defaultSetCellValue(rowData, value);
        }
    };
    that.options.editing = {
        allowUpdating: true,
        mode: "batch"
    };
    that.$element = function() {
        return $testElement;
    };
    rowsView.render($testElement);
    that.columnsController.init();

    that.editCell(0, 0);
    that.clock.tick();

    var $input = $(rowsView.getCellElement(0, 0)).find('.dx-texteditor-input');

    $input.val('Test name');
    var $secondCell = $(rowsView.getCellElement(0, 1));
    var mouse = pointerMock($secondCell).start();

    // act
    mouse.down();
    $input.trigger('change');
    mouse.up();
    that.clock.tick();

    // assert
    $secondCell = $(rowsView.getCellElement(0, 1));
    assert.ok($secondCell.hasClass("dx-focused"), "second cell is focused");
});

QUnit.test("Batch mode - Correct insert row index for a new row when a previous new row is deleted_T541129", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.options.editing = {
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        mode: 'batch',
        texts: {
            addRow: "Add New Item",
            saveGridChanges: "Save changes",
            cancelGridChanges: "Cancel changes"
        }
    };

    rowsView.render(testElement);

    // act
    this.addRow();
    this.addRow();
    this.deleteRow(1);
    this.addRow();

    // assert
    var items = this.dataController.items();
    assert.ok(items[0].isNewRow, "first row is inserted");
    assert.ok(items[1].isNewRow, "second row is inserted");
});

QUnit.test("Restore a height of rowsView when editing is canceled with empty data", function(assert) {
    // arrange
    var testElement = $('#container');

    this.options.editing = {
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        mode: 'row'
    };
    this.options.noDataText = "No Data";
    this.options.dataSource = [];
    this.$element = function() {
        return testElement;
    };
    this.dataController.init();

    this.gridView.render(testElement);
    this.resizingController.updateDimensions();
    this.clock.tick();

    var rowsViewHeight = $(".dx-datagrid-rowsview").height();

    // act
    this.addRow();
    this.cancelEditData();

    // assert
    assert.equal($(".dx-datagrid-rowsview").height(), rowsViewHeight, "height of rows view is not changed");
});

QUnit.test("Height of rowsView should more than height of editor form when row is inserted", function(assert) {
    // arrange
    var testElement = $('#container');

    this.options.editing = {
        allowAdding: true,
        mode: 'form'
    };
    this.options.dataSource = [];
    this.$element = function() {
        return testElement;
    };
    this.dataController.init();

    this.gridView.render(testElement);
    this.resizingController.updateDimensions();
    this.clock.tick();

    // act
    this.addRow();

    // assert
    assert.ok($(".dx-datagrid-rowsview").height() >= $(".dx-datagrid-edit-form").height(), "height of rows view");
});

// T601360
QUnit.test("repaintRows should be skipped on saving", function(assert) {
    // arrange
    var testElement = $('#container');

    this.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    this.options.loadingTimeout = 0;

    this.columns.push({ dataField: "selected", dataType: "boolean" });

    this.columnsController.init();


    this.clock.tick();

    this.rowsView.render(testElement);

    var changeCount = 0;
    this.dataController.changed.add(function() {
        changeCount++;
    });

    // act
    var checkboxInstance = testElement.find(".dx-checkbox").eq(0).dxCheckBox("instance");
    checkboxInstance.option("value", true);
    this.saveEditData();
    this.repaintRows([0]);

    // assert
    assert.strictEqual(changeCount, 0, "data is not changed");

    // act
    this.clock.tick();

    // assert
    assert.strictEqual(changeCount, 1, "data is changed once");
});

// T661354
QUnit.test("saveEditData is not called automatically after call cellValue", function(assert) {
    var testElement = $('#container'),
        onRowUpdatingSpy = sinon.spy();

    this.options.editing = {
        allowUpdating: true,
        mode: 'cell'
    };

    this.options.onRowUpdating = onRowUpdatingSpy;

    this.columns.push({ dataField: "selected", dataType: "boolean" });

    this.columnsController.init();

    this.rowsView.render(testElement);
    this.editingController.optionChanged({ name: "onRowUpdating" });

    this.cellValue(0, "selected", true);
    this.cellValue(1, "selected", true);
    assert.strictEqual(onRowUpdatingSpy.callCount, 0);

    this.saveEditData();
    assert.strictEqual(onRowUpdatingSpy.callCount, 2);
});

// T607746
QUnit.test("The cellValue method should work correctly with visible index", function(assert) {
    // arrange
    var $testElement = $("#container"),
        visibleColumns;

    this.options.columns = ["name", "age", { dataField: "lastName", visibleIndex: 0 }];
    this.columnsController.optionChanged({ name: "columns", fullName: "columns" });
    this.rowsView.render($testElement);
    visibleColumns = this.columnsController.getVisibleColumns().map(function(column) {
        return column.dataField;
    });

    // act, assert
    assert.strictEqual(this.cellValue(0, 2), 15, "value of the third cell");
    assert.deepEqual(visibleColumns, ["lastName", "name", "age"], "visible columns");
});

// T612318
QUnit.test("EditorPreparing and EditorPrepared events should have correct parameters for the select column", function(assert) {
    // arrange
    var $testElement = $("#container"),
        editorPreparingHandler = sinon.spy(),
        editorPreparedHandler = sinon.spy(),
        expectedProperties = ["parentType", "value", "setValue", "width", "cancel", "editorElement", "editorName", "editorOptions", "row"];

    this.options.onEditorPreparing = editorPreparingHandler;
    this.options.onEditorPrepared = editorPreparedHandler;
    this.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };
    this.selectionController.init();
    this.editorFactoryController.init();

    // act
    this.rowsView.render($testElement);
    this.clock.tick();

    // assert
    assert.strictEqual(editorPreparingHandler.getCall(0).args[0].command, "select", "The editorPreparing event argument - select column");
    assert.strictEqual(editorPreparedHandler.getCall(0).args[0].command, "select", "The editorPrepared event argument - select column");
    expectedProperties.forEach(function(item) {
        var firstArg = editorPreparingHandler.getCall(0).args[0];
        var hasFirstArgOwnProperty = Object.prototype.hasOwnProperty.bind(firstArg);
        assert.ok(hasFirstArgOwnProperty(item), "The editorPreparing event argument - The '" + item + "' property existed");
        assert.ok(hasFirstArgOwnProperty(item), "The editorPrepared event argument - The '" + item + "' property existed");
    });
});

// T624036
QUnit.test("Edit row should not throw an exception after change edit mode", function(assert) {
    // arrange
    fx.off = true;

    var $testElement = $("#container");

    this.$element = function() {
        return $testElement;
    };
    this.options.searchPanel = {
        text: "Zikerman"
    };
    this.dataController.init();
    this.rowsView.render($testElement);

    // assert
    assert.strictEqual(this.dataController.items().length, 1, "item count");

    this.options.loadingTimeout = 30;
    this.options.editing = {
        mode: "popup"
    };

    try {
        // act
        this.columnsController.optionChanged({ name: "editing", fullName: "editing" });
        this.editRow(0);

        // assert
        assert.strictEqual(this.dataController.items().length, 1, "item count");
        assert.ok(this.editingController._editPopup.option("visible"), "edit popup is visible");
    } catch(e) {
        // assert
        assert.ok(false, "exception");
    } finally {
        fx.off = false;
    }
});

// T642523
QUnit.test("Add row when data items are an instance of the class and one of the fields has getter", function(assert) {
    // arrange
    var that = this,
        items,
        rowsView = this.rowsView,
        $testElement = $("#container");

    function Employee(id, name, age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    Object.defineProperty(Employee.prototype, "isYoung", {
        get: function() {
            return this.age < 30;
        }
    });

    that.options.editing = {
        mode: "batch",
        allowAdding: true,
        texts: {
            addRow: "Add New Item",
            saveRowChanges: "Save"
        }
    };
    that.options.dataSource = [new Employee(1, "joe", 25)];
    that.options.columns = ["id", "name", "age", "isYoung"];
    that.options.onInitNewRow = function(e) {
        e.data = new Employee();
    };

    that.dataController.init();
    that.columnsController.init();
    rowsView.render($testElement);
    that.editingController.optionChanged({ name: "onInitNewRow" });

    // assert
    items = that.dataController.items();
    assert.strictEqual(items.length, 1, "item count");
    assert.ok(items[0].data instanceof Employee, "item is an instance of the Employee class");
    assert.strictEqual(items[0].data.isYoung, true, "field value");

    // act
    that.addRow();
    that.clock.tick();

    // assert
    items = that.dataController.items();
    assert.strictEqual(items.length, 2, "item count");
    assert.ok(items[0].isNewRow, "item is inserted");
    assert.ok(items[0].data instanceof Employee, "item is an instance of the Employee class");
    assert.strictEqual(items[0].data.isYoung, false, "field value");
});

if(device.ios || device.android) {
    // T322738
    QUnit.testInActiveWindow("Native click is used when allowUpdating is true", function(assert) {
        // arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.columns = ["name", "age"];
        that.options.editing = {
            allowUpdating: true,
            mode: 'batch'
        };

        rowsView.render(testElement);

        // assert
        assert.ok(testElement.find('table').hasClass("dx-native-click"), "native click is used");
    });

    // T322738
    QUnit.testInActiveWindow("Native click is not used when allowUpdating is false", function(assert) {
        // arrange
        var that = this,
            rowsView = this.rowsView,
            testElement = $('#container');

        that.options.editing = {
            allowUpdating: false,
            mode: 'batch'
        };
        // act
        rowsView.render(testElement);

        // assert
        assert.ok(!testElement.find('table').hasClass("dx-native-click"), "native click is not used");
    });
}


// T105941
QUnit.testInActiveWindow("Focused cell when editing cell in batch mode", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView;

    that.options.scrolling = {
        useNative: false
    };
    that.options.columns = ["name", "age"];
    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(that.gridContainer);
    that.columnsController.init();

    // act
    that.gridContainer.find('tbody > tr').first().find("td").first().trigger('dxclick'); // Edit
    that.clock.tick();

    // assert
    var $focusOverlay = that.gridContainer.find('.dx-datagrid-focus-overlay');
    assert.equal($focusOverlay.length, 1, 'focus overlay count');

    assert.equal(that.gridContainer.find('tbody > tr').first().find("td").first().outerWidth(), browser.mozilla ? $focusOverlay.outerWidth() : $focusOverlay.outerWidth() - 1, 'width focus overlay');

    // T192066
    var $editor = that.gridContainer.find('tbody > tr').first().find('td.dx-focused');

    assert.ok($editor.length, 'focused cell');
    assert.ok($editor.find(".dx-textbox").length, 'has textbox');
    assert.equal(that.editorFactoryController.focus().get(0), $editor.get(0));
});

QUnit.testInActiveWindow("Focused cell when editing cell in batch mode when fixed columns", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView;

    that.options.scrolling = {
        useNative: false
    };
    that.options.columns = [{ dataField: "name", fixed: true }, "age"];
    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(that.gridContainer);
    that.columnsController.init();

    // act
    that.gridContainer.find('.dx-datagrid-content-fixed tbody > tr').first().find("td").first().trigger('dxclick'); // Edit
    that.clock.tick();

    // assert
    var $focusOverlay = that.gridContainer.find('.dx-datagrid-focus-overlay');
    assert.equal($focusOverlay.length, 1, 'focus overlay count');

    assert.equal(that.gridContainer.find('.dx-datagrid-content-fixed tbody > tr').first().find("td").first().outerWidth(), browser.mozilla ? $focusOverlay.outerWidth() : $focusOverlay.outerWidth() - 1, 'width focus overlay');

    // T192066
    var $editor = that.gridContainer.find('.dx-datagrid-content-fixed tbody > tr').first().find('td.dx-focused');

    assert.ok($editor.length, 'focused cell');
    assert.ok($editor.find(".dx-textbox").length, 'has textbox');
    assert.equal(that.editorFactoryController.focus().get(0), $editor.get(0));
});

// T180058
QUnit.testInActiveWindow("Focused last cell width when editing cell in batch mode", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView;

    that.options.scrolling = {
        useNative: false
    };
    that.options.columns = ["name", "age"];
    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render(that.gridContainer);
    that.columnsController.init();

    // act
    that.gridContainer.find('tbody > tr').first().find("td").last().trigger('dxclick'); // Edit
    that.clock.tick();

    // assert
    var $focusOverlay = that.gridContainer.find('.dx-datagrid-focus-overlay');
    assert.equal($focusOverlay.length, 1, 'focus overlay count');

    assert.equal(that.gridContainer.find('tbody > tr').first().find("td").last().outerWidth(), browser.mozilla ? $focusOverlay.outerWidth() - 1 : $focusOverlay.outerWidth(), 'width focus overlay');
});

QUnit.test("Lookup editor with calculateDisplayValue", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 5);
    that.clock.tick();
    var $selectBox = $(rowsView.getCellElement(0, 5)).find(".dx-selectbox");
    $selectBox.dxSelectBox("instance").option("value", 2);
    that.closeEditCell();
    that.clock.tick();

    // assert
    var $cell = testElement.find(".dx-row").first().children("td").eq(5);

    assert.ok(!that.columnOption("stateId").lookup.items, "no items in lookup");
    assert.equal($cell.find(".dx-widget").length, 0, "no widgets in cell");
    assert.ok($cell.hasClass("dx-cell-modified"), "cell is modified");
    assert.equal($cell.text(), "state 2", "display text");
});

QUnit.test("Lookup editor in row mode do not update row", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 5);
    that.clock.tick();
    var $selectBox = $(rowsView.getCellElement(0, 5)).find(".dx-selectbox");
    var $cellBeforeChange = testElement.find(".dx-row").first().children("td").eq(5);
    $selectBox.dxSelectBox("instance").option("value", 2);
    that.clock.tick();
    var $cellAfterChange = testElement.find(".dx-row").first().children("td").eq(5);

    // assert
    assert.equal($cellBeforeChange.get(0), $cellAfterChange.get(0), "cell element is not changed");
    assert.ok($cellAfterChange.hasClass("dx-cell-modified"), "cell is modified");
    assert.equal(getInputElements($cellAfterChange).val(), "state 2", "display text");
});

// T379396
QUnit.test("Lookup editor must be closed after save edit data when rowsView have no scrollable", function(assert) {
    // arrange
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

    // act
    that.editRow(0);

    var $selectBox = $(rowsView.getCellElement(0, 5)).find(".dx-selectbox");

    $selectBox.dxSelectBox("instance").open();
    $selectBox.dxSelectBox("instance").close();
    that.clock.tick(500);

    assert.equal($selectBox.find(".dx-scrollable").length, 1, "scrollable is rendered in selectbox");
    $selectBox.dxSelectBox("instance").option("value", 1);

    that.saveEditData();

    // assert
    var $cell = $(rowsView.getCellElement(0, 5));
    assert.equal(testElement.find("input").length, 0, "no editors");
    assert.ok($cell.is(":visible"), "cell is visible");
    assert.equal($cell.find(".dx-selectbox").length, 0, "no selectbox");
    assert.equal($cell.text(), "state 2", "lookup text");
});

QUnit.test("Lookup editor with dataSource function", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 5);
    that.clock.tick();

    // assert
    var $selectBox = $(rowsView.getCellElement(0, 5)).find(".dx-selectbox");

    assert.equal($selectBox.length, 1, 'selectbox is created');
    assert.equal(dataSourceArgs.key, that.array[0], 'dataSource arg key');
    assert.equal(dataSourceArgs.data, that.array[0], 'dataSource arg data');

    assert.deepEqual($selectBox.dxSelectBox("instance").option("dataSource.filter"), ["room", "=", 1], 'selectbox item count');
});

QUnit.test('Change value with custom setCellValue', function(assert) {
    // arrange
    var that = this,
        params,
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
            params = $.makeArray(arguments);

            data[this.dataField] = value;
            data.phone = "";
        }
    };

    rowsView.render(testElement);
    that.columnsController.init();

    that.editingController.editRow(0);

    assert.equal(testElement.find('tbody > tr').first().find('input').eq(0).val(), "Alex");
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).eq(2).val(), "555555");

    // act
    testElement.find('tbody > tr').first().find('input').eq(0).val('Test name');
    testElement.find('tbody > tr').first().find('input').eq(0).trigger('change');
    this.clock.tick();

    // assert
    assert.equal(testElement.find('tbody > tr').first().find('input').eq(0).val(), "Test name");
    assert.equal(getInputElements(testElement.find('tbody > tr').first()).eq(2).val(), "");
    assert.equal(params.length, 4, "count of argument of the setCellValue");
    assert.deepEqual(params, [{ name: "Test name", phone: "" }, "Test name", this.array[0], undefined], "arguments");
});

QUnit.test("Changing the current row data in the setCellValue should not be applied", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $('#container');

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
        setCellValue: function(newData, value, currentRowData) {
            newData[this.dataField] = value;
            currentRowData.phone = "666";
        }
    };

    rowsView.render($testElement);
    that.columnsController.init();

    that.editingController.editRow(0);

    // act
    $testElement.find('tbody > tr').first().find('input').eq(0).val('Test name');
    $($testElement.find('tbody > tr').first().find('input').eq(0)).trigger('change');

    // assert
    assert.equal(getInputElements($testElement.find('tbody > tr').first()).eq(0).val(), "Test name");
    assert.equal(getInputElements($testElement.find('tbody > tr').first()).eq(2).val(), "555555");
});

QUnit.test("Cell validating is setCellValue is set and editing mode is form", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $('#container'),
        $targetInput;

    that.options.editing = {
        mode: "form",
        allowUpdating: true
    };
    that.options.columns[0] = {
        dataField: "name",
        setCellValue: (newData, value) => newData[this.dataField] = value,
        validationRules: [{
            type: "custom",
            validationCallback: () => { return false; }
        }]
    };

    rowsView.render($testElement);
    that.columnsController.init();

    that.editingController.editRow(0);

    $targetInput = $testElement.find('tbody > tr').first().find('input').first();

    // act
    $targetInput.val('Test name');
    $targetInput.trigger('change');
    this.clock.tick();

    // assert
    assert.ok($testElement.find("tbody > tr").first().find(".dx-texteditor").first().hasClass("dx-invalid"));
});

QUnit.test('cellValue', function(assert) {
    // arrange
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

    // act, assert
    assert.equal(this.cellValue(0, 0), "Alex", "get cell value by rowIndex, columnIndex");
    assert.equal(this.cellValue(0, "phone"), "555555", "get cell value by rowIndex, dataField");
    assert.equal(this.cellValue(0, "age"), 15, "get cell value by rowIndex and invisible dataField");

    assert.strictEqual(this.cellValue(10, 0), undefined, "get cell value by wrong rowIndex");
    assert.strictEqual(this.cellValue(0, "wrong"), undefined, "get cell value by wrong column");

    // act
    this.cellValue(0, 0, "Test name");
    this.cellValue(0, "age", 66);

    // assert
    assert.strictEqual(changedCount, 2, "changed is called after cellValue");
    assert.equal(testElement.find('tbody > tr').first().find('td').eq(0).text(), "Test name");
    assert.equal(this.cellValue(0, 0), "Test name", "get cell value by rowIndex, columnIndex");
    assert.equal(this.cellValue(0, "age"), 66, "get cell value by rowIndex and invisible dataField");

    assert.equal(testElement.find('tbody > tr').first().find('td').eq(1).text(), "John");

    // act
    this.columnOption("age", "visible", true);

    // assert
    assert.equal(testElement.find('tbody > tr').first().find('td').eq(1).text(), "66");
});

// T501819
QUnit.test('Change array cell value in batch edit mode', function(assert) {
    // arrange
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

    // act
    that.cellValue(0, "arr", [3]);

    // assert
    assert.deepEqual(that.cellValue(0, "arr"), [3], "value in grid is changed correctly");
    assert.deepEqual(that.array[0].arr, [1, 3], "value in array is not changed");
});

// T440578
QUnit.test('cellValue should works with beginUpdate/endUpdate', function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    var changes = [];
    that.dataController.changed.add(function(e) {
        changes.push(e);
    });

    // act
    this.dataController.beginUpdate();

    this.cellValue(0, 0, "Test1");
    this.cellValue(0, 1, 101);

    this.cellValue(1, 0, "Test2");
    this.cellValue(1, 1, 102);

    this.dataController.endUpdate();

    // assert
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

// T355235
QUnit.test('cellValue in onCellPrepared', function(assert) {
    // arrange
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

    // act
    rowsView.render(testElement);


    // assert
    assert.deepEqual(values, ["Alex", "Dan", "Vadim", "Dmitry", "Sergey", "Kate", "Dan"], "values for first column");
    assert.deepEqual(prevRowValues, [undefined, "Alex", "Dan", "Vadim", "Dmitry", "Sergey", "Kate"], "prev row values for first column");
});

// T319885
QUnit.testInActiveWindow("Focused lookup column with showEditorAlways is enabled", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "focus is not actual for mobile devices");
        return;
    }

    // arrange
    var that = this,
        callCountFocusEditingCell = 0,
        rowsView = this.rowsView;

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

    rowsView.render(that.gridContainer);
    that.columnsController.init();

    that.editingController._focusEditingCell = function() {
        callCountFocusEditingCell++;
    };

    // act
    $(that.gridContainer.find("tbody > tr").first().find("td").first().find(".dx-selectbox-container")).trigger("dxclick"); // Edit
    that.clock.tick();

    // assert
    var $focusOverlay = that.gridContainer.find('.dx-datagrid-focus-overlay');
    assert.equal($focusOverlay.length, 1, 'focus overlay count');
    assert.ok(!callCountFocusEditingCell, "not call focusEditingCell");
});

// T266499
QUnit.test("columnOption in onEditingStart and onInitNewRow", function(assert) {
    // arrange
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

    // act
    that.editRow(0);

    // assert
    assert.equal($testElement.find(".dx-edit-row").eq(0).children().eq(0).find("input").length, 0, "first edit row cell is not editable");

    // act
    that.cancelEditData();
    that.addRow();
    that.clock.tick();

    // assert
    assert.equal($testElement.find(".dx-edit-row").length, 1, "one edit row");
    assert.equal($testElement.find(".dx-edit-row").eq(0).children().eq(0).find("input").length, 1, "first added row cell is editable");
    assert.equal(initNewRowCallCount, 1, "initNewRow call count");
    assert.equal(editingStartCallCount, 1, "editingStart call count");
});

QUnit.test("hasChanges with rowIndex", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: 'batch'
    };

    rowsView.render($testElement);

    // act
    that.cellValue(1, 0, "test");

    // assert
    assert.notOk(that.editingController.hasChanges(0), "the first row hasn't changed");
    assert.ok(that.editingController.hasChanges(1), "the second row has changed");
});

QUnit.test("Get first editable column index when there is custom select column", function(assert) {
    // arrange
    var that = this,
        editableIndex,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowUpdating: true
    };
    that.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };
    that.options.columns.unshift({ type: "selection" });
    that.selectionController.init();
    that.columnsController.reset();

    rowsView.render($testElement);
    that.editRow(0);

    // act
    editableIndex = that.editingController.getFirstEditableColumnIndex();

    // assert
    assert.equal(editableIndex, 1, "editable index");
});

QUnit.test("Add a custom link for the 'buttons' command column", function(assert) {
    // arrange
    var that = this,
        $linkElements,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowUpdating: true,
        allowDeleting: true
    };
    that.options.columns.push({
        type: "buttons",
        buttons: ["edit", "delete", { name: "cancel", visible: false }, {
            text: "My link",
            cssClass: "mylink"
        }]
    });
    that.columnsController.reset();

    // act
    rowsView.render($testElement);

    // assert
    $linkElements = $testElement.find(".dx-command-edit").first().find(".dx-link");
    assert.strictEqual($linkElements.length, 3, "link count");
    assert.ok($linkElements.eq(0).hasClass("dx-link-edit"), "the edit link");
    assert.ok($linkElements.eq(1).hasClass("dx-link-delete"), "the delete link");
    assert.ok($linkElements.eq(2).hasClass("mylink"), "custom link");
    assert.strictEqual($linkElements.eq(2).text(), "My link", "text of the custom link");

    // act
    that.editRow(0);

    // assert
    $linkElements = $testElement.find(".dx-command-edit").first().find(".dx-link");
    assert.strictEqual($linkElements.length, 2, "link count");
    assert.ok($linkElements.eq(0).hasClass("dx-link-save"), "the save link");
    assert.ok($linkElements.eq(1).hasClass("mylink"), "custom link");
    assert.strictEqual($linkElements.eq(1).text(), "My link", "text of the custom link");
});

// T814768
QUnit.test("Button with svg icon in command column", function(assert) {
    // arrange
    var that = this,
        $commandElement,
        $svgIcon,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowUpdating: true
    };

    that.options.columns.push({
        type: "buttons",
        buttons: ["edit", {
            hint: "Clone",
            icon: "<svg height='20' width='20'><circle cx='10' cy='10' r='100' stroke='black' stroke-width='3' fill='red' /></svg>"
        }]
    });

    that.columnsController.reset();

    // act
    that.rowsView.render($testElement);

    // assert
    $commandElement = $(".dx-command-edit-with-icons").eq(0);
    $svgIcon = $commandElement.find(".dx-svg-icon");

    assert.ok($svgIcon.length, "svg icon");
    assert.ok($svgIcon.find("circle").length, "svg icon content");
});

QUnit.test("Add a custom icon for the 'buttons' command column", function(assert) {
    // arrange
    var that = this,
        $linkElements,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowUpdating: true,
        allowDeleting: true
    };
    that.options.columns.push({
        type: "buttons",
        buttons: ["edit", "delete", {
            text: "My icon",
            cssClass: "myicon",
            icon: "doc"
        }]
    });
    that.columnsController.reset();

    // act
    rowsView.render($testElement);

    // assert
    $linkElements = $testElement.find(".dx-command-edit").first().find(".dx-link");
    assert.ok($testElement.find(".dx-command-edit").first().hasClass("dx-command-edit-with-icons"), "command edit cell has icons");
    assert.strictEqual($linkElements.length, 3, "link count");
    assert.ok($linkElements.eq(0).hasClass("dx-link-edit"), "the edit link");
    assert.ok($linkElements.eq(1).hasClass("dx-link-delete"), "the delete link");
    assert.ok($linkElements.eq(2).hasClass("dx-icon-doc"), "custom icon");
    assert.ok($linkElements.eq(2).hasClass("myicon"), "icon has the myicon class");
    assert.strictEqual($linkElements.eq(2).text(), "", "text of the custom link");
    assert.strictEqual($linkElements.eq(2).attr("title"), "My icon", "title of the custom link");
});

QUnit.test("Add a custom cssClass for image icons in the 'buttons' command column (T807766)", function(assert) {
    // arrange
    var that = this,
        $buttonElement,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.columns.push({
        type: "buttons",
        buttons: [{
            icon: "https://test.svg",
            cssClass: "myIcon"
        }]
    });
    that.columnsController.reset();

    // act
    rowsView.render($testElement);

    // assert
    $buttonElement = $testElement.find(".dx-command-edit").first().find("img").first();
    assert.ok($testElement.find(".dx-command-edit").first().hasClass("dx-command-edit-with-icons"), "Command edit cell has icons");
    assert.ok($buttonElement.hasClass("myIcon"), "Custom cssClass is applied");
    assert.ok($buttonElement.hasClass("dx-icon"), "Custom icon is created");
});

QUnit.test("Add a custom command column", function(assert) {
    // arrange
    var that = this,
        $linkElements,
        $customCommandCell,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowUpdating: true,
        allowDeleting: true
    };
    that.options.columns.push({ type: "buttons" }, {
        type: "buttons",
        cssClass: "mybuttons",
        buttons: [
            {
                text: "My link",
                cssClass: "mylink"
            },
            {
                template: function($cellElement, options) {
                    return $("<div/>").addClass("mybutton").text("My button");
                }
            }
        ]
    });
    that.columnsController.reset();

    // act
    rowsView.render($testElement);

    // assert
    $linkElements = $testElement.find(".dx-command-edit").first().find(".dx-link");
    assert.strictEqual($linkElements.length, 2, "link count");
    assert.ok($linkElements.eq(0).hasClass("dx-link-edit"), "the edit link");
    assert.ok($linkElements.eq(1).hasClass("dx-link-delete"), "the delete link");

    $customCommandCell = $testElement.find(".mybuttons").first();
    assert.strictEqual($customCommandCell.length, 1, "has custom command cell");
    assert.strictEqual($customCommandCell.children(".mylink").length, 1, "has custom link");
    assert.strictEqual($customCommandCell.children(".mylink").text(), "My link", "text of the custom link");
    assert.strictEqual($customCommandCell.children(".mybutton").length, 1, "has custom button");
    assert.strictEqual($customCommandCell.children(".mybutton").text(), "My button", "text of the custom button");
});

QUnit.test("Changing edit icon in the 'buttons' command column", function(assert) {
    // arrange
    var that = this,
        $linkElements,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowUpdating: true,
        allowDeleting: true
    };
    that.options.columns.push({
        type: "buttons",
        buttons: [{ name: "edit", icon: "doc" }, "delete"]
    });
    that.columnsController.reset();

    // act
    rowsView.render($testElement);

    // assert
    $linkElements = $testElement.find(".dx-command-edit").first().find(".dx-link");
    assert.ok($testElement.find(".dx-command-edit").first().hasClass("dx-command-edit-with-icons"), "command edit cell has icons");
    assert.strictEqual($linkElements.length, 2, "link count");
    assert.ok($linkElements.eq(0).hasClass("dx-link-edit"), "the edit link");
    assert.ok($linkElements.eq(0).hasClass("dx-icon-doc"), "the edit link");
});

QUnit.test("The custom link of the 'buttons' command column should only be visible when the row is not editable", function(assert) {
    // arrange
    var that = this,
        $linkElements,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowUpdating: true,
        allowDeleting: true
    };
    that.options.columns.push({
        type: "buttons",
        buttons: ["edit", {
            text: "My link",
            cssClass: "mylink",
            visible: function(options) {
                return !options.row.isEditing;
            }
        }]
    });
    that.columnsController.reset();
    rowsView.render($testElement);

    // assert
    $linkElements = $testElement.find(".dx-command-edit").first().find(".dx-link");
    assert.strictEqual($linkElements.length, 2, "link count");
    assert.ok($linkElements.eq(0).hasClass("dx-link-edit"), "the edit link");
    assert.ok($linkElements.eq(1).hasClass("mylink"), "custom link");

    // act
    that.editRow(0);

    // assert
    $linkElements = $testElement.find(".dx-command-edit").first().find(".dx-link");
    assert.strictEqual($linkElements.length, 2, "link count");
    assert.ok($linkElements.eq(0).hasClass("dx-link-save"), "the save link");
    assert.ok($linkElements.eq(1).hasClass("dx-link-cancel"), "the cancel link");
});

QUnit.test("Clicking on the edit link should not work when the link is set via the 'buttons' option and allowUpdating is false", function(assert) {
    // arrange
    var that = this,
        $linkElements,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowUpdating: false,
    };
    that.options.columns.push({
        type: "buttons",
        buttons: [{ name: "edit", visible: true }]
    });
    that.columnsController.reset();
    rowsView.render($testElement);

    // assert
    $linkElements = $testElement.find(".dx-command-edit").first().find(".dx-link");
    assert.strictEqual($linkElements.length, 1, "link count");
    assert.ok($linkElements.eq(0).hasClass("dx-link-edit"), "the edit link");

    // act
    $linkElements.first().trigger("dxclick");
    that.clock.tick();

    // assert
    assert.notOk($testElement.find(".dx-datagrid-rowsview tbody > tr").first().hasClass("dx-edit-row"), "row not editable");
});

QUnit.test("Set edit button for a specific row", function(assert) {
    // arrange
    var that = this,
        $rowElements,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowUpdating: function(options) {
            return options.row.rowIndex % 2 === 0;
        }
    };
    that.editingController.init();

    // act
    rowsView.render($testElement);

    // assert
    $rowElements = $testElement.find(".dx-datagrid-rowsview tbody > .dx-data-row");
    assert.strictEqual($rowElements.eq(0).find(".dx-link-edit").length, 1, "first row has the edit link");
    assert.strictEqual($rowElements.eq(1).find(".dx-link-edit").length, 0, "second row hasn't the edit link");
    assert.strictEqual($rowElements.eq(2).find(".dx-link-edit").length, 1, "third row has the edit link");
});

QUnit.test("Set delete button for a specific row", function(assert) {
    // arrange
    var that = this,
        $rowElements,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "row",
        allowDeleting: function(options) {
            return options.row.rowIndex % 2 === 0;
        }
    };
    that.editingController.init();

    // act
    rowsView.render($testElement);

    // assert
    $rowElements = $testElement.find(".dx-datagrid-rowsview tbody > .dx-data-row");
    assert.strictEqual($rowElements.eq(0).find(".dx-link-delete").length, 1, "first row has the delete link");
    assert.strictEqual($rowElements.eq(1).find(".dx-link-delete").length, 0, "second row hasn't the delete link");
    assert.strictEqual($rowElements.eq(2).find(".dx-link-delete").length, 1, "third row has the delete link");
});

// T697205
QUnit.test("The button column should not be shown in the edit form", function(assert) {
    // arrange
    var that = this,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true
    };
    that.options.columns.unshift({
        type: "buttons",
        buttons: ["edit"]
    });
    that.columnsController.reset();
    rowsView.render($testElement);

    // act
    that.editRow(0);

    // assert
    assert.strictEqual($testElement.find(".dx-datagrid-edit-form-item").length, 5, "count editor of the form");
});

// T729713
QUnit.test("Cell mode - The editCellTemplate of the column should not be called when editing another column", function(assert) {
    // arrange
    var that = this,
        $inputElement,
        rowsView = that.rowsView,
        $testElement = $("#container"),
        editCellTemplate = sinon.spy(function(_, options) {
            return $("<div>").dxTextBox({
                value: options.value,
                onValueChanged: function(e) {
                    options.setValue(e.value);
                }
            });
        });

    that.options.editing = {
        allowUpdating: true,
        mode: "cell"
    };

    rowsView.render($testElement);
    that.columnOption("name", "editCellTemplate", editCellTemplate);

    // act
    $(rowsView.getCellElement(0, 0)).trigger("dxclick");
    that.clock.tick();

    $inputElement = getInputElements($(rowsView.getCellElement(0, 0))).first();
    $inputElement.val("test");

    // assert
    assert.strictEqual(editCellTemplate.callCount, 1);

    // act
    eventsEngine.trigger($inputElement[0], "change");
    $(rowsView.getCellElement(0, 1)).trigger("dxclick");
    that.clock.tick();

    // assert
    assert.strictEqual(editCellTemplate.callCount, 1);
});

// T725319
QUnit.test("Load panel should be hidden when changing loadPanel.enabled while loading", function(assert) {
    // arrange
    fx.off = true;

    try {
        var that = this,
            $testElement = $("#container");

        that.options.editing = {
            mode: "row",
            allowUpdating: true,
            allowDeleting: true,
            texts: {
                confirmDeleteMessage: "",
                editRow: ""
            }
        };
        that.options.loadPanel = {
            enabled: true
        };
        that.options.onRowRemoving = function(e) {
            setTimeout(() => {
                that.option("loadPanel.enabled", false);
                that.rowsView.beginUpdate();
                that.rowsView.optionChanged({ name: "loadPanel", fullName: "loadPanel.enabled" });
                that.rowsView.endUpdate();
            }, 10);
            e.cancel = $.Deferred().promise();
        };
        that.isReady = function() {
            that.dataController.isReady();
        };

        that.rowsView.render($testElement);
        that.editingController.optionChanged({ name: "onRowRemoving" });

        // act
        that.deleteRow(0);
        that.clock.tick(10);

        // assert
        assert.notOk(that.rowsView._loadPanel, "hasn't loadPanel");
    } finally {
        fx.off = false;
    }
});

// T737789
QUnit.test("The command column caption should be applied", function(assert) {
    // arrange
    var that = this,
        $commandCellElement,
        columnHeadersView = that.columnHeadersView,
        $testElement = $('#container');

    that.options.showColumnHeaders = true;
    that.options.editing = {
        mode: "row",
        allowUpdating: true,
        allowDeleting: true
    };
    that.options.columns.push({
        type: "buttons",
        caption: "Command Column",
        alignment: "right",
        buttons: ["edit", "delete"]
    });
    that.columnsController.reset();

    // act
    columnHeadersView.render($testElement);

    // assert
    $commandCellElement = $(columnHeadersView.getCellElement(0, 5));
    assert.ok($commandCellElement.hasClass("dx-command-edit"), "has command column");
    assert.strictEqual($commandCellElement.text(), "Command Column", "caption");
    assert.strictEqual($commandCellElement.css("textAlign"), "right", "alignment");
});

// T741679
QUnit.test("A dependent cascading editor should be updated when a master cell value is changed if showEditorAlways is enabled in batch mode", function(assert) {
    // arrange
    var that = this,
        selectBoxInstance,
        rowsView = that.rowsView,
        $testElement = $('#container');

    that.options.editing = {
        mode: "batch",
        allowUpdating: true
    };
    that.options.dataSource.store = [{ StateID: 1, CityID: 1 }, { StateID: 2, CityID: 2 }];
    that.options.columns = [{
        dataField: "StateID",
        showEditorAlways: true,
        setCellValue: function(rowData, value) {
            rowData.StateID = value;
            rowData.CityID = value;
        },
        lookup: {
            dataSource: [{ id: 1, name: "California" }, { id: 2, name: "Texas" }],
            displayExpr: "name",
            valueExpr: "id"
        }
    }, {
        dataField: "CityID",
        lookup: {
            dataSource: [{ id: 1, name: "Arcadia" }, { id: 2, name: "Dallas" }],
            displayExpr: "name",
            valueExpr: "id"
        }
    }];
    that.dataController.init();
    that.columnsController.init();
    rowsView.render($testElement);

    selectBoxInstance = $(rowsView.getCellElement(0, 0)).find(".dx-selectbox").dxSelectBox("instance");
    selectBoxInstance.option("value", 2);

    // act
    $(rowsView.getCellElement(1, 0)).trigger("dxclick");

    // assert
    assert.strictEqual($(rowsView.getCellElement(0, 1)).text(), "Dallas", "text of the second column of the first row");
});


QUnit.module('Refresh modes', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = () => $("#container");
        this.gridContainer = $("#container > .dx-datagrid");

        this.array = [
            { id: 1, name: 'Alex', age: 15 },
            { id: 2, name: 'Dan', age: 16 },
            { id: 3, name: 'Vadim', age: 17 },
            { id: 4, name: 'Alex', age: 18 },
            { id: 5, name: 'Sergey', age: 18 }
        ];
        this.columns = ['name', 'age'];
        this.options = {
            editing: {
                mode: 'batch'
            },
            cacheEnabled: true,
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: {
                store: this.array,
                paginate: true
            }
        };

        this.setupModules = function() {
            var that = this;

            setupDataGridModules(that, ['data', 'columns', 'rows', 'gridView', 'editing', 'selection', 'grouping', 'editorFactory', 'columnFixing'], {
                initViews: true
            });

            that.loadingArgs = [];

            that.getDataSource().store().on("loading", function(options) {
                that.loadingArgs.push(options);
            });

            that.changedArgs = [];
            that.getDataSource().on("changed", function(options) {
                that.changedArgs.push(options);
            });

            that.dataControllerChangedArgs = [];
            that.dataController.changed.add(function(options) {
                that.dataControllerChangedArgs.push(options);
            });

            that.rowsView.render($('#container'));
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("Editing with refresh mode full", function(assert) {
    // arrange
    this.setupModules();

    // act
    this.cellValue(1, "age", 30);
    this.saveEditData();

    // assert
    assert.equal(this.loadingArgs.length, 1, "loading is occured after editing");
    assert.equal(this.changedArgs.length, 1, "changed is occured after editing");
    assert.equal(this.array[1].age, 30, "data is updated");
    assert.equal(this.getVisibleRows()[1].data.age, 30, "row data is updated");
    assert.equal(this.getVisibleRows()[1].values[1], 30, "row values are updated");
});

QUnit.test("Editing with refresh mode reshape", function(assert) {
    // arrange
    this.options.editing.refreshMode = "reshape";
    this.setupModules();

    // act
    this.addRow();
    this.cellValue(0, "name", "Mike");
    this.cellValue(2, "age", 30);
    this.saveEditData();

    // assert
    assert.equal(this.loadingArgs.length, 0, "loading is not occured after editing");
    assert.equal(this.changedArgs.length, 1, "changed is occured after editing");
    assert.equal(this.array[1].age, 30, "data is updated");
    assert.equal(this.getVisibleRows()[1].data.age, 30, "row data is updated");
    assert.equal(this.getVisibleRows()[1].values[1], 30, "row values are updated");

    assert.equal(this.array[this.array.length - 1].name, "Mike", "data is inserted to end");
    assert.equal(this.getVisibleRows()[this.array.length - 1].data.name, "Mike", "row is inserted and reshaped");
});

QUnit.test("Editing with refresh mode repaint", function(assert) {
    // arrange
    this.options.editing.refreshMode = "repaint";
    this.setupModules();

    // act
    this.addRow();
    this.cellValue(0, "name", "Mike");
    this.cellValue(2, "age", 30);
    this.deleteRow(3);
    this.saveEditData();

    // assert
    assert.equal(this.loadingArgs.length, 0, "loading is not occured after editing");
    assert.equal(this.changedArgs.length, 0, "changed is not occured after editing");


    assert.equal(this.array[1].age, 30, "data is updated");
    assert.equal(this.getVisibleRows()[2].data.age, 30, "row data is updated");
    assert.equal(this.getVisibleRows()[2].values[1], 30, "row values are updated");

    assert.equal(this.array[2].id, 4, "data is removed");
    assert.equal(this.getVisibleRows()[3].data.id, 4, "row data is removed");

    assert.equal(this.array[this.array.length - 1].name, "Mike", "data is inserted to end");
    assert.equal(this.getVisibleRows()[0].data.name, "Mike", "row is inserted to begin and not reshaped");
});

QUnit.test("Editing with refresh mode repaint if store returns data", function(assert) {
    // arrange
    this.options.editing.refreshMode = "repaint";
    var array = this.array;
    this.options.dataSource = {
        key: "id",
        load: function() {
            return array;
        },
        insert: function(values) {
            return $.extend({ id: 999 }, values, { fromServer: true });
        },
        update: function(key, values) {
            var data = array.filter(function(data) { return data.id === key; })[0];
            return $.extend({}, data, values, { fromServer: true });
        },
        remove: function() {
        }
    };

    this.setupModules();

    // act
    this.addRow();
    this.cellValue(0, "name", "Mike");
    this.cellValue(2, "age", 30);
    this.deleteRow(3);
    this.saveEditData();

    // assert
    assert.equal(this.loadingArgs.length, 0, "loading is not occured after editing");
    assert.equal(this.changedArgs.length, 0, "changed is not occured after editing");

    assert.deepEqual(this.getVisibleRows()[2].data, { id: 2, name: "Dan", age: 30, fromServer: true }, "row data is updated");
    assert.equal(this.getVisibleRows()[2].values[1], 30, "row values are updated");

    assert.equal(this.getVisibleRows()[3].data.id, 4, "row data is removed");

    assert.deepEqual(this.getVisibleRows()[0].data, { id: 999, name: "Mike", fromServer: true }, "row is inserted to begin and not reshaped");
    assert.deepEqual(this.getVisibleRows()[0].key, 999, "row key for inserted item");
});

QUnit.test("Load after editing with refresh mode repaint and remoteOperations", function(assert) {
    // arrange
    this.options.editing.refreshMode = "repaint";
    this.options.remoteOperations = { sorting: true, filtering: true };
    this.options.columns.push({ dataField: "id", sortOrder: "asc" });
    this.setupModules();

    this.addRow();
    this.cellValue(0, "name", "Mike");
    this.cellValue(2, "age", 30);
    this.deleteRow(3);
    this.saveEditData();

    // act
    this.getDataSource().load();

    // assert
    assert.equal(this.loadingArgs.length, 1, "loading is occured after editing and load");
    assert.equal(this.changedArgs.length, 1, "changed is occured after editing and load");
});

QUnit.test("Editing with refresh mode repaint with repaintChangesOnly", function(assert) {
    // arrange
    this.options.editing.refreshMode = "repaint";
    this.options.repaintChangesOnly = true;
    this.setupModules();

    this.addRow();
    this.cellValue(0, "name", "Mike");
    this.cellValue(2, "age", 30);
    this.deleteRow(3);

    this.dataControllerChangedArgs = [];
    // act
    this.saveEditData();

    // assert
    assert.equal(this.loadingArgs.length, 0, "loading is not occured after editing");
    assert.equal(this.changedArgs.length, 0, "changed is not occured after editing");
    assert.equal(this.dataControllerChangedArgs.length, 1, "dataController changed is occured after editing");
    assert.deepEqual(this.dataControllerChangedArgs[0].changeType, "update", "dataController changed changeType");
    assert.deepEqual(this.dataControllerChangedArgs[0].changeTypes, ["remove", "insert", "update", "remove"], "dataController changed changeTypes");
    assert.deepEqual(this.dataControllerChangedArgs[0].columnIndices, [undefined, undefined, [1], undefined], "dataController changed columnIndices");
    assert.deepEqual(this.dataControllerChangedArgs[0].rowIndices, [0, 0, 2, 3], "dataController changed rowIndices");
});

QUnit.test("Editing with refresh mode repaint and with grouping", function(assert) {
    // arrange
    this.options.editing.refreshMode = "repaint";
    this.options.dataSource.group = "name";

    this.setupModules();

    this.expandRow(["Alex"]);

    assert.deepEqual(this.getVisibleRows().map(function(row) {
        return row.rowType;
    }), ["group", "data", "data", "group", "group", "group"], "row types");

    this.addRow();
    this.cellValue(0, "name", "Mike");
    this.cellValue(2, "age", 30);
    this.deleteRow(3);
    this.loadingArgs = [];
    this.changedArgs = [];

    // act
    this.saveEditData();

    // assert
    assert.deepEqual(this.getVisibleRows().map(function(row) {
        return row.rowType;
    }), ["data", "group", "data", "group", "group", "group"], "row types");

    assert.equal(this.loadingArgs.length, 0, "loading is not occured after editing");
    assert.equal(this.changedArgs.length, 0, "changed is not occured after editing");

    assert.equal(this.array[0].age, 30, "data is updated");
    assert.equal(this.getVisibleRows()[2].data.age, 30, "row data is updated");
    assert.equal(this.getVisibleRows()[2].values[1], 30, "row values are updated");

    assert.equal(this.array.length, 5, "data is removed");
    assert.equal(this.getVisibleRows()[3].data.key, "Dan", "row data is removed");

    assert.equal(this.array[this.array.length - 1].name, "Mike", "data is inserted to end");
    assert.equal(this.getVisibleRows()[0].data.name, "Mike", "row is inserted to begin and not reshaped");
});

// T689906
QUnit.test("The cell should be editable when there is a fixed column and repaintChangesOnly is true", function(assert) {
    // arrange
    var $cellElement;

    this.options.editing = {
        mode: "cell",
        allowUpdating: true,
        allowDeleting: true
    };
    this.options.columnFixing = { enabled: true };
    this.options.columns = [{ dataField: "id", allowEditing: false }, "name", "age"];
    this.options.repaintChangesOnly = true;
    this.setupModules();

    // act
    this.editCell(0, 1);

    // assert
    $cellElement = $(this.rowsView.getCellElement(0, 1));
    assert.ok($cellElement.hasClass("dx-editor-cell"), "has editor cell");
    assert.strictEqual($cellElement.find(".dx-textbox").length, 1, "has textbox");

    // act
    this.editCell(0, 2);

    // assert
    $cellElement = $(this.rowsView.getCellElement(0, 2));
    assert.ok($cellElement.hasClass("dx-editor-cell"), "has editor cell");
    assert.strictEqual($cellElement.find(".dx-numberbox").length, 1, "has numberbox");
});

QUnit.test("The cell should be editable after selecting the row when repaintChangesOnly is true", function(assert) {
    // arrange
    var $cellElement,
        cells;

    this.options.editing = {
        mode: "cell",
        allowUpdating: true,
        allowDeleting: true
    };
    this.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };
    this.options.repaintChangesOnly = true;
    this.setupModules();

    // act
    this.selectRows(this.array[0]);

    // assert
    cells = this.getVisibleRows()[0].cells;
    assert.strictEqual(cells.length, 4, "count cell of row");

    // act
    this.editCell(0, 1);

    // assert
    $cellElement = $(this.rowsView.getCellElement(0, 1));
    assert.ok($cellElement.hasClass("dx-editor-cell"), "has editor cell");
    assert.strictEqual($cellElement.find(".dx-textbox").length, 1, "has textbox");
});

// T690041
QUnit.test("Changing edit icon in the 'buttons' command column if repaintChangesOnly is true", function(assert) {
    // arrange
    var $linkElements;

    this.options.editing = {
        mode: "cell",
        allowUpdating: true,
        allowDeleting: true
    };
    this.options.columns = [
        {
            type: "buttons",
            buttons: [
                { name: "edit", icon: "active-icon", visible: e => e.row.data.state === "active" },
                { name: "delete", icon: "remove", visible: e => e.row.data.state !== "active" }
            ]
        },
        "state"
    ];

    this.options.dataSource = [{ state: "disabled" }];

    this.options.repaintChangesOnly = true;

    // act
    this.setupModules();
    this.cellValue(0, "state", "active");
    $linkElements = $(this.getCellElement(0, 0)).find(".dx-link");
    assert.equal($linkElements.length, 1);
    assert.ok($linkElements.eq(0).hasClass("dx-icon-active-icon"), "the edit link");

    this.cellValue(0, "state", "disabled");
    $linkElements = $(this.getCellElement(0, 0)).find(".dx-link");
    assert.equal($linkElements.length, 1);
    assert.ok($linkElements.eq(0).hasClass("dx-icon-remove"));
});

// T700691
QUnit.test("Custom button click should be prevented", function(assert) {
    // arrange
    var $linkElement,
        event = $.Event("click");

    this.options.columns = [
        {
            type: "buttons",
            buttons: [
                {
                    text: "Test",
                    onClick: function() {}
                }
            ]
        },
        "state"
    ];
    this.setupModules();
    $linkElement = $(this.getCellElement(0, 0)).find(".dx-link").first();

    // act
    $linkElement.trigger(event);

    // assert
    assert.ok(event.isDefaultPrevented(), "default is prevented");
});


QUnit.module('Editing with validation', {
    beforeEach: function() {
        this.$element = () => $("#container");
        this.gridContainer = $("#container > .dx-datagrid");

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

        this.$element = function() {
            return renderer(".dx-datagrid");
        };

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'columnFixing', 'rows', 'editing', 'masterDetail', 'gridView', 'grouping', 'editorFactory', 'errorHandling', 'validating', 'filterRow', 'adaptivity'], {
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
    // arrange
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

    // act
    that.saveEditData();
    that.clock.tick();

    var $checkbox = $(rowsView.element().find('tbody > tr').first().find("td .dx-checkbox").first());

    // assert
    assert.strictEqual($checkbox.dxCheckBox("instance").option("value"), undefined, "checkbox value is undefined");
    assert.ok($checkbox.hasClass("dx-checkbox-indeterminate"), "checkbox has intermediate class");
});

QUnit.test("Edit cell when edit mode batch and set validate in column", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 1);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    that.editCell(0, 1);

    inputElement = getInputElements(testElement).first();
    inputElement.val(99);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

QUnit.test("Save edit data when edit mode batch and set validate in column", function(assert) {
    // arrange
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

    // act
    that.editCell(1, 1);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    var saveEditDataResult = that.saveEditData();

    cells = rowsView.element().find("td");

    // assert
    assert.equal(saveEditDataResult.state(), "resolved");
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(cells.eq(4).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(4).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    that.editCell(1, 1);

    inputElement = getInputElements(testElement).first();
    inputElement.val(99);
    inputElement.trigger('change');

    saveEditDataResult = that.saveEditData();

    cells = rowsView.element().find("td");

    // assert
    assert.equal(saveEditDataResult.state(), "resolved");
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(!cells.eq(4).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(4).children().first().hasClass("dx-highlight-outline"), "not has highlight");
});

// T620368
QUnit.test("Save hidden column edit data when edit mode batch and column validation", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        errorRows,
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        scrolling: {
            mode: "standard"
        },
        editing: {
            mode: "batch"
        },
        columns: [
            {
                dataField: 'name',
                validationRules: [{ type: "required" }] },
            {
                dataField: 'age',
                validationRules: [{ type: "range", min: 1, max: 100 }]
            },
            "lastName"
        ]
    });

    // act
    that.editCell(0, 0);
    inputElement = getInputElements(testElement).first();
    inputElement.val("");
    inputElement.trigger('change');

    that.editCell(0, 1);
    inputElement = getInputElements(testElement).first();
    inputElement.val("");
    inputElement.trigger('change');

    that.editCell(1, 1);
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    rowsView.component.columnOption("name", "visible", false);
    rowsView.component.columnOption("age", "visible", false);

    that.saveEditData();

    errorRows = rowsView.element().find(".dx-error-row");

    // assert, act
    assert.equal(errorRows.length, 2, "2 error rows");

    var $firstErrorRow = rowsView.element().find("tr:nth-child(2)"),
        $secondErrorRow = rowsView.element().find("tr:nth-child(4)"),
        firstErrorRowMessage = $firstErrorRow.find(".dx-error-message").text(),
        secondErrorRowMessage = $secondErrorRow.find(".dx-error-message").text();

    assert.ok($firstErrorRow.hasClass("dx-error-row"), "1st error row is for the 1st data row");
    assert.ok($secondErrorRow.hasClass("dx-error-row"), "2nd error row is for the 2nd data row");

    // act
    that.saveEditData();
    errorRows = rowsView.element().find(".dx-error-row");

    // assert
    assert.equal(errorRows.length, 2, "2 error rows");
    assert.equal(rowsView.element().find("tr:nth-child(2).dx-error-row .dx-error-message").text(), firstErrorRowMessage, "after save 1st error row text are equals to the previous one");
    assert.equal(rowsView.element().find("tr:nth-child(4).dx-error-row .dx-error-message").text(), secondErrorRowMessage, "after save 1st error row text are equals to the previous one");
});

QUnit.test("Save edit data for inserted row when set validate in column and edit mode batch", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(cells.eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(2).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    that.editCell(0, 2);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    testElement.find('input').first().val("Test");
    testElement.find('input').first().trigger('change');

    that.closeEditCell();
    that.clock.tick();
    that.saveEditData();

    cells = rowsView.element().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 0, "not has input");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
    assert.strictEqual(cells.eq(11).text(), "Test", "text cell 12");
    assert.ok(!cells.eq(11).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(11).children().first().hasClass("dx-highlight-outline"), "not has highlight");
});

// T420231
QUnit.test("Invalid date cell must be highlighted in batch editing mode for inserted row", function(assert) {
    // arrange
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

    // act
    that.addRow();
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(cells.eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(2).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

// T186431
QUnit.test("Save edit data for inserted row without validation in columns and edit mode batch", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        }
    });

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();

    // assert
    assert.equal(testElement.find(".dx-row-inserted").length, 1, "have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    that.saveEditData();

    // assert
    assert.ok(!testElement.find(".dx-row-inserted").length, "not have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

// T183300
QUnit.test("Edit the inserted row for the first time when set validate in columns, edit mode batch", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();

    // assert
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    that.editCell(0, 2);
    cells = rowsView.element().find("td");
    that.editorFactoryController.focus(cells.eq(2));

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.ok(!cells.eq(2).hasClass("dx-datagrid-invalid"), "not has validation");
});

QUnit.test("Insert row with set validate in columns, edit mode batch and hidden column", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();
    that.editorFactoryController.focus(cells.eq(1));
    that.editCell(0, 1);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    testElement.find('input').first().val(99);
    testElement.find('input').first().trigger('change');

    that.closeEditCell();
    that.clock.tick();

    // assert
    assert.equal(getInputElements(testElement).length, 0, "not has input");
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(1).children().first().hasClass("dx-highlight-outline"), "not has highlight");

    // act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(cells.parent().hasClass("dx-row-inserted"), "not save the edit data");
    assert.equal(testElement.find('tbody > tr:nth-child(2).dx-error-row').length, 1, "error row count");
    assert.equal(testElement.find('tbody > tr:not(.dx-error-row)').length, 5, "count rows");
});

QUnit.test("Button inside the selectBox is not clicked", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 0);
    that.clock.tick();
    selectBoxButton = $(rowsView.getCellElement(0, 0)).find(".dx-selectbox .dx-dropdowneditor-button").dxButton("instance");
    $(selectBoxButton.$element()).trigger("dxclick");

    // assert
    assert.ok($(".dx-dropdowneditor-overlay").length > 0);
});

// T174596
QUnit.test("Validation after inserting several rows and saving in batch edit mode", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();
    that.addRow();

    // assert
    assert.equal(testElement.find('tbody > tr').length, 6, "count rows");

    // act
    that.saveEditData();

    // assert
    check();

    // act
    that.editCell(0, 1);

    // assert
    check();
});

// T181732
QUnit.test("Validation during editing inserted row when edit mode batch", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // act
    that.editCell(0, 1);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(99);
    inputElement.trigger('change');

    // act
    that.dataController.changed.empty(); // changed empty called for disable rendering rowsView

    that.editCell(0, 0);

    // assert
    cells = rowsView.element().find('tbody > tr').first().find("td");
    assert.ok(!cells.eq(0).hasClass("dx-datagrid-invalid"), "not have validate");
    assert.ok(!cells.eq(0).children().first().hasClass("dx-highlight-outline"), "not has highlight");

    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validate");
    assert.ok(cells.eq(1).hasClass("dx-cell-modified"), "modified cell");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    assert.ok(!cells.eq(2).hasClass("dx-datagrid-invalid"), "not have validate");
    assert.ok(!cells.eq(2).children().first().hasClass("dx-highlight-outline"), "not has highlight");
});

// T183295
QUnit.test("Focused cell with validation when edit mode batch", function(assert) {
    // arrange
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
        // assert
        assert.ok(testElement.find("td").eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
        assert.ok(testElement.find("td").eq(1).children().hasClass("dx-highlight-outline"), "has highlight");
        // assert.ok(testElement.find("td").eq(1).children().hasClass("dx-focused"), "has class dx-focused");

        that.editorFactoryController.focused.remove(callBackFunc);
    };
    that.editorFactoryController.focused.add(callBackFunc);

    // act
    that.editCell(0, 1); // edit cell

    testElement.find("input").val(101); // change value
    testElement.find("input").trigger("change");

    that.closeEditCell(); // close edit cell
    that.clock.tick();

    that.editCell(0, 1); // edit cell
    that.editorFactoryController.focus(testElement.find("td").eq(1).children()); // focus cell
    that.clock.tick();
});

// T629168
QUnit.test("Cell's height is increasing on resize if validation applied and batch edit mode", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    that.columnHeadersView.element = function() {
        return testElement;
    };

    rowsView.render(testElement);

    that.applyOptions({
        dataSource: [{ Test: "a" }],
        showColumnHeaders: false,
        editing: {
            mode: "batch",
            allowUpdating: true
        },
        columns: [{
            dataField: "Test",
            allowEditing: true,
            validationRules: [{ type: "required" }]
        }]
    });

    // act
    that.editCell(0, 0);
    testElement.find("input").val("").trigger("change");
    that.closeEditCell();
    that.clock.tick();

    that.editorFactoryController.focus(this.rowsView.element().find("td").eq(0));
    that.clock.tick();

    that.resize();
    that.clock.tick();

    // assert
    assert.equal(testElement.find(".dx-invalid-message.dx-widget").length, 1, "validation tooltip count = 1");
});

QUnit.test("Edit row when set validate in column", function(assert) {
    // arrange
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

    // act
    that.editRow(0);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 3, "has input");
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    inputElement = getInputElements(testElement).eq(1);
    inputElement.val(101);
    inputElement.trigger('change');

    var saveEditDataResult = that.saveEditData();

    // assert
    cells = rowsView.element().find('tbody > tr').first().find("td");
    assert.equal(getInputElements(testElement).length, 3, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");
    assert.equal(saveEditDataResult.state(), "resolved");

    // act
    inputElement = getInputElements(testElement).eq(1);
    inputElement.val(99);
    inputElement.trigger('change');

    saveEditDataResult = that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 0, "not has input");
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(1).children().first().hasClass("dx-highlight-outline"), "not has highlight");
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");
    assert.equal(saveEditDataResult.state(), "resolved");
});

QUnit.test("Insert row when set validate in column and edit mode row", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();

    // assert
    assert.equal(getInputElements(testElement).length, 3, "has input");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(cells.eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(2).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    inputElement = getInputElements(testElement).eq(2);
    inputElement.val("Test");
    inputElement.trigger('change');

    that.saveEditData();

    cells = rowsView.element().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 0, "not has input");
    assert.strictEqual(cells.eq(14).text(), "Test", "text cell 12");
    assert.ok(!cells.eq(14).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(!cells.eq(14).children().first().hasClass("dx-highlight-outline"), "not has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

QUnit.test("Insert row with set validate in columns, edit mode row and hidden column", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 2, "has input");
    assert.ok(cells.parent().hasClass("dx-row-inserted"), "has row inserted");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    testElement.find('input').eq(1).val(99);
    testElement.find('input').eq(1).trigger('change');

    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 2, "has input");
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "success validation");
    assert.ok(cells.parent().hasClass("dx-row-inserted"), "not save the edit data");
    assert.equal(testElement.find('tbody > tr:not(.dx-error-row)').length, 5, "count rows");
});

QUnit.test("Show tooltip on focus with set validate in column and edit mode batch", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        $testElement = renderer('#container'),
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

    $cells = $(rowsView.element().find('tbody > tr').first().find("td"));

    // act
    that.editCell(0, 1);

    // assert
    assert.equal(getInputElements($testElement).length, 1, "has input");

    // act
    $inputElement = getInputElements($testElement).first();
    $inputElement.val(101);
    $($inputElement).trigger('change');

    that.closeEditCell();
    that.clock.tick();

    $cells = $(rowsView.element().find('tbody > tr').first().find("td"));

    // assert
    assert.ok(!getInputElements($testElement).length, "not has input");
    assert.ok($cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok($cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    $($cells.eq(1)).trigger("dxclick");
    that.clock.tick();

    $cells = $(rowsView.element().find('tbody > tr').first().find("td"));

    // assert
    $overlayElement = $cells.eq(1).find(".dx-overlay");
    assert.equal(getInputElements($testElement).length, 1, "has input");
    assert.equal($overlayElement.length, 1, "has overlay element");
    assert.ok($overlayElement.hasClass("dx-datagrid-invalid-message"), "overlay has class 'dx-datagrid-invalid-message'"); // T587150

    // T335660
    overlayInstance = $overlayElement.dxOverlay("instance");
    assert.ok(overlayInstance, "has overlay instance");
    assert.ok(overlayInstance.option("target").hasClass("dx-highlight-outline"), "target of the overlay");

    // act
    $inputElement = getInputElements($testElement).first();
    $inputElement.val(99);
    $($inputElement).trigger('change');

    that.closeEditCell();
    that.clock.tick();

    $cells = $(rowsView.element().find('tbody > tr').first().find("td"));

    // assert
    assert.ok(!getInputElements($testElement).length, "not has input");

    // act
    $($cells.eq(1)).trigger("dxclick");
    that.clock.tick();

    // assert
    assert.equal(getInputElements($testElement).length, 1, "has input");
    assert.ok(!$cells.eq(1).find(".dx-tooltip").length, "not has tooltip");
});

// T183197
QUnit.test("Show tooltip on focus for last row with set validate in column and edit mode batch", function(assert) {
    // arrange
    var that = this,
        $overlayContent,
        $highlightContainer,
        rowsView = that.rowsView,
        testElement = renderer('#container'),
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

    var $rowsView = $(rowsView.element());

    cells = $rowsView.find(".dx-data-row").last().find("td");

    // assert
    assert.ok(!$rowsView.find(".dx-freespace-row").is(":visible"), "visible freespace row");

    // act
    cells.eq(1).trigger("dxclick");
    that.clock.tick();

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    eventsEngine.trigger(inputElement[0], "change");

    that.closeEditCell();
    that.clock.tick();

    cells = $(rowsView.element()).find(".dx-data-row").last().find("td");

    // assert
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    cells.eq(1).trigger("dxclick");
    that.clock.tick();

    cells = $(rowsView.element()).find(".dx-data-row").last().find("td");

    // assert
    $overlayContent = cells.eq(1).find(".dx-overlay-content");
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.equal($overlayContent.length, 1, "has tooltip");
    assert.ok(rowsView.element().find(".dx-freespace-row").is(":visible"), "visible freespace row");
    assert.ok(rowsView.element().find(".dx-freespace-row").height() > 0, "freespace row has height ");

    // T526383
    $highlightContainer = cells.eq(1).find(".dx-highlight-outline").first();
    assert.ok($overlayContent.offset().top >= ($highlightContainer.offset().top + $highlightContainer.height()), "tooltip is under the cell");
});

// T200857
QUnit.test("Show tooltip on focus when one row with set validate in column and edit mode batch", function(assert) {
    // arrange
    var that = this,
        rowsView = that.rowsView,
        testElement = renderer('#container'),
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

    cells = $(rowsView.element()).find(".dx-data-row").last().find("td");

    // assert
    assert.ok(!$(rowsView.element()).find(".dx-freespace-row").is(":visible"), "visible freespace row");

    // act
    cells.eq(1).trigger("dxclick");
    that.clock.tick();

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    eventsEngine.trigger(inputElement[0], "change");

    that.closeEditCell();
    that.clock.tick();

    cells = $(rowsView.element()).find(".dx-data-row").last().find("td");

    // assert
    assert.ok(!getInputElements(testElement).length, "not has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    cells.eq(1).trigger("dxclick");
    that.clock.tick();

    cells = $(rowsView.element()).find(".dx-data-row").last().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.equal(cells.eq(1).find(".dx-overlay").length, 1, "has tooltip");
    assert.ok(!$(rowsView.element()).find(".dx-freespace-row").is(":visible"), "visible freespace row");
});

// T470216
QUnit.testInActiveWindow("Tooltip should be positioned by left side when the drop-down editor is shown", function(assert) {
    // arrange
    var that = this,
        tooltipInstance,
        selectBoxInstance,
        rowsView = that.rowsView,
        $testElement = renderer("#container");

    rowsView.render(that.gridContainer);
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

    // assert
    tooltipInstance = $testElement.find("tbody td").eq(2).find(".dx-overlay.dx-invalid-message").dxOverlay("instance");
    assert.ok($testElement.find("tbody td").eq(2).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(tooltipInstance.option("visible"), "tooltip is visible");
    assert.strictEqual(tooltipInstance.option("position").my, "top left", "position.my of the tooltip");
    assert.strictEqual(tooltipInstance.option("position").at, "bottom left", "position.at of the tooltip");

    // act
    eventsEngine.trigger(getInputElements($testElement.find("tbody td").eq(2))[0], "dxclick");
    that.clock.tick();

    // assert
    selectBoxInstance = $testElement.find("tbody td").eq(2).find(".dx-selectbox").dxSelectBox("instance");
    tooltipInstance = $testElement.find("tbody td").eq(2).find(".dx-overlay.dx-invalid-message").dxOverlay("instance");
    assert.ok(tooltipInstance.option("visible"), "tooltip is visible");
    assert.ok(selectBoxInstance.option("opened"), "drop-down editor is shown");
    assert.strictEqual(tooltipInstance.option("position").my, "top right", "position.my of the tooltip");
    assert.strictEqual(tooltipInstance.option("position").at, "top left", "position.at of the tooltip");

    // act
    eventsEngine.trigger($testElement.find("tbody td").eq(2).find(".dx-dropdowneditor-button")[0], "dxclick");
    that.clock.tick();

    // assert
    // T724201
    assert.notOk(selectBoxInstance.option("opened"), "drop-down editor is not opened");
    tooltipInstance = $testElement.find("tbody td").eq(2).find(".dx-overlay.dx-invalid-message").dxOverlay("instance");
    assert.strictEqual(tooltipInstance.option("position").my, "top left", "position.my of the tooltip is restored");
    assert.strictEqual(tooltipInstance.option("position").at, "bottom left", "position.at of the tooltip is restored");
});

// T741739
QUnit.testInActiveWindow("Tooltip should be positioned by left side if column dataType and alignment are not defined", function(assert) {
    // arrange
    var that = this,
        tooltipInstance,
        rowsView = that.rowsView,
        $testElement = renderer("#container");

    rowsView.render($testElement);
    that.applyOptions({
        editing: {
            mode: "batch",
            allowUpdating: true
        },
        columns: [
            {
                dataField: "test",
                validationRules: [{ type: "required" }]
            },
            "lastName",
            "age"
        ]
    });
    that.editorFactoryController._getFocusedElement = function() {
        return $testElement.find("input");
    };

    that.cellValue(0, 0, "");
    that.editCell(0, 0);
    that.clock.tick();

    // assert
    tooltipInstance = $testElement.find("tbody td").eq(0).find(".dx-overlay.dx-invalid-message").dxOverlay("instance");
    assert.ok($testElement.find("tbody td").eq(0).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(tooltipInstance.option("visible"), "tooltip is visible");
    assert.strictEqual(tooltipInstance.option("position").my, "top left", "position.my of the tooltip");
    assert.strictEqual(tooltipInstance.option("position").at, "bottom left", "position.at of the tooltip");
});

// T523770
QUnit.test("Invalid message and revert button should not be overlapped when the drop-down editor is shown for first column", function(assert) {
    // arrange
    var that = this,
        invalidTooltipInstance,
        revertTooltipInstance,
        selectBoxInstance,
        rowsView = that.rowsView,
        $testElement = renderer("#container");

    rowsView.render($testElement);
    that.applyOptions({
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        columns: [
            {
                dataField: "name",
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: that.array,
                    displayExpr: "name",
                    valueExpr: "name"
                }
            },
            "age",
            "lastName",
        ]
    });
    that.editorFactoryController._getFocusedElement = function() {
        return $testElement.find("input");
    };

    that.cellValue(0, 0, "");
    that.editCell(0, 0);
    that.clock.tick();

    // act
    eventsEngine.trigger(getInputElements($testElement.find("tbody td").eq(0))[0], "dxclick");
    that.clock.tick();

    // assert
    selectBoxInstance = $testElement.find("tbody td").eq(0).find(".dx-selectbox").dxSelectBox("instance");
    invalidTooltipInstance = $testElement.find("tbody td").eq(0).find(".dx-overlay.dx-invalid-message").dxOverlay("instance");
    revertTooltipInstance = $testElement.find("tbody td").eq(0).find(".dx-overlay.dx-datagrid-revert-tooltip").dxTooltip("instance");

    assert.ok(selectBoxInstance.option("opened"), "drop-down editor is shown");
    assert.ok(invalidTooltipInstance.option("visible"), "invalid message tooltip is visible");
    assert.ok(revertTooltipInstance.option("visible"), "revert tooltip is visible");
    assert.ok(selectBoxInstance.$element().offset().left + selectBoxInstance.$element().width() < revertTooltipInstance.$content().offset().left, "revert tooltip is shown after selectbox");
    assert.ok(revertTooltipInstance.$content().offset().left + revertTooltipInstance.$content().width() < invalidTooltipInstance.$content().offset().left, "invalid tooltip is shown after revert tooltip");
});

// T523770
QUnit.test("Invalid message and revert button should not be overlapped when the drop-down editor is shown for last column", function(assert) {
    // arrange
    var that = this,
        invalidTooltipInstance,
        revertTooltipInstance,
        selectBoxInstance,
        rowsView = that.rowsView,
        $testElement = renderer("#container");

    $("#qunit-fixture").addClass("qunit-fixture-static").css("width", "auto");

    rowsView.render($testElement);
    that.applyOptions({
        editing: {
            mode: "cell",
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

    // act
    eventsEngine.trigger(getInputElements($testElement.find("tbody td").eq(2))[0], "dxclick");
    that.clock.tick();

    // assert
    selectBoxInstance = $testElement.find("tbody td").eq(2).find(".dx-selectbox").dxSelectBox("instance");
    invalidTooltipInstance = $testElement.find("tbody td").eq(2).find(".dx-overlay.dx-invalid-message").dxOverlay("instance");
    revertTooltipInstance = $testElement.find("tbody td").eq(2).find(".dx-overlay.dx-datagrid-revert-tooltip").dxTooltip("instance");

    assert.ok(selectBoxInstance.option("opened"), "drop-down editor is shown");
    assert.ok(invalidTooltipInstance.option("visible"), "invalid message tooltip is visible");
    assert.ok(revertTooltipInstance.option("visible"), "revert tooltip is visible");
    assert.ok(invalidTooltipInstance.$content().offset().left + invalidTooltipInstance.$content().width() < revertTooltipInstance.$content().offset().left, "revert tooltip is shown after invalid tooltip");
    assert.roughEqual(revertTooltipInstance.$content().offset().left + revertTooltipInstance.$content().width(), selectBoxInstance.$element().offset().left, 1, "selectbox is shown after revert tooltip");

    $("#qunit-fixture").removeClass("qunit-fixture-static").css("width", "");
});

QUnit.test("Show error rows on save inserted rows when set validate in column and edit mode batch", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();
    that.addRow();
    that.addRow();

    // assert
    assert.equal(testElement.find('tbody > tr').length, 7, "count rows");

    // act
    that.saveEditData();

    cells = rowsView.element().find("td");

    // assert
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

QUnit.test("Show error row on save inserted row when promise is used in rowValidating", function(assert) {
    // arrange
    let rowsView = this.rowsView,
        testElement = $('#container'),
        errorText = "Test",
        $errorRow;

    rowsView.render(testElement);

    this.applyOptions({
        editing: {
            mode: "row"
        },
        columns: ['name'],
        onRowValidating: function(options) {
            const deferred = new Deferred();
            options.promise = deferred.promise();
            setTimeout(function() {
                options.errorText = errorText;
                options.isValid = false;
                deferred.resolve();
            }, 10);
        }
    });

    // act
    this.addRow();

    // assert
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    this.saveEditData();
    $errorRow = rowsView.element().find("tr.dx-error-row");

    // assert
    assert.equal($errorRow.length, 0, "error row is not displayed before resolving the promise");

    this.clock.tick(10);
    $errorRow = rowsView.element().find("tr.dx-error-row");

    assert.equal($errorRow.length, 1, "error row is displayed");
    assert.equal($errorRow.find(".dx-error-message").text(), errorText, "errorText is correct");
});

// T241920
QUnit.testInActiveWindow("Cell editor invalid value don't miss focus on saveEditData", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView;

    rowsView.render(that.gridContainer);

    that.applyOptions({
        editing: {
            mode: "row"
        },
        columns: ["name", "age", {
            dataField: "lastName",
            validationRules: [{ type: "required" }]
        }]
    });

    // act
    this.editRow(0);
    that.clock.tick();
    var $input = $(rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input"));
    $input.get(0).focus();
    that.clock.tick();

    // assert
    $input = $(rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input"));
    assert.ok($input.is(":focus"), "Text editor is focused before call saveEditData");

    // act
    $input.val("");
    $($input).trigger("change");

    $input = $(rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input"));
    $input.get(0).blur();
    $input.get(0).focus();

    that.saveEditData();
    that.clock.tick();

    // assert
    assert.ok($input.is(":focus"), "Text editor is focused after call saveEditData");
    assert.ok(that.gridContainer.find(".dx-invalid-message").is(":visible"));
});

// T284398
QUnit.testInActiveWindow("Show invalid message on focus for an invalid cell of the inserted row", function(assert) {
    // arrange
    var that = this,
        $highlight,
        rowsView = this.rowsView;

    rowsView.render(that.gridContainer);

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

    var $input = $(rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input"));

    $input.focus();
    assert.ok($input.is(":focus"), "Text editor is focused before call saveEditData");
    assert.ok(!$input.closest("td").hasClass("dx-datagrid-invalid"), "passed validation");

    // assert
    that.saveEditData();
    that.clock.tick();

    // act
    $input.focus();
    that.clock.tick();

    // assert
    assert.ok($input.is(":focus"), "Text editor is focused after call saveEditData");
    assert.ok($input.closest("td").hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(that.gridContainer.find(".dx-invalid-message").is(":visible"), "visible invalid message");

    // act
    $input.val("123");
    $($input).trigger("change");
    that.clock.tick();
    $input = $(rowsView.element().find(".dx-data-row").first().find("td").eq(2).find(".dx-texteditor-input"));

    // assert
    $highlight = $input.closest(".dx-highlight-outline");
    assert.ok($highlight.length, "has highlight");
    assert.ok(!$input.closest("td").hasClass("dx-datagrid-invalid"), "not has class dx-datagrid-invalid on cell");
});

QUnit.test('Show error row on save inserted Row after scrolling when set validate in column and edit mode row', function(assert) {
    // arrange
    var done = assert.async(),
        that = this,
        rowsView = this.rowsView;

    rowsView.render(that.gridContainer);
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
        // act
        that.addRow();

        // assert
        assert.strictEqual(rowsView.getTopVisibleItemIndex(), 1, "top visible item index");
        assert.equal(getInputElements(that.gridContainer.find('tbody > tr').eq(1)).length, 3);
        assert.equal(that.gridContainer.find('tbody > tr').length, 5, "count rows");

        // act
        that.saveEditData();

        // assert
        assert.equal(that.gridContainer.find('tbody > tr').length, 6, "count rows");
        assert.ok(that.gridContainer.find('tbody > tr').eq(1).hasClass("dx-row-inserted"), "has inserted row");
        assert.ok(that.gridContainer.find('tbody > tr').eq(2).hasClass("dx-error-row"), "has error row");
        assert.strictEqual(that.gridContainer.find('tbody > tr').eq(2).text(), "Test");
        done();
    });

    rowsView.element().dxScrollable('instance').scrollTo(45);
});

// T417962
QUnit.test('Show error row on saving invalid row when there is grouping', function(assert) {
    // arrange
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

    // assert
    assert.equal($testElement.find('tbody > tr').length, 7, "count rows (3 group rows + 3 data rows + 1 freespace row)");

    // arrange
    that.editRow(1);

    // assert
    $editRow = $testElement.find('tbody > tr').eq(1);
    assert.ok($editRow.hasClass("dx-edit-row"), "edit row");

    // arrange
    $editRow.find("input").last().val("test");
    $($editRow.find("input").last()).trigger("change");

    // act
    that.saveEditData();

    // assert
    assert.equal($testElement.find('tbody > tr').length, 8, "count rows (3 group rows + 3 data rows + 1 error row + 1 freespace row)");
    assert.ok($testElement.find('tbody > tr').eq(0).hasClass("dx-group-row"), "group row (first row)");
    assert.ok($testElement.find('tbody > tr').eq(1).hasClass("dx-data-row"), "data row (second row)");
    assert.ok($testElement.find('tbody > tr').eq(2).hasClass("dx-error-row"), "error row (third row)");
});

QUnit.test('Show error row on saving row when key is set incorrectly', function(assert) {
    // arrange
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

    // act
    that.editRow(0);
    $editRow = $testElement.find('tbody > tr').eq(1);
    $editRow.find('input').first().val("Tom");
    $($editRow.find('input').first()).trigger('change');

    // assert
    assert.ok($testElement.find('.dx-error-row').length, "error row");
});

// T186431
QUnit.test("Save edit data for inserted row without validation in columns and edit mode row", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();

    // assert
    assert.equal(testElement.find(".dx-row-inserted").length, 1, "have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    that.saveEditData();

    // assert
    assert.ok(!testElement.find(".dx-row-inserted").length, "not have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

QUnit.test("Edit cell when edit mode cell and set validate in column", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 1);
    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.editCell(0, 2);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    that.editCell(0, 2);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

QUnit.testInActiveWindow("Show the revert button when an edit cell to invalid value when the edit mode cell is enabled", function(assert) {
    // arrange
    var $cells,
        inputElement;

    this.rowsView.render(this.gridContainer);

    this.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    // act
    this.editCell(0, 1);

    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
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

    // assert
    assert.equal($cellWithRevertButton.index(), 1, "cell index where the revert button is located");
    assert.equal($cellWithRevertButton.parent().index(), 0, "row index where the revert button is located");
    assert.equal($(".dx-datagrid-revert-tooltip").length, 2, "tooltip with revert button");
    assert.equal($(".dx-revert-button").length, 1, "revert button");
    // T494489
    assert.equal($(".dx-revert-button").closest(this.gridContainer).length, 1, "revert button is rendered in DataGrid container");
});

// T297742
QUnit.testInActiveWindow("Show the revert button when an edit cell, server returns error and the edit mode cell is enabled", function(assert) {
    // arrange
    var $cells,
        inputElement;

    this.rowsView.render(this.gridContainer);

    this.applyOptions({
        showColumnHeaders: true,
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

    // act
    this.editCell(0, 1);

    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
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

    // assert
    assert.equal($cellWithRevertButton.index(), 1, "cell index where the revert button is located");
    assert.equal($cellWithRevertButton.parent().index(), 0, "row index where the revert button is located");
    assert.equal($(".dx-datagrid-revert-tooltip").length, 2, "tooltip with revert button");
    assert.equal($(".dx-revert-button").length, 1, "revert button");
});

QUnit.testInActiveWindow("Change hint for revert button", function(assert) {
    // arrange
    this.rowsView.render(this.gridContainer);

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

    // act
    this.editCell(0, 1);

    var $cells = $(this.rowsView.element().find("tbody > tr").first().find("td"));
    var $input = getInputElements($cells).first();
    $input.val(101);
    $($input).trigger("change");
    this.clock.tick();

    // assert
    assert.equal($(".dx-revert-button").attr("title"), "Cancel test bla", "hint for revert button");
});

QUnit.test("Revert is hidden when value is valid", function(assert) {
    // arrange
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

    // act
    this.editCell(0, 1);

    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
    $cells.find('input').first().val(101);
    $($cells.find('input').first()).trigger('change');

    this.editCell(0, 2);
    this.clock.tick();

    this.editCell(0, 1);
    this.clock.tick();

    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
    $cells.find('input').first().val(16);
    $($cells.find('input').first()).trigger('change');

    this.editCell(0, 2);
    this.clock.tick();

    // assert
    $revertButton = $(".dx-revert-button");
    assert.equal($(".dx-datagrid-revert-tooltip").length, 0, "tooltip with revert button is not shown");
    assert.equal($revertButton.length, 0, "revert button is not shown");
});

QUnit.testInActiveWindow("Revert to an old value when the revert button is clicked", function(assert) {
    // arrange
    var $revertButton,
        $cells,
        $input;

    this.rowsView.render(this.gridContainer);

    this.applyOptions({
        editing: {
            mode: "cell"
        },
        columns: ['name', {
            dataField: 'age',
            validationRules: [{ type: "range", min: 1, max: 100 }]
        }, "lastName"]
    });

    // act
    this.editCell(0, 1);

    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
    $input = getInputElements($cells).first();
    $input.val(101);
    $($input).trigger('change');
    this.clock.tick();

    $revertButton = $(".dx-revert-button");

    // assert
    assert.equal($revertButton.length, 1, "revert button is shown");

    // act
    $($revertButton).trigger("dxclick");
    this.clock.tick();

    // assert
    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
    $revertButton = $(".dx-revert-button");
    assert.equal($cells.eq(1).text(), "15", "old value");
    assert.equal($(".dx-datagrid-revert-tooltip").length, 0, "tooltip with revert button is not shown");
    assert.equal($revertButton.length, 0, "revert button is not shown");
});

// T633351
QUnit.testInActiveWindow("Revert to an old value when the revert button and nested dataObject modified", function(assert) {
    // arrange
    var testElement = $('#container'),
        $input;

    this.options.dataSource.store = [ { A: { name: "Alex" }, lastName: "Smith" }];

    this.rowsView.render(testElement);

    this.applyOptions({
        editing: {
            allowUpdating: true,
            mode: "batch"
        },
        columns: [ { dataField: "A.name", dataType: "string" }, "lastName"]
    });

    // act
    this.editCell(0, 0);
    $input = testElement.find("input").first();
    $input.val("Ben");
    $($input).trigger('change');
    this.closeEditCell();

    this.clock.tick();

    // assert
    assert.equal($input[0].value, "Ben", "new value");

    // act, assert
    this.editingController.cancelEditData();

    assert.equal(testElement.find(".dx-data-row td").eq(0).text(), "Alex", "old value");
});

QUnit.test("Revert button is not shown when the height light css class is not applied", function(assert) {
    // arrange
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

    // act
    this.editCell(0, 1);

    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
    this.editorFactoryController._showRevertButton($cells.eq(0));

    // assert
    assert.equal($(".dx-datagrid-revert-tooltip").length, 0);
});

QUnit.testInActiveWindow("Save a valid value for an invalid cell when focus in other invalid cell", function(assert) {
    // arrange
    var $cells,
        $input;

    this.rowsView.render(this.gridContainer);

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

    // act
    this.editCell(0, 1);
    this.clock.tick();

    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
    $input = getInputElements($cells).first();
    $input.val(99);
    $($input).trigger('change');

    this.editCell(1, 1);
    this.clock.tick();

    this.editCell(0, 0);
    this.clock.tick();

    // assert
    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
    assert.equal(getInputElements($cells).val(), "Alex", "text of cell 0 row 0");

    // act
    var showRevertButton = this.editorFactoryController._showRevertButton,
        that = this,
        $cellWithRevertButton;

    this.editorFactoryController._showRevertButton = function($cell, $targetElement) {
        $cellWithRevertButton = $cell;
        $.proxy(showRevertButton, that.editorFactoryController)($cell, $targetElement);
    };
    this.editCell(0, 1);

    getInputElements($cells).first().trigger("dxclick");
    this.clock.tick();

    // assert
    $cells = $(this.rowsView.element().find('tbody > tr').first().find("td"));
    assert.equal($cellWithRevertButton.index(), 0, "cell index where the revert button is located");
    assert.equal($cellWithRevertButton.parent().index(), 0, "row index where the revert button is located");
    assert.equal(getInputElements($cells).val(), "Alex", "text of cell 0 row 0");
    assert.equal($cells.eq(1).text(), "99", "text of cell 1 row 0");
});

QUnit.test("Keep cell editing when onRowUpdating is canceled (cell edit mode)", function(assert) {
    // arrange
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

    // act
    that.editCell(0, 1);
    that.clock.tick();

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');
    that.clock.tick();

    that.editCell(0, 2);
    that.clock.tick();

    // assert
    assert.equal(editingController._editRowIndex, 0, "Correct editRowIndex");
    assert.equal(editingController._editColumnIndex, 1, "Second cell still editing");
});

QUnit.test("Insert row when set validate in column and edit mode cell", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    that.editCell(0, 1);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.editCell(1, 1);

    cells = rowsView.element().find("td");

    // assert
    // equal(getInputElements(testElement).length, 1, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    that.editCell(1, 1);
    that.clock.tick();

    cells = rowsView.element().find("td");

    // assert
    assert.ok(getInputElements(testElement).length, "not has input");
    assert.ok(!cells.find(".dx-datagrid-invalid").length, "not validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

// T497279
QUnit.testInActiveWindow("Insert row using extern button when edit mode cell", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "focus is not actual for mobile devices");
        return;
    }
    // arrange
    var that = this,
        rowsView = this.rowsView;

    var $addRowButton = $("<div>").appendTo("#qunit-fixture").dxButton({
        text: "Add Row",
        onClick: function() {
            that.addRow();
        }
    });

    rowsView.render(that.gridContainer);

    that.applyOptions({
        editing: {
            mode: "cell",
            allowUpdating: false
        }
    });

    // act
    $($addRowButton).trigger("dxclick");
    this.clock.tick();

    // assert
    assert.equal(that.gridContainer.find('.dx-row-inserted').length, 1, "inserted row is rendered");
    assert.ok(that.gridContainer.find('.dx-row-inserted').children().eq(0).hasClass("dx-focused"), 1, "first cell in inserted row is focused");
    assert.ok(getInputElements(that.gridContainer).length, 1, "one editor is rendered");
});

QUnit.test('Edit cell with edit mode batch and change page', function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");

    // act
    that.editCell(0, 1);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 0, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    that.dataController.pageIndex(1);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "not failed validation");
    assert.equal(testElement.find('tbody > tr').length, 2, "count rows");

    // act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

// T709466
QUnit.test('Edit cell with edit mode batch and change page if hidden column has empty validationRules', function(assert) {
    // arrange
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
        }, "lastName", {
            dataField: "hidden",
            visible: false,
            validationRules: []
        }]
    });

    that.dataController.pageSize(2);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");

    // act
    that.editCell(0, 1);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 0, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    that.dataController.pageIndex(1);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "not failed validation");
    assert.equal(testElement.find('tbody > tr').length, 2, "count rows");

    // act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(that.hasEditData(), "data is not saved");
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

// T495625
QUnit.test('Row with invalid values should move to current page after saving if cancel updating in onRowUpdating event', function(assert) {
    // arrange
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

    // act
    that.editCell(0, 1);
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');
    that.dataController.pageIndex(1);

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 1, "row count before save");

    // act
    that.editCell(0, 1);
    inputElement = getInputElements(testElement).first();
    inputElement.val(50);
    inputElement.trigger('change');
    that.closeEditCell();
    that.clock.tick();
    that.saveEditData();

    // assert
    assert.equal(testElement.find('.dx-data-row').length, 2, "row count after save");
    assert.equal(testElement.find('.dx-data-row').eq(0).children().eq(1).text(), "101", "first row age value");
    assert.equal(testElement.find('.dx-data-row').eq(0).find(".dx-datagrid-invalid").length, 1, "first row contains invalid value");
    assert.equal(testElement.find('.dx-data-row').eq(1).children().eq(1).text(), "50", "second row age value");
    assert.equal(testElement.find('.dx-data-row').eq(1).find(".dx-datagrid-invalid").length, 0, "second row does not contain invalid value");
    assert.equal(testElement.find('.dx-data-row').eq(1).find(".dx-cell-modified").length, 1, "second row contains modified value");
});

QUnit.test('Edit cell with edit mode batch and sorting', function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");

    // act
    that.editCell(0, 1);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 0, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    that.columnsController.changeSortOrder(1, "desc");

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "not failed validation");
    assert.ok(!cells.eq(1).children().first().hasClass("dx-highlight-outline"), "not has highlight");
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");

    // act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

QUnit.test('Edit cell with edit mode batch and filtering', function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.editCell(0, 1);

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    inputElement = getInputElements(testElement).first();
    inputElement.val(101);
    inputElement.trigger('change');

    that.closeEditCell();
    that.clock.tick();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(getInputElements(testElement).length, 0, "has input");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");

    // act
    that.columnsController.columnOption(1, "filterValue", 17);

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.ok(!cells.eq(1).hasClass("dx-datagrid-invalid"), "not failed validation");
    assert.ok(!cells.eq(1).children().first().hasClass("dx-highlight-outline"), "not has highlight");
    assert.equal(testElement.find('tbody > tr').length, 2, "count rows");

    // act
    that.saveEditData();

    cells = rowsView.element().find('tbody > tr').first().find("td");

    // assert
    assert.equal(testElement.find('tbody > tr').length, 3, "count rows");
    assert.ok(cells.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
    assert.ok(cells.eq(1).children().first().hasClass("dx-highlight-outline"), "has highlight");
});

// T186431
QUnit.test("Save edit data for inserted row without validation in columns and edit mode cell", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "cell"
        }
    });

    // assert
    assert.equal(testElement.find('tbody > tr').length, 4, "count rows");

    // act
    that.addRow();

    // assert
    assert.equal(testElement.find(".dx-row-inserted").length, 1, "have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");

    // act
    that.saveEditData();

    // assert
    assert.ok(!testElement.find(".dx-row-inserted").length, "not have inserted row");
    assert.equal(testElement.find('tbody > tr').length, 5, "count rows");
});

// T238387
QUnit.test('Call onRowValidating when validation passed for edit mode batch', function(assert) {
    // arrange
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

    // assert
    assert.equal(getInputElements(testElement).length, 1, "has input");

    // act
    testElement.find('input').first().val("Tom");
    testElement.find('input').first().trigger('change');

    // act
    that.saveEditData();

    assert.strictEqual(testElement.find("tbody > tr").first().find("td").first().text(), "Tom", "text an updated cell");
    assert.equal(countCallOnRowValidating, 1, "count call onRowValidating");
});

// T238387
QUnit.test('Call onRowValidating when validation passed for edit mode row', function(assert) {
    // arrange
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

    // assert
    assert.equal(getInputElements(testElement).length, 3, "has input");

    // act
    testElement.find('input').first().val("Tom");
    testElement.find('input').first().trigger('change');

    // act
    that.saveEditData();

    assert.strictEqual(testElement.find("tbody > tr").first().find("td").first().text(), "Tom", "text an updated cell");
    assert.equal(countCallOnRowValidating, 1, "count call onRowValidating");
});

// T330770
QUnit.test('Do not call onRowValidating on row deleting for edit mode row', function(assert) {
    // arrange
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

    // act
    that.deleteRow(0);

    assert.strictEqual(testElement.find("tbody > tr").first().find("td").first().text(), "Dan", "First row is removed");
    assert.equal(countCallOnRowValidating, 0, "onRowValidating in not called");
});

// T393606
QUnit.test("Not create validator for group column with validationRules when edit mode is 'row'", function(assert) {
    // arrange
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

    // act
    that.editRow(1);

    // assert
    $rowElement = $testElement.find(".dx-data-row").first();
    assert.ok($rowElement.hasClass("dx-edit-row"), "has edit row");
    assert.equal($rowElement.children(".dx-validator").length, 1, "count cell with validation");
    assert.ok($rowElement.children().eq(1).hasClass("dx-validator"), "has validation on first cell");
});

// T393606
QUnit.test("Not create validator for group column with validationRules when edit mode is 'form'", function(assert) {
    // arrange
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

    // act
    that.editRow(1);

    // assert
    $rowElement = $testElement.find("tbody > tr").eq(1);
    assert.ok($rowElement.hasClass("dx-datagrid-edit-form"), "has edit form");
    assert.equal($rowElement.find(".dx-validator").length, 2, "count cell with validation");
    assert.ok(!$rowElement.children(".dx-datagrid-group-space").hasClass("dx-validator"), "no validator in group space cell");
});

// T631975
QUnit.test("Required mark should be rendered for column with validationRules when edit mode is 'form'", function(assert) {
    // arrange
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
        columns: [{
            dataField: 'name',
            validationRules: [{ type: "required", message: "Name!" }, { type: "stringLength", max: 20 }]
        }, {
            dataField: "lastName",
            formItem: {
                isRequired: false
            },
            validationRules: [{ type: "required" }]
        }]
    });

    // act
    that.editRow(1);

    // assert
    $rowElement = $testElement.find("tbody > tr").eq(1);
    assert.ok($rowElement.hasClass("dx-datagrid-edit-form"), "has edit form");
    assert.equal($rowElement.find(".dx-validator").length, 2, "validator count");
    assert.equal($rowElement.find(".dx-field-item").eq(0).find(".dx-field-item-required-mark").length, 1, "required mark in first item");
    assert.equal($rowElement.find(".dx-field-item").eq(1).find(".dx-field-item-required-mark").length, 0, "no required mark in second item");
    var firstValidationRules = $rowElement.find(".dx-validator").eq(0).dxValidator("option", "validationRules");
    assert.equal(firstValidationRules.length, 2, "two validation rules for first column"); // T652579, T651049
    assert.equal(firstValidationRules[0].message, "Name!", "first validation rule has correct message"); // T652602
    assert.equal(firstValidationRules[1].type, "stringLength", "second validation rule type for first column"); // T652579, T651049
});

// T472946
QUnit.test("Inserting row - Editor should not be validated when edit mode is 'form'", function(assert) {
    // arrange
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

    // act
    this.addRow();
    this.clock.tick();

    // assert
    $editorElements = $testElement.find('tbody > tr').first().find("td").first().find(".dx-texteditor");
    assert.strictEqual($editorElements.length, 3, "count editor");
    assert.notOk($editorElements.first().hasClass("dx-invalid"), "valid value of the first editor");
});

QUnit.test("It's impossible to save new data when editing form is invalid", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        $formRow,
        inputElement,
        $invalid;

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

    // act
    that.editRow(0);
    $formRow = rowsView.getRow(0);

    inputElement = getInputElements(testElement).first();
    inputElement.val("");
    inputElement.trigger('change');

    that.saveEditData();
    that.clock.tick();

    // assert
    $invalid = $formRow.find(".dx-invalid");
    assert.equal(that.editingController._editRowIndex, 0, "first row is still editing");
    assert.equal($invalid.length, 1, "There is one invalid editor in first row");
    // T819068
    assert.equal($invalid.find(".dx-overlay-content").css("whiteSpace"), "normal", "white-space is normal");
});

QUnit.test("It's impossible to save new data when editing form is invalid (async)", function(assert) {
    // arrange
    this.clock.restore();
    let rowsView = this.rowsView,
        testElement = $('#container'),
        $formRow,
        inputElement,
        done = assert.async();

    rowsView.render(testElement);

    this.applyOptions({
        editing: {
            mode: "form",
            allowUpdating: true,
        },
        columns: [{
            dataField: 'age',
            validationRules: [{
                type: 'async',
                validationCallback: function(params) {
                    const d = new Deferred();
                    setTimeout(function() {
                        d.reject();
                    }, 10);
                    return d.promise();
                }
            }]
        }]
    });

    // act
    this.editRow(0);
    $formRow = rowsView.getRow(0);

    inputElement = getInputElements(testElement).first();
    inputElement.val("");
    inputElement.trigger('change');
    this.saveEditData().done(() => {
        assert.equal(this.editingController._editRowIndex, 0, "first row is still editing");
        assert.equal($formRow.find(".dx-invalid").length, 1, "There is one invalid editor in first row");
        done();
    });

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "first row is still editing");
    assert.equal($formRow.find(".dx-validation-pending").length, 1, "There is one pending editor in first row");
});

QUnit.test("Only valid data is saved (async)", function(assert) {
    // arrange
    this.clock.restore();
    let rowsView = this.rowsView,
        testElement = $('#container'),
        $formRow,
        inputElement,
        done = assert.async();

    rowsView.render(testElement);

    this.applyOptions({
        loadingTimeout: undefined,
        editing: {
            mode: "form",
            allowUpdating: true,
        },
        columns: [{
            dataField: 'age',
            validationRules: [{
                type: 'async',
                validationCallback: function(params) {
                    const d = new Deferred();
                    setTimeout(function() {
                        params.value === 1 ? d.resolve(true) : d.reject();
                    }, 10);
                    return d.promise();
                }
            }]
        }]
    });

    // act
    this.editRow(0);
    $formRow = rowsView.getRow(0);

    inputElement = getInputElements(testElement).first();
    inputElement.val("");
    inputElement.trigger('change');

    this.saveEditData().done(() => {
        assert.equal(this.editingController._editRowIndex, 0, "first row is still editing");
        assert.equal($formRow.find(".dx-invalid").length, 1, "There is one invalid editor in first row");

        inputElement.val("1");
        inputElement.trigger('change');
        this.saveEditData().done(() => {
            assert.equal(this.editingController._editRowIndex, -1, "there is no editing row");
            const $row = rowsView.getRow(0);
            assert.ok($row.hasClass("dx-data-row"), "The form was closed");
            done();
        });
    });

    // assert
    assert.equal(this.editingController._editRowIndex, 0, "first row is still editing");
    assert.equal($formRow.find(".dx-validation-pending").length, 1, "There is one pending editor in first row");
});

// T506863
QUnit.testInActiveWindow("Show the revert button when a row updating is canceled", function(assert) {
    // arrange
    var rowsView = this.rowsView;

    this.applyOptions({
        editing: {
            allowUpdating: true,
            mode: 'cell'
        },
        onRowUpdating: function(params) {
            params.cancel = true;
        }
    });

    this.editingController.optionChanged({
        name: "onRowUpdating",
        value: function(params) {
            params.cancel = true;
        }
    });
    rowsView.render(this.gridContainer);
    var $cell = this.gridContainer.find('td').first();
    $($cell).trigger('dxclick'); // Edit
    this.clock.tick();

    var $input = getInputElements(this.gridContainer).first();
    $input.val(101);
    $($input).trigger('change');

    this.editingController.saveEditData();
    $input.trigger("dxclick");
    this.clock.tick();

    assert.ok(this.gridContainer.find(".dx-revert-button").length, "the revert button is shown");
});

QUnit.test("Show error message on save inserted rows when edit mode is 'popup'", function(assert) {
    // arrange
    var $inputElement,
        $popupContent,
        $errorMessageElement,
        rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    this.applyOptions({
        editing: {
            mode: "popup",
            allowUpdating: true
        },
        columns: ['name', 'age'],
        onRowValidating: function(e) {
            e.isValid = false;
            e.errorText = "Test";
        }
    });

    this.editRow(0);

    $popupContent = $(".dx-datagrid").find(".dx-datagrid-edit-popup").dxPopup("instance").$content().find(".dx-scrollable-content");
    $inputElement = $popupContent.find("input").first();
    $inputElement.val("");
    $($inputElement).trigger("change");

    // act
    this.saveEditData();

    // assert
    $errorMessageElement = $popupContent.children().first();
    assert.ok($errorMessageElement.hasClass("dx-error-message"), "has error message");
    assert.strictEqual($errorMessageElement.text(), "Test", "text of an error message");
});

QUnit.test("Edit cell with custom validation (edit mode is batch)", function(assert) {
    // arrange
    var that = this,
        rowData,
        $cellElements,
        $inputElement,
        rowsView = that.rowsView,
        $testElement = $("#container");

    rowsView.render($testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: ["name", {
            dataField: "age",
            validationRules: [
                {
                    type: "custom",
                    validationCallback: function(e) {
                        rowData = e.data;
                        return e.data.name === "Alex";
                    }
                }
            ]
        }, "lastName"]
    });

    // act
    that.editCell(0, 1);
    $inputElement = getInputElements($testElement).first();
    $inputElement.val(666);
    $($inputElement).trigger("change");

    that.closeEditCell();
    that.clock.tick();

    $cellElements = $(rowsView.element().find("tbody > tr").first().find("td"));

    // assert
    assert.deepEqual(rowData, { age: 666, lastName: "John", name: "Alex" }, "row data");
    assert.notOk($cellElements.eq(1).hasClass("dx-datagrid-invalid"), "success validation");

    // act
    that.editCell(1, 1);
    $inputElement = getInputElements($testElement).first();
    $inputElement.val(777);
    $($inputElement).trigger("change");

    that.closeEditCell();
    that.clock.tick();

    $cellElements = $(rowsView.element().find("tbody > tr").eq(1).find("td"));

    // assert
    assert.deepEqual(rowData, { age: 777, lastName: "Skip", name: "Dan" }, "row data");
    assert.ok($cellElements.eq(1).hasClass("dx-datagrid-invalid"), "failed validation");
});

// T535329
QUnit.test("Cell edit mode - The validation should work correctly when there is column with 'showEditorAlways' enabled", function(assert) {
    // arrange
    var that = this,
        brokenRules,
        $cellElements,
        $checkboxElement,
        rowsView = this.rowsView,
        $testElement = $('#container');

    that.applyOptions({
        dataSource: [{ name: "", test: true }],
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        columns: [{
            dataField: "name",
            validationRules: [{ type: "required" }]
        }, {
            dataField: 'test',
            dataType: "boolean",
            validationRules: [{ type: "required" }]
        }],
        onRowValidating: function(e) {
            brokenRules = e.brokenRules;
        }
    });
    rowsView.render($testElement);

    // assert
    $cellElements = $(rowsView.element().find('tbody > tr').first().children());
    assert.ok($cellElements.eq(0).hasClass("dx-validator"), "has validator");
    assert.ok($cellElements.eq(1).hasClass("dx-validator"), "has validator");

    // act
    $checkboxElement = $cellElements.eq(1).find(".dx-checkbox").first();
    $($checkboxElement).trigger("dxclick");

    // assert
    assert.strictEqual(brokenRules.length, 2, "count of broken rule");
});

// T535329
QUnit.test("Cell edit mode - The validation should not work for column with 'showEditorAlways' enabled when inserting row", function(assert) {
    // arrange
    var that = this,
        $cellElement,
        rowsView = this.rowsView;

    that.applyOptions({
        dataSource: [{ name: "", test: true }],
        editing: {
            mode: "cell",
            allowAdding: true
        },
        columns: [{
            dataField: 'test',
            dataType: "boolean",
            validationRules: [{ type: "required" }]
        }, {
            dataField: "name",
            validationRules: [{ type: "required" }]
        }]
    });
    rowsView.render(that.gridContainer);

    // act
    that.addRow();
    that.clock.tick();

    // assert
    $cellElement = $(rowsView.element().find('tbody > tr.dx-row-inserted').first().children().first());
    assert.notOk($cellElement.hasClass("dx-datagrid-invalid"), "first cell is valid");
});

QUnit.testInActiveWindow("Batch edit mode - Validation message should be shown when column has showEditorAlways", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        inputElement;

    rowsView.render(that.gridContainer);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: [{
            dataField: 'name',
            validationRules: [{
                type: "required"
            }],
            showEditorAlways: true
        }]
    });

    // act

    that.editCell(0, 0);

    inputElement = getInputElements(that.gridContainer).first();
    inputElement
        .val("")
        .trigger('change');

    this.clock.tick();

    // assert
    var cells = rowsView.element().find('tbody > tr').first().find("td");
    assert.ok(cells.eq(0).hasClass("dx-datagrid-invalid"), "validation border should be shown");
});

QUnit.testInActiveWindow("Show validation message for CheckBox editor", function(assert) {
    // arrange
    var rowsView = this.rowsView;

    this.applyOptions({
        editing: {
            mode: "row"
        },
        columns: [{
            dataField: 'isActive',
            validationRules: [{
                type: "required"
            }]
        }, "name"],
        dataSource: {
            asyncLoadEnabled: false,
            store: [
                { isActive: true, name: 'Alex' },
                { isActive: true, name: 'Dan' }
            ],
            paginate: true
        }
    });

    rowsView.render(this.gridContainer);

    // act
    this.editingController.editRow(0);
    this.gridContainer.find(".dx-checkbox").first().trigger("dxclick");
    this.clock.tick();

    // assert
    assert.equal(this.gridContainer.find(".dx-invalid-message.dx-overlay").length, 1, "validation message should be shown");
});

QUnit.testInActiveWindow("Empty validation message is not shown", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container'),
        inputElement;

    rowsView.render(testElement);

    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: [{
            dataField: 'name',
            validationRules: [{
                type: "required",
                message: ""
            }],
            showEditorAlways: true
        }]
    });

    // act

    that.editCell(0, 0);

    inputElement = getInputElements(testElement).first();
    inputElement
        .val("")
        .trigger('change');

    this.clock.tick();

    // assert
    assert.equal($(".dx-invalid-message.dx-invalid-message-always.dx-overlay").length, 0, "Validation message is not shown");
});

// T593542
QUnit.testInActiveWindow("SelectBox should be closed on focus another editor if its value is not valid", function(assert) {
    // arrange
    var that = this,
        $cellElements,
        $selectBoxInput,
        rowsView = this.rowsView;

    fx.off = true;

    try {
        that.applyOptions({
            dataSource: {
                asyncLoadEnabled: false,
                store: [{ name: 1, age: 15 }, { name: 2, age: 16 }, { name: 3, age: 17 }],
                paginate: true
            },
            columns: [{
                dataField: "name",
                lookup: {
                    displayExpr: "name",
                    valueExpr: "id",
                    dataSource: [{ id: 1, name: "Alex" }, { id: 2, name: "Bob" }, { id: 3, name: "Tom" }]
                },
                validationRules: [{ type: "required" }]
            }, "age"]
        });
        rowsView.render(that.gridContainer);

        this.addRow();
        this.clock.tick();

        this.saveEditData();
        this.clock.tick();

        $cellElements = that.gridContainer.find(".dx-row-inserted").children();
        $selectBoxInput = $cellElements.find(".dx-texteditor-input").first();
        $selectBoxInput.trigger("dxclick");
        this.clock.tick();

        // assert
        assert.strictEqual($cellElements.first().find(".dx-overlay.dx-datagrid-invalid-message").length, 1, "has invalid message");
        assert.strictEqual($(".dx-selectbox-popup-wrapper").length, 1, "has selectbox popup");

        // act
        $cellElements.find(".dx-texteditor-input").last().focus();
        $cellElements.find(".dx-texteditor-input").last().trigger("dxpointerdown");
        $cellElements.find(".dx-texteditor-input").last().trigger("dxclick");
        this.clock.tick();

        // assert
        assert.strictEqual($cellElements.first().find(".dx-overlay.dx-datagrid-invalid-message").length, 0, "hasn't invalid message");
        assert.strictEqual($(".dx-selectbox-popup-wrapper").length, 0, "hasn't selectbox popup");
    } finally {
        fx.off = false;
    }
});

// T599181
QUnit.test("Prevent cell validation if template with editor is used", function(assert) {
    this.rowsView.render($("#container"));
    // arrange
    this.options.editing = {};
    this.options.columns = ['name', {
        dataField: 'age',
        cellTemplate: function(cellElement) {
            var inputDiv = $("<div />");
            inputDiv.dxNumberBox({}).dxValidator({ validationRules: [{ type: "required" }] });
            $(cellElement).append(inputDiv);
        }
    }];

    this.columnsController.init();
    this.editingController.init();

    // act
    var cells = this.rowsView.element().find("td");
    this.editorFactoryController.focus(cells.eq(1));
    var validator = this.validatingController.getValidator();

    // assert
    assert.ok(!validator, "only internal editor validator");
});

// T653933
QUnit.test("Validation error message should not hide behind a grouped row when there are fixed columns", function(assert) {
    // arrange
    var that = this,
        rowsView = that.rowsView;

    rowsView.render(that.gridContainer);

    that.applyOptions({
        grouping: {
            autoExpandAll: true
        },
        dataSource: [
            { name: 'Alex', age: "", lastName: "John" },
            { name: 'Dan', age: 16, lastName: "Skip" }
        ],
        scrolling: {
            mode: "standard"
        },
        editing: {
            mode: "batch",
            allowUpdating: true
        },
        columns: [{ dataField: "name", fixed: true, fixedPosition: "right" }, {
            dataField: "age",
            validationRules: [{ type: "required" }]
        }, { dataField: "lastName", groupIndex: 0 }]
    });

    // act
    that.editCell(1, 1);
    that.clock.tick();

    // assert
    assert.strictEqual($(rowsView.getCellElement(1, 1)).find(".dx-overlay.dx-datagrid-invalid-message").length, 1, "has invalid message");
    assert.strictEqual($(rowsView.getRowElement(2)).last().children().eq(1).css("visibility"), "hidden", "group cell isn't visible");

    // act
    that.closeEditCell();
    that.clock.tick();

    // assert
    assert.strictEqual($(rowsView.getCellElement(1, 2)).find(".dx-overlay.dx-datagrid-invalid-message").length, 0, "hasn't invalid message");
    assert.notStrictEqual($(rowsView.getRowElement(2)).last().children().eq(1).css("visibility"), "hidden", "group cell is visible");
});

// T707313
QUnit.test("The validation message should not be overlapped by the fixed column (on left side)", function(assert) {
    // arrange
    var that = this,
        overlayInstance,
        overlayPosition,
        rowsView = that.rowsView;

    that.$element().width(400);

    rowsView.render(that.gridContainer);

    that.applyOptions({
        width: 400,
        dataSource: [
            { name: 'Alex', age: "", lastName: "John" },
            { name: 'Dan', age: 16, lastName: "Skip" }
        ],
        editing: {
            mode: "batch",
            allowUpdating: true
        },
        columns: [{ dataField: "name", fixed: true, width: 300 }, {
            dataField: "age",
            width: 100,
            alignment: "right",
            validationRules: [{ type: "required", message: "test test test test test test test" }]
        }, { dataField: "lastName", width: 100 }]
    });

    // act
    that.editCell(0, 1);
    that.clock.tick();

    // assert
    overlayInstance = $(rowsView.getCellElement(0, 1)).find(".dx-overlay.dx-datagrid-invalid-message").dxOverlay("instance");
    assert.ok(overlayInstance, 1, "has invalid message");
    overlayPosition = overlayInstance.option("position");
    assert.strictEqual(overlayPosition.my, "top left", "position.my");
    assert.strictEqual(overlayPosition.at, "bottom left", "position.at");
    assert.strictEqual(overlayPosition.collision, "none flip", "position.collision");
});

// T707313
QUnit.test("The validation message should not be overlapped by the fixed column (on right side)", function(assert) {
    // arrange
    var that = this,
        overlayInstance,
        tooltipInstance,
        overlayPosition,
        tooltipPosition,
        rowsView = that.rowsView;

    that.$element().width(400);

    rowsView.render(that.gridContainer);

    that.applyOptions({
        width: 400,
        dataSource: [
            { name: 'Alex', age: "", lastName: "John" },
            { name: 'Dan', age: 16, lastName: "Skip" }
        ],
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        columns: [{ dataField: "name", fixed: true, fixedPosition: "right", width: 300 },
            { dataField: "lastName", width: 100 },
            {
                dataField: "age",
                width: 100,
                alignment: "left",
                validationRules: [{ type: "required", message: "test test test test test test test" }]
            }
        ]
    });

    rowsView.scrollTo({ x: 100 });
    that.clock.tick();

    // act
    that.editCell(0, 1);
    that.clock.tick();

    // assert
    overlayInstance = $(rowsView.getCellElement(0, 1)).find(".dx-overlay.dx-datagrid-invalid-message").dxOverlay("instance");
    assert.ok(overlayInstance, 1, "has invalid message");
    overlayPosition = overlayInstance.option("position");
    assert.strictEqual(overlayPosition.my, "top right", "position.my");
    assert.strictEqual(overlayPosition.at, "bottom right", "position.at");
    assert.strictEqual(overlayPosition.collision, "none flip", "position.collision");

    tooltipInstance = $(rowsView.getCellElement(0, 1)).find(".dx-overlay.dx-datagrid-revert-tooltip").dxTooltip("instance");
    assert.ok(overlayInstance, 1, "has invalid message");
    tooltipPosition = tooltipInstance.option("position");
    assert.strictEqual(tooltipPosition.my, "top right", "position.my");
    assert.strictEqual(tooltipPosition.at, "top left", "position.at");
    assert.strictEqual(tooltipPosition.collision, "none flip", "position.collision");
    assert.strictEqual(tooltipPosition.offset, "-1 0", "position.offset");
});

// T707313
QUnit.test("The validation message should be decreased when there is not enough visible area", function(assert) {
    // arrange
    var that = this,
        overlayInstance,
        overlayPosition,
        rowsView = that.rowsView;

    that.$element().width(500);

    rowsView.render(that.gridContainer);

    that.applyOptions({
        width: 500,
        dataSource: [
            { name: 'Alex', age: "", lastName: "John", phone: 555555 },
            { name: 'Dan', age: 16, lastName: "Skip", phone: 553355 }
        ],
        editing: {
            mode: "batch",
            allowUpdating: true
        },
        columns: [{ dataField: "name", fixed: true, width: 200 },
            {
                dataField: "age",
                width: 100,
                alignment: "right",
                validationRules: [{ type: "required", message: "test test test test test test test test test test" }]
            },
            { dataField: "lastName", width: 50 },
            { dataField: "phone", fixed: true, fixedPosition: "right", width: 200 },
        ]
    });

    that.clock.tick();

    // act
    that.editCell(0, 1);
    that.clock.tick();

    // assert
    overlayInstance = $(rowsView.getCellElement(0, 1)).find(".dx-overlay.dx-datagrid-invalid-message").dxOverlay("instance");
    assert.ok(overlayInstance, 1, "has invalid message");
    assert.strictEqual(overlayInstance.option("maxWidth"), 148, "maxWidth of the validation message");
    overlayPosition = overlayInstance.option("position");
    assert.strictEqual(overlayPosition.my, "top left", "position.my");
    assert.strictEqual(overlayPosition.at, "bottom left", "position.at");
});


QUnit.module('Editing with real dataController with grouping, masterDetail', {
    beforeEach: function() {
        this.$element = () => $("#container");
        this.gridContainer = $("#container > .dx-datagrid");

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
                template: function(container, options) {
                    $(container).dxDataGrid({
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
            var isLink = $targetElement.hasClass("dx-link");
            $($targetElement).trigger(isLink ? 'click' : 'dxclick');
            this.clock.tick();
        };

    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("When showing dxDataGrid in detail, 'select all' function of master grid must select only master's rows", function(assert) {
    // arrange
    var testElement = $('#container'),
        rowClass = "dx-row",
        rowSelectionClass = "dx-selection";

    this.options.selection = {
        mode: "multiple",
        showCheckBoxesMode: "always"
    };

    // act
    this.rowsView.render(testElement);
    this.dataController.expandRow(this.dataController.getKeyByRowIndex(2));
    this.editingController.editRow(0);
    this.clock.tick();
    this.selectAll();

    // assert
    assert.ok(!testElement.find('.' + rowClass).first().hasClass(rowSelectionClass), 'row that editing now has no selection class');
    assert.equal(testElement.find('.' + rowClass).length, 13, "1 header row, 7 content rows, 3 detail row (1 header and 2 content), 2 freespace row");
    assert.equal(testElement.find('.' + rowSelectionClass).length, 6, "7 rows - 1 row that edit, 2 detail row doesn't selected");
});

// T174302
QUnit.test("Insert row without column with group closed", function(assert) {
    // arrange
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

    // assert
    assert.equal(testElement.find(".dx-datagrid-group-closed").length, 7, "count columns with group closed");

    // act
    that.addRow();

    // assert
    assert.ok(testElement.find('tbody > tr').first().hasClass("dx-row-inserted"), "have inserted row");
    assert.ok(!testElement.find('tbody > tr').first().find(".dx-datagrid-group-closed").length, "doesn't have column with group closed");
});

// T187148
QUnit.test("Grouping when columns with showEditorAlways true", function(assert) {
    // arrange
    var that = this,
        testElement = $('#container');

    that.rowsView.render(testElement);

    // act
    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: [{ dataField: "name", showEditorAlways: true }, { dataField: "age", showEditorAlways: true, groupIndex: 0 }, { dataField: "lastName", showEditorAlways: true }]
    });

    // assert
    assert.ok(that.rowsView.element().find('tbody > tr').first().hasClass("dx-group-row"), "group row");
    assert.ok(!that.rowsView.element().find('tbody > tr').first().find("td").last().find(".dx-texteditor").length, "doesn't have editor");
    assert.ok(that.rowsView.element().find('tbody > tr').eq(1).find("td").first().hasClass("dx-datagrid-group-space"), "has group space");
    assert.ok(!that.rowsView.element().find('tbody > tr').eq(1).find("td").first().hasClass("dx-editor-cell"), "group space not have class is dx-editor-cell");
});

// T199291
QUnit.test("Grouping when column with showWhenGrouped true", function(assert) {
    // arrange
    var that = this,
        testElement = $('#container');

    that.rowsView.render(testElement);

    // act
    that.options.columns = [];
    that.applyOptions({
        editing: {
            mode: "batch"
        },
        columns: [{ dataField: "name", showEditorAlways: true }, { dataField: "age", showEditorAlways: true, groupIndex: 0, showWhenGrouped: true }, { dataField: "lastName", showEditorAlways: true }]
    });

    // assert
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

    // act
    that.editRow(0);
    $input = testElement.find(".test input").first();
    $input.val("123");
    $input.change();

    // assert
    assert.equal(testElement.find(".dx-invalid").length, 0);
});

// T469436
QUnit.test("isEditing parameter of the row when there is grouping and edit mode is 'row'", function(assert) {
    // arrange
    var $rowElements;

    this.rowsView.render($("#container"));
    this.applyOptions({
        columns: ["name", "lastName", { dataField: "age", groupIndex: 0 }]
    });

    // assert
    $rowElements = $(this.rowsView.element().find('tbody > tr'));
    assert.ok($rowElements.eq(0).hasClass("dx-group-row"), "group row");
    assert.ok($rowElements.eq(1).hasClass("dx-data-row"), "data row");

    // act
    this.editRow(1);

    // assert
    assert.equal(this.editingController._editRowIndex, 1, "edit row index");
    assert.ok(this.dataController.items()[1].isEditing, "second item is edited");
});

// T607622
QUnit.test("Editable data should not be reset in batch edit mode when collapsing a group row", function(assert) {
    // arrange
    var that = this,
        $testElement = $('#container');

    that.rowsView.render($testElement);
    that.applyOptions({
        editing: {
            mode: "batch",
            allowUpdating: true
        },
        columns: [{ dataField: "name", groupIndex: 0 }, "age", "lastName"]
    });

    that.editCell(1, 1);
    that.cellValue(1, "lastName", "test");

    // assert
    assert.strictEqual(that.cellValue(1, "lastName"), "test", "value of the lastName column of the first row");

    // act
    that.collapseRow(["Alex"]);
    that.expandRow(["Alex"]);

    // assert
    assert.strictEqual(that.cellValue(1, "lastName"), "test", "value of the lastName column of the first row");
});

QUnit.test("Editing controller should correct the editing row index after expand the row above (T660472, T579296)", function(assert) {
    // arrange
    var that = this,
        $testElement = $('#container');

    that.rowsView.render($testElement);
    that.applyOptions({
        editing: {
            mode: "row",
            allowUpdating: true
        }
    });

    // act
    that.editRow(1);
    that.expandRow(that.dataController.getKeyByRowIndex(0));
    // assert
    assert.equal(that.editingController.getEditRowIndex(), 2, "editing row index was increased");

    // act
    that.collapseRow(that.dataController.getKeyByRowIndex(0));
    // assert
    assert.equal(that.editingController.getEditRowIndex(), 2, "editing row index was not changed after collapse the above row");
});

// T752381
QUnit.test("Close edit form after collapse group row", function(assert) {
    // arrange
    var that = this,
        $testElement = $('#container');

    that.rowsView.render($testElement);
    that.applyOptions({
        editing: {
            mode: "form",
            allowUpdating: true
        },
        columns: [{ dataField: "name", groupIndex: 0 }, "age", "lastName"]
    });

    // act
    that.editRow(3);
    that.collapseRow(["Alex"]);

    // assert
    assert.strictEqual(that.editingController.getEditRowIndex(), -1, "edit form was closed");
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
        this.$element = () => $("#container");
        this.gridContainer = $("#container > .dx-datagrid");

        this.options = {
            dataSource: generateDataSource(11, 2),
            columns: [{ dataField: "column1", allowEditing: true }, "column2"],
            onRowPrepared: function(e) {
                $(e.rowElement).height(34);
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
            setupDataGridModules(this, ['data', 'columns', 'rows', 'pager', 'editing', 'editorFactory', 'virtualScrolling', 'errorHandling', 'validating', 'grouping', 'masterDetail', 'adaptivity'], {
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

// T258714
QUnit.test("Uploading items when virtual scrolling after insert row", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(130);
    this.rowsView.resize();

    // assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    // act
    this.addRow();
    this.rowsView.scrollTo({ y: 100 });

    // assert
    items = this.dataController.items();
    assert.equal(this.dataController.pageIndex(), 0, "page index");
    assert.equal(items.length, 9, "count items");
    assert.ok(items[0].isNewRow, "insert item");
});

// T258714
QUnit.test("Change page index when virtual scrolling after insert row", function(assert) {
    // arrange
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
    this.rowsView.height(130);
    this.rowsView.resize();

    // assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    // arrange
    this.addRow();
    this.rowsView.scrollTo({ y: 150 }); // append
    this.rowsView.scrollTo({ y: 300 }); // append

    // assert
    assert.equal(this.dataController.pageIndex(), 2, "page index");

    this.dataController.changed.add(function(args) {
        changeType = args.changeType;
    });

    // act
    this.rowsView.scrollTo({ y: 150 });

    // assert
    items = this.dataController.items();
    assert.strictEqual(changeType, "pageIndex", "change type");
    assert.equal(this.dataController.pageIndex(), 1, "page index");
    assert.equal(items.length, 17, "items count");
    assert.ok(items[0].isNewRow, "insert item");
});

// T258714
QUnit.test("Uploading items when infinite scrolling after insert row", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "infinite",
        useNative: false
    };

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(130);
    this.rowsView.resize();

    // assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    // act
    this.addRow();
    this.rowsView.scrollTo({ y: 150 });

    // assert
    items = this.dataController.items();
    // assert.equal(this.dataController.pageIndex(), 1, "page index");
    assert.equal(items.length, 9, "count items");
    assert.ok(items[0].isNewRow, "insert item");
});

// T258714
QUnit.test("Change position of the inserted row when virtual scrolling", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.options.dataSource = generateDataSource(100, 2);

    this.setupDataGrid();
    this.rowsView.render(testElement);
    this.rowsView.height(130);
    this.rowsView.resize();

    // assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    // arrange
    this.rowsView.scrollTo({ y: 3500 });
    this.clock.tick();

    // assert
    items = this.dataController.items();
    assert.equal(this.dataController.pageIndex(), 24, "page index");
    assert.equal(items.length, 8, "count items");

    // act
    this.addRow();
    this.clock.tick();

    // assert
    items = this.dataController.items();
    assert.equal(items.length, 9, "count items");
    assert.ok(items[4].isNewRow, "insert item");

    // act
    this.rowsView.scrollTo({ y: 0 });
    this.clock.tick();

    // assert
    items = this.dataController.items();
    assert.equal(this.dataController.pageIndex(), 0, "page index");
    assert.equal(items.length, 9, "count items");
    assert.ok(items[0].isNewRow, "insert item");
});

// T258714
QUnit.test("Edit row after the virtual scrolling when there is inserted row", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.options.dataSource = generateDataSource(100, 2);

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(130);
    this.rowsView.resize();

    // assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    // arrange
    this.addRow();
    this.rowsView.scrollTo({ y: 150 });

    // assert
    items = this.dataController.items();
    // assert.equal(this.dataController.pageIndex(), 1, "page index");
    assert.equal(items.length, 13, "count items");
    assert.ok(items[0].isNewRow, "insert item");

    // act
    this.editCell(5, 0);

    // assert
    assert.equal(testElement.find("input").length, 1, "has input");
    assert.equal(testElement.find("input").val(), "Item51", "text edit cell");
});

// T626571
QUnit.test("Validation show only one message for editing cell in virtual mode", function(assert) {
    // arrange
    var testElement = $("#container");

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.options.errorRowEnabled = true;

    this.options.onRowValidating = function(e) {
        e.isValid = false;
        e.errorText = "Test";
    };

    this.options.dataSource = generateDataSource(6, 2);
    this.options.paging.pageSize = 2;
    this.options.editing = {
        mode: "cell",
        allowUpdating: true,
    };

    this.setupDataGrid();
    this.rowsView.render(testElement);
    this.rowsView.height(10);
    this.rowsView.resize();

    // assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    // arrange
    this.rowsView.scrollTo({ y: 150 });

    // assert
    assert.equal(this.dataController.pageIndex(), 2, "page index");

    // act
    this.editCell(5, 0);
    testElement.find("input").val("test");
    testElement.find("input").trigger("change");
    this.saveEditData();

    // assert
    assert.equal(testElement.find(".dx-error-row").length, 1);
    // act
    this.saveEditData();
    // assert
    assert.equal(testElement.find(".dx-error-row").length, 1);
});

// T676492
QUnit.test("Validation is hiding when some data rows are removing from DOM in virtual mode", function(assert) {
    // arrange
    var testElement = $("#container");

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.options.errorRowEnabled = true;

    this.options.onRowValidating = function(e) {
        e.isValid = false;
        e.errorText = "Test";
    };

    this.options.dataSource = generateDataSource(10, 2);
    this.options.paging.pageSize = 2;
    this.options.editing = {
        mode: "cell",
        allowUpdating: true,
    };

    this.setupDataGrid();
    this.rowsView.render(testElement);
    this.rowsView.height(10);
    this.rowsView.resize();

    // assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    // act
    this.editCell(1, 0);
    testElement.find("input").val("test");
    testElement.find("input").trigger("change");
    this.saveEditData();

    // assert
    assert.equal(testElement.find(".dx-error-row").length, 1);

    // arrange
    this.rowsView.scrollTo({ y: 550 });

    // assert
    assert.equal(this.dataController.pageIndex(), 4, "page index");
    assert.equal(testElement.find(".dx-error-row").length, 0);

    // arrange
    this.rowsView.scrollTo({ y: 0 });

    // assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");
    assert.equal(testElement.find(".dx-error-row").length, 1);
});

// T635322
QUnit.test("Error row should be visible after editing", function(assert) {
    // arrange
    var testElement = $("#container");

    this.options.scrolling = {
        useNative: false
    };

    this.options.errorRowEnabled = true;

    this.options.onRowValidating = function(e) {
        e.isValid = false;
        e.errorText = "Test";
    };

    this.options.dataSource = generateDataSource(10, 2);
    this.options.paging.pageSize = 10;
    this.options.editing = {
        mode: "cell",
        allowUpdating: true
    };

    this.setupDataGrid();
    this.rowsView.render(testElement);
    this.rowsView.height(50);
    this.rowsView.resize();

    this.rowsView.scrollTo({ y: 100 });
    var scrollTop = this.rowsView.getScrollable().scrollTop();

    // act
    this.editCell(9, 0);
    testElement.find("input").val("test");
    testElement.find("input").trigger("change");
    this.saveEditData();

    // assert
    assert.equal(testElement.find(".dx-error-row").length, 1, "error row is rendered");
    assert.ok(this.rowsView.getScrollable().scrollTop() > scrollTop, "scroll top is changed");
});

// T538954
QUnit.test("Position of the inserted row if masterDetail is used", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    this.options.dataSource = generateDataSource(10, 1);
    this.options.paging.pageSize = 20;
    this.options.scrolling = { useNative: false };

    this.setupDataGrid();
    this.rowsView.render(testElement);
    this.rowsView.height(150);
    this.rowsView.resize();

    this.expandRow(this.options.dataSource[0]);
    this.expandRow(this.options.dataSource[1]);
    this.expandRow(this.options.dataSource[2]);

    var y = $(this.rowsView.getRowElement(4)).offset().top - $(this.rowsView.getRowElement(0)).offset().top;

    this.rowsView.scrollTo({ y: y });

    // act
    this.addRow();

    // assert
    items = this.dataController.items();
    assert.equal(items.length, 14, "count items");
    assert.equal(items.filter(function(item) { return item.isNewRow; })[0].rowIndex, 4, "insert item");
});

// T538954
QUnit.test("Position of the inserted row if top visible row is master detail", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    this.options.dataSource = generateDataSource(10, 1);
    this.options.paging.pageSize = 20;
    this.options.scrolling = { useNative: false };
    this.options.masterDetail = {
        template: function(container) {
            $(container).height(150);
        }
    };

    this.setupDataGrid();
    this.rowsView.render(testElement);
    this.rowsView.height(150);
    this.rowsView.resize();

    this.expandRow(this.options.dataSource[8]);

    this.rowsView.resize();

    this.rowsView.scrollTo({ y: 10000 });

    // act
    this.addRow();

    // assert
    items = this.dataController.items();
    assert.equal(items.length, 12, "count items");
    assert.equal(items.filter(function(item) { return item.isNewRow; })[0].rowIndex, 10, "insert item");
});

// T601854
QUnit.test("Editing if unbound column presents and form edit mode", function(assert) {
    // arrange
    var that = this,
        testElement = $('#container');

    that.options.editing = {
        allowUpdating: true,
        mode: "form"
    };
    that.options.columns = ["C0", { }];
    that.options.dataSource.store = [{ C0: 0 }, { C0: 1 }];

    that.setupDataGrid();
    that.rowsView.render(testElement);

    // act
    that.editRow(0);

    // assert
    assert.equal($(".dx-datagrid-edit-form-item .dx-textbox").length, 2, "contains editor for empty column");
});

// T538954
QUnit.test("Position of the inserted row if top visible row is adaptive detail", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    testElement.width(150);

    this.options.dataSource = generateDataSource(10, 1);
    this.options.paging.pageSize = 20;
    this.options.columnHidingEnabled = true;
    this.options.scrolling = { useNative: false };

    this.setupDataGrid();
    this.rowsView.render(testElement);
    this.rowsView.height(150);
    this.rowsView.resize();

    this.expandAdaptiveDetailRow(this.options.dataSource[6]);

    this.rowsView.resize();

    this.rowsView.scrollTo({ y: 10000 });

    // act
    this.addRow();

    // assert
    items = this.dataController.items();
    assert.equal(items.length, 12, "count items");
    assert.equal(items.filter(function(item) { return item.isNewRow; })[0].rowIndex, 8, "insert item");
});

// T343567
QUnit.test("Save edit data with set onRowValidating and infinite scrolling", function(assert) {
    // arrange
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

    // assert
    items = that.dataController.items();
    assert.equal(that.dataController.pageIndex(), 0, "page index");
    assert.equal(items.length, 8, "count items");

    // arrange
    that.editCell(3, 0);

    // assert
    assert.equal(testElement.find("input").length, 1, "has input");

    // arrange
    testElement.find("input").val("test");
    testElement.find("input").trigger("change");

    // assert
    assert.strictEqual(testElement.find("input").val(), "test", "value of the input");

    // act
    that.saveEditData();

    // assert
    $cell = testElement.find("tbody > tr").eq(3).children().first();
    assert.strictEqual($cell.text(), "test", "value of the cell");
    assert.ok($cell.find(".dx-highlight-outline").length, "has highlight");
});

QUnit.test("Save inserted data with set onRowValidating and infinite scrolling", function(assert) {
    // arrange
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

    // assert
    assert.equal(that.dataController.pageIndex(), 0, "page index");
    assert.equal(that.dataController.items().length, 8, "count items");

    // arrange
    that.rowsView.scrollTo({ y: 500 });

    // assert
    assert.equal(that.dataController.pageIndex(), 2, "page index");
    assert.equal(that.dataController.items().length, 16, "count items");

    // arrange
    that.addRow();
    that.clock.tick();

    // assert
    assert.equal(that.dataController.items().length, 17, "count items");

    // arrange
    that.rowsView.scrollTo({ y: 0 });

    // assert
    assert.equal(that.dataController.pageIndex(), 0, "page index");

    // act
    that.saveEditData();

    // assert
    items = that.dataController.items();
    assert.equal(items.length, 17, "count items");
    assert.ok(items[0].isNewRow, "inserted item");
});

// T258714
QUnit.test("Edit row after the infinite scrolling when there is inserted row", function(assert) {
    // arrange
    var testElement = $('#container'),
        items;

    this.options.scrolling = {
        mode: "infinite",
        useNative: false
    };

    this.options.dataSource = generateDataSource(100, 2);

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(130);
    this.rowsView.resize();

    // assert
    assert.equal(this.dataController.pageIndex(), 0, "page index");

    // arrange
    this.addRow();
    this.rowsView.scrollTo({ y: 150 });

    // assert
    items = this.dataController.items();
    // assert.equal(this.dataController.pageIndex(), 1, "page index");
    assert.equal(items.length, 9, "count items");
    assert.ok(items[0].isNewRow, "insert item");

    // act
    this.editCell(5, 0);

    // assert
    assert.equal(testElement.find("input").length, 1, "has input");
    assert.equal(testElement.find("input").val(), "Item51", "text edit cell");
});

// T600046
QUnit.test("Position of the inserted row if grouping is used", function(assert) {
    // arrange
    var testElement = $('#container');

    this.options.keyExpr = "column2";
    this.options.dataSource = [
        { column1: 1, column2: 1 },
        { column1: 1, column2: 2 },
        { column1: 2, column2: 3 },
        { column1: 2, column2: 4 }
    ];
    this.options.paging.pageSize = 20;
    this.options.scrolling = { useNative: false };
    this.options.columns[0].groupIndex = 0;
    this.options.grouping = { autoExpandAll: true };

    this.setupDataGrid();
    this.rowsView.render(testElement);
    this.rowsView.height(30);
    this.rowsView.resize();

    var y = $(this.rowsView.getRowElement(2)).offset().top - $(this.rowsView.getRowElement(0)).offset().top;

    this.rowsView.scrollTo({ y: y });

    // act
    this.addRow();

    // assert
    var item3 = this.dataController.items()[2];
    assert.ok(item3.isNewRow, "Item3 is inserted");
    assert.deepEqual(item3.data, {}, "Item3 is empty");
});

// T672237
QUnit.test("cancelEditData after scrolling if scrolling mode is editing", function(assert) {
    // arrange
    var testElement = $('#container');

    this.options.scrolling = {
        mode: "virtual",
        useNative: false
    };

    this.options.editing.mode = "row";

    this.options.dataSource = generateDataSource(50, 2);

    this.setupDataGrid();

    this.rowsView.render(testElement);
    this.rowsView.height(130);
    this.rowsView.resize();

    // act
    this.pageIndex(5);
    this.editRow(1, 1);

    // assert
    assert.equal(testElement.find("input").length, 1, "editor exists");
    assert.equal(testElement.find(".dx-edit-row").length, 1, "edit row exists");

    // act
    this.cancelEditData();

    // assert
    assert.equal(testElement.find("input").length, 0, "no inputs");
    assert.equal(testElement.find(".dx-edit-row").length, 0, "edit row is closed");
});

QUnit.test("DataGrid should show error message on adding row if dataSource is not specified (T711831)", function(assert) {
    // arrange
    var errorCode,
        widgetName;

    this.options.dataSource = undefined;

    this.setupDataGrid();

    this.rowsView.render($('#container'));
    this.rowsView.resize();
    this.getController("data").fireError = function() {
        errorCode = arguments[0];
        widgetName = arguments[1];
    };

    // act
    this.addRow();

    // assert
    assert.equal(errorCode, "E1052", "error code");
    assert.equal(widgetName, "dxDataGrid", "widget name");
});

QUnit.module('Edit Form', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = () => $("#container");
        this.gridContainer = $("#container > .dx-datagrid");

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
            setupDataGridModules(that, ['data', 'columns', 'rows', 'masterDetail', 'editing', 'editorFactory', 'selection', 'headerPanel', 'columnFixing', 'validating', 'keyboardNavigation'], {
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

    // act
    var $links = testElement.find(".dx-row").eq(rowIndex).find(".dx-link-edit");
    assert.equal($links.length, 1, "edit links count");
    $($links.eq(0)).trigger("click");
    this.clock.tick();

    // assert
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

    // act
    that.editRow(0);

    // assert
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
    assert.ok($firstRow.find(".dx-texteditor").eq(1).dxNumberBox("instance"), "item 1 editor type is number");
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

    // act
    that.editRow(0);
    that.editRow(1);

    // assert
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

    this.columnOption("phone", "editCellTemplate", function(container, options) {
        $(container).addClass("test-editor");
        editCellTemplateOptions = options;
    });

    // act
    that.editRow(0);

    // assert
    var $firstRow = testElement.find(".dx-row").eq(0);
    assert.equal($firstRow.find(".dx-form").length, 1, "first row has form");
    assert.equal($firstRow.find(".test-editor").length, 1, "editCellTemplate is rendered in edit form");
    assert.equal(editCellTemplateOptions.column.dataField, "phone", "editCellTemplate options column");
    assert.equal(editCellTemplateOptions.rowType, "detail", "editCellTemplate rowType");
    assert.equal(editCellTemplateOptions.columnIndex, 3, "editCellTemplate columnIndex");
    assert.equal(editCellTemplateOptions.rowIndex, 0, "editCellTemplate rowIndex");
    assert.equal(editCellTemplateOptions.value, "555555", "editCellTemplate value");
    assert.equal(editCellTemplateOptions.isOnForm, true, "editCellTemplate isOnForm");
    assert.equal(typeof editCellTemplateOptions.setValue, "function", "editCellTemplate setValue exists");
});

QUnit.test("onEditorPreparing event should have isOnForm parameter for form editing modes", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    this.options.onEditorPreparing = sinon.spy();
    this.editorFactoryController.init();

    rowsView.render(testElement);

    // act
    that.editRow(0);

    // assert
    assert.equal(this.options.onEditorPreparing.callCount, 5, "onEditorPreparing called 5 times");
    for(var i = 0; i < 5; i++) {
        assert.strictEqual(this.options.onEditorPreparing.getCall(i).args[0].isOnForm, true, "onEditorPreparing args have isOnForm parameter");
    }
});

// T434382
QUnit.test("Render detail form with band columns", function(assert) {
    // arrange
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

    // act
    that.editRow(0);

    // assert
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

    // act
    that.editRow(0);

    // assert
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

    // act
    that.editRow(0);

    // assert
    var formItems = testElement.find(".dx-form").dxForm("instance")._testResultItems;

    assert.equal(formItems.length, 3, "form item count");
    assert.equal(formItems[0].column.dataField, "name", "form item 0 column");
    assert.equal(formItems[1].column.dataField, "phone", "form item 1 column");
    assert.ok(!formItems[2].column, "form item 2 no column");
    assert.ok(formItems[0].template, "form item 0 have template");
    assert.ok(formItems[1].template, "form item 1 have template");
    assert.ok(!formItems[2].template, "form item 2 have no template");
});

// T558721
QUnit.test("Custom item with dataField that equals to band caption", function(assert) {
    var that = this,
        testElement = $('#container');

    that.options.columns = [{
        caption: "room",
        columns: [{ dataField: "room" }]
    }];

    that.options.editing = {
        mode: "form",
        allowUpdating: true,
        form: {
            items: [{
                dataField: "room"
            }]
        }
    };

    that.setupModules(that);

    that.rowsView.render(testElement);

    // act
    that.editRow(0);

    // assert
    var formItems = testElement.find(".dx-form").dxForm("instance")._testResultItems;

    assert.equal(formItems.length, 1, "form item count");
    assert.equal(formItems[0].column.dataField, "room", "form item 0 column dataField");
});

QUnit.test("Custom item with name", function(assert) {
    var that = this,
        testElement = $('#container');

    that.options.columns[3].name = "test";

    that.options.editing = {
        mode: "form",
        allowUpdating: true,
        form: {
            items: [{
                name: "test"
            }]
        }
    };

    that.setupModules(that);

    that.rowsView.render(testElement);

    // act
    that.editRow(0);

    // assert
    var formItems = testElement.find(".dx-form").dxForm("instance")._testResultItems;

    assert.equal(formItems.length, 1, "form item count");
    assert.equal(formItems[0].column.dataField, "phone", "form item 0 column dataField");
    assert.equal(formItems[0].column.name, "test", "form item 0 column name");
});

// T575811
QUnit.test("Group item should not be merged with band item", function(assert) {
    var that = this,
        testElement = $('#container');

    that.options.columns.push({ caption: "band" });

    that.options.editing = {
        mode: "form",
        allowUpdating: true,
        form: {
            items: [{
                itemType: 'group',
                caption: "group"
            }]
        }
    };

    that.setupModules(that);

    that.rowsView.render(testElement);

    // act
    that.editRow(0);

    // assert
    var formItems = testElement.find(".dx-form").dxForm("instance")._testResultItems;

    assert.equal(formItems.length, 1, "form item count");
    assert.notOk(formItems[0].column, "column is not defined for group item");
    assert.notOk(formItems[0].label, "label is not defined for group item");
    assert.equal(formItems[0].caption, "group", "caption for group item is correct");
});

QUnit.test("The first editor should be focused after row added if band column presents and edit mode is form (T670648)", function(assert) {
    var that = this,
        testElement = $('#container');

    that.options.columns = [{
        caption: "band",
        columns: [{ dataField: "column1", allowEditing: true }, "column2"],
    }];
    that.options.editing = {
        mode: "form",
        allowAdding: true
    };

    that.setupModules(that);

    that.rowsView.render(testElement);

    // act
    that.addRow();

    // assert
    assert.equal(that.editingController.getFirstEditableColumnIndex(), 0, "first editable column index is 0");
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

    // assert
    var $formCell = testElement.find(".dx-master-detail-cell");

    var $buttonsContainer = $formCell.find(".dx-datagrid-form-buttons-container");

    assert.equal($formCell.length, 1, "form cell count");
    assert.equal($buttonsContainer.length, 1, "buttons container exists");
    var $buttons = $buttonsContainer.find(".dx-button");
    assert.equal($buttons.length, 2, "two buttons in buttons container");
    assert.equal($buttons.eq(0).text(), "Save", "first button text");
    assert.equal($buttons.eq(1).text(), "Cancel", "second button text");

    // act
    $($buttons.eq(0)).trigger("dxclick");

    // assert
    assert.equal(that.editingController.saveEditData.callCount, 1, "Save button call saveEditData");
    assert.equal(that.editingController.cancelEditData.callCount, 0, "Save button do not call cancelEditData");

    // act
    $($buttons.eq(1)).trigger("dxclick");

    // assert
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

    // act
    $buttons = testElement.find(".dx-master-detail-cell .dx-datagrid-form-buttons-container .dx-button");
    $($buttons.eq(0)).trigger("dxclick");

    // assert
    assert.equal(testElement.find(".dx-row").eq(0).children().eq(0).text(), "Test123", "first cell saved");
    assert.equal(testElement.find(".dx-row").eq(0).children().eq(2).text(), "John", "third cell is not saved");
});

QUnit.test("Edit and save form", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    rowsView.render(testElement);

    // act
    that.editRow(0);
    testElement.find("input").first().val("Test123");
    testElement.find("input").first().trigger("change");
    that.saveEditData();


    // assert
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

    // act
    that.editRow(0);
    that.cancelEditData();

    // assert
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

    // act
    that.addRow();
    that.saveEditData();

    // assert
    assert.equal($(".dx-datagrid-edit-form .dx-invalid").length, 1, "invalid form items count");
});

QUnit.test("Edit and save form with invalid data", function(assert) {
    this.setupModules(this);

    var that = this,
        rowsView = this.rowsView,
        testElement = $('#container');

    var rowValidatingArgs = [];

    that.$element = function() {
        return testElement;
    };
    that.options.onRowValidating = function(e) {
        rowValidatingArgs.push(e);
    };

    that.validatingController.optionChanged({ name: "onRowValidating" });

    rowsView.render(testElement);


    // act
    that.editRow(0);
    testElement.find("input").eq(0).val("");
    testElement.find("input").eq(0).trigger("change");
    that.saveEditData();

    testElement.find("input").eq(0).focus();

    this.clock.tick();

    // assert
    assert.ok(testElement.find(".dx-row").eq(0).hasClass("dx-master-detail-row"), "first row is master detail");
    assert.ok(testElement.find(".dx-row").eq(0).find(".dx-texteditor").eq(0).hasClass("dx-invalid"), "first editor is invalid");
    assert.strictEqual(rowValidatingArgs.length, 1, "onRowValidating call count");
    assert.strictEqual(rowValidatingArgs[0].isValid, false, "isValid false");
    assert.strictEqual(rowValidatingArgs[0].brokenRules.length, 1, "brokenRules count");
    // T309532
    assert.equal(testElement.find(".dx-row").eq(0).find(".dx-texteditor").eq(0).find(".dx-overlay").length, 1, "invalid message exists");
});

// T309524
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

    // act
    that.editRow(0);

    // assert
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

    // act
    that.editRow(0);

    // assert
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

    // act
    this.editRow(0);
    $labels = testElement.find(".dx-datagrid-edit-form label");

    $labels.eq(0).trigger("click");
    assert.ok(testElement.find("input[id*='name']").parent().parent().parent().hasClass("dx-state-focused"), "input with 'name' id");
    $labels.eq(1).trigger("click");
    assert.ok(testElement.find("input[id*='age']").parent().parent().parent().hasClass("dx-state-focused"), "input with 'age' id");
    $labels.eq(2).trigger("click");
    assert.ok(testElement.find("input[id*='lastName']").parent().parent().parent().hasClass("dx-state-focused"), "input with 'lastName' id");
    $labels.eq(3).trigger("click");
    assert.ok(testElement.find("input[id*='phone']").parent().parent().parent().hasClass("dx-state-focused"), "input with 'phone' id");
    $labels.eq(4).trigger("click");
    assert.ok(testElement.find("input[id*='room']").parent().parent().parent().hasClass("dx-state-focused"), "input with 'room' id");
});

// T369851
QUnit.test("no Edit link when editing with allowAdding true", function(assert) {
    // arrange
    this.options.editing = {
        mode: "form",
        allowAdding: true
    };
    this.setupModules(this);

    var rowsView = this.rowsView,
        $cells,
        $testElement = $('#container');

    // act
    rowsView.render($testElement);

    // assert
    $cells = $testElement.find('tbody > tr').first().children();
    assert.equal($cells.length, 5, "count cell");
    assert.ok(!$cells.last().hasClass("dx-command-edit"), "last cell hasn't 'dx-command-edit' class");
});

// T425138
QUnit.test("getCellElement", function(assert) {
    // arrange
    var that = this,
        $editorElements,
        $testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true
    };

    that.setupModules(that);
    that.rowsView.render($testElement);

    // act
    that.editRow(1);

    // assert
    $editorElements = $testElement.find(".dx-datagrid-edit-form-item");
    assert.equal($editorElements.length, 5, "count editor of the form");
    assert.equal(typeUtils.isRenderer(that.getCellElement(1, 0)), !!config().useJQuery, "getCellElement is correct");
    assert.deepEqual($(that.getCellElement(1, 0))[0], $editorElements[0], "first editor");
    assert.deepEqual($(that.getCellElement(1, "age"))[0], $editorElements[1], "second editor");
});

// T425138
QUnit.test("getCellElement when form with custom items", function(assert) {
    // arrange
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

    // act
    that.editRow(0);

    // assert
    $editorElements = $testElement.find(".dx-datagrid-edit-form-item");
    assert.equal($editorElements.length, 2, "count editor of the form");
    assert.deepEqual($(that.getCellElement(0, 0))[0], $editorElements[0], "first editor");
    assert.deepEqual($(that.getCellElement(0, "age"))[0], $editorElements[0], "first editor");
    assert.deepEqual($(that.getCellElement(0, 1))[0], $editorElements[1], "second editor");
    assert.deepEqual($(that.getCellElement(0, "name"))[0], $editorElements[1], "second editor");
});

// T435429
QUnit.test("Render editors after repaint of form", function(assert) {
    // arrange
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

    // act
    formInstance = $firstRow.find(".dx-form").dxForm("instance");
    formInstance.repaint();

    // assert
    assert.equal($firstRow.find(".dx-texteditor").length, 5, "5 editors in form");
});

QUnit.test("Values of the editors should be correct after repaint on form", function(assert) {
    // arrange
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

    // act
    formInstance = $firstRow.find(".dx-form").dxForm("instance");
    $textEditors = $testElement.find(".dx-form .dx-texteditor");
    $textEditors.eq(0).dxTextBox("instance").option("value", "Bob");
    formInstance.repaint();

    // assert
    assert.equal($testElement.find(".dx-form .dx-texteditor").eq(0).dxTextBox("instance").option("value"), "Bob", "value is correct after repaint");
});

// T562662
QUnit.test("Render detail form row - creation а validator should not throw an exception when editCellTemplate  specified for column", function(assert) {
    // arrange
    this.setupModules(this);

    var $testElement = $('#container');

    this.rowsView.render($testElement);

    this.columnOption("phone", {
        editCellTemplate: function($container, options) {
            return $("<div id=wrapper/>")
                .append($("<div/>").dxAutocomplete({}));
        },
        validationRules: [{ type: "required" }]
    });

    try {
        // act
        this.editRow(0);

        // assert
        assert.ok(true, "no exceptions");
    } catch(e) {
        // assert
        assert.ok(false, "exception");
    }
});

// T554950
QUnit.testInActiveWindow("Focus on lookup column should be preserved after changing a value in lookup", function(assert) {
    // arrange
    this.options.keyboardNavigation = {
        enabled: true
    };
    this.options.dataSource.store = [{ name: "Bob", state: 1 }];
    this.options.columns = ["name", {
        dataField: "state",
        setCellValue: function(rowData, value) {
            rowData.state = value;
        },
        lookup: {
            dataSource: [
                { id: 1, state: "Alabama" },
                { id: 2, state: "California" }
            ],
            valueExpr: "id",
            displayExpr: "state"
        }
    }, ];
    this.setupModules(this);
    this.keyboardNavigationController.component.$element = function() {
        return $(".dx-datagrid").parent();
    };
    this.rowsView.render($('#container'));

    this.editRow(0);
    this.clock.tick();

    this.keyboardNavigationController.focus(this.getCellElement(0, 1));
    this.clock.tick();

    // assert
    var $selectBoxElement = $(this.getCellElement(0, 1)).find(".dx-selectbox").first();
    assert.ok($selectBoxElement.hasClass("dx-state-focused"), "second cell is focused");

    // act
    $selectBoxElement.trigger("dxpointerdown");
    $selectBoxElement.dxSelectBox("instance").option("value", 2);
    this.clock.tick();

    // assert
    assert.ok($(this.getCellElement(0, 1)).find(".dx-selectbox").hasClass("dx-state-focused"), "second cell is focused");
});

//
QUnit.test("getCellElement returns correct editor with form editing and enabled masterDetail", function(assert) {
    var that = this,
        $editorElements,
        $testElement = $('#container');

    that.options.editing = {
        mode: "form",
        allowUpdating: true
    };

    that.options.masterDetail = {
        enabled: true
    };

    that.setupModules(that);
    that.rowsView.render($testElement);

    // act
    that.editRow(1);

    $editorElements = $testElement.find(".dx-datagrid-edit-form-item");

    // assert
    assert.deepEqual($(that.getCellElement(1, 0))[0], $editorElements[0], "first editor");
    assert.deepEqual($(that.getCellElement(1, "name"))[0], $editorElements[0], "first editor");
    assert.deepEqual($(that.getCellElement(1, 1))[0], $editorElements[1], "second editor");
    assert.deepEqual($(that.getCellElement(1, "age"))[0], $editorElements[1], "second editor");
});

// T627688
QUnit.test("getCellElement for a hidden column", function(assert) {
    // arrange
    var $editorElements,
        $testElement = $('#container');

    this.options.editing = {
        mode: "form",
        allowUpdating: true
    };
    this.options.columns[3] = { dataField: 'phone', formItem: { visible: false } };
    this.options.columns[4] = { dataField: "room", visible: false };

    this.setupModules(this);
    this.rowsView.render($testElement);

    // act
    this.editRow(0);

    // assert
    $editorElements = $testElement.find(".dx-datagrid-edit-form-item");
    assert.equal($editorElements.length, 4, "count editor of the form");
    assert.deepEqual($(this.getCellElement(0, 3))[0], $editorElements[3], "editor of a hidden column");
    assert.deepEqual($(this.getCellElement(0, "room"))[0], $editorElements[3], "editor of a hidden column");
});

QUnit.test("Switch editing modes between popup and form", function(assert) {
    fx.off = true;
    try {
        var that = this;
        that.setupModules(that);

        that.$element = function() {
            return $('#container');
        };

        var rowsView = that.rowsView,
            testElement = $('#container');

        that.options.onInitNewRow = function(params) {
            that.options.editing.mode = "popup";
            that.dataController.updateItems();
            that.columnOption("phone", { allowEditing: false });
        };
        that.editingController.optionChanged({ name: "onInitNewRow" });
        rowsView.render(testElement);

        // act
        that.editRow(0);
        that.clock.tick();

        // assert
        assert.equal(testElement.find(".dx-datagrid-edit-form").length, 1, "form is rendered");

        // act
        that.addRow();
        that.clock.tick();

        var $editPopup = testElement.find(".dx-datagrid-edit-popup"),
            editPopupInstance = $editPopup.dxPopup("instance"),
            $editingForm = editPopupInstance.$content().find(".dx-form");

        // assert
        assert.equal($editPopup.length, 1, "There is one popup");
        assert.equal($editingForm.length, 1, "There is a form inside the popup");
    } finally {
        fx.off = false;
    }
});

QUnit.test("Add row when row as tbody", function(assert) {
    this.setupModules(this);

    var that = this,
        $rowElements,
        rowsView = this.rowsView,
        $testElement = $('#container');

    that.options.editing.form = {
        colCount: 4
    };
    that.options.rowTemplate = function(container, options) {
        $("<tbody class=\"dx-row dx-data-row\"><tr><td></td></tr></tbody>").appendTo(container);
    };
    rowsView.render($testElement);

    // assert
    $rowElements = $testElement.find("tbody.dx-row");
    assert.strictEqual($rowElements.length, 8, "row count");

    // act
    that.addRow();

    // assert
    $rowElements = $testElement.find("tbody.dx-row");
    assert.strictEqual($rowElements.length, 9, "row count");
    assert.ok($rowElements.eq(0).hasClass("dx-edit-row dx-row-inserted dx-datagrid-edit-form"), "detail form row");
});

QUnit.test("Edit row when row as tbody", function(assert) {
    this.setupModules(this);

    var that = this,
        $rowElements,
        rowsView = this.rowsView,
        $testElement = $('#container');

    that.options.editing.form = {
        colCount: 4
    };
    that.options.rowTemplate = function(container, options) {
        $("<tbody class=\"dx-row dx-data-row\"><tr><td></td></tr></tbody>").appendTo(container);
    };
    rowsView.render($testElement);

    // assert
    $rowElements = $testElement.find("tbody.dx-row");
    assert.strictEqual($rowElements.length, 8, "row count");

    // act
    that.editRow(0);

    // assert
    $rowElements = $testElement.find("tbody.dx-row");
    assert.strictEqual($rowElements.length, 8, "row count");
    assert.ok($rowElements.eq(0).hasClass("dx-edit-row dx-datagrid-edit-form"), "detail form row");
});

QUnit.test("Edit form when form items are specified with editorType", function(assert) {
    // arrange
    var $editorElement;

    this.options.editing.form = {
        items: [{ dataField: "name", editorType: "dxAutocomplete" }]
    };

    this.setupModules(this);

    var rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    // act
    this.editRow(0);

    // assert
    $editorElement = $(rowsView.getCellElement(0, 0)).find(".dx-autocomplete");
    assert.strictEqual($editorElement.length, 1, "editor element");
    assert.ok($editorElement.first().dxAutocomplete("instance"), "editor instance");
});

QUnit.test("Edit form when group form items are specified and simple form items have editor type", function(assert) {
    // arrange
    var $editorElement;

    this.options.editing.form = {
        items: [{ itemType: "group", items: [{ dataField: "name", editorType: "dxAutocomplete" }] }]
    };

    this.setupModules(this);

    var rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    // act
    this.editRow(0);

    // assert
    $editorElement = $(rowsView.getCellElement(0, 0)).find(".dx-autocomplete");
    assert.strictEqual($editorElement.length, 1, "editor element");
    assert.ok($editorElement.first().dxAutocomplete("instance"), "editor instance");
});

QUnit.test("Edit form when tabbed form items are specified and simple form items have editor type", function(assert) {
    // arrange
    var $editorElement;

    this.options.editing.form = {
        items: [{ itemType: "tabbed", tabs: [ { items: [{ dataField: "name", editorType: "dxAutocomplete" }] }] }]
    };

    this.setupModules(this);

    var rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    // act
    this.editRow(0);

    // assert
    $editorElement = $(rowsView.getCellElement(0, 0)).find(".dx-autocomplete");
    assert.strictEqual($editorElement.length, 1, "editor element");
    assert.ok($editorElement.first().dxAutocomplete("instance"), "editor instance");
});

QUnit.test("Edit form when formItem is specified with editorType in the column", function(assert) {
    // arrange
    var $editorElement;

    this.columns[0].formItem = { editorType: "dxAutocomplete" };
    this.setupModules(this);

    var rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    // act
    this.editRow(0);

    // assert
    $editorElement = $(rowsView.getCellElement(0, 0)).find(".dx-autocomplete");
    assert.strictEqual($editorElement.length, 1, "editor element");
    assert.ok($editorElement.first().dxAutocomplete("instance"), "editor instance");
});

QUnit.test("Edit form when formItem is specified with editorType in the column and the editorName is overridden on the onEditorPreparing event", function(assert) {
    // arrange
    var $editorElement;

    this.options.onEditorPreparing = (e) => {
        if(e.dataField === "name") {
            e.editorName = "dxAutocomplete";
        }
    };
    this.columns[0].formItem = { editorType: "dxColorBox" };
    this.setupModules(this);

    var rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    // act
    this.editRow(0);

    // assert
    $editorElement = $(rowsView.getCellElement(0, 0)).find(".dx-autocomplete");
    assert.strictEqual($editorElement.length, 1, "editor element");
    assert.ok($editorElement.first().dxAutocomplete("instance"), "editor instance");
});

QUnit.test("Edit form when the editorType is specified in the column.formItem and editing.form.items", function(assert) {
    // arrange
    var $editorElement;

    this.options.editing.form = {
        items: [{ dataField: "name", editorType: "dxColorBox" }]
    };
    this.columns[0].formItem = { editorType: "dxAutocomplete" };
    this.setupModules(this);

    var rowsView = this.rowsView,
        $testElement = $('#container');

    rowsView.render($testElement);

    // act
    this.editRow(0);

    // assert
    $editorElement = $(rowsView.getCellElement(0, 0)).find(".dx-autocomplete");
    assert.strictEqual($editorElement.length, 1, "editor element");
    assert.ok($editorElement.first().dxAutocomplete("instance"), "editor instance");
});


QUnit.module('Editing - "popup" mode', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = () => $("#container");
        this.gridContainer = $("#container > .dx-datagrid");

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
            setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'rows', 'masterDetail', 'editing', 'editorFactory', 'errorHandling', 'selection', 'headerPanel', 'columnFixing', 'validating'], {
                initViews: true
            });

            this.editingController.component.$element = function() {
                return this.$testElement;
            };
        };

        this.renderRowsView = function() {
            this.rowsView.render(this.$testElement);
        };

        this.preparePopupHelpers = function() {
            this.$editPopup = this.$testElement.find(".dx-datagrid-edit-popup");
            this.editPopupInstance = this.$editPopup.dxPopup("instance");
            this.getEditPopupContent = function() { return this.editingController.getPopupContent(); };
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

    // act
    that.addRow();
    that.clock.tick();
    that.preparePopupHelpers();
    that.clock.tick();

    var $editingForm = that.getEditPopupContent().find(".dx-form");

    // assert
    assert.equal(that.$editPopup.length, 1, "There is one editing popup");
    assert.equal($editingForm.length, 1, "There is dxForm into popup");
    assert.ok(that.isEditingPopupVisible(), "Editing popup is visible");
    assert.equal($editingForm.find(".dx-texteditor").length, that.columns.length, "The expected count of editors are rendered");
    assert.equal($editingForm.find(".dx-texteditor input").val(), "", "Editor has empty initial value");
});

QUnit.test("Show editing popup with custom editCellTemplate on row adding", function(assert) {
    var that = this;
    var editCellTemplateOptions;

    this.columns[0].editCellTemplate = function(container, options) {
        $(container).addClass("test-editor");
        editCellTemplateOptions = options;
    };

    that.setupModules(that);
    that.renderRowsView();

    // act
    that.addRow();
    that.clock.tick();
    that.preparePopupHelpers();
    that.clock.tick();


    // assert
    var $editingForm = that.getEditPopupContent().find(".dx-form");

    assert.equal($editingForm.find(".test-editor").length, 1, "editCellTemplate is rendered in popup");
    assert.strictEqual(editCellTemplateOptions.value, undefined, "editCellTemplate value");
    assert.ok("value" in editCellTemplateOptions, "editCellTemplate value exists"); // T808450
    assert.equal(editCellTemplateOptions.isOnForm, true, "editCellTemplate isOnForm");
    assert.equal(typeof editCellTemplateOptions.setValue, "function", "editCellTemplate setValue exists");
});

QUnit.testInActiveWindow("Focus the first editor at popup shown", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    // act
    that.addRow();
    that.clock.tick();
    that.preparePopupHelpers();
    that.clock.tick(700);

    var $editor = that.getEditPopupContent().find(".dx-form .dx-texteditor").first();

    // assert
    assert.ok($editor.hasClass("dx-state-focused"), "The first editor is focused");
});

QUnit.test("Show editing popup on row editing", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    // act
    that.editRow(0);
    that.clock.tick();
    that.preparePopupHelpers();

    var $editingForm = that.getEditPopupContent().find(".dx-form");

    // assert
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

    // act
    that.editRow(0);
    that.clock.tick();
    that.cancelEditData();
    that.clock.tick();
    that.preparePopupHelpers();

    // assert
    assert.ok(!that.isEditingPopupVisible(), "Editing popup is hidden");
});

QUnit.test("Try to add row with invalid data", function(assert) {
    var that = this,
        rowValidatingArgs;

    that.options.onRowValidating = function(e) {
        rowValidatingArgs = e;
    };

    that.setupModules(that);
    that.renderRowsView();

    // act
    that.addRow();
    that.clock.tick();
    that.saveEditData();
    that.clock.tick();
    that.preparePopupHelpers();

    var $invalidValidators = that.getEditPopupContent().find(".dx-invalid");

    // assert
    assert.ok(that.isEditingPopupVisible(), "Editing popup is visible");
    assert.equal($invalidValidators.length, 2, "There are 2 invalid fields");
    // T671944
    assert.equal(rowValidatingArgs.brokenRules.length, 2, "There are 2 broken rules");
});

QUnit.test("Save the row with an invalid data after update it's values", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    // act
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

    // assert
    assert.ok(!that.isEditingPopupVisible(), "Editing popup is hidden");
    assert.equal($newRow.text().replace(/\s/g, ""), "JohnDow", "New row contains correct data");
});

QUnit.test("Other fields didn't validate after update one dataField", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    // act
    that.addRow();
    that.clock.tick();
    that.preparePopupHelpers();

    var $textBoxes = that.getEditPopupContent().find(".dx-textbox");

    $textBoxes.eq(0).dxTextBox("instance").option("value", "John");
    that.clock.tick();

    var $invalidValidators = that.getEditPopupContent().find(".dx-invalid");

    // assert
    assert.equal($invalidValidators.length, 0, "There are no invalid fields");
});

QUnit.test("Save the row after editing", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    // act
    that.editRow(0);
    that.clock.tick();
    that.preparePopupHelpers();

    var $textBoxes = that.getEditPopupContent().find(".dx-textbox");

    $textBoxes.eq(0).dxTextBox("instance").option("value", "Mary");
    that.saveEditData();
    that.preparePopupHelpers();

    var $newRow = that.rowsView.getRow(0);

    // assert
    assert.ok(!that.isEditingPopupVisible(), "Editing popup is hidden");
    assert.equal($newRow.text().replace(/\s/g, ""), "Mary15John5555551", "Row contains new data");
});

// T523867
QUnit.test("Save the row after adding", function(assert) {
    fx.off = true;

    try {
        var that = this,
            $popupContent,
            $inputElement,
            $insertRowElement;

        that.options.columns = [{
            dataField: "name",
            validationRules: [{ type: "required" }]
        }, "age", "lastName", "phone", "room"];
        that.setupModules(that);
        that.renderRowsView();

        that.addRow();
        that.preparePopupHelpers();

        // assert
        $insertRowElement = that.$testElement.find(".dx-data-row").first();
        assert.ok($insertRowElement.hasClass("dx-row-inserted"), "inserted row is rendered");
        assert.notOk($insertRowElement.is(":visible"), "inserted row is hidden");

        $popupContent = $(that.editPopupInstance.content());
        $inputElement = $popupContent.find("input").first();
        $inputElement.val("Test");
        $($inputElement).trigger("change");

        // act
        that.saveEditData();

        // assert
        $insertRowElement = that.$testElement.find(".dx-data-row").first();
        assert.notOk($insertRowElement.hasClass("dx-row-inserted"), "inserted row isn't rendered");
    } finally {
        fx.off = false;
    }
});

QUnit.test("editing.popup options should apply to editing popup", function(assert) {
    var that = this;

    that.options.editing.popup = { fullScreen: true };
    that.setupModules(that);
    that.renderRowsView();

    // act
    that.editRow(0);
    that.clock.tick();
    that.preparePopupHelpers();

    // assert
    assert.ok(that.editPopupInstance.option("fullScreen"), "Editing popup shown in fullScreen mode");
});

QUnit.test("Cancel edit data when popup hide not after click on 'save' or 'cancel' button", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();
    that.clock.tick();

    var cancelEditDataSpy = sinon.spy(that.editingController, "cancelEditData");

    // act
    that.editRow(0);
    that.clock.tick();

    that.preparePopupHelpers();
    that.editPopupInstance.hide();
    that.clock.tick(600);

    // assert
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

    // act
    that.editRow(0);
    that.clock.tick();

    var spyArgs = spyHandler.getCall(0).args;

    // assert
    expectedProperties.forEach(function(item) {
        assert.ok(Object.prototype.hasOwnProperty.call(spyArgs[0], item), "The '" + item + "' property existed");
    });
});

QUnit.test("Show full screen editing popup on mobile devices", function(assert) {
    var that = this;

    that.setupModules(that);
    that.renderRowsView();

    // act
    that.editRow(0);
    that.clock.tick();
    that.preparePopupHelpers();

    // assert
    var isFullScreen = devices.current().deviceType !== "desktop";
    assert.equal(that.editPopupInstance.option("fullScreen"), isFullScreen, "'fullScreen' option value is 'false' on a desktop and 'true' on a mobile device");
});

// T516897
QUnit.test("Show error row inside popup when update error", function(assert) {
    fx.off = true;
    try {
        var that = this,
            $popupContent,
            $inputElement,
            $errorMessageElement;

        that.options.errorRowEnabled = true;
        that.options.dataSource = {
            load: function() {
                return $.Deferred().resolve(that.array);
            },
            update: function() {
                return $.Deferred().reject("Test");
            }
        };

        that.setupModules(that);
        that.renderRowsView();

        that.editRow(0);
        that.preparePopupHelpers();

        $popupContent = that.getEditPopupContent();
        $inputElement = $popupContent.find("input").first();
        $inputElement.val("Test");
        $($inputElement).trigger("change");

        // act
        that.saveEditData();

        // assert
        $errorMessageElement = $popupContent.children().first();
        assert.ok(that.editPopupInstance.option("visible"), "popup is visible");
        assert.ok($errorMessageElement.hasClass("dx-error-message"), "popup has error message");
        assert.strictEqual($errorMessageElement.text(), "Test", "text of an error message");
    } finally {
        fx.off = false;
    }
});

QUnit.test("Show error row in header when remove error", function(assert) {
    fx.off = true;

    try {
        var that = this,
            $errorMessageElement;

        that.options.showColumnHeaders = true;
        that.options.errorRowEnabled = true;
        that.options.editing.text = {
            confirmDeleteMessage: ""
        };
        that.options.dataSource = {
            load: function() {
                return $.Deferred().resolve(that.array);
            },
            remove: function() {
                return $.Deferred().reject("Test");
            }
        };

        that.setupModules(that);
        that.columnHeadersView.render(that.$testElement);
        that.renderRowsView();

        that.editRow(0); // render popup
        that.cancelEditData(); //
        that.preparePopupHelpers();

        // assert
        assert.ok(that.editPopupInstance, "has popup");
        assert.notOk(that.editPopupInstance.option("visible"), "popup is hidden");

        // act
        that.deleteRow(0);

        // assert
        $errorMessageElement = that.$testElement.find(".dx-datagrid-headers .dx-error-row");
        assert.strictEqual($errorMessageElement.length, 1, "header has error row");
        assert.strictEqual($errorMessageElement.text(), "Test", "text of an error message");
    } finally {
        fx.off = false;
    }
});

// T534503
QUnit.testInActiveWindow("Form should repaint after change data of the column with 'setCellValue' option", function(assert) {
    // arrange
    var that = this,
        $popupContent,
        $inputElement,
        callSetCellValue;

    that.columns[1] = {
        dataField: "age",
        setCellValue: function(rowData, value) {
            callSetCellValue = true;
            rowData.lastName = "Test2";
            this.defaultSetCellValue(rowData, value);
        }
    };
    that.setupModules(that);
    that.renderRowsView();

    that.editRow(0);
    that.clock.tick(500);
    that.preparePopupHelpers();
    $popupContent = $(that.editPopupInstance.content());

    // assert
    assert.ok($popupContent.find(".dx-texteditor").first().hasClass("dx-state-focused"), "first cell is focused");

    // act
    $inputElement = $popupContent.find("input").not("[type='hidden']").eq(1);
    $inputElement.focus();
    $inputElement.val(666);
    $($inputElement).trigger("change");
    that.clock.tick(500);

    // assert
    assert.ok(callSetCellValue, "setCellValue is called");
    assert.strictEqual($popupContent.find("input").not("[type='hidden']").eq(2).val(), "Test2", "value of the third cell");
    assert.ok($popupContent.find(".dx-texteditor").eq(1).hasClass("dx-state-focused"), "second cell is focused");
});

// T702664
QUnit.testInActiveWindow("Form should restore focus to item in group after change data of the column with 'setCellValue' option", function(assert) {
    // arrange
    var that = this,
        $popupContent,
        $inputElement,
        callSetCellValue;

    that.columns[1] = {
        dataField: "age",
        setCellValue: function(rowData, value) {
            callSetCellValue = true;
            rowData.lastName = "Test2";
            this.defaultSetCellValue(rowData, value);
        }
    };

    that.options.editing.form = {
        items: [{
            itemType: "group",
            items: [
                { dataField: "name" },
                { dataField: "age" },
                { dataField: "lastName" },
            ]
        }]
    };

    that.setupModules(that);
    that.renderRowsView();

    that.editRow(0);
    that.clock.tick(500);
    that.preparePopupHelpers();
    $popupContent = $(that.editPopupInstance.content());

    // assert
    assert.ok($popupContent.find(".dx-texteditor").first().hasClass("dx-state-focused"), "first cell is focused");

    // act
    $inputElement = $popupContent.find("input").not("[type='hidden']").eq(1);
    $inputElement.focus();
    $inputElement.val(666);
    $($inputElement).trigger("change");
    that.clock.tick(500);

    // assert
    assert.ok(callSetCellValue, "setCellValue is called");
    assert.strictEqual($popupContent.find("input").not("[type='hidden']").eq(2).val(), "Test2", "value of the third cell");
    assert.ok($popupContent.find(".dx-texteditor").eq(1).hasClass("dx-state-focused"), "second cell is focused");
});

// T613963
QUnit.testInActiveWindow("Form should repaint after change lookup dataSource", function(assert) {
    // arrange
    var that = this,
        $popupContent;

    that.columns[4] = {
        dataField: "room",
        lookup: {
            valueExpr: "id",
            displayExpr: "name",
            dataSource: [{ id: 1, name: "Room 1" }]
        }
    };
    that.setupModules(that);
    that.renderRowsView();

    that.editRow(0);
    that.clock.tick(500);
    that.preparePopupHelpers();
    $popupContent = $(that.editPopupInstance.content());

    // assert
    var selectBox = $popupContent.find(".dx-selectbox").dxSelectBox("instance");
    selectBox.open();
    assert.equal(selectBox.getDataSource().items().length, 1, "lookup has 1 item");

    // act
    that.columnOption("room", "lookup.dataSource", [{ id: 1, name: "Room 1" }, { id: 2, name: "Room 2" }]);

    // assert
    selectBox = $popupContent.find(".dx-selectbox").dxSelectBox("instance");
    selectBox.open();
    assert.equal(selectBox.getDataSource().items().length, 2, "lookup has 2 items");
});

QUnit.test("Repaint of popup is should be called when form layout is changed", function(assert) {
    var that = this,
        screenFactor = "xs";

    that.options.editing.form = {
        screenByWidth: function() {
            return screenFactor;
        },
        colCountByScreen: {
            lg: 2,
            xs: 1
        }
    };

    that.options.editing.popup = {
        width: "auto",
        height: "auto",
        minHeight: 150,
    };

    that.setupModules(that);
    that.renderRowsView();

    // act
    this.addRow();

    var spy1 = sinon.spy(this.editingController._editPopup, "repaint"),
        spy2 = sinon.spy(this.editingController._editPopup, "_render"),
        editForm = this.editingController._editForm;

    screenFactor = "lg";
    domUtils.triggerResizeEvent(editForm.element());

    assert.equal(spy1.callCount, 1, "repaint is thrown");
    assert.equal(spy2.callCount, 0, "render is called after repaint");
});

// T610885
QUnit.test("The data passed to the editCellTemplate callback should be updated after editing cell (in the scenario with cascaded editors)", function(assert) {
    // arrange
    var template = sinon.spy();

    this.options.columns = [{
        dataField: "name",
        editCellTemplate: template
    }, {
        dataField: "age",
        setCellValue: function(rowData, value) {
            rowData.age = value;
        }
    }];
    this.setupModules(this);
    this.renderRowsView();

    this.editRow(0);
    this.clock.tick();

    // assert
    assert.deepEqual(template.getCall(0).args[1].data, { name: 'Alex', age: 15, lastName: "John", phone: "555555", room: 1 }, "row data");

    // act
    this.cellValue(0, 1, 666);

    // assert
    assert.deepEqual(template.getCall(1).args[1].data, { name: 'Alex', age: 666, lastName: "John", phone: "555555", room: 1 }, "row data");
    assert.strictEqual(template.callCount, 2, "editCellTemplate call count");
});

QUnit.test("In popup editing mode need to repaint only changed fields with repaintChangesOnly (T753269)", function(assert) {
    // arrange
    var that = this,
        $popupContent,
        selectBox,
        orders = [
            { Id: 1, Name: "Paul Henriot", City: "Reims", Country: "France" },
            { Id: 2, Name: "Karin Josephs", City: "Münster", Country: "Germany" }
        ],
        countries = [{ Country: "France" }, { Country: "Germany" }],
        cities = [{ City: "Reims" }, { City: "Münster" }],
        cityFireCount = 0,
        countryFireCount = 0,
        getLookupConfig = function(data, columnName) {
            return {
                dataSource: {
                    key: columnName,
                    load: function() {
                        var d = $.Deferred();
                        setTimeout(() => d.resolve(data));
                        return d.promise();
                    },
                    byKey: function(key) {
                        if(columnName === "City") {
                            cityFireCount++;
                        } else if(columnName === "Country") {
                            countryFireCount++;
                        }
                        return data[key];
                    }
                },
                valueExpr: columnName,
                displayExpr: columnName
            };
        };

    that.options.dataSource = orders;
    that.options.keyExpr = "Id";
    that.options.repaintChangesOnly = true;
    that.options.remoteOperations = true;
    that.options.columns = [
        "Id", "Name",
        { dataField: "City", lookup: getLookupConfig(cities, "City") },
        { dataField: "Country", lookup: getLookupConfig(countries, "Country") }
    ];
    that.options.onEditorPrepared = function(e) {
        if(e.dataField === "City" && e.parentType === "dataRow") {
            $(e.editorElement).dxSelectBox("instance").on("valueChanged", function(args) {
                that.cellValue(e.row.rowIndex, "Name", "test");
            });
        }
    };

    that.setupModules(that);
    that.renderRowsView();

    that.clock.tick();

    // act
    that.editRow(0);
    that.clock.tick();

    // arrange
    that.preparePopupHelpers();

    // act
    $popupContent = $(that.editPopupInstance.content());
    selectBox = $popupContent.find(".dx-selectbox").dxSelectBox("instance");
    selectBox.option("value", "Münster");

    // assert
    assert.equal(countryFireCount, 1, "Not changed field was rendered once");
    assert.equal(cityFireCount, 2, "Changed field was repaint on update");
});

QUnit.test("Popup should have scrollbar", function(assert) {
    // arrange
    var that = this,
        scrollable,
        $scrollableContent,
        $popupContent;

    that.options.editing.allowAdding = true;
    that.options.editing.popup = {
        width: 700,
        height: 200
    };
    that.options.onRowValidating = function(e) {
        e.isValid = false;
        e.errorText = "Test";
    };
    that.options.onInitNewRow = function(e) {
        e.data = { name: 'Tom', age: 66, lastName: "Steve", phone: "555555", room: 1 };
    };
    that.setupModules(that);
    that.renderRowsView();

    that.addRow();
    that.clock.tick();

    // act
    that.saveEditData();
    that.clock.tick();

    that.preparePopupHelpers();
    $popupContent = that.editPopupInstance.$content();
    scrollable = $popupContent.children().data("dxScrollable");

    // assert
    assert.ok(scrollable, "popup has scrollable");
    $scrollableContent = scrollable.$content();
    assert.ok($scrollableContent.children().first().hasClass("dx-error-message"), "error message inside the scrollable component");
    assert.ok($scrollableContent.children().last().hasClass("dx-form"), "form inside the scrollable component");
});

// T680925
QUnit.test("No exceptions on editing data when validationRules and editCellTemplate are specified in column", function(assert) {
    // arrange
    this.columns[0].editCellTemplate = function(container) {
        $(container).append($("<input type='text' />"));
    };

    this.setupModules(this);
    this.renderRowsView();
    fx.off = true;
    sinon.spy(errors, "log");

    try {
        // act
        this.editRow(0);

        // assert
        assert.equal(errors.log.callCount, 1, "one error is occured");
        assert.equal(errors.log.lastCall.args[0], "E1050", "Error code");
    } catch(e) {
        // assert
        assert.ok(false, "exception");
    } finally {
        fx.off = false;
        errors.log.restore();
    }
});

// T721896
QUnit.test("Validator should be rendered if deferUpdate is used in editCellTemplate", function(assert) {
    // arrange
    this.columns[0].editCellTemplate = function(container, options) {
        // deferUpdate is called in template in devextreme-react
        commonUtils.deferUpdate(() => {
            $("<div>").appendTo(container).dxTextBox({
                value: options.value
            });
        });
    };

    this.setupModules(this);
    this.renderRowsView();
    fx.off = true;

    try {
        // act
        this.editRow(0);

        // assert
        this.preparePopupHelpers();
        var $popupContent = this.getEditPopupContent();
        assert.equal($popupContent.find(".dx-validator").length, 2, "two validators are rendered");
    } finally {
        fx.off = false;
    }
});

QUnit.test("The editCellTemplate should be called once for the form when adding a new row", function(assert) {
    // arrange
    var editCellTemplate = sinon.spy(function() {
        return $("<div class='myEditor'/>").text("<input />");
    });

    this.columns[0].editCellTemplate = editCellTemplate;

    this.setupModules(this);
    this.renderRowsView();

    // act
    this.addRow();
    this.clock.tick();
    this.preparePopupHelpers();
    this.clock.tick();

    // arrange
    assert.strictEqual(editCellTemplate.callCount, 1, "editCellTemplate call count");
    assert.strictEqual($(this.getRowElement(0)).find(".myEditor").length, 0, "row hasn't custom editor");
    assert.strictEqual($(this.getEditPopupContent()).find(".myEditor").length, 1, "form has custom editor");
});

QUnit.module("Promises in callbacks and events", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = () => $("#container");
        this.gridContainer = $("#container > .dx-datagrid");

        this.array = [
            { name: "Alex", age: 15, lastName: "John", phone: "555555", room: 1 },
            { name: "Dan", age: 16, lastName: "Skip", phone: "553355", room: 2 },
            { name: "Vadim", age: 17, lastName: "Dog", phone: "225555", room: 3 },
            { name: "Dmitry", age: 18, lastName: "Cat", phone: "115555", room: 4 },
            { name: "Sergey", age: 18, lastName: "Larry", phone: "550055", room: 5 },
            { name: "Kate", age: 20, lastName: "Glock", phone: "501555", room: 6 },
            { name: "Dan", age: 21, lastName: "Zikerman", phone: "1228844", room: 7 }
        ];
        this.columns = [{
            dataField: "name",
            setCellValue: (newData, value) => {
                let deferred = $.Deferred();
                this.deferred = deferred;
                newData.name = value;
                setTimeout(() =>{
                    newData.age = 99;
                    deferred.resolve();
                }, 100);
                return deferred;
            }
        }, "age", "lastName", "phone", "room"];
        this.options = {
            errorRowEnabled: true,
            editing: {
                mode: "cell",
                allowUpdating: true
            },
            commonColumnSettings: {
                allowEditing: true
            },
            columns: this.columns,
            dataSource: this.array,
            keyboardNavigation: {
                enabled: true
            }
        };

        setupDataGridModules(this, ["data", "columns", "columnHeaders", "rows", "gridView", "keyboardNavigation", "editing", "editorFactory", "headerPanel", "validating", "errorHandling"], {
            initViews: true
        });

        this.find = function($element, selector) {
            var $targetElement = $element.find(selector);
            QUnit.assert.equal($targetElement.length, 1, 'one element with selector ' + '"' + selector + '" found');
            return $targetElement;
        };
        this.click = function($element, selector) {
            var $targetElement = this.find($element, selector);
            var isLink = $targetElement.hasClass("dx-link");
            $($targetElement).trigger(isLink ? "click" : "dxclick");
            this.clock.tick();
        };
        this.editCell = function(rowIndex, columnIndex, text) {
            let testElement = $("#container");
            testElement.find("tbody > tr").eq(rowIndex).find("td").eq(columnIndex).trigger("dxclick"); // Edit
            if(text) {
                testElement.find("input").eq(0).val(text);
                testElement.find("input").eq(0).trigger("change");
            }
        };
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
    }
});

QUnit.test("Saving on enter key while editing cell with async setCellValue works correctly", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    rowsView.render(testElement);
    that.columnsController.init();

    // act
    this.editCell(0, 0, "Test");
    this.clock.tick();

    // assert
    let $input = getInputElements(testElement).first();
    $($input).trigger($.Event("keydown", { key: "Enter" }));
    assert.equal(testElement.find("input").length, 1, "Editor in not closed until data is changed");

    // act
    this.clock.tick(100);

    // assert
    assert.equal(testElement.find("input").length, 0, "No cells in editing mode");
    assert.equal(this.array[0].name, "Test", "First cell changed");
    assert.equal(this.array[0].age, 99, "Second cell changed");
});

QUnit.test("Closing cell editor with async setCellValue works", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    rowsView.render(testElement);
    that.columnsController.init();

    // act
    this.editCell(0, 0, "Test");
    this.editingController.closeEditCell();

    // assert
    assert.equal(testElement.find("input").length, 1, "Editor in not closed until data is changed");

    // act
    this.clock.tick(100);

    // assert
    assert.equal(testElement.find("input").length, 0, "No cells in editing mode");
    assert.equal(this.array[0].name, "Test", "First cell changed");
    assert.equal(this.array[0].age, 99, "Second cell changed");
});

QUnit.test("Cancel changes after closing cell editor with async setCellValue", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    rowsView.render(testElement);
    that.columnsController.init();

    // act
    this.editCell(0, 0, "Test");
    this.editingController.closeEditCell();
    this.clock.tick();
    this.cancelEditData();

    // assert
    assert.equal(testElement.find("input").length, 0, "Editor is closed");

    // act
    this.clock.tick(100);

    // assert
    assert.notOk(this.hasEditData(), "no editData");
    assert.equal(this.array[0].name, "Alex", "First cell is not changed");
    assert.equal(this.array[0].age, 15, "Second cell is not changed");
});

QUnit.test("Changing editing cell save data when promises are used", function(assert) {
    // arrange
    var that = this,
        rowsView = this.rowsView,
        testElement = $("#container");

    rowsView.render(testElement);
    that.columnsController.init();

    // act
    this.editCell(0, 0, "Test");
    testElement.find("tbody > tr").eq(1).find("td").eq(3).trigger("dxclick");

    // assert
    assert.ok($(this.getCellElement(0, 0)).hasClass("dx-editor-cell"), "Cell is still in editing mode");
    assert.equal(testElement.find("input").length, 1, "Editor in not closed until data is changed");

    // act
    this.clock.tick(100);

    // assert
    assert.ok($(this.getCellElement(1, 3)).hasClass("dx-editor-cell"), "New editor created");
    assert.equal(testElement.find("input").length, 1, "New cell in editing mode");
    assert.equal(this.array[0].name, "Test", "First cell changed");
    assert.equal(this.array[0].age, 99, "Second cell changed");
});

QUnit.test("Error row should be shown if promise returned from setCellValue is rejected", function(assert) {
    // arrange
    var that = this,
        testElement = $("#container");

    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.columnsController.init();

    // act
    this.editCell(0, 0, "Test");
    this.editingController.closeEditCell();
    this.clock.tick();

    // assert
    assert.equal(testElement.find("input").length, 1, "Editor is not closed");

    // act
    this.deferred.reject("TestError");
    this.clock.tick(100);

    // assert
    assert.notOk(this.hasEditData(), "No edit data");
    assert.equal(testElement.find("input").length, 1, "Editor is visible");
    assert.equal(testElement.find(".dx-error-row").length, 1, "Error row is visible");
    assert.equal(testElement.find(".dx-error-row .dx-error-message").text(), "TestError", "Error row text");
});

QUnit.test("Closing cell should work after promise returned from setCellValue is rejected", function(assert) {
    // arrange
    var that = this,
        testElement = $("#container");

    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.columnsController.init();

    // act
    this.editCell(0, 0, "Test");
    this.deferred.reject("TestError");
    this.clock.tick(100);
    this.editingController.closeEditCell();
    this.clock.tick();

    // assert
    assert.notOk(this.hasEditData(), "No edit data");
    assert.equal(testElement.find("input").length, 0, "Editor is closed");
    assert.equal(testElement.find(".dx-error-row").length, 0, "Error row is not visible");
});

var onInitNewRowTest = function(assert, that, mode) {
    // arrange
    var testElement = $("#container"),
        visibleRows,
        rowData = { room: 42 };

    that.options.columns = ["room"];
    that.options.editing = {
        allowAdding: true,
        mode: mode
    };
    that.options.onInitNewRow = function(e) {
        e.promise = $.Deferred();
        setTimeout(() => {
            e.data = rowData;
            e.promise.resolve();
        }, 500);
    };

    that.editingController.optionChanged({ name: "onInitNewRow" });
    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.headerPanel.render(testElement);
    that.columnsController.init();

    // act
    that.addRow();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 7);

    // act
    that.clock.tick(500);

    that.saveEditData();
    that.clock.tick();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 8, "row was added");
    assert.deepEqual(visibleRows[7].data, rowData, "last row's data");
};

QUnit.test("Adding row with async onInitNewRow and batch mode", function(assert) {
    onInitNewRowTest(assert, this, "batch");
});

QUnit.test("Adding row with async onInitNewRow and row mode", function(assert) {
    onInitNewRowTest(assert, this, "row");
});

QUnit.test("Adding row with async onInitNewRow and cell mode", function(assert) {
    onInitNewRowTest(assert, this, "cell");
});

var failingOnInitNewRowTest = function(assert, that, mode) {
    // arrange
    var testElement = $("#container"),
        visibleRows,
        rowData = { room: 42 },
        errorText = "error text";

    that.options.columns = ["room"];
    that.options.editing = {
        allowAdding: true,
        mode: mode
    };
    that.options.onInitNewRow = function(e) {
        e.promise = $.Deferred();
        setTimeout(() => {
            e.data = rowData;
            e.promise.reject(errorText);
        }, 500);
    };

    that.editingController.optionChanged({ name: "onInitNewRow" });
    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.headerPanel.render(testElement);
    that.columnsController.init();

    // act
    that.addRow();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 7);

    // act
    that.clock.tick(500);

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 7, "row was not added");
    assert.equal($(".dx-error-message").text(), errorText, "error row");
};

QUnit.test("Adding row with failing async onInitNewRow and batch mode", function(assert) {
    failingOnInitNewRowTest(assert, this, "batch");
});

QUnit.test("Adding row with failing async onInitNewRow and row mode", function(assert) {
    failingOnInitNewRowTest(assert, this, "row");
});

QUnit.test("Adding row with failing async onInitNewRow and cell mode", function(assert) {
    failingOnInitNewRowTest(assert, this, "cell");
});

QUnit.test("Adding multiple rows with async onInitNewRow and batch mode", function(assert) {
    // arrange
    var testElement = $("#container"),
        that = this,
        visibleRows,
        index = 8;

    that.options.columns = ["room"];
    that.options.editing = {
        allowAdding: true,
        mode: "batch"
    };
    that.options.onInitNewRow = function(e) {
        e.promise = $.Deferred();
        setTimeout(() => {
            e.data = { room: index++ };
            e.promise.resolve();
        }, 500);
    };

    that.editingController.optionChanged({ name: "onInitNewRow" });
    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.headerPanel.render(testElement);
    that.columnsController.init();

    // act
    that.addRow();
    that.addRow();
    that.addRow();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 7);

    // act
    that.clock.tick(500);

    that.saveEditData();
    that.clock.tick();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 10, "all rows were added");
    assert.deepEqual(visibleRows[7].data, { room: 8 }, "row #7 data");
    assert.deepEqual(visibleRows[8].data, { room: 9 }, " row #8 data");
    assert.deepEqual(visibleRows[9].data, { room: 10 }, "last row's data");
});

QUnit.test("Adding multiple rows with async onInitNewRow and cell mode", function(assert) {
    // arrange
    var testElement = $("#container"),
        that = this,
        visibleRows,
        index = 8;

    that.options.columns = ["room"];
    that.options.editing = {
        allowAdding: true,
        mode: "cell"
    };
    that.options.onInitNewRow = function(e) {
        e.promise = $.Deferred();
        setTimeout(() => {
            e.data = { room: index++ };
            e.promise.resolve();
        }, 500);
    };

    that.editingController.optionChanged({ name: "onInitNewRow" });
    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.headerPanel.render(testElement);
    that.columnsController.init();

    // act
    that.addRow();
    that.addRow();
    that.addRow();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 7);

    // act
    that.clock.tick(500);

    that.saveEditData();
    that.clock.tick();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 8, "one row was added");
    assert.deepEqual(visibleRows[7].data, { room: 8 }, "row #7 data");
});

QUnit.test("Adding multiple rows with async onInitNewRow and row mode", function(assert) {
    // arrange
    var testElement = $("#container"),
        that = this,
        visibleRows,
        index = 8;

    that.options.columns = ["room"];
    that.options.editing = {
        allowAdding: true,
        mode: "row"
    };
    that.options.onInitNewRow = function(e) {
        e.promise = $.Deferred();
        setTimeout(() => {
            e.data = { room: index++ };
            e.promise.resolve();
        }, 500);
    };

    that.editingController.optionChanged({ name: "onInitNewRow" });
    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.headerPanel.render(testElement);
    that.columnsController.init();

    // act
    that.addRow();
    that.addRow();
    that.addRow();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 7);

    // act
    that.clock.tick(500);

    that.saveEditData();
    that.clock.tick();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 8, "one row was added");
    assert.deepEqual(visibleRows[7].data, { room: 8 }, "row #7 data");
});

QUnit.test("Adding multiple rows with async onInitNewRow (mixed failures and success) and batch mode", function(assert) {
    // arrange
    var testElement = $("#container"),
        $insertedRows,
        that = this,
        visibleRows,
        index = 8,
        errorText = "error text";

    that.options.columns = ["room"];
    that.options.editing = {
        allowAdding: true,
        mode: "batch"
    };
    that.options.onInitNewRow = function(e) {
        e.promise = $.Deferred();
        setTimeout(() => {
            e.data = { room: index++ };
            if(index % 2 === 0) {
                e.promise.resolve();
            } else {
                e.promise.reject(errorText);
            }
        }, 500);
    };

    that.editingController.optionChanged({ name: "onInitNewRow" });
    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.headerPanel.render(testElement);
    that.columnsController.init();

    // act
    that.addRow();
    that.addRow();
    that.addRow();
    that.addRow();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 7);

    // act
    that.clock.tick(500);

    $insertedRows = $(".dx-row-inserted");

    // assert
    assert.equal($(".dx-error-message").text(), errorText, "error text");
    assert.equal($insertedRows.length, 2, "two inserted rows");
    assert.equal($insertedRows.eq(0).find(".dx-texteditor-input").attr("aria-valuenow"), "11", "last inserted row");
    assert.equal($insertedRows.eq(1).text(), "9", "previously inserted row");

    // act
    that.saveEditData();
    that.clock.tick();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 9, "two rows were added");
    assert.deepEqual(visibleRows[7].data, { room: 9 }, "row #7 data");
    assert.deepEqual(visibleRows[8].data, { room: 11 }, "row #8 data");
});

QUnit.test("Adding multiple rows with async onInitNewRow (mixed failures and success) and cell mode", function(assert) {
    // arrange
    var testElement = $("#container"),
        $insertedRow,
        that = this,
        visibleRows,
        index = 8,
        errorText = "error text";

    that.options.columns = ["room"];
    that.options.editing = {
        allowAdding: true,
        mode: "cell"
    };
    that.options.onInitNewRow = function(e) {
        e.promise = $.Deferred();
        setTimeout(() => {
            e.data = { room: index++ };
            if(index % 2 === 0) {
                e.promise.resolve();
            } else {
                e.promise.reject(errorText);
            }
        }, 500);
    };

    that.editingController.optionChanged({ name: "onInitNewRow" });
    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.headerPanel.render(testElement);
    that.columnsController.init();

    // act
    that.addRow();
    that.addRow();
    that.addRow();
    that.addRow();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 7);

    // act
    that.clock.tick(500);

    $insertedRow = $(".dx-row-inserted");

    // assert
    assert.equal($(".dx-error-message").text(), errorText, "error text");
    assert.equal($insertedRow.length, 1, "one inserted row");
    assert.equal($insertedRow.find(".dx-texteditor-input").attr("aria-valuenow"), "9", "last inserted row");

    // act
    that.saveEditData();
    that.clock.tick();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 8, "two rows were added");
    assert.deepEqual(visibleRows[7].data, { room: 9 }, "row #7 data");
});

QUnit.test("Adding multiple rows with async onInitNewRow (mixed failures and success) and row mode", function(assert) {
    // arrange
    var testElement = $("#container"),
        $insertedRow,
        that = this,
        visibleRows,
        index = 8,
        errorText = "error text";

    that.options.columns = ["room"];
    that.options.editing = {
        allowAdding: true,
        mode: "row"
    };
    that.options.onInitNewRow = function(e) {
        e.promise = $.Deferred();
        setTimeout(() => {
            e.data = { room: index++ };
            if(index % 2 === 0) {
                e.promise.resolve();
            } else {
                e.promise.reject(errorText);
            }
        }, 500);
    };

    that.editingController.optionChanged({ name: "onInitNewRow" });
    that.columnHeadersView.render(testElement);
    that.rowsView.render(testElement);
    that.headerPanel.render(testElement);
    that.columnsController.init();

    // act
    that.addRow();
    that.addRow();
    that.addRow();
    that.addRow();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 7);

    // act
    that.clock.tick(500);

    $insertedRow = $(".dx-row-inserted");

    // assert
    assert.equal($(".dx-error-message").text(), errorText, "error text");
    assert.equal($insertedRow.length, 1, "one inserted row");
    assert.equal($insertedRow.find(".dx-texteditor-input").attr("aria-valuenow"), "9", "last inserted row");

    // act
    that.saveEditData();
    that.clock.tick();

    visibleRows = that.getVisibleRows();

    // assert
    assert.equal(visibleRows.length, 8, "two rows were added");
    assert.deepEqual(visibleRows[7].data, { room: 9 }, "row #7 data");
});
