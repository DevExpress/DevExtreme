"use strict";

var $ = require("jquery");

var utils = require("ui/filter_builder/utils");
require("ui/filter_builder/filter_builder");

QUnit.testStart(function() {
    var markup =
        '<div id="container"></div>';

    $("#qunit-fixture").html(markup);
});

var FILTER_BUILDER_CLASS = "dx-filterbuilder";

var fields = [{
    caption: "Company Name",
    dataField: "CompanyName",
    dataType: "string",
    format: undefined,
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
    defaultFilterOperation: "",
    customizeText: function(args) {

    }
}, {
    caption: "Date",
    dataField: "Date",
    dataType: "date",
    format: "shortDate",
    filterOperations: ["=", "<>", "<", ">", "<=", ">="],
    defaultFilterOperation: "",
    customizeText: function(args) {

    }
}, {
    caption: "State",
    dataField: "State",
    dataType: "string",
    format: undefined,
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
    defaultFilterOperation: "",
    customizeText: function(args) {

    }
}, {
    caption: "Zipcode",
    dataField: "Zipcode",
    dataType: "number",
    format: undefined,
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
    defaultFilterOperation: ["=", "<>", "<", ">", "<=", ">="],
    customizeText: function(args) {

    }
},
{
    caption: "Contributor",
    dataField: "Contributor",
    dataType: "boolean",
    format: undefined,
    filterOperations: [],
    defaultFilterOperation: "",
    customizeText: function(args) {

    }
}];

var condition1 = ["CompanyName", "=", "Super Mart of the West"];
var condition2 = ["CompanyName", "=", "Super Mart of the West2"];
var condition3 = ["CompanyName", "=", "Super Mart of the West3"];

QUnit.test("markup init", function(assert) {
    var element = $("#container").dxFilterBuilder();

    // assert
    assert.ok(element.hasClass(FILTER_BUILDER_CLASS), "widget has dx-filterbuilder class");
    assert.equal(element.width(), 400, "default widget width");
    assert.equal(element.height(), 300, "default widget height");

});

QUnit.test("throws", function(assert) {
    assert.throws(
        function() {
            utils.getField("Field1", fields);
        },
        "Field has not found"
    );

    assert.throws(
        function() {
            utils.parseFilter([
                ["CompanyName", "=", "Value1"],
                "And",
                ["Zipcode", "=", "Value2"],
                "Or",
                ["CompanyName", "=", "Value2"]
            ], fields);
        },
        "Throw exception when \"And\" and \"Or\" operations are together in the same group"
    );
});

QUnit.test("getGroupValue", function(assert) {
    var group = [
        condition1,
        "And",
        condition2,
        "And",
        condition3
    ];
    var groupValue = utils.getGroupValue(group);
    assert.equal(groupValue, "And");


    group = ["!", group];
    groupValue = utils.getGroupValue(group);
    assert.equal(groupValue, "Not And");
});

QUnit.test("setGroupValue", function(assert) {
    var group = [
        condition1,
        "And",
        condition2,
        "And",
        condition3
    ];
    group = utils.setGroupValue(group, "Or");
    // assert
    assert.equal(group[0], condition1);
    assert.equal(group[1], "Or");
    assert.equal(group[2], condition2);
    assert.equal(group[3], "Or");
    assert.equal(group[4], condition3);

    group = utils.setGroupValue(group, "Not Or");
    // assert
    assert.equal(group[0], "!");
    assert.equal(group.length, 2);
    assert.equal(group[1][0], condition1);
    assert.equal(group[1][1], "Or");
    assert.equal(group[1].length, 5);


    group = utils.setGroupValue(group, "And");
    // assert
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group[2], condition2);
    assert.equal(group[3], "And");
    assert.equal(group[4], condition3);
    assert.equal(group.length, 5);
});

