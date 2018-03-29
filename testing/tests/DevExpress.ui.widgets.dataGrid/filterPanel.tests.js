"use strict";

require("ui/data_grid/ui.data_grid");

var $ = require("jquery"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules;

var FILTER_PANEL_CLASS = "dx-datagrid-filter-panel",
    FILTER_PANEL_TEXT_CLASS = FILTER_PANEL_CLASS + "-text",
    FILTER_PANEL_CLEAR_FILTER_CLASS = FILTER_PANEL_CLASS + "-clear-filter",
    FILTER_PANEL_CHECKBOX_CLASS = FILTER_PANEL_CLASS + "-checkbox";

QUnit.testStart(function() {
    var markup =
    '<div>\
        <div class="dx-datagrid">\
            <div id="container"></div>\
        </div>\
    </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Filter Panel", {
    beforeEach: function() {
        this.initFilterPanelView = function(options) {
            this.options = options;
            setupDataGridModules(this, ["columns", "filterRow", "data", "headerFilter", "filterSync", "filterBuilder", "filterPanel"], {
                initViews: true
            });
            this.filterPanelView.render($("#container"));
            this.filterPanelView.component.isReady = function() {
                return true;
            };
        };

        this.changeOption = function(name, fullName, value) {
            this.option(fullName, value);
            this.filterPanelView.beginUpdate();
            this.filterPanelView.optionChanged({ name: name });
            this.filterPanelView.endUpdate();
        };
    }
}, function() {
    QUnit.test("visible", function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: false
            }
        });

        // assert
        assert.notOk(this.filterPanelView.element().hasClass(FILTER_PANEL_CLASS));

        // act
        this.changeOption("filterPanel", "filterPanel.visible", true);

        // assert
        assert.ok(this.filterPanelView.element().hasClass(FILTER_PANEL_CLASS));
    });

    QUnit.test("filterApplied", function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                filterApplied: true
            },
            dataSource: [],
            filterValue: ["field", "=", "1"],
            columns: [{ dataField: "field" }]
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true), ["field", "=", "1"], "check filterValue");

        // act
        this.changeOption("filterPanel", "filterPanel.filterApplied", false);

        // assert
        assert.deepEqual(this.getCombinedFilter(true), undefined, "check filterValue");
    });

    QUnit.test("createFilterText", function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                createFilterText: "test"
            }
        });

        // assert
        assert.equal(this.filterPanelView.element().find("." + FILTER_PANEL_TEXT_CLASS).text(), "test", "check createFilterText");
    });

    QUnit.test("Can customize text", function(assert) {
        // arrange
        var assertFilterValue,
            assertFilterText,
            filterValue = ["field", "=", "1"];

        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                customizeFilterText: function(filterValue, filterText) {
                    assertFilterValue = filterValue;
                    assertFilterText = filterText + "_test";
                    return assertFilterText;
                }
            },
            dataSource: [],
            filterValue: filterValue,
            columns: [{ dataField: "field" }]
        });

        // assert
        assert.equal(this.filterPanelView.element().find("." + FILTER_PANEL_TEXT_CLASS).text(), assertFilterText, "check customizeFilterText");
        assert.equal(assertFilterValue, filterValue, "check filter value in customizeFilterText function");
    });

    QUnit.test("Filter text", function(assert) {
        // arrange
        this.initFilterPanelView({
            filterPanel: {
                visible: true
            },
            dataSource: [],
            filterValue: ["field", "=", "1"],
            columns: [{ dataField: "field" }]
        });

        // assert
        assert.equal(this.filterPanelView.element().find("." + FILTER_PANEL_TEXT_CLASS).text(), "[Field] equal '1'", "check filter text");
    });

    QUnit.test("can customize hints", function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                applyFilterHintText: "test0"
            },
            dataSource: [],
            filterValue: ["field", "=", "1"],
            columns: [{ dataField: "field" }]
        });

        // assert
        assert.equal(this.filterPanelView.element().find("." + FILTER_PANEL_CHECKBOX_CLASS).attr("title"), "test0", "check hint for applyFilter");
    });

    QUnit.test("clearFilterText", function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                clearFilterText: "test0"
            },
            dataSource: [],
            filterValue: ["field", "=", "1"],
            columns: [{ dataField: "field" }]
        });

        // assert
        assert.equal(this.filterPanelView.element().find("." + FILTER_PANEL_CLEAR_FILTER_CLASS).text(), "test0", "check clearFilterText");
    });
});
