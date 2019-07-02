var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    commonUtils = require("core/utils/common"),
    seriesModule = require("viz/series/base_series"),
    dataValidatorModule = require("viz/components/data_validator"),
    chartMocks = require("../../helpers/chartMocks.js"),
    MockAxis = chartMocks.MockAxis;

function checkTypes(assert, data, groupsData, argumentAxisType, argumentType, valueAxisType, valueType, callCount, options) {
    testValidateData(data, groupsData, null, options);

    assert.strictEqual(groupsData.groups[0].series[0].updateDataType.lastCall.args[0].argumentAxisType, argumentAxisType, "ArgumentAxis Type of series");
    assert.strictEqual(groupsData.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, argumentType, "ArgumentAxis DataType of series");
    assert.strictEqual(groupsData.groups[0].series[0].updateDataType.lastCall.args[0].valueAxisType, valueAxisType, "ValueAxis Type of series");
    assert.strictEqual(groupsData.groups[0].series[0].updateDataType.lastCall.args[0].valueType, valueType, "ValueAxis DataType of series");

    assert.strictEqual(groupsData.argumentAxisType, argumentAxisType, "ArgumentAxis Type of groups");
    assert.strictEqual(groupsData.argumentType, argumentType, "ArgumentAxis DataType of groups");
    assert.strictEqual(groupsData.groups[0].valueAxisType, valueAxisType, "ValueAxis Type of groups");
    assert.strictEqual(groupsData.groups[0].valueType, valueType, "ValueAxis DataType of groups");

    assert.strictEqual(groupsData.argumentAxes[0]._options.type, argumentAxisType);
    assert.strictEqual(groupsData.argumentAxes[0]._options.argumentType, argumentType);
    assert.strictEqual(groupsData.argumentAxes[0].validated, true);

    assert.strictEqual(groupsData.groups[0].valueAxis._options.type, valueAxisType);
    assert.strictEqual(groupsData.groups[0].valueAxis._options.valueType, valueType);
    assert.strictEqual(groupsData.groups[0].valueAxis.validated, true);

    callCount = callCount || 1;
    assert.strictEqual(groupsData.argumentAxes[0].resetTypes.callCount, callCount);
    assert.strictEqual(groupsData.argumentAxes[0].resetTypes.args[0][0], "argumentType");
    assert.strictEqual(groupsData.groups[0].valueAxis.resetTypes.callCount, callCount);
    assert.strictEqual(groupsData.groups[0].valueAxis.resetTypes.args[0][0], "valueType");
}

QUnit.module("Validate data");

QUnit.test("Numbers", function(assert) {
    checkTypes(assert, [{ arg: 11, val: 1 }, { arg: 22, val: 2 }, { arg: 33, val: 3 }], createGroupsData(),
        "continuous", "numeric", "continuous", "numeric");
});

QUnit.test("DateTime", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date4000 = new Date(4000),
        date5000 = new Date(5000),
        date6000 = new Date(6000);

    checkTypes(assert, [{ arg: date1000, val: date4000 }, { arg: date2000, val: date5000 }, { arg: date3000, val: date6000 }], createGroupsData(),
        "continuous", "datetime", "continuous", "datetime");
});

QUnit.test("String", function(assert) {
    checkTypes(assert, [{ arg: "1000", val: "1" }, { arg: "2000", val: "2" }, { arg: "3000", val: "3" }], createGroupsData(),
        "discrete", "string", "discrete", "string");
});

QUnit.test("String & Numeric", function(assert) {
    checkTypes(assert, [{ arg: 1000, val: "1" }, { arg: 2000, val: "2" }, { arg: 3000, val: "3" }], createGroupsData(),
        "continuous", "numeric", "discrete", "string");
});

QUnit.test("Numbers. Categories.", function(assert) {
    checkTypes(assert, [{ arg: 11, val: 1 }, { arg: 22, val: 2 }, { arg: 33, val: 3 }, { arg: 44, val: 4 }, { arg: 55, val: 5 }],
        createGroupsData({
            argumentCategories: [11, 22, 33, 44, 55],
            valueCategories: [1, 2, 3, 4, 5]
        }),
        "discrete", "numeric", "discrete", "numeric");
});

QUnit.test("Check Types with empty group", function(assert) {
    var groupsData = createGroupsData();
    groupsData.groups[1] = $.extend({}, groupsData.groups[0]);

    groupsData.groups[0].series = [];
    testValidateData([{ arg: "1000", val: "1" }, { arg: "2000", val: "2" }, { arg: "3000", val: "3" }], groupsData, null, null);
    assert.strictEqual(groupsData.argumentAxisType, "discrete");
});

QUnit.test("DateTime. Categories.", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date4000 = new Date(4000),
        date5000 = new Date(5000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001),
        date40001 = new Date(40001),
        date50001 = new Date(50001);

    checkTypes(assert, [{ arg: date1000, val: date10001 }, { arg: date2000, val: date20001 }, { arg: date3000, val: date30001 }, { arg: date4000, val: date40001 }, { arg: date5000, val: date50001 }],
        createGroupsData({
            argumentCategories: [new Date(1000), new Date(2000), new Date(3000), new Date(4000), new Date(5000)],
            valueCategories: [new Date(10001), new Date(20001), new Date(30001), new Date(40001), new Date(50001)]
        }),
        "discrete", "datetime", "discrete", "datetime");
});

