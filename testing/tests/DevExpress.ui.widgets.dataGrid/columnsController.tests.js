"use strict";

var $ = require("jquery"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store"),
    dateLocalization = require("localization/date"),
    isFunction = require("core/utils/type").isFunction,
    gridCore = require("ui/data_grid/ui.data_grid.core"),
    dataSourceAdapter = require("ui/data_grid/ui.data_grid.data_source_adapter"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    config = require("core/config"),
    errors = require("ui/widget/ui.errors"),
    ajaxMock = require("../../helpers/ajaxMock.js");

require("ui/data_grid/ui.data_grid");

QUnit.testDone(function() {
    ajaxMock.clear();
});

var processColumnsForCompare = function(columns, parameterNames, ignoreParameterNames) {
    var processedColumns = $.extend(true, [], columns);
    $.each(processedColumns, function() {
        var propertyName;
        for(propertyName in this) {
            if(ignoreParameterNames && $.inArray(propertyName, ignoreParameterNames) >= 0) {
                delete this[propertyName];
            } else if(parameterNames) {
                if($.inArray(propertyName, parameterNames) === -1) {
                    delete this[propertyName];
                }
            } else {
                if($.isFunction(this[propertyName])) {
                    delete this[propertyName];
                }
                if([
                    "filterOperations",
                    "showInColumnChooser",
                    "userDataType",
                    "defaultFilterOperation",
                    "defaultFilterOperations",
                    "visibleIndex",
                    "serializationFormat",
                    "resizedCallbacks"
                ].indexOf(propertyName) !== -1) {
                    delete this[propertyName];
                }
            }
        }
    });
    return processedColumns;
};

var setupModule = function(moduleNames) {
    executeAsyncMock.setup();

    dataGridMocks.setupDataGridModules(this, ['columns', 'data', 'selection', 'editing', 'filterRow', 'masterDetail'].concat(moduleNames || []), {
        controllers: {
            data: new dataGridMocks.MockDataController({ items: [] })
        }
    });

    this.applyOptions = function(options) {
        $.extend(this.options, options);
        this.columnsController.init();
        this.selectionController.init();
        this.editingController.init();
    };

    this.getColumns = function(parameterNames) {
        return processColumnsForCompare($.extend(true, [], this.columnsController.getColumns()), parameterNames);
    };
    this.getVisibleColumns = function(parameterNames) {
        return processColumnsForCompare(this.columnsController.getVisibleColumns(), parameterNames);
    };
};

var teardownModule = function() {
    executeAsyncMock.teardown();
    this.dispose();
};

QUnit.module("initialization from options", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("No initialization", function(assert) {
    assert.deepEqual(this.getColumns(), []);
    assert.strictEqual(this.columnsController.isInitialized(), false);
});

QUnit.test("Initialize from options with field names", function(assert) {
    this.applyOptions({
        columns: ['TestField1', 'TestField2', 'TestField3']
    });

    assert.ok(this.columnsController.isInitialized());
    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.deepEqual(processColumnsForCompare(visibleColumns), [
        { index: 0, visible: true, allowFiltering: true, dataField: 'TestField1', caption: 'Test Field 1' },
        { index: 1, visible: true, allowFiltering: true, dataField: 'TestField2', caption: 'Test Field 2' },
        { index: 2, visible: true, allowFiltering: true, dataField: 'TestField3', caption: 'Test Field 3' }
    ]);

    assert.strictEqual(visibleColumns[0].index, 0);
    assert.strictEqual(visibleColumns[1].index, 1);
    assert.strictEqual(visibleColumns[2].index, 2);
});

// T251170
QUnit.test("Initialize from options with field names and visible indexes", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField1', visibleIndex: 11 }, { dataField: 'TestField2', visibleIndex: 1 }, { dataField: 'TestField3' }, { dataField: 'TestField4', visibleIndex: 3 }]
    });

    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.strictEqual(visibleColumns.length, 4);
    assert.strictEqual(visibleColumns[0].dataField, "TestField2");
    assert.strictEqual(visibleColumns[1].dataField, "TestField4");
    assert.strictEqual(visibleColumns[2].dataField, "TestField1");
    assert.strictEqual(visibleColumns[3].dataField, "TestField3");
});

QUnit.test("Boolean column initialize with correct 'showEditorAlways' option", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', dataType: 'boolean', showEditorAlways: false },
            { dataField: 'TestField2', dataType: 'boolean' },
            { dataField: 'TestField3', showEditorAlways: true }
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.deepEqual(processColumnsForCompare(visibleColumns), [
        { index: 0, visible: true, showEditorAlways: false, dataType: 'boolean', allowFiltering: true, dataField: 'TestField1', caption: 'Test Field 1', alignment: 'center' },
        { index: 1, visible: true, showEditorAlways: true, dataType: 'boolean', allowFiltering: true, dataField: 'TestField2', caption: 'Test Field 2', alignment: 'center' },
        { index: 2, visible: true, showEditorAlways: true, allowFiltering: true, dataField: 'TestField3', caption: 'Test Field 3' }
    ]);
});

QUnit.test("Boolean columns initialize with correct 'showEditorAlways' option when cellTemplate is defined", function(assert) {
    this.applyOptions({
        columns: [{
            dataField: 'TestField1',
            dataType: 'boolean',
            showEditorAlways: false,
            cellTemplate: function(container, options) {
                container.text("custom");
            }
        },
        {
            dataField: 'TestField2',
            dataType: 'boolean',
            cellTemplate: function(container, options) {
                container.text("custom");
            }
        },
            'TestField3'
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.deepEqual(processColumnsForCompare(visibleColumns), [
        { index: 0, visible: true, showEditorAlways: false, dataType: 'boolean', allowFiltering: true, dataField: 'TestField1', caption: 'Test Field 1', alignment: 'center' },
        { index: 1, visible: true, showEditorAlways: false, dataType: 'boolean', allowFiltering: true, dataField: 'TestField2', caption: 'Test Field 2', alignment: 'center' },
        { index: 2, visible: true, allowFiltering: true, dataField: "TestField3", caption: "Test Field 3" }
    ]);
});

QUnit.test("Initialize from options with objects", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField1', caption: 'Custom Title 1' }, { dataField: 'TestField2', caption: 'Custom Title 2', visible: false, allowSorting: false, allowFiltering: false }]
    });

    assert.ok(this.columnsController.isInitialized());
    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, allowFiltering: true, dataField: 'TestField1', caption: 'Custom Title 1' },
        { index: 1, visible: false, allowFiltering: false, dataField: 'TestField2', caption: 'Custom Title 2', allowSorting: false }
    ]);
});

QUnit.test("Initialization group indexes", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField1', groupIndex: 6 }, { dataField: 'TestField2', groupIndex: -1 }, { dataField: 'TestField3' }, { dataField: 'TestField4', grouped: true }, { dataField: 'TestField5', groupIndex: 1 }, { dataField: 'TestField6', grouped: true }, { dataField: 'TestField7', groupIndex: 1 }]
    });

    assert.ok(this.columnsController.isInitialized());
    var columns = this.getColumns();

    assert.strictEqual(columns.length, 7);
    assert.strictEqual(columns[0].groupIndex, 2, 'group index normalized from 6 to first groupIndex when not used');
    assert.strictEqual(columns[1].groupIndex, undefined, 'group index -1 reset to undefined');
    assert.strictEqual(columns[2].groupIndex, undefined, 'group index not defined');
    assert.strictEqual(columns[3].groupIndex, 3, 'grouped parameter transform to groupIndex after columns with original groupIndex');
    assert.strictEqual(columns[4].groupIndex, 0, 'group index 1 normalized to 0');
    assert.strictEqual(columns[5].groupIndex, 4, 'grouped parameter transform to groupIndex in order of defined columns');
    assert.strictEqual(columns[6].groupIndex, 1, 'group index normalized to groupIndex in order of defined columns');
});

QUnit.test("Initialization sort indexes", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField1', groupIndex: 6, sortIndex: 1, sortOrder: 'asc' }, { dataField: 'TestField2', sortIndex: -1, sortOrder: 'desc' }, { dataField: 'TestField3', sortIndex: 0, sortOrder: 'asc' }, { dataField: 'TestField4', sortIndex: 5, sortOrder: 'desc' }, { dataField: 'TestField5', sortIndex: 0, sortOrder: 'asc' }, { dataField: 'TestField6' }, { dataField: 'TestField7', sortOrder: 'desc' }]
    });

    assert.ok(this.columnsController.isInitialized());
    var columns = this.getColumns();

    assert.strictEqual(columns.length, 7);
    assert.strictEqual(columns[0].sortIndex, 2, 'sort index normalized from 1 to 2 because two columns with sort index 0 exists');
    assert.strictEqual(columns[1].sortIndex, 4, 'sort index -1 normalized to 4 (first sortIndex when not used) because sortOrder is defined');
    assert.strictEqual(columns[2].sortIndex, 0, 'sort index 0');
    assert.strictEqual(columns[3].sortIndex, 3, 'sort index 5 normalized to 3 (first sortIndex when not used)');
    assert.strictEqual(columns[4].sortIndex, 1, 'sort index 0 normalized to 1 because column with sort index 0 exists already');
    assert.strictEqual(columns[5].sortIndex, undefined, 'no sortIndex because no sortOrder');
    assert.strictEqual(columns[6].sortIndex, 5, 'sort index set ot first sortIndex when not used because sortOrder is defined');
});

QUnit.test("Initialization css class", function(assert) {
    // arrange, act
    this.applyOptions({
        columns: [{ dataField: 'TestField1', cssClass: 'customCssClass1' }, { dataField: 'TestField2', }, { dataField: 'TestField3', cssClass: 'customCssClass2', groupIndex: 0 }]
    });

    // assert
    assert.ok(this.columnsController.isInitialized(), 'initialization');
    var columns = this.getColumns();

    assert.equal(columns.length, 3, 'count columns');
    assert.strictEqual(columns[0].cssClass, 'customCssClass1', 'has custom class');
    assert.equal(columns[1].cssClass, undefined, 'not has custom class');
    assert.strictEqual(columns[2].cssClass, 'customCssClass2', 'not has custom class');
});

QUnit.test("Initialize resizedCallbacks", function(assert) {
    var resizedColumn,
        resizedWidth;
    this.applyOptions({
        columns: [{ dataField: 'TestField1', resized: function(width) { resizedColumn = this; resizedWidth = width; } }]
    });

    assert.ok(this.columnsController.isInitialized());
    var visibleColumns = this.columnsController.getVisibleColumns();

    // act
    visibleColumns[0].resizedCallbacks.fire(110);

    // assert
    assert.strictEqual(resizedColumn.dataField, 'TestField1');
    assert.strictEqual(resizedWidth, 110);
});


QUnit.test("Initialize from options without caption", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField1' }, { dataField: 'TestField2' }]
    });

    assert.ok(this.columnsController.isInitialized());
    var columns = this.getColumns();
    assert.ok(columns.length, 2);
    assert.equal(columns[0].caption, 'Test Field 1');
    assert.equal(columns[1].caption, 'Test Field 2');
});

QUnit.test("Initialize from options without dataField", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField1' }, { visible: true }]
    });

    assert.ok(this.columnsController.isInitialized());
    assert.ok(this.columnsController.getColumns().length, 1);
    assert.equal(this.columnsController.getColumns()[0].dataField, 'TestField1');
});

QUnit.test("generate caption from dataField", function(assert) {
    this.applyOptions({
        columns: ["name", "phoneNumber", "ID", "cardID", "field1", "field_2", "order_ID", "Address.City"]
    });

    assert.equal(this.columnsController.getColumns().length, 8);
    assert.equal(this.columnsController.getColumns()[0].caption, 'Name');
    assert.equal(this.columnsController.getColumns()[1].caption, 'Phone Number');
    assert.equal(this.columnsController.getColumns()[2].caption, 'ID');
    assert.equal(this.columnsController.getColumns()[3].caption, 'Card ID');
    assert.equal(this.columnsController.getColumns()[4].caption, 'Field 1');
    assert.equal(this.columnsController.getColumns()[5].caption, 'Field 2');
    assert.equal(this.columnsController.getColumns()[6].caption, 'Order ID');
    assert.equal(this.columnsController.getColumns()[7].caption, 'Address City');
});

QUnit.test("getColumns not generate copies", function(assert) {
    this.applyOptions({
        columns: ["Field1", "Field2"]
    });

    var columns1 = this.columnsController.getColumns();
    var columns2 = this.columnsController.getColumns();

    QUnit.assert.strictEqual(columns1, columns2);
    assert.deepEqual(columns1, columns2);
});

QUnit.test("getVisibleColumns filter invisible columns", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1', visible: false },
            { dataField: 'TestField2', caption: 'Custom Title 2', allowSorting: false }
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    assert.deepEqual(processColumnsForCompare(this.columnsController.getVisibleColumns()), [
        { index: 1, visible: true, allowFiltering: true, dataField: 'TestField2', caption: 'Custom Title 2', allowSorting: false }
    ]);
});

QUnit.test("getVisibleColumns for one grouped column", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', groupIndex: 1 },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.strictEqual(visibleColumns.length, 3);
    assert.strictEqual(visibleColumns[0].dataField, 'TestField2');
    assert.strictEqual(visibleColumns[0].width, 'auto');
    assert.strictEqual(visibleColumns[0].cssClass, 'dx-command-expand');
    assert.strictEqual(visibleColumns[0].allowGrouping, false);
    assert.strictEqual(visibleColumns[0].allowSorting, false);
    assert.strictEqual(visibleColumns[0].allowResizing, false);
    assert.strictEqual(visibleColumns[0].allowReordering, false);
    assert.strictEqual(visibleColumns[0].allowHiding, false);
    // T165142
    assert.strictEqual(visibleColumns[0].allowEditing, false);

    assert.equal(visibleColumns[1].dataField, 'TestField1');
    assert.equal(visibleColumns[2].dataField, 'TestField3');
});

QUnit.test("getVisibleColumns for grouped column and select column", function(assert) {
    this.applyOptions({
        selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', groupIndex: 1 },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
        ]
    });

    assert.ok(this.columnsController.isInitialized());

    // act
    this.selectionController.startSelectionWithCheckboxes();
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(visibleColumns.length, 4);
    assert.equal(visibleColumns[0].command, 'select');
    assert.equal(visibleColumns[1].dataField, 'TestField2');
    assert.equal(visibleColumns[1].width, 'auto');
    assert.equal(visibleColumns[1].cssClass, 'dx-command-expand');
    assert.equal(visibleColumns[2].dataField, 'TestField1');
    assert.equal(visibleColumns[3].dataField, 'TestField3');
});

QUnit.test("getVisibleColumns for one grouped column when column width defined", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', groupIndex: 1, width: 50 },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(visibleColumns.length, 3);
    assert.equal(visibleColumns[0].dataField, 'TestField2');
    assert.equal(visibleColumns[0].width, 'auto');
    assert.equal(visibleColumns[0].cssClass, 'dx-command-expand');
    assert.equal(visibleColumns[1].dataField, 'TestField1');
    assert.equal(visibleColumns[2].dataField, 'TestField3');
});

QUnit.test("getVisibleColumns for several grouped column", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', groupIndex: 1 },
            { dataField: 'TestField3', caption: 'Custom Title 3', groupIndex: 0 },
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(visibleColumns.length, 3);
    assert.equal(visibleColumns[0].dataField, 'TestField3');
    assert.equal(visibleColumns[0].width, 'auto');
    assert.equal(visibleColumns[0].cssClass, 'dx-command-expand');
    assert.equal(visibleColumns[1].dataField, 'TestField2');
    assert.equal(visibleColumns[1].width, 'auto');
    assert.equal(visibleColumns[1].cssClass, 'dx-command-expand');
    assert.equal(visibleColumns[2].dataField, 'TestField1');
});


QUnit.test("getVisibleColumns for several grouped column when showWhenGrouped defined", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', groupIndex: 1 },
            { dataField: 'TestField3', caption: 'Custom Title 3', groupIndex: 0, showWhenGrouped: true },
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.strictEqual(visibleColumns.length, 4);
    assert.strictEqual(visibleColumns[0].dataField, 'TestField3');
    assert.strictEqual(visibleColumns[0].width, 'auto');
    assert.strictEqual(visibleColumns[0].cssClass, 'dx-command-expand');
    assert.strictEqual(visibleColumns[1].dataField, 'TestField2');
    assert.strictEqual(visibleColumns[1].width, 'auto');
    assert.strictEqual(visibleColumns[1].cssClass, 'dx-command-expand');
    assert.strictEqual(visibleColumns[2].dataField, 'TestField1');
    assert.strictEqual(visibleColumns[3].dataField, 'TestField3');
    assert.strictEqual(visibleColumns[3].width, undefined);
    assert.strictEqual(visibleColumns[3].cssClass, undefined);
});

QUnit.test("getVisibleColumns for several grouped column with same groupIndexes", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', groupIndex: 1 },
            { dataField: 'TestField3', caption: 'Custom Title 3', groupIndex: 0 },
            { dataField: 'TestField4', caption: 'Custom Title 4', groupIndex: 0 },
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(visibleColumns.length, 4);
    assert.equal(visibleColumns[0].dataField, 'TestField3');
    assert.equal(visibleColumns[1].dataField, 'TestField4');
    assert.equal(visibleColumns[2].dataField, 'TestField2');
    assert.equal(visibleColumns[3].dataField, 'TestField1');
});

// T144086
QUnit.test("getVisibleColumns for several not visible grouped column", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', groupIndex: 1, visible: false },
            { dataField: 'TestField3', caption: 'Custom Title 3', groupIndex: 0, visible: false },
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(visibleColumns.length, 3);
    assert.equal(visibleColumns[0].dataField, 'TestField3');
    assert.equal(visibleColumns[0].width, 'auto');
    assert.equal(visibleColumns[1].dataField, 'TestField2');
    assert.equal(visibleColumns[1].width, 'auto');
    assert.equal(visibleColumns[2].dataField, 'TestField1');
});

QUnit.test("getVisibleColumns generate copies", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField1', caption: 'Custom Title 1', visible: false }, { dataField: 'TestField2', caption: 'Custom Title 2' }]
    });

    assert.ok(this.columnsController.isInitialized());
    var visibleColumns1 = this.columnsController.getVisibleColumns();
    this.columnsController.columnOption(0, { visible: true });
    this.columnsController.columnOption(0, { visible: false });
    var visibleColumns2 = this.columnsController.getVisibleColumns();

    assert.strictEqual(visibleColumns1.length, 1);

    QUnit.assert.notStrictEqual(visibleColumns1, visibleColumns2);
    assert.deepEqual(visibleColumns1, visibleColumns2);

    QUnit.assert.notStrictEqual(visibleColumns1[0], visibleColumns2[0]);
    assert.deepEqual(visibleColumns1[0], visibleColumns2[0]);
});

QUnit.test("getVisibleColumns when all columns grouped", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', headerCaption: 'Custom Title 1', groupIndex: 0 },
            { dataField: 'TestField2', headerCaption: 'Custom Title 2', groupIndex: 1 },
            { dataField: 'TestField3', headerCaption: 'Custom Title 3', groupIndex: 2 },
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(visibleColumns.length, 4, 'count visible columns');
    assert.strictEqual(visibleColumns[0].dataField, 'TestField1', 'dataField column 1');
    assert.strictEqual(visibleColumns[1].dataField, 'TestField2', 'dataField column 2');
    assert.strictEqual(visibleColumns[2].dataField, 'TestField3', 'dataField column 3');
    assert.strictEqual(visibleColumns[3].command, 'empty', 'command column 4');
});

// B254503
QUnit.test("getVisibleColumns when not has columns", function(assert) {
    // arrange
    this.applyOptions({
        columns: []
    });

    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), 'columnsController is initialized');
    assert.ok(!visibleColumns.length, 'not has columns');
});

QUnit.test("calculateCellValue for column with dataField", function(assert) {
    this.applyOptions({
        columns: [{ dataField: "Name" }, { dataField: "Address.City" }]
    });

    assert.ok(this.columnsController.isInitialized());

    var columns = this.columnsController.getColumns();

    assert.strictEqual(columns.length, 2);
    assert.strictEqual(columns[0].calculateCellValue({}), undefined, 'simple dataField value undefined');
    assert.strictEqual(columns[1].calculateCellValue({}), undefined, 'complex dataField value undefined');

    assert.strictEqual(columns[0].calculateCellValue({ Name: 'Alex' }), 'Alex', 'simple dataField value');
    assert.strictEqual(columns[1].calculateCellValue({ Address: { City: 'London' } }), 'London', 'complex dataField value');
});

QUnit.test("Save default calculateCellValue when column with custom calculateCellValue", function(assert) {
    this.applyOptions({
        columns: [{ dataField: "Name" }, { dataField: "Address.City", calculateCellValue: function(data) { return "test-" + this.defaultCalculateCellValue(data); } }]
    });

    assert.ok(this.columnsController.isInitialized());

    var columns = this.columnsController.getColumns();

    assert.strictEqual(columns.length, 2);
    assert.strictEqual(columns[0].calculateCellValue({ Name: 'Alex' }), 'Alex', 'calculation cell value of the first column');
    assert.strictEqual(columns[0].calculateCellValue, columns[0].defaultCalculateCellValue, 'defaultCalculateCellValue generated when no user option');
    assert.ok(columns[0].setCellValue, 'setCellValue exists');
    assert.strictEqual(columns[0].setCellValue, columns[0].defaultSetCellValue, 'defaultSetCellValue generated when no user option');
    assert.strictEqual(columns[1].calculateCellValue({ Address: { City: 'London' } }), 'test-London', 'custom calculation cell value of the second column');
    assert.ok(isFunction(columns[1]["defaultCalculateCellValue"]), 'has defaultCalculationCellValue in second column');
    assert.strictEqual(columns[1].defaultCalculateCellValue({ Address: { City: 'London' } }), 'London', 'default calculation cell value of the second column');
});

QUnit.test("setCellValue for column with dataField", function(assert) {
    this.applyOptions({
        columns: [{ dataField: "Name" }, { dataField: "Address.City" }]
    });

    assert.ok(this.columnsController.isInitialized());

    var columns = this.columnsController.getColumns();
    var data = {};

    // act
    columns[0].setCellValue(data, "Alex");
    columns[1].setCellValue(data, "London");

    // assert
    assert.deepEqual(data, { Name: 'Alex', Address: { City: 'London' } }, "data after setCellValue");
});


QUnit.test("getVisibleColumns with hidden columns", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', headerCaption: 'Custom Title 1' },
            { dataField: 'TestField2', headerCaption: 'Custom Title 2', visible: false },
            { dataField: 'TestField3', headerCaption: 'Custom Title 3', visible: false },
        ]
    });

    // act
    var visibleColumns = this.columnsController.getVisibleColumns();
    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(visibleColumns.length, 1, "count hidden columns");
    assert.strictEqual(visibleColumns[0].dataField, "TestField1", "dataField column");
});

QUnit.test("getVisibleColumns when master detail enabled", function(assert) {
    this.applyOptions({
        masterDetail: {
            enabled: true
        },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2' },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.strictEqual(visibleColumns.length, 4);
    assert.strictEqual(visibleColumns[0].command, 'expand');
    assert.strictEqual(visibleColumns[0].width, 'auto');
    assert.strictEqual(visibleColumns[0].cssClass, 'dx-command-expand');
    assert.strictEqual(visibleColumns[0].groupIndex, undefined);
    assert.strictEqual(visibleColumns[1].dataField, 'TestField1');
    assert.strictEqual(visibleColumns[2].dataField, 'TestField2');
    assert.strictEqual(visibleColumns[3].dataField, 'TestField3');
});

QUnit.test("getVisibleColumns when master detail enabled and grouped columns exists", function(assert) {
    this.applyOptions({
        masterDetail: {
            enabled: true
        },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', groupIndex: 0 },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
        ]
    });

    assert.ok(this.columnsController.isInitialized());
    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.strictEqual(visibleColumns.length, 4);
    assert.strictEqual(visibleColumns[0].command, 'expand');
    assert.strictEqual(visibleColumns[0].width, 'auto');
    assert.strictEqual(visibleColumns[0].dataField, 'TestField2');
    assert.strictEqual(visibleColumns[0].groupIndex, 0);
    assert.strictEqual(visibleColumns[1].command, 'expand');
    assert.strictEqual(visibleColumns[1].width, 'auto');
    assert.strictEqual(visibleColumns[1].groupIndex, undefined);
    assert.strictEqual(visibleColumns[2].dataField, 'TestField1');
    assert.strictEqual(visibleColumns[3].dataField, 'TestField3');
});

QUnit.test("getVisibleColumns when has a fixed columns and columnFixing is enabled", function(assert) {
    // arrange
    this.applyOptions({
        columnFixing: {
            enabled: true
        },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', fixed: true, fixedPosition: "right" },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
            { dataField: 'TestField4', caption: 'Custom Title 4', fixed: true },
            { dataField: 'TestField5', caption: 'Custom Title 5' },
        ]
    });

    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(visibleColumns.length, 5, "count visible columns");
    assert.strictEqual(visibleColumns[0].dataField, "TestField4", "dataField column");
    assert.strictEqual(visibleColumns[1].dataField, "TestField1", "dataField column");
    assert.strictEqual(visibleColumns[2].dataField, "TestField3", "dataField column");
    assert.strictEqual(visibleColumns[3].dataField, "TestField5", "dataField column");
    assert.strictEqual(visibleColumns[4].dataField, "TestField2", "dataField column");
});

// T237901, T243123
QUnit.test("getVisibleColumns when has a fixed columns and columnFixing is disabled", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', fixed: true, fixedPosition: "right" },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
            { dataField: 'TestField4', caption: 'Custom Title 4', fixed: true },
            { dataField: 'TestField5', caption: 'Custom Title 5' },
        ]
    });

    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(visibleColumns.length, 5, "count visible columns");
    assert.strictEqual(visibleColumns[0].dataField, "TestField4", "dataField column");
    assert.strictEqual(visibleColumns[1].dataField, "TestField1", "dataField column");
    assert.strictEqual(visibleColumns[2].dataField, "TestField3", "dataField column");
    assert.strictEqual(visibleColumns[3].dataField, "TestField5", "dataField column");
    assert.strictEqual(visibleColumns[4].dataField, "TestField2", "dataField column");
});

QUnit.test("getFixedColumns", function(assert) {
    // arrange
    this.applyOptions({
        columnFixing: {
            enabled: true
        },
        editing: {
            allowUpdating: true
        },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', fixed: true, fixedPosition: "right" },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
            { dataField: 'TestField4', caption: 'Custom Title 4', fixed: true },
            { dataField: 'TestField5', caption: 'Custom Title 5' }
        ]
    });

    // act
    var fixedColumns = this.columnsController.getFixedColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(fixedColumns.length, 4, "count visible columns");
    assert.strictEqual(fixedColumns[0].dataField, "TestField4", "dataField column");
    assert.deepEqual(fixedColumns[1], { command: "transparent", colspan: 3 }, "transparent column");
    assert.strictEqual(fixedColumns[2].dataField, "TestField2", "dataField column");
    assert.strictEqual(fixedColumns[3].command, "edit", "edit column");
});

// T240985
QUnit.test("getFixedColumns with rtl mode", function(assert) {
    // arrange
    this.applyOptions({
        rtlEnabled: true,
        columnFixing: {
            enabled: true
        },
        editing: {
            allowUpdating: true
        },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', fixed: true, fixedPosition: "right" },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
            { dataField: 'TestField4', caption: 'Custom Title 4', fixed: true },
            { dataField: 'TestField5', caption: 'Custom Title 5' }
        ]
    });

    // act
    var fixedColumns = this.columnsController.getFixedColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(fixedColumns.length, 4, "count visible columns");
    assert.strictEqual(fixedColumns[0].dataField, "TestField2", "dataField column");
    assert.deepEqual(fixedColumns[1], { command: "transparent", colspan: 3 }, "transparent column");
    assert.strictEqual(fixedColumns[2].dataField, "TestField4", "dataField column");
    assert.strictEqual(fixedColumns[3].command, "edit", "edit column");
});

// T243123
QUnit.test("getFixedColumns when columnFixing disabled", function(assert) {
    // arrange
    this.applyOptions({
        columnFixing: {
            enabled: false
        },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', fixed: true, fixedPosition: "right" },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
            { dataField: 'TestField4', caption: 'Custom Title 4', fixed: true },
            { dataField: 'TestField5', caption: 'Custom Title 5' }
        ]
    });

    // act
    var fixedColumns = this.columnsController.getFixedColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(fixedColumns.length, 3, "count fixed columns");
    assert.strictEqual(fixedColumns[0].dataField, "TestField4", "dataField column");
    assert.strictEqual(fixedColumns[1].command, "transparent", "transparent column");
    assert.strictEqual(fixedColumns[2].dataField, "TestField2", "dataField column");
});

QUnit.test("getFixedColumns when no fixed and command columns", function(assert) {
    // arrange
    this.applyOptions({
        columnFixing: {
            enabled: true
        },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', fixedPosition: "right" },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
            { dataField: 'TestField4', caption: 'Custom Title 4' },
            { dataField: 'TestField5', caption: 'Custom Title 5' }
        ]
    });

    // act
    var fixedColumns = this.columnsController.getFixedColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(fixedColumns.length, 0, "count visible columns");
});

// T303794
QUnit.test("getFixedColumns when only fixed column", function(assert) {
    // arrange
    var fixedColumns;

    this.applyOptions({
        columnFixing: {
            enabled: true
        },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1', fixed: true }
        ]
    });

    // act
    fixedColumns = this.columnsController.getFixedColumns();

    // assert
    assert.equal(fixedColumns.length, 0, "count fixed columns");
});

// T371512
QUnit.test("Setting fixed column with fixedPosition 'left' when there is fixed column without fixedPosition", function(assert) {
    // arrange
    this.applyOptions({
        columnFixing: {
            enabled: true
        },
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', fixed: true },
            { dataField: 'TestField3', caption: 'Custom Title 3' },
            { dataField: 'TestField4', caption: 'Custom Title 4' },
            { dataField: 'TestField5', caption: 'Custom Title 5' }
        ]
    });

    var fixedColumns = this.columnsController.getFixedColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(fixedColumns.length, 2, "count fixed columns");
    assert.strictEqual(fixedColumns[0].dataField, "TestField2", "first fixed cell");
    assert.strictEqual(fixedColumns[1].command, "transparent", "second fixed cell");

    // act
    this.columnOption(2, { fixed: true, fixedPosition: "left" });

    // assert
    fixedColumns = this.columnsController.getFixedColumns();
    assert.equal(fixedColumns.length, 3, "count fixed columns");
    assert.strictEqual(fixedColumns[0].dataField, "TestField2", "first fixed cell");
    assert.strictEqual(fixedColumns[1].dataField, "TestField3", "second fixed cell");
    assert.strictEqual(fixedColumns[2].command, "transparent", "third fixed cell");
});

QUnit.test("getInvisibleColumns", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', headerCaption: 'Custom Title 1' },
            { dataField: 'TestField2', headerCaption: 'Custom Title 2', visible: false },
            { dataField: 'TestField3', headerCaption: 'Custom Title 3', visible: false },
        ]
    });

    // act
    var hiddenColumns = this.columnsController.getInvisibleColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(hiddenColumns.length, 2, "count hidden columns");
    assert.strictEqual(hiddenColumns[0].dataField, "TestField2", "dataField column");
    assert.strictEqual(hiddenColumns[1].dataField, "TestField3", "dataField column");
});

// T217829
QUnit.test("getChooserColumns", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', headerCaption: 'Custom Title 1' },
            { dataField: 'TestField2', headerCaption: 'Custom Title 2', visible: false },
            { dataField: 'TestField3', headerCaption: 'Custom Title 3', visible: false, showInColumnChooser: false },
            { dataField: 'TestField4', headerCaption: 'Custom Title 4', visible: false },
        ]
    });

    // act
    var chooserColumns = this.columnsController.getChooserColumns();

    // assert
    assert.ok(this.columnsController.isInitialized(), "initialization");
    assert.equal(chooserColumns.length, 2, "count chooser columns");
    assert.strictEqual(chooserColumns[0].dataField, "TestField2", "dataField column");
    assert.strictEqual(chooserColumns[1].dataField, "TestField4", "dataField column");
});

QUnit.test("column with calculateCellValue", function(assert) {
    var calculateCellValue = function() { return 1; };
    this.applyOptions({
        columns: [{ calculateCellValue: calculateCellValue }]
    });

    assert.ok(this.columnsController.isInitialized());

    assert.strictEqual(this.columnsController.getColumns().length, 1);
    assert.deepEqual(processColumnsForCompare(this.columnsController.getColumns())[0], {
        index: 0,
        visible: true,
        allowFiltering: false,
        allowGrouping: false,
        allowSorting: false
    });
    assert.strictEqual(this.columnsController.getColumns()[0].calculateCellValue, calculateCellValue);
});

QUnit.test("column with empty options", function(assert) {
    this.applyOptions({
        columns: [{}]
    });

    assert.ok(this.columnsController.isInitialized());

    assert.strictEqual(this.columnsController.getColumns().length, 1);
    assert.deepEqual(processColumnsForCompare(this.columnsController.getColumns())[0], {
        index: 0,
        visible: true,
        allowFiltering: false,
        allowSorting: false,
        allowGrouping: false
    });
    assert.ok(this.columnsController.getColumns()[0].calculateCellValue, 'calculateCellValue exists');
    assert.strictEqual(this.columnsController.getColumns()[0].calculateCellValue(), null, 'cell value of empty column');
});

