import $ from "jquery";
import summaryDisplayModes, { applyDisplaySummaryMode, applyRunningTotal, summaryDictionary } from "ui/pivot_grid/ui.pivot_grid.summary_display_modes"; // arguments: description, data
import pivotGridUtils from "ui/pivot_grid/ui.pivot_grid.utils";

var data = {
    columns: [{
        index: 1,
        value: "1",
        children: [{
            index: 2,
            value: "11"
        }, {
            index: 3,
            value: "12"
        }, {
            index: 4,
            value: "13"
        }]
    }, {
        index: 5,
        value: "2"
    }, {
        index: 6,
        value: "3",
        children: [{
            index: 7,
            value: "31"
        }, {
            index: 8,
            value: "32"
        }]
    }],

    rows: [{
        index: 1,
        value: 1991,
        children: [{
            index: 5,
            value: ""
        }]

    }, {
        index: 2,
        value: 1992,
        children: [
            {
                index: 3,
                value: ""
            },
            {
                index: 4,
                value: "1992-2"
            }
        ]
    }],
    values: [
        [['GT'], ['T1'], ['T2'], ['T3'], ['T4'], ['T5'], ['T6'], ['T7'], ['T8']],
        [['1T'], [1], [11], [12], [13], [2], [3], [31], [32]],
        [['2T'], [10], [110], [120], [130], [20], [30], [310], [320]],
        [['3T'], [100], [1100], [1200], [1300], [200], [300], [3100], [3200]],
        [['4T'], [1000], [11000], [12000], [13000], [2000], [3000], [31000], [32000]],
        [['5T'], [10000], [110000], [120000], [130000], [20000], [30000], [310000], [320000]]
    ],
    grandTotalColumnIndex: 0,
    grandTotalRowIndex: 0
};

QUnit.module("display Summary Type. CallBack arg", {
    beforeEach: function() {
        this.Cell = summaryDisplayModes.Cell;

        this.data = $.extend(true, {}, data);

        this.descriptions = {
            columns: [
                { dataField: "Field1", area: "column", index: 0 },
                { dataField: "Field2", area: "column", index: 1 }
            ],
            rows: [
                { dataField: "Field3", area: "row", index: 2 },
                { dataField: "Field4", area: "row", index: 3 }
            ],
            values: [{ area: "data", caption: "summaryField1", summaryDisplayMode: "summaryDisplayType", index: 4 }]
        };


        this.grandTotalRow = {
            index: 0,
            children: this.data.rows
        };

        this.grandTotalColumn = {
            index: 0,
            children: this.data.columns
        };


    },
    afterEach: function() {

    }
});

QUnit.test("Get cell value", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value(), "GT");
    assert.strictEqual(new this.Cell([this.data.columns[1]], [this.grandTotalRow], this.data, this.descriptions, 0).value(), "T5");
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).value(), "1T");
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.data.rows[0]], this.data, this.descriptions, 0).value(), 1);
    assert.strictEqual(new this.Cell([this.data.columns[1]], [this.data.rows[0]], this.data, this.descriptions, 0).value(), 2);
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1]], [this.data.rows[1]], this.data, this.descriptions, 0).value(), 120);
});

QUnit.test("Get header value by field", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value("Field1"), undefined);

    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value("Field1"), this.data.columns[1].value);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value("Field2"), undefined);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value("Field3"), undefined);

    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).value("Field1"), this.data.columns[0].value);
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).value("Field2"), this.data.columns[0].children[1].value);

    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).value("Field3"), this.data.rows[1].value);
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).value("Field4"), undefined);

    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value(this.descriptions.columns[0]), this.data.columns[1].value);

    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).value(this.descriptions.rows[0]), this.data.rows[1].value);
});

QUnit.test("Get header value by field index", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value(0), undefined);

    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value(0), this.data.columns[1].value);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value(1), undefined);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value(2), undefined);

    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).value(0), this.data.columns[0].value);
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).value(1), this.data.columns[0].children[1].value);

    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).value(2), this.data.rows[1].value);
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).value(3), undefined);
});

QUnit.test("Get column field", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).field("column"), null);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).field("column"), this.descriptions.columns[0]);
    assert.strictEqual(new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).field("column"), this.descriptions.columns[0]);
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).field("column"), this.descriptions.columns[1]);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).field(), this.descriptions.columns[0]);
});

QUnit.test("Get row field", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).field("row"), null);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).field("row"), null);
    assert.strictEqual(new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).field("row"), this.descriptions.rows[0]);
});

QUnit.test("Get data field", function(assert) {
    this.descriptions.values.push({ area: "data", caption: "summaryField2", summaryDisplayMode: "summaryDisplayType", index: 1 });

    var cell = new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 1);

    assert.strictEqual(cell.field("data"), this.descriptions.values[1]);
});

QUnit.test("Get cell value when there are several data fields", function(assert) {
    this.data.values[0][0] = [1, 2, 3];

    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value(), 1);
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 1).value(), 2);
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 2).value(), 3);
});

QUnit.test("Get cell value when there are several data fields get fieldValue by Fieldname", function(assert) {
    this.data.values[0][0] = [1, 2, 3, 5];
    this.descriptions.values.push(
        { area: "data", caption: "summaryField2", summaryDisplayMode: "summaryDisplayType", index: 1 },
        { area: "data", caption: "summaryField3", summaryDisplayMode: "summaryDisplayType", index: 2 },
        { caption: "summaryField5", summaryDisplayMode: "summaryDisplayType", index: 3 });

    var cell = new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0);

    assert.strictEqual(cell.value(), 1);
    assert.strictEqual(cell.value("summaryField1"), 1);
    assert.strictEqual(cell.value("summaryField2"), 2);
    assert.strictEqual(cell.value("summaryField3"), 3);
    assert.strictEqual(cell.value("summaryField4"), undefined);
    assert.strictEqual(cell.value("summaryField5"), 5);
});

