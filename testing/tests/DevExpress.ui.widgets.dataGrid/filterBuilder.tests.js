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
        this.initFilterBuilderView = function(options) {
            this.options = options;
            setupDataGridModules(this, ["columns", "headerFilter", "filterSync", "filterBuilder"], {
                initViews: true
            });
            this.filterBuilderView.render($("#container"));
            this.filterBuilderView.component.isReady = function() {
                return true;
            };
        };

        this.changeOption = function(name, fullName, value) {
            this.option(fullName, value);
            this.filterBuilderView.beginUpdate();
            this.filterBuilderView.optionChanged({ name: name });
            this.filterBuilderView.endUpdate();
        };
    }
}, function() {
    QUnit.test("showFilterBuilderPopup & hideFilterBuilderPopup", function(assert) {
        // arrange
        var handlerShow = sinon.spy(),
            handlerHide = sinon.spy();

        // act
        this.initFilterBuilderView({
            filterBuilderPopup: {
                onShowing: handlerShow,
                onHiding: handlerHide
            },
            columns: [{ dataField: "field" }]
        });

        // assert
        assert.equal(handlerShow.called, 0);
        assert.equal(handlerHide.called, 0);

        // act
        this.changeOption("filterBuilderPopup", "filterBuilderPopup.visible", true);

        // assert
        assert.equal(handlerShow.called, 1);
        assert.equal(handlerHide.called, 0);

        this.changeOption("filterBuilderPopup", "filterBuilderPopup.visible", false);

        // assert
        assert.equal(handlerShow.called, 1);
        assert.equal(handlerHide.called, 1);
    });

    QUnit.test("initFilterBuilder", function(assert) {
        // arrange
        var handlerInit = sinon.spy();

        // act
        this.initFilterBuilderView({
            filterBuilderPopup: {},
            filterBuilder: {
                onInitialized: handlerInit
            },
            columns: [{ dataField: "field" }]
        });

        // assert
        assert.equal(handlerInit.called, 0);

        // act
        this.changeOption("filterBuilderPopup", "filterBuilderPopup.visible", true);

        // assert
        assert.equal(handlerInit.called, 1);
    });
});