QUnit.test("column with calculateCellValue and calculateFilterExpression", function(assert) {
    var calculateCellValue = function() { return 1; };
    var calculateFilterExpression = function() { };
    this.applyOptions({
        columns: [{ calculateCellValue: calculateCellValue, calculateFilterExpression: calculateFilterExpression }]
    });

    assert.ok(this.columnsController.isInitialized());

    assert.strictEqual(this.columnsController.getColumns().length, 1);
    var columns = this.columnsController.getColumns();
    assert.deepEqual(processColumnsForCompare(columns)[0], {
        index: 0,
        visible: true,
        allowFiltering: true,
        allowSorting: false,
        allowGrouping: false
    });
    assert.strictEqual(columns[0].calculateCellValue, calculateCellValue);
    assert.strictEqual(columns[0].calculateFilterExpression, calculateFilterExpression);
});

QUnit.test("column with calculateCellValue and calculateFilterExpression and disabled allowFiltering", function(assert) {
    var calculateCellValue = function() { return 1; };
    var calculateFilterExpression = function() { };
    this.applyOptions({
        columns: [{ calculateCellValue: calculateCellValue, calculateFilterExpression: calculateFilterExpression, allowFiltering: false }]
    });

    assert.ok(this.columnsController.isInitialized());

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns.length, 1);
    assert.deepEqual(processColumnsForCompare(columns)[0], {
        index: 0,
        visible: true,
        allowFiltering: false,
        allowSorting: false,
        allowGrouping: false
    });
    assert.strictEqual(columns[0].calculateCellValue, calculateCellValue);
    assert.strictEqual(columns[0].calculateFilterExpression, calculateFilterExpression);
});

QUnit.test("calculateFilterExpression for column with number dataField", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'number' }]
    });

    var column = this.columnsController.getColumns()[0];
    assert.ok(column);
    assert.ok(column.calculateFilterExpression);
    // deepEqual(column.calculateFilterExpression('a'), null);
    assert.deepEqual(column.calculateFilterExpression(201), ['TestField', '=', 201]);
    assert.deepEqual(column.calculateFilterExpression(1.2), ['TestField', '=', 1.2]);
    assert.deepEqual(column.calculateFilterExpression(12, '>='), ['TestField', '>=', 12]);
});

QUnit.test("calculateFilterExpression for column with lookup and string dataField", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string', lookup: {} }]
    });

    var column = this.columnsController.getColumns()[0];
    assert.ok(column);
    assert.ok(column.calculateFilterExpression);
    assert.deepEqual(column.calculateFilterExpression('str'), ['TestField', '=', 'str']);
    assert.deepEqual(column.calculateFilterExpression('str', '>='), ['TestField', '>=', 'str']);
    assert.deepEqual(column.calculateFilterExpression('str', undefined, "search"), ['TestField', '=', 'str']);
});

QUnit.test("calculateFilterExpression for unbound column", function(assert) {
    var calculateCellValue = function(data) { return data.TestField; };
    this.applyOptions({
        columns: [{ dataType: 'string', calculateCellValue: calculateCellValue }]
    });

    var column = this.columnsController.getColumns()[0];
    var selector = column.selector;

    assert.ok(column);
    assert.ok(column.calculateFilterExpression, "calculateFilterExpression is defined");
    assert.ok(!column.allowFiltering, "allowFiltering false by default");
    assert.deepEqual(column.calculateFilterExpression('str'), [selector, 'contains', 'str']);
    assert.deepEqual(column.calculateFilterExpression('str', '='), [selector, '=', 'str']);
    assert.deepEqual(column.calculateFilterExpression('str', undefined, "search"), [selector, 'contains', 'str']);
});

QUnit.test("calculateFilterExpression for column with lookup and calculateDisplayValue", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string', lookup: {}, calculateDisplayValue: "TestDisplayField" }]
    });

    var column = this.columnsController.getColumns()[0];
    assert.ok(column);
    assert.ok(column.calculateFilterExpression);
    assert.deepEqual(column.calculateFilterExpression('str'), ['TestField', '=', 'str']);
    assert.deepEqual(column.calculateFilterExpression('str', '>='), ['TestField', '>=', 'str']);
    assert.deepEqual(column.calculateFilterExpression('str', undefined, "search"), ['TestDisplayField', 'contains', 'str']);
});

QUnit.test("calculateFilterExpression for column with date dataField", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'date' }]
    });

    var date = new Date(2012, 4, 11, 8, 30),
        dateStart = new Date(2012, 4, 11),
        dateEnd = new Date(2012, 4, 12),
        column = this.columnsController.getColumns()[0];

    // act, assert
    assert.ok(column);
    assert.ok(column.calculateFilterExpression);
    // T241043
    assert.deepEqual(column.calculateFilterExpression(null), ["TestField", "=", null]);

    assert.deepEqual(column.calculateFilterExpression(date), [['TestField', '>=', dateStart], "and", ['TestField', '<', dateEnd]]);
    assert.deepEqual(column.calculateFilterExpression(date, '='), [['TestField', '>=', dateStart], "and", ['TestField', '<', dateEnd]]);
    assert.deepEqual(column.calculateFilterExpression(date, '<>'), [['TestField', '<', dateStart], 'or', ['TestField', '>=', dateEnd]]);
    assert.deepEqual(column.calculateFilterExpression(date, '>'), ['TestField', '>=', dateEnd]);
    assert.deepEqual(column.calculateFilterExpression(date, '<'), ['TestField', '<', dateStart]);
    assert.deepEqual(column.calculateFilterExpression(date, '<='), ['TestField', '<', dateEnd]);
    assert.deepEqual(column.calculateFilterExpression(date, '>='), ['TestField', '>=', dateStart]);
});

// T460175
QUnit.test("calculateFilterExpression for column with dataType is date when filterOperation is 'between'", function(assert) {
    // arrange
    var column,
        dateStart,
        dateEnd;

    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'date', selectedFilterOperation: "between" }]
    });
    column = this.columnsController.getColumns()[0];

    // act, assert
    dateStart = new Date(2016, 7, 1);
    dateEnd = new Date(2016, 7, 5);
    assert.deepEqual(column.calculateFilterExpression([dateStart, dateEnd], "between"), [
        ['TestField', '>=', dateStart],
        "and",
        ['TestField', '<', new Date(2016, 7, 6)]
    ], "calculate filter expression for end date without time");

    dateStart = new Date(2016, 7, 1, 13, 30, 0);
    dateEnd = new Date(2016, 7, 5, 15, 40, 15);
    assert.deepEqual(column.calculateFilterExpression([dateStart, dateEnd], "between"), [
        ['TestField', '>=', dateStart],
        "and",
        ['TestField', '<=', dateEnd]
    ], "calculate filter expression for end date with time");
});

QUnit.test("calculateFilterExpression for column with dataType is 'datetime'", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'datetime' }]
    });

    var date = new Date(2012, 4, 11, 8, 30),
        dateStart = new Date(2012, 4, 11, 8, 30),
        dateEnd = new Date(2012, 4, 11, 8, 31),
        column = this.columnsController.getColumns()[0];

    // act, assert
    assert.ok(column);
    assert.ok(column.calculateFilterExpression);
    // T241043
    assert.deepEqual(column.calculateFilterExpression(null), ["TestField", "=", null]);

    assert.deepEqual(column.calculateFilterExpression(date), [['TestField', '>=', dateStart], "and", ['TestField', '<', dateEnd]]);
    assert.deepEqual(column.calculateFilterExpression(date, '='), [['TestField', '>=', dateStart], "and", ['TestField', '<', dateEnd]]);
    assert.deepEqual(column.calculateFilterExpression(date, '<>'), [['TestField', '<', dateStart], 'or', ['TestField', '>=', dateEnd]]);
    assert.deepEqual(column.calculateFilterExpression(date, '>'), ['TestField', '>=', dateEnd]);
    assert.deepEqual(column.calculateFilterExpression(date, '<'), ['TestField', '<', dateStart]);
    assert.deepEqual(column.calculateFilterExpression(date, '<='), ['TestField', '<', dateEnd]);
    assert.deepEqual(column.calculateFilterExpression(date, '>='), ['TestField', '>=', dateStart]);
});

QUnit.test("calculateFilterExpression for column with string type dataField", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });

    var column = this.columnsController.getColumns()[0];
    assert.ok(column);
    assert.ok(column.calculateFilterExpression);
    // string
    assert.deepEqual(column.calculateFilterExpression(''), ['TestField', 'contains', '']);
    assert.deepEqual(column.calculateFilterExpression('abc'), ['TestField', 'contains', 'abc']);
    assert.deepEqual(column.calculateFilterExpression('123', '<>'), ['TestField', '<>', '123']);
});

// B254436
QUnit.test("calculateFilterExpression for column with boolean type dataField", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'boolean', trueText: 'true', falseText: 'false' }]
    });

    // act
    var column = this.columnsController.getColumns()[0];

    // assert
    assert.ok(column, 'column');
    assert.ok(column.calculateFilterExpression, 'calculateFilterExpression');
    assert.deepEqual(column.calculateFilterExpression(true), ['TestField', '=', true], 'filter text true');
    assert.deepEqual(column.calculateFilterExpression(false), ['TestField', '=', false], 'filter text false');
});

// T396670
QUnit.test("getVisibleColumns when there is custom method in prototype of the array", function(assert) {
    // jshint freeze:false

    // arrange
    Array.prototype.add = function(item) {
        this[this.length] = item;
    };

    this.applyOptions({
        columns: ['TestField1', 'TestField2', 'TestField3']
    });

    assert.ok(this.columnsController.isInitialized());

    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(visibleColumns.length, 3, "count column");
    assert.strictEqual(visibleColumns[0].dataField, "TestField1", "dataField of the first column");
    assert.strictEqual(visibleColumns[1].dataField, "TestField2", "dataField of the second column");
    assert.strictEqual(visibleColumns[2].dataField, "TestField3", "dataField of the third column");

    delete Array.prototype.add;
});

// T479349
QUnit.test("Initialize from options with fields that are specified as undefined and null", function(assert) {
    // arrange
    var columns;

    // act
    this.applyOptions({
        columns: ["TestField1", undefined, null, "TestField2", "TestField3"]
    });

    // assert
    columns = this.columnsController.getColumns();
    assert.equal(columns.length, 3, "count column");
    assert.equal(columns[0].dataField, "TestField1", "dataField of the first column");
    assert.equal(columns[1].dataField, "TestField2", "dataField of the second column");
    assert.equal(columns[2].dataField, "TestField3", "dataField of the third column");
});

QUnit.test("minWidth should be assigned to all columns from columnMinWidth option", function(assert) {
    this.applyOptions({
        columnMinWidth: 20,
        columns: ['TestField1', 'TestField2', { dataField: 'TestField3', minWidth: 30 }]
    });

    assert.ok(this.columnsController.isInitialized());
    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.strictEqual(visibleColumns[0].minWidth, 20);
    assert.strictEqual(visibleColumns[1].minWidth, 20);
    assert.strictEqual(visibleColumns[2].minWidth, 30);
});

QUnit.test("width should be assigned to all columns from columnWidth option", function(assert) {
    this.applyOptions({
        columnWidth: 20,
        columns: ['TestField1', 'TestField2', { dataField: 'TestField3', width: 30 }]
    });

    assert.ok(this.columnsController.isInitialized());
    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.strictEqual(visibleColumns[0].width, 20);
    assert.strictEqual(visibleColumns[1].width, 20);
    assert.strictEqual(visibleColumns[2].width, 30);
});

QUnit.test("format of the column with dataType is 'datetime'", function(assert) {
    // arrange
    var column;

    // act
    this.applyOptions({
        columns: [{ dataField: "TestField", dataType: "datetime" }]
    });

    // assert
    column = this.columnsController.getColumns()[0];
    assert.strictEqual(column.format, "shortDateShortTime");
});

// T544189
QUnit.test("minWidth should not be assigned to expand column from columnMinWidth option", function(assert) {
    this.applyOptions({
        columnMinWidth: 20,
        columns: ['TestField1', 'TestField2', { dataField: 'TestField3', groupIndex: 0 }]
    });

    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.strictEqual(visibleColumns.length, 3);
    assert.strictEqual(visibleColumns[0].command, "expand");
    assert.strictEqual(visibleColumns[0].minWidth, null);
    assert.strictEqual(visibleColumns[1].minWidth, 20);
    assert.strictEqual(visibleColumns[2].minWidth, 20);
});

QUnit.module("initialization from dataSource", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("Initialize from array store", function(assert) {
    var dataSource = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);
    dataSource.load();

    this.columnsController.applyDataSource(dataSource);

    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.deepEqual(processColumnsForCompare(visibleColumns), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number' }
    ]);

    assert.strictEqual(visibleColumns[0].index, 0);
    assert.strictEqual(visibleColumns[1].index, 1);
});

QUnit.test("Initialize from array store. Private fields with '__' prefix ignores", function(assert) {
    var dataSource = new DataSource([
        { name: 'Alex', age: 15, __privateField: 1, __metadata: {} },
        { name: 'Dan', age: 19, __privateField: 2, __metadata: {} }
    ]);
    dataSource.load();

    this.columnsController.applyDataSource(dataSource);

    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.deepEqual(processColumnsForCompare(visibleColumns), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number' }
    ]);

    assert.strictEqual(visibleColumns[0].index, 0);
    assert.strictEqual(visibleColumns[1].index, 1);
});

// B254737
QUnit.test("Reinitialize from array store on init", function(assert) {
    var dataSource = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);
    dataSource.load();

    this.options.customizeColumns = function(columns) {
        columns.push({
            dataField: 'test1',
            dataType: 'number'
        });
    };

    this.columnsController.applyDataSource(dataSource);

    // act
    this.options.customizeColumns = function(columns) {
        columns.unshift({
            dataField: 'test2',
            dataType: 'string'
        });
    };

    this.columnsController.init();


    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.deepEqual(processColumnsForCompare(visibleColumns, ['dataField', 'visible', 'dataType']), [
        { visible: true, dataField: 'test2', dataType: 'string' },
        { visible: true, dataField: 'name', dataType: 'string' },
        { visible: true, dataField: 'age', dataType: 'number' }
    ]);
});

// T220163
QUnit.test("Initialize Lookup column with paging", function(assert) {
    var array = [
        { name: 'Alex', age: 15, category_id: 1 },
        { name: 'Dan', age: 19, category_id: 2 }
    ];
    var dataSource = new DataSource(array);
    dataSource.load();

    var lookupLoadingCount = 0;

    this.applyOptions({
        columns: ["name", {
            dataField: "category_id", lookup: {
                dataSource: {
                    paginate: true,
                    pageSize: 2,
                    onChanged: function() {
                        lookupLoadingCount++;
                    },
                    store: [
                        { id: 1, category_name: 'Category 1' },
                        { id: 2, category_name: 'Category 2' },
                        { id: 3, category_name: 'Category 3' }
                    ]
                },
                valueExpr: 'id',
                displayExpr: 'category_name'
            }
        }]
    });

    var columnsController = this.columnsController;

    var columnChangedCallCount = 0;

    columnsController.columnsChanged.add(function() {
        columnChangedCallCount++;
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    var lookupColumn = columnsController.getVisibleColumns()[1];
    var lookup = lookupColumn.lookup;

    assert.ok(lookup);
    assert.equal(lookupLoadingCount, 1, 'lookup onChanged call count');
    assert.equal(columnChangedCallCount, 1, 'columnsChanged call count');
    assert.equal(lookupColumn.dataField, 'category_id', 'column dataField');
    assert.equal(lookupColumn.dataType, 'number', 'column type');
    assert.equal(lookupColumn.calculateCellValue(array[1]), 2, 'column value');
    assert.equal(gridCore.getDisplayValue(lookupColumn, lookupColumn.calculateCellValue(array[1]), array[1]), "Category 2", 'column displayValue by getDisplayValue');
    assert.equal(lookup.dataType, 'string', 'lookup type');
    assert.deepEqual(lookup.items, this.options.columns[1].lookup.dataSource.store, 'lookup items');
    assert.equal(lookup.calculateCellValue(1), 'Category 1', 'lookup calculateCellValue');
});

// T630253
QUnit.test("Initialize Lookup column with dataSource instance", function(assert) {
    var array = [
        { name: 'Alex', age: 15, category_id: 1 },
        { name: 'Dan', age: 19, category_id: 2 }
    ];
    var dataSource = new DataSource(array);
    dataSource.load();

    this.applyOptions({
        columns: ["name", {
            dataField: "category_id", lookup: {
                dataSource: new DataSource([]),
                valueExpr: 'id',
                displayExpr: 'category_name'
            }
        }]
    });

    sinon.spy(errors, "log");

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    var lookupColumn = this.columnsController.getVisibleColumns()[1];

    assert.equal(lookupColumn.dataField, 'category_id', 'column dataField');
    assert.equal(lookupColumn.lookup.calculateCellValue(1), undefined, 'lookup calculateCellValue');

    assert.equal(errors.log.callCount, 1, "one error is occured");
    assert.equal(errors.log.lastCall.args[0], "E1016", "Error code");
    errors.log.restore();
});

QUnit.test("Initialize Lookup column with Store instance", function(assert) {
    var array = [
        { name: 'Alex', age: 15, category_id: 1 },
        { name: 'Dan', age: 19, category_id: 2 }
    ];
    var dataSource = new DataSource(array);
    dataSource.load();

    this.applyOptions({
        columns: ["name", {
            dataField: "category_id", lookup: {
                dataSource: new ArrayStore([{ id: 1, category_name: "Category 1" }]),
                valueExpr: 'id',
                displayExpr: 'category_name'
            }
        }]
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    var lookupColumn = this.columnsController.getVisibleColumns()[1];

    assert.equal(lookupColumn.dataField, 'category_id', 'column dataField');
    assert.equal(lookupColumn.lookup.calculateCellValue(1), "Category 1", 'lookup calculateCellValue works');
});

// T329343
QUnit.test("Initialize Lookup column by columnOption", function(assert) {
    var array = [
        { name: 'Alex', age: 15, category_id: 1 },
        { name: 'Dan', age: 19, category_id: 2 }
    ];
    var dataSource = new DataSource(array);
    dataSource.load();

    var lookupLoadingCount = 0;

    this.applyOptions({
        columns: ["name", "category_id"]
    });

    var columnsController = this.columnsController;

    var columnChangedCallCount = 0;

    columnsController.columnsChanged.add(function() {
        columnChangedCallCount++;
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    var store = [
                { id: 1, category_name: 'Category 1' },
                { id: 2, category_name: 'Category 2' },
                { id: 3, category_name: 'Category 3' }
    ];

    this.columnsController.columnOption("category_id", "lookup", {
        dataSource: {
            paginate: true,
            pageSize: 2,
            onChanged: function() {
                lookupLoadingCount++;
            },
            store: store
        },
        valueExpr: 'id',
        displayExpr: 'category_name'
    });

    // assert
    var lookupColumn = columnsController.getVisibleColumns()[1];
    var lookup = lookupColumn.lookup;

    assert.ok(lookup);
    assert.equal(lookupLoadingCount, 1, 'lookup onChanged call count');
    assert.equal(columnChangedCallCount, 2, 'columnsChanged call count');
    assert.equal(lookupColumn.dataField, 'category_id', 'column dataField');
    assert.equal(lookupColumn.dataType, 'number', 'column type');
    assert.equal(lookupColumn.calculateCellValue(array[1]), 2, 'column value');
    assert.equal(gridCore.getDisplayValue(lookupColumn, lookupColumn.calculateCellValue(array[1]), array[1]), "Category 2", 'column displayValue by getDisplayValue');
    assert.equal(lookup.dataType, 'string', 'lookup type');
    assert.deepEqual(lookup.items, store, 'lookup items');
    assert.equal(lookup.calculateCellValue(1), 'Category 1', 'lookup calculateCellValue');
});

// T501545
QUnit.test("Initialize Lookup column dataSource by columnOption", function(assert) {
    var array = [
        { name: 'Alex', age: 15, category_id: 1 },
        { name: 'Dan', age: 19, category_id: 2 }
    ];
    var dataSource = new DataSource(array);
    dataSource.load();

    this.applyOptions({
        columns: ["name", {
            dataField: "category_id",
            lookup: {
                valueExpr: 'id',
                displayExpr: 'category_name'
            }
        }]
    });

    this.columnsController.applyDataSource(dataSource);

    var lookupDataSource = [
        { id: 1, category_name: 'Category 1' },
        { id: 2, category_name: 'Category 2' },
        { id: 3, category_name: 'Category 3' }
    ];

    var columnChangedCallCount = 0;

    this.columnsController.columnsChanged.add(function() {
        columnChangedCallCount++;
    });

    // act
    this.columnsController.columnOption("category_id", "lookup.dataSource", lookupDataSource);

    // assert
    var lookupColumn = this.columnsController.getVisibleColumns()[1];
    var lookup = lookupColumn.lookup;

    assert.equal(columnChangedCallCount, 1, 'columnsChanged called once');
    assert.equal(lookupColumn.dataField, 'category_id', 'column dataField');
    assert.equal(lookupColumn.dataType, 'number', 'column type');
    assert.ok(lookup);
    assert.equal(lookup.dataType, 'string', 'lookup type');
    assert.deepEqual(lookup.items, lookupDataSource, 'lookup items');
    assert.equal(lookup.calculateCellValue(1), 'Category 1', 'lookup calculateCellValue');
    assert.equal(gridCore.getDisplayValue(lookupColumn, lookupColumn.calculateCellValue(array[1]), array[1]), "Category 2", 'column displayValue by getDisplayValue');
});

// T521239
QUnit.test("Update lookup column on refresh", function(assert) {
    var lookupDataSource = [
        { id: 1, category_name: 'Category 1' },
        { id: 2, category_name: 'Category 2' },
        { id: 3, category_name: 'Category 3' }
    ];

    this.applyOptions({
        columns: ["name", { dataField: "category_id",
            lookup: {
                dataSource: function() {
                    return {
                        store: lookupDataSource
                    };
                },
                valueExpr: 'id',
                displayExpr: 'category_name'
            }
        }]
    });

    this.columnsController.getVisibleColumns();

    // act
    lookupDataSource.push({ id: 4, category_name: 'Category 4' });
    this.columnsController.refresh();

    // assert
    var lookupColumn = this.columnsController.getVisibleColumns()[1];
    assert.equal(lookupColumn.lookup.calculateCellValue(4), 'Category 4', 'lookup calculateCellValue return correct value for added item');
});

QUnit.test("Initialize Lookup column when calculateDisplayValue is defined as string", function(assert) {
    var array = [
        { name: 'Alex', age: 15, category_id: 1, category: { name: "Category 1" } },
        { name: 'Dan', age: 19, category_id: 2, category: { name: "Category 2" } }
    ];
    var dataSource = new DataSource(array);
    dataSource.load();

    var lookupLoadingCount = 0;

    this.applyOptions({
        columns: ["name", {
            calculateDisplayValue: "category.name",
            dataField: "category_id", lookup: {
                dataSource: {
                    paginate: true,
                    pageSize: 2,
                    onChanged: function() {
                        lookupLoadingCount++;
                    },
                    store: [
                        { id: 1, category_name: 'Category 1' },
                        { id: 2, category_name: 'Category 2' },
                        { id: 3, category_name: 'Category 3' }
                    ]
                },
                valueExpr: 'id',
                displayExpr: 'category_name'
            }
        }]
    });

    var columnsController = this.columnsController;

    var columnChangedCallCount = 0;

    columnsController.columnsChanged.add(function() {
        columnChangedCallCount++;
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    var lookupColumn = columnsController.getVisibleColumns()[1];
    var lookup = lookupColumn.lookup;

    assert.ok(lookup);
    assert.equal(columnChangedCallCount, 1, 'columnsChanged call count');
    assert.equal(lookupLoadingCount, 0, 'lookup onChanged call count');
    assert.equal(lookupColumn.dataField, 'category_id', 'column dataField');
    assert.equal(lookupColumn.dataType, 'number', 'column type');
    assert.equal(lookupColumn.calculateCellValue(array[1]), 2, 'column value');
    assert.equal(lookupColumn.displayField, 'category.name', 'column displayField');
    assert.equal(lookupColumn.calculateDisplayValue(array[1]), "Category 2", 'column displayValue');
    assert.equal(gridCore.getDisplayValue(lookupColumn, lookupColumn.calculateCellValue(array[1]), array[1]), "Category 2", 'column displayValue by getDisplayValue');
    assert.equal(lookup.dataType, 'string', 'lookup type');
    assert.strictEqual(lookup.items, undefined, 'lookup items');
    assert.strictEqual(lookup.calculateCellValue(1), undefined, 'lookup calculateCellValue do not work');
});


QUnit.test("Initialize Lookup column when calculateDisplayValue is defined as function", function(assert) {
    var array = [
        { name: 'Alex', age: 15, category_id: 1, category: { name: "Category 1" } },
        { name: 'Dan', age: 19, category_id: 2, category: { name: "Category 2" } }
    ];
    var dataSource = new DataSource(array);
    dataSource.load();

    var lookupLoadingCount = 0;

    this.applyOptions({
        columns: ["name", {
            calculateDisplayValue: function(data) {
                return data.category.name;
            },
            dataField: "category_id", lookup: {
                dataSource: {
                    paginate: true,
                    pageSize: 2,
                    onChanged: function() {
                        lookupLoadingCount++;
                    },
                    store: [
                        { id: 1, category_name: 'Category 1' },
                        { id: 2, category_name: 'Category 2' },
                        { id: 3, category_name: 'Category 3' }
                    ]
                },
                valueExpr: 'id',
                displayExpr: 'category_name'
            }
        }]
    });

    var columnsController = this.columnsController;

    var columnChangedCallCount = 0;

    columnsController.columnsChanged.add(function() {
        columnChangedCallCount++;
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    var lookupColumn = columnsController.getVisibleColumns()[1];
    var lookup = lookupColumn.lookup;

    assert.ok(lookup);
    assert.equal(columnChangedCallCount, 1, 'columnsChanged call count');
    assert.equal(lookupLoadingCount, 0, 'lookup onChanged call count');
    assert.equal(lookupColumn.dataField, 'category_id', 'column dataField');
    assert.equal(lookupColumn.dataType, 'number', 'column type');
    assert.equal(lookupColumn.calculateCellValue(array[1]), 2, 'column value');
    assert.equal(lookupColumn.displayField, undefined, 'column displayField');
    assert.equal(lookupColumn.calculateDisplayValue(array[1]), "Category 2", 'column displayValue');
    assert.equal(gridCore.getDisplayValue(lookupColumn, lookupColumn.calculateCellValue(array[1]), array[1]), "Category 2", 'column displayValue by getDisplayValue');
    assert.equal(lookup.dataType, 'string', 'lookup type');
    assert.strictEqual(lookup.items, undefined, 'lookup items');
    assert.strictEqual(lookup.calculateCellValue(1), undefined, 'lookup calculateCellValue do not work');
});

QUnit.test("Initialize Lookup column on customizeColumns", function(assert) {
    var array = [
        { name: 'Alex', age: 15, category_id: 1 },
        { name: 'Dan', age: 19, category_id: 2 }
    ];
    var dataSource = new DataSource(array);
    dataSource.load();

    this.options.customizeColumns = function(columns) {
        columns[2].lookup = {
            dataSource: { sort: 'category_name', store: { type: 'array', data: [{ id: 2, category_name: 'Category 2' }, { id: 1, category_name: 'Category 1' }] } },
            valueExpr: 'id',
            displayExpr: 'category_name'
        };
    };

    var columnsController = this.columnsController;

    var columnChangedCallCount = 0;

    columnsController.columnsChanged.add(function() {
        columnChangedCallCount++;
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    var lookupColumn = columnsController.getVisibleColumns()[2];
    var lookup = lookupColumn.lookup;

    assert.ok(lookup);
    assert.equal(columnChangedCallCount, 1, 'columnsChanged call count');
    assert.equal(lookupColumn.dataField, 'category_id', 'column dataField');
    assert.equal(lookupColumn.dataType, 'number', 'column type');
    assert.equal(lookupColumn.calculateCellValue(array[1]), 2, 'column type');
    assert.equal(lookup.dataType, 'string', 'lookup type');
    assert.deepEqual(lookup.items, [{ id: 1, category_name: 'Category 1' }, { id: 2, category_name: 'Category 2' }], 'lookup items');
    assert.equal(lookup.calculateCellValue(1), 'Category 1', 'lookup calculateCellValue');
});

QUnit.test("Initialize from array store with sort defined where type sort column undefined", function(assert) {
    var dataSource = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);
    dataSource.sort('sortField');
    dataSource.load();

    this.columnsController.applyDataSource(dataSource);

    assert.equal(this.getColumns().length, 2);
    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number' }
    ]);
});

QUnit.test("Initialize from array store with group defined where type group column undefined", function(assert) {
    var dataSource = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);
    dataSource.group('groupField');
    dataSource.load();

    this.columnsController.applyDataSource(dataSource);

    assert.equal(this.getColumns().length, 2);
    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number' }
    ]);
});

QUnit.test("Initialize from not loaded array store when sort defined", function(assert) {
    var dataSource = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);
    dataSource.sort('sortField');
    this.columnsController.applyDataSource(dataSource);

    assert.ok(!this.getColumns().length);
});


QUnit.test("Initialize from array store when items with different data", function(assert) {
    var dataSource = new DataSource([
        { name1: 'Alex', age1: 15 },
        { name2: 'Dan', age2: 19 }
    ]);
    dataSource.load();

    this.columnsController.applyDataSource(dataSource);

    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name1', caption: 'Name 1', alignment: 'left', dataType: 'string' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age1', caption: 'Age 1', alignment: 'right', dataType: 'number' },
        { index: 2, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name2', caption: 'Name 2', alignment: 'left', dataType: 'string' },
        { index: 3, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age2', caption: 'Age 2', alignment: 'right', dataType: 'number' }
    ]);
});

QUnit.test("Initialize from big array store when items with different data", function(assert) {
    var array = [];
    var i;
    var item;

    for(i = 0; i < 100; i++) {
        item = {};
        item['item' + i] = i;
        item['item' + (i + 1)] = i + 1;
        array.push(item);
    }

    var dataSource = new DataSource({
        store: array,
        paginate: false
    });
    dataSource.load();

    this.columnsController.applyDataSource(dataSource);

    assert.equal(this.getColumns().length, 101);
    assert.equal(this.getColumns()[0].dataField, 'item0');
    assert.equal(this.getColumns()[100].dataField, 'item100');
});

QUnit.test("Converting dates for array store", function(assert) {
    var array = [
        { name: 'Alex', birthDate: '1987/5/5' },
        { name: 'Dan', birthDate: '1985/8/25' }
    ];

    var dataSource = new DataSource({ store: array });
    dataSource.load();

    this.applyOptions({
        columns: ['name', { dataField: 'birthDate', dataType: 'date' }]
    });

    // act
    this.columnsController.applyDataSource(dataSource);


    // assert
    var columns = this.columnsController.getVisibleColumns();
    assert.deepEqual(array, [
        { name: 'Alex', birthDate: '1987/5/5' },
        { name: 'Dan', birthDate: '1985/8/25' }
    ]);
    assert.deepEqual(columns[1].calculateCellValue(array[0]), new Date(1987, 4, 5));
    assert.deepEqual(columns[1].calculateCellValue(array[1]), new Date(1985, 7, 25));
});

QUnit.test("Converting dates for custom store when virtual scrolling", function(assert) {
    var array = [
        { name: 'Alex', birthDate: '1987/5/5' },
        { name: 'Dan', birthDate: '1985/8/25' }
    ];

    var dataSource = new DataSource({
        load: function(options) {
            return array;
        }
    });

    dataSource.load();

    this.applyOptions({
        scrolling: { mode: 'virtual' },
        columns: ['name', { dataField: 'birthDate', dataType: 'date' }]
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.deepEqual(array, [
        { name: 'Alex', birthDate: '1987/5/5' },
        { name: 'Dan', birthDate: '1985/8/25' }
    ]);
    var columns = this.columnsController.getVisibleColumns();
    assert.deepEqual(columns[1].calculateCellValue(array[0]), new Date(1987, 4, 5));
    assert.deepEqual(columns[1].calculateCellValue(array[1]), new Date(1985, 7, 25));
});

QUnit.test("Converting numbers for array store", function(assert) {
    var array = [
        { name: 'Alex', age: '19' },
        { name: 'Dan', age: '25' }
    ];

    var dataSource = new DataSource({ store: array });
    dataSource.load();

    this.applyOptions({
        columns: ['name', { dataField: 'age', dataType: 'number' }]
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.deepEqual(array, [
        { name: 'Alex', age: '19' },
        { name: 'Dan', age: '25' }
    ]);
    var columns = this.columnsController.getVisibleColumns();
    assert.deepEqual(columns[1].calculateCellValue(array[0]), 19);
    assert.deepEqual(columns[1].calculateCellValue(array[1]), 25);
});

QUnit.test("Serialize value when data and value is number type", function(assert) {
    var array = [
            { name: 'Alex', age: 19 },
            { name: 'Dan', age: 15 }
        ],
        columns;

    var dataSource = new DataSource({ store: array });
    dataSource.load();

    this.applyOptions({
        columns: ['name', { dataField: 'age', dataType: 'number' }]
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    columns = this.columnsController.getVisibleColumns();
    assert.strictEqual(columns[1].serializeValue(array[0].age), 19, "row 1");
    assert.strictEqual(columns[1].serializeValue(array[1].age), 15, "row 2");
});

// T453073
QUnit.test("Deserialize value for grouped lookup column with dataType number", function(assert) {
    var array = [
            { name: 'Alex', state: 1 },
            { name: 'Dan', state: 2 }
    ];

    var dataSource = new DataSource({ store: array });
    dataSource.load();

    this.applyOptions({
        columns: ['name',
            { dataField: 'state', dataType: 'number',
                calculateGroupValue: function(data) {
                    var value = this.calculateCellValue(data);
                    return this.lookup.calculateCellValue(value);
                },
                lookup: {
                    dataSource: [{ id: 1, text: "Approved" }, { id: 2, text: "Rejected" }],
                    valueExpr: "id",
                    displayExpr: "text"
                }
            }
        ]
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    var lookupColumn = this.columnsController.getVisibleColumns()[1];
    assert.strictEqual(lookupColumn.deserializeValue(lookupColumn.calculateGroupValue(array[0])), "Approved", "row 1 value");
    assert.strictEqual(lookupColumn.deserializeValue(lookupColumn.calculateGroupValue(array[1])), "Rejected", "row 2 value");
});

// T123987
QUnit.test("Converting numbers for empty array", function(assert) {
    var array = [];

    var dataSource = new DataSource({ store: array });
    dataSource.load();

    this.applyOptions({
        columns: ['name', { dataField: 'age', dataType: 'number' }]
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.deepEqual(array, []);
});

QUnit.test("Not update dates for array store after inserting", function(assert) {
    var array = [
        { name: 'Alex', birthDate: '1987/5/5' },
        { name: 'Dan', birthDate: '1985/8/25' }
    ];

    var arrayStore = new ArrayStore(array);

    var dataSource = new DataSource({ store: arrayStore });
    dataSource.load();
    this.applyOptions({
        columns: ['name', { dataField: 'birthDate', dataType: 'date' }]
    });

    this.columnsController.applyDataSource(dataSource);

    // act
    arrayStore.insert({ name: 'Max', birthDate: '1989/7/7' });
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.deepEqual(array, [
        { name: 'Alex', birthDate: '1987/5/5' },
        { name: 'Dan', birthDate: '1985/8/25' },
        { name: 'Max', birthDate: '1989/7/7' }
    ]);
});


QUnit.test("parsing dates", function(assert) {
    var array = [
        { name: 'Alex', date: new Date(2012, 10, 5), numberDate: 5000000, stringDate: '2005/08/09 18:31:42'/* , stringDateDotNet: "\/Date(1310669017000)\/", stringDateISO8601UTC: '1997-07-16T19:20:15.123Z', stringDateISO8601ZeroTime: '1997-07-16T00:00:00.000Z', stringDateTimeZone: '2005-08-09T18:31:42+05', stringDateTimeZoneWithMinutes : '2005-08-09T18:31:42+03:30' */ }
    ];
    var dataSource = new DataSource({ store: array });
    dataSource.load();

    this.applyOptions({
        columns: [
            "name",
            { dataField: "date", dataType: 'date' },
            { dataField: "numberDate", dataType: 'number' },
            { dataField: "stringDate", dataType: 'string' },
            /* { dataField: "stringDateDotNet", dataType: 'date' },
            { dataField: "stringDateISO8601UTC", dataType: 'date' },
            { dataField: "stringDateISO8601ZeroTime", dataType: 'date' },
            { dataField: "stringDateTimeZone", dataType: 'date' }, // B251866
            { dataField: "stringDateTimeZoneWithMinutes", dataType: 'date' } // B251866 */
        ]
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.deepEqual(array[0], {
        name: 'Alex',
        date: new Date(2012, 10, 5),
        numberDate: 5000000,
        stringDate: '2005/08/09 18:31:42',
        /* stringDateDotNet: new Date(1310669017000),
        stringDateISO8601UTC: new Date(Date.UTC(1997, 6, 16, 19, 20, 15, 123)),
        stringDateISO8601ZeroTime: new Date(1997, 6, 16),
        stringDateTimeZone: new Date(Date.UTC(2005, 7, 9, 13, 31, 42)), // B251866
        stringDateTimeZoneWithMinutes: new Date(Date.UTC(2005, 7, 9, 15, 01, 42)) // B251866 */
    });
});

QUnit.test("Initialize grouping from dataSource", function(assert) {
    var dataSource = new DataSource({
        store: [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 }
        ],
        group: 'age'
    });

    dataSource.load();
    this.columnsController.applyDataSource(dataSource);
    assert.ok(this.columnsController.__groupingUpdated);
    assert.ok(!this.columnsController.__sortingUpdated);
    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number', groupIndex: 0, sortOrder: 'asc' }
    ]);
});

// B254489
QUnit.test("Initialize grouping from dataSource when remoteOperations disabled and autoExpandAll enabled", function(assert) {
    var dataSource = new DataSource({
        store: [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 }
        ],
        group: 'age'
    });

    var dataAdapter = dataSourceAdapter.create(this);

    dataAdapter.init(dataSource);
    dataSource = dataAdapter;

    dataSource.load();

    this.applyOptions({
        grouping: {
            autoExpandAll: true
        }
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.ok(this.columnsController.__groupingUpdated);
    assert.ok(!this.columnsController.__sortingUpdated);
    assert.deepEqual(this.getColumns(['dataField', 'groupIndex', 'sortOrder', 'sortIndex']), [
        { dataField: 'name' },
        { dataField: 'age', groupIndex: 0, sortOrder: 'asc' }
    ]);

    // act
    dataSource.group(this.columnsController.getGroupDataSourceParameters());
    dataSource.reload();
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.ok(this.columnsController.__groupingUpdated);
    assert.ok(!this.columnsController.__sortingUpdated);
    assert.deepEqual(this.getColumns(['dataField', 'groupIndex', 'sortOrder', 'sortIndex']), [
        { dataField: 'name' },
        { dataField: 'age', groupIndex: 0, sortOrder: 'asc' }
    ]);
});

// B254489
QUnit.test("Initialize grouping from dataSource when remoteOperations disabled after expand group", function(assert) {
    var dataSource = new DataSource({
        store: [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 }
        ],
        group: 'age'
    });

    var dataAdapter = dataSourceAdapter.create(this);

    dataAdapter.init(dataSource);
    dataSource = dataAdapter;

    dataSource.load();

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.ok(this.columnsController.__groupingUpdated);
    assert.ok(!this.columnsController.__sortingUpdated);
    assert.deepEqual(this.getColumns(['dataField', 'groupIndex', 'sortOrder', 'sortIndex']), [
        { dataField: 'name' },
        { dataField: 'age', groupIndex: 0, sortOrder: 'asc' }
    ]);

    // act
    dataSource.changeRowExpand([15]);
    dataSource.load();
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.ok(this.columnsController.__groupingUpdated);
    assert.ok(!this.columnsController.__sortingUpdated);
    assert.deepEqual(this.getColumns(['dataField', 'groupIndex', 'sortOrder', 'sortIndex']), [
        { dataField: 'name' },
        { dataField: 'age', groupIndex: 0, sortOrder: 'asc' }
    ]);
});

QUnit.test("Group options from columns wins group options from dataSource", function(assert) {
    var dataSource = new DataSource({
        store: [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 }
        ],
        group: 'age'
    });

    dataSource.load();

    this.applyOptions({
        columns: [{ dataField: 'name', groupIndex: 0, sortOrder: 'asc' }, 'age']
    });
    this.columnsController.applyDataSource(dataSource);
    assert.ok(!this.columnsController.__sortingGroupingUpdated);
    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string', groupIndex: 0, sortOrder: 'asc' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number' }
    ]);
});

QUnit.test("Initialize grouping from dataSource. Not update sorting/grouping", function(assert) {
    var dataSource = new DataSource({
        store: [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 }
        ],
        group: 'age',
        sort: { selector: 'name', desc: true }
    });

    dataSource.load();

    this.applyOptions({
        commonColumnSettings: {
            autoExpandGroup: false
        },
        columns: [{ dataField: 'name', sortOrder: 'desc' }, { dataField: 'age', sortOrder: 'asc', groupIndex: 0 }]
    });

    this.columnsController.applyDataSource(dataSource);
    assert.ok(!this.columnsController.__sortingGroupingUpdated);
    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string', sortOrder: 'desc', sortIndex: 0, autoExpandGroup: false },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number', groupIndex: 0, sortOrder: 'asc', autoExpandGroup: false }
    ]);
});

QUnit.test("Initialize grouping with desc sorting from dataSource", function(assert) {
    var dataSource = new DataSource({
        store: [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 }
        ],
        group: { selector: 'age', desc: true }
    });

    dataSource.load();

    this.columnsController.applyDataSource(dataSource);
    assert.ok(this.columnsController.__groupingUpdated);
    assert.ok(!this.columnsController.__sortingUpdated);
    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number', groupIndex: 0, sortOrder: 'desc' }
    ]);
});

QUnit.test("Initialize sorting from dataSource", function(assert) {
    var dataSource = new DataSource({
        store: [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 19 }
        ],
        sort: ['age', { selector: 'name', desc: true }]
    });

    dataSource.load();

    this.columnsController.applyDataSource(dataSource);
    assert.ok(this.columnsController.__sortingUpdated);
    assert.ok(!this.columnsController.__groupingUpdated);
    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string', sortOrder: 'desc', sortIndex: 1 },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number', sortOrder: 'asc', sortIndex: 0 }
    ]);
});