QUnit.test("Get grandTotal value", function(assert) {
    assert.strictEqual(new this.Cell([{ index: 0 }], [{ index: 0 }], this.data, this.descriptions, 0).grandTotal().value(), "GT");
    assert.strictEqual(new this.Cell([this.data.columns[1], { index: 0 }], [{ index: 0 }], this.data, this.descriptions, 0).grandTotal().value(), "GT");
    assert.strictEqual(new this.Cell([{ index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal().value(), "GT");
    assert.strictEqual(new this.Cell([this.data.columns[0], { index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal().value(), "GT");
    assert.strictEqual(new this.Cell([this.data.columns[1], { index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal().value(), "GT");
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], { index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal().value(), "GT");
});

QUnit.test("Get row grandTotal value", function(assert) {
    assert.strictEqual(new this.Cell([{ index: 0 }], [{ index: 0 }], this.data, this.descriptions, 0).grandTotal("row").value(), "GT");
    assert.strictEqual(new this.Cell([this.data.columns[1], { index: 0 }], [{ index: 0 }], this.data, this.descriptions, 0).grandTotal("row").value(), "T5");
    assert.strictEqual(new this.Cell([{ index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal("row").value(), "GT");
    assert.strictEqual(new this.Cell([this.data.columns[0], { index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal("row").value(), "T1");
    assert.strictEqual(new this.Cell([this.data.columns[1], { index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal("row").value(), "T5");
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], { index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal("row").value(), "T3");
});

QUnit.test("Get column grandTotal value", function(assert) {
    assert.strictEqual(new this.Cell([{ index: 0 }], [{ index: 0 }], this.data, this.descriptions, 0).grandTotal("column").value(), "GT");
    assert.strictEqual(new this.Cell([this.data.columns[1], { index: 0 }], [{ index: 0 }], this.data, this.descriptions, 0).grandTotal("column").value(), "GT");
    assert.strictEqual(new this.Cell([{ index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal("column").value(), "1T");
    assert.strictEqual(new this.Cell([this.data.columns[0], { index: 0 }], [this.data.rows[0], { index: 0 }], this.data, this.descriptions, 0).grandTotal("column").value(), "1T");
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], { index: 0 }], [this.data.rows[1], { index: 0 }], this.data, this.descriptions, 0).grandTotal("column").value(), "2T");
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], { index: 0 }], [this.data.rows[1].children[1], this.data.rows[1], { index: 0 }], this.data, this.descriptions, 0).grandTotal("column").value(), "4T");
});

QUnit.test("Get prev column cell value", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).prev("column"), null);
    assert.strictEqual(new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).prev("column"), null);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).prev("column").value(), 1);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[1], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).prev("column").value(), 310);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).prev("column"), null);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).prev().value(), 1);
});

QUnit.test("Get prev column cell value with cross grouping", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).prev("column", true), null);
    assert.strictEqual(new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).prev("column", true), null);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).prev("column", true).value(), 1);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[1], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).prev("column", true).value(), 310);

    assert.strictEqual(new this.Cell([this.data.columns[2].children[0], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).prev("column", true).value(), 130);

    this.data.columns[0].children = null;
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).prev("column", true), null);
});

QUnit.test("Get next column cell value", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).next("column"), null);
    assert.strictEqual(new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).next("column").value(), 2);

    assert.strictEqual(new this.Cell([this.data.columns[2], this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).next("column"), null);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).next("column").value(), 320);

    assert.strictEqual(new this.Cell([this.data.columns[2].children[0], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).next().value(), 320);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).next("DS").value(), 320);

});

QUnit.test("Get next column cell value with cross grouping", function(assert) {
    assert.strictEqual(new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).next("column", true).value(), 2);
    assert.strictEqual(new this.Cell([this.data.columns[2], this.grandTotalColumn], [this.data.rows[0]], this.data, this.descriptions, 0).next("column", true), null);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).next("column", true).value(), 320);
    assert.strictEqual(new this.Cell([this.data.columns[0].children[2], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1]], this.data, this.descriptions, 0).next("column", true).value(), 310);
});

QUnit.test("Get parent column cell value", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).parent("column"), null);
    assert.strictEqual(new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).parent("column").value(), "1T");
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).parent("column").value(), 10);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[1], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).parent("column").value(), 30);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[1], this.data.columns[2], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).parent().value(), 30);
});

QUnit.test("Get parentRow cell value", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).parent("row").value(), "GT");
    assert.strictEqual(new this.Cell([this.data.columns[0].children[0], this.data.columns[0], this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).parent("row").value(), "T2");
    assert.strictEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1].children[1], this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).parent("row").value(), 120);
});

QUnit.test("Get prev row cell value", function(assert) {
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).prev("row"), null);
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).prev("row").value(), 1);

    assert.strictEqual(new this.Cell([this.data.columns[2].children[1]], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).prev("row").value(), 32);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0]], [this.data.rows[1].children[0], this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).prev("row"), null);
});

QUnit.test("Get prev row cell value with crossGrouping", function(assert) {
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).prev("row", true), null);
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).prev("row", true).value(), 1);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[1]], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).prev("row", true).value(), 32);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0]], [this.data.rows[1].children[0], this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).prev("row", true).value(), 310000);
});

QUnit.test("Get next row cell value", function(assert) {
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.grandTotalRow], this.data, this.descriptions, 0).next("row"), null);
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).next("row").value(), 10);
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).next("row"), null);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0]], [this.data.rows[1].children[0], this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).next("row").value(), 31000);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0]], [this.data.rows[0].children[0], this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).next("row"), null);
});

QUnit.test("Get next row cell value with crossGrouping", function(assert) {
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.grandTotalRow], this.data, this.descriptions, 0).next("row", true), null);
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).next("row", true).value(), 10);
    assert.strictEqual(new this.Cell([this.data.columns[0]], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).next("row", true), null);
    assert.strictEqual(new this.Cell([this.data.columns[2].children[0]], [this.data.rows[0].children[0], this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).next("row", true).value(), 3100);
});

QUnit.test("get cell", function(assert) {
    assert.deepEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).cell(), ["GT"]);
    assert.deepEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).cell(), ["T5"]);
    assert.deepEqual(new this.Cell([this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).cell(), ["1T"]);
    assert.deepEqual(new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).cell(), [1]);
    assert.deepEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).cell(), [2]);
    assert.deepEqual(new this.Cell([this.data.columns[0].children[1], this.data.columns[0], this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).cell(), [120]);
});

