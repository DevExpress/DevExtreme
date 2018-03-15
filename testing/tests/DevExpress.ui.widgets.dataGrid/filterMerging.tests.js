"use strict";

require("ui/data_grid/ui.data_grid");

var $ = require("jquery"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    fx = require("animation/fx"),
    setupDataGridModules = dataGridMocks.setupDataGridModules;

QUnit.testStart(function() {
    var markup =
    '<div>\
        <div class="dx-datagrid">\
            <div id="container"></div>\
        </div>\
    </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Sync with Header Filter", {
    beforeEach: function() {
        this.options = {
            columns: [{ dataField: "field", allowHeaderFiltering: true }, { dataField: "excludedField", allowHeaderFiltering: true, filterType: "exclude" }],
            filterSyncEnabled: true,
            filterValue: null
        };

        this.setupDataGrid = function() {
            setupDataGridModules(this, ["columns", "data", "columnHeaders", "headerFilter", "filterMerging"], {
                initViews: true
            });
        };

    }
}, function() {
    QUnit.test("check equals (one value)", function(assert) {
        // arrange
        this.setupDataGrid();

        // act
        this.columnsController.columnOption("field", { filterValues: [2] });

        // assert
        assert.deepEqual(this.option("filterValue"), ["field", "anyof", [2]]);
    });

    QUnit.test("check any of (two value)", function(assert) {
        // arrange
        this.setupDataGrid();

        // act
        this.columnsController.columnOption("field", { filterValues: [2, 1] });

        // assert
        assert.deepEqual(this.option("filterValue"), ["field", "anyof", [2, 1]]);
    });
});

QUnit.module("Sync with FilterValue", {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            this.options = $.extend({
                columns: [{ dataField: "field" }],
                filterSyncEnabled: true,
                filterValue: null
            }, options);
            setupDataGridModules(this, ["columns", "data", "columnHeaders", "filterRow", "headerFilter", "filterMerging"], {
                initViews: true
            });
        };

    }
}, function() {
    QUnit.test("equals", function(assert) {
        // arrange, act
        this.setupDataGrid({
            filterValue: ["field", "=", 2],
            columns: [{ dataField: "field" }]
        });

        // assert
        assert.deepEqual(this.columnsController.columnOption("field", "filterValues"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "filterType"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValue"), 2);
    });

    QUnit.test("anyof with one value", function(assert) {
        // arrange, act
        this.setupDataGrid({
            filterValue: ["field", "anyof", [1]]
        });

        // assert
        assert.deepEqual(this.columnsController.columnOption("field", "filterValues"), [1]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValue"), undefined);
    });

    QUnit.test("anyof with two values", function(assert) {
        // arrange, act
        this.setupDataGrid({
            filterValue: ["field", "anyof", [2, 1]]
        });

        // assert
        assert.deepEqual(this.columnsController.columnOption("field", "filterValues"), [2, 1]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValue"), undefined);
    });

    QUnit.test("does not equal", function(assert) {
        // arrange, act
        this.setupDataGrid({
            filterValue: ["field", "<>", 2]
        });

        // assert
        assert.deepEqual(this.columnsController.columnOption("field", "filterValues"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "filterType"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValue"), 2);
    });

    QUnit.test("skip filter value", function(assert) {
        // arrange, act
        this.setupDataGrid({
            filterValue: ["field", "<>", 2],
            columns: [{ dataField: "field", filterValue: 1 }],
        });

        // assert
        assert.deepEqual(this.option("filterValue"), ["field", "<>", 2]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValues"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "filterType"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValue"), 2);
        assert.deepEqual(this.columnsController.columnOption("field", "selectedFilterOperation"), "<>");
    });

    QUnit.test("skip header filter", function(assert) {
        // arrange, act
        this.setupDataGrid({
            filterValue: ["field", "anyof", [2]],
            columns: [{ dataField: "field", filterValues: [1, 3] }],
        });

        // assert
        assert.deepEqual(this.option("filterValue"), ["field", "anyof", [2]]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValues"), [2]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValue"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "selectedFilterOperation"), undefined);
    });

    QUnit.test("not sync header filter with filterrow", function(assert) {
        // arrange, act
        this.setupDataGrid({
            columns: [{ dataField: "field", filterValue: 1, selectedFilterOperation: "=" }],
        });

        // assert
        assert.deepEqual(this.option("filterValue"), ["field", "=", 1]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValues"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "filterType"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValue"), 1);
        assert.deepEqual(this.columnsController.columnOption("field", "selectedFilterOperation"), "=");
    });

    QUnit.test("not sync filterrow with headerfilter", function(assert) {
        // arrange, act
        this.setupDataGrid({
            columns: [{ dataField: "field", filterValues: [1], filterType: "exclude" }],
        });

        // assert
        assert.deepEqual(this.option("filterValue"), ["field", "anyof", [1]]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValues"), [1]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterType"), "exclude");
        assert.deepEqual(this.columnsController.columnOption("field", "filterValue"), undefined);
        assert.deepEqual(this.columnsController.columnOption("field", "selectedFilterOperation"), undefined);
    });

    QUnit.test("headerfilter & filterRow", function(assert) {
        // arrange, act
        this.setupDataGrid({
            columns: [{ dataField: "field", filterValues: ["2", "3"], filterType: "include", filterValue: "1", selectedFilterOperation: "=" }],
        });

        // assert
        assert.deepEqual(this.option("filterValue"), [["field", "anyof", ["2", "3"]], "and", ["field", "=", "1"]]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterValues"), ["2", "3"]);
        assert.deepEqual(this.columnsController.columnOption("field", "filterType"), "include");
        assert.deepEqual(this.columnsController.columnOption("field", "filterValue"), "1");
        assert.deepEqual(this.columnsController.columnOption("field", "selectedFilterOperation"), "=");
    });
});


QUnit.module("getCombinedFilter", {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            this.options = options;
            setupDataGridModules(this, ["columns", "data", "headerFilter", "filterRow", "filterMerging"], {
                initViews: false
            });
        };
    },
    afterEach: function() {
    }
}, function() {
    QUnit.test("one value", function(assert) {
        // act
        this.setupDataGrid({
            dataSource: [],
            columns: ["Test"],
            filterValue: ["Test", "=", 1]
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true), ["Test", "=", 1], "combined filter");
    });

    QUnit.test("between", function(assert) {
        // act
        this.setupDataGrid({
            dataSource: [],
            columns: ["Test"],
            filterValue: ["Test", "between", [1, 2]]
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true), [["Test", ">=", 1], "and", ["Test", "<=", 2]], "combined filter");
    });

    QUnit.test("anyof", function(assert) {
        // act
        this.setupDataGrid({
            dataSource: [],
            columns: ["Test"],
            filterValue: ["Test", "anyof", [1, 2]]
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true), [["Test", "=", 1], "or", ["Test", "=", 2]], "combined filter");
    });

    QUnit.test("ignore Header Filter & Filter Row when filterSyncEnabled = true", function(assert) {
        // arrange
        var filterValue = [["Test", "=", 2], "and", ["Test", "anyof", [5, 6]]];

        // act
        this.setupDataGrid({
            filterSyncEnabled: true,
            dataSource: [],
            columns: [{ dataField: "Test", filterValue: 3, defaultFilterOperation: "=", filterValues: [4, 8] }],
            filterValue: filterValue
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true), [["Test", "=", 2], "and", [["Test", "=", 5], "or", ["Test", "=", 6]]], "combined filter");
    });

    QUnit.test("filterValue & Header Filter & Filter Row (filterSyncEnabled = false)", function(assert) {
        // act
        this.setupDataGrid({
            filterSyncEnabled: false,
            dataSource: [],
            columns: [{ dataField: "Test", filterValue: 3, defaultFilterOperation: "=", filterValues: [4, 8] }],
            filterValue: [["Test", "=", 2], "and", ["Test", "anyof", [5, 6]]]
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true),
            [
                [
                    ["Test", "=", 3],
                    "and",
                    [["Test", "=", 4], "or", ["Test", "=", 8]]
                ],
                "and",
                [
                    ["Test", "=", 2],
                    "and",
                    [["Test", "=", 5 ], "or", ["Test", "=", 6]]
                ]
            ], "combined filter");
    });

    QUnit.test("calculateFilterExpression", function(assert) {
        var handler = sinon.spy();

        // act
        this.setupDataGrid({
            dataSource: [],
            columns: [{
                dataField: "Test",
                calculateFilterExpression: handler
            }],
            filterValue: ["Test", "between", [1, 2]]
        });

        this.getCombinedFilter();

        // assert
        assert.deepEqual(handler.lastCall.args[0], [1, 2], "filterValue");
        assert.equal(handler.lastCall.args[1], "between", "selectedFilterOperation");
        assert.equal(handler.lastCall.args[2], "filterBuilder", "target");
    });

    QUnit.test("header filter exclude", function(assert) {
        // act
        this.setupDataGrid({
            dataSource: [],
            columns: [{ dataField: "Test", filterType: "exclude" }],
            filterValue: ["Test", "anyof", ["1", "2"]]
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true), [["Test", "<>", "1"], "and", ["Test", "<>", "2"]], "combined filter");
    });

    QUnit.test("group in value - include", function(assert) {
        // act
        this.setupDataGrid({
            dataSource: [],
            columns: [{ dataField: "Test", filterType: "include" }],
            filterValue: ["Test", "anyof", [
                ["Test", "<", 3000],
                [
                    ["Test", ">=", 3000],
                    "and",
                    ["Test", "<", 5000]
                ]
            ]]
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true), [
            ["Test", "<", 3000],
            "or",
            [
                ["Test", ">=", 3000],
                "and",
                ["Test", "<", 5000]
            ]
        ], "combined filter");
    });

    QUnit.test("group in value - exclude", function(assert) {
        // act
        this.setupDataGrid({
            dataSource: [],
            columns: [{ dataField: "Test", filterType: "exclude" }],
            filterValue: ["Test", "anyof", [
                ["Test", "<", 3000],
                [
                    ["Test", ">=", 3000],
                    "and",
                    ["Test", "<", 5000]
                ]
            ]]
        });


        // assert
        assert.deepEqual(this.getCombinedFilter(true), [
            ["!", ["Test", "<", 3000]],
            "and",
            ["!", [
                ["Test", ">=", 3000],
                "and",
                ["Test", "<", 5000]
            ]]
        ], "combined filter");
    });
});