// B254274
QUnit.test("Initialize grouping from dataSource and sorting from columns", function(assert) {
    var dataSource = new DataSource({
        store: [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 },
        ],
        group: ['team']
    });

    this.applyOptions({
        columns: ['team', 'name', { dataField: 'age', sortOrder: 'asc' }]
    });

    dataSource.load();


    // act

    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.ok(!this.columnsController.__sortingUpdated, 'sorting not updated from dataSource');
    assert.ok(this.columnsController.__groupingUpdated, 'grouping updated from dataSource');
    assert.deepEqual(this.getColumns(['dataField', 'sortOrder', 'sortIndex', 'groupIndex']), [
        { dataField: 'team', sortOrder: 'asc', groupIndex: 0 },
        { dataField: 'name' },
        { dataField: 'age', sortOrder: 'asc', sortIndex: 0 }
    ], 'column options');
});

// B254274
QUnit.test("Initialize grouping from dataSource when sortOrder is defined in columns", function(assert) {
    var dataSource = new DataSource({
        store: [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Dan', age: 25 },
            { team: 'internal', name: 'Bob', age: 20 },
            { team: 'public', name: 'Alice', age: 19 },
        ],
        group: [{ selector: 'team', desc: true }]
    });

    this.applyOptions({
        columns: [{ dataField: 'team', sortOrder: 'asc' }, 'name', 'age']
    });

    dataSource.load();


    // act

    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.ok(!this.columnsController.__sortingUpdated);
    assert.ok(this.columnsController.__groupingUpdated);
    assert.deepEqual(this.getColumns(['dataField', 'sortOrder', 'sortIndex', 'groupIndex']), [
        { dataField: 'team', sortOrder: 'asc', groupIndex: 0, sortIndex: 0 },
        { dataField: 'name' },
        { dataField: 'age' }
    ]);

    assert.ok(!this.columnsController.getSortDataSourceParameters(), 'no sort parameters');
});

// B232542
QUnit.test("Second Initialize from array store after reset", function(assert) {
    var dataSource1 = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);

    dataSource1.load();

    var dataSource2 = new DataSource([
        { id: 0, value: 'value1' },
        { id: 1, value: 'value2' }
    ]);

    dataSource2.load();

    this.columnsController.applyDataSource(dataSource1);

    // act
    this.columnsController.reset();
    this.columnsController.applyDataSource(dataSource2);


    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'id', caption: 'Id', alignment: 'right', dataType: 'number' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'value', caption: 'Value', alignment: 'left', dataType: 'string' }
    ]);
});

// T169690
QUnit.test("Second Initialize from array store after reset keep user state options", function(assert) {
    var dataSource1 = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);

    dataSource1.load();

    var dataSource2 = new DataSource([
        { name: 'Alex', age: 15 }
    ]);

    dataSource2.load();

    this.columnsController.applyDataSource(dataSource1);

    this.columnOption(0, {
        sortOrder: 'desc',
        sortIndex: 0
    });

    // act
    this.columnsController.reset();
    this.columnsController.applyDataSource(dataSource2);

    // assert
    assert.deepEqual(this.getColumns(['dataField', 'dataType', 'alignment', 'sortOrder', 'sortIndex']), [
        { dataField: 'name', alignment: 'left', dataType: 'string', sortOrder: 'desc', sortIndex: 0 },
        { dataField: 'age', alignment: 'right', dataType: 'number' }
    ]);
});

QUnit.test("Second Initialize from array when regenerateColumnsByVisibleItems enabled", function(assert) {
    var dataSource1 = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);

    dataSource1.load();

    var dataSource2 = new DataSource([
        { id: 0, value: 'value1' },
        { id: 1, value: 'value2' }
    ]);

    dataSource2.load();

    this.applyOptions({
        regenerateColumnsByVisibleItems: true
    });

    // act
    this.columnsController.applyDataSource(dataSource1);
    this.columnsController.applyDataSource(dataSource2);


    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'id', caption: 'Id', alignment: 'right', dataType: 'number' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'value', caption: 'Value', alignment: 'left', dataType: 'string' }
    ]);
});

QUnit.test("Second Initialize from array when regenerateColumnsByVisibleItems disabled", function(assert) {
    var dataSource1 = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);

    dataSource1.load();

    var dataSource2 = new DataSource([
        { id: 0, value: 'value1' },
        { id: 1, value: 'value2' }
    ]);

    dataSource2.load();

    this.applyOptions({
        regenerateColumnsByVisibleItems: false
    });

    // act
    this.columnsController.applyDataSource(dataSource1);
    this.columnsController.applyDataSource(dataSource2);


    assert.deepEqual(this.getColumns(), [
        { index: 0, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'name', caption: 'Name', alignment: 'left', dataType: 'string' },
        { index: 1, visible: true, showEditorAlways: false, allowFiltering: true, dataField: 'age', caption: 'Age', alignment: 'right', dataType: 'number' }
    ]);
});

QUnit.test("Initialize from remote rest store", function(assert) {
    var done = assert.async(),
        that = this,
        columnsController = this.columnsController;

    var dataSource = new DataSource({
        load: function() {
            var d = $.Deferred();

            setTimeout(function() {
                d.resolve([{ "a": 1 }, { "a": 3 }, { "a": 2 }]);
            });

            return d.promise();
        },
        onChanged: function() {
            columnsController.applyDataSource(dataSource);
            assert.deepEqual(that.getColumns(), [{
                index: 0,
                dataField: "a",
                caption: "A",
                visible: true,
                showEditorAlways: false,
                allowFiltering: true,
                alignment: 'right',
                dataType: 'number'
            }]);
            done();
        }
    });

    dataSource.load();
    assert.deepEqual(this.columnsController.getColumns(), []);
});

// T105745
QUnit.test("Initialize from custom store", function(assert) {
    // arrange
    var columnsController = this.columnsController,
        items = [{ Column1: "Test1", Column2: "2012/01/01" }, { Column1: "Test1", Column2: "2013/05/04" }, { Column1: "Test2", Column2: "2014/03/05" }];

    this.applyOptions({
        columns: ["Column1", { dataField: "Column2", dataType: "date" }]
    });

    var dataSource = new DataSource({
        group: "Column1",
        load: function(options) {
            return items;
        },
        totalCount: function() {
            return 3;
        }
    });

    var dataAdapter = dataSourceAdapter.create(this);

    dataAdapter.init(dataSource, { filtering: true, sorting: true, paging: true });
    dataSource = dataAdapter;

    dataSource.load();

    // act
    columnsController.applyDataSource(dataSource);

    // assert
    assert.deepEqual(dataSource.items()[0].items[0].Column2, "2012/01/01", "date 1");
    assert.deepEqual(dataSource.items()[0].items[1].Column2, "2013/05/04", "date 2");
    assert.deepEqual(dataSource.items()[1].items[0].Column2, "2014/03/05", "date 3");

    var column = columnsController.getColumns()[1];
    assert.deepEqual(column.calculateCellValue(dataSource.items()[0].items[0]), new Date("2012/01/01"), "date 1");
    assert.deepEqual(column.calculateCellValue(dataSource.items()[0].items[1]), new Date("2013/05/04"), "date 2");
    assert.deepEqual(column.calculateCellValue(dataSource.items()[1].items[0]), new Date("2014/03/05"), "date 3");
});

QUnit.test("isColumnOptionUsed method", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "field1", allowReordering: true },
            { dataField: "field2", allowReordering: false },
            { dataField: "field3", allowReordering: false }
        ]
    });

    // assert, act
    assert.ok(this.columnsController.isColumnOptionUsed("allowReordering"), "allowReordering");

    // arrange
    this.applyOptions({
        columns: [
            { dataField: "field1", allowReordering: true },
            { dataField: "field2", allowReordering: true },
            { dataField: "field3", allowReordering: true }
        ]
    });

    // assert, act
    assert.ok(this.columnsController.isColumnOptionUsed("allowReordering"), "allowReordering");

    // arrange
    this.applyOptions({
        columns: [
            { dataField: "field1", allowReordering: false },
            { dataField: "field2", allowReordering: false },
            { dataField: "field3", allowReordering: false }
        ]
    });

    // assert, act
    assert.ok(!this.columnsController.isColumnOptionUsed("allowReordering"), "allowReordering");
});

// T421307
QUnit.test("Initialize from array store. Field as a function", function(assert) {
    // arrange
    var dataSource = new DataSource([
        { name: 'Alex', age: 15, lastName: function() { } },
        ]),
        visibleColumns;

    dataSource.load();

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    visibleColumns = this.columnsController.getVisibleColumns();
    assert.equal(visibleColumns.length, 2, "count column");
    assert.strictEqual(visibleColumns[0].dataField, "name", "dataField of the first column");
    assert.strictEqual(visibleColumns[1].dataField, "age", "dataField of the second column");
});

QUnit.module("Update columns on initialization", { beforeEach: setupModule, afterEach: teardownModule });

var createMockDataSource = function(items, loadOptions) {
    loadOptions = loadOptions || {};
    return {
        group: function(group) {
            return loadOptions.group;
        },
        sort: function(sort) {
            return loadOptions.sort;
        },
        isLoaded: function() {
            return true;
        },
        items: function() {
            return items;
        },
        load: function() {
            return items;
        }
    };
};

QUnit.test("update column indexes for columns from options", function(assert) {

    this.applyOptions({
        columns: ["field1", "field2"]
    });
    this.columnsController.applyDataSource(createMockDataSource([{ field1: 1, field2: 2, field3: 2 }]));

    assert.strictEqual(this.columnsController.getColumns().length, 2);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getColumns()[0].index, 0);

    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'field2');
    assert.strictEqual(this.columnsController.getColumns()[1].index, 1);
});

QUnit.test("update column for columns with grouping", function(assert) {

    this.applyOptions({
        columns: ["field1", "field2"]
    });
    this.columnsController.applyDataSource(createMockDataSource([{ key: 1, items: [{ field1: 1, field2: 2, field3: 3 }] }], { group: 'field1' }));

    assert.strictEqual(this.columnsController.getColumns().length, 2);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'number');
    assert.strictEqual(this.columnsController.getColumns()[0].index, 0);

    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'field2');
    assert.strictEqual(this.columnsController.getColumns()[1].dataType, 'number');
    assert.strictEqual(this.columnsController.getColumns()[1].index, 1);
});

QUnit.test("update column indexes for columns from dataSource", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ field1: 1, field2: 2, field3: 3 }]));

    assert.strictEqual(this.columnsController.getColumns().length, 3);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getColumns()[0].index, 0);

    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'field2');
    assert.strictEqual(this.columnsController.getColumns()[1].index, 1);

    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'field3');
    assert.strictEqual(this.columnsController.getColumns()[2].index, 2);
});

QUnit.test("update number dataType for columns", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ number: 5, numberString: '666.6' }]));

    assert.strictEqual(this.columnsController.getColumns().length, 2);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'number');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'number');

    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'numberString');
    assert.strictEqual(this.columnsController.getColumns()[1].dataType, 'string'); // T160890
});

QUnit.test("update date dataType for columns", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ dateObject: new Date(2012, 1, 1), dateString: '5/25/2012', notDate: '1999-xxx' /* dateDotNetString: '/Date(1224043200000)/', dateISO8601: '1997-07-16T19:20:15.000Z', */ }]));

    assert.strictEqual(this.columnsController.getColumns().length, 3);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'dateObject');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'date');

    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'dateString');
    assert.strictEqual(this.columnsController.getColumns()[1].dataType, 'string');

    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'notDate');
    assert.strictEqual(this.columnsController.getColumns()[2].dataType, 'string');

    /* strictEqual(this.columnsController.getColumns()[3].dataField, 'dateDotNetString');
    assert.strictEqual(this.columnsController.getColumns()[3].dataType, 'date');

    assert.strictEqual(this.columnsController.getColumns()[4].dataField, 'dateISO8601');
    assert.strictEqual(this.columnsController.getColumns()[4].dataType, 'date'); */

});

QUnit.test("Q497179 - update dataType to date when it is not date", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ notDateString: 'AAA 1' }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'notDateString');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'string');
});

QUnit.test("update string dataType for columns when first value is number string", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ notNumberString: '666' }, { notNumberString: '666-6' }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'notNumberString');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'string');
});

QUnit.test("update string lookup dataType for columns when first value is number string", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'customerId', lookup: { valueExpr: 'id', displayExpr: 'phone', dataSource: [{ id: 1, phone: '1234567' }, { id: 2, phone: '123-45-67' }] } }]
    });
    this.columnsController.applyDataSource(createMockDataSource([{ customerId: 1 }, { customerId: 2 }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'customerId');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'number');
    assert.strictEqual(this.columnsController.getColumns()[0].lookup.dataType, 'string');
});

QUnit.test("update column serializer for date type", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'birthDate', dataType: 'date' }]
    });
    var items = [{ birthDate: '1985/5/16' }, { birthDate: '1980/1/25' }];
    this.columnsController.applyDataSource(createMockDataSource(items));

    var data = {};

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    var column = this.columnsController.getColumns()[0];

    assert.strictEqual(column.dataField, 'birthDate');
    assert.strictEqual(column.dataType, 'date');
    assert.strictEqual(column.serializationFormat, "yyyy/MM/dd");
    assert.deepEqual(column.calculateCellValue(items[0]), new Date('1985/5/16'));
    assert.deepEqual(column.serializeValue(new Date('1980/9/20')), '1980/09/20');

    // T596758
    assert.strictEqual(column.serializeValue("1980/09/20"), "1980/09/20");

    column.setCellValue(data, new Date('1980/9/20'));
    assert.deepEqual(data, { birthDate: '1980/09/20' }, "setCellValue");
    // T138486
    assert.strictEqual(this.columnsController.getColumns()[0].calculateCellValue({}), undefined, 'deserialize undefined value');
});

// T318688
QUnit.test("update column serializer for date type with datetime format", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'birthDate', dataType: 'date' }]
    });
    var items = [{ birthDate: '1985/5/16 12:15:00' }, { birthDate: '1980/1/25 12:15:00' }];
    this.columnsController.applyDataSource(createMockDataSource(items));

    var data = {};

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    var column = this.columnsController.getColumns()[0];

    assert.strictEqual(column.dataField, 'birthDate');
    assert.strictEqual(column.dataType, 'date');
    assert.strictEqual(column.serializationFormat, "yyyy/MM/dd HH:mm:ss");
    assert.deepEqual(column.calculateCellValue(items[0]), new Date('1985/5/16 12:15:00'));
    assert.deepEqual(column.serializeValue(new Date('1980/9/20 12:15:00')), '1980/09/20 12:15:00');
    column.setCellValue(data, new Date('1980/9/20 12:15:00'));
    assert.deepEqual(data, { birthDate: '1980/09/20 12:15:00' }, "setCellValue");
});

// T456200
QUnit.test("update column serializer for date type with number format on second page", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'birthDate', dataType: 'date' }]
    });

    var items = [{ birthDate: null }, { birthDate: null }];
    var dataSource = createMockDataSource(items);
    this.columnsController.applyDataSource(dataSource);

    // act
    items[0].birthDate = 999;
    this.columnsController.applyDataSource(dataSource);

    // assert
    var data = {};

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    var column = this.columnsController.getColumns()[0];

    assert.strictEqual(column.dataField, 'birthDate');
    assert.strictEqual(column.dataType, 'date');
    assert.strictEqual(column.serializationFormat, "number", "serializationFormat is defined");
    assert.deepEqual(column.calculateCellValue(items[0]), new Date(999), "calculateCellValue deserialize value");
    column.setCellValue(data, new Date(666));
    assert.deepEqual(data, { birthDate: 666 }, "setCellValue use serializationFormat");
});

QUnit.test("update column serializer for number type with string format on second page", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'age', dataType: 'number' }]
    });

    var items = [{ age: null }, { age: null }];
    var dataSource = createMockDataSource(items);
    this.columnsController.applyDataSource(dataSource);

    // act
    items[0].age = "10";
    this.columnsController.applyDataSource(dataSource);

    // assert
    var data = {};

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    var column = this.columnsController.getColumns()[0];

    assert.strictEqual(column.dataField, 'age');
    assert.strictEqual(column.dataType, 'number');
    assert.strictEqual(column.serializationFormat, "string", "serializationFormat is defined");
    assert.deepEqual(column.calculateCellValue(items[0]), 10, "calculateCellValue deserialize value");
    column.setCellValue(data, 20);
    assert.deepEqual(data, { age: "20" }, "setCellValue use serializationFormat");
});

QUnit.test("updateColumnDataTypes shouldn't be called if all data types with serializationFormats are defined", function(assert) {
    this.applyOptions({
        columns: [{ dataField: "name" }, { dataField: 'age', dataType: 'number' }]
    });

    var items = [{ name: "Test", age: 19 }];
    var dataSource = createMockDataSource(items);

    var spy = sinon.spy(this.columnsController, "updateColumnDataTypes");

    this.columnsController.applyDataSource(dataSource);

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.ok(spy.calledOnce, "updateColumnDataTypes is called once");
});

// T622253
QUnit.test("columnsChanged shouldn't be called on applyDataSource if data types aren't updated", function(assert) {
    // arrange
    var columnsChangedCalled,
        items = [{ name: "Test", age: null, country: null }, { name: "Test", age: null, country: null }],
        dataSource = createMockDataSource(items);

    this.applyOptions({
        columns: [
            { dataField: "name" },
            { dataField: "age", dataType: "number" },
            { dataField: "country", dataType: "string", lookup: { dataSource: ["test1", "test2"] } }
        ]
    });

    this.columnsController.applyDataSource(dataSource);
    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedCalled = true;
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.notOk(columnsChangedCalled, "columnsChanged isn't called");
});

QUnit.test("update column serializer for date type with iso8601 date time format", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;

    config().forceIsoDateParsing = true;
    try {
        this.applyOptions({
            columns: [{ dataField: 'birthDate', dataType: 'date' }]
        });
        var items = [{ birthDate: '1985-05-16T12:15:00' }, { birthDate: '1980-01-25T12:15:00' }];
        this.columnsController.applyDataSource(createMockDataSource(items));

        var data = {};

        assert.strictEqual(this.columnsController.getColumns().length, 1);

        var column = this.columnsController.getColumns()[0];

        assert.strictEqual(column.dataField, 'birthDate');
        assert.strictEqual(column.dataType, 'date');
        assert.strictEqual(column.serializationFormat, "yyyy-MM-ddTHH:mm:ss");
        assert.deepEqual(column.calculateCellValue(items[0]), new Date('1985/05/16 12:15:00'));
        assert.deepEqual(column.serializeValue(new Date('1985/05/16 12:15:00')), '1985-05-16T12:15:00');
        column.setCellValue(data, new Date('1985/05/16 12:15:00'));
        assert.deepEqual(data, { birthDate: '1985-05-16T12:15:00' }, "setCellValue");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test("update column serializer for date type with iso8601 date time UTC format", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;

    config().forceIsoDateParsing = true;
    try {
        this.applyOptions({
            columns: [{ dataField: 'birthDate', dataType: 'date' }]
        });
        var items = [{ birthDate: '1985-05-16T12:15:00Z' }, { birthDate: '1980-01-25T12:15:00Z' }];
        this.columnsController.applyDataSource(createMockDataSource(items));

        var data = {};

        assert.strictEqual(this.columnsController.getColumns().length, 1);

        var column = this.columnsController.getColumns()[0];

        var firstBirthDate = new Date(Date.UTC(1985, 4, 16, 12, 15));
        assert.strictEqual(column.dataField, 'birthDate');
        assert.strictEqual(column.dataType, 'date');
        assert.strictEqual(column.serializationFormat, "yyyy-MM-ddTHH:mm:ss'Z'");
        assert.deepEqual(column.calculateCellValue(items[0]), firstBirthDate);
        assert.deepEqual(column.serializeValue(firstBirthDate), '1985-05-16T12:15:00Z');
        column.setCellValue(data, firstBirthDate);
        assert.deepEqual(data, { birthDate: '1985-05-16T12:15:00Z' }, "setCellValue");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

QUnit.test("update column serializer for date type when dateSerializationFormat is defined and when no items", function(assert) {
    var defaultForceIsoDateParsing = config().forceIsoDateParsing;

    config().forceIsoDateParsing = true;
    try {
        this.applyOptions({
            dateSerializationFormat: "yyyy-MM-ddTHH:mm:ss",
            columns: [{ dataField: 'birthDate', dataType: 'date' }]
        });

        this.columnsController.applyDataSource(createMockDataSource([]));

        var data = {};

        assert.strictEqual(this.columnsController.getColumns().length, 1);

        var column = this.columnsController.getColumns()[0];

        var firstBirthDate = new Date('1985/05/16 12:15:00');
        assert.strictEqual(column.dataField, 'birthDate');
        assert.strictEqual(column.dataType, 'date');
        assert.strictEqual(column.serializationFormat, "yyyy-MM-ddTHH:mm:ss");
        assert.deepEqual(column.calculateCellValue({ birthDate: '1985-05-16T12:15:00' }), firstBirthDate);
        assert.deepEqual(column.serializeValue(firstBirthDate), '1985-05-16T12:15:00');
        column.setCellValue(data, firstBirthDate);
        assert.deepEqual(data, { birthDate: '1985-05-16T12:15:00' }, "setCellValue");
    } finally {
        config().forceIsoDateParsing = defaultForceIsoDateParsing;
    }
});

// T220171
QUnit.test("update string lookup for calculated column", function(assert) {
    this.applyOptions({
        columns: [{ calculateCellValue: function(data) { return data.customerId; }, lookup: { valueExpr: 'id', displayExpr: 'phone', dataSource: [{ id: 1, phone: '1234567' }, { id: 2, phone: '123-45-67' }] } }]
    });
    this.columnsController.applyDataSource(createMockDataSource([{ customerId: 1 }, { customerId: 2 }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'number');
    assert.strictEqual(this.columnsController.getColumns()[0].lookup.dataType, 'string');
    assert.ok(this.columnsController.getColumns()[0].lookup.calculateCellValue, 'calculateCellValue for lookup exists');
    assert.ok(this.columnsController.getColumns()[0].lookup.calculateCellValue(2), '123-45-67', 'calculateCellValue for lookup works correctly');
});

// T200352
QUnit.test("update column serializer for date type when the date is specified in milliseconds", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{ dataField: 'birthDate', dataType: 'date' }]
    });
    var items = [{ birthDate: 317595600000 }];

    // act
    this.columnsController.applyDataSource(createMockDataSource(items));

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 1);
    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'birthDate');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'date');
    assert.deepEqual(this.columnsController.getColumns()[0].calculateCellValue(items[0]), new Date(317595600000));
    assert.deepEqual(this.columnsController.getColumns()[0].serializeValue(new Date(317595600000)), 317595600000);
});

QUnit.test("update column serializer for date type when date instances", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'birthDate', dataType: 'date' }]
    });
    var items = [{ birthDate: new Date('1985/5/16') }, { birthDate: new Date('1980/1/25') }];
    this.columnsController.applyDataSource(createMockDataSource(items));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'birthDate');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'date');
    assert.deepEqual(this.columnsController.getColumns()[0].calculateCellValue(items[0]), new Date('1985/5/16'));
    assert.deepEqual(this.columnsController.getColumns()[0].serializeValue(new Date('1980/9/20')), new Date('1980/9/20'));
});

QUnit.test("update lookup serializer for date type", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'customerId', lookup: { dataType: 'date', valueExpr: 'id', displayExpr: 'birthDate', dataSource: [{ id: 1, birthDate: '1985/5/16' }, { id: 2, phone: '1980/1/25' }] } }]
    });

    this.columnsController.applyDataSource(createMockDataSource([{ customerId: 1 }, { customerId: 2 }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'customerId');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'number');
    assert.deepEqual(this.columnsController.getColumns()[0].lookup.calculateCellValue(1), new Date('1985/5/16'));
    assert.deepEqual(this.columnsController.getColumns()[0].lookup.serializeValue(new Date('1980/9/20')), '1980/09/20');
});

