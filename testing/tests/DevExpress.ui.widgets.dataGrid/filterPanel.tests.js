"use strict";

require("ui/data_grid/ui.data_grid");

var $ = require("jquery"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules;

var FILTER_PANEL_CLASS = "dx-datagrid-filter-panel",
    FILTER_PANEL_TEXT_CLASS = FILTER_PANEL_CLASS + "-text";

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
            setupDataGridModules(this, ["columns", "data", "headerFilter", "filterSync", "filterBuilder", "filterPanel"], {
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

    QUnit.test("applyFilterValue", function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                applyFilterValue: true
            },
            dataSource: [],
            filterValue: ["field", "=", "1"],
            columns: [{ dataField: "field" }]
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true), ["field", "=", "1"], "check filterValue");

        // act
        this.changeOption("filterPanel", "filterPanel.applyFilterValue", false);

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

    QUnit.test("can customize text", function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                customizeFilterText: function(filterValue) {
                    return filterValue + "_test";
                }
            },
            filterValue: ["field", "=", "1"]
        });

        // assert
        assert.equal(this.filterPanelView.element().find("." + FILTER_PANEL_TEXT_CLASS).text(), "field,=,1_test", "check createFilterText");
    });
});
