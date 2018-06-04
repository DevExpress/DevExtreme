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
            this.options = $.extend({
                filterBuilderPopup: {},
                columns: [{ dataField: "field" }],
                filterBuilder: { }
            }, options);
            setupDataGridModules(this, ["columns", "headerFilter", "filterSync", "filterBuilder", "data"], {
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
            }
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
            filterBuilder: {
                onInitialized: handlerInit
            }
        });

        // assert
        assert.equal(handlerInit.called, 0);

        // act
        this.changeOption("filterBuilderPopup", "filterBuilderPopup.visible", true);

        // assert
        assert.equal(handlerInit.called, 1);
    });

    QUnit.test("filter builder popup has scrollview after the second showing", function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            filterBuilderPopup: { visible: true },
        });

        this.changeOption("filterBuilderPopup", "filterBuilderPopup.visible", false);
        this.changeOption("filterBuilderPopup", "filterBuilderPopup.visible", true);

        // assert
        assert.ok($(".dx-popup-content .dx-scrollview-content").length);
    });

    // T637302
    QUnit.test("operation of the number datatype can be used in the string datatype if it contains in the array of filterOperations", function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ dataField: "field", filterOperations: [">"] }],
            filterValue: ["field", ">", "a"],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.ok($(".dx-popup-content .dx-filterbuilder-item-operation").length, 1);
    });

    QUnit.test("the 'any of' operation should throw an exception if filterOperations does not contain it", function(assert) {
        var that = this;
        assert.throws(function() {
            that.initFilterBuilderView({
                headerFilter: { visible: true },
                filterSyncEnabled: true,
                columns: [{ dataField: "field", dataType: "string", filterOperations: [">"], allowFiltering: true }],
                filterValue: ["field", "anyof", ["a"]],
                filterBuilderPopup: { visible: true },
            });
        }, function(e) {
            return e.message === `E1048 - The "anyof" operation is not found in the filterOperations array. See:\nhttp://js.devexpress.com/error/18_1/E1048`;
        });
    });

    QUnit.test("the 'any of' operation is available in filterBuilderPopup if filterOperations contains it", function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ dataField: "field", filterOperations: [">", "anyof"] }],
            filterValue: ["field", "anyof", ["a"]],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.ok($(".dx-popup-content .dx-filterbuilder-item-operation").length, 1);
    });


    QUnit.test("the 'any of' operation is available in filterBuilderPopup if filterOperations are not set", function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ dataField: "field" }],
            filterValue: ["field", "anyof", ["a"]],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.ok($(".dx-popup-content .dx-filterbuilder-item-operation").length, 1);
    });

    // T640912
    QUnit.test("the customOperation is available in built-in filterBuilder using dataTypes array", function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ dataField: "field" }],
            filterValue: ["field", "weekends"],
            filterBuilderPopup: { visible: true },
            filterBuilder: {
                customOperations: [{
                    name: "weekends",
                    caption: "Weekends",
                    dataTypes: ["string"],
                    hasValue: false
                }]
            }
        });

        // assert
        assert.ok($(".dx-popup-content .dx-filterbuilder-item-operation").text(), "Weekends");
    });

    // T639390
    QUnit.test("init filterbuilder in datagrid with banded columns", function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{
                caption: "Banded column",
                columns: [{
                    caption: "Banded column item",
                    dataField: "field",
                    filterOperations: ["="]
                }]
            }, {
                caption: "Banded column 2",
                columns: [{
                    caption: "Inner banded column",
                    columns: [{
                        caption: "Banded column item 2",
                        dataField: "field2",
                        filterOperations: ["="]
                    }]
                }]
            }],
            filterValue: [["field", "=", "a"], "and", ["field2", "=", "b"]],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.ok($(".dx-popup-content .dx-filterbuilder-item-operation").length, 1);
    });
});