QUnit.test("String. Categories.", function(assert) {
    checkTypes(assert, [{ arg: "1000", val: "1" }, { arg: "2000", val: "2" }, { arg: "3000", val: "3" }, { arg: "4000", val: "4" }, { arg: "5000", val: "5" }],
        createGroupsData({
            argumentCategories: ["1000", "2000", "3000", "4000", "5000"],
            valueCategories: ["1", "2", "3", "4", "5"]
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("Custom field name. Numbers.", function(assert) {
    checkTypes(assert, [{ arg1: 11, val1: 1 }, { arg1: 22, val1: 2 }, { arg1: 33, val1: 3 }],
        createGroupsData({
            argumentField: "arg1",
            valueFields: ["val1"]
        }),
        "continuous", "numeric", "continuous", "numeric");
});

QUnit.test("Custom field name. DateTime.", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001);

    checkTypes(assert, [{ arg1: date1000, val1: date10001 }, { arg1: date2000, val1: date20001 }, { arg1: date3000, val1: date30001 }],
        createGroupsData({
            argumentField: "arg1",
            valueFields: ["val1"]
        }),
        "continuous", "datetime", "continuous", "datetime");
});

QUnit.test("Custom field name. String.", function(assert) {
    checkTypes(assert, [{ arg1: "1000", val1: "1" }, { arg1: "2000", val1: "2" }, { arg1: "3000", val1: "3" }],
        createGroupsData({
            argumentField: "arg1",
            valueFields: ["val1"]
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("Custom field name. Numbers. Categories.", function(assert) {
    checkTypes(assert, [{ arg1: 11, val1: 1 }, { arg1: 22, val1: 2 }, { arg1: 33, val1: 3 }, { arg1: 44, val1: 4 }, { arg1: 55, val1: 5 }],
        createGroupsData({
            argumentField: "arg1",
            argumentCategories: [11, 22, 33, 44, 55],
            valueFields: ["val1"],
            valueCategories: [1, 2, 3, 4, 5]
        }),
        "discrete", "numeric", "discrete", "numeric");
});

QUnit.test("Custom field name. DateTime. Categories.", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date4000 = new Date(4000),
        date5000 = new Date(5000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001),
        date40001 = new Date(40001),
        date50001 = new Date(50001);

    checkTypes(assert, [{ arg1: date1000, val1: date10001 }, { arg1: date2000, val1: date20001 }, { arg1: date3000, val1: date30001 }, { arg1: date4000, val1: date40001 }, { arg1: date5000, val1: date50001 }],
        createGroupsData({
            argumentField: "arg1",
            argumentCategories: [new Date(1000), new Date(2000), new Date(3000), new Date(4000), new Date(5000)],
            valueFields: ["val1"],
            valueCategories: [new Date(10001), new Date(20001), new Date(30001), new Date(40001), new Date(50001)]
        }),
        "discrete", "datetime", "discrete", "datetime");
});

QUnit.test("Custom field name. String. Categories.", function(assert) {
    checkTypes(assert, [{ arg1: "1000", val1: "1" }, { arg1: "2000", val1: "2" }, { arg1: "3000", val1: "3" }, { arg1: "4000", val1: "4" }, { arg1: "5000", val1: "5" }],
        createGroupsData({
            argumentField: "arg1",
            argumentCategories: ["1000", "2000", "3000", "4000", "5000"],
            valueFields: ["val1"],
            valueCategories: ["1", "2", "3", "4", "5"]
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("First null value", function(assert) {
    checkTypes(assert, [{ arg: null, val: null }, { arg: null, val: 2 }, { arg: 33, val: 3 }], createGroupsData(),
        "continuous", "numeric", "continuous", "numeric");
});

QUnit.test("Revalidate. From numbers to Datetime and Strings", function(assert) {
    var group = createGroupsData(),
        date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000);

    testValidateData([{ arg: 11, val: 1 }, { arg: 22, val: 2 }, { arg: 33, val: 3 }], group);

    checkTypes(assert, [{ arg: date1000, val: "1000" }, { arg: date2000, val: "2000" }, { arg: date3000, val: "3000" }], group,
        "continuous", "datetime", "discrete", "string", 2);
});

QUnit.test("Empty data", function(assert) {
    var groupsData = createGroupsData({
        argumentCategories: ["1000", "2000", "3000", "4000", "5000"],
        valueCategories: ["1", "2", "3", "4", "5"]
    }, true);
    testValidateData([], groupsData);

    assert.strictEqual(groupsData.argumentAxisType, "discrete", "ArgumentAxis Type of groups");
    assert.strictEqual(groupsData.argumentType, null, "ArgumentAxis DataType of groups");
    assert.strictEqual(groupsData.groups[0].valueAxisType, "discrete", "ValueAxis Type of groups");
    assert.strictEqual(groupsData.groups[0].valueType, null, "ValueAxis DataType of groups");

    assert.strictEqual(groupsData.argumentAxes[0]._options.type, "discrete");
    assert.strictEqual(groupsData.argumentAxes[0]._options.argumentType, undefined);
    assert.strictEqual(groupsData.argumentAxes[0].validated, true);

    assert.strictEqual(groupsData.groups[0].valueAxis._options.type, "discrete");
    assert.strictEqual(groupsData.groups[0].valueAxis._options.valueType, undefined);
    assert.strictEqual(groupsData.groups[0].valueAxis.validated, true);
});

// T416212, T416840
QUnit.test("types for many groups", function(assert) {
    var groupData1 = createGroupsData({ argumentField: "arg", valueFields: ["dailyFeelingGood"] }),
        groupData2 = createGroupsData({ argumentField: "arg", valueFields: ["dailyFeelingPoor"] }),
        groupData3 = createGroupsData({ argumentField: "arg", valueFields: ["dailyFeelingBad"] }),
        groupsData = {};

    groupsData.groups = groupData1.groups.concat(groupData2.groups, groupData3.groups);

    groupsData.argumentOptions = groupData1.argumentOptions;

    testValidateData([{
        "arg": "1",
        "dailyFeelingGood": "Good",
        "dailyFeelingPoor": null,
        "dailyFeelingBad": null
    }, {
        "arg": "3",
        "dailyFeelingGood": null,
        "dailyFeelingPoor": null,
        "dailyFeelingBad": "Bad"
    }, {
        "arg": "5",
        "dailyFeelingGood": null,
        "dailyFeelingPoor": "Poor",
        "dailyFeelingBad": null
    }], groupsData);

    assert.strictEqual(groupsData.groups[0].valueType, "string");
    assert.strictEqual(groupsData.groups[1].valueType, "string");
    assert.strictEqual(groupsData.groups[2].valueType, "string");
});

QUnit.module("Custom mode");

QUnit.test("Numbers (auto). Discrete axis", function(assert) {
    checkTypes(assert, [{ arg: 11, val: 1 }, { arg: 22, val: 2 }, { arg: 33, val: 3 }],
        createGroupsData({
            argumentAxisType: "discrete",
            valueAxisType: "discrete"
        }),
        "discrete", "numeric", "discrete", "numeric");
});

QUnit.test("DateTime (auto). Discrete axis", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001);

    checkTypes(assert, [{ arg: date1000, val: date10001 }, { arg: date2000, val: date20001 }, { arg: date3000, val: date30001 }],
        createGroupsData({
            argumentAxisType: "discrete",
            valueAxisType: "discrete"
        }),
        "discrete", "datetime", "discrete", "datetime");
});

QUnit.test("String (auto). Discrete axis", function(assert) {
    checkTypes(assert, [{ arg: "1000", val: "1" }, { arg: "2000", val: "2" }, { arg: "3000", val: "3" }],
        createGroupsData({
            argumentAxisType: "discrete",
            valueAxisType: "discrete"
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("Numbers (auto). Continuous axis", function(assert) {
    checkTypes(assert, [{ arg: 11, val: 1 }, { arg: 22, val: 2 }, { arg: 33, val: 3 }],
        createGroupsData({
            argumentAxisType: "continuous",
            valueAxisType: "continuous"
        }),
        "continuous", "numeric", "continuous", "numeric");
});

QUnit.test("DateTime (auto). Continuous axis", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001);

    checkTypes(assert, [{ arg: date1000, val: date10001 }, { arg: date2000, val: date20001 }, { arg: date3000, val: date30001 }],
        createGroupsData({
            argumentAxisType: "continuous",
            valueAxisType: "continuous"
        }),
        "continuous", "datetime", "continuous", "datetime");
});

QUnit.test("String (auto). Continuous axis", function(assert) {
    checkTypes(assert, [{ arg: "1000", val: "1" }, { arg: "2000", val: "2" }, { arg: "3000", val: "3" }],
        createGroupsData({
            argumentAxisType: "continuous",
            valueAxisType: "continuous"
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("Numbers (auto). Semidiscrete axis", function(assert) {
    checkTypes(assert, [{ arg: 11, val: 1 }, { arg: 22, val: 2 }, { arg: 33, val: 3 }],
        createGroupsData({
            argumentAxisType: "semidiscrete",
            valueAxisType: "semidiscrete"
        }),
        "semidiscrete", "numeric", "semidiscrete", "numeric");
});

QUnit.test("DateTime (auto). Semidiscrete axis", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001);

    checkTypes(assert, [{ arg: date1000, val: date10001 }, { arg: date2000, val: date20001 }, { arg: date3000, val: date30001 }],
        createGroupsData({
            argumentAxisType: "semidiscrete",
            valueAxisType: "semidiscrete"
        }),
        "semidiscrete", "datetime", "semidiscrete", "datetime");
});

QUnit.test("String (auto). Semidiscrete axis", function(assert) {
    checkTypes(assert, [{ arg: "1000", val: "1" }, { arg: "2000", val: "2" }, { arg: "3000", val: "3" }],
        createGroupsData({
            argumentAxisType: "semidiscrete",
            valueAxisType: "semidiscrete"
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("Numbers type. (Auto) axis", function(assert) {
    checkTypes(assert, [{ arg: "11", val: "1" }, { arg: "22", val: "2" }, { arg: "33", val: "3" }],
        createGroupsData({
            argumentType: "numeric",
            valueType: "numeric"
        }),
        "continuous", "numeric", "continuous", "numeric");
});

QUnit.test("DateTime type. (Auto) axis", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001);

    checkTypes(assert, [{ arg: "" + date1000, val: "" + date10001 }, { arg: "" + date2000, val: date20001 }, { arg: "" + date3000, val: date30001 }],
        createGroupsData({
            argumentType: "datetime",
            valueType: "datetime"
        }),
        "continuous", "datetime", "continuous", "datetime");
});

QUnit.test("String type. (Auto) axis", function(assert) {
    checkTypes(assert, [{ arg: 1000, val: 1 }, { arg: 2000, val: 2 }, { arg: 3000, val: 3 }],
        createGroupsData({
            argumentType: "string",
            valueType: "string"
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("Numbers type. Discrete axis", function(assert) {
    checkTypes(assert, [{ arg: "11", val: "1" }, { arg: "22", val: "2" }, { arg: "33", val: "3" }],
        createGroupsData({
            argumentAxisType: "discrete", argumentType: "numeric",
            valueAxisType: "discrete", valueType: "numeric"
        }),
        "discrete", "numeric", "discrete", "numeric");
});

QUnit.test("DateTime type. Discrete axis", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001);

    checkTypes(assert, [{ arg: "" + date1000, val: date10001 }, { arg: "" + date2000, val: date20001 }, { arg: "" + date3000, val: date30001 }],
        createGroupsData({
            argumentAxisType: "discrete", argumentType: "datetime",
            valueAxisType: "discrete", valueType: "datetime"
        }),
        "discrete", "datetime", "discrete", "datetime");
});

QUnit.test("String type. Discrete axis", function(assert) {
    checkTypes(assert, [{ arg: 1000, val: 1 }, { arg: 2000, val: 2 }, { arg: 3000, val: 3 }],
        createGroupsData({
            argumentAxisType: "discrete", argumentType: "string",
            valueAxisType: "discrete", valueType: "string"
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("Numbers type. Continuous axis", function(assert) {
    checkTypes(assert, [{ arg: "11", val: "1" }, { arg: "22", val: "2" }, { arg: "33", val: "3" }],
        createGroupsData({
            argumentAxisType: "continuous", argumentType: "numeric",
            valueAxisType: "continuous", valueType: "numeric"
        }),
        "continuous", "numeric", "continuous", "numeric");
});

QUnit.test("DateTime type. Continuous axis", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001);

    checkTypes(assert, [{ arg: "" + date1000, val: date10001 }, { arg: "" + date2000, val: date20001 }, { arg: "" + date3000, val: date30001 }],
        createGroupsData({
            argumentAxisType: "continuous", argumentType: "datetime",
            valueAxisType: "continuous", valueType: "datetime"
        }),
        "continuous", "datetime", "continuous", "datetime");
});

QUnit.test("String type. Continuous axis", function(assert) {
    checkTypes(assert, [{ arg: 1000, val: 1 }, { arg: 2000, val: 2 }, { arg: 3000, val: 3 }],
        createGroupsData({
            argumentAxisType: "continuous", argumentType: "string",
            valueAxisType: "continuous", valueType: "string"
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("Numbers type. Semidiscrete axis", function(assert) {
    checkTypes(assert, [{ arg: "11", val: "1" }, { arg: "22", val: "2" }, { arg: "33", val: "3" }],
        createGroupsData({
            argumentAxisType: "semidiscrete", argumentType: "numeric",
            valueAxisType: "semidiscrete", valueType: "numeric"
        }),
        "semidiscrete", "numeric", "semidiscrete", "numeric");
});

QUnit.test("DateTime type. Semidiscrete axis", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date10001 = new Date(10001),
        date20001 = new Date(20001),
        date30001 = new Date(30001);

    checkTypes(assert, [{ arg: "" + date1000, val: date10001 }, { arg: "" + date2000, val: date20001 }, { arg: "" + date3000, val: date30001 }],
        createGroupsData({
            argumentAxisType: "semidiscrete", argumentType: "datetime",
            valueAxisType: "semidiscrete", valueType: "datetime"
        }),
        "semidiscrete", "datetime", "semidiscrete", "datetime");
});

QUnit.test("String type. Semidiscrete axis", function(assert) {
    checkTypes(assert, [{ arg: 1000, val: 1 }, { arg: 2000, val: 2 }, { arg: 3000, val: 3 }],
        createGroupsData({
            argumentAxisType: "semidiscrete", argumentType: "string",
            valueAxisType: "semidiscrete", valueType: "string"
        }),
        "discrete", "string", "discrete", "string");
});

QUnit.test("Validate incorrect type", function(assert) {
    checkTypes(assert, [{ arg: 1, val: 5 }, { arg: 2, val: 6 }],
        createGroupsData({
            argumentType: "abc",
            valueType: "def",
            argumentField: "arg",
            valueFields: ["val"]
        }),
        "continuous", "numeric", "continuous", "numeric");
});

QUnit.test("Validate correct type with upper case", function(assert) {
    checkTypes(assert, [{ arg: 1, val: 5 }, { arg: 2, val: 6 }],
        createGroupsData({
            argumentType: "DATETIME",
            valueType: "STRING",
            argumentField: "arg",
            valueFields: ["val"]
        }),
        "continuous", "datetime", "discrete", "string");
});

QUnit.module("Many Fields");

QUnit.test("Argument & Value. Numeric", function(assert) {
    checkTypes(assert, [{ arg1: 1, arg2: 4, val1: 11, val2: 44 }, { arg1: 2, arg2: 5, val1: 22, val2: 55 }, { arg1: 3, arg2: 6, val1: 33, val2: 66 }],
        createGroupsData({
            argumentField: "arg1",
            valueFields: ["val1", "val2"]
        }),
        "continuous", "numeric", "continuous", "numeric");
});

QUnit.test("Argument & Value. String", function(assert) {
    checkTypes(assert, [{ arg1: "1", arg2: 4, val1: 11, val2: 44 }, { arg1: 2, arg2: 5, val1: 22, val2: "55" }, { arg1: 3, arg2: 6, val1: 33, val2: 66 }],
        createGroupsData({
            argumentField: "arg1",
            valueFields: ["val1", "val2"]
        }),
        "discrete", "string", "discrete", "string",
        null, { checkTypeForAllData: true });
});

QUnit.test("Argument & Value. Date", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000);

    checkTypes(assert, [{ arg1: 4000, arg2: 4000, val1: date2, val2: 5000 }, { arg1: 6000, arg2: 7000, val1: 8000, val2: 9000 }, { arg1: date1, arg2: date2, val1: 11000, val2: 12000 }],
        createGroupsData({
            argumentField: "arg1",
            valueFields: ["val1", "val2"]
        }),
        "continuous", "datetime", "continuous", "datetime",
        null, { checkTypeForAllData: true });
});

QUnit.test("Argument - Numeric. Value - Date", function(assert) {
    var date1000 = new Date(1000),
        date2000 = new Date(2000),
        date3000 = new Date(3000),
        date4000 = new Date(4000);

    checkTypes(assert, [{ arg1: 1, arg2: 11, val1: date1000, val2: date4000 }, { arg1: 2, arg2: 22, val1: date2000, val2: 123 }, { arg1: 3, arg2: 33, val1: date3000, val2: 203 }],
        createGroupsData({
            argumentField: "arg1",
            valueFields: ["val1", "val2"]
        }),
        "continuous", "numeric", "continuous", "datetime");
});

QUnit.test("Argument - Numeric. Value - String", function(assert) {
    var date1000 = new Date(1000);

    checkTypes(assert, [{ arg1: 1, arg2: 4, val1: "11", val2: date1000 }, { arg1: 2, arg2: 5, val1: "22", val2: 55 }, { arg1: 3, arg2: 6, val1: "33", val2: "66" }],
        createGroupsData({
            argumentField: "arg1",
            valueFields: ["val1", "val2"]
        }),
        "continuous", "numeric", "discrete", "string");
});

QUnit.module("parsing");

QUnit.test("Numeric from numbers", function(assert) {
    var parsedData = testValidateData([{ arg: 1, val: 11 }, { arg: 2, val: 22 }, { arg: 3, val: 33 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }],
        createGroupsData({
            argumentType: "numeric",
            valueType: "numeric"
        }));

    checkParsedData(parsedData, {
        "arg": {
            arg: [1, 2, 3, 4, 5],
            val: [11, 22, 33, 44, 55]
        }
    }, { assert: assert });
});

QUnit.test("Numeric from numbers. logarithmic axis", function(assert) {
    var incidentOccurred = sinon.spy();

    var parsedData = testValidateData([{ arg: 1, val: 0 }, { arg: 2, val: 22 }, { arg: 0, val: 33 }, { arg: -4, val: -44 }, { arg: 5, val: 0 }],
        createGroupsData({
            argumentType: "numeric",
            valueType: "numeric",
            valueAxisType: "logarithmic",
            argumentAxisType: "logarithmic"
        }), incidentOccurred);

    checkParsedData(parsedData, { "arg": { arg: [1, 2, null, null, 5], val: [null, 22, 33, null, null] } }, { assert: assert });

    assert.equal(incidentOccurred.callCount, 5);
    assert.equal(incidentOccurred.getCall(0).args[0], "E2004");
    assert.equal(incidentOccurred.getCall(0).args[1][0], "val");
    assert.equal(incidentOccurred.getCall(1).args[0], "E2004");
    assert.equal(incidentOccurred.getCall(1).args[1][0], "arg");
    assert.equal(incidentOccurred.getCall(2).args[0], "E2004");
    assert.equal(incidentOccurred.getCall(2).args[1][0], "arg");
    assert.equal(incidentOccurred.getCall(3).args[0], "E2004");
    assert.equal(incidentOccurred.getCall(3).args[1][0], "val");
    assert.equal(incidentOccurred.getCall(4).args[0], "E2004");
    assert.equal(incidentOccurred.getCall(4).args[1][0], "val");
});

// T463066
QUnit.test("DataSource with null values. logarithmic axis", function(assert) {
    var incidentOccurred = sinon.spy();
    var parsedData = testValidateData([{ arg: 1, val: null }, { arg: 2, val: 22 }, { arg: null, val: 33 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }],
        createGroupsData({
            argumentType: "numeric",
            valueType: "numeric",
            valueAxisType: "logarithmic",
            argumentAxisType: "logarithmic"
        }), incidentOccurred);

    checkParsedData(parsedData, {
        "arg": {
            arg: [1, 2, null, 4, 5],
            val: [null, 22, 33, 44, 55]
        }
    }, { assert: assert });

    assert.equal(incidentOccurred.callCount, 0);
});

QUnit.test("Numeric from string. logarithmic axis", function(assert) {
    var parsedData = testValidateData([{ arg: "1", val: "0" }, { arg: "2", val: "22" }, { arg: "0", val: "33" }, { arg: "-4", val: "-44" }, { arg: "5", val: "0" }],
        createGroupsData({
            argumentType: "numeric",
            valueType: "numeric",
            valueAxisType: "logarithmic",
            argumentAxisType: "logarithmic"
        }));

    checkParsedData(parsedData, {
        "arg": {
            val: [null, 22, 33, null, null],
            arg: [1, 2, null, null, 5]
        }
    }, { assert: assert });
});

QUnit.test("Numeric from strings", function(assert) {
    var parsedData = testValidateData([{ arg: "1", val: "11" }, { arg: "2", val: "22" }, { arg: "3", val: "33" }, { arg: "4", val: "44" }, { arg: "5", val: "55" }],
        createGroupsData({
            argumentType: "numeric",
            valueType: "numeric"
        }));

    checkParsedData(parsedData, {
        "arg": {
            val: [11, 22, 33, 44, 55],
            arg: [1, 2, 3, 4, 5]
        }
    }, { assert: assert, compare: "deepEqual" });
});

QUnit.test("Numeric from dates", function(assert) {
    var date1 = new Date(1),
        date2 = new Date(2),
        date3 = new Date(3),
        date4 = new Date(4),
        date5 = new Date(5),
        date11 = new Date(11),
        date22 = new Date(22),
        date33 = new Date(33),
        date44 = new Date(44),
        date55 = new Date(55);

    var parsedData = testValidateData([
        { arg: date1, val: date11 },
        { arg: date2, val: date22 },
        { arg: date3, val: date33 },
        { arg: date4, val: date44 },
        { arg: date5, val: date55 }
    ], createGroupsData({
        argumentType: "numeric",
        valueType: "numeric"
    }));

    checkParsedData(parsedData, {
        "arg": {
            val: [11, 22, 33, 44, 55],
            arg: [1, 2, 3, 4, 5]
        }
    }, { assert: assert });

});

QUnit.test("Datetime from dates", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date11 = new Date(10001),
        date22 = new Date(20001),
        date33 = new Date(30001),
        date44 = new Date(40001),
        date55 = new Date(50001);

    var parsedData = testValidateData([
        { arg: date1, val: date11 },
        { arg: date2, val: date22 },
        { arg: date3, val: date33 },
        { arg: date4, val: date44 },
        { arg: date5, val: date55 }
    ], createGroupsData({
        argumentType: "datetime",
        valueType: "datetime"
    }));

    checkParsedData(parsedData, {
        "arg": {
            val: [date11, date22, date33, date44, date55],
            arg: [date1, date2, date3, date4, date5]
        }
    }, { assert: assert, compare: "deepEqual" });
});

QUnit.test("Datetime from strings", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date11 = new Date(6000),
        date22 = new Date(7000),
        date33 = new Date(8000),
        date44 = new Date(9000),
        date55 = new Date(10000);

    var parsedData = testValidateData([
        { arg: date1.toString(), val: date11.toString() },
        { arg: date2.toString(), val: date22.toString() },
        { arg: date3.toString(), val: date33.toString() },
        { arg: date4.toString(), val: date44.toString() },
        { arg: date5.toString(), val: date55.toString() }
    ], createGroupsData({
        argumentType: "datetime",
        valueType: "datetime"
    }));

    checkParsedData(parsedData, {
        "arg": {
            val: [date11, date22, date33, date44, date55],
            arg: [date1, date2, date3, date4, date5]
        }
    }, { assert: assert, compare: "deepEqual" });
});

QUnit.test("Datetime from numbers", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date11 = new Date(10000),
        date22 = new Date(20000),
        date33 = new Date(30000),
        date44 = new Date(40000),
        date55 = new Date(50000);

    var parsedData = testValidateData([
        { arg: 1000, val: 10000 },
        { arg: 2000, val: 20000 },
        { arg: 3000, val: 30000 },
        { arg: 4000, val: 40000 },
        { arg: 5000, val: 50000 }
    ], createGroupsData({
        argumentType: "datetime",
        valueType: "datetime"
    }));

    checkParsedData(parsedData, {
        "arg": {
            val: [date11, date22, date33, date44, date55],
            arg: [date1, date2, date3, date4, date5]
        }
    }, { assert: assert, compare: "deepEqual" });
});

QUnit.test("String from strings", function(assert) {
    var parsedData = testValidateData([{ arg: "1", val: "11" }, { arg: "2", val: "22" }, { arg: "3", val: "33" }, { arg: "4", val: "44" }, { arg: "5", val: "55" }], createGroupsData({
        argumentType: "string",
        valueType: "string"
    }));

    checkParsedData(parsedData, {
        "arg": {
            val: ["11", "22", "33", "44", "55"],
            arg: ["1", "2", "3", "4", "5"]
        }
    }, { assert: assert });
});

QUnit.test("String from numbers", function(assert) {
    var parsedData = testValidateData([{ arg: 1, val: 11 }, { arg: 2, val: 22 }, { arg: 3, val: 33 }, { arg: 4, val: 44 }, { arg: 5, val: 55 }], createGroupsData({
        argumentType: "string",
        valueType: "string"
    }));

    checkParsedData(parsedData, {
        "arg": {
            val: ["11", "22", "33", "44", "55"],
            arg: ["1", "2", "3", "4", "5"]
        }
    }, { assert: assert });
});

QUnit.test("String from dates", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date11 = new Date(6000),
        date22 = new Date(7000),
        date33 = new Date(8000),
        date44 = new Date(9000),
        date55 = new Date(10000);

    var parsedData = testValidateData([
        { arg: date1, val: date11 },
        { arg: date2, val: date22 },
        { arg: date3, val: date33 },
        { arg: date4, val: date44 },
        { arg: date5, val: date55 }
    ], createGroupsData({
        argumentType: "string",
        valueType: "string"
    }));

    checkParsedData(parsedData, {
        "arg": {
            val: ["" + date11, "" + date22, "" + date33, "" + date44, "" + date55],
            arg: ["" + date1, "" + date2, "" + date3, "" + date4, "" + date5]
        }
    }, { assert: assert });
});

QUnit.test("Size field values always parsed to Numeric", function(assert) {
    var parsedData = testValidateData([{ arg: "1", val: "11", size: "111" }, { arg: "2", val: "22", size: "222" }, { arg: "3", val: "33", size: "333" }],
        createGroupsData({
            argumentType: "string",
            valueType: "datetime",
            sizeField: "size"
        }));

    checkParsedData(parsedData, {
        "arg": {
            size: [111, 222, 333]
        }
    }, { assert: assert });
});

QUnit.test("Parsed data should have all fields from source data", function(assert) {
    var parsedData = testValidateData([
        { arg: 1, val: 11, extra: "1" },
        { arg: 2, val: 22, extra: "2" }
    ],
    createGroupsData({
        argumentType: "numeric",
        valueType: "numeric"
    }));

    checkParsedData(parsedData, {
        "arg": {
            arg: [1, 2],
            val: [11, 22],
            extra: ["1", "2"]
        }
    }, { assert: assert });
});

QUnit.test("Two axes, first string discrete, second numeric discrete", function(assert) {
    var groupData1 = createGroupsData({
            argumentAxisType: "discrete",
            valueAxisType: "discrete",
            argumentCategories: ["A", "B", "C"],
            valueCategories: ["1", "2", "3"],
            argumentField: "arg",
            valueFields: ["val"]
        }),
        groupData2 = createGroupsData({
            argumentAxisType: "discrete",
            valueAxisType: "discrete",
            argumentCategories: ["A", "B", "C"],
            valueCategories: [10, 20, 30],
            argumentField: "arg",
            valueFields: ["val1"]
        }),
        groupsData1 = {};

    groupsData1.groups = groupData1.groups.concat(groupData2.groups);
    groupsData1.argumentOptions = groupData1.argumentOptions;

    var parsedData = testValidateData([
        { arg: "A", val: "1", val1: 10 }
    ], groupsData1);

    checkParsedData(parsedData, {
        "arg": {
            val: ["1"],
            val1: [10],
            arg: ["A"]
        }
    }, { assert: assert, compare: "deepEqual" });

    assert.deepEqual(groupsData1.groups[0].valueOptions.categories, ["1", "2", "3"], "value categories");
    assert.deepEqual(groupsData1.groups[1].valueOptions.categories, [10, 20, 30], "value categories");
});

QUnit.module("Skip data");

QUnit.test("Null/undefined values", function(assert) {
    var groupsData = createGroupsData({
        valueCategories: [2, null, 7, undefined, 10]
    });

    var parsedData = testValidateData([{ arg: 25, val: 1 }, { arg: 11, val: null }, { arg: 15 }, { arg: 22, val: 2 }, { arg: 33, val: 3 }], groupsData);

    assert.deepEqual(groupsData.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "numeric");

    checkParsedData(parsedData, {
        "arg": {
            val: [1, null, undefined, 2, 3],
            arg: [25, 11, 15, 22, 33]
        }
    }, { assert: assert });

    assert.deepEqual(groupsData.groups[0].valueOptions.categories, [2, null, 7, 10], "value categories");
});

QUnit.test("Infinity as values", function(assert) {
    var groupsData = createGroupsData();

    var parsedData = testValidateData([{ arg: 25, val: 1 }, { arg: 11, val: Infinity }, { arg: 15, val: -Infinity }], groupsData);

    assert.deepEqual(groupsData.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "numeric");

    checkParsedData(parsedData, {
        "arg": {
            val: [1, null, null],
            arg: [25, 11, 15]
        }
    }, { assert: assert });
});

QUnit.test("Infinity as category", function(assert) {
    var groupsData = createGroupsData({
        valueCategories: [2, Infinity, 7, -Infinity, 10]
    });

    var parsedData = testValidateData([{ arg: 25, val: 1 }, { arg: 11, val: Infinity }, { arg: 15, val: -Infinity }], groupsData);

    assert.deepEqual(groupsData.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "numeric");

    checkParsedData(parsedData, {
        "arg": {
            val: [1, Infinity, -Infinity],
            arg: [25, 11, 15]
        }
    }, { assert: assert });

    assert.deepEqual(groupsData.groups[0].valueOptions.categories, [2, Infinity, 7, -Infinity, 10], "value categories");
});

QUnit.test("Null/undefined sizes", function(assert) {
    var groups = createGroupsData({
        sizeField: "size"
    });

    var parsedData = testValidateData([{ arg: 25, val: 1, size: 1 }, { arg: 11, val: 1, size: null }, { arg: 15, val: 1 }, { arg: 22, val: 1, size: 2 }, { arg: 33, val: 1, size: 3 }], groups);

    checkParsedData(parsedData, {
        "arg": {
            size: [1, null, undefined, 2, 3]
        }
    }, { assert: assert });
});

QUnit.test("Can not parse Numeric arguments", function(assert) {
    var groupsData = createGroupsData({
        argumentType: "numeric",
        argumentCategories: ["1", "df", "3", new Date().toString(), "5"]
    });

    var parsedData = testValidateData([{ arg: "1", val: 1 }, { arg: "df", val: 2 }, { arg: "3", val: 3 }, { arg: (new Date()).toString(), val: 4 }, { arg: "5", val: 5 }], groupsData);

    assert.equal(groupsData.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, "numeric");

    checkParsedData(parsedData, {
        "arg": {
            arg: [undefined, undefined, 1, 3, 5]
        }
    }, { assert: assert });

    assert.deepEqual(groupsData.argumentOptions.categories, [1, 3, 5], "argument categories");
});

QUnit.test("Can not parse Datetime arguments", function(assert) {
    var groups = createGroupsData({
            argumentType: "datetime",
            argumentCategories: [new Date(1000).toString(), 2000, "3000", new Date(4) + "ff", "Thu Jan 01 1970 00:00:05 GMT+0000", "400sdf"]
        }),

        parsedData = testValidateData(
            [{ arg: (new Date(1000)).toString(), val: 1 }, { arg: 2000, val: 2 }, { arg: "3000", val: 3 }, { arg: new Date(4) + "ff", val: 4 }, { arg: "Thu Jan 01 1970 00:00:05 GMT+0000", val: 5 }, { arg: "400sdf", val: 5 }],
            groups);

    checkParsedData(parsedData, {
        "arg": {
            arg: [undefined, undefined, new Date(1000), new Date(2000), new Date(3000), new Date(5000)]
        }
    }, { assert: assert, compare: "deepEqual" });

    assert.deepEqual(groups.argumentOptions.categories, [new Date(1000), new Date(2000), new Date(3000), new Date(5000)], "argument categories");
});

// T608785
QUnit.test("Order of the series should be correct", function(assert) {
    var groups = createGroupsData({
            argumentType: "string",
            argumentCategories: ["cat1", "cat2", "cat3", "cat4", "cat5", "cat6", "cat7", "cat8", "cat9"]
        }),

        parsedData = testValidateData(
            [
                { arg: "cat1", val: 3 },
                { arg: "cat2", val: 4 },
                { arg: "cat3", val: 5 },
                { arg: "cat4", val: 5 },
                { arg: "cat5", val: 4 },
                { arg: "cat6", val: 5 },
                { arg: "cat7", val: 5 },
                { arg: "cat8", val: 5 },
                { arg: "cat9", val: 5 },
                { arg1: "cat6", val: 1 },
                { arg1: "cat7", val: 2 }],
            groups);

    checkParsedData(parsedData, {
        "arg": {
            arg: [undefined, undefined, "cat1", "cat2", "cat3", "cat4", "cat5", "cat6", "cat7", "cat8", "cat9"]
        }
    }, { assert: assert, compare: "deepEqual" });
});

QUnit.test("T377440", function(assert) {
    var groups = createGroupsData({
            argumentType: "string",
            valueType: "numeric",
            valueFields: ["0"],
            argumentCategories: ["one", "two", "three", "four", "five"],
        }),
        parsedData = testValidateData([{ arg: "one", "0": 11 }, { arg: "two", "0": 22 }, { arg: "three", "0": 33 }, { arg: "four", "0": 44 }, { arg: "five", "0": 55 }], groups);

    assert.equal(parsedData.arg.length, 5);

    assert.deepEqual(groups.argumentOptions.categories, ["one", "two", "three", "four", "five"], "argument categories");
});

QUnit.test("Can not parse Numeric values", function(assert) {
    var groupsData = createGroupsData({
            valueType: "numeric",
            valueCategories: ["1", "df", "3", (new Date()).toString(), "5"]
        }),
        parsedData = testValidateData([
            { val: "1", arg: 1 },
            { val: "df", arg: 2 },
            { val: "3", arg: 3 },
            { val: (new Date()).toString(), arg: 4 },
            { val: "5", arg: 5 }
        ], groupsData);

    checkParsedData(parsedData, {
        "arg": {
            val: [1, undefined, 3, undefined, 5]
        }
    }, { assert: assert });

    assert.deepEqual(groupsData.groups[0].valueOptions.categories, [1, 3, 5], "value categories");
});

QUnit.test("Can not parse Datetime values", function(assert) {
    var groupsData = createGroupsData({
            valueType: "datetime",
            valueCategories: [(new Date(1000)).toString(), 2000, "3000", new Date(4) + "ff", "Thu Jan 01 1970 00:00:05 GMT+0000", "400sdf"]
        }),
        parsedData = testValidateData([
            { val: (new Date(1000)).toString(), arg: 1 },
            { val: 2000, arg: 2 },
            { val: "3000", arg: 3 },
            { val: new Date(4) + "ff", arg: 4 },
            { val: "Thu Jan 01 1970 00:00:05 GMT+0000", arg: 5 },
            { val: "400sdf", arg: 5 }
        ], groupsData);

    checkParsedData(parsedData, {
        "arg": {
            val: [new Date(1000), new Date(2000), new Date(3000), undefined, new Date(5000), undefined]
        }
    }, { assert: assert, compare: "deepEqual" });

    assert.deepEqual(groupsData.groups[0].valueOptions.categories, [new Date(1000), new Date(2000), new Date(3000), new Date(5000)], "value categories");
});

QUnit.test("Can not parse sizes", function(assert) {
    var groupsData = createGroupsData({
            sizeField: "size"
        }),
        parsedData = testValidateData([
            { size: "1", val: 1, arg: 1 },
            { size: "df", val: 1, arg: 2 },
            { size: "3", val: 1, arg: 3 },
            { size: (new Date()).toString(), val: 1, arg: 4 },
            { size: "5", val: 1, arg: 5 }
        ], groupsData);

    checkParsedData(parsedData, {
        "arg": {
            size: [1, undefined, 3, undefined, 5]
        }
    }, { assert: assert });
});

QUnit.module("options Groups");

QUnit.test("ArgumentType & ValueType merge. in one Group", function(assert) {
    var groupData1 = createGroupsData({ argumentType: "string", valueType: "string" }),
        groupData2 = createGroupsData({ argumentType: "string", valueType: "string" }),
        groupsData1 = {};

    groupsData1.groups = groupData1.groups.concat(groupData2.groups);
    groupsData1.argumentOptions = groupData1.argumentOptions;
    groupsData1.groups[0].valueOptions = groupData1.groups[0].valueOptions;

    testValidateData([], groupsData1);

    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].argumentAxisType, "discrete");
    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, "string");
    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].valueAxisType, "discrete");
    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "string");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].argumentAxisType, "discrete");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, "string");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].valueAxisType, "discrete");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "string");
});

QUnit.test("ArgumentType & ValueType merge. Different group", function(assert) {
    var groupData1 = createGroupsData({ argumentType: "string", valueType: "string" }),
        groupData2 = createGroupsData({ argumentType: "string", valueType: "numeric" }),
        groupsData = {};


    groupsData.groups = groupData1.groups.concat(groupData2.groups);
    groupsData.argumentOptions = groupData1.argumentOptions;

    testValidateData([], groupsData);

    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].argumentAxisType, "discrete");
    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, "string");
    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].valueAxisType, "discrete");
    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "string");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].argumentAxisType, "discrete");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, "string");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].valueAxisType, "continuous");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "numeric");
});

