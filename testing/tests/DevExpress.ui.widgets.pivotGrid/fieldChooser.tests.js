"use strict";

QUnit.testStart(function() {
    var markup = '<div id="container"></div>';
    $("#qunit-fixture").html(markup);
});

require("common.css!");
require("generic_light.css!");
require("ui/pivot_grid/ui.pivot_grid.field_chooser");

var $ = require("jquery"),
    pointerMock = require("../../helpers/pointerMock.js"),
    domUtils = require("core/utils/dom"),
    devices = require("core/devices"),
    dataUtils = require("core/element_data"),
    renderer = require("core/renderer");

var createMockDataSource = function(options) {
    $.each(options.fields || [], function(index, field) {
        field.index = index;
    });

    var stubDataSource = {
        getAreaFields: function(area) {
            return options[area + "Fields"] || [];
        },
        field: sinon.stub(),
        getFieldValues: function(index) {
            return $.Deferred().resolve(options.fieldValues[index]);
        },
        fields: function() {
            return options.fields;
        },
        load: sinon.stub(),
        on: sinon.stub(),
        off: sinon.stub(),
        isLoading: sinon.stub().returns(false)
    };

    return stubDataSource;
};

QUnit.module("dxPivotGridFieldChooser", {
    beforeEach: function() {
        this.setup = function(dataSourceOptions, fieldChooserOptions) {
            fieldChooserOptions = fieldChooserOptions || {};
            if(dataSourceOptions) {
                this.dataSource = createMockDataSource(dataSourceOptions);
                fieldChooserOptions.dataSource = this.dataSource;
            }
            this.createFieldChooser(fieldChooserOptions);
        };

        this.createFieldChooser = function(fieldChooserOptions) {
            this.fieldChooser = this.$container.dxPivotGridFieldChooser(fieldChooserOptions).dxPivotGridFieldChooser("instance");
        };

        this.$container = $("#container");
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("Empty options", function(assert) {
    // act
    this.setup();

    assert.ok(this.fieldChooser);
    assert.ok(!this.dataSource);

    assert.equal(this.$container.find(".dx-area").length, 5, "area count");
    assert.equal(this.$container.find(".dx-area-field").length, 0, "field count");

    var $areaFieldsContainers = this.$container.find(".dx-area-fields");

    assert.equal($areaFieldsContainers.length, 5, "area fields container count");
    assert.equal($areaFieldsContainers.eq(0).attr("group"), undefined, "group 1");
    assert.equal($areaFieldsContainers.eq(0).attr("allow-scrolling"), undefined, "group 1 - allow-scrolling");
    assert.equal($areaFieldsContainers.eq(1).attr("group"), "filter", "group 2");
    assert.equal($areaFieldsContainers.eq(1).attr("allow-scrolling"), "true", "group 2 - allow-scrolling");
    assert.equal($areaFieldsContainers.eq(2).attr("group"), "row", "group 3");
    assert.equal($areaFieldsContainers.eq(2).attr("allow-scrolling"), "true", "group 3 - allow-scrolling");
    assert.equal($areaFieldsContainers.eq(3).attr("group"), "column", "group 4");
    assert.equal($areaFieldsContainers.eq(3).attr("allow-scrolling"), "true", "group 4 - allow-scrolling");
    assert.equal($areaFieldsContainers.eq(4).attr("group"), "data", "group 5");
    assert.equal($areaFieldsContainers.eq(4).attr("allow-scrolling"), "true", "group 5 - allow-scrolling");

    var sortable = this.fieldChooser.$element().dxSortable("instance");

    assert.strictEqual(sortable.option("allowDragging"), true, "dragging should be enabled by default");
});

QUnit.test("Empty DataSource", function(assert) {
    var dataSourceOptions = {};

    // act
    this.setup(dataSourceOptions);

    // assert
    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);
    assert.equal(this.$container.find(".dx-area").length, 5, "area count");
    assert.equal(this.$container.find(".dx-area-field").length, 0, "field count");
    assert.strictEqual(this.dataSource.load.callCount, 0);
});

QUnit.test("Render Area Fields", function(assert) {
    var dataSourceOptions = {
        rowFields: [
            { caption: "Field 1", area: 'row', allowFiltering: true, allowSorting: true }
        ],
        columnFields: [
            { caption: "Field 2", area: 'column', allowFiltering: false, allowSorting: true },
            { caption: "Field 3", area: 'column', allowFiltering: true, allowSorting: false }
        ],
        filterFields: [
            { caption: "Field 4", area: 'filter', allowFiltering: true, allowSorting: true }
        ],
        dataFields: [
            { caption: "Field 5", area: 'data', allowFiltering: true, allowSorting: true },
            { caption: "Field 6", area: 'data', allowFiltering: true, allowSorting: true }
        ]
    };

    // act
    this.setup(dataSourceOptions);

    // assert
    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);
    assert.equal(this.$container.find(".dx-area").length, 5, "area count");
    assert.equal(this.$container.find(".dx-area-fields").length, 5, "area fields container count");
    assert.equal(this.$container.find(".dx-area-field").length, 6, "field count");

    var $groupFieldElements = this.$container.find(".dx-area-fields[group=row] .dx-area-field");
    assert.equal($groupFieldElements.length, 1, 'row field elements count');
    assert.equal($groupFieldElements.eq(0).text(), 'Field 1', 'Field 1 text');
    assert.equal($groupFieldElements.find(".dx-sort").length, 1, 'sort indicator count');
    assert.equal($groupFieldElements.find(".dx-header-filter").length, 1, 'filter indicator count');

    assert.strictEqual($groupFieldElements.find(".dx-area-field-content").text(), "Field 1");
    assert.strictEqual($($groupFieldElements.children()[0]).attr("class"), "dx-column-indicators");

    $groupFieldElements = this.$container.find(".dx-area-fields[group=column] .dx-area-field");
    assert.equal($groupFieldElements.length, 2, 'column field elements count');
    assert.equal($groupFieldElements.eq(0).text(), 'Field 2', 'Field 2 text');
    assert.equal($groupFieldElements.eq(1).text(), 'Field 3', 'Field 3 text');
    assert.equal($groupFieldElements.eq(0).find(".dx-sort").length, 1, 'sort indicator count');
    assert.equal($groupFieldElements.eq(0).find(".dx-header-filter").length, 0, 'filter indicator count');
    assert.equal($groupFieldElements.eq(1).find(".dx-sort").length, 0, 'sort indicator count');
    assert.equal($groupFieldElements.eq(1).find(".dx-header-filter").length, 1, 'filter indicator count');

    $groupFieldElements = this.$container.find(".dx-area-fields[group=filter] .dx-area-field");
    assert.equal($groupFieldElements.length, 1, 'filter field elements count');
    assert.equal($groupFieldElements.eq(0).text(), 'Field 4', 'Field 4 text');
    assert.equal($groupFieldElements.find(".dx-sort").length, 1, 'sort indicator count');
    assert.equal($groupFieldElements.find(".dx-header-filter").length, 1, 'filter indicator count');

    $groupFieldElements = this.$container.find(".dx-area-fields[group=data] .dx-area-field");
    assert.equal($groupFieldElements.length, 2, 'filter field elements count');
    assert.equal($groupFieldElements.eq(0).text(), 'Field 5', 'Field 5 text');
    assert.equal($groupFieldElements.eq(1).text(), 'Field 6', 'Field 6 text');
    assert.equal($groupFieldElements.find(".dx-sort").length, 0, 'sort indicator count');
    assert.equal($groupFieldElements.find(".dx-header-filter").length, 0, 'filter indicator count');
});

QUnit.test("Hidden field in the data area", function(assert) {
    var dataSourceOptions = {
        dataFields: [
            { caption: "Field 1", area: 'data', visible: false },
            { caption: "Field 2", area: 'data' }
        ]
    };

    // act
    this.setup(dataSourceOptions);

    // assert
    var $groupFieldElements = this.$container.find(".dx-area-fields[group=data] .dx-area-field");
    assert.equal($groupFieldElements.length, 1, 'field elements count');
    assert.equal($groupFieldElements.eq(0).text(), 'Field 2', 'Field 1 text');
});

QUnit.test("Render to hidden container", function(assert) {
    $("#container").hide();

    // act
    this.setup();

    $("#container").show();

    domUtils.triggerShownEvent($("#container"));

    // assert
    var columns = $("#container").find(".dx-col");
    assert.strictEqual(columns.length, 2);
    assert.ok(columns.eq(0).height() > 0);
    assert.roughEqual(columns.eq(0).height(), columns.eq(1).height(), 1);
});

QUnit.test("Render Fields Tree", function(assert) {
    var fields = [
            { dataField: "field1", caption: "Field 1", area: "row" },
            { dataField: "field2", caption: "Field 2", area: "column" },
            { dataField: "field3", caption: "Field 3" },
            { dataField: "field4", caption: "Field 4", area: "filter" },
            { dataField: "field5", caption: "Field 5", isDefault: true },
            { dataField: "field6", caption: "Field 6", isDefault: false, area: "data" },
            { dataField: "field7", caption: "Field 7", visible: false },
            { dataField: "field8", caption: "Field 8", groupIndex: 0, groupName: "test" } // T232385
    ];
    var dataSourceOptions = {
        fields: fields
    };

    // act
    this.setup(dataSourceOptions);

    // assert
    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);
    assert.equal(this.$container.find(".dx-treeview").length, 1, "tree view count");

    var fieldsDataSource = this.$container.find(".dx-treeview").dxTreeView("option", "dataSource");

    assert.ok(fieldsDataSource, "fields dataSource exists");
    assert.equal(fieldsDataSource.length, 6, "fields dataSource length");
    assert.deepEqual(fieldsDataSource, [
        { index: 0, field: fields[0], text: "Field 1", key: "field1", isDefault: undefined, isMeasure: undefined, icon: undefined, selected: true },
        { index: 1, field: fields[1], text: "Field 2", key: "field2", isDefault: undefined, isMeasure: undefined, icon: undefined, selected: true },
        { index: 2, field: fields[2], text: "Field 3", key: "field3", isDefault: undefined, isMeasure: undefined, icon: undefined, selected: false },
        { index: 3, field: fields[3], text: "Field 4", key: "field4", isDefault: undefined, isMeasure: undefined, icon: undefined, selected: true },
        { index: 4, field: fields[4], text: "Field 5", key: "field5", isDefault: true, isMeasure: undefined, icon: undefined, selected: false },
        { index: 5, field: fields[5], text: "Field 6", key: "field6", isDefault: false, isMeasure: undefined, icon: undefined, selected: true }
    ]);
});