QUnit.test("update string dataType for columns", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ string: 'str' }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'string');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'string');
});

QUnit.test("update boolean dataType for columns", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ boolean: true, booleanString: 'false' }]));

    assert.strictEqual(this.columnsController.getColumns().length, 2);

    var column1 = this.columnsController.getColumns()[0];
    assert.strictEqual(column1.dataField, 'boolean');
    assert.strictEqual(column1.dataType, 'boolean');
    assert.ok(column1.customizeText, 'customizeText for boolean');

    assert.strictEqual(column1.customizeText({ value: undefined }), '', 'text for undefined');
    assert.strictEqual(column1.customizeText({ value: null }), '', 'text for null');
    assert.strictEqual(column1.customizeText({ value: false }), 'false', 'text for false');
    assert.strictEqual(column1.customizeText({ value: 0 }), '', 'text for 0');
    assert.strictEqual(column1.customizeText({ value: true }), 'true', 'text for true');
    assert.strictEqual(column1.customizeText({ value: 1 }), '', 'text for 1');

    column1.trueText = 'True';
    column1.falseText = 'False';

    assert.strictEqual(column1.customizeText({ value: undefined }), '', 'text for undefined');
    assert.strictEqual(column1.customizeText({ value: false }), 'False', 'text for false');
    assert.strictEqual(column1.customizeText({ value: true }), 'True', 'text for true');

    var column2 = this.columnsController.getColumns()[1];

    assert.strictEqual(column2.dataField, 'booleanString');
    assert.strictEqual(column2.dataType, 'string');
    assert.ok(!column2.customizeText, 'no customizeText');
});

QUnit.test("update unknown dataType for columns", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ object: {}, array: [] }]));

    assert.strictEqual(this.columnsController.getColumns().length, 2);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'object');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, "object");

    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'array');
    assert.strictEqual(this.columnsController.getColumns()[1].dataType, undefined);
});

QUnit.test("update alignment for columns", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ number: 55, string: 'str', date: new Date(), boolean: true }]));

    assert.strictEqual(this.columnsController.getColumns().length, 4);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'number');
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'string');
    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'date');
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'boolean');

    assert.strictEqual(this.columnsController.getColumns()[0].alignment, 'right');
    assert.strictEqual(this.columnsController.getColumns()[1].alignment, 'left');
    assert.strictEqual(this.columnsController.getColumns()[2].alignment, 'left');
    assert.strictEqual(this.columnsController.getColumns()[3].alignment, 'center');
});

QUnit.test("update alignment for columns - RTL case", function(assert) {
    this.option("rtlEnabled", true);
    this.columnsController.applyDataSource(createMockDataSource([{ number: 55, string: 'str', date: new Date(), boolean: true }]));

    assert.strictEqual(this.columnsController.getColumns().length, 4);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'number');
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'string');
    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'date');
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'boolean');

    assert.strictEqual(this.columnsController.getColumns()[0].alignment, 'right');
    assert.strictEqual(this.columnsController.getColumns()[1].alignment, 'right');
    assert.strictEqual(this.columnsController.getColumns()[2].alignment, 'right');
    assert.strictEqual(this.columnsController.getColumns()[3].alignment, 'center');
});

// T111525
QUnit.test("update alignment for columns after change rtlEnabled option", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ number: 55, string: 'str', date: new Date(), boolean: true }]));

    this.option("rtlEnabled", true);
    this.columnsController.optionChanged({ name: "rtlEnabled" });

    assert.strictEqual(this.columnsController.getColumns().length, 4);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'number');
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'string');
    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'date');
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'boolean');

    assert.strictEqual(this.columnsController.getColumns()[0].alignment, 'right');
    assert.strictEqual(this.columnsController.getColumns()[1].alignment, 'right');
    assert.strictEqual(this.columnsController.getColumns()[2].alignment, 'right');
    assert.strictEqual(this.columnsController.getColumns()[3].alignment, 'center');
});

QUnit.test("update alignment for columns when getVisibleColumns called before dataSource applying", function(assert) {
    var columnsController = this.columnsController;
    this.applyOptions({
        columns: ['number', 'string', 'date', 'boolean']
    });

    columnsController.getVisibleColumns();

    this.columnsController.applyDataSource(createMockDataSource([{ number: 55, string: 'str', date: new Date(), boolean: true }]));

    var visibleColumns = this.columnsController.getVisibleColumns();
    assert.strictEqual(visibleColumns.length, 4);

    assert.strictEqual(visibleColumns[0].dataField, 'number');
    assert.strictEqual(visibleColumns[1].dataField, 'string');
    assert.strictEqual(visibleColumns[2].dataField, 'date');
    assert.strictEqual(visibleColumns[3].dataField, 'boolean');

    assert.strictEqual(visibleColumns[0].alignment, 'right');
    assert.strictEqual(visibleColumns[1].alignment, 'left');
    assert.strictEqual(visibleColumns[2].alignment, 'left');
    assert.strictEqual(visibleColumns[3].alignment, 'center');
});

// T126949
QUnit.test("update columns after change grouping option", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ number: 55, string: 'str', date: new Date(), boolean: true }]));

    this.columnsController.columnOption('boolean', 'visible', false);

    assert.ok(!this.columnsController.getColumns()[0].autoExpandGroup);
    assert.ok(!this.columnsController.getColumns()[0].allowCollapsing);

    // act
    this.options.grouping = { autoExpandAll: true, allowCollapsing: true };
    this.columnsController.optionChanged({ name: "grouping" });

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 3);
    assert.strictEqual(this.columnsController.getColumns().length, 4);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'number');
    assert.ok(this.columnsController.getColumns()[0].autoExpandGroup);
    assert.ok(this.columnsController.getColumns()[0].allowCollapsing);
});

// T126949
QUnit.test("update columns after change groupPanel option", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ number: 55, string: 'str', date: new Date(), boolean: true }]));

    this.columnsController.columnOption('boolean', 'visible', false);

    assert.ok(!this.columnsController.getColumns()[0].allowGrouping);

    // act
    this.options.groupPanel = { allowColumnDragging: true, visible: true };
    this.columnsController.optionChanged({ name: "groupPanel" });

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 3);
    assert.strictEqual(this.columnsController.getColumns().length, 4);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'number');
    assert.ok(this.columnsController.getColumns()[0].allowGrouping);
});

// T450159
QUnit.test("columns state should not be reset after nested columns option change", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'field1' }, { dataField: 'field2' }] });
    this.columnsController.applyDataSource(createMockDataSource([{ number: 55, string: 'str', date: new Date(), boolean: true }]));

    this.columnsController.columnOption('field1', 'visible', false);

    // act
    this.options.columns[0].allowSorting = false;
    this.columnsController.optionChanged({ name: "columns", fullName: "columns[0].allowSorting" });

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 1, "columns state is not reset");
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, "field2");
});

QUnit.test("columns state should be reset after columns option change", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'field1' }, { dataField: 'field2' }] });
    this.columnsController.applyDataSource(createMockDataSource([{ number: 55, string: 'str', date: new Date(), boolean: true }]));

    this.columnsController.columnOption('field1', 'visible', false);

    // act
    this.columnsController.optionChanged({ name: "columns", fullName: "columns" });

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 2, "columns state is reset");
});

// T464811
QUnit.test("Change column option via option method", function(assert) {
    var visibleColumns;

    this.applyOptions({ columns: [{ dataField: "field1" }, { dataField: "field2" }] });
    this.columnsController.applyDataSource(createMockDataSource([{ field1: "test1", field2: "test2" }]));

    // act
    this.columnsController.optionChanged({ name: "columns", fullName: "columns[0].visible", value: false });

    // assert
    visibleColumns = this.columnsController.getVisibleColumns();
    assert.strictEqual(visibleColumns.length, 1, "columns state is not reset");
    assert.strictEqual(visibleColumns[0].dataField, "field2");
});

QUnit.test("Change column option via option method (for band columns)", function(assert) {
    var visibleColumns;

    this.applyOptions({ columns: [
        { dataField: "field1" },
        { caption: "Band column 1", columns: [
            { dataField: "field2" },
            { caption: "Band column 2", columns: [
                { dataField: "field3" },
                { dataField: "field4" }
            ] },
            { dataField: "field5" }] }
    ] });
    this.columnsController.applyDataSource(createMockDataSource([{ field1: "test1", field2: "test2", field3: "test3", field4: "test4", field5: "test5" }]));

    // act
    this.columnsController.optionChanged({ name: "columns", fullName: "columns[1].columns[1].columns[0].visible", value: false });

    // assert
    visibleColumns = this.columnsController.getVisibleColumns();
    assert.strictEqual(visibleColumns.length, 4, "columns state is not reset");
    assert.strictEqual(visibleColumns[0].dataField, "field1");
    assert.strictEqual(visibleColumns[1].dataField, "field2");
    assert.strictEqual(visibleColumns[2].dataField, "field4");
    assert.strictEqual(visibleColumns[3].dataField, "field5");
});

QUnit.test("Change column visibility via option method when band column placed before it", function(assert) {
    var visibleColumns;

    this.applyOptions({ columns: [
        { dataField: "field1" },
        { caption: "Band", columns: [
            { dataField: "field2" },
            { dataField: "field3" }]
        },
        { dataField: "field4" },
        { dataField: "field5" }
    ] });
    this.columnsController.applyDataSource(createMockDataSource([{ field1: "test1", field2: "test2", field3: "test3", field4: "test4", field5: "test5" }]));

    // act
    this.columnsController.optionChanged({ name: "columns", fullName: "columns[2].visible", value: false });

    // assert
    visibleColumns = this.columnsController.getVisibleColumns();
    assert.strictEqual(visibleColumns.length, 4, "columns state is not reset");
    assert.strictEqual(visibleColumns[0].dataField, "field1");
    assert.strictEqual(visibleColumns[1].dataField, "field2");
    assert.strictEqual(visibleColumns[2].dataField, "field3");
    assert.strictEqual(visibleColumns[3].dataField, "field5");
});

QUnit.test("Change column option via option method when option value as object", function(assert) {
    var visibleColumns;
    this.applyOptions({ columns: [{ dataField: "field1" }, { dataField: "field2" }] });
    this.columnsController.applyDataSource(createMockDataSource([{ field1: "test1", field2: "test2" }]));

    // act
    this.columnsController.optionChanged({ name: "columns", fullName: "columns[0]", value: { visible: false } });

    // assert
    visibleColumns = this.columnsController.getVisibleColumns();
    assert.strictEqual(visibleColumns.length, 1, "columns state is not reset");
    assert.strictEqual(visibleColumns[0].dataField, "field2");
});

QUnit.test("Change column option via option method when option value as object (for band columns)", function(assert) {
    var visibleColumns;

    this.applyOptions({ columns: [
        { dataField: "field1" },
        { caption: "Band column 1", columns: [
            { dataField: "field2" },
            { caption: "Band column 2", columns: [
                { dataField: "field3" },
                { dataField: "field4" }
            ] },
            { dataField: "field5" }] }
    ] });
    this.columnsController.applyDataSource(createMockDataSource([{ field1: "test1", field2: "test2", field3: "test3", field4: "test4", field5: "test5" }]));

    // act
    this.columnsController.optionChanged({ name: "columns", fullName: "columns[1].columns[1].columns[0]", value: { visible: false } });

    // assert
    visibleColumns = this.columnsController.getVisibleColumns();
    assert.strictEqual(visibleColumns.length, 4, "columns state is not reset");
    assert.strictEqual(visibleColumns[0].dataField, "field1");
    assert.strictEqual(visibleColumns[1].dataField, "field2");
    assert.strictEqual(visibleColumns[2].dataField, "field4");
    assert.strictEqual(visibleColumns[3].dataField, "field5");
});

QUnit.test("update format for columns", function(assert) {
    this.columnsController.applyDataSource(createMockDataSource([{ number: 55, string: 'str', date: new Date(), boolean: true }]));

    assert.strictEqual(this.columnsController.getColumns().length, 4);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'number');
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'string');
    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'date');
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'boolean');

    assert.strictEqual(this.columnsController.getColumns()[0].format, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].format, undefined);
    assert.strictEqual(this.columnsController.getColumns()[2].format, 'shortDate');
    assert.strictEqual(this.columnsController.getColumns()[3].format, undefined);
});

QUnit.test("not update alignment from columns options", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'number', alignment: 'center' }, 'string'] });
    this.columnsController.applyDataSource(createMockDataSource([{ string: 'asdasd', number: 444, boolean: true }]));

    assert.strictEqual(this.columnsController.getColumns().length, 2);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'number');
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'string');

    assert.strictEqual(this.columnsController.getColumns()[0].alignment, 'center');
    assert.strictEqual(this.columnsController.getColumns()[1].alignment, 'left');
});

QUnit.test("not update format from columns options", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'date', format: 'longDate' }] });
    this.columnsController.applyDataSource(createMockDataSource([{ date: new Date() }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'date');
    assert.strictEqual(this.columnsController.getColumns()[0].format, 'longDate');
});

QUnit.test("initialize filterOperations for number dataType", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'number' }] });
    this.columnsController.applyDataSource(createMockDataSource([{ number: 123 }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'number');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'number');
    assert.deepEqual(this.columnsController.getColumns()[0].filterOperations, ["=", "<>", "<", ">", "<=", ">=", "between"]);
    assert.equal(this.columnsController.getColumns()[0].defaultFilterOperation, "=");
});

QUnit.test("initialize filterOperations for string dataType", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'str' }] });
    this.columnsController.applyDataSource(createMockDataSource([{ str: 'xxx' }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'str');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'string');
    assert.deepEqual(this.columnsController.getColumns()[0].filterOperations, ["contains", "notcontains", "startswith", "endswith", "=", "<>"]);
    assert.equal(this.columnsController.getColumns()[0].defaultFilterOperation, "contains");
});

QUnit.test("initialize filterOperations for date dataType", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'date' }] });
    this.columnsController.applyDataSource(createMockDataSource([{ date: new Date() }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'date');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'date');
    assert.deepEqual(this.columnsController.getColumns()[0].filterOperations, ["=", "<>", "<", ">", "<=", ">=", "between"]);
    assert.equal(this.columnsController.getColumns()[0].defaultFilterOperation, "=");
});

QUnit.test("initialize filterOperations for another dataType", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'xxx', dataType: 'xxx' }] });
    this.columnsController.applyDataSource(createMockDataSource([{ xxx: 'xxx' }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'xxx');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'xxx');
    assert.deepEqual(this.columnsController.getColumns()[0].filterOperations, []);
    assert.equal(this.columnsController.getColumns()[0].defaultFilterOperation, "=");
});

// T451036
QUnit.test("initialize filterOperations when no data on first load", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'str' }] });
    var array = [];
    var dataSource = createMockDataSource(array);
    this.columnsController.applyDataSource(dataSource);

    array.push({ str: 'xxx' });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'str');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'string');
    assert.deepEqual(this.columnsController.getColumns()[0].filterOperations, ["contains", "notcontains", "startswith", "endswith", "=", "<>"]);
    assert.equal(this.columnsController.getColumns()[0].defaultFilterOperation, "contains");
});

// T451036
QUnit.test("columnsChanged event should not be fired when columns without dataType are exist", function(assert) {
    this.applyOptions({ columns: ['str', "unknown"] });
    var dataSource = createMockDataSource([{ str: 'xxx' }]);
    this.columnsController.applyDataSource(dataSource);

    var columnChangedCallCount = 0;
    this.columnsController.columnsChanged.add(function() {
        columnChangedCallCount++;
    });

    // act
    this.columnsController.applyDataSource(dataSource);

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 2);
    assert.strictEqual(columnChangedCallCount, 0);
});

QUnit.test("Predefined filterOperations in column options", function(assert) {
    this.applyOptions({ columns: [{ dataField: 'str', filterOperations: ['<', '>'] }] });
    this.columnsController.applyDataSource(createMockDataSource([{ str: 'string' }]));

    assert.strictEqual(this.columnsController.getColumns().length, 1);

    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'str');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'string');
    assert.deepEqual(this.columnsController.getColumns()[0].filterOperations, ['<', '>']);
    assert.equal(this.columnsController.getColumns()[0].defaultFilterOperation, "<");
});

QUnit.test("change column on customizeColumns", function(assert) {
    var customizeColumnsCount = 0;

    this.applyOptions({
        columns: [{ dataField: 'number', alignment: 'center' }, 'string'],
        customizeColumns: function(columns) {
            assert.strictEqual(columns.length, 2);

            assert.strictEqual(columns[0].dataField, 'number');
            assert.strictEqual(columns[0].dataType, undefined);
            assert.strictEqual(columns[0].alignment, 'center');
            assert.strictEqual(columns[0].index, 0);
            assert.ok(columns[0].visible);

            assert.strictEqual(columns[1].dataField, 'string');
            assert.strictEqual(columns[1].dataType, undefined);
            assert.strictEqual(columns[1].alignment, undefined);
            assert.strictEqual(columns[1].index, 1);
            assert.ok(columns[1].visible);

            customizeColumnsCount++;

            // act
            columns[0].alignment = 'left';
            columns[1].visible = false;
        }
    });

    this.columnsController.applyDataSource(createMockDataSource([{ string: 'asdasd', number: 444, boolean: true }]));

    assert.strictEqual(customizeColumnsCount, 1);
    assert.strictEqual(this.columnsController.getColumns().length, 2);
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 1);
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, 'number');
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataType, 'number');
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].alignment, 'left');
});


QUnit.test("add column on customizeColumns", function(assert) {
    var customizeColumnsCount = 0;

    this.applyOptions({
        columns: ['first', 'second'],
        customizeColumns: function(columns) {
            customizeColumnsCount++;

            columns.splice(0, 0, 'zero');
            columns.push({
                visible: false,
                allowFiltering: true,
                dataField: 'third'
            });
        }
    });

    this.columnsController.applyDataSource(createMockDataSource([{ first: 'asdasd', second: 444 }]));

    assert.strictEqual(customizeColumnsCount, 1);
    assert.strictEqual(this.columnsController.getColumns().length, 4);
    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'zero');
    assert.strictEqual(this.columnsController.getColumns()[0].visible, true);
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'third');
    assert.strictEqual(this.columnsController.getColumns()[3].visible, false);
});

QUnit.test("remove column on customizeColumns", function(assert) {
    var customizeColumnsCount = 0;

    this.applyOptions({
        columns: ['first', 'second'],
        customizeColumns: function(columns) {
            customizeColumnsCount++;
            columns.splice(0, 1);
        }
    });

    this.columnsController.applyDataSource(createMockDataSource([{ first: 'asdasd', second: 444 }]));

    assert.strictEqual(customizeColumnsCount, 1);
    assert.strictEqual(this.columnsController.getColumns().length, 1);
    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'second');
    assert.strictEqual(this.columnsController.getColumns()[0].dataType, 'number');
});

QUnit.test("insert select column on update when showCheckBoxesMode is onClick", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', allowSorting: false }
        ],
        selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
    });

    this.columnsController.applyDataSource(createMockDataSource([{ TestField1: 'asdasd', TestField2: 444 }]));
    assert.ok(this.columnsController.isInitialized());
    assert.equal(this.columnsController.getVisibleColumns().length, 3);
    assert.deepEqual(this.getVisibleColumns()[0], {
        visible: true,
        command: 'select',
        dataType: 'boolean',
        alignment: 'center',
        width: 'auto',
        cssClass: 'dx-command-select',
        index: -2
    });
});

QUnit.test("insert select column on update when showCheckBoxesMode is always", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { dataField: 'TestField2', caption: 'Custom Title 2', allowSorting: false }
        ],
        selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
    });

    this.columnsController.applyDataSource(createMockDataSource([{ TestField1: 'asdasd', TestField2: 444 }]));
    assert.ok(this.columnsController.isInitialized());
    assert.equal(this.columnsController.getVisibleColumns().length, 3);
    assert.deepEqual(this.getVisibleColumns()[0], {
        visible: true,
        command: 'select',
        dataType: 'boolean',
        alignment: 'center',
        width: 'auto',
        cssClass: 'dx-command-select',
        index: -2
    });
});

QUnit.test("remove user defined select columns on update when no showCheckboxes", function(assert) {
    this.applyOptions({
        columns: [
            { command: 'select' },
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { command: 'select' },
            { dataField: 'TestField2', caption: 'Custom Title 2', allowSorting: false }
        ],
        selection: { mode: 'multiple' }
    });

    this.columnsController.applyDataSource(createMockDataSource([{ TestField1: 'asdasd', TestField2: 444 }]));
    assert.ok(this.columnsController.isInitialized());
    assert.equal(this.columnsController.getVisibleColumns().length, 2);
    assert.equal(this.columnsController.getVisibleColumns()[0].dataField, 'TestField1');
    assert.equal(this.columnsController.getVisibleColumns()[1].dataField, 'TestField2');
});

QUnit.test("remove user defined select columns on update when showCheckboxes enabled", function(assert) {
    this.applyOptions({
        columns: [
            { dataField: 'TestField1', caption: 'Custom Title 1' },
            { command: 'select' },
            { command: 'select' },
            { dataField: 'TestField2', caption: 'Custom Title 2', allowSorting: false }
        ],
        selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
    });

    this.columnsController.applyDataSource(createMockDataSource([{ TestField1: 'asdasd', TestField2: 444 }]));
    assert.ok(this.columnsController.isInitialized());
    assert.equal(this.columnsController.getVisibleColumns().length, 3);
    assert.equal(this.columnsController.getVisibleColumns()[0].command, 'select');
    assert.equal(this.columnsController.getVisibleColumns()[0].dataType, 'boolean');
    assert.equal(this.columnsController.getVisibleColumns()[1].dataField, 'TestField1');
    assert.equal(this.columnsController.getVisibleColumns()[2].dataField, 'TestField2');
});

QUnit.module("Allow Move Columns", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("allow move allowReordering column", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: ["field1", "field2", "field3"] });

    assert.ok(this.columnsController.allowMoveColumn(0, 2));
});

QUnit.test("not allow move not allowReordering column", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: false }, columns: ["field1", "field2", "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(0, 2));
});

QUnit.test('allow move column when allowReordering false and allowGrouping true', function(assert) {
    // arrange
    this.applyOptions({ commonColumnSettings: { allowReordering: false, allowGrouping: true }, columns: ["field1", "field2", "field3"] });

    // act, assert
    assert.ok(this.columnsController.allowMoveColumn(0, 2));
});

QUnit.test("not allow move nonexistent column", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: ["field1", "field2", "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(5, 2));
});

QUnit.test("not allow move column to itself", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: ["field1", "field2", "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(1, 1));
});

QUnit.test("not allow move column to next column", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: ["field1", "field2", "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(0, 1));
});

QUnit.test("allow move column to nonexistent column", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: ["field1", "field2", "field3"] });

    assert.ok(this.columnsController.allowMoveColumn(1, 5));
});

QUnit.test("allow move column to groups when allowGrouping", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: ["field1", { dataField: "field2", allowGrouping: true }, "field3"] });
    assert.ok(this.columnsController.allowMoveColumn(1, 0, 'headers', 'group'));
});

QUnit.test("not allow move column from headers to groups when not allowGrouping", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: ["field1", "field2", "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(1, 1, 'headers', 'group'));
});

QUnit.test("allow move column from groups to headers when allowGrouping", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: ["field1", { dataField: "field2", groupIndex: 0, allowGrouping: true }, "field3"] });

    assert.ok(this.columnsController.allowMoveColumn(0, 1, 'group', 'headers'));
});

QUnit.test("not allow move column from groups to headers when not allowGrouping", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: ["field1", { dataField: "field2", groupIndex: 0, allowGrouping: false }, "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(0, 1, 'group', 'headers'));
});

QUnit.test("allow move column from column chooser to headers when not allowGrouping, allowReordering", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", visible: false, allowGrouping: false, allowReordering: false, allowHiding: true }, "field3"] });

    assert.ok(this.columnsController.allowMoveColumn(0, 0, 'columnChooser', 'headers'));
});

QUnit.test("allow move column from headers to column chooser when not allowGrouping, allowReordering", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", allowGrouping: false, allowReordering: false, allowHiding: true }, "field3"] });

    assert.ok(this.columnsController.allowMoveColumn(1, 0, 'headers', 'columnChooser'));
});

QUnit.test("not allow move column from headers to column chooser when not allowHiding", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", allowGrouping: true, allowReordering: true, allowHiding: false }, "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(1, 0, 'headers', 'columnChooser'));
});

QUnit.test("allow move column from column chooser to groups when not allowReordering", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", visible: false, allowGrouping: true, allowReordering: false, allowHiding: true }, "field3"] });

    assert.ok(this.columnsController.allowMoveColumn(0, 0, 'columnChooser', 'group'));
});

QUnit.test("allow move column from groups to column chooser when not allowReordering", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", groupIndex: 0, allowGrouping: true, allowReordering: false, allowHiding: true }, "field3"] });

    assert.ok(this.columnsController.allowMoveColumn(0, 0, 'group', 'columnChooser'));
});

QUnit.test("not allow move column from column chooser to groups when not allowGrouping, allowReordering", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", visible: false, allowGrouping: false, allowReordering: false, allowHiding: true }, "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(0, 0, 'columnChooser', 'group'));
});

QUnit.test("not allow move column from groups to column chooser when not allowHiding", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", groupIndex: 0, allowGrouping: true, allowReordering: true, allowHiding: false }, "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(0, 0, 'group', 'columnChooser'));
});

QUnit.test("not allow move column from column chooser to groups when not allowGrouping, allowReordering, allowHiding", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", visible: false, allowGrouping: false, allowReordering: false, allowHiding: false }, "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(0, 0, 'columnChooser', 'group'));
});

QUnit.test("not allow move column from column chooser to headers when not allowGrouping, allowReordering, allowHiding", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", visible: false, allowGrouping: false, allowReordering: false, allowHiding: false }, "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(0, 0, 'columnChooser', 'headers'));
});

QUnit.test("not allow move column from column chooser to column chooser with source order", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", visible: false, allowReordering: true, allowHiding: true }, "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(0, -1, 'columnChooser', 'columnChooser'));
});

QUnit.test("not allow move column from column chooser to column chooser with source order", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", visible: false, allowReordering: true, allowHiding: true }, { dataField: "field2", visible: false, allowReordering: true, allowHiding: true }, "field3"] });

    assert.ok(!this.columnsController.allowMoveColumn(0, 1, 'columnChooser', 'columnChooser'));
});

QUnit.test("allow move for band columns", function(assert) {
    this.applyOptions({ commonColumnSettings: { allowReordering: true }, columns: [{ caption: "Band Column 1", columns: ["Column1", "Column2"] }] });

    assert.ok(this.columnsController.allowMoveColumn({ columnIndex: 0, rowIndex: 1 }, { columnIndex: 2, rowIndex: 1 }));
});

QUnit.module("Move Columns", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("swap two columns", function(assert) {
    this.applyOptions({ columns: ["field1", "field2"] });

    this.columnsController.moveColumn(0, 2);

    assert.equal(this.columnsController.getColumns().length, 2);
    assert.equal(this.getColumns()[0].dataField, 'field1');
    assert.equal(this.getColumns()[1].dataField, 'field2');
    assert.equal(this.getVisibleColumns()[0].dataField, 'field2');
    assert.equal(this.getVisibleColumns()[1].dataField, 'field1');
});

QUnit.test("swap two band columns", function(assert) {
    // arrange
    var columns;

    this.applyOptions({ columns: [{ caption: "Band column 1", columns: ["Column1", "Column2"] }, { caption: "Band column 2", columns: ["Column3", "Column4"] }] });

    // act
    this.columnsController.moveColumn({ columnIndex: 0, rowIndex: 0 }, { columnIndex: 2, rowIndex: 0 });

    // assert
    columns = this.columnsController.getVisibleColumns();
    assert.equal(columns.length, 4);
    assert.equal(columns[0].caption, "Column 3", "caption of the first column");
    assert.equal(columns[1].caption, "Column 4", "caption of the second column");
    assert.equal(columns[2].caption, "Column 1", "caption of the third column");
    assert.equal(columns[3].caption, "Column 2", "caption of the fourth column");
});

QUnit.test("swap two columns with ownerBand", function(assert) {
    // arrange
    var columns;

    this.applyOptions({ columns: [{ caption: "Band column 1", columns: ["Column1", "Column2"] }] });

    // act
    this.columnsController.moveColumn({ columnIndex: 0, rowIndex: 1 }, { columnIndex: 2, rowIndex: 1 });

    // assert
    columns = this.columnsController.getVisibleColumns();
    assert.equal(columns.length, 2);
    assert.equal(columns[0].caption, "Column 2", "caption of the first column");
    assert.equal(columns[1].caption, "Column 1", "caption of the second column");
});

QUnit.test("Not move column when toVisibleIndex < 0", function(assert) {
    this.applyOptions({ columns: ["field1", "field2"] });

    this.columnsController.moveColumn(0, -1);

    assert.equal(this.getColumns().length, 2);
    assert.equal(this.getColumns()[0].dataField, 'field1');
    assert.equal(this.getColumns()[1].dataField, 'field2');
    assert.equal(this.getVisibleColumns()[0].dataField, 'field1');
    assert.equal(this.getVisibleColumns()[1].dataField, 'field2');
});

QUnit.test("move column to center", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3", "field4", "field5"] });

    this.columnsController.moveColumn(4, 2);

    assert.equal(this.getVisibleColumns().length, 5);
    assert.equal(this.getVisibleColumns()[0].dataField, 'field1');
    assert.equal(this.getVisibleColumns()[1].dataField, 'field2');
    assert.equal(this.getVisibleColumns()[2].dataField, 'field5');
    assert.equal(this.getVisibleColumns()[3].dataField, 'field3');
    assert.equal(this.getVisibleColumns()[4].dataField, 'field4');
});

QUnit.test("move column to end", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3", "field4", "field5"] });

    this.columnsController.moveColumn(1, 5);

    assert.equal(this.columnsController.getVisibleColumns().length, 5);
    assert.equal(this.columnsController.getVisibleColumns()[0].dataField, 'field1');
    assert.equal(this.columnsController.getVisibleColumns()[1].dataField, 'field3');
    assert.equal(this.columnsController.getVisibleColumns()[2].dataField, 'field4');
    assert.equal(this.columnsController.getVisibleColumns()[3].dataField, 'field5');
    assert.equal(this.columnsController.getVisibleColumns()[4].dataField, 'field2');
});

// B254953
QUnit.test("move column to end before command column", function(assert) {
    this.applyOptions({
        columns: ["field1", "field2", "field3", "field4", "field5"],
        editing: {
            allowDeleting: true
        }
    });

    this.columnsController.moveColumn(1, 5);

    assert.equal(this.columnsController.getColumns().length, 5);
    assert.equal(this.columnsController.getVisibleColumns().length, 6);
    assert.equal(this.columnsController.getVisibleColumns()[0].dataField, 'field1');
    assert.equal(this.columnsController.getVisibleColumns()[1].dataField, 'field3');
    assert.equal(this.columnsController.getVisibleColumns()[2].dataField, 'field4');
    assert.equal(this.columnsController.getVisibleColumns()[3].dataField, 'field5');
    assert.equal(this.columnsController.getVisibleColumns()[4].dataField, 'field2');
    assert.equal(this.columnsController.getVisibleColumns()[5].command, 'edit');
});

QUnit.test("move column to QUnit.start", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3", "field4", "field5"] });

    this.columnsController.moveColumn(3, 0);

    assert.equal(this.columnsController.getVisibleColumns().length, 5);
    assert.equal(this.columnsController.getVisibleColumns()[0].dataField, 'field4');
    assert.equal(this.columnsController.getVisibleColumns()[1].dataField, 'field1');
    assert.equal(this.columnsController.getVisibleColumns()[2].dataField, 'field2');
    assert.equal(this.columnsController.getVisibleColumns()[3].dataField, 'field3');
    assert.equal(this.columnsController.getVisibleColumns()[4].dataField, 'field5');
});

QUnit.test("move column when grouped columns exists", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 0 }, "field4", "field5"] });

    this.columnsController.moveColumn(3, 1);

    assert.equal(this.columnsController.getColumns().length, 5);
    assert.equal(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.equal(this.columnsController.getColumns()[1].dataField, 'field2');
    assert.equal(this.columnsController.getColumns()[2].dataField, 'field3');
    assert.equal(this.columnsController.getColumns()[3].dataField, 'field4');
    assert.equal(this.columnsController.getColumns()[4].dataField, 'field5');

    assert.equal(this.columnsController.getVisibleColumns().length, 5);
    assert.equal(this.columnsController.getVisibleColumns()[0].dataField, 'field3');
    assert.equal(this.columnsController.getVisibleColumns()[0].command, 'expand');
    assert.equal(this.columnsController.getVisibleColumns()[1].dataField, 'field4');
    assert.equal(this.columnsController.getVisibleColumns()[2].dataField, 'field1');
    assert.equal(this.columnsController.getVisibleColumns()[3].dataField, 'field2');
    assert.equal(this.columnsController.getVisibleColumns()[4].dataField, 'field5');
});