QUnit.test("removeItem", function(assert) {
    var group = [
        condition1,
        "And",
        condition2,
        "And",
        condition3
    ];
    group = utils.removeItem(group, condition1);
    // assert
    assert.equal(group[0], condition2);
    assert.equal(group[1], "And");
    assert.equal(group[2], condition3);
    assert.equal(group.length, 3);

    group = utils.removeItem(group, condition2);
    assert.equal(group[0], condition3);
    assert.equal(group[1], "And");
    assert.equal(group.length, 2);

    group = utils.removeItem(group, condition3);
    assert.equal(group[0], "And");
    assert.equal(group.length, 1);

    group = [
        condition1,
        "And",
        condition2,
        "And",
        condition3
    ];

    group = utils.removeItem(group, condition3);
    // assert
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group[2], condition2);
    assert.equal(group.length, 3);

    group = utils.removeItem(group, condition2);
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group.length, 2);

    group = utils.removeItem(group, condition1);
    assert.equal(group[0], "And");
    assert.equal(group.length, 1);

    group = [
        condition1,
        "And",
        condition2,
        "And",
        condition3
    ];

    group = utils.removeItem(group, condition2);
    // assert
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group[2], condition3);
    assert.equal(group.length, 3);

    group = ["!", [
        condition1,
        "And",
        condition2,
        "And",
        condition3
    ]];

    group = utils.removeItem(group, condition2);
    // assert
    assert.equal(group[0], "!");
    assert.equal(group.length, 2);
    assert.equal(group[1][0], condition1);
    assert.equal(group[1][1], "And");
    assert.equal(group[1][2], condition3);
    assert.equal(group[1].length, 3);
});

QUnit.test("isGroup", function(assert) {
    assert.ok(utils.isGroup([[], "And", []]));
    assert.ok(utils.isGroup(["And"]));
});

QUnit.test("addItem", function(assert) {
    var group = [];
    group = utils.addItem(condition1, group);
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group.length, 2);

    group = ["And"];
    group = utils.addItem(condition1, group);
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group.length, 2);

    group = utils.addItem(condition2, group);
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group[2], condition2);
    assert.equal(group.length, 3);

    group = [condition1, "And", condition2];
    group = utils.addItem(condition3, group);
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group[2], condition2);
    assert.equal(group[3], "And");
    assert.equal(group[4], condition3);
    assert.equal(group.length, 5);

    group = ["!", [condition1, "And", condition2]];
    group = utils.addItem(condition3, group);
    assert.equal(group[0], "!");
    assert.equal(group.length, 2);
    assert.equal(group[1][3], "And");
    assert.equal(group[1][4], condition3);
    assert.equal(group[1].length, 5);
});

QUnit.test("get normalized filter", function(assert) {
    var group = [];
    group = utils.getNormalizedFilter(group);
    assert.equal(group, null);

    group = ["And"];
    group = utils.getNormalizedFilter(group);
    assert.equal(group, null);

    group = [condition1, "And"];
    group = utils.getNormalizedFilter(group);
    assert.equal(group[0], condition1[0]);
    assert.equal(group[1], condition1[1]);
    assert.equal(group[2], condition1[2]);
    assert.equal(group.length, 3);

    group = [condition1, "And", [condition2, "And"]];
    group = utils.getNormalizedFilter(group);
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group[2][0], condition2[0]);
    assert.equal(group[2][1], condition2[1]);
    assert.equal(group[2][2], condition2[2]);
    assert.equal(group.length, 3);

    group = [condition1, "And", condition2, "And", ["And"]];
    group = utils.getNormalizedFilter(group);
    assert.equal(group[0], condition1);
    assert.equal(group[1], "And");
    assert.equal(group[2], condition2);
    assert.equal(group.length, 3);

    group = [condition1, "And", ["And"]];
    group = utils.getNormalizedFilter(group);
    assert.equal(group[0], condition1[0]);
    assert.equal(group[1], condition1[1]);
    assert.equal(group[2], condition1[2]);
    assert.equal(group.length, 3);

    group = ["!", [condition1, "And", ["And"]]];
    group = utils.getNormalizedFilter(group);
    assert.equal(group[0], "!");
    assert.equal(group.length, 2);
    assert.equal(group[1][0], condition1[0]);
    assert.equal(group[1][1], condition1[1]);
    assert.equal(group[1][2], condition1[2]);
    assert.equal(group[1].length, 3);
});


QUnit.test("get current value text", function(assert) {
    var field = {},
        value = "";
    assert.equal(utils.getCurrentValueText({}, ""), "");

    field = { format: "shortDate" };
    value = new Date("Tue Sep 05 2017 00:00:00 GMT+0300 (Russia TZ 2 Standard Time)");
    assert.equal(utils.getCurrentValueText(field, value), "9/5/2017");

    field = { dataType: "boolean" };
    value = true;
    assert.equal(utils.getCurrentValueText(field, value), "true");

    field = { dataType: "boolean", falseText: "False Text" };
    value = false;
    assert.equal(utils.getCurrentValueText(field, value), "False Text");

    field = {
        customizeText: function(conditionInfo) {
            return conditionInfo.valueText + "Test";
        }
    };
    value = "MyValue";
    assert.equal(utils.getCurrentValueText(field, value), "MyValueTest");
});
