"use strict";

/* global fields */

var utils = require("ui/filter_builder/utils");

var condition1 = ["CompanyName", "=", "Super Mart of the West"],
    condition2 = ["CompanyName", "=", "And"],
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
    }],
    filterOperationsDescriptions = {
        equal: "Equals",
        notEqual: "Does not equal",
        lessThan: "Less than",
        lessThanOrEqual: "Less than or equal to",
        greaterThan: "Greater than",
        greaterThanOrEqual: "Greater than or equal to",
        startsWith: "Starts with",
        contains: "Contains",
        notContains: "Does not contain",
        endsWith: "Ends with",
        isBlank: "Is blank",
        isNotBlank: "Is not blank"
    };

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
    var group = [condition1, "And", condition2, "And", condition3];
    group = utils.setGroupValue(group, "Or");
    assert.deepEqual(group, [condition1, "Or", condition2, "Or", condition3]);

    group = utils.setGroupValue(group, "!Or");
    assert.deepEqual(group, ["!", [condition1, "Or", condition2, "Or", condition3]]);

    group = utils.setGroupValue(group, "And");
    assert.deepEqual(group, [condition1, "And", condition2, "And", condition3]);

    group = [condition1, condition2];
    group = utils.setGroupValue(group, "!Or");
    assert.deepEqual(group, ["!", [condition1, "Or", condition2]]);

    group = [];
    group = utils.setGroupValue(group, "!Or");
    assert.deepEqual(group, ["!", ["Or"]]);

    group = utils.setGroupValue(group, "And");
    assert.deepEqual(group, ["And"]);
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

    var innerGroup = ["And"];
    group = [condition1, innerGroup];
    utils.addItem(condition2, innerGroup);
    assert.deepEqual(group, [condition1, [condition2, "And"]]);
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
    assert.equal(group, condition1);

    group = [[condition1]];
    group = utils.getNormalizedFilter(group);
    assert.equal(group, condition1);

    group = [condition1, "And", [condition2, "And"]];
    group = utils.getNormalizedFilter(group);
    assert.equal(group[0], condition1);
    assert.equal(group[1], condition2);

    group = [condition1, "Or", [condition2, "Or"]];
    group = utils.getNormalizedFilter(group);
    assert.deepEqual(group, [condition1, "Or", condition2]);

    group = [condition1, "And", condition2, "And", ["And"]];
    group = utils.getNormalizedFilter(group);
    assert.deepEqual(group, [condition1, condition2]);

    group = [condition1, "And", condition2, "And", ["And"], "And", ["And"], "And", ["And"], "And", ["And"]];
    group = utils.getNormalizedFilter(group);
    assert.deepEqual(group, [condition1, condition2]);
    assert.equal(group[0], condition1);

    group = [condition1, "And", ["And"]];
    group = utils.getNormalizedFilter(group);
    assert.deepEqual(group, condition1);

    group = ["!", [condition1, "And", ["And"]]];
    group = utils.getNormalizedFilter(group);
    assert.deepEqual(group, ["!", condition1]);

    group = ["!", [condition1, "And", condition2]];
    group = utils.getNormalizedFilter(group);
    assert.deepEqual(group, ["!", [condition1, condition2]]);
    assert.equal(group[1][0], condition1);

    group = [[condition1, "And", condition2], [condition3, "And", condition2]];
    group = utils.getNormalizedFilter(group);
    assert.deepEqual(group, [[condition1, condition2], [condition3, condition2]]);
    assert.equal(group[1][0], condition3);
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

QUnit.test("getItems", function(assert) {
    var fields = [{
        dataField: "field1",
        dataType: "string"
    }, {
        dataField: "field2",
        dataType: "string"
    }, {
        dataField: "group.field3",
        dataType: "string"
    }];

    var items = utils.getItems(fields);

    assert.deepEqual(items, [{
        caption: "Field 1",
        dataField: "field1",
        dataType: "string"
    }, {
        caption: "Field 2",
        dataField: "field2",
        dataType: "string"
    }, {
        caption: "Group.Field 3",
        dataField: "group.field3",
        dataType: "string"
    }]);
});