QUnit.test("move column to end when out of array range", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3", "field4", "field5"] });

    this.columnsController.moveColumn(3, 6);

    assert.equal(this.columnsController.getVisibleColumns().length, 5);
    assert.equal(this.columnsController.getVisibleColumns()[0].dataField, 'field1');
    assert.equal(this.columnsController.getVisibleColumns()[1].dataField, 'field2');
    assert.equal(this.columnsController.getVisibleColumns()[2].dataField, 'field3');
    assert.equal(this.columnsController.getVisibleColumns()[3].dataField, 'field5');
    assert.equal(this.columnsController.getVisibleColumns()[4].dataField, 'field4');
});

QUnit.test('Reset columnIndex after move column', function(assert) {
    // arrange
    this.applyOptions({
        columns: ["field1", "field2", "field3", "field4", "field5"]
    });

    // act
    this.columnsController.moveColumn(4, 2);

    // assert
    assert.deepEqual(this.columnsController._columns.length, 5, 'columns count');
    assert.equal(this.columnsController._columns[0].index, 0, 'columns 0 index');
    assert.equal(this.columnsController._columns[1].index, 1, 'columns 1 index');
    assert.equal(this.columnsController._columns[2].index, 2, 'columns 2 index');
    assert.equal(this.columnsController._columns[3].index, 3, 'columns 3 index');
    assert.equal(this.columnsController._columns[4].index, 4, 'columns 4 index');
});


QUnit.test("move column from group panel to headers", function(assert) {
    var columnsChangedArgs;
    this.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 0 }, "field4", "field5"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(0, 2, 'group', 'headers');

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 5);
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].dataField, 'field3');
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].groupIndex, undefined);
    assert.strictEqual(this.columnsController.getVisibleColumns()[2].dataField, 'field2');
    assert.strictEqual(this.columnsController.getVisibleColumns()[3].dataField, 'field4');
    assert.strictEqual(this.columnsController.getVisibleColumns()[4].dataField, 'field5');
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { columns: true, grouping: true, length: 2 },
        optionNames: { groupIndex: true, visibleIndex: true, length: 2 },
        columnIndex: 2
    });
});

QUnit.test("move column from group panel to headers without visibleIndex", function(assert) {
    var columnsChangedArgs;
    this.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 0 }, "field4", "field5"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    var unknownVisibleIndex = -1;

    // act
    this.columnsController.moveColumn(0, unknownVisibleIndex, 'group', 'headers');

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 5);
    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'field2');
    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'field3');
    assert.strictEqual(this.columnsController.getColumns()[2].groupIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'field4');
    assert.strictEqual(this.columnsController.getColumns()[4].dataField, 'field5');
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { grouping: true, length: 1 },
        optionNames: { groupIndex: true, length: 1 },
        columnIndex: 2
    });
});

QUnit.test("move column from group panel to column chooser", function(assert) {
    // arrange
    var columnsChangedArgs,
        hiddenColumns;

    this.applyOptions({ columns: ["field1", { dataField: "field2", groupIndex: 0 }, "field3"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(0, 0, "group", "columnChooser");
    hiddenColumns = this.columnsController.getInvisibleColumns();

    // assert
    assert.equal(hiddenColumns.length, 1, "count hidden columns");
    assert.strictEqual(hiddenColumns[0].dataField, "field2", "dataField column");

    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { columns: true, grouping: true, length: 2 },
        columnIndex: 1,
        optionNames: { length: 3, visible: true, groupIndex: true, visibleIndex: true }
    }, "changeType");
});

QUnit.test("move column from group panel to group panel", function(assert) {
    var columnsChangedArgs;
    this.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 1 }, { dataField: "field4", groupIndex: 0 }, { dataField: "field5", groupIndex: 2 }] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(0, 2, 'group', 'group');

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 5);
    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'field2');
    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'field3');
    assert.strictEqual(this.columnsController.getColumns()[2].groupIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'field4');
    assert.strictEqual(this.columnsController.getColumns()[3].groupIndex, 1);
    assert.strictEqual(this.columnsController.getColumns()[4].dataField, 'field5');
    assert.strictEqual(this.columnsController.getColumns()[4].groupIndex, 2);
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { grouping: true, length: 1 },
        optionNames: { groupIndex: true, length: 1 },
        columnIndex: 3
    });
});

QUnit.test("move column from group panel to group panel unknown visible index", function(assert) {
    var columnsChangedArgs;
    this.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 1 }, { dataField: "field4", groupIndex: 0 }, { dataField: "field5", groupIndex: 2 }] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    var unknownVisibleIndex = -1;

    // act
    this.columnsController.moveColumn(0, unknownVisibleIndex, 'group', 'group');

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 5);
    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'field2');
    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'field3');
    assert.strictEqual(this.columnsController.getColumns()[2].groupIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'field4');
    assert.strictEqual(this.columnsController.getColumns()[3].groupIndex, 2);
    assert.strictEqual(this.columnsController.getColumns()[4].dataField, 'field5');
    assert.strictEqual(this.columnsController.getColumns()[4].groupIndex, 1);
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { grouping: true, length: 1 },
        optionNames: { groupIndex: true, length: 1 },
        columnIndex: 3
    });
});

QUnit.test("move column from group panel to group panel visible index more max", function(assert) {
    var columnsChangedArgs;
    this.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 1 }, { dataField: "field4", groupIndex: 0 }, { dataField: "field5", groupIndex: 2 }] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(0, 3, 'group', 'group');

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 5);
    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'field2');
    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'field3');
    assert.strictEqual(this.columnsController.getColumns()[2].groupIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'field4');
    assert.strictEqual(this.columnsController.getColumns()[3].groupIndex, 2);
    assert.strictEqual(this.columnsController.getColumns()[4].dataField, 'field5');
    assert.strictEqual(this.columnsController.getColumns()[4].groupIndex, 1);
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { grouping: true, length: 1 },
        optionNames: { groupIndex: true, length: 1 },
        columnIndex: 3
    });
});

QUnit.test("move column from headers to group panel", function(assert) {
    var columnsChangedArgs;
    this.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 1 }, { dataField: "field4", groupIndex: 0 }, "field5"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(2, 1, 'headers', 'group');

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 5);
    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getColumns()[0].groupIndex, 1);
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, 'field2');
    assert.strictEqual(this.columnsController.getColumns()[2].dataField, 'field3');
    assert.strictEqual(this.columnsController.getColumns()[2].groupIndex, 2);
    assert.strictEqual(this.columnsController.getColumns()[3].dataField, 'field4');
    assert.strictEqual(this.columnsController.getColumns()[3].groupIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[4].dataField, 'field5');
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { grouping: true, length: 1 },
        optionNames: { groupIndex: true, length: 1 },
        columnIndex: 0
    });
});

QUnit.test("move column from headers to column chooser", function(assert) {
    // arrange
    var columnsChangedArgs,
        hiddenColumns;

    this.applyOptions({ columns: ["field1", "field2", "field3"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(1, 0, "headers", "columnChooser");
    hiddenColumns = this.columnsController.getInvisibleColumns();

    // assert
    assert.equal(hiddenColumns.length, 1, "count hidden columns");
    assert.strictEqual(hiddenColumns[0].dataField, "field2", "dataField column");
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { columns: true, length: 1 },
        columnIndex: 1,
        optionNames: { length: 2, visible: true, visibleIndex: true }
    }, "changeType");
});

QUnit.test("move column with groupIndex from headers to group panel", function(assert) {
    var columnsChangedArgs;
    this.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 1 }, { dataField: "field4", groupIndex: 0 }, "field5"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(0, 2, 'headers', 'group');

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 5);
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, 'field3');
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].groupIndex, 0);
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].dataField, 'field4');
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].groupIndex, 1);
    assert.strictEqual(this.columnsController.getVisibleColumns()[2].dataField, 'field1');
    assert.strictEqual(this.columnsController.getVisibleColumns()[2].groupIndex, undefined);
    assert.strictEqual(this.columnsController.getVisibleColumns()[3].dataField, 'field2');
    assert.strictEqual(this.columnsController.getVisibleColumns()[4].dataField, 'field5');
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { grouping: true, length: 1 },
        optionNames: { groupIndex: true, length: 1 },
        columnIndex: 3
    });
});

QUnit.test("move column with groupIndex from headers to headers", function(assert) {
    var columnsChangedArgs;
    this.applyOptions({ columns: ["field1", "field2", { dataField: "field3", groupIndex: 1, showWhenGrouped: true }, { dataField: "field4", groupIndex: 0 }, "field5"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(4, 2, 'headers', 'headers');

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 6);
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, 'field4');
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].groupIndex, 0);
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].dataField, 'field3');
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].command, 'expand');
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].groupIndex, 1);
    assert.strictEqual(this.columnsController.getVisibleColumns()[2].dataField, 'field3');
    assert.strictEqual(this.columnsController.getVisibleColumns()[2].command, undefined);
    assert.strictEqual(this.columnsController.getVisibleColumns()[2].groupIndex, 1);
    assert.strictEqual(this.columnsController.getVisibleColumns()[3].dataField, 'field1');
    assert.strictEqual(this.columnsController.getVisibleColumns()[4].dataField, 'field2');
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { columns: true, length: 1 },
        optionNames: { visibleIndex: true, length: 1 },
        columnIndex: 2
    });
});

QUnit.test("move column from column chooser to headers", function(assert) {
    // arrange
    var columnsChangedArgs,
        visibleColumns;

    this.applyOptions({ columns: ["field1", { dataField: "field2", visible: false }, "field3"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(0, 0, "columnChooser", "headers");
    visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(visibleColumns.length, 3, "count visible columns");
    assert.strictEqual(visibleColumns[0].dataField, "field2", "dataField column");
    assert.strictEqual(visibleColumns[1].dataField, "field1", "dataField column");
    assert.strictEqual(visibleColumns[2].dataField, "field3", "dataField column");
    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { columns: true, length: 1 },
        columnIndex: 1,
        optionNames: { length: 2, visible: true, visibleIndex: true }
    }, "changeType");
});

QUnit.test("move column from column chooser to group", function(assert) {
    // arrange
    var columnsChangedArgs,
        visibleGroupColumns;

    this.applyOptions({ columns: ["field1", { dataField: "field2", visible: false }, "field3"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedArgs = args;
    });

    // act
    this.columnsController.moveColumn(0, 0, "columnChooser", "group");
    visibleGroupColumns = this.columnsController.getGroupColumns();

    // assert
    assert.equal(visibleGroupColumns.length, 1, "count visible group columns");
    assert.strictEqual(visibleGroupColumns[0].dataField, "field2", "dataField column");
    assert.equal(visibleGroupColumns[0].groupIndex, 0, "group index");

    assert.deepEqual(columnsChangedArgs, {
        changeTypes: { grouping: true, length: 2, columns: true },
        columnIndex: 1,
        optionNames: { length: 2, visible: true, groupIndex: true }
    }, "changeType");
});

// T129761
QUnit.test("getVisibleIndex after reordering", function(assert) {
    this.applyOptions({ columns: ["field1", "field2"] });

    this.columnsController.moveColumn(0, 2);

    assert.strictEqual(this.columnsController.getColumns().length, 2);
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, 'field2');
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].dataField, 'field1');
    assert.strictEqual(this.columnsController.getVisibleIndex(0), 1, 'visibleIndex of field1');
    assert.strictEqual(this.columnsController.getVisibleIndex(1), 0, 'visibleIndex of field2');
});
// T417832
QUnit.test("getVisibleIndex when there is group column that is not shown", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", index: 0 }, { dataField: "field2", index: 1, groupIndex: 0 }] });

    assert.strictEqual(this.columnsController.getColumns().length, 2, "columns count");
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 2, "visible columns count");
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, 'field2');
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].dataField, 'field1');
    assert.strictEqual(this.columnsController.getVisibleIndex(0), 1, 'visibleIndex of field1');
    assert.strictEqual(this.columnsController.getVisibleIndex(1), 0, 'visibleIndex of field2');
});
// T417832
QUnit.test("getVisibleIndex when there is group column that is shown", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", index: 0 }, { dataField: "field2", index: 1, groupIndex: 0, showWhenGrouped: true }] });

    assert.strictEqual(this.columnsController.getColumns().length, 2, "columns count");
    assert.strictEqual(this.columnsController.getVisibleColumns().length, 3, "visible columns count");
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, 'field2');
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].dataField, 'field1');
    assert.strictEqual(this.columnsController.getVisibleColumns()[2].dataField, 'field2');
    assert.strictEqual(this.columnsController.getVisibleIndex(0), 1, 'visibleIndex of field1');
    assert.strictEqual(this.columnsController.getVisibleIndex(1), 2, 'visibleIndex of field2');

});

// T556327
QUnit.test("sortOrder should not be reset after column is ungrouped", function(assert) {
    // arrange
    this.applyOptions({ columns: [{ dataField: "field1", sortOrder: "desc" }, "field2", "field3"] });
    this.columnsController.moveColumn(0, 0, "headers", "group");
    this.columnsController.columnOption(0, "sortOrder", "asc");

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].sortOrder, "asc");

    // act
    this.columnsController.moveColumn(0, 0, "group", "headers");

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, "field1");
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].sortOrder, "desc");
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].groupIndex, undefined);
});


QUnit.test("lastSortOrder should not be updated after changing the group index", function(assert) {
    // arrange
    this.applyOptions({ columns: [{ dataField: "field1", sortOrder: "desc" }, { dataField: "field2", groupIndex: 1 }, "field3"] });
    this.columnsController.moveColumn(1, 0, "headers", "group");
    this.columnsController.columnOption(0, "sortOrder", "asc");

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].dataField, "field1");
    assert.strictEqual(this.columnsController.getVisibleColumns()[0].sortOrder, "asc");

    // arrange
    this.columnsController.moveColumn(0, 2, "group", "group");

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].dataField, "field1");
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].sortOrder, "asc");
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].groupIndex, 1);

    // act
    this.columnsController.moveColumn(1, 0, "group", "headers");

    // assert
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].dataField, "field1");
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].sortOrder, "desc");
    assert.strictEqual(this.columnsController.getVisibleColumns()[1].groupIndex, undefined);
});

QUnit.module("Column Option", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("update exist column parameter", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"] });

    this.columnsController.columnOption(0, "visible", false);

    assert.ok(!this.columnsController.getColumns()[0].visible);
    assert.ok(this.columnsController.getColumns()[1].visible);
    assert.ok(this.columnsController.getColumns()[2].visible);
});

// T128057
QUnit.test("update exist column parameter with long name", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", lookup: { allowClearing: false } }, "field2", "field3"] });

    this.columnsController.columnOption(0, "lookup.allowClearing", true);

    assert.strictEqual(this.columnsController.getColumns()[0].lookup.allowClearing, true);
    assert.strictEqual(this.columnsController.columnOption(0, "lookup.allowClearing"), true);
});

QUnit.test("update exist column parameter by dataField", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"] });

    this.columnsController.columnOption('field2', "visible", false);

    assert.ok(this.columnsController.getColumns()[0].visible);
    assert.ok(!this.columnsController.getColumns()[1].visible);
    assert.ok(this.columnsController.getColumns()[2].visible);
});

QUnit.test("update exist column parameter by caption", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"] });

    this.columnsController.columnOption('Field 2', "visible", false);

    assert.ok(this.columnsController.getColumns()[0].visible);
    assert.ok(!this.columnsController.getColumns()[1].visible);
    assert.ok(this.columnsController.getColumns()[2].visible);
});

QUnit.test("update column parameter from undefined to null", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"] });

    var changedCount = 0;
    this.columnsController.columnsChanged.add(function() {
        changedCount++;
    });

    this.columnsController.columnOption(0, "filterValue", null);

    assert.strictEqual(this.columnsController.getColumns()[0].filterValue, null, "filterValue is changed");
    assert.strictEqual(changedCount, 0, "columnsChanged is not fired");
});

// T516687
QUnit.test("update buffered column options from undefined to null", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"] });

    var changedCount = 0;
    this.columnsController.columnsChanged.add(function() {
        changedCount++;
    });

    // act
    this.columnsController.columnOption(0, "bufferedFilterValue", null);
    this.columnsController.columnOption(0, "bufferedSelectedFilterOperation", null);

    // assert
    assert.strictEqual(this.columnsController.getColumns()[0].bufferedFilterValue, null, "bufferedFilterValue is changed");
    assert.strictEqual(this.columnsController.getColumns()[0].bufferedSelectedFilterOperation, null, "bufferedSelectedFilterOperation is changed");
    assert.strictEqual(changedCount, 2, "columnsChanged is fired for each buffered option");
});

// T125988
QUnit.test("update column groupIndex", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", groupIndex: 0 }, { dataField: "field2", groupIndex: 1 }, "field3"] });

    var columnsChangedArgs = [];

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    this.columnsController.columnOption('field2', "groupIndex", 0);

    assert.strictEqual(this.columnsController.getColumns()[0].groupIndex, 1);
    assert.strictEqual(this.columnsController.getColumns()[1].groupIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[2].groupIndex, undefined);
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.ok(columnsChangedArgs[0].changeTypes.grouping);
});

    // T364892
QUnit.test("update column groupIndex after endUpdate", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1" }, { dataField: "field2" }, "field3"] });

    var columnsChangedArgs = [];

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });


    this.columnsController.endUpdate();

    this.columnsController.columnOption('field2', "groupIndex", 0);

    assert.strictEqual(this.columnsController.getColumns()[0].groupIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].groupIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[2].groupIndex, undefined);
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.ok(columnsChangedArgs[0].changeTypes.grouping);
});

// T125988
QUnit.test("reset column groupIndex", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", groupIndex: 0 }, { dataField: "field2", groupIndex: 1 }, "field3"] });

    var columnsChangedArgs = [];

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    this.columnsController.columnOption('field1', "groupIndex", undefined);

    assert.strictEqual(this.columnsController.getColumns()[0].groupIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].groupIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[2].groupIndex, undefined);
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.grouping, true);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.length, 1);
});

QUnit.test("update column sortIndex", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", sortIndex: 0, sortOrder: 'asc' }, { dataField: "field2", sortIndex: 1, sortOrder: 'desc' }, "field3"] });

    var columnsChangedArgs = [];

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    this.columnsController.columnOption('field1', "sortIndex", 2);

    assert.strictEqual(this.columnsController.getColumns()[0].sortIndex, 1);
    assert.strictEqual(this.columnsController.getColumns()[1].sortIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[2].sortIndex, undefined);
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.sorting, true);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.length, 1);
});

// T140147
QUnit.test("update column sortIndex to first", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", sortIndex: 0, sortOrder: 'asc' }, { dataField: "field2", sortIndex: 1, sortOrder: 'desc' }, "field3"] });

    var columnsChangedArgs = [];

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    this.columnsController.columnOption('field2', "sortIndex", 0);

    assert.strictEqual(this.columnsController.getColumns()[0].sortIndex, 1);
    assert.strictEqual(this.columnsController.getColumns()[1].sortIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[2].sortIndex, undefined);
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.sorting, true);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.length, 1);
});

QUnit.test("update column sortOrder", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", sortIndex: 0, sortOrder: 'asc' }, { dataField: "field2", sortIndex: 1, sortOrder: 'desc' }, "field3"] });

    var columnsChangedArgs = [];

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    this.columnsController.columnOption('field2', 'sortOrder', 'asc');

    assert.strictEqual(this.columnsController.getColumns()[0].sortIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[0].sortOrder, 'asc');
    assert.strictEqual(this.columnsController.getColumns()[1].sortIndex, 1);
    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, 'asc');
    assert.strictEqual(this.columnsController.getColumns()[2].sortIndex, undefined);
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.sorting, true);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.length, 1);
});

// T140147
QUnit.test("reset column sortOrder", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", sortIndex: 0, sortOrder: 'asc' }, { dataField: "field2", sortIndex: 1, sortOrder: 'desc' }, "field3"] });

    var columnsChangedArgs = [];

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    this.columnsController.columnOption('field1', 'sortOrder', undefined);

    assert.strictEqual(this.columnsController.getColumns()[0].sortIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[0].sortOrder, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].sortIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, 'desc');
    assert.strictEqual(this.columnsController.getColumns()[2].sortIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[2].sortOrder, undefined);
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.sorting, true);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.length, 1);
});

QUnit.test("clearSorting", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", sortIndex: 0, sortOrder: 'asc' }, { dataField: "field2", sortIndex: 1, sortOrder: 'desc' }, "field3"] });

    var columnsChangedArgs = [];

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    this.columnsController.clearSorting();

    assert.strictEqual(this.columnsController.getColumns()[0].sortIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[0].sortOrder, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].sortIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, undefined);
    assert.strictEqual(this.columnsController.getColumns()[2].sortIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[2].sortOrder, undefined);
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.sorting, true);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.length, 1);
});

QUnit.test("clearGrouping", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", groupIndex: 1 }, { dataField: "field2", groupIndex: 0 }, "field3"] });

    var columnsChangedArgs = [];

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    this.columnsController.clearGrouping();

    assert.strictEqual(this.columnsController.getColumns()[0].groupIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[0].sortOrder, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].groupIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, undefined);
    assert.strictEqual(this.columnsController.getColumns()[2].groupIndex, undefined);
    assert.strictEqual(this.columnsController.getColumns()[2].sortOrder, undefined);
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.grouping, true);
    assert.strictEqual(columnsChangedArgs[0].changeTypes.length, 1);
});

// T242672
QUnit.test("update column dataField", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", sortIndex: 0, sortOrder: 'asc' }, { name: "field2", dataField: "field2a", sortIndex: 1, sortOrder: 'desc' }] });

    var columnsChangedArgs = [];

    var dataSource = new DataSource([
        { field1: 1, field1a: 2, field1b: 3 },
        { field1: 4, field1a: 5, field1b: 6 }
    ]);

    dataSource.load();

    this.columnsController.applyDataSource(dataSource);

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    this.columnsController.columnOption('field2', "dataField", "field2b");

    assert.strictEqual(this.columnsController.getColumns()[0].sortIndex, 0);
    assert.strictEqual(this.columnsController.getColumns()[1].sortIndex, 1);
    assert.strictEqual(this.columnsController.getColumns()[1].name, "field2");
    assert.strictEqual(this.columnsController.getColumns()[1].dataField, "field2b");
    assert.strictEqual(this.columnsController.getColumns()[1].caption, "Field 2b");
    assert.strictEqual(this.columnsController.getColumns()[1].calculateCellValue({ field2a: 1, field2b: 2 }), 2, "calculateCellValue for field with changed dataField");
    assert.strictEqual(columnsChangedArgs.length, 1);
    assert.strictEqual(columnsChangedArgs[0].optionNames.all, true);
    assert.strictEqual(columnsChangedArgs[0].optionNames.length, 1);
});

// T346972
QUnit.test("change column option validationRules at runtime", function(assert) {
    this.applyOptions({ columns: ["field1", "field2"] });

    var columnsChangedArgs = [];

    var dataSource = new DataSource([
        { field1: 1, field2: 2 }
    ]);

    dataSource.load();

    this.columnsController.applyDataSource(dataSource);

    this.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
    });

    // act
    this.columnsController.columnOption("field2", "validationRules", [{ type: "required" }]);
    this.columnsController.reset();
    this.columnsController.applyDataSource(dataSource);


    assert.deepEqual(this.columnsController.getVisibleColumns()[1].validationRules, [{ type: "required" }], "validationRules in internal column options");
    assert.deepEqual(this.option("columns")[1].validationRules, [{ type: "required" }], "validationRules in public column options");

    assert.strictEqual(columnsChangedArgs.length, 2);
    assert.strictEqual(columnsChangedArgs[0].optionNames.validationRules, true);
    assert.strictEqual(columnsChangedArgs[0].optionNames.length, 1);
    assert.strictEqual(columnsChangedArgs[1].optionNames.all, true);
    assert.strictEqual(columnsChangedArgs[1].optionNames.length, 1);
});

QUnit.test("not update exist column parameter when it is not changed", function(assert) {
    var changedCallCount = 0;
    this.applyOptions({ columns: [{ dataField: "field1", filterValue: '123' }] });

    this.columnsController.columnsChanged.add(function() {
        changedCallCount++;
    });

    this.columnsController.columnOption(0, "filterValue", '123');

    assert.equal(changedCallCount, 0);
});

QUnit.test("update column not exist parameter", function(assert) {
    this.applyOptions({ columns: ["field1", "field2"] });

    this.columnsController.columnOption(1, "sort", 'asc');

    assert.strictEqual(this.columnsController.getColumns()[0].sort, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].sort, 'asc');
});

QUnit.test("update column to undefined", function(assert) {
    this.applyOptions({ columns: ["field1", "field2"] });

    this.columnsController.columnOption(0, "sort", 'asc');
    this.columnsController.columnOption(0, "sort", undefined);

    assert.strictEqual(this.columnsController.getColumns()[0].sort, undefined);
});

QUnit.test("update not exist column", function(assert) {
    var columnsChangedCount = 0;
    this.applyOptions({ columns: ["field1", "field2"] });
    this.columnsController.columnsChanged.add(function() {
        columnsChangedCount++;
    });

    this.columnsController.columnOption(4, "visible", false);
    assert.strictEqual(columnsChangedCount, 0);
});

QUnit.test("update column parameters as object", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"] });

    this.columnsController.columnOption(0, {
        visible: false,
        filterValue: '123'
    });

    assert.ok(!this.columnsController.getColumns()[0].visible);
    assert.equal(this.columnsController.getColumns()[0].filterValue, '123');
});

QUnit.test("columnsChanged on update exist column parameter", function(assert) {
    var columnsChangedCount = 0;
    var lastArgs;

    this.applyOptions({ columns: ["field1", "field2"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedCount++;
        lastArgs = args;
    });

    this.columnsController.columnOption(1, "visible", false);

    assert.ok(!this.columnsController.getColumns()[1].visible);
    assert.strictEqual(columnsChangedCount, 1);
    assert.deepEqual(lastArgs, {
        changeTypes: { columns: true, length: 1 },
        columnIndex: 1,
        optionNames: { visible: true, length: 1 }
    });
});

QUnit.test("columnsChanged on update exist column parameter and applyDataSource", function(assert) {
    var columnsChangedCount = 0;
    var lastArgs;

    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedCount++;
        lastArgs = args;
    });

    this.columnsController.columnOption(-1, "visibleWidth", 100);

    var dataSource = new DataSource([
        { field1: 1, field2: 2 }
    ]);
    dataSource.load();

    // act
    this.columnsController.applyDataSource(dataSource);


    assert.ok(this.columnsController.getColumns()[0].visible);
    assert.strictEqual(columnsChangedCount, 1);
    assert.deepEqual(lastArgs, {
        changeTypes: { columns: true, length: 1 },
        optionNames: { all: true, visibleWidth: true, length: 2 }
    });
});

QUnit.test("onColumnsChanging when update exist column parameter", function(assert) {
    var columnsChangingCount = 0;
    var columnsChangedCount = 0;
    var lastArgs;

    this.applyOptions({
        columns: ["field1", "field2"],
        onColumnsChanging: function(e) {
            columnsChangingCount++;
            assert.ok(e.optionNames.width);
            assert.equal(e.component.columnOption(1, "width"), 100);
            e.component.columnOption(1, "width", 150);
        }
    });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedCount++;
        lastArgs = args;
    });

    this.columnsController.columnOption(1, "width", 100);

    assert.strictEqual(columnsChangingCount, 1);
    assert.strictEqual(columnsChangedCount, 1);
    assert.equal(this.columnsController.getColumns()[1].width, 150);
    assert.deepEqual(lastArgs, {
        changeTypes: { columns: true, length: 1 },
        columnIndex: 1,
        optionNames: { width: true, length: 1 }
    });
});

QUnit.test("columnsChanged on update exist column parameters as object", function(assert) {
    var columnsChangedCount = 0;
    var lastArgs;

    this.applyOptions({ columns: ["field1", "field2"] });
    this.columnsController.columnsChanged.add(function(args) {
        columnsChangedCount++;
        lastArgs = args;
    });

    this.columnsController.columnOption(1, { "visible": false, filterValue: '123' });

    assert.ok(!this.columnsController.getColumns()[1].visible);
    assert.ok(this.columnsController.getColumns()[1].filterValue);
    assert.strictEqual(columnsChangedCount, 1);
    assert.deepEqual(lastArgs, {
        changeTypes: { columns: true, length: 1 },
        columnIndex: 1,
        optionNames: { visible: true, filterValue: true, length: 2 }
    });
});

QUnit.test("get column options", function(assert) {
    this.applyOptions({ columns: ["field1", "field2"] });

    // act
    var column1 = this.columnsController.columnOption(0);
    var column2 = this.columnsController.columnOption(1);
    var column3 = this.columnsController.columnOption(2);

    // assert
    assert.ok(column1);
    assert.equal(column1.dataField, "field1");
    assert.ok(column1.visible);

    assert.ok(column2);
    assert.equal(column2.dataField, "field2");
    assert.ok(column2.visible);

    assert.ok(!column3);
});

QUnit.test("get column option", function(assert) {
    this.applyOptions({ columns: ["field1", "field2"] });

    // act
    var columnVisible = this.columnsController.columnOption(1, 'visible');
    var columnDataField = this.columnsController.columnOption(1, 'dataField');

    // assert
    assert.ok(columnVisible);
    assert.equal(columnDataField, "field2");
});

QUnit.test("Reset column changes when option is changed inside a columns changed event", function(assert) {
    var columnsChangedArgs = [],
        that = this;

    that.applyOptions({ columns: [{ dataField: "field1" }] });

    that.columnsController.columnsChanged.add(function(e) {
        columnsChangedArgs.push(e);
        that.columnsController.columnOption('field1', "filterValue", 10);
    });

    that.columnsController.columnOption('field1', "filterValue", 10);

    assert.equal(columnsChangedArgs.length, 1);
});

QUnit.test("Reset columns cache when the columnOption method is fired with the notFireEvent parameter", function(assert) {
    this.applyOptions(
        {
            columns: [
                "field1",
                "field2", {
                    dataField: "field3",
                    visible: false
                }
            ]
        });

    this.columnsController.getVisibleColumns();
    this.columnsController.columnOption("field3", "visible", true, true);

    assert.equal(this.columnsController.getVisibleColumns().length, 3, "visible columns count");
});

// T556327
QUnit.test("Sorting should be reset to the initialized state after a column is ungrouped", function(assert) {
    // arrange
    this.applyOptions({ columns: [{ dataField: "field1", sortOrder: "desc" }, "field2", "field3"] });

    this.columnsController.columnOption(0, "groupIndex", 0);
    this.columnsController.columnOption(0, "sortOrder", "asc");

    // assert
    assert.strictEqual(this.columnsController.getColumns()[0].groupIndex, 0, "groupIndex");
    assert.strictEqual(this.columnsController.getColumns()[0].sortOrder, "asc", "sortOrder");
    assert.strictEqual(this.columnsController.getColumns()[0].lastSortOrder, "desc", "sortOrder");

    // act
    this.columnsController.columnOption(0, "groupIndex", -1);

    // assert
    assert.strictEqual(this.columnsController.getColumns()[0].sortOrder, "desc", "sortOrder");
});

QUnit.module("Sorting/Grouping", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("disabled sorting", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'none' } });

    this.columnsController.changeSortOrder(0, 'asc');

    assert.strictEqual(this.columnsController.getColumns()[0].allowSorting, true);
    assert.strictEqual(this.columnsController.getColumns()[0].sortOrder, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].allowSorting, true);
    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, undefined);
    assert.strictEqual(this.columnsController.getColumns()[2].allowSorting, true);
    assert.strictEqual(this.columnsController.getColumns()[2].sortOrder, undefined);
});

QUnit.test("disabled allowSorting for all columns", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: false }, sorting: { mode: 'single' } });

    this.columnsController.changeSortOrder(0, 'asc');

    assert.strictEqual(this.columnsController.getColumns()[0].allowSorting, false);
    assert.strictEqual(this.columnsController.getColumns()[0].sortOrder, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].allowSorting, false);
    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, undefined);
    assert.strictEqual(this.columnsController.getColumns()[2].allowSorting, false);
    assert.strictEqual(this.columnsController.getColumns()[2].sortOrder, undefined);
});


QUnit.test("disabled allowSorting for one column", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", allowSorting: false }, "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.changeSortOrder(1, 'asc');

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns.length, 3);
    assert.strictEqual(columns[0].allowSorting, true);
    assert.strictEqual(columns[0].sortOrder, undefined);
    assert.strictEqual(columns[1].allowSorting, false);
    assert.strictEqual(columns[1].sortOrder, undefined);
    assert.strictEqual(columns[2].allowSorting, true);
    assert.strictEqual(columns[2].sortOrder, undefined);
});

QUnit.test("change to asc value", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.changeSortOrder(1, 'asc');

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, undefined);
    assert.strictEqual(columns[1].sortOrder, 'asc');
    assert.strictEqual(columns[2].sortOrder, undefined);
});

QUnit.test("change to desc value", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.changeSortOrder(1, 'desc');

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, undefined);
    assert.strictEqual(columns[1].sortOrder, 'desc');
    assert.strictEqual(columns[2].sortOrder, undefined);
});

QUnit.test("change to incorrect value", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.changeSortOrder(1, 'incorrect');

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, undefined);
    assert.strictEqual(columns[1].sortOrder, 'asc');
    assert.strictEqual(columns[2].sortOrder, undefined);
});

QUnit.test("change without value (undefined -> asc -> desc -> asc)", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.changeSortOrder(1);

    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, 'asc');

    this.columnsController.changeSortOrder(1);
    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, 'desc');

    this.columnsController.changeSortOrder(1);
    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, 'asc');
});