QUnit.test("get child rows", function(assert) {
    var childRows1 = new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).children("row"),
        childRows2 = new this.Cell([this.grandTotalColumn], [this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0).children("row");

    assert.strictEqual(childRows1.length, 2);
    assert.strictEqual(childRows1[0].value(), '1T');
    assert.strictEqual(childRows1[1].value(), '2T');

    assert.strictEqual(childRows2.length, 2);
    assert.strictEqual(childRows2[0].value(), '3T');
    assert.strictEqual(childRows2[1].value(), '4T');

});

QUnit.test("get child cell by FieldName", function(assert) {
    var cell = new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0);
    assert.strictEqual(cell.child("row", 1991).value(), "1T");
    assert.strictEqual(cell.child("row", 1991).child("column", "1").value(), 1);
    assert.strictEqual(cell.child("row", 1997), null);
});

QUnit.test("get child columns", function(assert) {
    var childRows1 = new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).children("column"),
        childRows2 = new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).children("column"),
        childRows3 = new this.Cell([this.data.columns[0], this.grandTotalColumn], [this.data.rows[0], this.grandTotalRow], this.data, this.descriptions, 0).children();

    assert.strictEqual(childRows1.length, 3);
    assert.strictEqual(childRows1[0].value(), 'T1');
    assert.strictEqual(childRows1[1].value(), 'T5');
    assert.strictEqual(childRows1[2].value(), 'T6');

    assert.strictEqual(childRows2.length, 3);
    assert.strictEqual(childRows2[0].value(), 11);
    assert.strictEqual(childRows2[1].value(), 12);
    assert.strictEqual(childRows2[2].value(), 13);

    assert.strictEqual(childRows3.length, 3);
    assert.strictEqual(childRows3[0].value(), 11);
    assert.strictEqual(childRows3[1].value(), 12);
    assert.strictEqual(childRows3[2].value(), 13);
});

QUnit.test("Slice", function(assert) {
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).slice("Field1", "1"), null);
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).slice("Field3", "11"), null);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).slice("Field1", "1").value(), "T1");
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).slice("Field1", "1asd"), null);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).slice("Field1", "2").value(), "T5");
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).slice("Field2", "11"), null);
    assert.strictEqual(new this.Cell([this.data.columns[1], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).slice("Unknown", "1"), null);
});

QUnit.test("Slice. Columns", function(assert) {
    this.data.columns[2].children[1].value = this.data.columns[0].children[1].value = "FixedSecondValue";

    var cell = new this.Cell([this.data.columns[2].children[1], this.data.columns[2], this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0);
    var sliceCell = cell.slice("Field1", "1");

    assert.strictEqual(sliceCell.value(), "T3");
    assert.strictEqual(sliceCell.parent("column").value(), "T1");
    assert.strictEqual(cell.slice("Field1", "2"), null);

    assert.strictEqual(cell.slice("Field2", "11"), null);
    assert.strictEqual(cell.slice("Field2", "31").value(), "T7");
});

QUnit.test("Slice. Rows", function(assert) {
    var cell = new this.Cell([this.grandTotalColumn], [this.data.rows[1].children[0], this.data.rows[1], this.grandTotalRow], this.data, this.descriptions, 0);
    var sliceCell = cell.slice("Field3", 1991);

    assert.strictEqual(sliceCell.value(), "5T");
    assert.strictEqual(sliceCell.parent("row").value(), "1T");
    assert.strictEqual(cell.slice("Field1", "2"), null);

    assert.strictEqual(cell.slice("Field4", "11"), null);
    assert.strictEqual(cell.slice("Field4", "1992-2").value(), "4T");

    assert.strictEqual(cell.slice("Field4", "").value(), cell.value());
});

QUnit.test("Cache original value", function(assert) {
    this.data.values[0][0] = ["GT1", "GT2"];
    this.descriptions.values.push({ area: "data", caption: "summaryField2", summaryDisplayMode: "summaryDisplayType" });

    // act
    new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0);
    this.data.values[0][0][0] = "new GT1";
    this.data.values[0][0][1] = "new GT2";
    // assert
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value(), "GT1");
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value(true), "new GT1");

    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value("summaryField2", true), "new GT2");
    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 0).value("summaryField2"), "GT2");

    assert.strictEqual(new this.Cell([this.grandTotalColumn], [this.grandTotalRow], this.data, this.descriptions, 1).value(), "GT2");
});


QUnit.module("summary display type calculation", {
    beforeEach: function() {
        this.data = $.extend(true, {}, data);

        this.descriptions = {
            columns: [
                { dataField: "Field1", area: "column" },
                { dataField: "Field2", area: "column" }
            ],
            rows: [
                { dataField: "Field3", area: "row" },
                { dataField: "Field4", area: "row" }
            ],
            values: [{ area: "data" }]
        };
    }
});

QUnit.test("Calculate cell value using expression", function(assert) {
    var summaryExpr = sinon.stub();
    summaryExpr.returns("calculatedValue");

    this.descriptions.values[0].calculateSummaryValue = summaryExpr;
    this.data.values[1][0] = null;
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert
    assert.strictEqual(summaryExpr.callCount, 54);

    var values = this.data.values;

    assert.deepEqual(values[0][0], ["calculatedValue"]);
    assert.deepEqual(values[1][0], ["calculatedValue"]);

    $.each(values, function(_, row) {
        $.each(row, function(_, cell) {
            if(cell) {
                assert.deepEqual(cell, ["calculatedValue"]);
            }
        });
    });
    assert.strictEqual(this.descriptions.values[0].format, undefined);
});

QUnit.test("Calculate cell value using expression and summaryDisplayType", function(assert) {
    var summaryExpr = sinon.stub();
    summaryExpr.returns("calculatedValue");

    this.descriptions.values[0].calculateSummaryValue = summaryExpr;
    this.descriptions.values[0].summaryDisplayMode = "absoluteVariation";
    this.data.values[1][0] = null;
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert
    assert.strictEqual(summaryExpr.callCount, 54);

    var values = this.data.values;

    assert.deepEqual(values[0][0], ["calculatedValue"]);
    assert.deepEqual(values[1][0], ["calculatedValue"]);

    $.each(values, function(_, row) {
        $.each(row, function(_, cell) {
            if(cell) {
                assert.deepEqual(cell, ["calculatedValue"]);
            }
        });
    });
    assert.strictEqual(this.descriptions.values[0].format, undefined);
});

