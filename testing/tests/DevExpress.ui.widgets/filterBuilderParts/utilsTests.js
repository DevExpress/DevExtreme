"use strict";

/* global fields */

var utils = require("ui/filter_builder/utils");

var condition1 = ["CompanyName", "=", "Super Mart of the West"],
    condition2 = ["CompanyName", "=", "Super Mart of the West2"],
    condition3 = ["CompanyName", "=", "Super Mart of the West3"];

var groupOperations = [{
    text: "And",
    value: "And"
}, {
    text: "Or",
    value: "Or"
}, {
    text: "Not And",
    value: "!And"
}, {
    text: "Not Or",
    value: "!Or"
}];

QUnit.module("Utils");

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
    assert.equal(groupValue, "!And");
});

QUnit.test("getGroupMenuItem", function(assert) {
    var group = ["!",
        [
            condition1,
            "And",
            condition2,
            "And",
            condition3
        ]
    ];
    assert.deepEqual(utils.getGroupMenuItem(group, groupOperations), { text: "Not And", value: "!And" });
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

    group = utils.setGroupValue(group, "!Or");
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

    group = [
        condition1,
        condition2
    ];
    group = utils.setGroupValue(group, "!Or");
    // assert
    assert.equal(group[0], "!");
    assert.equal(group.length, 2);
    assert.equal(group[1][0], condition1);
    assert.equal(group[1][1], "Or");
    assert.equal(group[1][2], condition2);
    assert.equal(group[1].length, 3);
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

    group = ["!", [
        condition1,
        condition2,
        condition3
    ]];
    group = utils.removeItem(group, condition2);
    assert.equal(group[0], "!");
    assert.equal(group.length, 2);
    assert.equal(group[1][0], condition1);
    assert.equal(group[1][1], condition3);
    assert.equal(group[1].length, 2);
});

QUnit.test("isGroup", function(assert) {
    assert.ok(utils.isGroup([[], "And", []]));
    assert.ok(utils.isGroup(["And"]));
});

QUnit.test("isCondition", function(assert) {
    assert.ok(utils.isCondition(["Column1", "=", "value"]));
    assert.ok(utils.isCondition(["Column1", "="]));
    assert.ok(!utils.isCondition([[], "And", []]));
    assert.ok(!utils.isCondition(["And"]));
});