QUnit.test("change for single sorting with key pressed shift", function(assert) {
    // arrange
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    // act
    this.columnsController.changeSortOrder(0, "shift");
    this.columnsController.changeSortOrder(1, "shift");

    // assert
    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, undefined, "sort order column 1");
    assert.strictEqual(columns[0].sortIndex, undefined, "sort index column 1");
    assert.strictEqual(columns[1].sortOrder, "asc", "sort order column 2");
    assert.equal(columns[1].sortIndex, 0, "sort index column 2");
    assert.strictEqual(columns[2].sortOrder, undefined, "sort order column 3");
    assert.strictEqual(columns[2].sortIndex, undefined, "sort index column 3");
});

QUnit.test("change without value for single sorting", function(assert) {
    // arrange
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    // act
    this.columnsController.changeSortOrder(0);
    this.columnsController.changeSortOrder(1);

    // assert
    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, undefined, "sort order column 1");
    assert.strictEqual(columns[0].sortIndex, undefined, "sort index column 1");
    assert.strictEqual(columns[1].sortOrder, "asc", "sort order column 2");
    assert.equal(columns[1].sortIndex, 0, "sort index column 2");
    assert.strictEqual(columns[2].sortOrder, undefined, "sort order column 3");
    assert.strictEqual(columns[2].sortIndex, undefined, "sort index column 3");
});

// T113613
QUnit.test("change without value for single sorting when grouped columns exists", function(assert) {
    // arrange
    this.applyOptions({ columns: [{ dataField: "field1", groupIndex: 0 }, "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    // act
    this.columnsController.changeSortOrder(0);
    this.columnsController.changeSortOrder(1);
    this.columnsController.changeSortOrder(2);

    // assert
    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, "desc", "sort order column 1");
    assert.strictEqual(columns[0].sortIndex, undefined, "sort index column 1");
    assert.strictEqual(columns[0].groupIndex, 0, "group index column 1");

    assert.strictEqual(columns[1].sortOrder, undefined, "sort order column 2");
    assert.strictEqual(columns[1].sortIndex, undefined, "sort index column 2");

    assert.strictEqual(columns[2].sortOrder, "asc", "sort order column 3");
    assert.strictEqual(columns[2].sortIndex, 0, "sort index column 3");
});

QUnit.test("change without value for single sorting with key pressed ctrl", function(assert) {
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.changeSortOrder(0);

    // assert
    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, "asc", "sort order column 1");
    assert.equal(columns[0].sortIndex, 0, "sort index column 1");
    assert.strictEqual(columns[1].sortOrder, undefined, "sort order column 2");
    assert.strictEqual(columns[1].sortIndex, undefined, "sort index column 2");
    assert.strictEqual(columns[2].sortOrder, undefined, "sort order column 3");
    assert.strictEqual(columns[2].sortIndex, undefined, "sort index column 3");

    // act
    this.columnsController.changeSortOrder(0, "ctrl");

    // assert
    assert.strictEqual(columns[0].sortOrder, undefined, "sort order column 1");
    assert.strictEqual(columns[0].sortIndex, undefined, "sort index column 1");
    assert.strictEqual(columns[1].sortOrder, undefined, "sort order column 2");
    assert.strictEqual(columns[1].sortIndex, undefined, "sort index column 2");
    assert.strictEqual(columns[2].sortOrder, undefined, "sort order column 3");
    assert.strictEqual(columns[2].sortIndex, undefined, "sort index column 3");
});

// T208736
QUnit.test("Not show load when sorting an unsorted column with key pressed ctrl", function(assert) {
    // arrange
    var callColumnsChanged = false;

    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.columnsChanged.add(function() {
        callColumnsChanged = true;
    });

    // act
    this.columnsController.changeSortOrder(0, "ctrl");

    // assert
    assert.ok(!callColumnsChanged, "not called columnsChanged");
});

QUnit.test("change without value (asc-> desc-> asc) for grouping", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({ columns: [{ dataField: "field1", groupIndex: 0 }, { dataField: "field2" }], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    // act
    that.columnsController.changeSortOrder(0);

    // assert
    assert.strictEqual(that.columnsController.getColumns()[0].sortOrder, 'desc');

    // act
    that.columnsController.changeSortOrder(0);

    // assert
    assert.strictEqual(that.columnsController.getColumns()[0].sortOrder, 'asc');

    // act
    that.columnsController.changeSortOrder(0);

    // assert
    assert.strictEqual(that.columnsController.getColumns()[0].sortOrder, 'desc');
});

QUnit.test("reset columns sorting before change", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", sortOrder: 'asc' }, { dataField: "field3", sortOrder: 'desc' }], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.changeSortOrder(0);

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, 'asc');
    assert.strictEqual(columns[1].sortOrder, undefined);
    assert.strictEqual(columns[2].sortOrder, undefined);
});

QUnit.test("not reset columns sorting before change for grouping", function(assert) {
    // arrange
    var that = this,
        columns;

    that.applyOptions({ columns: [{ dataField: "field1", groupIndex: 0, sortOrder: 'asc' }, { dataField: "field2", groupIndex: 1, sortOrder: 'desc' }], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    // act
    that.columnsController.changeSortOrder(0);
    columns = that.columnsController.getColumns();

    // assert
    assert.strictEqual(columns[0].sortOrder, 'desc');
    assert.strictEqual(columns[1].sortOrder, 'desc');
});

QUnit.test("Rise columnsChanged change sorting", function(assert) {
    var columnsChangedCount = 0;
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.columnsChanged.add(function(args) {
        assert.equal(args.changeTypes.sorting, true);
        columnsChangedCount++;
    });

    this.columnsController.changeSortOrder(1, 'asc');

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[1].sortOrder, 'asc');
    assert.strictEqual(columnsChangedCount, 1);
});

QUnit.test("Not Rise columnsChanged on change sorting when no changes", function(assert) {
    var columnsChangedCount = 0;
    this.applyOptions({ columns: ["field1", { dataField: "field2", sortOrder: 'asc' }, "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.columnsChanged.add(function(args) {
        assert.equal(args.changeType, 'sorting');
        columnsChangedCount++;
    });

    this.columnsController.changeSortOrder(1, 'asc');

    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, 'asc');
    assert.strictEqual(columnsChangedCount, 0);
});

QUnit.test("Rise columnsChanged for single mode", function(assert) {
    var columnsChangedCount = 0;
    this.applyOptions({ columns: ["field1", { dataField: "field2", sortOrder: 'asc' }, { dataField: "field3", sortOrder: 'asc' }], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'single' } });

    this.columnsController.columnsChanged.add(function(args) {
        assert.equal(args.changeTypes.sorting, true);
        columnsChangedCount++;
    });

    this.columnsController.changeSortOrder(1);

    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, 'desc');
    assert.strictEqual(this.columnsController.getColumns()[2].sortOrder, undefined);
    assert.strictEqual(columnsChangedCount, 1);
});

QUnit.test("change to none value when multiple sorting", function(assert) {
    this.applyOptions({ columns: [{ dataField: "field1", sortOrder: 'asc' }, { dataField: "field2", sortOrder: 'asc' }, "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'multiple' } });

    this.columnsController.changeSortOrder(1, 'none');

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, 'asc');
    assert.strictEqual(columns[0].sortIndex, 0);
    assert.strictEqual(columns[1].sortOrder, undefined);
    assert.strictEqual(columns[1].sortIndex, undefined);
    assert.strictEqual(columns[2].sortOrder, undefined);
    assert.strictEqual(columns[2].sortIndex, undefined);
});

QUnit.test("change to asc value when multiple sorting", function(assert) {
    this.applyOptions({ columns: ["field1", { dataField: "field2", sortOrder: 'asc' }, "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'multiple' } });

    this.columnsController.changeSortOrder(0, 'asc');

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, 'asc');
    assert.strictEqual(columns[0].sortIndex, 1);
    assert.strictEqual(columns[1].sortOrder, 'asc');
    assert.strictEqual(columns[1].sortIndex, 0);
    assert.strictEqual(columns[2].sortOrder, undefined);
    assert.strictEqual(columns[2].sortIndex, undefined);
});

QUnit.test("change for multiple sorting with key pressed shift", function(assert) {
    // arrange
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'multiple' } });

    // act
    this.columnsController.changeSortOrder(1, "shift");
    this.columnsController.changeSortOrder(0, "shift");
    this.columnsController.changeSortOrder(1, "shift");

    // assert
    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, 'asc');
    assert.strictEqual(columns[0].sortIndex, 1);
    assert.strictEqual(columns[1].sortOrder, 'desc');
    assert.strictEqual(columns[1].sortIndex, 0);
    assert.strictEqual(columns[2].sortOrder, undefined);
    assert.strictEqual(columns[2].sortIndex, undefined);
});

QUnit.test("change without value for multiple sorting", function(assert) {
    // arrange
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'multiple' } });

    // act
    this.columnsController.changeSortOrder(1);
    this.columnsController.changeSortOrder(0);
    this.columnsController.changeSortOrder(1);

    // assert
    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, undefined, "sort order column 1");
    assert.strictEqual(columns[0].sortIndex, undefined, "sort index column 1");
    assert.strictEqual(columns[1].sortOrder, "asc", "sort order column 2");
    assert.strictEqual(columns[1].sortIndex, 0, "sort index column 2");
    assert.strictEqual(columns[2].sortOrder, undefined, "sort order column 3");
    assert.strictEqual(columns[2].sortIndex, undefined, "sort index column 3");
});

QUnit.test("change for multiple sorting with key pressed ctrl", function(assert) {
    // arrange
    this.applyOptions({ columns: ["field1", "field2", "field3"], commonColumnSettings: { allowSorting: true }, sorting: { mode: 'multiple' } });

    this.columnsController.changeSortOrder(0, "shift");
    this.columnsController.changeSortOrder(1, "shift");

    // assert
    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, "asc", "sort order column 1");
    assert.equal(columns[0].sortIndex, 0, "sort index column 1");
    assert.strictEqual(columns[1].sortOrder, "asc", "sort order column 2");
    assert.equal(columns[1].sortIndex, 1, "sort index column 2");
    assert.strictEqual(columns[2].sortOrder, undefined, "sort order column 3");
    assert.strictEqual(columns[2].sortIndex, undefined, "sort index column 3");

    // act
    this.columnsController.changeSortOrder(0, "ctrl");

    // assert
    assert.strictEqual(columns[0].sortOrder, undefined, "sort order column 1");
    assert.strictEqual(columns[0].sortIndex, undefined, "sort index column 1");
    assert.strictEqual(columns[1].sortOrder, "asc", "sort order column 2");
    assert.equal(columns[1].sortIndex, 0, "sort index column 2");
});

QUnit.test("not reset columns sorting before change for multiple mode", function(assert) {
    this.applyOptions({
        columns: ["field1", { dataField: "field2", sortOrder: 'asc' }, { dataField: "field3", sortOrder: 'desc' }],
        commonColumnSettings: { allowSorting: true }, sorting: { mode: 'multiple' }
    });

    this.columnsController.changeSortOrder(0, "shift");

    var columns = this.columnsController.getColumns();
    assert.strictEqual(columns[0].sortOrder, 'asc');
    assert.strictEqual(columns[1].sortOrder, 'asc');
    assert.strictEqual(columns[2].sortOrder, 'desc');
});

QUnit.test("Not Rise columnsChanged for multiple mode", function(assert) {
    var columnsChangedCount = 0;
    this.applyOptions({
        columns: ["field1", { dataField: "field2", sortOrder: 'asc' }, { dataField: "field3", sortOrder: 'asc' }],
        commonColumnSettings: { allowSorting: true },
        sorting: { mode: 'multiple' }
    });

    this.columnsController.columnsChanged.add(function(args) {
        assert.equal(args.changeType, 'sorting');
        columnsChangedCount++;
    });

    this.columnsController.changeSortOrder(1, 'asc');

    assert.strictEqual(this.columnsController.getColumns()[1].sortOrder, 'asc');
    assert.strictEqual(this.columnsController.getColumns()[2].sortOrder, 'asc');
    assert.strictEqual(columnsChangedCount, 0);
});

QUnit.test("Rise columnsChanged on applyDataSource if change sorting in customizeColumns callback", function(assert) {
    var columnsChangedCount = 0;
    this.applyOptions({
        columns: ['field1', 'field2'],
        customizeColumns: function(columns) {
            columns[1].sortOrder = 'desc';
        },
        allowSorting: true
    });

    this.columnsController.columnsChanged.add(function(e) {
        assert.equal(e.changeTypes.sorting, true);
        columnsChangedCount++;
    });

    this.columnsController.applyDataSource(createMockDataSource([{ field1: '1', field2: '2' }]));

    assert.strictEqual(columnsChangedCount, 1);
});

QUnit.test("Rise columnsChanged on applyDataSource if change grouping in customizeColumns callback", function(assert) {
    var columnsChangedCount = 0;
    this.applyOptions({
        columns: ['field1', 'field2'],
        customizeColumns: function(columns) {
            columns[1].groupIndex = 0;
        }
    });

    this.columnsController.columnsChanged.add(function(e) {
        assert.equal(e.changeTypes.length, 2);
        assert.equal(e.changeTypes.grouping, true);
        assert.equal(e.changeTypes.columns, true);
        columnsChangedCount++;
    });

    this.columnsController.applyDataSource(createMockDataSource([{ field1: '1', field2: '2' }]));

    assert.strictEqual(columnsChangedCount, 1);
});

QUnit.test("Rise columnsChanged (changeType - 'columns') on applyDataSource if no sorting changes", function(assert) {
    var columnsChangedCount = 0;
    this.applyOptions({
        columns: ['field1', 'field2']
    });

    this.columnsController.columnsChanged.add(function(e) {
        assert.equal(e.changeTypes.columns, true);
        columnsChangedCount++;
    });

    this.columnsController.applyDataSource(createMockDataSource([{ field1: '1', field2: '2' }]));

    assert.strictEqual(columnsChangedCount, 1);
});

QUnit.test("Rise columnsChanged (changeType - 'columns') on applyDataSource if columns options has sorting and no sorting changes on customizeColumns", function(assert) {
    var columnsChangedCount = 0;
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc' }, 'field2'],
        customizeColumns: function(columns) {
        }
    });

    this.columnsController.columnsChanged.add(function(e) {
        assert.equal(e.changeTypes.columns, true);
        columnsChangedCount++;
    });

    this.columnsController.applyDataSource(createMockDataSource([{ field1: '1', field2: '2' }], { sort: 'field1' }));

    assert.strictEqual(columnsChangedCount, 1);
});

QUnit.test("getSortDataSourceParameters. No sorting", function(assert) {
    this.applyOptions({
        columns: ['field1', 'field2']
    });

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.strictEqual(sortParameters, null);
});

QUnit.test("getSortDataSourceParameters. One sort column", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc' }, 'field2']
    });

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.deepEqual(sortParameters, [{ selector: 'field1', desc: false }]);
});

QUnit.test("getSortDataSourceParameters. Two sort column", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc' }, { dataField: 'field2', sortOrder: 'desc' }]
    });

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.deepEqual(sortParameters, [
        { selector: 'field1', desc: false },
        { selector: 'field2', desc: true }
    ]);
});

QUnit.test("getSortDataSourceParameters. Column with groupIndex", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc', groupIndex: 0 }, { dataField: 'field2', sortOrder: 'desc' }]
    });

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.deepEqual(sortParameters, [
        { selector: 'field2', desc: true }
    ]);
});

QUnit.test("getSortDataSourceParameters. Two sort column with sort indexes", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc', sortIndex: 1 }, { dataField: 'field2', sortOrder: 'desc', sortIndex: 0 }]
    });

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.deepEqual(sortParameters, [
        { selector: 'field2', desc: true },
        { selector: 'field1', desc: false }
    ]);
});

QUnit.test("getSortDataSourceParameters. Two sort column and allowSorting disabled", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc' }, { dataField: 'field2', sortOrder: 'desc' }],
        commonColumnSettings: { allowSorting: false }
    });

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.ok(sortParameters);
    assert.equal(sortParameters.length, 2);
});

QUnit.test("getSortDataSourceParameters. Sorting not apply for invisible columns", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc' }, { dataField: 'field2', sortOrder: 'desc', visible: false }]
    });

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    // T205357
    assert.deepEqual(sortParameters, [{ selector: 'field1', desc: false }, { selector: 'field2', desc: true }]);
});

QUnit.test("getSortDataSourceParameters. Column with calculateCellValue", function(assert) {
    var calculateCellValue = function() { return 'test'; };
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc', sortIndex: 1 }, { calculateCellValue: calculateCellValue, sortOrder: 'desc', sortIndex: 0 }]
    });
    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.equal(sortParameters.length, 2);

    assert.ok(sortParameters[0].desc);
    assert.equal(sortParameters[0].selector(), 'test');
    assert.deepEqual(sortParameters[1], { selector: 'field1', desc: false });
});

QUnit.test("getSortDataSourceParameters. Column with sortingMethod", function(assert) {
    var sortingMethodContext;
    var sortingMethod = function(x, y) {
        sortingMethodContext = this;
        return x - y;
    };
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc', sortIndex: 0, sortingMethod: sortingMethod }]
    });
    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.equal(sortParameters.length, 1);
    assert.ok(sortParameters[0].compare);
    assert.equal(sortParameters[0].compare(3, 1), 2);
    assert.equal(sortingMethodContext.dataField, "field1");
});

QUnit.test("getSortDataSourceParameters. Column with calculateSortValue", function(assert) {
    var context;
    var calculateSortValue = function() { context = this; return 'test'; };
    this.applyOptions({
        columns: [{ dataField: 'field1', sortOrder: 'asc', sortIndex: 1 }, { dataField: "field2", calculateSortValue: calculateSortValue, sortOrder: 'desc', sortIndex: 0 }]
    });
    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.equal(sortParameters.length, 2);
    assert.strictEqual(sortParameters[0].selector.originalCallback, calculateSortValue);
    assert.equal(sortParameters[0].selector({}), "test");
    assert.equal(context.dataField, "field2");
    assert.ok(sortParameters[0].desc);
    assert.deepEqual(sortParameters[1], { selector: 'field1', desc: false });
});

// T305368
QUnit.test("getSortDataSourceParameters. Column with calculateSortValue for lookup", function(assert) {
    var calculateSortValue = function(data) {
        var value = this.calculateCellValue(data);
        return this.lookup.calculateCellValue(value);
    };
    this.applyOptions({
        columns: [{ dataField: "field1", calculateSortValue: calculateSortValue, sortOrder: 'desc', sortIndex: 0, lookup: { valueExpr: "id", displayExpr: "text", dataSource: [{ id: 0, text: "text1" }, { id: 1, text: "text2" }] } }]
    });

    this.columnsController.refresh();

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.equal(sortParameters.length, 1);
    assert.strictEqual(sortParameters[0].selector.originalCallback, calculateSortValue);
    assert.equal(sortParameters[0].selector({ field1: 0 }), "text1");
    assert.ok(sortParameters[0].desc);
});

QUnit.test("getSortDataSourceParameters. Column with calculateDisplayValue for lookup", function(assert) {
    var calculateDisplayValue = function(data) {
        return data.field1Text;
    };
    this.applyOptions({
        columns: [{ dataField: "field1", calculateDisplayValue: calculateDisplayValue, sortOrder: 'desc', sortIndex: 0, lookup: { valueExpr: "id", displayExpr: "text", dataSource: [{ id: 0, text: "text1" }, { id: 1, text: "text2" }] } }]
    });

    this.columnsController.refresh();

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.equal(sortParameters.length, 1);
    assert.strictEqual(sortParameters[0].selector.originalCallback, calculateDisplayValue);
    assert.equal(sortParameters[0].selector({ field1: 0, field1Text: "text1" }), "text1");
    assert.ok(sortParameters[0].desc);
});

QUnit.test("getSortDataSourceParameters. Column with calculateDisplayValue as string for lookup", function(assert) {
    this.applyOptions({
        columns: [{ dataField: "field1", calculateDisplayValue: "field1Text", sortOrder: 'desc', sortIndex: 0, lookup: { valueExpr: "id", displayExpr: "text", dataSource: [{ id: 0, text: "text1" }, { id: 1, text: "text2" }] } }]
    });

    this.columnsController.refresh();

    var sortParameters = this.columnsController.getSortDataSourceParameters();

    assert.equal(sortParameters.length, 1);

    assert.equal(sortParameters[0].selector, "field1Text");
    assert.ok(sortParameters[0].desc);
});

QUnit.test("getGroupDataSourceParameters. No grouping", function(assert) {
    this.applyOptions({
        columns: ['field1', 'field2']
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.strictEqual(groupParameters, null);
});

QUnit.test("getGroupDataSourceParameters. One group column", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0 }, 'field2']
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.deepEqual(groupParameters, [{ selector: 'field1', desc: false, isExpanded: false }]);
});

QUnit.test("getGroupDataSourceParameters. One group column when desc sorting defined", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0, sortOrder: 'desc' }, 'field2']
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.deepEqual(groupParameters, [{ selector: 'field1', desc: true, isExpanded: false }]);
});

QUnit.test("getGroupDataSourceParameters. One group column when autoExpandGroup disabled", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 0, autoExpandGroup: true }, 'field2']
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.deepEqual(groupParameters, [{ selector: 'field1', desc: false, isExpanded: true }]);
});


QUnit.test("getGroupDataSourceParameters. Several group columns", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 1 }, { dataField: 'field2', groupIndex: 0, autoExpandGroup: true }]
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.deepEqual(groupParameters, [{ selector: 'field2', desc: false, isExpanded: true }, { selector: 'field1', desc: false, isExpanded: false }]);
});

QUnit.test("getGroupDataSourceParameters. Several group columns when calculateGroupValue defined", function(assert) {
    var context;
    var calculateGroupValue = function() { context = this; return 1; };
    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 1 }, { dataField: 'field2', groupIndex: 0, autoExpandGroup: true, calculateGroupValue: calculateGroupValue }]
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.strictEqual(groupParameters[0].selector.originalCallback, calculateGroupValue);
    assert.equal(groupParameters[0].selector({}), 1);
    assert.equal(context.dataField, "field2");
    assert.ok(!groupParameters[0].desc);
    assert.deepEqual(groupParameters[1], { selector: 'field1', desc: false, isExpanded: false });
});

QUnit.test("getGroupDataSourceParameters. Several group columns when sortingMethod is defined", function(assert) {
    var context;
    var calculateGroupValue = function(x, y) { context = this; return x - y; };
    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 1 }, { dataField: 'field2', groupIndex: 0, autoExpandGroup: true, sortingMethod: calculateGroupValue }]
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.equal(groupParameters[0].compare(100, 1), 99);
    assert.equal(context.dataField, "field2");
    assert.ok(!groupParameters[1].compare);
});

// T420668
QUnit.test("display text for lookup column with calculateGroupValue", function(assert) {
    var array = [{ field1: 1, field2: 2 }, { field1: 2, field2: 3 }];
    this.applyOptions({
        columns: [
            {
                dataField: 'field1',
                groupIndex: 0,
                autoExpandGroup: true,
                calculateGroupValue: function(data) {
                    var value = this.calculateCellValue(data);
                    return this.lookup.calculateCellValue(value);
                },
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: [{ id: 1, name: "B" }, { id: 2, name: "A" }]
                }
            },
            { dataField: 'field2' }]
    });

    this.columnsController.applyDataSource(createMockDataSource(array));


    var groupParameters = this.columnsController.getGroupDataSourceParameters();
    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.equal(gridCore.getDisplayValue(visibleColumns[0], groupParameters[0].selector(array[0]), array[0], "group"), "B", 'column displayValue by getDisplayValue for group row');
    assert.equal(gridCore.getDisplayValue(visibleColumns[0], visibleColumns[0].selector(array[0]), array[0], "data"), "B", 'column displayValue by getDisplayValue for data row');
});

// T484633
QUnit.test("display text for lookup column with calculateDisplayValue", function(assert) {
    var array = [{ field1: 1, field2: 2, field1Text: "B" }, { field1: 2, field2: 3, field1Text: "A" }];
    this.applyOptions({
        columns: [
            {
                dataField: 'field1',
                groupIndex: 0,
                autoExpandGroup: true,
                calculateDisplayValue: function(data) { return data.field1Text; },
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: [{ id: 1, name: "B" }, { id: 2, name: "A" }]
                }
            },
            { dataField: 'field2' }]
    });

    this.columnsController.applyDataSource(createMockDataSource(array));


    var groupParameters = this.columnsController.getGroupDataSourceParameters();
    var visibleColumns = this.columnsController.getVisibleColumns();

    assert.equal(gridCore.getDisplayValue(visibleColumns[0], groupParameters[0].selector(array[0]), array[0], "group"), "B", 'column displayValue by getDisplayValue for group row');
    assert.equal(gridCore.getDisplayValue(visibleColumns[0], visibleColumns[0].selector(array[0]), array[0], "data"), "B", 'column displayValue by getDisplayValue for data row');
});

QUnit.test("getGroupDataSourceParameters when calculateDisplayValue defined", function(assert) {
    var context;
    var calculateDisplayValue = function() { context = this; return 1; };
    this.applyOptions({
        columns: [{ dataField: 'field2', groupIndex: 0, autoExpandGroup: true, calculateDisplayValue: calculateDisplayValue }]
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.strictEqual(groupParameters[0].selector.originalCallback, calculateDisplayValue);
    assert.equal(groupParameters[0].selector({}), 1);
    assert.equal(context.dataField, "field2");
    assert.ok(!groupParameters[0].desc);
});

QUnit.test("getGroupDataSourceParameters when calculateDisplayValue as string defined", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'field2', groupIndex: 0, autoExpandGroup: true, calculateDisplayValue: 'field2Text' }]
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.equal(groupParameters[0].selector, "field2Text");
    assert.ok(!groupParameters[0].desc);
});

QUnit.test("getGroupDataSourceParameters with true flag. One group column with dataType", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'fieldNumber', dataType: "number", groupIndex: 0, autoExpandGroup: true }]
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters(true);

    assert.equal(groupParameters.length, 1, 'one group parameter');
    assert.strictEqual(groupParameters[0].desc, false, 'asc');
    assert.strictEqual(groupParameters[0].isExpanded, true, 'isExpanded');
    assert.strictEqual(groupParameters[0].selector({ fieldNumber: "123" }), 123, 'selector converts string to number');
});

QUnit.test("getGroupDataSourceParameters without true flag. One group column with dataType", function(assert) {
    this.applyOptions({
        columns: [{ dataField: 'fieldNumber', dataType: "number", groupIndex: 0, autoExpandGroup: true }]
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.equal(groupParameters.length, 1, 'one group parameter');
    assert.strictEqual(groupParameters[0].desc, false, 'asc');
    assert.strictEqual(groupParameters[0].isExpanded, true, 'isExpanded');
    assert.strictEqual(groupParameters[0].selector, "fieldNumber", 'selector converts string to number');
});
// T151200
QUnit.test("getGroupDataSourceParameters. Several group columns when calculateCellValue defined", function(assert) {
    var calculateCellValue = function() { return 'test'; };
    this.applyOptions({
        columns: [{ dataField: 'field1', groupIndex: 1 }, { groupIndex: 0, autoExpandGroup: true, calculateCellValue: calculateCellValue }]
    });

    var groupParameters = this.columnsController.getGroupDataSourceParameters();

    assert.equal(groupParameters.length, 2);
    assert.ok(groupParameters[0].isExpanded);
    assert.ok(!groupParameters[0].desc);
    assert.equal(groupParameters[0].selector(), 'test');

    assert.deepEqual(groupParameters[1], { selector: 'field1', desc: false, isExpanded: false });
});

// T259458
QUnit.test("The headerCellTemplate of the group column should not be applied for expand column", function(assert) {
    // arrange
    var expandColumns;

    this.applyOptions({ columns: [{ dataField: "field", groupIndex: 0, headerCellTemplate: function() {} }] });

    // act, assert
    expandColumns = this.columnsController.getExpandColumns();
    assert.strictEqual(expandColumns.length, 1, "count expand column");
    assert.strictEqual(expandColumns[0].dataField, "field");
    assert.strictEqual(expandColumns[0].groupIndex, 0);
    assert.strictEqual(expandColumns[0].headerCellTemplate, null);
});

QUnit.module("ParseValue", { beforeEach: setupModule, afterEach: teardownModule });

// T141564
QUnit.test("parseValue for column with number dataField", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'number' }]
    });

    // act
    var column = this.columnsController.getColumns()[0];

    // assert
    assert.ok(column);
    assert.ok(column.parseValue);
    assert.strictEqual(column.parseValue(undefined), undefined);
    assert.strictEqual(column.parseValue(''), undefined);
    assert.strictEqual(column.parseValue('a'), undefined);
    assert.strictEqual(column.parseValue('201'), 201);
    assert.strictEqual(column.parseValue('1.2'), 1.2);
    assert.strictEqual(column.parseValue('12'), 12);
});

// T111930
QUnit.test("parseValue for column with number dataField and format currency", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{ dataField: "TestField", dataType: "number", format: "currency" }]
    });

    // act
    var column = this.columnsController.getColumns()[0];

    // assert
    assert.ok(column);
    assert.ok(column.parseValue);
    assert.equal(column.parseValue("a"), undefined);
    assert.equal(column.parseValue("$a"), undefined);
    assert.equal(column.parseValue("1.2"), 1.2);
    assert.equal(column.parseValue("$1.2"), 1.2);
    assert.equal(column.parseValue("12"), 12);
    assert.equal(column.parseValue("$12"), 12);
    assert.equal(column.parseValue(12), 12);
});

QUnit.test("parseValue for column with date dataField", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'date' }]
    });
    var date = new Date(2012, 4, 11);

    // act
    var column = this.columnsController.getColumns()[0];

    // assert
    assert.ok(column);
    assert.ok(column.parseValue);
    assert.deepEqual(column.parseValue('20'), undefined);
    assert.deepEqual(column.parseValue('2012'), undefined);
    assert.deepEqual(column.parseValue('2012/04'), undefined);
    assert.deepEqual(dateLocalization.format(date, column.format), "5/11/2012");
    assert.deepEqual(column.parseValue(dateLocalization.format(date, column.format)), date);

    // act
    column.format = "shortDateShortTime";

    // assert
    assert.deepEqual(dateLocalization.format(date, column.format), "5/11/2012, 12:00 AM");
    assert.deepEqual(column.parseValue(dateLocalization.format(date, column.format)), date);
});

QUnit.test("parseValue for column with string type dataField", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });

    // act
    var column = this.columnsController.getColumns()[0];

    // assert
    assert.ok(column);
    assert.ok(column.parseValue);
    assert.deepEqual(column.parseValue(''), '');
    assert.deepEqual(column.parseValue('abc'), 'abc');
    assert.deepEqual(column.parseValue('123'), '123');
});

// B254436
QUnit.test("parseValue for column with boolean type dataField", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'boolean', trueText: 'true', falseText: 'false' }]
    });

    // act
    var column = this.columnsController.getColumns()[0];

    // assert
    assert.ok(column, 'column');
    assert.ok(column.parseValue, 'parseValue');
    assert.strictEqual(column.parseValue(''), undefined, 'parse value undefined');
    assert.strictEqual(column.parseValue('true'), true, 'parse value true');
    assert.strictEqual(column.parseValue('false'), false, 'parse value false');
});

QUnit.module("Edit Column", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("editing with edit true", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        editing: {
            allowUpdating: true
        },
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.equal(columns[1].command, "edit");
});

QUnit.test("editing with remove true", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        editing: {
            allowDeleting: true
        },
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.equal(columns[1].command, "edit");
});

// T144135
QUnit.test("editing with insert true and edit mode row", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        editing: {
            mode: "row",
            allowAdding: true
        },
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.equal(columns[1].command, "edit");
});

// T144135
QUnit.test("editing with insert true and edit mode batch", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        editing: {
            mode: "batch",
            allowAdding: true
        },
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 1);
});

QUnit.test("not editing", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 1);
    assert.equal(columns[0].dataField, "TestField");
});

QUnit.test("editing with edit, remove, insert false", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        editing: {
            allowUpdating: false,
            allowDeleting: false,
            allowAdding: false
        },
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 1);
    assert.equal(columns[0].dataField, "TestField");
});

QUnit.test("Width editable column", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        editing: {
            allowAdding: true
        },
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.equal(columns[1].width, 'auto');
    assert.equal(columns[1].cssClass, 'dx-command-edit');
});

QUnit.test("change editable options after applyDataSource", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        editing: {
            allowUpdating: true
        },
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));
    that.applyOptions({
        editing: {
            allowUpdating: false
        },
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });

    // act
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 1);
    assert.equal(columns[0].dataField, "TestField");
});

QUnit.test("Add column", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    that.columnsController.addColumn('TestColumn');
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.equal(columns[1].dataField, "TestColumn");
});

QUnit.test("Add column for band columns", function(assert) {
    // arrange
    var that = this,
        options = {
            dataField: 'Custom Caption',
            columns: [ 'A1', 'A2']
        };

    that.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    that.columnsController.addColumn(options);

    // assert
    var columns = that.columnsController.getVisibleColumns(0);
    assert.equal(columns.length, 2);
    assert.equal(columns[1].dataField, "Custom Caption");
    assert.deepEqual(columns[1].added, options);

    columns = that.columnsController.getVisibleColumns(1);
    assert.equal(columns.length, 2);
    assert.equal(columns[0].dataField, "A1");
    assert.equal(columns[1].dataField, "A2");
    assert.notOk(columns[0].added);
    assert.notOk(columns[1].added);
});

    // T387546