QUnit.test("Calculate cell values with invalid expression", function(assert) {
    this.descriptions.values[0].calculateSummaryValue = "not a function";
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert
    var values = this.data.values;

    assert.deepEqual(values, data.values);
    assert.strictEqual(this.descriptions.values[0].format, undefined);
});

QUnit.test("Calculate display summary Type with preset", function(assert) {
    var summaryExpr = sinon.stub(summaryDictionary, "percentOfColumnTotal");
    summaryExpr.returns("calculatedValue");
    this.descriptions.values[0].summaryDisplayMode = "percentOfColumnTotal";
    this.data.values[1][0] = null;
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert
    assert.strictEqual(summaryExpr.callCount, 54);

    var values = this.data.values;

    assert.deepEqual(values[0][0], ["calculatedValue"]);
    assert.deepEqual(values[1][0], ["calculatedValue"]);

    $.each(values, function(_, row) {
        $.each(row, function(_, cell) {
            if(cell) {
                assert.deepEqual(cell, ["calculatedValue"]);
            }
        });
    });
    // teardown
    summaryExpr.restore();
});

QUnit.test("Calculate display summary Type with non exist summary type", function(assert) {
    this.descriptions.values[0].summaryDisplayMode = "non exist";
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert
    var values = this.data.values;

    assert.deepEqual(values, data.values);
    assert.strictEqual(this.descriptions.values[0].format, undefined);
});

QUnit.test("Add percent format for percent display type", function(assert) {

    var setFieldProperty = sinon.spy(pivotGridUtils, "setFieldProperty");

    this.descriptions.values = [
        { summaryDisplayMode: "percentOfColumnTotal" },
        { summaryDisplayMode: "percentOfRow", format: "numeric" }
    ];
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert
    assert.strictEqual(this.descriptions.values[0].format, "percent");
    assert.strictEqual(this.descriptions.values[1].format, "numeric");
    assert.ok(setFieldProperty.calledOnce);
    assert.deepEqual(setFieldProperty.lastCall.args, [this.descriptions.values[0], "format", "percent"]);

    setFieldProperty.reset();
});

QUnit.test("Second calculation leads to same results", function(assert) {
    var summaryExpr = function(e) {
        return e.value(true) + 1;
    };

    this.descriptions.values[0].calculateSummaryValue = summaryExpr;

    this.descriptions.values[0].runningTotal = true;

    applyDisplaySummaryMode(this.descriptions, this.data);
    var value = this.data.values[0][6][0];

    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert
    assert.deepEqual(value, "T61");
    assert.deepEqual(this.data.values[0][6][0], value);
});

QUnit.test("Check if value is calculated", function(assert) {
    let cell;
    let valueInCallback;
    var summaryExpr = function(e) {
        cell = e;
        valueInCallback = e.isCalculated();
        return e.value(true) + 1;
    };

    this.descriptions.values[0].calculateSummaryValue = summaryExpr;

    applyDisplaySummaryMode(this.descriptions, this.data);

    assert.strictEqual(valueInCallback, false);
    assert.strictEqual(cell.isCalculated(), true);
});

QUnit.test("Cell is calculated after runningTotal calculation", function(assert) {
    this.descriptions.values[0].runningTotal = true;
    applyRunningTotal(this.descriptions, this.data);

    assert.deepEqual(this.data.values[0][6].calculatedFlags, [true]);
});

QUnit.test("Calculate cell value with empty data", function(assert) {
    var summaryExpr = sinon.stub();
    summaryExpr.returns("calculatedValue");

    this.descriptions.values[0].calculateSummaryValue = summaryExpr;
    this.descriptions.values[0].summaryDisplayMode = "absoluteVariation";

    this.data.values = [];
    this.data.columns = [];
    this.data.rows = [];
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert
    assert.strictEqual(summaryExpr.callCount, 1);

    assert.deepEqual(this.data.values, [
        [
            [
                "calculatedValue"
            ]
        ]
    ]);
});

QUnit.test("applyDisplaySummaryMode without RunningTotal flag", function(assert) {
    this.descriptions.columns[0].runningTotal = true;

    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert
    var values = this.data.values;

    assert.deepEqual(values[0], [["GT"], ["T1"], ["T2"], ["T3"], ["T4"], ["T5"], ["T6"], ["T7"], ["T8"]]);
    assert.deepEqual(values[1], [["1T"], [1], [11], [12], [13], [2], [3], [31], [32]]);
});

QUnit.test("RunningTotal", function(assert) {
    this.descriptions.values[0].runningTotal = true;
    this.data.values[1][0] = null;

    this.data.values[1][8] = [null];
    // act
    applyRunningTotal(this.descriptions, this.data);
    // assert
    var values = this.data.values;

    assert.deepEqual(values[0], [["GT"], ["T1"], ["T2"], ["T2T3"], ["T2T3T4"], ["T1T5"], ["T1T5T6"], ["T7"], ["T7T8"]]);
    assert.deepEqual(values[1], [[undefined], [1], [11], [23], [36], [3], [6], [31], [31]]);
});

QUnit.test("Second RunningTotal calculation leads to same results", function(assert) {
    this.descriptions.values[0].runningTotal = true;

    applyRunningTotal(this.descriptions, this.data);
    var value = this.data.values[0][6][0];

    // act
    applyRunningTotal(this.descriptions, this.data);
    // assert
    assert.deepEqual(value, "T1T5T6");
    assert.deepEqual(this.data.values[0][6][0], value);
});

QUnit.test("RunningTotal with 2 fields", function(assert) {
    this.descriptions.values[0].runningTotal = true;
    this.descriptions.values.push({ area: "data", caption: "summaryField2", summaryDisplayMode: "summaryDisplayType" });
    this.data.values = [
        [['GT', 'GT1'], ['T1', 'T11'], ['T2', 'T22'], ['T3', "T33"], ['T4', 'T44'], ['T5', 'T55'], ['T6', 'T66'], ['T7', 'T77'], ['T8', 'T88']],
        [['1T', '1T1'], [1, 1], [11, 11], [12, 12], [13, 13], [2, 2], [3, 3], [31, 31], [32, 32]]
    ];

    // act
    applyRunningTotal(this.descriptions, this.data);
    // assert
    var values = this.data.values;

    assert.deepEqual(values[0], [["GT", "GT1"], ["T1", "T11"], ["T2", "T22"], ["T2T3", "T33"], ["T2T3T4", "T44"], ["T1T5", "T55"], ["T1T5T6", "T66"], ["T7", "T77"], ["T7T8", "T88"]]);
    assert.deepEqual(values[1], [['1T', '1T1'], [1, 1], [11, 11], [23, 12], [36, 13], [3, 2], [6, 3], [31, 31], [63, 32]]);
});