QUnit.test("Render Fields Tree with dimension and displayFolder", function(assert) {
    var fields = [
            { dataField: "field1", caption: "Field 1", dimension: "Dimension 1", area: "row", isMeasure: false },
            { dataField: "field2", caption: "Field 2", dimension: "Dimension 1", area: "column" },
            { dataField: "field3", caption: "Field 3", dimension: "Dimension 2" },
            { dataField: "field4", caption: "Field 4", dimension: "Dimension 2", displayFolder: "Folder 1", area: "filter" },
            { dataField: "field5", caption: "Field 5" },
            { dataField: "field6", caption: "Field 6", dimension: "[Measures]", area: "data", isMeasure: true },
        {
            dataField: "HierarchyField", caption: "a hierarchy field", dimension: "Dimension 2", groupName: "hierarchy", isMeasure: false, levels: [
                    { dataField: "levelField" }
            ]
        }
        ],

        dataSourceOptions = {
            fields: fields
        };

    // act
    this.setup(dataSourceOptions);

    // assert
    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);
    assert.equal(this.$container.find(".dx-treeview").length, 1, "tree view count");

    var fieldsDataSource = this.$container.find(".dx-treeview").dxTreeView("option", "dataSource");

    assert.ok(fieldsDataSource, "fields dataSource exists");
    assert.equal(fieldsDataSource.length, 4, "fields dataSource length");

    assert.deepEqual(fieldsDataSource, [
        {
            text: "[Measures]", key: "[Measures]", path: "[Measures]", selected: true, expanded: false, isMeasure: true,
            items: [
                { index: 5, field: fields[5], selected: true, text: "Field 6", key: "field6", isDefault: undefined, isMeasure: true, icon: "measure" }
            ]
        },
        {
            text: "Dimension 1", key: "Dimension 1", path: "Dimension 1", selected: true, expanded: false, isMeasure: false,
            items: [
                    { index: 0, field: fields[0], text: "Field 1", key: "field1", selected: true, isDefault: undefined, isMeasure: false, icon: "dimension" },
                    { index: 1, field: fields[1], text: "Field 2", key: "field2", selected: true, isDefault: undefined, isMeasure: undefined, icon: undefined }
            ]
        },
        {
            text: "Dimension 2", key: "Dimension 2", path: "Dimension 2", selected: undefined, expanded: false, isMeasure: false, items: [

                {
                    text: "Folder 1", key: "Folder 1", path: "Dimension 2.Folder 1", selected: true, expanded: false, isMeasure: undefined,
                    items: [
                    { index: 3, field: fields[3], selected: true, text: "Field 4", isDefault: undefined, key: "field4", isMeasure: undefined, icon: undefined }
                    ]
                },

            { text: "Field 3", index: 2, field: fields[2], key: "field3", selected: false, isDefault: undefined, isMeasure: undefined, icon: undefined },
                { key: "HierarchyField", selected: false, text: "a hierarchy field", isDefault: undefined, field: fields[6], index: 6, isMeasure: false, icon: "hierarchy" }


            ]
        },
    { index: 4, field: fields[4], selected: false, text: "Field 5", key: "field5", isDefault: undefined, isMeasure: undefined, icon: undefined }

    ]);
});

QUnit.test("Select Items in all fields area", function(assert) {
    var fields = [
            { dataField: "field1", dimension: "Dimension 1" },
            { dataField: "field2", dimension: "Dimension 1" },
            { dataField: "field3", dimension: "Dimension 2" },
            { dataField: "field4", dimension: "Dimension 2", displayFolder: "Folder2_1" },
            { dataField: "field5" },
            { dataField: "field6", dimension: "Dimension3" },
            { dataField: "field7", dimension: "Dimension 2" },
            { dataField: "field8", isMeasure: true },
            { dataField: "field9", dimension: "Dimension 1", displayFolder: "Folder1_1" },
            { dataField: "field11", dimension: "Dimension 1", displayFolder: "Folder1_2" },
            { dataField: "field12", dimension: "Dimension 1", displayFolder: "Folder1_2", isDefault: true }
    ];
    this.setup({
        fields: fields
    });

    var treeView = this.$container.find(".dx-treeview").dxTreeView("instance"),
        treeViewItems = treeView.option("dataSource");
    // acts
    treeView.selectItem(treeViewItems[4]);  // act1 - select field5
    treeView.selectItem(treeViewItems[2]);  // act2 - select Dimension2
    treeView.selectItem(treeViewItems[0]);  // act3 - select field8
    treeView.selectItem(treeViewItems[1]);  // act4 - select Dimension1
    // assert

    assert.strictEqual(this.dataSource.load.callCount, 4);
    assert.strictEqual(this.dataSource.field.callCount, 4);

    assert.deepEqual(this.dataSource.field.getCall(0).args, [4, {
        area: "column",
        areaIndex: undefined
    }], "field5 should be added to column on act1");
    assert.ok(this.dataSource.load.getCall(0).calledAfter(this.dataSource.field.getCall(0)));

    assert.deepEqual(this.dataSource.field.getCall(1).args, [3, {
        area: "column",
        areaIndex: undefined
    }], "field4 should be added to column on act2");
    assert.ok(this.dataSource.load.getCall(1).calledAfter(this.dataSource.field.getCall(1)));

    assert.deepEqual(this.dataSource.field.getCall(2).args, [7, {
        area: "data",
        areaIndex: undefined
    }], "field8 should be added to data on act3");
    assert.ok(this.dataSource.load.getCall(2).calledAfter(this.dataSource.field.getCall(2)));

    assert.deepEqual(this.dataSource.field.getCall(3).args, [10, {
        area: "column",
        areaIndex: undefined
    }], "field12 should be added to data on act4");
    assert.ok(this.dataSource.load.getCall(3).calledAfter(this.dataSource.field.getCall(3)));
});

QUnit.test("Unselect Items in all fields area", function(assert) {
    var fields = [
            { dataField: "field1", dimension: "Dimension 1", area: "row" },
            { dataField: "field2", dimension: "Dimension 1", area: "column" },
            { dataField: "field3", dimension: "Dimension 2" },
            { dataField: "field4", dimension: "Dimension 2", displayFolder: "Folder2_1", area: "row" },
            { dataField: "field5", area: "row" },
            { dataField: "field6", dimension: "Dimension3" },
            { dataField: "field7", dimension: "Dimension 2" },
            { dataField: "field8", isMeasure: true, area: "data", dimension: "Measures" },
            { dataField: "field9", dimension: "Dimension 1", displayFolder: "Folder1_1" },
            { dataField: "field12", dimension: "Dimension 1", displayFolder: "Folder1_2", isDefault: true }
    ];
    this.setup({
        fields: fields
    });

    var treeView = this.$container.find(".dx-treeview").dxTreeView("instance"),
        treeViewItems = treeView.option("dataSource");
    // acts
    treeView.unselectItem(treeViewItems[4]);  // act1 - unselect field5
    treeView.selectItem(treeViewItems[2]);    // act2 - unselect Dimension2
    // assert

    assert.strictEqual(this.dataSource.load.callCount, 2);
    assert.strictEqual(this.dataSource.field.callCount, 4);

    assert.deepEqual(this.dataSource.field.getCall(0).args, [4, {
        area: undefined,
        areaIndex: undefined
    }], "field5 should be removed from area on act1");

    assert.deepEqual(this.dataSource.field.getCall(1).args, [3, {
        area: undefined,
        areaIndex: undefined
    }], "field4 should be removed from area on act2");

    assert.deepEqual(this.dataSource.field.getCall(2).args, [2, {
        area: undefined,
        areaIndex: undefined
    }], "field3 should be removed from area on act2");

    assert.deepEqual(this.dataSource.field.getCall(3).args, [6, {
        area: undefined,
        areaIndex: undefined
    }], "field7 should be removed from area on act2");

    assert.ok(this.dataSource.load.getCall(1).calledAfter(this.dataSource.field.getCall(3)));
});