QUnit.test("getAvailableOperations", function(assert) {
    var operations = utils.getAvailableOperations(["=", "<>", "contains"]);

    assert.strictEqual(operations[0].text, "Equals");
    assert.strictEqual(operations[0].icon, "equal");
    assert.strictEqual(operations[1].text, "Does not equal");
    assert.strictEqual(operations[1].icon, "notequal");
    assert.strictEqual(operations[2].text, "Contains");
    assert.strictEqual(operations[2].icon, "contains");
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

    group = ["!", [condition1, condition2]];
    group = utils.addItem(condition3, group);
    assert.equal(group[0], "!");
    assert.equal(group.length, 2);
    assert.equal(group[1][2], condition3);
    assert.equal(group[1].length, 3);
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

QUnit.test("get group value", function(assert) {
    assert.equal(utils.getGroupValue([]), "And");
    assert.equal(utils.getGroupValue(["Or"]), "Or");
    assert.equal(utils.getGroupValue(["!", ["Or"]]), "!Or");
    assert.equal(utils.getGroupValue(["!", ["And"]]), "!And");
    assert.equal(utils.getGroupValue([["column", "operation", "value"]]), "And");
    assert.equal(utils.getGroupValue([["column", "operation", "value"], ["column", "operation", "value"]]), "And");
});

QUnit.test("get current value text", function(assert) {
    var field = {},
        value = "";
    assert.equal(utils.getCurrentValueText({}, ""), "");

    value = "Text";
    assert.equal(utils.getCurrentValueText({}, "Text"), "Text");

    field = { format: "shortDate" };
    value = new Date(2017, 8, 5);
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

QUnit.test("create condition", function(assert) {
    var condition = utils.createCondition(fields[0]);
    assert.equal(condition[0], "CompanyName");
    assert.equal(condition[1], "Contains");
    assert.equal(condition[2], "");
});

QUnit.test("getPlainItems", function(assert) {
    var hierarchicalFields = [{
        caption: "Group",
        dataField: "group",
        dataType: "object"
    }, {
        caption: "Group Field1",
        dataField: "group.field1",
        dataType: "string"
    }, {
        caption: "Group Group2",
        dataField: "group.group2",
        dataType: "object"
    }, {
        caption: "Group Group2 Field2",
        dataField: "group.group2.field2",
        dataType: "string"
    }, {
        caption: "Group Group2 Field3",
        dataField: "group.group2.field3",
        dataType: "string"
    }];

    var plainItems = utils.getPlainItems(hierarchicalFields);
    assert.deepEqual(plainItems, [{
        caption: "Group",
        dataField: "group",
        dataType: "object"
    }, {
        caption: "Group Field1",
        dataField: "group.field1",
        dataType: "string",
        parentId: "group"
    }, {
        caption: "Group Group2",
        dataField: "group.group2",
        dataType: "object",
        parentId: "group"
    }, {
        caption: "Group Group2 Field2",
        dataField: "group.group2.field2",
        dataType: "string",
        parentId: "group.group2"
    }, {
        caption: "Group Group2 Field3",
        dataField: "group.group2.field3",
        dataType: "string",
        parentId: "group.group2"
    }]);


    hierarchicalFields = [{
        caption: "Group Field1",
        dataField: "group.field1",
        dataType: "string"
    }, {
        caption: "Group Group2 Field3",
        dataField: "group.group2.field3",
        dataType: "string"
    }, {
        caption: "Group3 Field4",
        dataField: "group3.field4",
        dataType: "string"
    }, {
        caption: "Group3",
        dataField: "group3",
        dataType: "object",
        filterOperations: ["isblank", "isnotblank"]
    }];

    plainItems = utils.getPlainItems(hierarchicalFields);
    assert.deepEqual(plainItems, [{
        caption: "group",
        dataField: "group",
        dataType: "object",
        filterOperations: ["isblank", "isnotblank"]
    }, {
        caption: "Group Field1",
        dataField: "group.field1",
        dataType: "string",
        parentId: "group"
    }, {
        caption: "group2",
        dataField: "group.group2",
        dataType: "object",
        parentId: "group",
        filterOperations: ["isblank", "isnotblank"]
    }, {
        caption: "Group Group2 Field3",
        dataField: "group.group2.field3",
        dataType: "string",
        parentId: "group.group2"
    }, {
        caption: "Group3 Field4",
        dataField: "group3.field4",
        dataType: "string",
        parentId: "group3"
    }, {
        caption: "Group3",
        dataField: "group3",
        dataType: "object",
        filterOperations: ["isblank", "isnotblank"]
    }]);
});

QUnit.test("getCaptionWithParents", function(assert) {
    var plainField = {
        caption: "Field3",
        dataField: "group.group2.field3",
        dataType: "string",
        parentId: "group.group2"
    };

    var plainItems = [{
        caption: "Group",
        dataField: "group",
        dataType: "object"
    }, {
        caption: "Group2",
        dataField: "group.group2",
        dataType: "object",
        parentId: "group"
    }, plainField ];

    assert.equal(utils.getCaptionWithParents(plainField, plainItems), "Group.Group2.Field3");
});

QUnit.test("updateConditionByOperator", function(assert) {
    assert.deepEqual(utils.updateConditionByOperator(["value", "=", "123"], "isblank"), ["value", "=", null]);
    assert.deepEqual(utils.updateConditionByOperator(["value", "=", "123"], "isnotblank"), ["value", "<>", null]);
    assert.deepEqual(utils.updateConditionByOperator(["value", "=", "123"], "<="), ["value", "<=", "123"]);
    assert.deepEqual(utils.updateConditionByOperator(["value", "=", null], "<="), ["value", "<=", ""]);
});