QUnit.test("ArgumentType & ValueType merge. Different group", function(assert) {
    var groupData1 = createGroupsData({ argumentField: "arg", valueFields: ["val"] }),
        groupData2 = createGroupsData({ argumentField: "arg", valueFields: ["val1"] }),
        groupsData = {};

    groupsData.groups = groupData1.groups.concat(groupData2.groups);
    groupsData.argumentOptions = groupData1.argumentOptions;

    testValidateData([{ arg: "a", val: 1 }], groupsData);

    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].argumentAxisType, "discrete");
    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, "string");
    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].valueAxisType, "continuous");
    assert.equal(groupData1.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "numeric");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].argumentAxisType, "discrete");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, "string");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].valueAxisType, "continuous");
    assert.equal(groupData2.groups[0].series[0].updateDataType.lastCall.args[0].valueType, undefined);
});

QUnit.module("Check data sorting. Continuous argument axis");

QUnit.test("Numeric, series with same field, sortingMethod true - sort data by argument", function(assert) {
    var data = [
            { arg: 2, val: 11, val1: 333 },
            { arg: 1, val: 55, val1: 444 },
            { arg: 5, val: 33, val1: 111 },
            { arg: 4, val: 22, val1: 222 },
            { arg: 3, val: 44, val1: 555 }
        ],
        group1 = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "numeric",
            valueType: "numeric"
        }),
        group2 = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "numeric",
            valueType: "numeric",
            argumentField: "arg",
            valueFields: "val1"
        }),
        groups = {
            groups: group1.groups.concat(group2.groups)
        },
        options = {
            sortingMethod: true
        },
        result;

    groups.argumentOptions = group1.argumentOptions;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [55, 11, 44, 22, 33],
            val1: [444, 333, 555, 222, 111],
            arg: [1, 2, 3, 4, 5]
        }
    }, { assert: assert });
});

