"use strict";

require("ui/data_grid/ui.data_grid");

var $ = require("jquery"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    fx = require("animation/fx"),
    setupDataGridModules = dataGridMocks.setupDataGridModules,
    MockDataController = dataGridMocks.MockDataController,
    MockColumnsController = dataGridMocks.MockColumnsController;

QUnit.testStart(function() {
    var markup =
    '<div>\
        <div class="dx-datagrid">\
            <div id="container"></div>\
        </div>\
    </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Sync with Filter Row", {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            this.options = $.extend(true, {
                filterSyncEnabled: true,
                filterValue: null,
                filterRow: {
                    applyFilter: "auto",
                    visible: true,
                    showOperationChooser: true
                }
            }, options);

            setupDataGridModules(this, ["data", "columnHeaders", "filterRow", "editorFactory", "filterMerging", "headerPanel"], {
                initViews: true,
                controllers: {
                    columns: new MockColumnsController(this.options.columns),
                    data: new MockDataController({})
                }
            });
        };

        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, function() {
    QUnit.test("update filterValue after change filter text with defaultFilterOperation", function(assert) {
        //arrange
        var testElement = $("#container");

        this.setupDataGrid({
            columns: [{ dataField: "field", dataType: "number", defaultFilterOperation: "=", allowFiltering: true, index: 0 }]
        });


        //act
        this.columnHeadersView.render(testElement);

        var filterRowInput = $(this.columnHeadersView.element()).find(".dx-texteditor");
        assert.equal(filterRowInput.length, 1);

        filterRowInput.find(".dx-texteditor-input").val(90);
        filterRowInput.find(".dx-texteditor-input").trigger("keyup");

        //act
        this.clock.tick(700);

        //assert
        assert.deepEqual(this.option("filterValue"), ["field", "=", 90]);
    });

    QUnit.test("update filterValue after change filter text with selectedFilterOperation", function(assert) {
        //arrange
        var testElement = $("#container");

        this.setupDataGrid({
            columns: [{ dataField: "field", dataType: "number", defaultFilterOperation: "=", selectedFilterOperation: "<>", allowFiltering: true, index: 0 }]
        });

        //act
        this.columnHeadersView.render(testElement);

        var filterRowInput = $(this.columnHeadersView.element()).find(".dx-texteditor");
        assert.equal(filterRowInput.length, 1);

        filterRowInput.find(".dx-texteditor-input").val(90);
        filterRowInput.find(".dx-texteditor-input").trigger("keyup");

        //act
        this.clock.tick(700);

        //assert
        assert.deepEqual(this.option("filterValue"), ["field", "<>", 90]);
    });

    QUnit.test("update filterValue after change filter operation", function(assert) {
        //arrange
        var testElement = $("#container");

        this.setupDataGrid({
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

        //act
        this.columnHeadersView.render(testElement);

        $(".dx-menu-item").trigger("dxclick");

        var $filterMenuItem = $(".dx-menu-item").eq(2);
        $filterMenuItem.trigger("dxclick");

        //act
        this.clock.tick(700);

        //assert
        assert.deepEqual(this.option("filterValue"), ["field", "<", 90]);
    });

    QUnit.test("filterValue == null after change filter operation without value", function(assert) {
        //arrange
        var testElement = $("#container");

        this.setupDataGrid({
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

        //act
        this.columnHeadersView.render(testElement);

        $(".dx-menu-item").trigger("dxclick");

        var $filterMenuItem = $(".dx-menu-item").eq(2);
        $filterMenuItem.trigger("dxclick");

        //act
        this.clock.tick(700);

        //assert
        assert.deepEqual(this.option("filterValue"), null);
    });

    QUnit.test("onClick mode", function(assert) {
        //arrange
        var testElement = $("#container");

        this.setupDataGrid({
            columns: [{ dataField: "field", dataType: "number", defaultFilterOperation: "=", selectedFilterOperation: "<>", allowFiltering: true, index: 0 }],
            filterRow: {
                applyFilter: "onClick"
            }
        });

        //act
        this.headerPanel.render(testElement);
        this.columnHeadersView.render(testElement);

        var filterRowInput = $(this.columnHeadersView.element()).find(".dx-texteditor");

        filterRowInput.find(".dx-texteditor-input").val(90);
        filterRowInput.find(".dx-texteditor-input").trigger("keyup");

        //act
        this.clock.tick(700);

        //assert
        assert.deepEqual(this.option("filterValue"), null);

        var $button = $(this.headerPanel.element()).find(".dx-apply-button");
        $button.trigger("dxclick");

        assert.deepEqual(this.option("filterValue"), ["field", "<>", 90]);
    });
});

QUnit.module("getCombinedFilter", {
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
    QUnit.test("one value", function(assert) {
        //act
        this.setupDataGrid({
            dataSource: [],
            columns: ["Test"],
            filterValue: ["Test", "=", 1]
        });

        //assert
        assert.deepEqual(this.getCombinedFilter(true), ["Test", "=", 1], "combined filter");
    });

    QUnit.test("between", function(assert) {
        //act
        this.setupDataGrid({
            dataSource: [],
            columns: ["Test"],
            filterValue: ["Test", "between", [1, 2]]
        });

        //assert
        assert.deepEqual(this.getCombinedFilter(true), [["Test", ">=", 1], "and", ["Test", "<=", 2]], "combined filter");
    });

    QUnit.test("calculateFilterExpression", function(assert) {
        var handler = sinon.spy();

        //act
        this.setupDataGrid({
            dataSource: [],
            columns: [{
                dataField: "Test",
                calculateFilterExpression: handler
            }],
            filterValue: ["Test", "between", [1, 2]]
        });

        this.getCombinedFilter();

        //assert
        assert.deepEqual(handler.lastCall.args[0], [1, 2], "filterValue");
        assert.equal(handler.lastCall.args[1], "between", "selectedFilterOperation");
        assert.equal(handler.lastCall.args[2], "filterBuilder", "target");
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
    QUnit.test("filter sync enabled", function(assert) {
        //act
        this.setupDataGrid({
            dataSource: [],
            filterValue: null,
            filterSyncEnabled: true,
            columns: [{
                dataField: "Test",
                filterValue: "1"
            }]
        });

        //assert
        assert.deepEqual(this.option("filterValue"), ["Test", "contains", "1"], "filterValue");
    });

    QUnit.test("filter sync disabled", function(assert) {
        //act
        this.setupDataGrid({
            dataSource: [],
            filterValue: null,
            columns: [{
                dataField: "Test",
                filterValue: "1"
            }]
        });

        //assert
        assert.equal(this.option("filterValue"), null, "filterValue");
    });
});