QUnit.test("RunningTotal by column", function(assert) {

    this.descriptions.values[0].runningTotal = "row";
    this.data.values[1][0] = null;

    this.data.values[1][8] = [null];
    // act
    applyRunningTotal(this.descriptions, this.data);
    // assert
    var values = this.data.values;

    assert.deepEqual(values[0], [["GT"], ["T1"], ["T2"], ["T2T3"], ["T2T3T4"], ["T1T5"], ["T1T5T6"], ["T7"], ["T7T8"]]);
    assert.deepEqual(values[1], [[undefined], [1], [11], [23], [36], [3], [6], [31], [31]]);
});

QUnit.test("RunningTotal by row", function(assert) {
    this.descriptions.values[0].runningTotal = "column";
    this.data.values[1][0] = null;

    this.data.values[1][8] = [null];
    // act
    applyRunningTotal(this.descriptions, this.data);
    // assert
    var values = this.data.values,
        firstColumn = $.map(values, function(row) { return row[0]; });

    assert.deepEqual(values[0], [["GT"], ["T1"], ["T2"], ["T3"], ["T4"], ["T5"], ["T6"], ["T7"], ["T8"]]);
    assert.deepEqual(firstColumn, ["GT", undefined, "2T", "3T", "3T4T", "5T"]);
});

QUnit.test("RunningTotal with grossGrouping", function(assert) {

    this.descriptions.values[0].allowCrossGroupCalculation = true;
    this.descriptions.values[0].runningTotal = true;
    this.data.values[1][0] = null;

    this.data.values[1][8] = [null];
    // act
    applyRunningTotal(this.descriptions, this.data);
    // assert
    var values = this.data.values;

    assert.deepEqual(values[0], [["GT"], ["T1"], ["T2"], ["T2T3"], ["T2T3T4"], ["T1T5"], ["T1T5T6"], ["T1T5T7"], ["T1T5T7T8"]]);
    assert.deepEqual(values[1], [[undefined], [1], [11], [23], [36], [3], [6], [34], [34]]);
});

QUnit.test("RunningTotal with expression", function(assert) {
    var summaryExpr = sinon.stub();
    summaryExpr.returns(1);

    this.descriptions.values[0].calculateSummaryValue = summaryExpr;

    this.descriptions.values[0].runningTotal = true;
    this.data.values[1][0] = null;

    this.data.values[1][8] = [null];
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    applyRunningTotal(this.descriptions, this.data);
    // assert
    var values = this.data.values;
    assert.deepEqual(values[0], [[1], [1], [1], [2], [3], [2], [3], [1], [2]]);
});

QUnit.test("RunningTotal with expression. Second calculation leads to same results", function(assert) {
    var summaryExpr = function(e) {
        return e.value(true) + 1;
    };

    this.descriptions.values[0].calculateSummaryValue = summaryExpr;

    this.descriptions.values[0].runningTotal = true;

    applyDisplaySummaryMode(this.descriptions, this.data);
    applyRunningTotal(this.descriptions, this.data);
    var value = this.data.values[0][6][0];

    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    applyRunningTotal(this.descriptions, this.data);
    // assert
    assert.deepEqual(value, "T11T51T61");
    assert.deepEqual(this.data.values[0][6][0], value);
});

QUnit.test("RunningTotal with expression and crossGrouping", function(assert) {
    var summaryExpr = sinon.stub();
    summaryExpr.returns(1);
    this.descriptions.values[0].allowCrossGroupCalculation = true;
    this.descriptions.values[0].calculateSummaryValue = summaryExpr;

    this.descriptions.values[0].runningTotal = true;
    this.data.values[1][0] = null;

    this.data.values[1][8] = [null];
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    applyRunningTotal(this.descriptions, this.data);
    // assert
    var values = this.data.values;

    assert.deepEqual(values[0], [[1], [1], [1], [2], [3], [2], [3], [3], [4]]);
});

QUnit.test("RunningTotal with summaryDisplayType", function(assert) {
    var summaryExpr = sinon.stub(summaryDictionary, "percentOfColumnTotal");
    summaryExpr.returns(1);
    this.descriptions.values[0].summaryDisplayMode = "percentOfColumnTotal";

    this.descriptions.values[0].runningTotal = true;
    this.data.values[1][0] = null;

    this.data.values[1][8] = [null];
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    applyRunningTotal(this.descriptions, this.data);
    // assert
    var values = this.data.values;

    assert.deepEqual(values[0], [[1], [1], [1], [2], [3], [2], [3], [1], [2]]);

    // teardown
    summaryExpr.restore();
});


QUnit.module("summary display mode presets", {
    beforeEach: function() {
        var Cell = summaryDisplayModes.Cell;

        this.stubCell = function() {
            var stub = sinon.createStubInstance(Cell);
            stub.value.returns(10);
            return stub;
        };

        this.getExpression = function(name, crossGrouping) {
            return summaryDisplayModes.getExpression({ summaryDisplayMode: name, allowCrossGroupCalculation: crossGrouping });
        };
    },

    afterEach: function() {

    }
});

QUnit.test("Absolute variation. Crossgrouping", function(assert) {
    var cell = this.stubCell(),
        prevCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("absoluteVariation", true);

    prevCell.value.returns(2);

    cell.prev.withArgs("column", true).returns(prevCell);
    var resultWithPrevCell = calculateSummaryCallback(cell);

    cell.prev.withArgs("column", true).returns(null);
    var resultWithoutPrevCell = calculateSummaryCallback(cell);

    cell.prev.withArgs("column", true).returns(prevCell);
    prevCell.value.returns(null);
    cell.value.returns(null);
    var resultWithNullValues = calculateSummaryCallback(cell);

    prevCell.value.returns(null);
    cell.value.returns(10);
    var resultWithPrevCellNullValue = calculateSummaryCallback(cell);

    prevCell.value.returns(2);
    cell.value.returns(null);
    var resultWithCellNullValue = calculateSummaryCallback(cell);

    prevCell.value.returns(2);
    cell.value.returns(2);
    var resultWithEqualValues = calculateSummaryCallback(cell);

    // assert
    assert.strictEqual(resultWithPrevCell, 8);
    assert.strictEqual(resultWithoutPrevCell, null);
    assert.strictEqual(resultWithNullValues, null);
    assert.strictEqual(resultWithPrevCellNullValue, null);
    assert.strictEqual(resultWithCellNullValue, null);

    assert.strictEqual(resultWithEqualValues, 0);

});