QUnit.test("Numeric, series with different fields, sortingMethod true - sort data by argument", function(assert) {
    var data = [
            { arg: 2, val: 11, arg1: 4, val1: 333 },
            { arg: 1, val: 55, arg1: 3, val1: 444 },
            { arg: 5, val: 33, arg1: 1, val1: 111 },
            { arg: 4, val: 22, arg1: 5, val1: 222 },
            { arg: 3, val: 44, arg1: 2, val1: 555 },
            { arg: 6, val: 66 }
        ],
        group1 = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "numeric",
            valueType: "numeric"
        }),
        group2 = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "numeric",
            valueType: "numeric",
            argumentField: "arg1",
            valueFields: "val1"
        }),
        groups = {
            groups: group1.groups.concat(group2.groups)
        },
        options = {
            sortingMethod: true
        },
        result;

    groups.argumentOptions = group1.argumentOptions;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [55, 11, 44, 22, 33, 66],
            arg: [1, 2, 3, 4, 5, 6]
        },
        arg1: {
            val1: [111, 555, 444, 333, 222, undefined],
            arg1: [1, 2, 3, 4, 5, undefined]
        }
    }, { assert: assert });
});

QUnit.test("Numeric, sortingMethod false - do not sort data", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 1, val: 22 }, { arg: 5, val: 44 }, { arg: 4, val: 33 }, { arg: 3, val: 55 }],
        groups = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "numeric",
            valueType: "numeric"
        }),
        options = {
            sortingMethod: false
        },
        result;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [11, 22, 44, 33, 55],
            arg: [2, 1, 5, 4, 3]
        }
    }, { assert: assert });
});

