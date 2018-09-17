QUnit.testStart(function() {
    var markup =
'<div>\
    <div id="container" class="dx-datagrid"></div>\
</div>';

    $("#qunit-fixture").html(markup);
});

require("common.css!");

require("ui/data_grid/ui.data_grid");
require("data/odata/store");

var $ = require("jquery"),
    dataGridMocks = require("../../helpers/dataGridMocks.js"),
    setupDataGridModules = dataGridMocks.setupDataGridModules;

var teardownModule = function() {
    this.dispose();
    this.clock.restore();
};

QUnit.module("Focus", {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            options = options || { };
            options.initViews = true,
            options.dataSource = options.dataSource || this.data;
            setupDataGridModules(this, ['data', 'gridView', 'columns', 'selection', 'stateStoring', 'grouping', 'filterRow', 'focus'], { initDefaultOptions: true, options: options });
        };

        this.data = [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 16 },
            { name: 'Vadim', age: 17 },
            { name: 'Dmitry', age: 18 },
            { name: 'Sergey', age: 18 },
            { name: 'Kate', age: 20 },
            { name: 'Dan', age: 21 }
        ];

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();

        teardownModule.apply(this);
    }
});

QUnit.test("Focused row initial state", function(assert) {
    // act
    this.setupDataGrid();

    this.clock.tick();

    // assert
    assert.equal(this.option("focusedRowEnabled"), undefined, "Focused row is enabled");
    assert.equal(this.option("focusedRowIndex"), undefined, "FocusedRowIndex is undefined");
    assert.equal(this.option("focusedColumnIndex"), undefined, "FocusedColumnIndex is undefined");
});

QUnit.test("Set focusedRow options", function(assert) {
    // act
    this.setupDataGrid({
        keyExpr: "name",
        focusedRowIndex: 2,
        focusedColumnIndex: 3
    });

    this.clock.tick();

    // assert
    assert.equal(this.option("focusedRowEnabled"), true, "Focused row is enabled");
    assert.equal(this.option("focusedRowIndex"), 2, "FocusedRowIndex is 2");
    assert.equal(this.option("focusedColumnIndex"), 3, "focusedColumnIndex is 2");
});