QUnit.test("Absolute variation", function(assert) {
    var cell = this.stubCell(),
        prevCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("absoluteVariation", false);

    prevCell.value.returns(2);

    cell.prev.withArgs("column", false).returns(prevCell);
    var resultWithPrevCell = calculateSummaryCallback(cell);

    cell.prev.withArgs("column", false).returns(null);
    var resultWithoutPrevCell = calculateSummaryCallback(cell);

    cell.prev.withArgs("column", false).returns(prevCell);
    prevCell.value.returns(null);
    cell.value.returns(null);
    var resultWithNullValues = calculateSummaryCallback(cell);

    prevCell.value.returns(null);
    cell.value.returns(10);
    var resultWithPrevCellNullValue = calculateSummaryCallback(cell);

    prevCell.value.returns(2);
    cell.value.returns(null);
    var resultWithCellNullValue = calculateSummaryCallback(cell);

    prevCell.value.returns(2);
    cell.value.returns(2);
    var resultWithEqualValues = calculateSummaryCallback(cell);

    // assert
    assert.strictEqual(resultWithPrevCell, 8);
    assert.strictEqual(resultWithoutPrevCell, null);
    assert.strictEqual(resultWithNullValues, null);
    assert.strictEqual(resultWithPrevCellNullValue, null);
    assert.strictEqual(resultWithCellNullValue, null);

    assert.strictEqual(resultWithEqualValues, 0);

});

QUnit.test("Percent variation. CrossGrouping", function(assert) {
    var cell = this.stubCell(),
        prevCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentVariation", true);

    prevCell.value.returns(2);

    cell.prev.withArgs("column", true).returns(prevCell);
    var resultWithPrevCell = calculateSummaryCallback(cell);

    cell.prev.withArgs("column", true).returns(null);
    var resultWithoutPrevCell = calculateSummaryCallback(cell);

    cell.prev.withArgs("column", true).returns(prevCell);
    prevCell.value.returns(null);
    cell.value.returns(null);
    var resultWithNullValues = calculateSummaryCallback(cell);

    prevCell.value.returns(null);
    cell.value.returns(10);
    var resultWithPrevCellNullValue = calculateSummaryCallback(cell);

    prevCell.value.returns(2);
    cell.value.returns(null);
    var resultWithCellNullValue = calculateSummaryCallback(cell);

    prevCell.value.returns(2);
    cell.value.returns(2);
    var resultWithEqualValues = calculateSummaryCallback(cell);

    prevCell.value.returns(0);
    var resultWithZeroPrevValue = calculateSummaryCallback(cell);

    // assert
    assert.strictEqual(resultWithPrevCell, 4);
    assert.strictEqual(resultWithoutPrevCell, null);
    assert.strictEqual(resultWithNullValues, null);
    assert.strictEqual(resultWithPrevCellNullValue, null);
    assert.strictEqual(resultWithCellNullValue, null);
    assert.strictEqual(resultWithEqualValues, 0);
    assert.strictEqual(resultWithZeroPrevValue, null);
});

QUnit.test("Percent variation.", function(assert) {
    var cell = this.stubCell(),
        prevCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentVariation", false);

    prevCell.value.returns(2);

    cell.prev.withArgs("column", false).returns(prevCell);
    var resultWithPrevCell = calculateSummaryCallback(cell);

    cell.prev.withArgs("column", false).returns(null);
    var resultWithoutPrevCell = calculateSummaryCallback(cell);

    cell.prev.withArgs("column", false).returns(prevCell);
    prevCell.value.returns(null);
    cell.value.returns(null);
    var resultWithNullValues = calculateSummaryCallback(cell);

    prevCell.value.returns(null);
    cell.value.returns(10);
    var resultWithPrevCellNullValue = calculateSummaryCallback(cell);

    prevCell.value.returns(2);
    cell.value.returns(null);
    var resultWithCellNullValue = calculateSummaryCallback(cell);

    prevCell.value.returns(2);
    cell.value.returns(2);
    var resultWithEqualValues = calculateSummaryCallback(cell);

    // assert
    assert.strictEqual(resultWithPrevCell, 4);
    assert.strictEqual(resultWithoutPrevCell, null);
    assert.strictEqual(resultWithNullValues, null);
    assert.strictEqual(resultWithPrevCellNullValue, null);
    assert.strictEqual(resultWithCellNullValue, null);
    assert.strictEqual(resultWithEqualValues, 0);
});

QUnit.test("Percent of row grand total", function(assert) {
    var cell = this.stubCell(),
        totalCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentOfRowGrandTotal");

    totalCell.value.returns(20);

    cell.grandTotal.withArgs("column").returns(totalCell);
    var resultWithTotalCell = calculateSummaryCallback(cell);

    cell.value.returns(null);
    var resultWithCellNullValue = calculateSummaryCallback(cell);

    totalCell.value.returns(2);
    cell.value.returns(2);
    var resultWithEqualValues = calculateSummaryCallback(cell);

    // assert
    assert.strictEqual(resultWithTotalCell, 0.5);
    assert.strictEqual(resultWithCellNullValue, null);
    assert.strictEqual(resultWithEqualValues, 1);
});

QUnit.test("Percent of column grand total", function(assert) {
    var cell = this.stubCell(),
        totalCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentOfColumnGrandTotal");

    totalCell.value.returns(20);

    cell.grandTotal.withArgs("row").returns(totalCell);
    var resultWithTotalCell = calculateSummaryCallback(cell);

    cell.value.returns(null);
    var resultWithCellNullValue = calculateSummaryCallback(cell);

    totalCell.value.returns(2);
    cell.value.returns(2);
    var resultWithEqualValues = calculateSummaryCallback(cell);

    // assert
    assert.strictEqual(resultWithTotalCell, 0.5);
    assert.strictEqual(resultWithCellNullValue, null);
    assert.strictEqual(resultWithEqualValues, 1);
});