QUnit.test("DateTime, sortingMethod true - sort data by argument", function(assert) {
    var data = [{ arg: new Date(2016, 1, 2), val: 11 }, { arg: new Date(2016, 1, 1), val: 22 }, { arg: new Date(2016, 1, 5), val: 33 }, { arg: new Date(2016, 1, 4), val: 44 }, { arg: new Date(2016, 1, 3), val: 55 }],
        groups = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "datetime",
            valueType: "numeric"
        }),
        options = {
            sortingMethod: true
        },
        result;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [22, 11, 55, 44, 33],
            arg: [new Date(2016, 1, 1), new Date(2016, 1, 2), new Date(2016, 1, 3), new Date(2016, 1, 4), new Date(2016, 1, 5)]
        }
    }, { assert: assert, compare: "deepEqual" });
});

QUnit.test("Numeric, series with same field, sortingMethod callback - sort data by callback", function(assert) {
    var data = [
            { arg: 2, val: 11, val1: 333 },
            { arg: 1, val: 55, val1: 444 },
            { arg: 5, val: 33, val1: 111 },
            { arg: 4, val: 22, val1: 222 },
            { arg: 3, val: 44, val1: 555 }
        ],
        group1 = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "numeric",
            valueType: "numeric"
        }),
        group2 = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "numeric",
            valueType: "numeric",
            argumentField: "arg",
            valueFields: "val1"
        }),
        groups = {
            groups: group1.groups.concat(group2.groups)
        },
        options = {
            sortingMethod: function(a, b) {
                return a.val - b.val;
            }
        },
        result;

    groups.argumentOptions = group1.argumentOptions;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [11, 22, 33, 44, 55],
            val1: [333, 222, 111, 555, 444],
            arg: [2, 4, 5, 3, 1]
        }
    }, { assert: assert });
});

QUnit.test("T532528. Different argumentFields, each dataSource item is only for one series, first arguemnt is 0", function(assert) {
    var data = [
            { arg: 1, val: 11 },
            { arg: 0, val: 55 },
            { arg: 4, val: 33 },
            { arg: 3, val: 22 },
            { arg: 2, val: 44 },
            { arg: 5, val: 66 },
            { arg1: 3, val1: 333 },
            { arg1: 2, val1: 444 },
            { arg1: 0, val1: 111 },
            { arg1: 4, val1: 222 },
            { arg1: 1, val1: 555 },
            { arg1: 5, val1: 666 }
        ],
        group1 = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "numeric",
            valueType: "numeric"
        }),
        group2 = createGroupsData({
            argumentAxisType: "continuous",
            argumentType: "numeric",
            valueType: "numeric",
            argumentField: "arg1",
            valueFields: "val1"
        }),
        groups = {
            groups: group1.groups.concat(group2.groups)
        },
        options = {
            sortingMethod: true
        },
        result;

    groups.argumentOptions = group1.argumentOptions;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [55, 11, 44, 22, 33, 66, undefined, undefined, undefined, undefined, undefined, undefined],
            arg: [0, 1, 2, 3, 4, 5, undefined, undefined, undefined, undefined, undefined, undefined]
        },
        arg1: {
            val1: [111, 555, 444, 333, 222, 666, undefined, undefined, undefined, undefined, undefined, undefined],
            arg1: [0, 1, 2, 3, 4, 5, undefined, undefined, undefined, undefined, undefined, undefined]
        }
    }, { assert: assert });
});