QUnit.test("Change sort order", function(assert) {
    var dataSourceOptions = {
        rowFields: [
            { index: 0, caption: "Field 1", area: 'row', sortOrder: 'desc', allowFiltering: true, allowSorting: true }
        ],
        columnFields: [
            { index: 1, caption: "Field 2", area: 'column', allowFiltering: false, allowSorting: true },
            { index: 2, caption: "Field 3", area: 'column', allowFiltering: true, allowSorting: false }
        ],
        filterFields: [
            { index: 3, caption: "Field 4", area: 'filter', allowFiltering: true, allowSorting: true }
        ],
        dataFields: [
            { index: 4, caption: "Field 5", area: 'data', allowFiltering: true, allowSorting: true },
            { index: 5, caption: "Field 6", area: 'data', allowFiltering: true, allowSorting: true }
        ]
    };

    this.setup(dataSourceOptions);

    // act
    var $sortIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-sort");
    $sortIndicatorsInColumnArea.parent().trigger("dxclick");

    // act
    var $sortIndicatorsInRowArea = this.$container.find(".dx-area-fields[group=row] .dx-sort");
    $sortIndicatorsInRowArea.parent().trigger("dxclick");

    // assert
    assert.equal($sortIndicatorsInColumnArea.length, 1, 'sort indicators count');
    assert.equal($sortIndicatorsInRowArea.length, 1, 'sort indicators count');

    assert.strictEqual(this.dataSource.field.callCount, 2);

    assert.deepEqual(this.dataSource.field.getCall(0).args, [1, {
        sortOrder: 'desc'
    }]);

    assert.deepEqual(this.dataSource.field.getCall(1).args, [0, {
        sortOrder: 'asc'
    }]);
});

QUnit.test("Header filter menu for not group field", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
            { index: 1, caption: "Field 3", area: 'column', filterValues: [8], allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 1 }, { value: 2 }, { value: 4 }, { value: 5 }],
            [{ value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 10 }]
        ]
    };

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 2, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(0).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-list");
    assert.equal($filterMenuList.length, 1);

    assert.equal($filterMenuList.find(".dx-list-item").length, 4, 'list item count');
    assert.equal($filterMenuList.find(".dx-list-item-selected").length, 0, 'list selected item count');

    // act
    $filterIndicatorsInColumnArea.eq(1).trigger("dxclick");
    this.clock.tick(500);

    // assert
    $filterMenuList = $(".dx-header-filter-menu .dx-list");
    assert.equal($filterMenuList.length, 1);

    assert.equal($filterMenuList.find(".dx-list-item").length, 5, 'list item count');
    assert.equal($filterMenuList.find(".dx-list-item-selected").length, 1, 'list selected item count');

    // T278093
    // act - resize filtermenu
    pointerMock($(".dx-header-filter-menu .dx-resizable-handle-right"))
        .start()
        .down()
        .move(10, 10)
        .up();
});

QUnit.test("Date in the filterValue", function(assert) {
    var filterValue = new Date();
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
            { index: 1, caption: "Field 3", area: 'column', filterValues: [filterValue], allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 1 }, { value: 2 }, { value: 4 }, { value: 5 }],
            [{ value: 6 }, { value: 7 }, { value: new Date(filterValue) }, { value: 9 }, { value: 10 }]
        ]
    };

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");

    // act
    $filterIndicatorsInColumnArea.eq(1).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-list");
    assert.equal($filterMenuList.find(".dx-list-item").length, 5, 'list item count');
    assert.equal($filterMenuList.find(".dx-list-item-selected").length, 1, 'list selected item count');
});

QUnit.test("Header filter menu when data with key", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
            { index: 1, caption: "Field 3", area: 'column', filterValues: ["&[2003]", "CY 2001"], allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 1 }, { value: 2 }, { value: 4 }, { value: 5 }],
            [
                { value: 2001, key: "&[2001]", caption: "CY 2001" },
                { value: 2002, key: "&[2002]", caption: "CY 2002" },
                { value: 2003, key: "&[2003]", caption: "CY 2003" },
                { value: 2004, key: "&[2004]", caption: "CY 2004" },
                { value: 2005, key: "&[2005]", caption: "CY 2005" }
            ]
        ]
    };

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 2, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(0).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-list");
    assert.equal($filterMenuList.length, 1);

    assert.equal($filterMenuList.find(".dx-list-item").length, 4, 'list item count');
    assert.equal($filterMenuList.find(".dx-list-item-selected").length, 0, 'list selected item count');

    // act
    $filterIndicatorsInColumnArea.eq(1).trigger("dxclick");
    this.clock.tick(500);

    // assert
    $filterMenuList = $(".dx-header-filter-menu .dx-list");
    assert.equal($filterMenuList.length, 1);

    assert.equal($filterMenuList.find(".dx-list-item").length, 5, 'list item count');
    assert.equal($filterMenuList.find(".dx-list-item-selected").length, 1, 'list selected item count');
});

QUnit.test("Header filter menu for not group field when filterType exclude", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
            { index: 1, caption: "Field 3", area: 'column', filterValues: [8], filterType: 'exclude', allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 1 }, { value: 2 }, { value: 4 }, { value: 5 }],
            [{ value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 10 }]
        ]
    };

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 2, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(1).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-list");
    assert.equal($filterMenuList.length, 1);

    assert.equal($filterMenuList.find(".dx-list-item").length, 5, 'list item count');
    assert.equal($filterMenuList.find(".dx-list-item-selected").length, 4, 'list selected item count');
});

QUnit.test("Change filter values for not group field", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
            { index: 1, caption: "Field 3", area: 'column', filterValues: [8], allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 1 }, { value: 2 }, { value: 4 }, { value: 5 }],
            [{ value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 10, key: "&[10]" }]
        ]
    };

    this.setup(dataSourceOptions);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 2, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(1).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-list");
    assert.equal($filterMenuList.length, 1);

    assert.equal($filterMenuList.find(".dx-list-item").length, 5, 'list item count');
    assert.equal($filterMenuList.find(".dx-list-item-selected").length, 1, 'list selected item count');

    // act
    $filterMenuList.find(".dx-list-item").eq(0).trigger("dxclick");
    $filterMenuList.find(".dx-list-item").eq(4).trigger("dxclick");

    var $buttons = $(".dx-header-filter-menu .dx-button");
    assert.equal($buttons.length, 2);

    $buttons.eq(0).trigger("dxclick");
    this.clock.tick(500);

    // assert
    assert.deepEqual(this.dataSource.field.getCall(0).args, [1, {
        filterType: undefined,
        filterValues: [8, 6, "&[10]"]
    }]);

    // T241360
    var scrollableUpdateCallCount = 0;
    var $scrollableElements = this.$container.find(".dx-area .dx-scrollable");
    $.each($scrollableElements, function() {
        $(this).dxScrollable("instance").on("updated", function() {
            scrollableUpdateCallCount++;
        });
    });

    // act
    this.fieldChooser.updateDimensions();

    // assert
    assert.equal(this.$container.find(".dx-header-filter").length, 2, "header filter count");
    assert.equal(this.$container.find(".dx-header-filter-empty").length, 1, "empty header filter count");
    assert.equal(this.$container.find(".dx-header-filter-empty").length, 1, "empty header filter count");
    assert.equal($scrollableElements.length, 5, "scrollable count");
    assert.equal(scrollableUpdateCallCount, 5, "scrollable update call count");
});