QUnit.test("getItems when allowHierarchicalFields is true", function(assert) {
    var hierarchicalFields = [{
        dataField: "group",
        dataType: "object"
    }, {
        dataField: "group.field1",
        dataType: "string"
    }, {
        dataField: "group.group2",
        dataType: "object"
    }, {
        dataField: "group.group2.field2",
        dataType: "string"
    }, {
        dataField: "group.group2.field3",
        dataType: "string"
    }];

    var plainItems = utils.getItems(hierarchicalFields, true);
    assert.deepEqual(plainItems, [{
        caption: "Group",
        dataField: "group",
        dataType: "object"
    }, {
        caption: "Field 1",
        dataField: "group.field1",
        dataType: "string",
        parentId: "group"
    }, {
        caption: "Group 2",
        dataField: "group.group2",
        dataType: "object",
        parentId: "group"
    }, {
        caption: "Field 2",
        dataField: "group.group2.field2",
        dataType: "string",
        parentId: "group.group2"
    }, {
        caption: "Field 3",
        dataField: "group.group2.field3",
        dataType: "string",
        parentId: "group.group2"
    }]);


    hierarchicalFields = [{
        dataField: "group.field1",
        dataType: "string"
    }, {
        dataField: "group.group2.field3",
        dataType: "string"
    }, {
        dataField: "group3.field4",
        dataType: "string"
    }, {
        dataField: "group3",
        dataType: "object",
        filterOperations: ["isblank", "isnotblank"]
    }];

    plainItems = utils.getItems(hierarchicalFields, true);
    assert.deepEqual(plainItems, [{
        caption: "Group",
        dataField: "group",
        dataType: "object",
        filterOperations: ["isblank", "isnotblank"]
    }, {
        caption: "Field 1",
        dataField: "group.field1",
        dataType: "string",
        parentId: "group"
    }, {
        caption: "Group 2",
        dataField: "group.group2",
        dataType: "object",
        parentId: "group",
        filterOperations: ["isblank", "isnotblank"]
    }, {
        caption: "Field 3",
        dataField: "group.group2.field3",
        dataType: "string",
        parentId: "group.group2"
    }, {
        caption: "Field 4",
        dataField: "group3.field4",
        dataType: "string",
        parentId: "group3"
    }, {
        caption: "Group 3",
        dataField: "group3",
        dataType: "object",
        filterOperations: ["isblank", "isnotblank"]
    }]);
});

QUnit.test("getAvailableOperations (default)", function(assert) {
    var operations = utils.getAvailableOperations({}, filterOperationsDescriptions);

    assert.strictEqual(operations[0].text, "Contains");
    assert.strictEqual(operations[0].value, "contains");
    assert.strictEqual(operations[0].icon, "contains");

    assert.strictEqual(operations[1].text, "Does not contain");
    assert.strictEqual(operations[1].value, "notcontains");
    assert.strictEqual(operations[1].icon, "doesnotcontain");

    assert.strictEqual(operations[2].text, "Starts with");
    assert.strictEqual(operations[2].value, "startswith");
    assert.strictEqual(operations[2].icon, "startswith");

    assert.strictEqual(operations[3].text, "Ends with");
    assert.strictEqual(operations[3].value, "endswith");
    assert.strictEqual(operations[3].icon, "endswith");

    assert.strictEqual(operations[4].text, "Equals");
    assert.strictEqual(operations[4].value, "=");
    assert.strictEqual(operations[4].icon, "equal");

    assert.strictEqual(operations[5].text, "Does not equal");
    assert.strictEqual(operations[5].value, "<>");
    assert.strictEqual(operations[5].icon, "notequal");
});