QUnit.module("Check data sorting. Discrete argument axis");

QUnit.test("Numeric, series with different fields (skipped items), sortingMethod true - sort data by argument", function(assert) {
    var data = [
            { arg: 2, val: 11, arg1: 4, val1: 333 },
            { arg: undefined, val: undefined, arg1: 3, val1: 444 },
            { arg: 5, val: 33, arg1: 1, val1: 111 },
            { arg: 4, val: 22, arg1: 5, val1: 222 },
            { arg: 3, val: 44, arg1: 2, val1: 555 },
            { arg: 6, val: 66 }
        ],
        group1 = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "numeric",
            valueType: "numeric"
        }),
        group2 = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "numeric",
            valueType: "numeric",
            argumentField: "arg1",
            valueFields: "val1"
        }),
        groups = {
            groups: group1.groups.concat(group2.groups)
        },
        options = {
            sortingMethod: true
        },
        result;

    groups.argumentOptions = group1.argumentOptions;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [11, 44, 22, 33, 66, undefined],
            arg: [2, 3, 4, 5, 6, undefined]
        },
        arg1: {
            val1: [111, 555, 444, 333, 222, undefined],
            arg1: [1, 2, 3, 4, 5, undefined]
        }
    }, { assert: assert });

    assert.deepEqual(groups.categories, [1, 2, 3, 4, 5, 6]);
});

QUnit.test("DateTime, sortingMethod true - sort data by argument", function(assert) {
    var data = [{ arg: new Date(2016, 1, 2), val: 11 }, { arg: new Date(2016, 1, 1), val: 22 }, { arg: new Date(2016, 1, 5), val: 33 }, { arg: new Date(2016, 1, 4), val: 44 }, { arg: new Date(2016, 1, 3), val: 55 }],
        groups = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "datetime",
            valueType: "numeric"
        }),
        options = {
            sortingMethod: true
        },
        result;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [22, 11, 55, 44, 33],
            arg: [new Date(2016, 1, 1), new Date(2016, 1, 2), new Date(2016, 1, 3), new Date(2016, 1, 4), new Date(2016, 1, 5)]
        }
    }, { assert: assert, compare: "deepEqual" });

    assert.deepEqual(groups.categories, [new Date(2016, 1, 1), new Date(2016, 1, 2), new Date(2016, 1, 3), new Date(2016, 1, 4), new Date(2016, 1, 5)]);
});

QUnit.test("Numeric, sortingMethod false - do not sort data", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 1, val: 22 }, { arg: 5, val: 44 }, { arg: 4, val: 33 }, { arg: 3, val: 55 }],
        groups = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "numeric",
            valueType: "numeric"
        }),
        options = {
            sortingMethod: false
        },
        result;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [11, 22, 44, 33, 55],
            arg: [2, 1, 5, 4, 3]
        }
    }, { assert: assert });

    assert.deepEqual(groups.categories, [2, 1, 5, 4, 3]);
});

QUnit.test("String, sortingMethod true (not a callback) - do not sort data", function(assert) {
    var data = [{ arg: "b", val: 11 }, { arg: "a", val: 22 }, { arg: "e", val: 44 }, { arg: "d", val: 33 }, { arg: "c", val: 55 }],
        groups = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "string",
            valueType: "numeric"
        }),
        options = {
            sortingMethod: true
        },
        result;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [11, 22, 44, 33, 55],
            arg: ["b", "a", "e", "d", "c"]
        }
    }, { assert: assert });

    assert.deepEqual(groups.categories, ["b", "a", "e", "d", "c"]);
});

QUnit.test("String, series with same field, sortingMethod callback - sort data by callback", function(assert) {
    var data = [
            { arg: "b", val: 11, val1: 333 },
            { arg: "a", val: 55, val1: 444 },
            { arg: "e", val: 33, val1: 111 },
            { arg: "d", val: 22, val1: 222 },
            { arg: "c", val: 44, val1: 555 }
        ],
        group1 = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "string",
            valueType: "numeric"
        }),
        group2 = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "string",
            valueType: "numeric",
            argumentField: "arg",
            valueFields: "val1"
        }),
        groups = {
            groups: group1.groups.concat(group2.groups)
        },
        options = {
            sortingMethod: function(a, b) {
                return a.val - b.val;
            }
        },
        result;

    groups.argumentOptions = group1.argumentOptions;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [11, 22, 33, 44, 55],
            val1: [333, 222, 111, 555, 444],
            arg: ["b", "d", "e", "c", "a"]
        }
    }, { assert: assert });

    assert.deepEqual(groups.categories, ["b", "d", "e", "c", "a"]);
});

QUnit.test("String, user categories, sortingMethod true - sort data by categories", function(assert) {
    var data = [
            { arg: "b", val: 11, val1: 333 },
            { arg: "a", val: 55, val1: 444 },
            { arg: "e", val: 33, val1: 111 },
            { arg: "d", val: 22, val1: 222 },
            { arg: "c", val: 44, val1: 555 }
        ],
        groups = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "string",
            argumentCategories: ["d", "e"],
            valueType: "numeric"
        }),
        options = {},
        result;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [22, 33, 11, 55, 44],
            arg: ["d", "e", "b", "a", "c"]
        }
    }, { assert: assert });

    assert.deepEqual(groups.categories, ["d", "e", "b", "a", "c"]);
});

QUnit.test("Numeric, user categories, sortingMethod true - sort data by categories, ignore sortingMethod", function(assert) {
    var data = [
            { arg: 2, val: 11, val1: 333 },
            { arg: 1, val: 55, val1: 444 },
            { arg: 5, val: 33, val1: 111 },
            { arg: 4, val: 22, val1: 222 },
            { arg: 3, val: 44, val1: 555 }
        ],
        groups = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "numeric",
            argumentCategories: [4, 5],
            valueType: "numeric"
        }),
        options = {
            sortingMethod: true
        },
        result;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [22, 33, 11, 55, 44],
            arg: [4, 5, 2, 1, 3]
        }
    }, { assert: assert });

    assert.deepEqual(groups.categories, [4, 5, 2, 1, 3]);
});

QUnit.test("Numeric, user categories, sortingMethod callback - sort data by categories, ignore sortingMethod", function(assert) {
    var data = [
            { arg: 2, val: 11, val1: 333 },
            { arg: 1, val: 55, val1: 444 },
            { arg: 5, val: 33, val1: 111 },
            { arg: 4, val: 22, val1: 222 },
            { arg: 3, val: 44, val1: 555 }
        ],
        groups = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "numeric",
            argumentCategories: [4, 5],
            valueType: "numeric"
        }),
        options = {
            sortingMethod: function(a, b) {
                return b.arg - a.arg;
            }
        },
        result;

    result = testValidateData(data, groups, null, options);

    checkParsedData(result, {
        arg: {
            val: [22, 33, 11, 55, 44],
            arg: [4, 5, 2, 1, 3]
        }
    }, { assert: assert });

    assert.deepEqual(groups.categories, [4, 5, 2, 1, 3]);
});

QUnit.test("Collect only unique categories", function(assert) {
    var data = [
            { arg: 2, val: 11 },
            { arg: 1, val: 22 },
            { arg: 2, val: 66 },
            { arg: 5, val: 44 },
            { arg: 4, val: 33 },
            { arg: 1, val: 77 },
            { arg: 3, val: 55 }
        ],
        groups = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "numeric",
            valueType: "numeric"
        }),
        options = {
            sortingMethod: true
        };

    testValidateData(data, groups, null, options);

    assert.deepEqual(groups.categories, [1, 2, 3, 4, 5]);
});

QUnit.test("merge datetime categories. Only unique categories", function(assert) {
    var data = [{ arg: "2017-01-01", val: 1, arg1: "2017-01-01", val1: 2 }],
        group1 = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "datetime",
            valueType: "numeric"
        }),
        group2 = createGroupsData({
            argumentAxisType: "discrete",
            argumentType: "datetime",
            valueType: "numeric",
            argumentField: "arg1",
            valueFields: "val1"
        }),
        groups = {
            groups: group1.groups.concat(group2.groups)
        };

    groups.argumentOptions = group1.argumentOptions;

    testValidateData(data, groups, null, {});

    assert.equal(groups.categories.length, 1);
});

QUnit.module("merge data");

QUnit.test("merge. series has more than one the same arguments", function(assert) {
    var parsedData = testValidateData([{ arg: "oranges", val: 22 }, { arg: "apples", val: 11 }, { arg: "oranges", val: 45 }, { arg: "kiwi", val: 18 }, { arg: "bananas", val: 29 }, { arg: "kiwi", val: 2 }],
        createGroupsData({
            argumentAxisType: "discrete",
            valueType: "numeric",
            type: "pie"
        }), null, { sortingMethod: false, _skipArgumentSorting: true });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["oranges", "apples", "oranges", "kiwi", "bananas", "kiwi"],
            val: [22, 11, 45, 18, 29, 2]
        }
    }, { assert: assert });
});

QUnit.test("merge. series has more than one the same arguments, more than one valueFields", function(assert) {
    var parsedData = testValidateData([
        { arg: "oranges", val1: 11, val2: 111 }, { arg: "apples", val1: 22, val2: 222 },
        { arg: "oranges", val1: 33, val2: 333 }, { arg: "kiwi", val1: 44, val2: 444 },
        { arg: "bananas", val1: 55, val2: 555 }, { arg: "kiwi", val1: 66, val2: 666 }
    ], createGroupsData({
        argumentAxisType: "discrete",
        valueType: "numeric",
        valueFields: ["val1", "val2"],
        type: "pie"
    }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["oranges", "oranges", "apples", "kiwi", "kiwi", "bananas"],
            val1: [11, 33, 22, 44, 66, 55],
            val2: [111, 333, 222, 444, 666, 555]
        }
    }, { assert: assert });
});