QUnit.test("T247590. Save tree view scroll position on dataSource changed", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
            { index: 1, caption: "Field 3", area: 'column', filterValues: [8], allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 1 }, { value: 2 }, { value: 4 }, { value: 5 }],
            [{ value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 10 }]
        ],
        fields: [
        { dataField: "Field1", isMeasure: true },
        { dataField: "Field2", isMeasure: false },
        { dataField: "Field3" },
        { dataField: "Field4", isMeasure: true },
        { dataField: "Field5", isMeasure: false },
        { dataField: "Field6" },
        { dataField: "Field7", isMeasure: true },
        { dataField: "Field8", isMeasure: false },
        { dataField: "Field9" }
        ]
    };

    this.setup(dataSourceOptions, { height: 90 });
    this.clock.tick(500);

    var dataSource = this.dataSource,
        scrollable = $(".dx-treeview-border-visible").find(".dx-scrollable").dxScrollable("instance");

    // act
    scrollable.scrollTo({ y: 30 });

    dataSource.on.withArgs("changed").lastCall.args[1]();
    // assert
    var newTreeScrollable = $(".dx-treeview-border-visible").find(".dx-scrollable").dxScrollable("instance");

    assert.strictEqual(newTreeScrollable.scrollTop(), 30);
});

if(devices.current().deviceType === "desktop") {
    // T244547
    QUnit.test("Dragging after change filter values", function(assert) {
        var dataSourceOptions = {
            columnFields: [
                { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
                { index: 1, caption: "Field 3", area: 'column', filterValues: [8], allowFiltering: true }
            ],
            fieldValues: [
                [{ value: 1 }, { value: 2 }, { value: 4 }, { value: 5 }],
                [{ value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 10 }]
            ]
        };

        this.setup(dataSourceOptions);

        assert.ok(this.fieldChooser);
        assert.ok(this.dataSource);

        var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
        assert.equal($filterIndicatorsInColumnArea.length, 2, 'filter indicators count');

        // act
        $filterIndicatorsInColumnArea.eq(1).trigger("dxclick");
        this.clock.tick(500);

        // assert
        var $filterMenuList = $(".dx-header-filter-menu .dx-list");
        assert.equal($filterMenuList.length, 1);

        assert.equal($filterMenuList.find(".dx-list-item").length, 5, 'list item count');
        assert.equal($filterMenuList.find(".dx-list-item-selected").length, 1, 'list selected item count');


        // act
        $filterMenuList.find(".dx-list-item").eq(0).trigger("dxclick");

        var $buttons = $(".dx-header-filter-menu .dx-button");
        assert.equal($buttons.length, 2);

        $buttons.eq(0).trigger("dxclick");
        this.clock.tick(500);

        // act
        var $item = this.$container.find(".dx-area-box").eq(0);
        var offset = $item.offset();

        pointerMock($item)
            .start()
            .down()
            .move(offset.left + 10, offset.top);

        // assert
        assert.ok($item.hasClass("dx-drag-source"), "dragging is started");
        assert.strictEqual($(".dx-drag").length, 1);

        assert.strictEqual(parseInt($(".dx-drag").css("width"), 10), parseInt($item.css("width"), 10) + 1);

        assert.ok($(".dx-drag").hasClass("dx-widget"));
        assert.ok($(".dx-drag").hasClass("dx-pivotgrid-fields-container"));
    });
}

QUnit.test("Change filter values second time", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
            { index: 1, caption: "Field 3", area: 'column', filterValues: [8], allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 1 }, { value: 2 }, { value: 4 }, { value: 5 }],
            [{ value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 10 }]
        ]
    };

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    this.dataSource.field = function(id, options) {
        $.extend(dataSourceOptions.columnFields[id], options);
    };

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 2, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(1).trigger("dxclick");
    this.clock.tick(500);

    // act
    var $listItems = $(".dx-header-filter-menu .dx-list .dx-list-item");
    assert.equal($listItems.length, 5);
    $listItems.eq(0).trigger("dxclick");

    var $buttons = $(".dx-header-filter-menu .dx-button");
    assert.equal($buttons.length, 2);

    $buttons.eq(0).trigger("dxclick");
    this.clock.tick();

    $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    $filterIndicatorsInColumnArea.eq(1).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-list");
    assert.equal($filterMenuList.length, 1);

    assert.equal($filterMenuList.find(".dx-list-item").length, 5, 'list item count');
    assert.equal($filterMenuList.find(".dx-list-item-selected").length, 2, 'list selected item count');
});

QUnit.test("Change filter type for not group field", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
            { index: 1, caption: "Field 3", area: 'column', filterValues: [8], allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 1 }, { value: 2 }, { value: 4 }, { value: 5 }],
            [{ value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 10 }]
        ]
    };

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 2, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(1).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-list");
    assert.equal($filterMenuList.length, 1);

    assert.equal($filterMenuList.find(".dx-list-select-all").length, 1, 'list all item count');


    // act
    $filterMenuList.find(".dx-list-select-all").trigger("dxclick");
    $filterMenuList = $(".dx-header-filter-menu .dx-list");
    $filterMenuList.find(".dx-list-item").eq(0).trigger("dxclick");

    var $buttons = $(".dx-header-filter-menu .dx-button");
    assert.equal($buttons.length, 2);

    $buttons.trigger("dxclick");

    // assert
    assert.deepEqual(this.dataSource.field.getCall(0).args, [1, {
        filterType: 'exclude',
        filterValues: [6]
    }]);
});

QUnit.test("Change filter values for group field", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Date", area: 'column', groupName: "Date", filterValues: [[2001], [2002, 2]], levels: [{}, {}], allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 2001, children: [{ value: 1 }, { value: 2 }] }, { value: 2002, children: [{ value: 1 }, { value: 2 }] }]
        ]
    };

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 1, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(0).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-treeview");
    assert.equal($filterMenuList.length, 1, 'treeView');

    assert.equal($filterMenuList.find(".dx-treeview-node").length, 2, 'list item count');
    var treeNodes = $filterMenuList.dxTreeView("instance").getNodes();

    assert.strictEqual(treeNodes[0].itemData.children, null);
    assert.ok(treeNodes[0].selected);
    assert.strictEqual(treeNodes[0].items.length, 2);

    assert.strictEqual(treeNodes[1].itemData.children, null);
    assert.ok(!treeNodes[1].selected);
    assert.strictEqual(treeNodes[1].items.length, 2);

    // act
    $filterMenuList.find(".dx-treeview-node .dx-checkbox").eq(0).trigger("dxclick");

    var $buttons = $(".dx-header-filter-menu .dx-button");
    assert.equal($buttons.length, 2);

    $buttons.trigger("dxclick");

    // assert
    assert.strictEqual(this.dataSource.field.callCount, 1);
    assert.deepEqual(this.dataSource.field.getCall(0).args, [0, {
        filterType: undefined,
        filterValues: [[2002, 2]]
    }]);
});

QUnit.test("Change filter values for group field. filterType is 'exclude'.", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Date", area: 'column', groupName: "Date", filterValues: [[2001], [2002, 2]], levels: [{}, {}], allowFiltering: true, filterType: "exclude" }
        ],
        fieldValues: [
            [{ value: 2001, children: [{ value: 1 }, { value: 2 }] }, { value: 2002, children: [{ value: 1 }, { value: 2 }] }]
        ]
    };

    this.setup(dataSourceOptions);
    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 1, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(0).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-treeview");
    assert.equal($filterMenuList.length, 1, 'treeView');

    assert.equal($filterMenuList.find(".dx-treeview-node").length, 2, 'list item count');
    var treeNodes = $filterMenuList.dxTreeView("instance").getNodes();

    assert.strictEqual(treeNodes[0].itemData.children, null);
    assert.strictEqual(treeNodes[0].selected, false);
    assert.strictEqual(treeNodes[0].items.length, 2);

    assert.strictEqual(treeNodes[1].itemData.children, null);
    assert.strictEqual(!treeNodes[1].selected, true);
    assert.strictEqual(treeNodes[1].items.length, 2);

    // act
    $filterMenuList.find(".dx-treeview-node .dx-checkbox").eq(0).trigger("dxclick");

    var $buttons = $(".dx-header-filter-menu .dx-button");
    assert.equal($buttons.length, 2);

    $buttons.trigger("dxclick");
    this.clock.tick(500);

    // assert
    assert.strictEqual(this.dataSource.field.callCount, 1);
    assert.deepEqual(this.dataSource.field.getCall(0).args, [0, {
        filterType: "exclude",
        filterValues: [[2002, 2]]
    }]);

});

