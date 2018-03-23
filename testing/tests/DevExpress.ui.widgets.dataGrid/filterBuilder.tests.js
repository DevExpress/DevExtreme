"use strict";

require("ui/data_grid/ui.data_grid");

var $ = require("jquery"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
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

QUnit.module("Common", {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            this.options = options;
            setupDataGridModules(this, ["columns", "headerFilter", "filterSync", "filterBuilder"], {
                initViews: true
            });
        };
    }
}, function() {
    QUnit.test("showFilterBuilderPopup & hideFilterBuilderPopup", function(assert) {
        // arrange
        var handlerShow = sinon.spy(),
            handlerHide = sinon.spy(),
            testElement = $("#container");

        // act
        this.setupDataGrid({
            filterBuilderPopup: {
                onShowing: handlerShow,
                onHiding: handlerHide
            },
            columns: [{ dataField: "field" }]
        });
        this.filterBuilderView.render(testElement);

        // assert
        assert.equal(handlerShow.called, 0);
        assert.equal(handlerHide.called, 0);

        // act
        this.option("filterBuilderPopup.visible", true);
        this.filterBuilderView.render(testElement);

        // assert
        assert.equal(handlerShow.called, 1);
        assert.equal(handlerHide.called, 0);

        this.option("filterBuilderPopup.visible", false);
        this.filterBuilderView.render(testElement);

        // assert
        assert.equal(handlerShow.called, 1);
        assert.equal(handlerHide.called, 1);
    });

    QUnit.test("initFilterBuilder", function(assert) {
        // arrange
        var handlerInit = sinon.spy(),
            testElement = $("#container");

        // act
        this.setupDataGrid({
            filterBuilderPopup: {},
            filterBuilder: {
                onInitialized: handlerInit
            },
            columns: [{ dataField: "field" }]
        });
        this.filterBuilderView.render(testElement);

        // assert
        assert.equal(handlerInit.called, 0);

        // act
        this.option("filterBuilderPopup.visible", true);
        this.filterBuilderView.render(testElement);

        // assert
        assert.equal(handlerInit.called, 1);
    });
});