QUnit.test("merge. series has two groups", function(assert) {
    var groupData1 = createGroupsData({
            argumentAxisType: "discrete",
            argumentField: "arg1",
            valueFields: "val1",
            type: "pie"
        }),
        groupData2 = createGroupsData({
            argumentAxisType: "discrete",
            argumentField: "arg2",
            valueFields: "val2",
            type: "pie"
        }),
        groupsData = { groups: groupData1.groups.concat(groupData2.groups) },
        parsedData = testValidateData([
            { arg1: "oranges", arg2: "potatoes", val1: 11, val2: 111 }, { arg1: "apples", arg2: "cucumbers", val1: 22, val2: 222 },
            { arg1: "oranges", arg2: "tomatoes", val1: 33, val2: 333 }, { arg1: "kiwi", arg2: "potatoes", val1: 44, val2: 444 },
            { arg1: "bananas", arg2: "tomatoes", val1: 55, val2: 555 }, { arg1: "kiwi", arg2: "garlic", val1: 66, val2: 666 }
        ], groupsData, null, { sortingMethod: false });

    checkParsedData(parsedData, {
        arg1: {
            arg1: ["oranges", "oranges", "apples", "kiwi", "kiwi", "bananas"],
            val1: [11, 33, 22, 44, 66, 55]
        },
        arg2: {
            arg2: ["potatoes", "potatoes", "cucumbers", "tomatoes", "tomatoes", "garlic"],
            val2: [111, 444, 222, 333, 555, 666]
        }
    }, { assert: assert });
});

QUnit.test("merge. argument type is not discrete", function(assert) {
    var parsedData = testValidateData([{ arg: 22, val: 22 }, { arg: 11, val: 11 }, { arg: 33, val: 45 }, { arg: 44, val: 18 }, { arg: 55, val: 29 }, { arg: 66, val: 2 }],
        createGroupsData({
            argumentAxisType: "numeric",
            valueType: "numeric",
            type: "pie"
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: [22, 11, 33, 44, 55, 66],
            val: [22, 11, 45, 18, 29, 2]
        }
    }, { assert: assert });
});

QUnit.test("mode - smallValueThreshold. groupName is default", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 22 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 11 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie",
            smallValuesGrouping: { mode: "smallValueThreshold", threshold: 33 }
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas", "others"],
            val1: [undefined, 33, undefined, 44, 55, 33]
        }
    }, { assert: assert });
});

QUnit.test("mode - smallValueThreshold. groupName is defined as string", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 22 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 11 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie",
            smallValuesGrouping: {
                mode: "smallValueThreshold", threshold: 33, groupName: "another values"
            }
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas", "another values"],
            val1: [undefined, 33, undefined, 44, 55, 33]
        }
    }, { assert: assert });
});

QUnit.test("mode - smallValueThreshold. groupName is defined as not string", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 22 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 11 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            argumentAxisType: "discrete",
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie",
            smallValuesGrouping: { mode: "smallValueThreshold", threshold: 33, groupName: 123 }
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas", "123"],
            val1: [undefined, 33, undefined, 44, 55, 33]
        }
    }, { assert: assert });
});

QUnit.test("mode - smallValueThreshold. threshold is not specified", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 22 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 11 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie"
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas"],
            val1: [22, 33, 11, 44, 55]
        }
    }, { assert: assert });
});

QUnit.test("mode - smallValueThreshold. threshold is zero", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 0 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 0 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie"
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas"],
            val1: [0, 33, 0, 44, 55]
        }
    }, { assert: assert });
});

QUnit.test("mode - smallValueThreshold. threshold less zero", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 0 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 0 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie"
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas"],
            val1: [0, 33, 0, 44, 55]
        }
    }, { assert: assert });
});

QUnit.test("mode - smallValueThreshold. threshold is more than max data", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 10 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 10 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie",
            smallValuesGrouping: { mode: "smallValueThreshold", threshold: 70 }
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas", "others"],
            val1: [undefined, undefined, undefined, undefined, undefined, 152]
        }
    }, { assert: assert });
});

QUnit.test("mode - smallValueThreshold. some series has the same name", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 11 }, { arg: "oranges", val1: 33 }, { arg: "apples", val1: 22 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            argumentAxisType: "discrete",
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie",
            smallValuesGrouping: { mode: "smallValueThreshold", threshold: 40 }
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "apples", "oranges", "kiwi", "bananas", "others"],
            val1: [undefined, undefined, undefined, 44, 55, 66]
        }
    }, { assert: assert });
});

QUnit.test("mode - topN", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 22 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 11 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie",
            smallValuesGrouping: { mode: "topN", topCount: 2 }
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas", "others"],
            val1: [undefined, undefined, undefined, 44, 55, 66]
        }
    }, { assert: assert });
});

QUnit.test("mode - topN, top count is not defined", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 22 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 11 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie",
            smallValuesGrouping: { mode: "topN" }
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas"],
            val1: [22, 33, 11, 44, 55]
        }
    }, { assert: assert });
});

QUnit.test("mode - topN, top count is zero", function(assert) {
    var parsedData = testValidateData([{ arg: "apples", val1: 22 }, { arg: "oranges", val1: 33 }, { arg: "tomatoes", val1: 11 }, { arg: "kiwi", val1: 44 }, { arg: "bananas", val1: 55 }],
        createGroupsData({
            valueType: "numeric",
            valueFields: ["val1"],
            type: "pie",
            smallValuesGrouping: { mode: "topN", topCount: 0 }
        }), null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "oranges", "tomatoes", "kiwi", "bananas", "others"],
            val1: [undefined, undefined, undefined, undefined, undefined, 165]
        }
    }, { assert: assert });
});

QUnit.test("mode - topN, some objects has same name", function(assert) {
    var groupData1 = createGroupsData({
            argumentAxisType: "discrete",
            argumentField: "arg",
            valueFields: "val1",
            type: "pie",
            smallValuesGrouping: { mode: "topN", topCount: 2 }
        }),
        groupData2 = createGroupsData({
            argumentAxisType: "discrete",
            argumentField: "arg",
            valueFields: "val2",
            type: "pie",
            smallValuesGrouping: { mode: "topN", topCount: 2 }
        }),
        groupsData = { groups: groupData1.groups.concat(groupData2.groups) },
        parsedData = testValidateData([
            { arg: "apples", val1: 22, val2: 77 }, { arg: "oranges", val1: 33, val2: 11 }, { arg: "apples", val1: 11, val2: 5 },
            { arg: "oranges", val1: 7, val2: 5 }, { arg: "kiwi", val1: 44, val2: 65 }, { arg: "bananas", val1: 55, val2: 45 }
        ], groupsData, null, { sortingMethod: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: ["apples", "apples", "oranges", "oranges", "kiwi", "bananas", "others", "others"],
            val1: [undefined, undefined, undefined, undefined, 44, 55, 73, undefined],
            val2: [77, undefined, undefined, undefined, 65, undefined, undefined, 66]
        }
    }, { assert: assert });
});

QUnit.module("options");

QUnit.test("Define type from first value", function(assert) {
    var groupData = new createGroupsData();

    testValidateData([{ arg: 11, val: 1 }, { arg: "22", val: "2" }, { arg: 33, val: 3 }], groupData);

    assert.equal(groupData.groups[0].series[0].updateDataType.lastCall.args[0].argumentAxisType, "continuous", "AxisType continuous");
    assert.equal(groupData.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, "numeric", "Type numeric");
    assert.equal(groupData.groups[0].series[0].updateDataType.lastCall.args[0].valueAxisType, "continuous");
    assert.equal(groupData.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "numeric");
});

QUnit.test("Define type from All data value", function(assert) {
    var groupData = new createGroupsData();

    testValidateData([{ arg: 11, val: 1 }, { arg: "22", val: "2" }, { arg: 33, val: 3 }], groupData, null, { checkTypeForAllData: true });

    assert.equal(groupData.groups[0].series[0].updateDataType.lastCall.args[0].argumentAxisType, "discrete", "AxisType discrete");
    assert.equal(groupData.groups[0].series[0].updateDataType.lastCall.args[0].argumentType, "string", "Type string");
    assert.equal(groupData.groups[0].series[0].updateDataType.lastCall.args[0].valueAxisType, "discrete");
    assert.equal(groupData.groups[0].series[0].updateDataType.lastCall.args[0].valueType, "string");
});

QUnit.test("Not parse data.", function(assert) {
    var parsedData = testValidateData([{ arg: 2, val: 22 }, { arg: 1, val: "11" }, { arg: 5, val: "55" }, { arg: 4, val: 44 }, { arg: 3, val: 33 }], createGroupsData(), null, { convertToAxisDataType: false });

    checkParsedData(parsedData, {
        "arg": {
            arg: [2, 1, 5, 4, 3],
            val: [22, "11", "55", 44, 33]
        }
    }, { assert: assert });
});

QUnit.module("incidentOccurred");

QUnit.test("Wrong input data (format. numbers)", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([1, 2, 3, 4, 5], createGroupsData(), incidentOccurred);

    assert.deepEqual(parsedData.arg, [], "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2001"], "incident");
});

QUnit.test("Wrong input data (format. arrays)", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([[1], [2], [3], [4], [5]], createGroupsData(), incidentOccurred);

    assert.deepEqual(parsedData.arg, [], "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2001"], "incident");
});

QUnit.test("Wrong input data (missing)", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([null, 2, 3, 4, 5], createGroupsData(), incidentOccurred);

    assert.deepEqual(parsedData.arg, [], "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2001"], "incident");
});

QUnit.test("Incompatible argument and axis types", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1 }, { arg: 2, val: 2 }, { arg: 3, val: 3 }, { arg: 4, val: 4 }, { arg: 5, val: 5 }
        ], createGroupsData({ argumentType: "string", argumentAxisType: "continuous" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2002"], "incident");
});

QUnit.test("Incompatible value and axis types", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1 }, { arg: 2, val: 2 }, { arg: 3, val: 3 }, { arg: 4, val: 4 }, { arg: 5, val: 5 }
        ], createGroupsData({ valueType: "string", valueAxisType: "continuous" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2002"], "incident");
});