QUnit.test("Change filter values for group field when key in data", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Date", area: 'column', groupName: "Date", filterValues: [["CY 2001"], ["&[2002]", "&[2002]&[2]"], undefined, [2002, 1]], levels: [{}, {}], allowFiltering: true }
        ],
        fieldValues: [
            [
                { value: 2001, key: "&[2001]", text: "CY 2001", children: [{ value: 1, key: "&[2001]&[1]", text: "1" }, { value: 2, key: "&[2001]&[2]", text: "2" }] },
                { value: 2002, key: "&[2002]", text: "CY 2002", children: [{ value: 1, key: "&[2002]&[1]", text: "1" }, { value: 2, key: "&[2002]&[2]", text: "2" }] }
            ]
        ]
    };

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 1, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(0).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-treeview");
    assert.equal($filterMenuList.length, 1, 'treeView');

    assert.equal($filterMenuList.find(".dx-treeview-node").length, 2, 'list item count');
    var treeNodes = $filterMenuList.dxTreeView("instance").getNodes();

    assert.strictEqual(treeNodes[0].itemData.children, null);
    assert.ok(treeNodes[0].selected);
    assert.strictEqual(treeNodes[0].items.length, 2);

    assert.strictEqual(treeNodes[1].itemData.children, null);
    assert.ok(!treeNodes[1].selected);
    assert.strictEqual(treeNodes[1].items.length, 2);

    // act
    $filterMenuList.find(".dx-treeview-node .dx-checkbox").eq(0).trigger("dxclick");

    var $buttons = $(".dx-header-filter-menu .dx-button");
    assert.equal($buttons.length, 2);

    $buttons.trigger("dxclick");

    // assert
    assert.strictEqual(this.dataSource.field.callCount, 1);
    assert.deepEqual(this.dataSource.field.getCall(0).args, [0, {
        filterType: undefined,
        filterValues: [["&[2002]", "&[2002]&[2]"]]
    }]);
});

QUnit.test("Change filter type for group field", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Date", area: 'column', groupName: "Date", filterValues: [[2001], [2002, 2]], levels: [{}, {}], allowFiltering: true }
        ],
        fieldValues: [
            [{ value: 2001, children: [{ value: 1 }, { value: 2 }] }, { value: 2002, children: [{ value: 1 }, { value: 2 }] }]
        ]
    };

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    assert.equal($filterIndicatorsInColumnArea.length, 1, 'filter indicators count');

    // act
    $filterIndicatorsInColumnArea.eq(0).trigger("dxclick");
    this.clock.tick(500);

    // assert
    var $filterMenuList = $(".dx-header-filter-menu .dx-treeview");
    assert.equal($filterMenuList.length, 1, 'treeView');

    assert.equal($filterMenuList.find(".dx-treeview-node").length, 2, 'list item count');
    assert.equal($filterMenuList.find(".dx-treeview-select-all-item").length, 1, 'list all item count');


    // act
    $filterMenuList.find(".dx-treeview-select-all-item").trigger("dxclick");
    $filterMenuList = $(".dx-header-filter-menu .dx-treeview");
    $filterMenuList.find(".dx-treeview-node .dx-checkbox").eq(0).trigger("dxclick");

    var $buttons = $(".dx-header-filter-menu .dx-button");
    assert.equal($buttons.length, 2);

    $buttons.trigger("dxclick");

    // assert
    assert.strictEqual(this.dataSource.field.callCount, 1);
    assert.deepEqual(this.dataSource.field.getCall(0).args, [0, {
        filterType: undefined,
        filterValues: [[2002]]
    }]);
});

QUnit.test("Dragging Fields", function(assert) {
    var dataSourceOptions = {
            fields: [
            { dataField: "Field1", isMeasure: true },
            { dataField: "Field2", isMeasure: false },
            { dataField: "Field3" }
            ]
        },
        fields;

    this.setup(dataSourceOptions);

    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);

    fields = this.$container.find(".dx-area-field");

    function getBorderColor($elem) {
        return $elem.css("border-color") || $elem.css("border-left-color");
    }

    function assertDragging(field, area, cancelExpected) {
        // act
        var $targetGroup = $(".dx-area-fields[group='" + area + "']"),
            areaBorderColor = getBorderColor($targetGroup);

        var offset = field.offset(),
            targetOffset = $targetGroup.offset();

        var pointer = pointerMock(field)
            .start({
                x: offset.left,
                y: offset.top

            })
            .down()
            .move(10, 0)
            .move(targetOffset.left - offset.left + 25, targetOffset.top - offset.top + 30);

        // assert

        assert.strictEqual($targetGroup.hasClass("dx-drag-target"), !cancelExpected, "target group has target class " + dataUtils.data(field.get(0), "field").dataField + " " + area);

        assert.ok((getBorderColor($targetGroup) === areaBorderColor) && cancelExpected || (getBorderColor($targetGroup) !== areaBorderColor) && !cancelExpected, "target group border color is correct " + dataUtils.data(field.get(0), "field").dataField + " " + area);

        pointer.move(offset.left, offset.top).up();

    }


    assert.ok(true);
    assert.strictEqual(fields.length, 3);

    assert.strictEqual(dataUtils.data(fields.get(0), "field").dataField, "Field1");
    assertDragging(fields.eq(0), "filter", true);
    assertDragging(fields.eq(0), "data", false);
    assertDragging(fields.eq(0), "row", true);
    assertDragging(fields.eq(0), "column", true);

    assert.strictEqual(dataUtils.data(fields.get(1), "field").dataField, "Field2");
    assertDragging(fields.eq(1), "filter", false);
    assertDragging(fields.eq(1), "data", true);
    assertDragging(fields.eq(1), "row", false);
    assertDragging(fields.eq(1), "column", false);

    assert.strictEqual(dataUtils.data(fields.get(2), "field").dataField, "Field3");
    assertDragging(fields.eq(2), "filter", false);
    assertDragging(fields.eq(2), "data", false);
    assertDragging(fields.eq(2), "row", false);
    assertDragging(fields.eq(2), "column", false);
});

QUnit.test("rtlEnabled assign for all children widgets", function(assert) {
    var dataSourceOptions = {
        fields: [
            { dataField: "field1", caption: "Field 1", area: "row" },
            { dataField: "field2", caption: "Field 2", area: "column" },
            { dataField: "field3", caption: "Field 3" },
            { dataField: "field4", caption: "Field 4", area: "filter" },
            { dataField: "field5", caption: "Field 5" },
            { dataField: "field6", caption: "Field 6", area: "data" }
        ],
        rowFields: [
            { caption: "Field 1", area: 'row', allowFiltering: true, allowSorting: true }
        ],
        columnFields: [
            { caption: "Field 2", area: 'column', allowFiltering: false, allowSorting: true },
            { caption: "Field 3", area: 'column', allowFiltering: true, allowSorting: false }
        ],
        filterFields: [
            { caption: "Field 4", area: 'filter', allowFiltering: true, allowSorting: true }
        ],
        dataFields: [
            { caption: "Field 5", area: 'data', allowFiltering: true, allowSorting: true },
            { caption: "Field 6", area: 'data', allowFiltering: true, allowSorting: true }
        ]
    };

    // act
    this.setup(dataSourceOptions, { rtlEnabled: true });

    // assert
    var $widgets = $(".dx-widget");

    $.each($widgets, function() {
        var $widget = $(this),
            componentNames = dataUtils.data($widget[0], "dxComponents");

        $.each(componentNames, function(index, componentName) {
            if(componentName.indexOf("dxPrivateComponent") === -1 && componentName !== "dxToolbar") {
                assert.ok(dataUtils.data($widget[0], componentName).option("rtlEnabled"), "rtlEnabled for " + componentName + " assigned");
            }
        });
    });

    assert.ok(this.$container.hasClass("dx-rtl"), "dx-rtl class added to PivotGridFieldChooser element");
});

QUnit.test("Restore selecting state for second page when all items on first page selected", function(assert) {
    var fieldValues = [];
    for(var i = 0; i < 60; i++) {
        fieldValues.push({ value: i });
    }

    var dataSourceOptions = {
        columnFields: [
            { index: 0, caption: "Field 2", area: 'column', allowFiltering: true },
            { index: 1, caption: "Field 3", area: 'column', filterValues: [8], allowFiltering: true }
        ],
        fieldValues: [fieldValues]
    };

    this.setup(dataSourceOptions);

    var $filterIndicatorsInColumnArea = this.$container.find(".dx-area-fields[group=column] .dx-header-filter");
    $filterIndicatorsInColumnArea.eq(0).trigger("dxclick");
    this.clock.tick(500);

    var $filterMenuList = $(".dx-header-filter-menu .dx-list");
    $filterMenuList.find(".dx-list-select-all-checkbox").dxCheckBox("instance").option("value", true);

    // act
    $filterMenuList.dxScrollView("option", "onReachBottom")();

    // assert
    assert.equal($filterMenuList.find(".dx-list-item-selected").length, 60, "selected items count");
});

QUnit.test("Pass allowDragging to sortable", function(assert) {
    // act
    this.setup({}, {
        allowFieldDragging: false
    });

    var sortable = this.fieldChooser.$element().dxSortable("instance");

    assert.strictEqual(sortable.option("allowDragging"), false, "allowDragging is passed to sortable");
});

QUnit.test("Change allowDragging at runtime", function(assert) {
    // act
    this.setup({}, {
        allowFieldDragging: false
    });
    this.fieldChooser.option("allowFieldDragging", true);

    var sortable = this.fieldChooser.$element().dxSortable("instance");

    assert.strictEqual(sortable.option("allowDragging"), true, "allowDragging is passed to sortable");
});