QUnit.module("Sync on initialization", {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            this.options = options;
            setupDataGridModules(this, ["columns", "data", "filterMerging"], {
                initViews: false
            });
        };
    },
    afterEach: function() {
    }
}, function() {
    QUnit.test("filter sync with filterValue", function(assert) {
        // act
        this.setupDataGrid({
            filterValue: null,
            filterSyncEnabled: true,
            columns: [{
                dataField: "Test",
                filterValue: "1"
            }]
        });

        // assert
        assert.deepEqual(this.option("filterValue"), ["Test", "contains", "1"], "filterValue");
    });

    QUnit.test("filter sync with filterValues", function(assert) {
        // act
        this.setupDataGrid({
            filterValue: null,
            filterSyncEnabled: true,
            columns: [{
                dataField: "Test",
                filterValues: ["2", "3"]
            }]
        });

        // assert
        assert.deepEqual(this.option("filterValue"), ["Test", "anyof", ["2", "3"]], "filterValue");
    });

    QUnit.test("filter sync disabled", function(assert) {
        // act
        this.setupDataGrid({
            filterValue: null,
            columns: [{
                dataField: "Test",
                filterValue: "1"
            }]
        });

        // assert
        assert.equal(this.option("filterValue"), null, "filterValue");
    });
});

QUnit.module("Real dataGrid", {
    beforeEach: function() {
        this.initDataGrid = function(options) {
            this.dataGrid = $("#container").dxDataGrid($.extend({
                dataSource: [{}],
                filterSyncEnabled: true,
                loadingTimeout: undefined,
                filterRow: {
                    visible: true
                },
                columns: [{ dataField: "field", filterValues: [1], filterType: "exclude", filterValue: 2, selectedFilterOperation: "=" }]
            }, options)).dxDataGrid("instance");
            return this.dataGrid;
        };

        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.dataGrid.dispose();
        this.clock.restore();
        fx.off = false;
    }
}, function() {
    QUnit.test("clear all filters", function(assert) {
        // arrange
        var dataGrid = this.initDataGrid();

        // act
        dataGrid.option("filterValue", null);

        // assert
        assert.deepEqual(dataGrid.columnOption("field", "filterValues"), undefined);
        assert.deepEqual(dataGrid.columnOption("field", "filterType"), "include");
        assert.deepEqual(dataGrid.columnOption("field", "filterValue"), undefined);
        assert.deepEqual(dataGrid.columnOption("field", "selectedFilterOperation"), undefined);
    });

    QUnit.test("update filterValue after change filter text with defaultFilterOperation", function(assert) {
        var dataGrid = this.initDataGrid({
            columns: [{ dataField: "field", dataType: "number", defaultFilterOperation: "=", allowFiltering: true, index: 0 }]
        });
        var filterRowInput = $(".dx-texteditor");
        assert.equal(filterRowInput.length, 1);

        filterRowInput.find(".dx-texteditor-input").val(90);
        filterRowInput.find(".dx-texteditor-input").trigger("keyup");

        this.clock.tick(700);

        assert.deepEqual(dataGrid.option("filterValue"), ["field", "=", 90]);
    });

    QUnit.test("update filterValue after change filter text with selectedFilterOperation", function(assert) {
        // arrange
        var dataGrid = this.initDataGrid({
            columns: [{ dataField: "field", dataType: "number", defaultFilterOperation: "=", selectedFilterOperation: "<>", allowFiltering: true, index: 0 }]
        });

        var filterRowInput = $(".dx-texteditor");
        assert.equal(filterRowInput.length, 1);

        filterRowInput.find(".dx-texteditor-input").val(90);
        filterRowInput.find(".dx-texteditor-input").trigger("keyup");

        // act
        this.clock.tick(700);

        // assert
        assert.deepEqual(dataGrid.option("filterValue"), ["field", "<>", 90]);
    });

    QUnit.test("update filterValue after change filter operation", function(assert) {
        // arrange
        var dataGrid = this.initDataGrid({
            columns: [{
                dataField: "field",
                dataType: "number",
                filterValue: 90,
                defaultFilterOperation: "=",
                selectedFilterOperation: "<>",
                filterOperations: ["=", "<", ">", "<>"],
                allowFiltering: true,
                index: 0
            }]
        });

        // act
        $(".dx-menu-item").trigger("dxclick");
        var $filterMenuItem = $(".dx-menu-item").eq(2);
        $filterMenuItem.trigger("dxclick");

        // act
        this.clock.tick(700);

        // assert
        assert.deepEqual(dataGrid.option("filterValue"), ["field", "<", 90]);
    });

    QUnit.test("filterValue == null after change filter operation without value", function(assert) {
        // arrange
        var dataGrid = this.initDataGrid({
            columns: [{
                dataField: "field",
                dataType: "number",
                defaultFilterOperation: "=",
                selectedFilterOperation: "<>",
                filterOperations: ["=", "<", ">", "<>"],
                allowFiltering: true,
                index: 0
            }]
        });

        // act
        $(".dx-menu-item").trigger("dxclick");
        var $filterMenuItem = $(".dx-menu-item").eq(2);
        $filterMenuItem.trigger("dxclick");

        // act
        this.clock.tick(700);

        // assert
        assert.deepEqual(dataGrid.option("filterValue"), null);
    });

    QUnit.test("onClick mode", function(assert) {
        // arrange
        var dataGrid = this.initDataGrid({
            columns: [{ dataField: "field", dataType: "number", defaultFilterOperation: "=", selectedFilterOperation: "<>", allowFiltering: true, index: 0 }],
            filterRow: {
                visible: true,
                applyFilter: "onClick"
            }
        });

        // act
        var filterRowInput = $(".dx-texteditor");
        filterRowInput.find(".dx-texteditor-input").val(90);
        filterRowInput.find(".dx-texteditor-input").trigger("keyup");
        this.clock.tick(700);
        // assert
        assert.deepEqual(dataGrid.option("filterValue"), null);

        // act
        var $button = $(".dx-apply-button");
        $button.trigger("dxclick");
        // assert
        assert.deepEqual(dataGrid.option("filterValue"), ["field", "<>", 90]);
    });

    QUnit.test("change field filterValues", function(assert) {
        // arrange
        var dataGrid = this.initDataGrid();

        // act
        dataGrid.columnOption("field", { filterValues: [2, 3] });

        // assert
        assert.deepEqual(dataGrid.option("filterValue"), [["field", "anyof", [2, 3]], "and", ["field", "=", 2]]);
        assert.deepEqual(dataGrid.columnOption("field", "filterValues"), [2, 3]);
        assert.deepEqual(dataGrid.columnOption("field", "filterType"), "exclude");
        assert.deepEqual(dataGrid.columnOption("field", "filterValue"), 2);
        assert.deepEqual(dataGrid.columnOption("field", "selectedFilterOperation"), "=");
    });

    QUnit.test("change field filterValue", function(assert) {
        // arrange
        var dataGrid = this.initDataGrid();

        // act
        dataGrid.columnOption("field", { filterValue: 100 });

        // assert
        assert.deepEqual(dataGrid.option("filterValue"), [["field", "anyof", [1]], "and", ["field", "=", 100]]);
        assert.deepEqual(dataGrid.columnOption("field", "filterValues"), [1]);
        assert.deepEqual(dataGrid.columnOption("field", "filterType"), "exclude");
        assert.deepEqual(dataGrid.columnOption("field", "filterValue"), 100);
        assert.deepEqual(dataGrid.columnOption("field", "selectedFilterOperation"), "=");
    });
});