QUnit.test("Percent of grandTotal", function(assert) {
    var cell = this.stubCell(),
        totalCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentOfGrandTotal");

    totalCell.value.returns(20);

    cell.grandTotal.withArgs().returns(totalCell);
    var resultWithTotalCell = calculateSummaryCallback(cell);

    cell.value.returns(null);
    var resultWithCellNullValue = calculateSummaryCallback(cell);

    totalCell.value.returns(2);
    cell.value.returns(2);
    var resultWithEqualValues = calculateSummaryCallback(cell);

    // assert
    assert.strictEqual(resultWithTotalCell, 0.5);
    assert.strictEqual(resultWithCellNullValue, null);
    assert.strictEqual(resultWithEqualValues, 1);
});

QUnit.test("Percent of row", function(assert) {
    var cell = this.stubCell(),
        parentCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentOfRowTotal");

    parentCell.value.returns(20);

    cell.parent.withArgs("column").returns(parentCell);
    var resultWithParentCell = calculateSummaryCallback(cell);

    cell.value.returns(null);
    var resultWithCellNullValue = calculateSummaryCallback(cell);

    parentCell.value.returns(2);
    cell.value.returns(2);
    var resultWithEqualValues = calculateSummaryCallback(cell);

    cell.parent.withArgs("column").returns(null);
    var resultWhenNoParent = calculateSummaryCallback(cell);// current cell is grandTotal by row

    // assert
    assert.strictEqual(resultWithParentCell, 0.5);
    assert.strictEqual(resultWithCellNullValue, null);
    assert.strictEqual(resultWithEqualValues, 1);
    assert.strictEqual(resultWhenNoParent, 1);
});

QUnit.test("Percent of Total row should be null when it's value is 0", function(assert) {
    var cell = this.stubCell(),
        parentCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentOfRowTotal");

    cell.parent.withArgs("column").returns(parentCell);

    cell.value.returns(0);
    parentCell.value.returns(0);

    var result = calculateSummaryCallback(cell);
    // assert
    assert.strictEqual(result, null);
});


QUnit.test("Percent of Total row should be null when it's value is undefined", function(assert) {
    var cell = this.stubCell(),
        parentCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentOfRowTotal");

    cell.parent.withArgs("column").returns(parentCell);

    cell.value.returns(0);
    parentCell.value.returns(undefined);

    var result = calculateSummaryCallback(cell);
    // assert
    assert.strictEqual(result, null);
});

QUnit.test("Percent of GrandTotal should be null when it's value is 0", function(assert) {
    var cell = this.stubCell(),
        parentCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentOfGrandTotal");

    cell.grandTotal.returns(parentCell);

    cell.value.returns(0);
    parentCell.value.returns(0);

    var result = calculateSummaryCallback(cell);
    // assert
    assert.strictEqual(result, null);
});


QUnit.test("Percent of GrandTotal should be null when it's value is null", function(assert) {
    var cell = this.stubCell(),
        parentCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentOfGrandTotal");

    cell.grandTotal.returns(parentCell);

    cell.value.returns(0);
    parentCell.value.returns(null);

    var result = calculateSummaryCallback(cell);
    // assert
    assert.strictEqual(result, null);
});

QUnit.test("Percent of column", function(assert) {
    var cell = this.stubCell(),
        parentCell = this.stubCell(),
        calculateSummaryCallback = this.getExpression("percentOfColumnTotal");

    parentCell.value.returns(20);

    cell.parent.withArgs("row").returns(parentCell);
    var resultWithParentCell = calculateSummaryCallback(cell);

    cell.value.returns(null);
    var resultWithCellNullValue = calculateSummaryCallback(cell);

    parentCell.value.returns(2);
    cell.value.returns(2);
    var resultWithEqualValues = calculateSummaryCallback(cell);

    cell.parent.withArgs("row").returns(null);
    var resultWhenNoParent = calculateSummaryCallback(cell);// current cell is grandTotal by column

    // assert
    assert.strictEqual(resultWithParentCell, 0.5);
    assert.strictEqual(resultWithCellNullValue, null);
    assert.strictEqual(resultWithEqualValues, 1);
    assert.strictEqual(resultWhenNoParent, 1);
});


QUnit.module("Check empty columns and rows", {
    beforeEach: function() {
        this.data = $.extend(true, {}, data);

        this.descriptions = {
            columns: [
                { dataField: "Field1", area: "column" },
                { dataField: "Field2", area: "column" }
            ],
            rows: [
                { dataField: "Field3", area: "row" },
                { dataField: "Field4", area: "row" }
            ],
            values: [{ area: "data" }]
        };
    }
});

QUnit.test("not empty data", function(assert) {
    this.descriptions.values[0].calculateSummaryValue = function() {
        return 0;
    };
    this.data.values[1][0] = null;
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        assert.deepEqual(items[0].isEmpty, [false]);
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        assert.deepEqual(items[0].isEmpty, [false]);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [false]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [false]);
});

QUnit.test("not empty data when no summary calculations", function(assert) {
    this.data.values[1][0] = null;
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        assert.deepEqual(items[0].isEmpty, [false]);
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        assert.deepEqual(items[0].isEmpty, [false]);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [false]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [false]);
});

QUnit.test("Empty data", function(assert) {
    this.descriptions.values[0].calculateSummaryValue = function() {
        return null;
    };
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        assert.deepEqual(items[0].isEmpty, [true]);
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        assert.deepEqual(items[0].isEmpty, [true]);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [true]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [true]);
});

QUnit.test("Empty GrandTotal row", function(assert) {
    this.descriptions.values[0].calculateSummaryValue = function(e) {
        if(!e.parent("row")) {
            return null;
        } else {
            return 0;
        }
    };
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        assert.deepEqual(items[0].isEmpty, [false]);
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        assert.deepEqual(items[0].isEmpty, [false]);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [true]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [false]);
});

