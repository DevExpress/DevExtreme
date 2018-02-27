"use strict";

require("ui/data_grid/ui.data_grid");

var dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules;

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
