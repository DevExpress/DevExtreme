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

QUnit.module("Errors", function() {
    QUnit.test("E1047", function(assert) {
        assert.throws(
            function() {
                utils.getField("Field1", fields);
            },
            function(e) {
                return /E1047/.test(e.message);
            },
            "The 'Field1' field is not found in the fields array"
        );
    });

    QUnit.test("E1048", function(assert) {
        assert.throws(
            function() {
                utils.getOperationFromAvailable(">", utils.getAvailableOperations(fields[0]));
            },
            function(e) {
                return /E1048/.test(e.message);
            },
            "The '>' operation is not found in the filterOperations array"
        );
    });

    QUnit.test("E4019", function(assert) {
        assert.throws(
            function() {
                utils.getGroupValue([
                    ["CompanyName", "=", "Value1"],
                    "And",
                    ["Zipcode", "=", "Value2"],
                    "Or",
                    ["CompanyName", "=", "Value2"]
                ], fields);
            },
            function(e) {
                return /E4019/.test(e.message);
            },
            "Throw exception when \"And\" and \"Or\" operations are together in the same group"
        );
    });
});

QUnit.module("Utils", function() {
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
    });

    QUnit.test("setGroupValue for empty group", function(assert) {
        var group = [];
        group = utils.setGroupValue(group, "!Or");
        assert.deepEqual(group, ["!", ["Or"]]);

        group = utils.setGroupValue(group, "And");
        assert.deepEqual(group, ["And"]);
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

    QUnit.test("get group value", function(assert) {
        assert.equal(utils.getGroupValue([]), "And");
        assert.equal(utils.getGroupValue(["Or"]), "Or");
        assert.equal(utils.getGroupValue(["!", ["Or"]]), "!Or");
        assert.equal(utils.getGroupValue(["!", ["And"]]), "!And");
        assert.equal(utils.getGroupValue([["column", "operation", "value"]]), "And");
        assert.equal(utils.getGroupValue([["column", "operation", "value"], ["column", "operation", "value"]]), "And");
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
            },
            plainItems = [{
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

    QUnit.test("getOperationFromAvailable", function(assert) {
        var equalsOperation = {
                value: "=",
                text: "Equals"
            },
            availableOperations = [equalsOperation, {
                value: "<>",
                text: "Does not equal"
            }];

        assert.deepEqual(utils.getOperationFromAvailable("=", availableOperations), equalsOperation);
    });

    QUnit.test("createEmptyGroup", function(assert) {
        assert.deepEqual(utils.createEmptyGroup("And"), ["And"]);
        assert.deepEqual(utils.createEmptyGroup("notAnd"), ["!", ["And"]]);
    });
});

QUnit.module("Add item", function() {
    QUnit.test("to empty group", function(assert) {
        var group = [];

        group = utils.addItem(condition1, group);

        assert.equal(group[0], condition1);
        assert.equal(group[1], "And");
        assert.equal(group.length, 2);
    });

    QUnit.test("to group without conditions", function(assert) {
        var group = ["And"];

        group = utils.addItem(condition1, group);

        assert.equal(group[0], condition1);
        assert.equal(group[1], "And");
        assert.equal(group.length, 2);
    });

    QUnit.test("to group with condition", function(assert) {
        var group = [condition1, "And"];

        group = utils.addItem(condition2, group);

        assert.equal(group[0], condition1);
        assert.equal(group[1], "And");
        assert.equal(group[2], condition2);
        assert.equal(group.length, 3);
    });

    QUnit.test("to group with several conditions", function(assert) {
        var group = [condition1, "And", condition2];

        group = utils.addItem(condition3, group);

        assert.equal(group[0], condition1);
        assert.equal(group[1], "And");
        assert.equal(group[2], condition2);
        assert.equal(group[3], "And");
        assert.equal(group[4], condition3);
        assert.equal(group.length, 5);
    });

    QUnit.test("to negative group", function(assert) {
        var group = ["!", [condition1, "And", condition2]];

        group = utils.addItem(condition3, group);

        assert.equal(group[0], "!");
        assert.equal(group.length, 2);
        assert.equal(group[1][3], "And");
        assert.equal(group[1][4], condition3);
        assert.equal(group[1].length, 5);
    });

    QUnit.test("to normalized group", function(assert) {
        var group = ["!", [condition1, condition2]];

        group = utils.addItem(condition3, group);

        assert.equal(group[0], "!");
        assert.equal(group.length, 2);
        assert.equal(group[1][2], condition3);
        assert.equal(group[1].length, 3);
    });

    QUnit.test("to inner group", function(assert) {
        var innerGroup = ["And"],
            group = [condition1, innerGroup];

        utils.addItem(condition2, innerGroup);

        assert.deepEqual(group, [condition1, [condition2, "And"]]);
        assert.equal(innerGroup, group[1]);
    });
});

QUnit.module("Remove item", function() {
    QUnit.test("from begin", function(assert) {
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
    });

    QUnit.test("from end", function(assert) {
        var group = [
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
    });

    QUnit.test("from middle", function(assert) {
        var group = [
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
    });

    QUnit.test("from middle when group is negative", function(assert) {
        var group = ["!", [
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

    QUnit.test("from normalized group", function(assert) {
        var group = ["!", [
            condition1,
            condition2,
            condition3
        ]];

        group = utils.removeItem(group, condition2);

        //assert
        assert.equal(group[0], "!");
        assert.equal(group.length, 2);
        assert.equal(group[1][0], condition1);
        assert.equal(group[1][1], condition3);
        assert.equal(group[1].length, 2);
    });
});

QUnit.module("Convert to inner structure", function() {
    QUnit.test("from null", function(assert) {
        assert.deepEqual(utils.convertToInnerStructure(null), []);
    });

    QUnit.test("from empty array", function(assert) {
        assert.deepEqual(utils.convertToInnerStructure([]), []);
    });

    QUnit.test("from condition", function(assert) {
        var model = utils.convertToInnerStructure(condition1);
        assert.deepEqual(model, [condition1]);
        assert.equal(model[0], condition1);
    });

    QUnit.test("from negative group with one condition", function(assert) {
        var model = utils.convertToInnerStructure(["!", condition1]);
        assert.deepEqual(model, ["!", [condition1]]);
        assert.equal(model[1][0], condition1);
    });

    QUnit.test("from group with several conditions", function(assert) {
        var filter = [condition1, "Or", condition2],
            model = utils.convertToInnerStructure(filter);
        assert.notEqual(model, filter);
        assert.deepEqual(model, filter);
        assert.equal(model[0], filter[0]);
        assert.equal(model[2], filter[2]);
    });
});

QUnit.module("Filter normalization", function() {
    QUnit.test("get normalized filter from empty group", function(assert) {
        var group = [];

        assert.equal(utils.getNormalizedFilter(group), null);
    });

    QUnit.test("get normalized filter from group without conditions", function(assert) {
        var group = ["And"];

        assert.equal(utils.getNormalizedFilter(group), null);
    });

    QUnit.test("get normalized filter from group with condition", function(assert) {
        var group = [condition1, "And"];

        assert.equal(utils.getNormalizedFilter(group), condition1);
    });

    QUnit.test("get normalized filter from inner group with one condition", function(assert) {
        var group = [[condition1]];

        assert.equal(utils.getNormalizedFilter(group), condition1);
    });

    QUnit.test("get normalized filter from group with inner group", function(assert) {
        var group = [condition1, "And", [condition2, "And"]];

        group = utils.getNormalizedFilter(group);

        assert.equal(group[0], condition1);
        assert.equal(group[1], condition2);

        group = [condition1, "Or", [condition2, "Or"]];
        group = utils.getNormalizedFilter(group);

        assert.deepEqual(group, [condition1, "Or", condition2]);

        group = [condition1, "And", condition2, "And", ["And"]];
        group = utils.getNormalizedFilter(group);

        assert.deepEqual(group, [condition1, condition2]);

        group = [condition1, "And", ["And"]];
        group = utils.getNormalizedFilter(group);

        assert.deepEqual(group, condition1);
    });

    QUnit.test("get normalized filter from group with many inner groups", function(assert) {
        var group = [condition1, "And", condition2, "And", ["And"], "And", ["And"], "And", ["And"], "And", ["And"]];

        group = utils.getNormalizedFilter(group);

        assert.deepEqual(group, [condition1, condition2]);
        assert.equal(group[0], condition1);
    });

    QUnit.test("get normalized filter from negative group", function(assert) {
        var group = ["!", [condition1, "And", ["And"]]];

        group = utils.getNormalizedFilter(group);

        assert.deepEqual(group, ["!", condition1]);

        group = ["!", [condition1, "And", condition2]];
        group = utils.getNormalizedFilter(group);

        assert.deepEqual(group, ["!", [condition1, condition2]]);
        assert.equal(group[1][0], condition1);
    });

    QUnit.test("get normalized filter from normalized group which contains not normalized groups", function(assert) {
        var group = [[condition1, "And", condition2], [condition3, "And", condition2]];

        group = utils.getNormalizedFilter(group);

        assert.deepEqual(group, [[condition1, condition2], [condition3, condition2]]);
        assert.equal(group[1][0], condition3);
    });
});

QUnit.module("Formatting", function() {
    QUnit.test("empty string", function(assert) {
        var field = {},
            value = "";

        assert.equal(utils.getCurrentValueText(field, value), "");
    });

    QUnit.test("string", function(assert) {
        var field = {},
            value = "Text";
        assert.equal(utils.getCurrentValueText(field, value), "Text");
    });

    QUnit.test("shortDate", function(assert) {
        var field = { format: "shortDate" },
            value = new Date(2017, 8, 5);
        assert.equal(utils.getCurrentValueText(field, value), "9/5/2017");
    });

    QUnit.test("boolean", function(assert) {
        var field = { dataType: "boolean" },
            value = true;
        assert.equal(utils.getCurrentValueText(field, value), "true");

        value = false;
        assert.equal(utils.getCurrentValueText(field, value), "false");

        field.falseText = "False Text";
        assert.equal(utils.getCurrentValueText(field, value), "False Text");
    });

    QUnit.test("customizeText", function(assert) {
        var field = {
                customizeText: function(conditionInfo) {
                    return conditionInfo.valueText + "Test";
                }
            },
            value = "MyValue";
        assert.equal(utils.getCurrentValueText(field, value), "MyValueTest");
    });
});