QUnit.test("empty column", function(assert) {
    this.descriptions.values[0].calculateSummaryValue = function(e) {
        if(e.value("Field1") === "1" && e.children().length) {
            return null;
        } else {
            return 0;
        }
    };
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        assert.deepEqual(items[0].isEmpty, [false]);
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        var path = pivotGridUtils.createPath(items).join(".");
        if(path === "1") {
            assert.deepEqual(items[0].isEmpty, [true], path);
        } else {
            assert.deepEqual(items[0].isEmpty, [false], path);
        }
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [false]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [false]);
});

QUnit.test("empty row", function(assert) {
    this.descriptions.values[0].calculateSummaryValue = function(e) {
        if(e.value("Field3") === 1991) {
            return null;
        } else {
            return 0;
        }
    };
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        var path = pivotGridUtils.createPath(items);

        if(path[0] === 1991) {
            assert.deepEqual(items[0].isEmpty, [true], path.join("."));
        } else {
            assert.deepEqual(items[0].isEmpty, [false], path.join("."));
        }
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        var path = pivotGridUtils.createPath(items).join(".");
        assert.deepEqual(items[0].isEmpty, [false], path);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [false]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [false]);
});

QUnit.test("summary display mode is wrong", function(assert) {
    this.descriptions.values[0].summaryDisplayMode = "incorrect";
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        var path = pivotGridUtils.createPath(items);
        assert.deepEqual(items[0].isEmpty, [false], path.join("."));
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        var path = pivotGridUtils.createPath(items).join(".");
        assert.deepEqual(items[0].isEmpty, [false], path);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [false]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [false]);
});

QUnit.test("createMockSummaryCell with custom calculateSummaryValue", function(assert) {
    var fields = [
            { dataField: "Field1", area: "column" },
            { dataField: "Field2", area: "row" },
            { dataField: "Field3", area: "data" },
            { dataField: "Field4", area: "data", visible: false }
        ],
        descriptions = {
            columns: [ fields[0] ],
            rows: [ fields[1] ],
            values: [ fields[2], fields[3] ]
        },
        summaryCell = summaryDisplayModes.createMockSummaryCell(descriptions, fields, {});

    // assert
    assert.equal(summaryCell.child("row"), null);
    assert.equal(summaryCell.child("column", 1), null);

    assert.equal(summaryCell.children("row").length, 0);
    assert.equal(summaryCell.children("column").length, 0);

    assert.equal(summaryCell.field("row"), null);
    assert.equal(summaryCell.field("column"), null);

    assert.deepEqual(summaryCell.grandTotal(), summaryCell);
    assert.deepEqual(summaryCell.grandTotal("row"), summaryCell);
    assert.deepEqual(summaryCell.grandTotal("column"), summaryCell);

    assert.deepEqual(summaryCell.next("row"), null);
    assert.deepEqual(summaryCell.next("column", true), null);

    assert.deepEqual(summaryCell.prev("column"), null);
    assert.deepEqual(summaryCell.prev("row", true), null);

    assert.equal(summaryCell.parent("row"), null);
    assert.equal(summaryCell.parent("column"), null);

    assert.equal(summaryCell.slice("Field4"), null);

    assert.equal(summaryCell.value(), null);
    assert.equal(summaryCell.value("Field1"), null);
    assert.equal(summaryCell.value("Field1", true), null);
    assert.equal(summaryCell.value(true), null);
});


var dataWithTwoValues = $.extend(true, {}, data);

$.each(dataWithTwoValues.values, function(_, row) {
    $.each(row, function(_, cell) {
        cell.push("2:" + cell[0]);
    });
});

QUnit.module("Check empty columns and rows with several dataFields", {
    beforeEach: function() {
        this.data = $.extend(true, {}, dataWithTwoValues);

        this.descriptions = {
            columns: [
                { dataField: "Field1", area: "column" },
                { dataField: "Field2", area: "column" }
            ],
            rows: [
                { dataField: "Field3", area: "row" },
                { dataField: "Field4", area: "row" }
            ],
            values: [{ area: "data" }, { area: "data" }]
        };
    }
});

QUnit.test("not empty data", function(assert) {
    this.descriptions.values[0].calculateSummaryValue = function() {
        return 0;
    };

    this.descriptions.values[1].calculateSummaryValue = function() {
        return 0;
    };

    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        assert.deepEqual(items[0].isEmpty, [false, false]);
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        assert.deepEqual(items[0].isEmpty, [false, false]);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [false, false]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [false, false]);
});

QUnit.test("Empty cell for first field cells", function(assert) {
    this.descriptions.values[0].calculateSummaryValue = function() {
        return null;
    };
    this.descriptions.values[1].calculateSummaryValue = function(e) {
        return e.value();
    };
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        var path = pivotGridUtils.createPath(items);
        assert.deepEqual(items[0].isEmpty, [true, false], path.join("."));
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        var path = pivotGridUtils.createPath(items).join(".");
        assert.deepEqual(items[0].isEmpty, [true, false], path);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [true, false]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [true, false]);
});

QUnit.test("Empty cell for first field cells if second field without calculate summary value", function(assert) {
    this.descriptions.values[0].calculateSummaryValue = function() {
        return null;
    };
    this.descriptions.values[1].calculateSummaryValue = null;
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        var path = pivotGridUtils.createPath(items);
        assert.deepEqual(items[0].isEmpty, [true, false], path.join("."));
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        var path = pivotGridUtils.createPath(items).join(".");
        assert.deepEqual(items[0].isEmpty, [true, false], path);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [true, false]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [true, false]);
});

QUnit.test("summary display mode is wrong in first data field", function(assert) {
    this.descriptions.values[0].summaryDisplayMode = "incorrect";
    this.descriptions.values[1].calculateSummaryValue = function(e) {
        return e.value();
    };
    // act
    applyDisplaySummaryMode(this.descriptions, this.data);
    // assert

    pivotGridUtils.foreachTree(this.data.rows, function(items) {
        var path = pivotGridUtils.createPath(items);
        assert.deepEqual(items[0].isEmpty, [false, false], path.join("."));
    });

    pivotGridUtils.foreachTree(this.data.columns, function(items) {
        var path = pivotGridUtils.createPath(items).join(".");
        assert.deepEqual(items[0].isEmpty, [false, false], path);
    });

    assert.deepEqual(this.data.isEmptyGrandTotalRow, [false, false]);
    assert.deepEqual(this.data.isEmptyGrandTotalColumn, [false, false]);
});