QUnit.test("Layout 0", function(assert) {
    // act
    this.setup({}, { layout: 0 });

    // assert
    var $cols = this.$container.find(".dx-col");
    var $areas = this.$container.find(".dx-area");

    assert.equal($cols.length, 2, "col count");
    assert.ok($cols.eq(0).height() > 0, "col 0 height");
    assert.roughEqual($cols.eq(0).height(), $cols.eq(1).height(), 0.1, "col heights");

    assert.equal($areas.length, 5, "area count");
    assert.roughEqual($areas.eq(0).outerHeight(true) + $areas.eq(1).outerHeight(true), $areas.eq(2).outerHeight(true) + $areas.eq(3).outerHeight(true) + $areas.eq(4).outerHeight(true), 0.1, "area 0+1=2+3+4 height");
    assert.roughEqual($areas.eq(1).outerHeight(true), $areas.eq(2).outerHeight(true), 0.1, "area 1=2 height");
    assert.roughEqual($areas.eq(2).outerHeight(true), $areas.eq(3).outerHeight(true), 0.1, "area 2=3 height");
    assert.roughEqual($areas.eq(3).outerHeight(true), $areas.eq(4).outerHeight(true), 0.1, "area 3=4 height");

    assert.equal($areas.eq(0).width(), $areas.eq(1).width(), "area 0=1 width");
    assert.equal($areas.eq(1).width(), $areas.eq(2).width(), "area 1=2 width");
    assert.equal($areas.eq(2).width(), $areas.eq(3).width(), "area 2=3 width");
    assert.equal($areas.eq(3).width(), $areas.eq(4).width(), "area 3=4 width");
});

QUnit.test("Layout 1", function(assert) {
    // act
    this.setup({}, { layout: 1 });

    // assert
    var $cols = this.$container.find(".dx-col");
    var $areas = this.$container.find(".dx-area");

    assert.equal($cols.length, 2, "col count");
    assert.ok($cols.eq(0).height() > 0, "col 0 height");
    assert.roughEqual($cols.eq(0).height(), $cols.eq(1).height(), 0.1, "col heights");

    assert.equal($areas.length, 5, "area count");
    assert.roughEqual($areas.eq(0).outerHeight(true), $areas.eq(1).outerHeight(true) + $areas.eq(2).outerHeight(true) + $areas.eq(3).outerHeight(true) + $areas.eq(4).outerHeight(true), 3, "area 0+1=2+3+4 outerHeight");
    assert.roughEqual($areas.eq(1).outerHeight(true), $areas.eq(2).outerHeight(true), 0.1, "area 1=2 outerHeight");
    assert.roughEqual($areas.eq(2).outerHeight(true), $areas.eq(3).outerHeight(true), 0.1, "area 2=3 outerHeight");
    assert.roughEqual($areas.eq(3).outerHeight(true), $areas.eq(4).outerHeight(true), 0.1, "area 3=4 outerHeight");

    assert.equal($areas.eq(0).width(), $areas.eq(1).width(), "area 0=1 width");
    assert.equal($areas.eq(1).width(), $areas.eq(2).width(), "area 1=2 width");
    assert.equal($areas.eq(2).width(), $areas.eq(3).width(), "area 2=3 width");
    assert.equal($areas.eq(3).width(), $areas.eq(4).width(), "area 3=4 width");
});

QUnit.test("Layout 2", function(assert) {
    // act
    this.setup({}, { layout: 2 });

    // assert
    var $cols = this.$container.find(".dx-col");
    var $areas = this.$container.find(".dx-area");

    assert.equal($cols.length, 2, "col count");
    assert.ok($cols.eq(0).height() > 0, "col 0 height");
    assert.equal($cols.eq(0).height(), $cols.eq(1).height(), "col heights");

    assert.equal($areas.length, 5, "area count");
    assert.ok($areas.eq(0).outerHeight(true) > $areas.eq(1).outerHeight(true), "area 0>1 outerHeight");
    assert.ok($areas.eq(0).outerHeight(true) < $areas.eq(1).outerHeight(true) + $areas.eq(2).outerHeight(true), "area 0<1+2 outerHeight");
    assert.equal($areas.eq(1).outerHeight(true) + $areas.eq(2).outerHeight(true), $areas.eq(3).outerHeight(true) + $areas.eq(4).outerHeight(true), "area 1+2=3+4 outerHeight");
    assert.roughEqual($areas.eq(1).outerHeight(true), $areas.eq(2).outerHeight(true), 0.1, "area 1=2 outerHeight");
    assert.roughEqual($areas.eq(2).outerHeight(true), $areas.eq(3).outerHeight(true), 0.1, "area 2=3 outerHeight");
    assert.roughEqual($areas.eq(3).outerHeight(true), $areas.eq(4).outerHeight(true), 0.1, "area 3=4 outerHeight");

    assert.ok($areas.eq(0).width(), $areas.eq(1).width(), "area 0>1 width");
    assert.equal($areas.eq(1).width(), $areas.eq(2).width(), "area 1=2 width");
    assert.equal($areas.eq(2).width(), $areas.eq(3).width(), "area 2=3 width");
    assert.equal($areas.eq(3).width(), $areas.eq(4).width(), "area 3=4 width");
});

QUnit.test("change group position", function(assert) {
    var dataSourceOptions = {
            columnFields: [
            { caption: "Field 1", area: 'column', index: 0, areaIndex: 0 },
            { caption: "Field 2", area: 'column', groupName: "Group1", index: 1, groupIndex: 0, areaIndex: 1 },
            { caption: "Field 3", area: 'column', groupName: "Group1", index: 2, groupIndex: 0, areaIndex: 1 },
            { caption: "Field 4", area: 'column', index: 3, areaIndex: 2 }
            ]
        },
        changedArgs = {
            targetIndex: 0,
            sourceIndex: 1
        };

    this.setup(dataSourceOptions);

    changedArgs.sourceElement = renderer(this.$container.find(".dx-area-field").eq(2));

    var sortable = this.fieldChooser.$element().dxSortable("instance"),
        onChangedHandler = sortable.option("onChanged");
    // act
    onChangedHandler(changedArgs);

    assert.strictEqual(this.dataSource.field.lastCall.args[0], 1);
    assert.strictEqual(changedArgs.removeSourceElement, false);
    assert.strictEqual(changedArgs.removeTargetElement, undefined);
    assert.strictEqual(changedArgs.removeSourceClass, undefined);
});

QUnit.test("getDataSource method", function(assert) {
    var fields = [
            { dataField: "field1", caption: "Field 1", area: "row" },
            { dataField: "field2", caption: "Field 2", area: "column" },
            { dataField: "field3", caption: "Field 3" },
            { dataField: "field4", caption: "Field 4", area: "filter" },
            { dataField: "field5", caption: "Field 5", isDefault: true },
            { dataField: "field6", caption: "Field 6", isDefault: false, area: "data" },
            { dataField: "field7", caption: "Field 7", visible: false }
    ];
    var dataSourceOptions = {
        fields: fields
    };

    // act
    this.setup(dataSourceOptions);

    // assert
    assert.strictEqual(this.fieldChooser.getDataSource(), this.dataSource, "method works correct");
});

QUnit.test("FieldChooser fire the 'contentReady' event after render without dataSource", function(assert) {
    // arrange
    var contentReadyHandler = sinon.stub();

    // act
    this.setup(null, { onContentReady: contentReadyHandler });

    // assert
    assert.equal(contentReadyHandler.callCount, 1, "'contentReady' has been triggered");
});

QUnit.test("FieldChooser does not fire the contentReady event while dataSource is loading", function(assert) {
    // arrange
    var dataSource = createMockDataSource({}),
        contentReadyHandler = sinon.stub();

    dataSource.isLoading.returns(true);

    // act
    this.createFieldChooser({
        dataSource: dataSource,
        onContentReady: contentReadyHandler
    });

    // assert
    assert.equal(contentReadyHandler.callCount, 0, "'contentReady' hasn't been triggered");
});

QUnit.test("The 'contentReady' event fires after all data is loaded", function(assert) {
    // arrange
    var dataSource = createMockDataSource({}),
        contentReadyHandler = sinon.stub();

    dataSource.isLoading.returns(true);

    this.createFieldChooser({
        dataSource: dataSource,
        onContentReady: contentReadyHandler
    });

    var dataSourceChangedHandler = dataSource.on.withArgs("changed").lastCall.args[1];

    dataSource.isLoading.returns(false);

    // act
    dataSourceChangedHandler();

    // assert
    assert.equal(contentReadyHandler.callCount, 1, "'contentReady' has been triggered");
});

QUnit.test("Enable search", function(assert) {
    this.setup({}, { allowSearch: true });

    var treeview = this.$container.find(".dx-treeview").dxTreeView("instance");
    assert.ok(treeview.option("searchEnabled"), "treeview with search");

    this.fieldChooser.option("allowSearch", false);
    treeview = this.$container.find(".dx-treeview").dxTreeView("instance");
    assert.ok(!treeview.option("searchEnabled"), "treeview without search");
});

