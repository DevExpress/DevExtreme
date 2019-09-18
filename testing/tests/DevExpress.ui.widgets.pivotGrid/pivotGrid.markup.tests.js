import "ui/pivot_grid/ui.pivot_grid";

QUnit.module("PivotGrid markup tests");

QUnit.testStart(function() {
    var markup = "<div id='pivotGrid' />";
    $("#qunit-fixture").html(markup);
});

import $ from "jquery";
import windowUtils from "core/utils/window";

var createPivotGrid = function(options, assert) {
    var pivotGridElement = $("#pivotGrid").dxPivotGrid(options);
    // assert
    assert.ok(pivotGridElement);
    return pivotGridElement.dxPivotGrid('instance');
};

QUnit.test("Init markup with sizes", function(assert) {
    // arrange
    var pivotGrid = createPivotGrid({ width: "600", height: "800" }, assert);

    // assert
    assert.ok(pivotGrid.$element().hasClass("dx-pivotgrid"), "has dx-pivotgrid class");
    assert.equal(pivotGrid.$element().children().length > 0, windowUtils.hasWindow(), "empty rectangle");
    assert.equal(pivotGrid.$element().attr("style"), "width: 600px; height: 800px;", "has size attributes");
});

QUnit.test("Render empty data", function(assert) {
    // arrange
    var pivotGrid = createPivotGrid({
        width: "600",
        height: "800",
        dataSource: {
            fields: [{
                dataField: "region",
                area: "row"
            }, {
                dataField: "date",
                dataType: "date",
                area: "column"
            }, {
                dataField: "amount",
                area: "data"
            }]
        }
    }, assert);

    // assert
    assert.ok(pivotGrid.$element().hasClass("dx-pivotgrid"), "has dx-pivotgrid class");
    assert.equal(pivotGrid.$element().children().length > 0, windowUtils.hasWindow(), "empty rectangle");
});

QUnit.test("Render with data", function(assert) {
    // arrange
    var clock = sinon.useFakeTimers(),
        pivotGrid = createPivotGrid({
            width: "600",
            height: "800",
            dataSource: {
                fields: [{
                    dataField: "region",
                    area: "row"
                }, {
                    dataField: "date",
                    dataType: "date",
                    area: "column"
                }, {
                    dataField: "amount",
                    area: "data"
                }],
                store: [{
                    "region": "North America",
                    "date": "2013/01/06",
                    "amount": 1740
                }]
            }
        }, assert);

    clock.tick();

    // assert
    assert.ok(pivotGrid.$element().hasClass("dx-pivotgrid"), "has dx-pivotgrid class");
    assert.equal(pivotGrid.$element().children().length > 0, windowUtils.hasWindow(), "empty rectangle");

    clock.restore();
});