QUnit.test("getAvailableOperations when field with filterOperations", function(assert) {
    var operations = utils.getAvailableOperations(fields[1], filterOperationsDescriptions);

    assert.strictEqual(operations[0].text, "Equals");
    assert.strictEqual(operations[0].value, "=");
    assert.strictEqual(operations[0].icon, "equal");

    assert.strictEqual(operations[1].text, "Does not equal");
    assert.strictEqual(operations[1].value, "<>");
    assert.strictEqual(operations[1].icon, "notequal");

    assert.strictEqual(operations[2].text, "Less than");
    assert.strictEqual(operations[2].value, "<");
    assert.strictEqual(operations[2].icon, "less");

    assert.strictEqual(operations[3].text, "Greater than");
    assert.strictEqual(operations[3].value, ">");
    assert.strictEqual(operations[3].icon, "greater");

    assert.strictEqual(operations[4].text, "Less than or equal to");
    assert.strictEqual(operations[4].value, "<=");
    assert.strictEqual(operations[4].icon, "lessorequal");

    assert.strictEqual(operations[5].text, "Greater than or equal to");
    assert.strictEqual(operations[5].value, ">=");
    assert.strictEqual(operations[5].icon, "greaterorequal");
});

QUnit.test("create condition", function(assert) {
    var condition = utils.createCondition(fields[0]);

    assert.equal(condition[0], "CompanyName");
    assert.equal(condition[1], "contains");
    assert.equal(condition[2], "");

    condition = utils.createCondition(fields[6]);
    assert.equal(condition[0], "ObjectField");
    assert.equal(condition[1], "=");
    assert.equal(condition[2], null);
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

QUnit.test("updateConditionByOperation", function(assert) {
    assert.deepEqual(utils.updateConditionByOperation(["value", "=", "123"], "isblank"), ["value", "=", null]);
    assert.deepEqual(utils.updateConditionByOperation(["value", "=", "123"], "isnotblank"), ["value", "<>", null]);
    assert.deepEqual(utils.updateConditionByOperation(["value", "=", "123"], "<="), ["value", "<=", "123"]);
    assert.deepEqual(utils.updateConditionByOperation(["value", "=", null], "<="), ["value", "<=", ""]);
});

QUnit.test("getOperationValue", function(assert) {
    assert.deepEqual(utils.getOperationValue(["value", "=", "123"]), "=");
    assert.deepEqual(utils.getOperationValue(["value", "=", null]), "isblank");
    assert.deepEqual(utils.getOperationValue(["value", "<>", null]), "isnotblank");
});

QUnit.test("copyGroup", function(assert) {
    var group = [
        condition1, condition2,
        ["!", [condition2, "Or", condition3]]
    ];
    var newGroup = utils.copyGroup(group);
    assert.notEqual(group, newGroup);
    assert.equal(group[0], newGroup[0]);
    assert.equal(group[1], newGroup[1]);
    assert.notEqual(group[2], newGroup[2]);
    assert.notEqual(group[2][1], newGroup[2][1]);
    assert.equal(group[2][1][0], newGroup[2][1][0]);
    assert.equal(group[2][1][1], newGroup[2][1][1]);
    assert.equal(group[2][1][2], newGroup[2][1][2]);
});

QUnit.test("convertToInnerStructure", function(assert) {
    var model = utils.convertToInnerStructure(null);
    assert.deepEqual(model, []);

    model = utils.convertToInnerStructure([]);
    assert.deepEqual(model, []);

    model = utils.convertToInnerStructure(condition1);
    assert.deepEqual(model, [condition1]);
    assert.equal(model[0], condition1);

    model = utils.convertToInnerStructure(["!", condition1]);
    assert.deepEqual(model, ["!", [condition1]]);
    assert.equal(model[1][0], condition1);

    var filter = [condition1, "Or", condition2];
    model = utils.convertToInnerStructure(filter);
    assert.notEqual(model, filter);
    assert.deepEqual(model, filter);
    assert.equal(model[0], filter[0]);
    assert.equal(model[2], filter[2]);
});

QUnit.test("getOperationFromAvailable", function(assert) {
    var equalsOperation = {
        value: "=",
        text: "Equals"
    };
    var availableOperations = [equalsOperation, {
        value: "<>",
        text: "Does not equal"
    }];
    assert.deepEqual(utils.getOperationFromAvailable("=", availableOperations), equalsOperation);
});