QUnit.test("Dynamically added column must be kept after change editing.mode option", function(assert) {
        // arrange
    var that = this;

    that.applyOptions({
        columns: [{ dataField: 'TestColumn', dataType: 'string' }],
        sorting: { mode: "single" },
        editing: {
            mode: "row"
        }
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

        // act
    that.columnsController.addColumn({ dataField: 'AddedColumn', caption: "My Column" });
    that.columnOption("AddedColumn", "filterValue", "Test");
    that.options.editing.mode = "batch";
    that.columnsController.optionChanged({ name: "editing" });

        // assert
    var columns = that.columnsController.getVisibleColumns();

    assert.equal(columns.length, 2, "two columns exists");
    assert.equal(columns[0].dataField, "TestColumn");
    assert.equal(columns[1].dataField, "AddedColumn", "dynamically column is not removed");
    assert.equal(columns[1].caption, "My Column", "dynamically column caption");
    assert.equal(columns[1].filterValue, "Test", "dynamically column sortIndex");
    assert.deepEqual(columns[1].added, { dataField: 'AddedColumn', caption: "My Column" }, "dynamically column added flag");
});

// T313168
QUnit.test("Delete column", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        columns: [{ dataField: 'TestField1', dataType: 'string' }, { dataField: 'TestField2', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField1: 'test1', TestField2: 'test2' }]));

    // act
    that.deleteColumn('TestField1');
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 1);
    assert.equal(columns[0].dataField, "TestField2");
    assert.equal(columns[0].index, 0);
    assert.equal(columns[0].visibleIndex, 0);
});

// T171812
QUnit.test("Add column with groupIndex that need normalization", function(assert) {
    // arrange
    var that = this,
        changedArgs = [];

    that.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string' }]
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));
    that.columnsController.columnsChanged.add(function(e) {
        changedArgs.push(e);
    });

    // act
    that.columnsController.addColumn({ dataField: 'AddedField', groupIndex: 1 });
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.strictEqual(columns.length, 2);
    assert.strictEqual(columns[0].dataField, "AddedField");
    assert.strictEqual(columns[0].groupIndex, 0);
    assert.strictEqual(columns[1].dataField, "TestField");
    assert.strictEqual(columns[1].groupIndex, undefined);

    assert.strictEqual(changedArgs.length, 1);
    assert.strictEqual(changedArgs[0].changeTypes.length, 2);
    assert.ok(changedArgs[0].changeTypes.grouping);
    assert.ok(changedArgs[0].changeTypes.columns);
});

QUnit.test("Add column when edit column exists", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string' }],
        editing: {
            allowUpdating: true
        }
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    that.columnsController.addColumn('TestColumn');
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 3);
    assert.equal(columns[2].command, 'edit');
    assert.equal(columns[1].dataField, "TestColumn");
});

QUnit.test("columnsChanged and customizeColumns events on addColumn", function(assert) {
    // arrange
    var that = this,
        columnsChangedCount = 0;

    that.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string' }],
        customizeColumns: function(columns) {
            if(columns[1]) {
                columns[1].width = '150px';
            }
        }
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test', isLoaded: true }]));

    // act
    that.columnsController.columnsChanged.add(function(columns) {
        columnsChangedCount++;
    });

    that.columnsController.addColumn('TestColumn');
    var columns = that.columnsController.getColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.equal(columnsChangedCount, 1);
    assert.equal(columns[1].width, "150px");
    assert.equal(columns[1].dataField, "TestColumn");
});

QUnit.test("commonColumnSettings for added column", function(assert) {
    // arrange
    var that = this;

    that.applyOptions({
        columns: [{ dataField: 'TestField', dataType: 'string' }],
        commonColumnSettings: {
            editable: true
        }
    });
    that.columnsController.applyDataSource(createMockDataSource([{ TestField: 'test' }]));

    // act
    that.columnsController.addColumn('TestColumn');
    var columns = that.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.equal(columns[1].dataField, "TestColumn");
    assert.equal(columns[1].editable, true);
});

QUnit.test("Update column group Indexes when grouping from dataSource", function(assert) {
    // arrange
    // act
    this.columnsController.applyDataSource(createMockDataSource([{ items: [{ field1: 1, field2: 2, field3: 3 }] }], { group: 'field1' }));

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 3);
    assert.strictEqual(this.columnsController.getColumns()[0].dataField, 'field1');
    assert.strictEqual(this.columnsController.getColumns()[0].groupIndex, 0);
});

// B254104
QUnit.test("Update date column format when editable options changed", function(assert) {
    // arrange
    this.columnsController.applyDataSource(createMockDataSource([{ field1: 1, field2: new Date(), field3: 3 }]));

    // act
    this.applyOptions({
        columns: ['field1', 'field2', 'field3'],
        editable: {
            mode: 'incell'
        }
    });

    // assert
    assert.strictEqual(this.columnsController.getColumns().length, 3);
    assert.strictEqual(this.columnsController.getColumns()[0].format, undefined);
    assert.strictEqual(this.columnsController.getColumns()[1].format, 'shortDate');
    assert.strictEqual(this.columnsController.getColumns()[2].format, undefined);
});

QUnit.module("State storing", {
    beforeEach: function() {
        setupModule.apply(this);
        this.options.columnChooser = { enabled: true };
        this.options.groupPanel = { visible: true, allowColumnDragging: true };
        this.options.filterRow = { visible: true };
        this.options.headerFilter = { visible: true };
        this.options.allowColumnResizing = true;
        this.options.columnFixing = { enabled: true };

        this.getColumns = function(parameterNames) {
            return processColumnsForCompare(this.columnsController.getColumns(), parameterNames, ["allowFiltering", "allowFixing", "allowGrouping", "allowResizing"]);
        };
        this.getVisibleColumns = function(parameterNames) {
            return processColumnsForCompare(this.columnsController.getVisibleColumns(), parameterNames, ["allowFiltering", "allowFixing", "allowGrouping", "allowResizing"]);
        };
    }, afterEach: teardownModule
});

QUnit.test('Get user state', function(assert) {
    // arrange
    var that = this,
        columns;

    that.applyOptions({
        columns: [{ dataField: 'TestField1', dataType: 'string', allowReordering: true, allowResizing: true, width: 100, sortOrder: 'asc', sortIndex: 0, filterValue: 'TestFilter1', selectedFilterOperation: '=', filterValues: ["TestFilter1"], filterType: "include", fixed: true, fixedPosition: "right" },
            { dataField: 'TestField2', dataType: 'string', allowReordering: true, allowResizing: true, width: 50, sortOrder: 'asc', sortIndex: 1, filterValue: 'TestFilter2', selectedFilterOperation: 'startswith' }]
    });

    // act
    columns = that.columnsController.getUserState();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "dataType": "string", "visibleIndex": 0, "visible": true, "width": 100, "sortOrder": "asc", "sortIndex": 0, "filterValue": "TestFilter1", "selectedFilterOperation": "=", filterValues: ["TestFilter1"], filterType: "include", fixed: true, fixedPosition: "right" });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "dataType": "string", "visibleIndex": 1, "visible": true, "width": 50, "sortOrder": "asc", "sortIndex": 1, "filterValue": "TestFilter2", "selectedFilterOperation": "startswith" });
});

QUnit.test('Get user state for dynamically added column', function(assert) {
        // arrange
    var that = this,
        columns;

    that.applyOptions({
        columns: [{ dataField: 'TestField1', dataType: 'string', allowReordering: true, allowResizing: true, width: 100, sortOrder: 'asc', sortIndex: 0, filterValue: 'TestFilter1', selectedFilterOperation: '=', filterValues: ["TestFilter1"], filterType: "include", fixed: true, fixedPosition: "right" }]
    });

    that.addColumn("TestField2");

        // act
    columns = that.columnsController.getUserState();

        // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "dataType": "string", "visibleIndex": 0, "visible": true, "width": 100, "sortOrder": "asc", "sortIndex": 0, "filterValue": "TestFilter1", "selectedFilterOperation": "=", filterValues: ["TestFilter1"], filterType: "include", fixed: true, fixedPosition: "right" });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visibleIndex": 1, "visible": true, "added": "TestField2" });
});

QUnit.test('Get user state after columns reordering', function(assert) {
    // arrange
    var that = this,
        columns;

    that.applyOptions({
        columns: [{ dataField: 'TestField1', dataType: 'string', allowReordering: true, allowResizing: true, width: 100, sortOrder: 'asc', sortIndex: 0, filterValue: 'TestFilter1', selectedFilterOperation: '=' },
            { dataField: 'TestField2', dataType: 'string', allowReordering: true, allowResizing: true, width: 50, sortOrder: 'asc', sortIndex: 1, filterValue: 'TestFilter2', selectedFilterOperation: 'startswith' }]
    });

    that.columnsController.moveColumn(0, 2);

    // act
    columns = that.columnsController.getUserState();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "dataType": "string", "visibleIndex": 1, "visible": true, "width": 100, "sortOrder": "asc", sortIndex: 0, "filterValue": "TestFilter1", "selectedFilterOperation": "=" });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "dataType": "string", "visibleIndex": 0, "visible": true, "width": 50, "sortOrder": "asc", sortIndex: 1, "filterValue": "TestFilter2", "selectedFilterOperation": "startswith" });
});


QUnit.test('Apply user state', function(assert) {
    // arrange
    var that = this,
        columns;

    // act
    that.columnsController.setUserState([
        { dataField: "TestField1", visibleIndex: 0, visible: true, "width": 50, sortOrder: "desc", filterValue: "Test1", selectedFilterOperation: "startswith" },
        { dataField: "TestField2", visibleIndex: 1, visible: false, width: 150, sortOrder: "desc", filterValue: "Test2", selectedFilterOperation: "=" }
    ]);

    that.applyOptions({
        columns: [
            { dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: '=' },
            { dataField: 'TestField2', dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: 'startswith' }
        ]
    });

    columns = this.getColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith", defaultSelectedFilterOperation: '=' /* T381048 */, index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', showEditorAlways: false });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=", defaultSelectedFilterOperation: 'startswith' /* T381048 */, index: 1, caption: 'Test Field 2', dataType: 'string', alignment: 'left', showEditorAlways: false });
});

QUnit.test('Apply user state for dynamically added column', function(assert) {
        // arrange
    var that = this,
        columns;

        // act
    that.columnsController.setUserState([
            { dataField: "TestField1", visibleIndex: 0, visible: true, "width": 50, sortOrder: "desc", filterValue: "Test1", selectedFilterOperation: "startswith" },
            { dataField: "TestField2", visibleIndex: 1, visible: false, width: 150, sortOrder: "desc", filterValue: "Test2", selectedFilterOperation: "=", added: { dataField: "TestField2", dataType: "string" } }
    ]);

    that.applyOptions({
        columns: [
                { dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: '=' }
        ]
    });

    columns = this.getColumns();

        // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith", index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=", index: 1, caption: 'Test Field 2', dataType: 'string', alignment: 'left', showEditorAlways: false, added: { dataField: "TestField2", dataType: "string" } });
});

QUnit.test('Apply user state for dynamically added band column', function(assert) {
    // arrange
    var that = this,
        columns;

    // act
    that.columnsController.setUserState([
        { dataField: "TestField1", visibleIndex: 0, visible: true, "width": 50, sortOrder: "desc", filterValue: "Test1", selectedFilterOperation: "startswith" },
        { dataField: "TestField2", visibleIndex: 1, visible: true, isBand: true, added: { caption: "TestField2", columns: ["TestField21", "TestField22"] } },
        { dataField: "TestField21", visibleIndex: 2, visible: true, ownerBand: 1 },
        { dataField: "TestField22", visibleIndex: 3, visible: true, ownerBand: 1 }
    ]);

    that.applyOptions({
        columns: [
            { dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: '=' }
        ]
    });

    columns = this.getColumns();

    // assert
    assert.equal(columns.length, 4);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith", index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false });
    assert.deepEqual(columns[1], {
        dataField: "TestField2",
        visible: true,
        index: 1,
        caption: 'TestField2',
        allowSorting: false,
        isBand: true,
        added: { caption: "TestField2", columns: ["TestField21", "TestField22"] }
    });
    assert.deepEqual(columns[2], {
        dataField: "TestField21",
        visible: true,
        index: 2,
        caption: 'Test Field 21',
        ownerBand: 1
    });
    assert.deepEqual(columns[3], {
        dataField: "TestField22",
        visible: true,
        index: 3,
        caption: 'Test Field 22',
        ownerBand: 1
    });
});


// T282665
QUnit.test('Apply user state when operations is not allowed', function(assert) {
    // arrange
    var that = this,
        columns;

    this.options.columnChooser = { enabled: false };
    this.options.groupPanel = { visible: false, allowColumnDragging: true };
    this.options.filterRow = { visible: false };
    this.options.headerFilter = { visible: false };
    this.options.sorting = { mode: "none" };
    this.options.allowColumnResizing = false;
    this.options.columnFixing = { enabled: false };

    // act
    that.columnsController.setUserState([
        { dataField: "TestField1", visibleIndex: 0, visible: true, width: 50, sortOrder: "desc", filterValue: "Test1", selectedFilterOperation: "startswith", groupIndex: 0, filterValues: ["test"], filterType: "exclude", fixed: true, fixedPosition: "right" },
        { dataField: "TestField2", visibleIndex: 1, visible: false, width: 150, sortOrder: "desc", filterValue: "Test2", selectedFilterOperation: "=" }
    ]);

    that.applyOptions({
        columns: [
            { dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: '=' },
            { dataField: 'TestField2', dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: 'startswith' }
        ]
    });

    columns = this.getColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, "width": 100, "sortOrder": "asc", sortIndex: 0, "filterValue": "TestFilter1", "selectedFilterOperation": "=", index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visible": true, "width": 50, "sortOrder": "asc", sortIndex: 1, "filterValue": "TestFilter2", "selectedFilterOperation": "startswith", index: 1, caption: 'Test Field 2', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: 'startswith', showEditorAlways: false });
});

QUnit.test('Apply user state with ignoreColumnOptionNames option', function(assert) {
    // arrange
    var that = this,
        columns;

    this.options.columnChooser = { enabled: false };
    this.options.groupPanel = { visible: false, allowColumnDragging: true };
    this.options.filterRow = { visible: false };
    this.options.headerFilter = { visible: false };
    this.options.sorting = { mode: "none" };
    this.options.allowColumnResizing = false;
    this.options.columnFixing = { enabled: false };
    this.options.stateStoring = { ignoreColumnOptionNames: ["width", "groupIndex", "sortOrder", "filterValue", "selectedFilterOperation"] };

    // act
    that.columnsController.setUserState([
        { dataField: "TestField1", visibleIndex: 0, visible: true, width: 50, sortOrder: "desc", filterValue: "Test1", selectedFilterOperation: "startswith", groupIndex: 0, filterValues: ["test"], filterType: "exclude", fixed: true, fixedPosition: "right" },
        { dataField: "TestField2", visibleIndex: 1, visible: false, width: 150, sortOrder: "desc", filterValue: "Test2", selectedFilterOperation: "=" }
    ]);

    that.applyOptions({
        columns: [
            { dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: '=' },
            { dataField: 'TestField2', dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: 'startswith' }
        ]
    });

    columns = this.getColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, "width": 100, "sortOrder": "asc", sortIndex: 0, "filterValue": "TestFilter1", "selectedFilterOperation": "=", index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false, filterValues: ["test"], filterType: "exclude", fixed: true, fixedPosition: "right" });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visible": false, "width": 50, "sortOrder": "asc", sortIndex: 1, "filterValue": "TestFilter2", "selectedFilterOperation": "startswith", index: 1, caption: 'Test Field 2', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: 'startswith', showEditorAlways: false });
});

// T243567
QUnit.test('Apply user state dataField', function(assert) {
    // arrange
    var that = this,
        columns;

    // act
    that.columnsController.setUserState([
        { name: "TestField1", dataField: "TestField1B", visibleIndex: 0, visible: true },
        { dataField: "TestField2", visibleIndex: 1, visible: true }
    ]);

    that.applyOptions({
        columns: [
            { name: 'TestField1', dataField: 'TestField1A', dataType: 'string' },
            { dataField: 'TestField2', dataType: 'string' }
        ]
    });

    columns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.equal(columns[0].name, "TestField1");
    assert.equal(columns[0].dataField, "TestField1B");
    assert.equal(columns[0].caption, "Test Field 1B");
    assert.equal(columns[0].calculateCellValue({ TestField1A: 1, TestField1B: 2 }), 2, "calculateCellValue for TestField1b");
});

// T113640
QUnit.test('Apply user state with undefined column option value', function(assert) {
    // arrange
    var that = this,
        columns;

    // act
    that.columnsController.setUserState([{ dataField: "TestField1", visibleIndex: 0, visible: true }, { dataField: "TestField2", visibleIndex: 1, visible: false, groupIndex: 0 }]);

    that.applyOptions({
        columns: [{ dataField: 'TestField1', groupIndex: 0 }, { dataField: 'TestField2', groupIndex: 1 }]
    });

    columns = this.getColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, index: 0, caption: 'Test Field 1' });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visible": false, index: 1, caption: 'Test Field 2', groupIndex: 0 });
});

QUnit.test("Apply user state columns are generated by dataSource", function(assert) {
    // arrange
    var dataSource = new DataSource([
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 19 }
    ]);

    dataSource.load();

    // act
    this.columnsController.setUserState([{ "dataField": "name", "visibleIndex": 1, "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test1", "selectedFilterOperation": "startswith" },
                                            { "dataField": "age", "visibleIndex": 0, "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test2", "selectedFilterOperation": "=" }]);

    this.applyOptions({});
    this.columnsController.applyDataSource(dataSource);

    var columns = this.getColumns();

    // assert
    assert.deepEqual(columns[0], { "dataField": "name", "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test1", "selectedFilterOperation": "startswith", alignment: 'left', index: 0, caption: 'Name', dataType: 'string', showEditorAlways: false });
    assert.deepEqual(columns[1], { "dataField": "age", "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test2", "selectedFilterOperation": "=", alignment: 'right', index: 1, caption: 'Age', dataType: 'number', showEditorAlways: false });
    assert.deepEqual(this.getColumns(["visibleIndex"]), [{ visibleIndex: 1 }, { visibleIndex: 0 }]);
});

// T551524, T552566
QUnit.test("Apply user state columns are generated by dataSource and dataSource is empty", function(assert) {
    // arrange
    var dataSource = new DataSource([]);

    dataSource.load();

    // act
    this.columnsController.setUserState([{ "dataField": "name", "visibleIndex": 1, "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test1", "selectedFilterOperation": "startswith" },
                                            { "dataField": "age", "visibleIndex": 0, "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test2", "selectedFilterOperation": "=" }]);

    this.applyOptions({});
    this.columnsController.applyDataSource(dataSource);

    var columns = this.getColumns();

    // assert
    assert.equal(columns.length, 2, "columns are from user state");
    assert.deepEqual(this.getColumns(["dataField", "visibleIndex"]), [{ dataField: "name", visibleIndex: 1 }, { dataField: "age", visibleIndex: 0 }]);
});

QUnit.test('Columns order when apply user state', function(assert) {
    // arrange
    var that = this,
        columns;

    // act
    that.columnsController.setUserState([
        { "dataField": "TestField1", "visibleIndex": 1, "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith" },
        { "dataField": "TestField2", "visibleIndex": 0, "visible": true, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=" }]);

    that.applyOptions({
        columns: [{ dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: 'startswith' }, { dataField: 'TestField2', dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: '=' }]
    });

    columns = this.getVisibleColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField2", "visible": true, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=", index: 1, caption: 'Test Field 2', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false });
    assert.deepEqual(columns[1], { "dataField": "TestField1", "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith", index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: 'startswith', showEditorAlways: false });
});

QUnit.test('Columns order when apply user state old version (without visibleIndex but with initialIndex)', function(assert) {
    // arrange
    var that = this,
        columns;

    // act
    that.columnsController.setUserState([
        { "dataField": "TestField2", "initialIndex": 1, "visible": true, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=" },
        { "dataField": "TestField1", "initialIndex": 0, "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith" }
    ]);

    that.applyOptions({
        columns: [{ dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: 'startswith' }, { dataField: 'TestField2', dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: '=' }]
    });

    columns = this.getVisibleColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField2", "visible": true, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=", index: 0, caption: 'Test Field 2', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false });
    assert.deepEqual(columns[1], { "dataField": "TestField1", "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith", index: 1, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: 'startswith', showEditorAlways: false });
});

QUnit.test('Apply user state when 15_1 options in columns', function(assert) {
    // arrange
    var that = this,
        columns;

    // act
    that.columnsController.setUserState([
        { dataField: "TestField1", visibleIndex: 0, visible: true, "width": 50, sortOrder: "desc", filterValue: "Test1", selectedFilterOperation: "startswith" },
        { dataField: "TestField2", visibleIndex: 1, visible: false, width: 150, sortOrder: "desc", filterValue: "Test2", selectedFilterOperation: "=" }
    ]);

    that.applyOptions({
        columns: [
                { dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: 'startswith', fixed: true, fixedPosition: "right" },
                { dataField: 'TestField2', dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: '=' }
        ]
    });

    columns = this.getColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith", index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: 'startswith', showEditorAlways: false, fixed: true, fixedPosition: "right" });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=", index: 1, caption: 'Test Field 2', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false });
});

QUnit.test('Apply user state when 15_1 options in user state', function(assert) {
    // arrange
    var that = this,
        columns;

    // act
    that.columnsController.setUserState([
        { dataField: "TestField1", visibleIndex: 0, visible: true, "width": 50, sortOrder: "desc", filterValue: "Test1", selectedFilterOperation: "startswith", fixed: false },
        { dataField: "TestField2", visibleIndex: 1, visible: false, width: 150, sortOrder: "desc", filterValue: "Test2", selectedFilterOperation: "=", fixed: true }
    ]);

    that.applyOptions({
        columns: [
                { dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: 'startswith', fixed: true, fixedPosition: "right" },
                { dataField: 'TestField2', dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: '=' }
        ]
    });

    columns = this.getColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith", index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: 'startswith', showEditorAlways: false, fixed: false, fixedPosition: "right" });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=", index: 1, caption: 'Test Field 2', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false, fixed: true });
});

QUnit.test('No apply user state when dataField in columns and user state are different', function(assert) {
    // arrange
    var that = this,
        columns;


    // act
    that.columnsController.setUserState([
        { "dataField": "Test1", "visibleIndex": 0, "visible": true, "width": 50, "sortOrder": "desc", "filterValue": "Test1", "selectedFilterOperation": "startswith" },
        { "dataField": "TestField2", "visibleIndex": 1, "visible": false, "width": 150, "sortOrder": "desc", "filterValue": "Test2", "selectedFilterOperation": "=" }
    ]);
    that.applyOptions({
        columns: [
                { dataField: 'TestField1', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: '=' },
                { dataField: 'TestField2', dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: '=' }
        ]
    });

    columns = this.getColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, "width": 100, "sortOrder": "asc", sortIndex: 0, "filterValue": "TestFilter1", "selectedFilterOperation": "=", index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false }, "state is not applied");
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=", index: 1, caption: 'Test Field 2', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false }, "state is applied");
});

QUnit.test('apply user state when several calculated columns without names', function(assert) {
    // arrange
    var that = this,
        columns;


    // act
    that.columnsController.setUserState([
            { "visibleIndex": 0, "visible": true, "width": 50, "sortOrder": "desc", "filterValue": "Test1", "selectedFilterOperation": "startswith" },
            { "visibleIndex": 1, "visible": false, "width": 150, "sortOrder": "desc", "filterValue": "Test2", "selectedFilterOperation": "=" }
    ]);
    that.applyOptions({
        columns: [
                { dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: 'startswith' },
                { dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: '=' }
        ]
    });

    columns = this.getColumns();

    // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith", index: 0, dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: 'startswith', showEditorAlways: false, allowSorting: false }, "state is applied");
    assert.deepEqual(columns[1], { "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=", index: 1, dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false, allowSorting: false }, "state is applied");
});

QUnit.test('apply user state when several columns with same dataField', function(assert) {
        // arrange
    var that = this,
        columns;


        // act
    that.columnsController.setUserState([
            { dataField: "Test", "visibleIndex": 0, "visible": true, "width": 50, "sortOrder": "desc", "filterValue": "Test1", "selectedFilterOperation": "startswith" },
            { dataField: "Test", "visibleIndex": 1, "visible": false, "width": 150, "sortOrder": "desc", "filterValue": "Test2", "selectedFilterOperation": "=" }
    ]);
    that.applyOptions({
        columns: [
                { dataField: "Test", dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: 'startswith' },
                { dataField: "Test", dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: '=' }
        ]
    });

    columns = this.getColumns();

        // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { dataField: "Test", caption: "Test", "visible": true, "width": 50, "sortOrder": "desc", sortIndex: 0, "filterValue": "Test1", "selectedFilterOperation": "startswith", index: 0, dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: 'startswith', showEditorAlways: false }, "state is applied");
    assert.deepEqual(columns[1], { dataField: "Test", caption: "Test", "visible": false, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test2", "selectedFilterOperation": "=", index: 1, dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false }, "state is applied");
});

// T352648
QUnit.test('apply user state when columns count in columns and columns user state are different', function(assert) {
        // arrange
    var that = this,
        columns;

        // act
    that.columnsController.setUserState([{ "dataField": "TestField2", "visibleIndex": 0, "visible": true, "width": 150, "sortOrder": "desc", "filterValue": "Test1", "selectedFilterOperation": "<>" }]);
    that.applyOptions({
        columns: [
                { dataField: 'TestField1', dataType: 'string', width: 50, sortOrder: 'asc', filterValue: 'TestFilter2', selectedFilterOperation: 'startswith' },
                { dataField: 'TestField2', dataType: 'string', width: 100, sortOrder: 'asc', filterValue: 'TestFilter1', selectedFilterOperation: '=' }
        ]
    });

    columns = this.getColumns();

        // assert
    assert.equal(columns.length, 2);
    assert.deepEqual(columns[0], { "dataField": "TestField1", "visible": true, "width": 50, "sortOrder": "asc", sortIndex: 0, "filterValue": "TestFilter2", "selectedFilterOperation": "startswith", index: 0, caption: 'Test Field 1', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: 'startswith', showEditorAlways: false });
    assert.deepEqual(columns[1], { "dataField": "TestField2", "visible": true, "width": 150, "sortOrder": "desc", sortIndex: 1, "filterValue": "Test1", "selectedFilterOperation": "<>", index: 1, caption: 'Test Field 2', dataType: 'string', alignment: 'left', defaultSelectedFilterOperation: '=', showEditorAlways: false });
});

QUnit.module("Band columns", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("getVisibleColumns for data columns", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(visibleColumns.length, 3, "count column");

    // first column
    assert.strictEqual(visibleColumns[0].caption, "Column 1", "caption of the first column");
    assert.equal(visibleColumns[0].rowspan, 2, "rowspan of the first column");
    assert.ok(!visibleColumns[0].isBand, "data column");

    // second column
    assert.strictEqual(visibleColumns[1].caption, "Column 2", "caption of the second column");
    assert.equal(visibleColumns[1].ownerBand, 1, "ownerBand of the second column");
    assert.ok(!visibleColumns[1].rowspan, "rowspan of the second column");
    assert.ok(!visibleColumns[1].isBand, "data column");

    // third column
    assert.strictEqual(visibleColumns[2].caption, "Column 3", "caption of the third column");
    assert.equal(visibleColumns[2].ownerBand, 1, "ownerBand of the third column");
    assert.ok(!visibleColumns[2].rowspan, "rowspan of the third column");
    assert.ok(!visibleColumns[2].isBand, "data column");
});

// T408073
QUnit.test("getVisibleColumns for headers last level columns when recursive bands", function(assert) {
    // arrange
    this.applyOptions({
        columns: [{
            caption: "Band column 1",
            columns: [
                { caption: "Band column 2", columns: ["field1", "field2", "field3"] },
                { caption: "Band column 3", columns: ["field4", "field5", "field6"] }
            ]
        }]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var visibleColumns = this.columnsController.getVisibleColumns(2);

    // assert
    assert.equal(visibleColumns.length, 6, "count column");

    assert.strictEqual(visibleColumns[0].dataField, "field1");
    assert.strictEqual(visibleColumns[1].dataField, "field2");
    assert.strictEqual(visibleColumns[2].dataField, "field3");
    assert.strictEqual(visibleColumns[3].dataField, "field4");
    assert.strictEqual(visibleColumns[4].dataField, "field5");
    assert.strictEqual(visibleColumns[5].dataField, "field6");
});

QUnit.test("getVisibleColumns with rowIndex", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var visibleColumns = this.columnsController.getVisibleColumns(0);

    // assert
    assert.equal(visibleColumns.length, 2, "count column");

    // first column
    assert.strictEqual(visibleColumns[0].caption, "Column 1", "caption of the first column of the first row");
    assert.equal(visibleColumns[0].rowspan, 2, "rowspan of the first column of the first row");
    assert.ok(!visibleColumns[0].isBand, "data column");

    // second column
    assert.strictEqual(visibleColumns[1].caption, "Band Column 1", "caption of the second column of the first row");
    assert.equal(visibleColumns[1].colspan, 2, "colspan of the second column of the first row");
    assert.ok(visibleColumns[1].isBand, "band column");

    // act
    visibleColumns = this.columnsController.getVisibleColumns(1);

    // first column
    assert.strictEqual(visibleColumns[0].caption, "Column 2", "caption of the first column of the second row");
    assert.ok(!visibleColumns[0].rowspan, "rowspan of the first column of the second row");
    assert.ok(!visibleColumns[0].isBand, "data column");

    // second column
    assert.strictEqual(visibleColumns[1].caption, "Column 3", "caption of the second column of the second row");
    assert.ok(!visibleColumns[1].rowspan, "rowspan of the second column of the second row");
    assert.ok(!visibleColumns[1].isBand, "data column");
});

QUnit.test("getVisibleColumns with rowIndex and grouped columns", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1", groupIndex: 0 },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2", groupIndex: 1 },
                    { dataField: "TestField3", caption: "Column 3" },
                    { caption: "Band Column 2", columns: [{ dataField: "TestField4", caption: "Column 4" }] }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var visibleColumns = this.columnsController.getVisibleColumns(0);

    // assert
    assert.equal(visibleColumns.length, 3, "count column");

    // first column
    assert.strictEqual(visibleColumns[0].caption, "Column 1", "caption of the first column of the first row");
    assert.strictEqual(visibleColumns[0].command, "expand", "command column");
    assert.ok(!visibleColumns[0].rowspan, "rowspan of the first column of the first row");

    // second column
    assert.strictEqual(visibleColumns[1].caption, "Column 2", "caption of the second column of the first row");
    assert.strictEqual(visibleColumns[1].command, "expand", "command column");
    assert.ok(!visibleColumns[1].rowspan, "rowspan of the second column of the first row");

    // third column
    assert.strictEqual(visibleColumns[2].caption, "Band Column 1", "caption of the second column of the first row");
    assert.equal(visibleColumns[2].colspan, 2, "colspan of the second column of the first row");
    assert.ok(visibleColumns[2].isBand, "band column");

    // act
    visibleColumns = this.columnsController.getVisibleColumns(1);

    // assert
    assert.equal(visibleColumns.length, 4, "count column");

    // first column
    assert.strictEqual(visibleColumns[0].caption, "Column 1", "caption of the first column of the second row");
    assert.strictEqual(visibleColumns[0].command, "expand", "command column");
    assert.equal(visibleColumns[0].rowspan, 2, "rowspan of the first column of the second row");

    // second column
    assert.strictEqual(visibleColumns[1].caption, "Column 2", "caption of the second column of the second row");
    assert.strictEqual(visibleColumns[1].command, "expand", "command column");
    assert.equal(visibleColumns[1].rowspan, 2, "rowspan of the second column of the second row");

    // third column
    assert.strictEqual(visibleColumns[2].caption, "Column 3", "caption of the third column of the second row");
    assert.equal(visibleColumns[2].rowspan, 2, "rowspan of the third column of the second row");
    assert.ok(!visibleColumns[2].isBand, "data column");

    // fourth column
    assert.strictEqual(visibleColumns[3].caption, "Band Column 2", "caption of the fourth column of the second row");
    assert.equal(visibleColumns[3].colspan, 1, "colspan of the fourth column of the second row");
    assert.ok(visibleColumns[3].isBand, "band column");

    // act
    visibleColumns = this.columnsController.getVisibleColumns(2);

    // assert
    assert.equal(visibleColumns.length, 1, "count column");

    // first column
    assert.strictEqual(visibleColumns[0].caption, "Column 4", "caption of the first column of the third row");
    assert.ok(!visibleColumns[0].rowspan, "rowspan of the first column of the third row");
    assert.ok(!visibleColumns[0].isBand, "data column");
});

// T407455
QUnit.test("getVisibleColumns when all columns is hidden in band column", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2", visible: false },
                    { dataField: "TestField3", caption: "Column 3", visible: false }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var visibleColumns = this.columnsController.getVisibleColumns();

    // assert
    assert.equal(this.columnsController.getRowCount(), 1, "row column");
    assert.equal(visibleColumns.length, 2, "count column");
    assert.strictEqual(visibleColumns[0].caption, "Column 1", "caption of the first column");
    assert.strictEqual(visibleColumns[1].caption, "Band Column 1", "caption of the second column");
});