QUnit.test("Incompatible types, semidiscrete axis", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1 }, { arg: 2, val: 2 }, { arg: 3, val: 3 }, { arg: 4, val: 4 }, { arg: 5, val: 5 }
        ], createGroupsData({ valueType: "string", valueAxisType: "semidiscrete" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2002"], "incident");
});

QUnit.test("Input data with argument of wrong type", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: [1, 2], val: 1 }, { arg: 2, val: 2 }, { arg: 3, val: 3 }, { arg: [3, 4], val: 4 }, { arg: 5, val: 5 }
        ], createGroupsData(), incidentOccurred, { checkTypeForAllData: true });

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.getCall(0).args, ["E2003", ["arg"]], "incident 1");
    assert.deepEqual(incidentOccurred.getCall(1).args, ["E2003", ["arg"]], "incident 2");
});

QUnit.test("Input data with value of wrong type", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: { d: 2 } }, { arg: 2, val: 2 }, { arg: 3, val: 3 }, { arg: 4, val: 4 }, { arg: 5, val: 5 }
        ], createGroupsData(), incidentOccurred, { checkTypeForAllData: true });

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2003", ["val"]], "incident");
});

QUnit.test("Input data with size of wrong type", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1, size: { d: 2 } }, { arg: 2, val: 2, size: 2 }, { arg: 3, val: 3, size: 2 }, { arg: 4, val: 4, size: 2 }, { arg: 5, val: 5, size: 2 }
        ], createGroupsData({ sizeField: "size" }), incidentOccurred, { checkTypeForAllData: true });

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2003", ["size"]], "incident");
});

QUnit.test("Missing numeric argument.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1 }, { arg: 2, val: 2 }, { arg: null, val: 3 }, { arg: 4, val: 4 }, { arg: 5, val: 5 }
        ], createGroupsData(), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Missing datetime argument", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: new Date(1000), val: 1 }, { arg: new Date(2000), val: 2 }, { arg: null, val: 3 }, { arg: new Date(4000), val: 4 }, { arg: new Date(5000), val: 5 }
        ], createGroupsData(), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Missing string argument.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: "1", val: 1 }, { arg: "2", val: 2 }, { arg: null, val: 3 }, { arg: "4", val: 4 }, { arg: "5", val: 5 }
        ], createGroupsData(), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Can not parse numeric argument.", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1 }, { arg: 2, val: 2 }, { arg: "sf", val: 3 }, { arg: 4, val: 4 }, { arg: 5, val: 5 }
        ], createGroupsData({ argumentType: "numeric" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2004", ["arg"]], "incident");
});

QUnit.test("Can not parse datetime argument", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: new Date(1000), val: 1 }, { arg: new Date(2000), val: 2 }, { arg: "df", val: 3 }, { arg: new Date(4000), val: 4 }, { arg: new Date(5000), val: 5 }
        ], createGroupsData({ argumentType: "datetime" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2004", ["arg"]], "incident");
});

QUnit.test("Missing numeric value.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1 }, { arg: 2, val: 2 }, { arg: 3, val: null }, { arg: 4, val: 4 }, { arg: 5, val: 5 }
        ], createGroupsData(), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Missing datetime value.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: new Date(1000), val: 1 }, { arg: new Date(2000), val: 2 }, { arg: new Date(3000), val: null }, { arg: new Date(4000), val: 4 }, { arg: new Date(5000), val: 5 }
        ], createGroupsData(), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Missing string value.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: "1", val: 1 }, { arg: "2", val: 2 }, { arg: "3", val: null }, { arg: "4", val: 4 }, { arg: "5", val: 5 }
        ], createGroupsData(), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Can not parse numeric value", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1 }, { arg: 2, val: 2 }, { arg: 3, val: "ups" }, { arg: 4, val: 4 }, { arg: 5, val: 5 }
        ], createGroupsData({ valueType: "numeric" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2004", ["val"]], "incident");
});

QUnit.test("Can not parse datetime value", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: new Date(1000) }, { arg: 2, val: new Date(2000) }, { arg: 3, val: "df" }, { arg: 4, val: new Date(4000) }, { arg: 5, val: new Date(5000) }
        ], createGroupsData({ valueType: "datetime" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2004", ["val"]], "incident");
});

QUnit.test("Missing size. should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1, size: 1 }, { arg: 2, val: 2, size: 1 }, { arg: 3, val: 3, size: null }, { arg: 4, val: 4, size: 1 }, { arg: 5, val: 5, size: 1 }
        ], createGroupsData({ sizeField: "size" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Can not parse size", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1, size: 1 }, { arg: 2, val: 2, size: 1 }, { arg: 3, val: 1, size: "ups" }, { arg: 4, val: 4, size: 1 }, { arg: 5, val: 5, size: 1 }
        ], createGroupsData({ sizeField: "size" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2004", ["size"]], "incident");
});

QUnit.test("No any value in val field.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: new Date(1000) }, { arg: 2, val: new Date(2000) }, { arg: 3 }, { arg: 4, val: new Date(4000) }, { arg: 5, val: new Date(5000) }
        ], createGroupsData({ valueType: "datetime" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("No any value in arg field.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: new Date(1000) }, { arg: 2, val: new Date(2000) }, { val: new Date(3000) }, { arg: 4, val: new Date(4000) }, { arg: 5, val: new Date(5000) }
        ], createGroupsData({ valueType: "datetime" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("No any value in size field.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: 1, size: 1 }, { arg: 2, val: 2, size: 2 }, { arg: 3, val: 3 }, { arg: 4, val: 4, size: 4 }, { arg: 5, val: 5, size: 5 }
        ], createGroupsData({ sizeField: "size" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 5, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Element is null.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: new Date(1000) }, { arg: 2, val: new Date(2000) }, null, { arg: 4, val: new Date(4000) }, { arg: 5, val: new Date(5000) }
        ], createGroupsData({ valueType: "datetime" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 4, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Element is undefined.should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([
            { arg: 1, val: new Date(1000) }, { arg: 2, val: new Date(2000) }, { arg: 4, val: new Date(4000) }, undefined, { arg: 5, val: new Date(5000) }
        ], createGroupsData({ valueType: "datetime", argumentType: "numeric" }), incidentOccurred);

    assert.strictEqual(parsedData.arg.length, 4, "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

QUnit.test("Source not array", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData({}, createGroupsData({ valueType: "datetime" }), incidentOccurred);

    assert.deepEqual(parsedData.arg, [], "data");
    assert.deepEqual(incidentOccurred.lastCall.args, ["E2001"], "incident");
});

QUnit.test("Source is not defined. should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData1 = testValidateData(undefined, createGroupsData({ valueType: "datetime" }), incidentOccurred),
        parsedData2 = testValidateData(null, createGroupsData({ valueType: "datetime" }), incidentOccurred);

    assert.deepEqual(parsedData1.arg, [], "data1");
    assert.deepEqual(parsedData2.arg, [], "data2");
    assert.strictEqual(incidentOccurred.callCount, 0, "incident occured should not be called");
});

QUnit.test("Source empty array. should not call incidentOccurred", function(assert) {
    var incidentOccurred = sinon.spy(),
        parsedData = testValidateData([], createGroupsData({ valueType: "datetime" }), incidentOccurred);

    assert.deepEqual(parsedData.arg, [], "data");
    assert.strictEqual(incidentOccurred.lastCall, null, "incident");
});

function createStubSeries(options) {
    var mockSeries,
        prepOptions;

    options.argumentField = options.argumentField ? options.argumentField : "arg";
    options.valueFields = options.valueFields ? options.valueFields : "val";
    prepOptions = {
        argumentField: options.argumentField,
        valueFields: Array.isArray(options.valueFields) ? options.valueFields : [options.valueFields]
    };
    $.extend(options, prepOptions);
    mockSeries = sinon.createStubInstance(seriesModule.Series);
    mockSeries.getArgumentField.returns(options.argumentField);
    mockSeries.getValueFields.returns(options.valueFields);
    mockSeries.getSizeField.returns(options.sizeField);
    mockSeries.getOptions.returns(options);
    mockSeries.type = options.type;
    return mockSeries;
}

function createGroupsData(opt, isEmpty) {
    var options = opt || {},
        mockSeries = createStubSeries(options),
        valueGroup = isEmpty ? [] : [mockSeries],
        argumentGroup = { groups: [{ series: valueGroup }] },
        valueAxis = new MockAxis({ renderer: new vizMocks.Renderer() }),
        argumentAxis = new MockAxis({ renderer: new vizMocks.Renderer() });

    valueAxis.updateOptions({});
    argumentAxis.updateOptions({});

    valueAxis.resetTypes = sinon.spy();
    argumentAxis.resetTypes = sinon.spy();

    argumentGroup.groups[0].valueAxis = valueAxis;
    argumentGroup.argumentAxes = [argumentAxis];

    argumentGroup.groups[0].valueOptions = {
        categories: options.valueCategories,
        type: options.valueAxisType,
        valueType: options.valueType
    };
    argumentGroup.argumentOptions = {
        categories: options.argumentCategories,
        type: options.argumentAxisType,
        argumentType: options.argumentType
    };

    return argumentGroup;
}

function testValidateData(data, groupsData, incidentOccurred, options) {
    return dataValidatorModule.validateData(data, groupsData, incidentOccurred || commonUtils.noop, $.extend(true, {
        checkTypeForAllData: false,
        convertToAxisDataType: true,
        sortingMethod: null
    }, options));
}

function checkParsedData(data, expectedData, assertionOptions) {
    $.each(expectedData, function(argField, expectedDataItem) {
        $.each(expectedDataItem, function(fieldForCheck, valuesForCheck) {
            assertionOptions.assert.equal(valuesForCheck.length, data[argField].length, fieldForCheck + ". length of items for current record is equal");
            $.each(data[argField], function(index, item) {
                assertionOptions.assert[assertionOptions.compare || "strictEqual"](item[fieldForCheck], valuesForCheck[index], fieldForCheck + " " + index);
            });
        });
    });
}