QUnit.test("resetTreeView works correct", function(assert) {
    var fields = [
        { dataField: "field1", caption: "Field 1", displayFolder: "Folder" },
        { dataField: "field2", caption: "Field 2" },
    ];

    this.setup({ fields: fields }, { allowSearch: true });

    var treeview = this.$container.find(".dx-treeview").dxTreeView("instance");
    sinon.spy(treeview, "collapseAll");

    treeview.option("searchValue", "1");
    this.fieldChooser.resetTreeView();

    assert.equal(treeview.option("searchValue"), "", "treeview was cleaned");
    assert.ok(treeview.collapseAll.calledOnce, "treeview was collapsed");
});


QUnit.module("dxPivotGridFieldChooser context menu", {
    beforeEach: function() {
        this.fields = [
            { dataField: "field1", caption: "Field 1", area: "row" },
            { dataField: "field2", caption: "Field 2", area: "column" },
            { dataField: "field3", caption: "Field 3" },
            { dataField: "field4", caption: "Field 4", area: "filter" },
            { dataField: "field5", caption: "Field 5", isDefault: true },
            { dataField: "field6", caption: "Field 6", isDefault: false, area: "data" },
            { dataField: "field7", caption: "Field 7", visible: false }
        ];
        this.setup = function(dataSourceOptions, fieldChooserOptions) {
            fieldChooserOptions = fieldChooserOptions || {};
            if(dataSourceOptions) {
                this.dataSource = createMockDataSource(dataSourceOptions);
                fieldChooserOptions.dataSource = this.dataSource;
            }
            this.fieldChooser = $("#container").dxPivotGridFieldChooser(fieldChooserOptions).dxPivotGridFieldChooser("instance");
            this.$container = $("#container");
        },
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("render dxContextMenu", function(assert) {
    var dataSourceOptions = {};

    // act
    this.setup(dataSourceOptions);

    // assert
    assert.equal(this.fieldChooser.$element().find(".dx-has-context-menu").length, 1, "ContextMenu was created");

});

QUnit.test("create event args from field", function(assert) {
    var eventArgs,
        onContextMenuPreparingHandler = sinon.stub(),
        e = $.Event("dxcontextmenu");

    // act
    this.setup({
        fields: this.fields,
        columnFields: [this.fields[1]],
    }, {
        onContextMenuPreparing: onContextMenuPreparingHandler
    });

    this.$container.find("[group='column']").find(".dx-area-field").eq(0).trigger(e);

    // assert
    assert.strictEqual(onContextMenuPreparingHandler.callCount, 1);

    eventArgs = onContextMenuPreparingHandler.lastCall.args[0];

    assert.ok(eventArgs.event);
    assert.strictEqual(eventArgs.field, this.fields[1]);
    assert.strictEqual(eventArgs.area, this.fields[1].area);
    assert.notOk(e.isDefaultPrevented(), "default behavior should not be prevented");
});

QUnit.test("create event args from area", function(assert) {
    var eventArgs,
        onContextMenuPreparingHandler = sinon.stub(),
        e = $.Event("dxcontextmenu");

    // act
    this.setup({
        fields: this.fields,
        columnFields: [this.fields[1]],
    }, {
        onContextMenuPreparing: onContextMenuPreparingHandler
    });

    this.$container.find("[group='column']").eq(0).trigger(e);

    // assert
    assert.strictEqual(onContextMenuPreparingHandler.callCount, 1);

    eventArgs = onContextMenuPreparingHandler.lastCall.args[0];

    assert.ok(eventArgs.event);
    assert.strictEqual(eventArgs.field, undefined);
    assert.strictEqual(eventArgs.area, this.fields[1].area);
    assert.notOk(e.isDefaultPrevented(), "default behavior should not be prevented");
});

QUnit.test("create event args from empty area", function(assert) {
    var eventArgs,
        onContextMenuPreparingHandler = sinon.stub(),
        e = $.Event("dxcontextmenu");

    // act
    this.setup({
        fields: this.fields,
        columnFields: [this.fields[1]],
    }, {
        onContextMenuPreparing: onContextMenuPreparingHandler
    });

    this.$container.find("[group='row']").eq(0).trigger(e);
    // assert
    assert.strictEqual(onContextMenuPreparingHandler.callCount, 1);

    eventArgs = onContextMenuPreparingHandler.lastCall.args[0];

    assert.ok(eventArgs.event);
    assert.strictEqual(eventArgs.field, undefined);
    assert.strictEqual(eventArgs.area, "row");
    assert.notOk(e.isDefaultPrevented(), "default behavior should not be prevented");
});

QUnit.test("create event args from empty space", function(assert) {
    var eventArgs,
        onContextMenuPreparingHandler = sinon.stub(),
        e = $.Event("dxcontextmenu");

    // act
    this.setup({
        fields: this.fields,
        columnFields: [this.fields[1]],
    }, {
        onContextMenuPreparing: onContextMenuPreparingHandler
    });

    this.$container.eq(0).trigger(e);
    // assert
    assert.strictEqual(onContextMenuPreparingHandler.callCount, 1);

    eventArgs = onContextMenuPreparingHandler.lastCall.args[0];

    assert.ok(eventArgs.event);
    assert.strictEqual(eventArgs.field, undefined);
    assert.strictEqual(eventArgs.area, undefined);
    assert.notOk(e.isDefaultPrevented(), "default behavior should not be prevented");
});

QUnit.test("create custom context menu items", function(assert) {
    var itemClick = sinon.stub(),
        itemData = {
            text: "1",
            onItemClick: itemClick
        };
    // act
    this.setup({
        fields: this.fields,
        columnFields: [this.fields[1]],
    }, {
        onContextMenuPreparing: function(e) {
            e.items.push(itemData);
        }
    });

    this.$container.find("[group='column']").eq(0).trigger("dxcontextmenu");
    // assert

    var contextMenu = this.$container.find(".dx-pivotgridfieldchooser-context-menu").dxContextMenu("instance"),
        items = contextMenu.option("items");

    assert.ok(contextMenu.option("visible"));
    assert.deepEqual(items, [itemData]);

    $(".dx-menu-item").eq(0).trigger("dxclick");
    assert.strictEqual(itemClick.callCount, 1);
});

QUnit.test("onContextMenuPreparing handler can be changed at runtime", function(assert) {
    var onContextMenuPreparingHandler = sinon.stub(),
        fieldChooser;
    // act
    this.setup({
        fields: this.fields,
        columnFields: [this.fields[1]],
    }, {
        onContextMenuPreparing: function() { }
    });

    fieldChooser = this.fieldChooser;

    fieldChooser.option({
        onContextMenuPreparing: onContextMenuPreparingHandler
    });

    this.$container.find("[group='column']").eq(0).trigger("dxcontextmenu");
    // assert
    assert.strictEqual(onContextMenuPreparingHandler.callCount, 1);
});

QUnit.module("Base Field chooser", {
    beforeEach: function() {
        this.setup = function(dataSourceOptions, fieldChooserOptions) {
            fieldChooserOptions = fieldChooserOptions || {};
            if(dataSourceOptions) {
                this.dataSource = createMockDataSource(dataSourceOptions);
                fieldChooserOptions.dataSource = this.dataSource;
            }
            this.fieldChooser = $("#container").dxPivotGridFieldChooserBase(fieldChooserOptions).dxPivotGridFieldChooserBase("instance");
            this.fieldChooser.renderSortable();
            this.$container = $("#container");
        },
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("Render group fields", function(assert) {
    var that = this,
        fields = [
            { caption: "Field 1", area: 'column', index: 0, areaIndex: 0, allowSorting: true, allowFiltering: true },
            { caption: "GroupField", area: "column", index: 1, areaIndex: 1, allowFiltering: true, allowSorting: true },
            { caption: "Field 2", area: 'column', groupName: "Group1", index: 2, groupIndex: 0, areaIndex: 1, allowSorting: true, allowFiltering: true, filterValues: ["10"] },
            { caption: "Field 3", area: 'column', groupName: "Group1", index: 3, groupIndex: 1, areaIndex: 1, allowSorting: true, allowFiltering: true },
            { caption: "Field 4", area: 'column', index: 3, areaIndex: 4, allowSorting: true, allowFiltering: true }
        ],

        dataSourceOptions = {
            columnFields: fields
        };
    this.setup(dataSourceOptions);

    $.each(fields, function(_, field) {
        field.caption !== "GroupField" && that.$container.append(that.fieldChooser.renderField(field));
    });

    var fieldElements = that.$container.find(".dx-area-field");

    assert.strictEqual(fieldElements.length, 4);

    assert.strictEqual(fieldElements.eq(1).find(".dx-header-filter").length, 1);
    assert.ok(fieldElements.eq(1).find(".dx-header-filter").hasClass("dx-header-filter-empty"));
    assert.strictEqual(fieldElements.eq(2).find(".dx-header-filter").length, 0);
});

QUnit.test("Render group fields with filter values is defined", function(assert) {
    var that = this,
        fields = [
            { caption: "Field 1", area: 'column', index: 0, areaIndex: 0, allowSorting: true, allowFiltering: true },
            { caption: "GroupField", area: "column", index: 1, areaIndex: 1, allowFiltering: true, allowSorting: true, filterValues: [["10"]] },
            { caption: "Field 2", area: 'column', groupName: "Group1", index: 2, groupIndex: 0, areaIndex: 1, allowSorting: true, allowFiltering: true },
            { caption: "Field 3", area: 'column', groupName: "Group1", index: 3, groupIndex: 1, areaIndex: 1, allowSorting: true, allowFiltering: true },
            { caption: "Field 4", area: 'column', index: 3, areaIndex: 4, allowSorting: true, allowFiltering: true }
        ],

        dataSourceOptions = {
            columnFields: fields
        };
    this.setup(dataSourceOptions);

    $.each(fields, function(_, field) {
        field.caption !== "GroupField" && that.$container.append(that.fieldChooser.renderField(field));
    });

    var fieldElements = that.$container.find(".dx-area-field");

    assert.strictEqual(fieldElements.length, 4);

    assert.strictEqual(fieldElements.eq(1).find(".dx-header-filter").length, 1);
    assert.ok(!fieldElements.eq(1).find(".dx-header-filter").hasClass("dx-header-filter-empty"));
    assert.strictEqual(fieldElements.eq(2).find(".dx-header-filter").length, 0);
});

QUnit.test("Render sort indicator for group field", function(assert) {
    var that = this,
        fields = [
            { caption: "Field 1", area: 'column', index: 0, areaIndex: 0, allowSorting: true, allowFiltering: true },
            { caption: "GroupField", area: "column", index: 1, areaIndex: 1, allowFiltering: true, allowSorting: false },
            { caption: "Field 2", area: 'column', groupName: "Group1", index: 2, groupIndex: 0, areaIndex: 1, allowSorting: true },
            { caption: "Field 3", area: 'column', groupName: "Group1", index: 3, groupIndex: 1, areaIndex: 1, allowSorting: true },
            { caption: "Field 4", area: 'column', groupName: "Group1", index: 4, groupIndex: 2, areaIndex: 1, allowSorting: false }
        ],

        dataSourceOptions = {
            columnFields: fields
        };
    this.setup(dataSourceOptions);

    $.each(fields, function(_, field) {
        field.caption !== "GroupField" && that.$container.append(that.fieldChooser.renderField(field));
    });

    var fieldElements = that.$container.find(".dx-area-field[item-group]");

    assert.strictEqual(fieldElements.length, 3);
    assert.strictEqual(fieldElements.eq(0).find(".dx-sort").length, 1);
    assert.strictEqual(fieldElements.eq(1).find(".dx-sort").length, 1);
    assert.strictEqual(fieldElements.eq(2).find(".dx-sort").length, 0);
    assert.ok(fieldElements.eq(0).hasClass("dx-pivotgrid-action"), "generation prefix is 'dx-pivotgrid'");
});

QUnit.test("Change sortOrder for group field", function(assert) {
    var that = this,
        fields = [
            { caption: "Field 1", area: 'column', index: 0, areaIndex: 0, allowSorting: true, allowFiltering: true },
            { caption: "GroupField", area: "column", index: 1, areaIndex: 1, allowFiltering: true, allowSorting: false },
            { caption: "Field 2", area: 'column', groupName: "Group1", index: 2, groupIndex: 0, areaIndex: 1, allowSorting: true },
            { caption: "Field 3", area: 'column', groupName: "Group1", index: 3, groupIndex: 1, areaIndex: 1, allowSorting: true },
            { caption: "Field 4", area: 'column', groupName: "Group1", index: 4, groupIndex: 2, areaIndex: 1, allowSorting: false }
        ],

        dataSourceOptions = {
            columnFields: fields
        };
    this.setup(dataSourceOptions);

    $.each(fields, function(_, field) {
        field.caption !== "GroupField" && that.$container.append(that.fieldChooser.renderField(field));
    });

    var fieldElements = that.$container.find(".dx-area-field[item-group]");

    // act
    fieldElements.eq(1).trigger("dxclick");

    assert.strictEqual(this.dataSource.field.lastCall.args[0], 3);
    assert.deepEqual(this.dataSource.field.lastCall.args[1], {
        "sortOrder": "desc"
    });
});

QUnit.test("change group position", function(assert) {
    var dataSourceOptions = {
        columnFields: [
            { caption: "Field 1", area: 'column', index: 0, areaIndex: 0 },
            { caption: "Field 2", area: 'column', groupName: "Group1", index: 1, groupIndex: 0, areaIndex: 1 },
            { caption: "Field 3", area: 'column', groupName: "Group1", index: 2, groupIndex: 0, areaIndex: 1 },
            { caption: "Field 4", area: 'column', index: 3, areaIndex: 2 }
        ]
    };
    this.setup(dataSourceOptions);

    var sortable = this.fieldChooser.$element().dxSortable("instance"),
        onChangedHandler = sortable.option("onChanged"),
        changedArgs = {
            sourceElement: this.$container.find(".dx-area-field").eq(2),
            targetIndex: 0,
            sourceIndex: 1
        };
    // act

    onChangedHandler(changedArgs);

    assert.strictEqual(changedArgs.removeSourceElement, false);
    assert.strictEqual(changedArgs.removeTargetElement, true);
    assert.strictEqual(changedArgs.removeSourceClass, false);
});

QUnit.test("Show search box in headerFilter", function(assert) {
    var that = this,
        list,
        fieldElements,
        fields = [
            { caption: "Field 1", area: 'column', index: 0, areaIndex: 0, allowSorting: true, allowFiltering: true }
        ],
        dataSourceOptions = {
            columnFields: fields,
            fieldValues: [
                [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]
            ]
        };

    this.setup(dataSourceOptions, {
        headerFilter: {
            allowSearch: true
        }
    });

    $.each(fields, function(_, field) {
        that.$container.append(that.fieldChooser.renderField(field));
    });

    fieldElements = that.$container.find(".dx-area-field");

    // act
    fieldElements.first().find(".dx-header-filter").trigger("dxclick");
    this.clock.tick(500);

    // assert
    list = $(".dx-list").dxList("instance");
    assert.ok(list.option("searchEnabled"), "list with search bar");
    assert.equal(list.option("searchExpr"), "text", "expr is correct");
});

QUnit.test("HeaderFilter should be without search bar when column allowSearch is disabled", function(assert) {
    var that = this,
        list,
        fieldElements,
        fields = [
            { caption: "Field 1", area: 'column', index: 0, areaIndex: 0, allowSorting: true, allowFiltering: true,
                headerFilter: {
                    allowSearch: false
                }
            }
        ],
        dataSourceOptions = {
            columnFields: fields,
            fieldValues: [
                [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]
            ]
        };

    this.setup(dataSourceOptions, {
        headerFilter: {
            allowSearch: true
        }
    });

    $.each(fields, function(_, field) {
        that.$container.append(that.fieldChooser.renderField(field));
    });

    fieldElements = that.$container.find(".dx-area-field");

    // act
    fieldElements.first().find(".dx-header-filter").trigger("dxclick");
    this.clock.tick(500);

    // assert
    list = $(".dx-list").dxList("instance");
    assert.notOk(list.option("searchEnabled"), "list without search bar");
});

QUnit.test("Search in headerFilter", function(assert) {
    var that = this,
        list,
        $listItems,
        fieldElements,
        fields = [
            { caption: "Field 1", area: 'column', index: 0, areaIndex: 0, allowSorting: true, allowFiltering: true }
        ],
        dataSourceOptions = {
            columnFields: fields,
            fieldValues: [
                [{ value: 1, text: "test1" }, { value: 2, text: "test2" }, { value: 3, text: "test3" }, { value: 4, text: "test4" }]
            ]
        };

    this.setup(dataSourceOptions, {
        headerFilter: {
            allowSearch: true
        }
    });

    $.each(fields, function(_, field) {
        that.$container.append(that.fieldChooser.renderField(field));
    });

    fieldElements = that.$container.find(".dx-area-field");
    fieldElements.first().find(".dx-header-filter").trigger("dxclick");
    this.clock.tick(500);

    // act
    list = $(".dx-list").dxList("instance");
    list.option("searchValue", "t2");

    // assert
    $listItems = list.$element().find(".dx-list-item");
    assert.strictEqual($listItems.length, 1, "list item's count");
    assert.strictEqual($listItems.text(), "test2", "correct item's text");
});