QUnit.test("getFixedColumns for data columns", function(assert) {
    // arrange
    this.applyOptions({
        columnFixing: {
            enabled: true
        },
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", fixed: true, columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var fixedColumns = this.columnsController.getFixedColumns();

    // assert
    assert.equal(fixedColumns.length, 3, "count fixed column");
    assert.strictEqual(fixedColumns[0].caption, "Column 2", "caption of the first fixed column");
    assert.strictEqual(fixedColumns[1].caption, "Column 3", "caption of the second fixed column");
    assert.strictEqual(fixedColumns[2].command, "transparent", "transparent column");

    // T380016
    assert.ok(!fixedColumns[0].allowFixing, "allowFixing of the first fixed column");
    assert.ok(!fixedColumns[1].allowFixing, "allowFixing of the second fixed column");
});

QUnit.test("getFixedColumns with rowIndex", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", fixed: true, columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var fixedColumns = this.columnsController.getFixedColumns(0); // columns of the first row

    // assert
    assert.equal(fixedColumns.length, 2, "count fixed column");
    assert.strictEqual(fixedColumns[0].caption, "Band Column 1", "caption of the first fixed column");
    assert.strictEqual(fixedColumns[1].command, "transparent", "transparent column");

    // act
    fixedColumns = this.columnsController.getFixedColumns(1); // columns of the second row

    // assert
    assert.equal(fixedColumns.length, 3, "count fixed column");
    assert.strictEqual(fixedColumns[0].caption, "Column 2", "caption of the first fixed column");
    assert.strictEqual(fixedColumns[1].caption, "Column 3", "caption of the second fixed column");
    assert.strictEqual(fixedColumns[2].command, "transparent", "transparent column");
});

QUnit.test("getFixedColumns when has only one fixed column", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", fixed: true, columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var fixedColumns = this.columnsController.getFixedColumns(); // columns of the first row

    // assert
    assert.equal(fixedColumns.length, 0, "not fixed columns");
});

QUnit.test("calculate colspan for band columns and rowspan for data columns", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField1", caption: "Column 1" },
                    { dataField: "TestField2", caption: "Column 2" },
                    {
                        caption: "Band Column 2", columns: [
                            { dataField: "TestField3", caption: "Column 3" },
                            {
                                caption: "Band Column 3", columns: [
                                    { dataField: "TestField4", caption: "Column 4" },
                                    { dataField: "TestField5", caption: "Column 5" },
                                ]
                            }
                        ]
                    }
                ]
            },
            { dataField: "TestField6", caption: "Column 6" }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var columns = this.columnsController.getVisibleColumns();  // get data columns

    // assert
    assert.equal(columns.length, 6, "count column");
    assert.equal(columns[0].rowspan, 3, "rowspan of the first column");
    assert.equal(columns[1].rowspan, 3, "rowspan of the second column");
    assert.equal(columns[2].rowspan, 2, "rowspan of the third column");
    assert.ok(!columns[3].rowspan, "rowspan of the fourth column");
    assert.ok(!columns[4].rowspan, "rowspan of the fifth column");
    assert.equal(columns[5].rowspan, 4, "rowspan of the sixth column");
});

QUnit.test("band columns with same captions", function(assert) {
    // arrange
    var visibleColumns;

    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField1", caption: "Column 1" },
                    { dataField: "TestField2", caption: "Column 2" }
                ]
            },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField3", caption: "Column 3" },
                    { dataField: "TestField4", caption: "Column 4" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    visibleColumns = this.columnsController.getVisibleColumns(0);

    // assert
    assert.equal(visibleColumns.length, 2, "count columns");
    assert.strictEqual(visibleColumns[0].caption, "Band Column 1", "caption of the first column");
    assert.ok(visibleColumns[0].isBand, "band column");
    assert.equal(visibleColumns[0].colspan, 2, "colspan of the first column");
    assert.strictEqual(visibleColumns[1].caption, "Band Column 1", "caption of the second column");
    assert.ok(visibleColumns[1].isBand, "band column");
    assert.equal(visibleColumns[1].colspan, 2, "colspan of the second column");

    // act
    visibleColumns = this.columnsController.getVisibleColumns(1);

    // assert
    assert.equal(visibleColumns.length, 4, "count columns");
    assert.strictEqual(visibleColumns[0].caption, "Column 1", "caption of the first column");
    assert.equal(visibleColumns[0].ownerBand, 0, "ownerBand of the first column");
    assert.strictEqual(visibleColumns[1].caption, "Column 2", "caption of the second column");
    assert.equal(visibleColumns[1].ownerBand, 0, "ownerBand of the second column");
    assert.strictEqual(visibleColumns[2].caption, "Column 3", "caption of the third column");
    assert.equal(visibleColumns[2].ownerBand, 3, "ownerBand of the third column");
    assert.strictEqual(visibleColumns[3].caption, "Column 4", "caption of the fourth column");
    assert.equal(visibleColumns[3].ownerBand, 3, "ownerBand of the fourth column");
});

QUnit.test("visible index of the band columns", function(assert) {
    // arrange
    var visibleColumns;

    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField1", caption: "TestField1" },
                    { dataField: "TestField2", caption: "TestField2" }
                ]
            }, {
                caption: "Band Column 2", columns: [
                        { dataField: "TestField3", caption: "TestField3" },
                        { dataField: "TestField4", caption: "TestField4" }
                ]
            },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField5", caption: "TestField5" },
                    { dataField: "TestField6", caption: "TestField6" }
                ]
            },
            { dataField: "TestField7", caption: "TestField7" }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    visibleColumns = this.columnsController.getVisibleColumns(0);

    // assert
    assert.equal(visibleColumns.length, 4, "count columns");
    assert.strictEqual(visibleColumns[0].caption, "Band Column 1", "caption of the first column");
    assert.equal(visibleColumns[0].visibleIndex, 0, "visibleIndex of the first column");

    assert.strictEqual(visibleColumns[1].caption, "Band Column 2", "caption of the second column");
    assert.equal(visibleColumns[1].visibleIndex, 1, "visibleIndex of the second column");

    assert.strictEqual(visibleColumns[2].caption, "Band Column 1", "caption of the third column");
    assert.equal(visibleColumns[2].visibleIndex, 2, "visibleIndex of the third column");

    assert.strictEqual(visibleColumns[3].caption, "TestField7", "caption of the fourth column");
    assert.equal(visibleColumns[3].visibleIndex, 3, "visibleIndex of the fourth column");

    // act
    visibleColumns = this.columnsController.getVisibleColumns(1);

    // assert
    assert.equal(visibleColumns.length, 6, "count columns");
    assert.strictEqual(visibleColumns[0].caption, "TestField1", "caption of the first column");
    assert.equal(visibleColumns[0].visibleIndex, 0, "visibleIndex of the first column");

    assert.strictEqual(visibleColumns[1].caption, "TestField2", "caption of the second column");
    assert.equal(visibleColumns[1].visibleIndex, 1, "visibleIndex of the second column");

    assert.strictEqual(visibleColumns[2].caption, "TestField3", "caption of the third column");
    assert.equal(visibleColumns[2].visibleIndex, 0, "visibleIndex of the third column");

    assert.strictEqual(visibleColumns[3].caption, "TestField4", "caption of the fourth column");
    assert.equal(visibleColumns[3].visibleIndex, 1, "visibleIndex of the fourth column");

    assert.strictEqual(visibleColumns[4].caption, "TestField5", "caption of the fifth column");
    assert.equal(visibleColumns[4].visibleIndex, 0, "visibleIndex of the fifth column");

    assert.strictEqual(visibleColumns[5].caption, "TestField6", "caption of the sixth column");
    assert.equal(visibleColumns[5].visibleIndex, 1, "visibleIndex of the sixth column");
});

QUnit.test("getVisibleIndex when there is band columns", function(assert) {
    // arrange
    var column;

    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField1", caption: "TestField1" },
                    { dataField: "TestField2", caption: "TestField2" }
                ]
            },
            { dataField: "TestField3", caption: "TestField3" },
            {
                caption: "Band Column 2", columns: [
                        { dataField: "TestField4", caption: "TestField4" },
                        { dataField: "TestField5", caption: "TestField5" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    column = this.columnsController.columnOption("TestField5");

    // assert
    assert.strictEqual(column.dataField, "TestField5", "dataField of the fourth cell of the second row");
    assert.equal(this.columnsController.getVisibleIndex(column.index, 1), 3, "visible index of the fourth cell of the second row");
});

QUnit.test("Initialization with band columns when set customizeColumns", function(assert) {
    // arrange
    var callCustomizeColumns,
        assertColumns = function(columns) {
            assert.equal(columns.length, 4);
            assert.strictEqual(columns[0].caption, 'Column 1', "caption of the first column");
            assert.strictEqual(columns[1].caption, 'Band Column 1', "caption of the second column");
            assert.ok(columns[1].isBand, 'band column');
            assert.strictEqual(columns[2].caption, 'Column 2', "caption of the third column");
            assert.equal(columns[2].ownerBand, 1, "ownerBand of the third column");
            assert.strictEqual(columns[3].caption, 'Column 3', "caption of the fourth column");
            assert.equal(columns[3].ownerBand, 1, "ownerBand of the fourth column");
        };

    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ],
        customizeColumns: function(columns) {
            assertColumns(columns);
            callCustomizeColumns = true;
        }
    });

    // act
    this.columnsController.applyDataSource(createMockDataSource([{ TestField1: 'asdasd', TestField2: 444, TestField3: true }]));

    // assert
    assert.ok(this.columnsController.isInitialized());
    assert.ok(callCustomizeColumns, "call customizeColumns");
    assertColumns(this.columnsController.getColumns());
});

QUnit.test("Changing column option is ownerBand via customizeColumns", function(assert) {
    // arrange
    var columns,
        callCustomizeColumns;

    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ],
        customizeColumns: function(columns) {
            callCustomizeColumns = true;
            for(var i = 0; i < columns.length; i++) {
                if(columns[i].dataField === "TestField2") {
                    delete columns[i].ownerBand;
                }
            }
        }
    });

    // act
    this.columnsController.applyDataSource(createMockDataSource([{ TestField1: 'asdasd', TestField2: 444, TestField3: true }]));

    // assert
    assert.ok(this.columnsController.isInitialized());
    assert.ok(callCustomizeColumns, "call customizeColumns");

    // columns of the first row
    columns = this.columnsController.getVisibleColumns(0);
    assert.equal(columns.length, 3, "count column of the first row");
    assert.strictEqual(columns[0].dataField, "TestField1", "dataField of the first column");
    assert.equal(columns[0].rowspan, 2, "rowspan of the first column");
    assert.strictEqual(columns[1].dataField, "TestField2", "dataField of the second column");
    assert.equal(columns[1].rowspan, 2, "rowspan of the second column");
    assert.strictEqual(columns[2].caption, "Band Column 1", "dataField of the third column");
    assert.equal(columns[2].colspan, 1, "colspan of the third column");

    // columns of the second row
    columns = this.columnsController.getVisibleColumns(1);
    assert.equal(columns.length, 1, "count column of the first row");
    assert.strictEqual(columns[0].dataField, "TestField3", "dataField of the first column");
});

QUnit.test("Initialization band columns with user state", function(assert) {
    // arrange
    var columns;

    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    this.columnsController.setUserState([
        { dataField: "TestField1", sortOrder: "desc", sortIndex: 0, index: 0 },
        { caption: "Band Column 1", index: 1 },
        { dataField: "TestField2", index: 2 },
        { dataField: "TestField3", index: 3 }
    ]);

    // assert
    columns = this.columnsController.getColumns();
    assert.ok(this.columnsController.isInitialized());
    assert.equal(columns.length, 4, "count column");
    assert.strictEqual(columns[0].caption, "Column 1", "caption of the first column");
    assert.strictEqual(columns[0].sortOrder, "desc", "sortOrder of the first column");
    assert.equal(columns[0].sortIndex, 0, "sortIndex of the first column");
    assert.equal(columns[0].index, 0, "index of the first column");
    assert.strictEqual(columns[1].caption, "Band Column 1", "caption of the second column");
    assert.equal(columns[1].index, 1, "index of the second column");
    assert.strictEqual(columns[2].caption, "Column 2", "caption of the third column");
    assert.equal(columns[2].index, 2, "index of the third column");
    assert.equal(columns[2].ownerBand, 1, "ownerBand of the third column");
    assert.strictEqual(columns[3].caption, "Column 3", "caption of the fourth column");
    assert.equal(columns[3].index, 3, "index of the fourth column");
    assert.equal(columns[3].ownerBand, 1, "ownerBand of the fourth column");
});

QUnit.test("getRowCount", function(assert) {
        // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var rowCount = this.columnsController.getRowCount();

    // assert
    assert.equal(rowCount, 2, "count row");
});

QUnit.test("getRowCount after hiding the band column", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());
    assert.equal(this.columnsController.getRowCount(), 2, "count row");

    // act
    this.columnsController.columnOption(1, "visible", false);

    // assert
    assert.equal(this.columnsController.getRowCount(), 1, "count row");
});

// T407797
QUnit.test("getRowCount with several band columns", function(assert) {
        // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            },
            {
                caption: "Band Column 2", columns: [
                    { dataField: "TestField4", caption: "Column 4" },
                    { dataField: "TestField5", caption: "Column 5" }
                ]
            },
            {
                caption: "Band Column 3", columns: [
                    { dataField: "TestField6", caption: "Column 6" },
                    { dataField: "TestField7", caption: "Column 7" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var rowCount = this.columnsController.getRowCount();

    // assert
    assert.equal(rowCount, 2, "count row");
});

QUnit.test("getRowIndex", function(assert) {
        // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var rowIndex = this.columnsController.getRowIndex(2);

    // assert
    assert.equal(rowIndex, 1, "rowIndex of the first column of the second row");
});

QUnit.test("getRowIndex when band column is grouped", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", groupIndex: 0, caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var rowIndex = this.columnsController.getRowIndex(2);

    // assert
    assert.equal(rowIndex, 0, "rowIndex of the first column of the second row");
});

QUnit.test("getRowIndex with flag the alwaysGetRowIndex", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", groupIndex: 0, caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var rowIndex = this.columnsController.getRowIndex(2, true);

    // assert
    assert.equal(rowIndex, 1, "rowIndex of the first column of the second row");
});

QUnit.test("Check parent of the column by band column index", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField1", caption: "Column 1" },
                    { dataField: "TestField2", caption: "Column 2" },
                    { caption: "Band Column 2", columns: [{ dataField: "TestField3", caption: "Column 3" }] }
                ]
            }
        ]
    });

    // act, assert
    assert.ok(this.columnsController.isInitialized());
    assert.ok(this.columnsController.isParentBandColumn(4, 0), "band column is the parent of the data column");
});

QUnit.test("isParentColumnVisible", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", visible: false, columns: [
                    { dataField: "TestField1", caption: "Column 1" },
                    { dataField: "TestField2", caption: "Column 2" },
                    { caption: "Band Column 2", columns: [{ dataField: "TestField3", caption: "Column 3" }] }
                ]
            }
        ]
    });

    // act, assert
    assert.ok(this.columnsController.isInitialized());
    assert.ok(!this.columnsController.isParentColumnVisible(4), "hidden column");
});

QUnit.test("get children by band column with rowIndex", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField1", caption: "Column 1" },
                    { dataField: "TestField2", caption: "Column 2" },
                    { caption: "Band Column 2", columns: [{ dataField: "TestField3", caption: "Column 3" }] }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var childrenColumns = this.columnsController.getChildrenByBandColumn(0, 1);

    // assert
    assert.equal(childrenColumns.length, 3, "count children column");
    assert.strictEqual(childrenColumns[0].caption, "Column 1", "caption of the first column");
    assert.strictEqual(childrenColumns[1].caption, "Column 2", "caption of the second column");
    assert.strictEqual(childrenColumns[2].caption, "Band Column 2", "caption of the third column");
});

QUnit.test("get children by band column without rowIndex", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField1", caption: "Column 1" },
                    { dataField: "TestField2", caption: "Column 2" },
                    { caption: "Band Column 2", columns: [{ dataField: "TestField3", caption: "Column 3" }] }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var childrenColumns = this.columnsController.getChildrenByBandColumn(0);

    // assert
    assert.equal(childrenColumns.length, 4, "count children column");
    assert.strictEqual(childrenColumns[0].caption, "Column 1", "caption of the first column");
    assert.strictEqual(childrenColumns[1].caption, "Column 2", "caption of the second column");
    assert.strictEqual(childrenColumns[2].caption, "Band Column 2", "caption of the third column");
    assert.strictEqual(childrenColumns[3].caption, "Column 3", "caption of the fourth column");
});

QUnit.test("get children by band column when there is grouped column", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField1", caption: "Column 1", groupIndex: 0 },
                    { dataField: "TestField2", caption: "Column 2" },
                    { caption: "Band Column 2", columns: [{ dataField: "TestField3", caption: "Column 3" }] }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var childrenColumns = this.columnsController.getChildrenByBandColumn(0, 1);

    // assert
    assert.equal(childrenColumns.length, 2, "count children column");
    assert.strictEqual(childrenColumns[0].caption, "Column 2", "caption of the second column");
    assert.strictEqual(childrenColumns[1].caption, "Band Column 2", "caption of the third column");
});

QUnit.test("get children by band column when there is grouped column with showWhenGrouped enabled", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField1", caption: "Column 1", groupIndex: 0, showWhenGrouped: true },
                    { dataField: "TestField2", caption: "Column 2" },
                    { caption: "Band Column 2", columns: [{ dataField: "TestField3", caption: "Column 3" }] }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var childrenColumns = this.columnsController.getChildrenByBandColumn(0, 1);

    // assert
    assert.equal(childrenColumns.length, 3, "count children column");
    assert.strictEqual(childrenColumns[0].caption, "Column 1", "caption of the first column");
    assert.strictEqual(childrenColumns[1].caption, "Column 2", "caption of the second column");
    assert.strictEqual(childrenColumns[2].caption, "Band Column 2", "caption of the third column");
});

QUnit.test("getInvisibleColumns with hidden band column", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            {
                caption: "Band Column 1", visible: false, columns: [
                    { dataField: "TestField1", caption: "Column 1" },
                    { dataField: "TestField2", caption: "Column 2" },
                    { caption: "Band Column 2", columns: [{ dataField: "TestField3", caption: "Column 3" }] }
                ]
            },
            { dataField: "TestField4", caption: "Column 4" }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var childrenColumns = this.columnsController.getInvisibleColumns();

    // assert
    assert.equal(childrenColumns.length, 5, "count children column");

    assert.strictEqual(childrenColumns[0].caption, "Band Column 1", "caption of the first column");
    assert.strictEqual(childrenColumns[1].caption, "Column 1", "caption of the second column");
    assert.strictEqual(childrenColumns[2].caption, "Column 2", "caption of the third column");
    assert.strictEqual(childrenColumns[3].caption, "Band Column 2", "caption of the fourth column");
    assert.strictEqual(childrenColumns[4].caption, "Column 3", "caption of the fifth column");
});

// T377667
QUnit.test("Band column with dataField", function(assert) {
    // arrange
    this.applyOptions({
        commonColumnSettings: {
            allowSorting: true
        },
        groupPanel: {
            visible: true,
            allowColumnDragging: true
        },
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", dataField: "TestField2", columns: [
                    { dataField: "TestField3", caption: "Column 2" },
                    { dataField: "TestField4", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isInitialized());

    // act
    var visibleColumns = this.columnsController.getVisibleColumns(0);

    // assert
    assert.equal(visibleColumns.length, 2, "count visible column");
    assert.strictEqual(visibleColumns[0].caption, "Column 1", "caption of the first column");
    assert.ok(visibleColumns[0].allowSorting, "allowSorting of the first column");
    assert.ok(visibleColumns[0].allowGrouping, "allowGrouping of the first column");
    assert.strictEqual(visibleColumns[1].caption, "Band Column 1", "caption of the second column");
    assert.ok(!visibleColumns[1].allowSorting, "allowSorting of the second column");
    assert.ok(!visibleColumns[1].allowGrouping, "allowGrouping of the second column");

    visibleColumns = this.columnsController.getVisibleColumns(1);
    assert.equal(visibleColumns.length, 2, "count visible column");
    assert.strictEqual(visibleColumns[0].caption, "Column 2", "caption of the first column");
    assert.ok(visibleColumns[0].allowSorting, "allowSorting of the first column");
    assert.ok(visibleColumns[0].allowGrouping, "allowGrouping of the first column");
    assert.strictEqual(visibleColumns[1].caption, "Column 3", "caption of the second column");
    assert.ok(visibleColumns[1].allowSorting, "allowSorting of the second column");
    assert.ok(visibleColumns[1].allowGrouping, "allowGrouping of the second column");
});

// T377667
QUnit.test("Set band column with dataField via customizeColumns", function(assert) {
    // arrange
    var callCustomizeColumns;

    this.applyOptions({
        commonColumnSettings: {
            allowSorting: true
        },
        groupPanel: {
            visible: true,
            allowColumnDragging: true
        },
        customizeColumns: function(columns) {
            columns.push({ caption: "Band Column 1", dataField: "TestField2", isBand: true });

            for(var i = 0; i < columns.length; i++) {
                if(columns[i].dataField === "TestField3" || columns[i].dataField === "TestField4") {
                    columns[i].ownerBand = columns.length - 1;
                }
            }
            callCustomizeColumns = true;
        },
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            { dataField: "TestField3", caption: "Column 2" },
            { dataField: "TestField4", caption: "Column 3" }
        ]
    });

    // act
    this.columnsController.applyDataSource(createMockDataSource([{ TestField1: 'asdasd', TestField3: 444, TestField4: true }]));

    // assert
    assert.ok(this.columnsController.isInitialized());
    assert.ok(callCustomizeColumns, "call customizeColumns");

    var visibleColumns = this.columnsController.getVisibleColumns(0);
    assert.equal(visibleColumns.length, 2, "count visible column");
    assert.strictEqual(visibleColumns[0].caption, "Column 1", "caption of the first column");
    assert.ok(visibleColumns[0].allowSorting, "allowSorting of the first column");
    assert.ok(visibleColumns[0].allowGrouping, "allowGrouping of the first column");
    assert.strictEqual(visibleColumns[1].caption, "Band Column 1", "caption of the second column");
    assert.ok(!visibleColumns[1].allowSorting, "allowSorting of the second column");
    assert.ok(!visibleColumns[1].allowGrouping, "allowGrouping of the second column");

    visibleColumns = this.columnsController.getVisibleColumns(1);
    assert.equal(visibleColumns.length, 2, "count visible column");
    assert.strictEqual(visibleColumns[0].caption, "Column 2", "caption of the first column");
    assert.ok(visibleColumns[0].allowSorting, "allowSorting of the first column");
    assert.ok(visibleColumns[0].allowGrouping, "allowGrouping of the first column");
    assert.strictEqual(visibleColumns[1].caption, "Column 3", "caption of the second column");
    assert.ok(visibleColumns[1].allowSorting, "allowSorting of the second column");
    assert.ok(visibleColumns[1].allowGrouping, "allowGrouping of the second column");
});

// T546870
QUnit.test("Band columns of the third level should be added in an correct order", function(assert) {
    // arrange, act
    this.applyOptions({
        columns: [{
            caption: "1",
            columns: [{
                caption: "11",
                columns: ["111", "112"]
            }, {
                caption: "12",
                columns: ["121", "122"]
            }]
        }, {
            caption: "2",
            columns: [{
                caption: "21",
                columns: ["211", "212"]
            }, {
                caption: "22",
                columns: ["221", "222"]
            }]
        }]
    });

    var visibleColumns = this.columnsController.getVisibleColumns(2);

    // assert
    assert.strictEqual(visibleColumns[0].caption, "111", "caption of the first column");
    assert.strictEqual(visibleColumns[1].caption, "112", "caption of the second column");
    assert.strictEqual(visibleColumns[2].caption, "121", "caption of the third column");
    assert.strictEqual(visibleColumns[3].caption, "122", "caption of the fourth column");
    assert.strictEqual(visibleColumns[4].caption, "211", "caption of the fifth column");
    assert.strictEqual(visibleColumns[5].caption, "212", "caption of the sixth column");
    assert.strictEqual(visibleColumns[6].caption, "221", "caption of the seventh column");
    assert.strictEqual(visibleColumns[7].caption, "222", "caption of the eighth column");
});

QUnit.test("isBandColumnsUsed should return true when bandcolumns are set", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3" }
                ]
            }
        ]
    });

    // assert
    assert.ok(this.columnsController.isBandColumnsUsed(), "band column is used");
});


QUnit.test("isBandColumnsUsed should return false when bandcolumns are not set", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            { dataField: "TestField2", caption: "Column 2" }
        ]
    });

    // assert
    assert.notOk(this.columnsController.isBandColumnsUsed(), "band column is not used");
});

QUnit.module("onOptionChanged", {
    beforeEach: function() {
        setupModule.apply(this, ["adaptivity"]);
        sinon.spy(this, "_notifyOptionChanged");
    },
    afterEach: function() {
        teardownModule.apply(this);
        this._notifyOptionChanged.restore();
    }
}, function() {
    QUnit.test("Event should be fired when changing the column.visible option", function(assert) {
        // arrange
        this.applyOptions({
            columns: ["field1", "field2"]
        });

        // act
        this.columnOption("field1", "visible", false);

        // assert
        assert.strictEqual(this._notifyOptionChanged.callCount, 1, "call count the onOptionChanged");
        assert.deepEqual(this._notifyOptionChanged.getCall(0).args, ["columns[0].visible", false, true], "onOptionChanged args");
    });

    QUnit.test("Event should be fired when grouping", function(assert) {
        // arrange
        var groupIndexCall;

        this.applyOptions({
            columns: ["field1", "field2"]
        });

        // act
        this.columnsController.moveColumn(0, -1, "headers", "group");

        // assert
        groupIndexCall = this._notifyOptionChanged.getCalls().filter(function(params) {
            if(params.args[0] === "columns[0].groupIndex") {
                return true;
            }
        })[0];
        assert.deepEqual(groupIndexCall.args, ["columns[0].groupIndex", 0, undefined], "onOptionChanged args");
    });

    QUnit.test("Event should be fired when sorting", function(assert) {
        // arrange
        this.applyOptions({
            sorting: { mode: "single" },
            columns: [{ dataField: "field1", sortOrder: "asc", allowSorting: true }, "field2"]
        });

        // act
        this.columnsController.changeSortOrder(0, "desc");

        // assert
        assert.deepEqual(this._notifyOptionChanged.getCall(0).args, ["columns[0].sortOrder", "desc", "asc"], "onOptionChanged args");
    });

    QUnit.test("Checking arguments when sorting a banded column", function(assert) {
        this.applyOptions({
            columns: ["field1", {
                caption: "Band column 1",
                columns: ["field2", {
                    caption: "Band column 2",
                    columns: ["field3", "field4"]
                }]
            }]
        });

        // act
        this.columnsController.columnOption("field3", "sortOrder", "desc");

        // assert
        assert.deepEqual(this._notifyOptionChanged.getCall(0).args, ["columns[1].columns[1].columns[0].sortOrder", "desc", undefined], "onOptionChanged args");
    });

    QUnit.test("Event should not be fired for a private column options", function(assert) {
        // arrange
        this.applyOptions({
            columns: ["field1", "field2"]
        });

        // act
        this.columnOption("field1", "visibleWidth", 100);
        this.columnOption("field1", "bufferedFilterValue", "test");
        this.columnOption("field1", "bestFitWidth", 80);

        // assert
        assert.strictEqual(this._notifyOptionChanged.callCount, 0, "onOptionChanged is not fired");
    });

    // T630149
    QUnit.test("optionChanged should not be fired for the command:adaptive column", function(assert) {
        // arrange
        this.applyOptions({
            columns: [{ dataField: "field1" }],
            columnHidingEnabled: true
        });
        this.columnOption("command:adaptive", "adaptiveHidden", false, true);

        assert.strictEqual(this._notifyOptionChanged.callCount, 0, "onOptionChanged is not fired");
    });
});

QUnit.module("Customization of the command columns", {
    beforeEach: function() {
        setupModule.apply(this, [["adaptivity"]]);
    },
    afterEach: function() {
        this.dispose && this.dispose();
    }
}, function() {
    QUnit.test("The edit column", function(assert) {
        // arrange
        var editCellTemplate = function() {};

        this.applyOptions({
            editing: {
                mode: "row",
                allowUpdating: true,
                texts: {
                    editRow: "Edit"
                }
            },
            columns: ["field1", "field2", {
                command: "edit",
                cellTemplate: editCellTemplate,
                width: 200,
                visibleIndex: -1
            }]
        });

        // act, assert
        assert.deepEqual(this.getVisibleColumns(["command", "cellTemplate", "width", "visibleIndex"])[0], {
            command: "edit",
            cellTemplate: editCellTemplate,
            width: 200,
            visibleIndex: -1
        }, "edit column");
    });

    QUnit.test("The select column", function(assert) {
        // arrange
        var selectCellTemplate = function() {};

        this.applyOptions({
            selection: {
                mode: "multiple",
                showCheckBoxesMode: "always"
            },
            columns: ["field1", "field2", {
                command: "select",
                cellTemplate: selectCellTemplate,
                width: 200,
                visibleIndex: 0
            }]
        });

        // act, assert
        assert.deepEqual(this.getVisibleColumns(["command", "cellTemplate", "width", "visibleIndex"])[2], {
            command: "select",
            cellTemplate: selectCellTemplate,
            width: 200,
            visibleIndex: 0
        }, "select column");
    });

    QUnit.test("The adaptive column", function(assert) {
        // arrange
        var adaptiveCellTemplate = function() {};

        this.applyOptions({
            columnHidingEnabled: true,
            columns: ["field1", "field2", {
                command: "adaptive",
                cellTemplate: adaptiveCellTemplate,
                width: 100,
                visibleIndex: -1,
                adaptiveHidden: false
            }]
        });

        // act, assert
        assert.deepEqual(this.getVisibleColumns(["command", "cellTemplate", "width", "visibleIndex"])[0], {
            command: "adaptive",
            cellTemplate: adaptiveCellTemplate,
            width: 100,
            visibleIndex: -1
        }, "adaptive column");
    });

    QUnit.test("The expand column", function(assert) {
        // arrange
        var expandCellTemplate = function() {};

        this.applyOptions({
            columnHidingEnabled: true,
            columns: [{ dataField: "field1", groupIndex: 0 }, "field2", {
                command: "expand",
                cellTemplate: expandCellTemplate,
                width: 100
            }]
        });

        // act, assert
        assert.deepEqual(this.getVisibleColumns(["command", "groupIndex", "dataField", "cellTemplate", "width"])[0], {
            command: "expand",
            groupIndex: 0,
            dataField: "field1",
            cellTemplate: expandCellTemplate,
            width: 100
        }, "group column");
    });

    QUnit.test("Get command options via columnOption method", function(assert) {
        // arrange
        this.applyOptions({
            editing: {
                mode: "row",
                allowUpdating: true,
                texts: {
                    editRow: "Edit"
                }
            },
            columns: ["field1", "field2", {
                command: "edit",
                width: 200,
                visibleIndex: -1
            }]
        });

        // act, assert
        assert.deepEqual(processColumnsForCompare([this.columnOption("command:edit")], ["command", "cellTemplate", "width", "visibleIndex"]), [{
            command: "edit",
            width: 200,
            visibleIndex: -1
        }], "edit column");
    });

    QUnit.test("Custom command column", function(assert) {
        // arrange
        this.applyOptions({
            columnHidingEnabled: true,
            columns: ["field1", "field2", {
                command: "custom",
                width: 100
            }]
        });

        // act, assert
        assert.deepEqual(this.getVisibleColumns()[2], {
            command: "custom",
            index: 2,
            width: 100,
            visible: true
        }, "custom command column");
    });

    QUnit.test("Get custom command options via columnOption method", function(assert) {
        // arrange
        this.applyOptions({ columns: ["field1", "field2", { command: "custom", width: 100 }] });

        // act, assert
        assert.deepEqual(processColumnsForCompare([this.columnOption("command:custom")], ["command", "width", "visible"]), [{ command: "custom", width: 100, visible: true }], "options of the custom command column");
    });

    QUnit.test("Update custom command options via columnOption method", function(assert) {
        // arrange
        this.applyOptions({ columns: ["field1", "field2", { command: "custom", width: 100 }] });

        // act
        this.columnOption("command:custom", "width", 50);

        // assert
        assert.strictEqual(this.columnOption("command:custom", "width"), 50, "width of the custom command column");
    });
});

// T622771
QUnit.test("Update dataSource of the column lookup", function(assert) {
    // arrange
    this.applyOptions({
        columns: [
            { dataField: "TestField1", caption: "Column 1" },
            {
                caption: "Band Column 1", columns: [
                    { dataField: "TestField2", caption: "Column 2" },
                    { dataField: "TestField3", caption: "Column 3", lookup: { dataSource: [] } }
                ]
            }
        ]
    });

    // act
    this.columnOption("TestField3", "lookup.dataSource", [1, 2, 3]);

    // assert
    assert.deepEqual(this.columnOption("TestField3", "lookup.dataSource"), [1, 2, 3], "lookup datasource");
});
