"use strict";

var utils = require("ui/filter_builder/utils"),
    between = require("ui/filter_builder/between"),
    fields = require("../../../helpers/filterBuilderTestData.js");

var FILTER_ROW_OPERATIONS = ["=", "<>", "<", "<=", ">", ">=", "notcontains", "contains", "startswith", "endswith", "between"],
    HEADER_FILTER_OPERATIONS = ["anyof", "noneof"];

var condition1 = ["CompanyName", "=", "Super Mart of the West"],
    condition2 = ["CompanyName", "=", "and"],
    condition3 = ["CompanyName", "=", "Super Mart of the West3"],
    condition4 = ["CompanyName", "=", "Super Mart of the West4"],
    condition5 = ["CompanyName", "=", "Super Mart of the West5"];

var groupOperations = [{
        text: "And",
        value: "and"
    }, {
        text: "Or",
        value: "or"
    }, {
        text: "Not And",
        value: "!and"
    }, {
        text: "Not Or",
        value: "!or"
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
                utils.getOperationFromAvailable(">", utils.getAvailableOperations(fields[0], {}, []));
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
                    "and",
                    ["Zipcode", "=", "Value2"],
                    "or",
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
            "and",
            condition2,
            "and",
            condition3
        ];
        var groupValue = utils.getGroupValue(group);
        assert.equal(groupValue, "and");


        group = ["!", group];
        groupValue = utils.getGroupValue(group);
        assert.equal(groupValue, "!and");
    });

    QUnit.test("getGroupMenuItem", function(assert) {
        var group = ["!",
            [
                condition1,
                "and",
                condition2,
                "and",
                condition3
            ]
        ];
        assert.deepEqual(utils.getGroupMenuItem(group, groupOperations), { text: "Not And", value: "!and" });
    });

    QUnit.test("setGroupValue", function(assert) {
        var group = [condition1, "and", condition2, "and", condition3, "and"];
        group = utils.setGroupValue(group, "or");
        assert.deepEqual(group, [condition1, "or", condition2, "or", condition3, "or"]);

        group = utils.setGroupValue(group, "!or");
        assert.deepEqual(group, ["!", [condition1, "or", condition2, "or", condition3, "or"]]);

        group = utils.setGroupValue(group, "and");
        assert.deepEqual(group, [condition1, "and", condition2, "and", condition3, "and"]);

        group = [condition1, "and", condition2, "and"];
        group = utils.setGroupValue(group, "!or");
        assert.deepEqual(group, ["!", [condition1, "or", condition2, "or"]]);
    });

    QUnit.test("isGroup", function(assert) {
        assert.ok(utils.isGroup([["and"], "and", ["and"], "and"]));
        assert.ok(utils.isGroup(["and"]));
        assert.ok(utils.isGroup([]));
        assert.notOk(utils.isGroup(["value", "range", [1, 2]]));
    });

    QUnit.test("isEmptyGroup", function(assert) {
        assert.ok(utils.isEmptyGroup([]));
        assert.ok(utils.isEmptyGroup(["and"]));
        assert.ok(utils.isEmptyGroup([["and"], "and", ["and"], "and"]));
        assert.notOk(utils.isEmptyGroup(["CompanyName", "=", "DevExpress"]));
        assert.notOk(utils.isEmptyGroup([["CompanyName", "=", "DevExpress"]]));
        assert.notOk(utils.isEmptyGroup([["CompanyName", "=", "DevExpress"], "and", ["CompanyName", "=", "DevExpress"]]));


        assert.ok(utils.isEmptyGroup(["!", []]));
        assert.ok(utils.isEmptyGroup(["!", ["and"]]));
        assert.notOk(utils.isEmptyGroup(["!", ["CompanyName", "=", "DevExpress"]]));
    });

    QUnit.test("isCondition", function(assert) {
        assert.ok(utils.isCondition(["Column1", "=", "value"]));
        assert.ok(utils.isCondition(["Column1", "="]));
        assert.notOk(utils.isCondition([[], "and", []]));
        assert.notOk(utils.isCondition(["and"]));
        assert.notOk(utils.isCondition("and"));
        assert.ok(utils.isCondition(["Column1", "=", [1, 2]]));
    });

    QUnit.test("get group value", function(assert) {
        assert.equal(utils.getGroupValue([]), "and");
        assert.equal(utils.getGroupValue(["or"]), "or");
        assert.equal(utils.getGroupValue(["!", ["or"]]), "!or");
        assert.equal(utils.getGroupValue(["!", ["and"]]), "!and");
        assert.equal(utils.getGroupValue(["!", ["column", "operation", "value"]]), "!and");
        assert.equal(utils.getGroupValue([["column", "operation", "value"]]), "and");
        assert.equal(utils.getGroupValue([["column", "operation", "value"], ["column", "operation", "value"]]), "and");
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

    QUnit.test("create condition", function(assert) {
        var condition = utils.createCondition(fields[0], []);

        assert.equal(condition[0], "CompanyName");
        assert.equal(condition[1], "contains");
        assert.equal(condition[2], "");

        condition = utils.createCondition(fields[6], []);
        assert.equal(condition[0], "ObjectField");
        assert.equal(condition[1], "=");
        assert.equal(condition[2], null);
    });

    QUnit.test("create condition with custom operation", function(assert) {
        var condition = utils.createCondition({
            dataField: "OrderDate",
            filterOperations: ["lastWeek"]
        }, [{
            name: "lastWeek",
            hasValue: false
        }]);

        assert.deepEqual(condition, ["OrderDate", "lastWeek"]);
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
        assert.deepEqual(utils.updateConditionByOperation(["value", "=", "123"], "isblank", []), ["value", "=", null]);
        assert.deepEqual(utils.updateConditionByOperation(["value", "=", "123"], "isnotblank", []), ["value", "<>", null]);
        assert.deepEqual(utils.updateConditionByOperation(["value", "=", "123"], "<=", []), ["value", "<=", "123"]);
        assert.deepEqual(utils.updateConditionByOperation(["value", "=", null], "<=", []), ["value", "<=", ""]);
    });

    QUnit.test("change operation from default to custom without value", function(assert) {
        // arrange, act
        var updatedCondition = utils.updateConditionByOperation(["value", "=", "123"], "lastDays", [{
            name: "lastDays",
            hasValue: false
        }]);

        // assert
        assert.deepEqual(updatedCondition, ["value", "lastDays"]);
    });

    QUnit.test("change operation from default to custom with value", function(assert) {
        // arrange, act
        var updatedCondition = utils.updateConditionByOperation(["value", "=", "123"], "range", [{
            name: "range"
        }]);

        // assert
        assert.deepEqual(updatedCondition, ["value", "range", ""]);
    });

    QUnit.test("change operation from custom without value to default", function(assert) {
        // arrange, act
        var updatedCondition = utils.updateConditionByOperation(["value", "lastDays"], "=", [{
            name: "lastDays",
            hasValue: false
        }]);

        // assert
        assert.deepEqual(updatedCondition, ["value", "=", ""]);
    });

    QUnit.test("change operation from custom with value to default", function(assert) {
        // arrange, act
        var updatedCondition = utils.updateConditionByOperation(["value", "range", [1, 2]], "=", [{
            name: "range"
        }]);

        // assert
        assert.deepEqual(updatedCondition, ["value", "=", ""]);
    });

    QUnit.test("getOperationValue", function(assert) {
        assert.deepEqual(utils.getOperationValue(["value", "=", "123"]), "=");
        assert.deepEqual(utils.getOperationValue(["value", "=", null]), "isblank");
        assert.deepEqual(utils.getOperationValue(["value", "<>", null]), "isnotblank");
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
        assert.deepEqual(utils.createEmptyGroup("and"), ["and"]);
        assert.deepEqual(utils.createEmptyGroup("notAnd"), ["!", ["and"]]);
    });

    QUnit.test("isValidCondition", function(assert) {
        assert.ok(utils.isValidCondition(["ZipCode", "=", 1], fields[3]));
        assert.ok(utils.isValidCondition(["ZipCode", "=", null], fields[3]));
        assert.notOk(utils.isValidCondition(["ZipCode", "=", ""], fields[3]));
        assert.ok(utils.isValidCondition(["Field", "=", ""], { dataField: "Field" }));
    });

    QUnit.test("getField test", function(assert) {
        var field = utils.getField("Company", [{ dataField: "State.Name" }, { dataField: "Company" }]);
        assert.equal(field.dataField, "Company");

        field = utils.getField("State.Name", [{ dataField: "State.Name" }, { dataField: "Company" }]);
        assert.equal(field.dataField, "State.Name");

        field = utils.getField("State", [{ dataField: "State.Name" }, { dataField: "Company" }]);
        assert.equal(field.dataField, "State");
    });

    // T603218
    QUnit.test("getNormalizedFields", function(assert) {
        var normalizedFields = utils.getNormalizedFields([{
            dataField: "Weight",
            dataType: 'number',
            width: 100
        }, {
        }]);

        assert.deepEqual(normalizedFields, [{
            dataField: "Weight",
            dataType: 'number'
        }]);
    });
});

QUnit.module("Add item", function() {
    QUnit.test("to empty group", function(assert) {
        var group = [];

        group = utils.addItem(condition1, group);

        assert.equal(group[0], condition1);
        assert.deepEqual(group, [condition1, "and"]);
    });

    QUnit.test("to group without conditions", function(assert) {
        var group = ["and"];

        group = utils.addItem(condition1, group);

        assert.equal(group[0], condition1);
        assert.deepEqual(group, [condition1, "and"]);
    });

    QUnit.test("to group with condition", function(assert) {
        var group = [condition1, "and"];

        group = utils.addItem(condition2, group);

        assert.equal(group[0], condition1);
        assert.equal(group[2], condition2);
        assert.deepEqual(group, [condition1, "and", condition2, "and"]);
    });

    QUnit.test("to group with several conditions", function(assert) {
        var group = [condition1, "and", condition2, "and"];

        group = utils.addItem(condition3, group);

        assert.equal(group[0], condition1);
        assert.equal(group[2], condition2);
        assert.equal(group[4], condition3);
        assert.deepEqual(group, [condition1, "and", condition2, "and", condition3, "and"]);
    });

    QUnit.test("to empty negative group", function(assert) {
        var group = ["!", ["and"]];

        group = utils.addItem(condition1, group);

        assert.equal(group[1][0], condition1);
        assert.deepEqual(group, ["!", [condition1, "and"]]);
    });

    QUnit.test("to negative group", function(assert) {
        var group = ["!", [condition1, "and", condition2, "and"]];

        group = utils.addItem(condition3, group);

        assert.equal(group[1][4], condition3);
        assert.deepEqual(group, ["!", [condition1, "and", condition2, "and", condition3, "and"]]);
    });

    QUnit.test("to inner group", function(assert) {
        var innerGroup = ["and"],
            group = [condition1, "and", innerGroup, "and"];

        utils.addItem(condition2, innerGroup);

        assert.deepEqual(group, [condition1, "and", [condition2, "and"], "and"]);
        assert.equal(innerGroup, group[2]);
    });
});

QUnit.module("Remove item", function() {
    QUnit.test("from begin", function(assert) {
        var group = [
            condition1,
            "and",
            condition2,
            "and",
            condition3,
            "and"
        ];
        group = utils.removeItem(group, condition1);
        // assert
        assert.equal(group[0], condition2);
        assert.equal(group[2], condition3);
        assert.deepEqual(group, [condition2, "and", condition3, "and"]);

        group = utils.removeItem(group, condition2);
        assert.equal(group[0], condition3);
        assert.deepEqual(group, [condition3, "and"]);

        group = utils.removeItem(group, condition3);
        assert.deepEqual(group, ["and"]);
    });

    QUnit.test("from end", function(assert) {
        var group = [
            condition1,
            "and",
            condition2,
            "and",
            condition3,
            "and"
        ];

        group = utils.removeItem(group, condition3);
        // assert
        assert.equal(group[0], condition1);
        assert.equal(group[2], condition2);
        assert.deepEqual(group, [condition1, "and", condition2, "and"]);

        group = utils.removeItem(group, condition2);
        assert.equal(group[0], condition1);
        assert.deepEqual(group, [condition1, "and"]);

        group = utils.removeItem(group, condition1);
        assert.deepEqual(group, ["and"]);
    });

    QUnit.test("from middle", function(assert) {
        var group = [
            condition1,
            "and",
            condition2,
            "and",
            condition3,
            "and",
            condition4,
            "and",
            condition5,
            "and"
        ];

        group = utils.removeItem(group, condition3);

        // assert
        assert.deepEqual(group, [
            condition1,
            "and",
            condition2,
            "and",
            condition4,
            "and",
            condition5,
            "and"
        ]);
    });

    QUnit.test("from middle when group is negative", function(assert) {
        var group = ["!", [
            condition1,
            "and",
            condition2,
            "and",
            condition3,
            "and"
        ]];

        group = utils.removeItem(group, condition2);

        // assert
        assert.equal(group[1][0], condition1);
        assert.equal(group[1][2], condition3);
        assert.deepEqual(group, ["!", [condition1, "and", condition3, "and"]]);
    });
});

QUnit.module("Convert to inner structure", function() {
    QUnit.test("from null", function(assert) {
        assert.deepEqual(utils.convertToInnerStructure(null, []), ["and"]);
    });

    QUnit.test("from empty array", function(assert) {
        assert.deepEqual(utils.convertToInnerStructure([], []), ["and"]);
    });

    QUnit.test("from condition", function(assert) {
        var model = utils.convertToInnerStructure(condition1, []);
        assert.deepEqual(model, [condition1, "and"]);
        assert.notEqual(model[0], condition1);
    });

    QUnit.test("from short group with two conditions", function(assert) {
        var model = utils.convertToInnerStructure([condition1, condition2], []);
        assert.deepEqual(model, [condition1, "and", condition2, "and"]);
        assert.notEqual(model[0], condition1);
        assert.notEqual(model[2], condition2);
    });

    QUnit.test("from short condition", function(assert) {
        var shortCondition = ["CompanyName", "DevExpress"],
            model = utils.convertToInnerStructure(shortCondition, []);
        assert.deepEqual(model, [["CompanyName", "=", "DevExpress"], "and"]);
    });

    QUnit.test("from negative group with one condition", function(assert) {
        var model = utils.convertToInnerStructure(["!", condition1], []);
        assert.deepEqual(model, ["!", [condition1, "and"]]);
        assert.notEqual(model[1][0], condition1);
    });

    QUnit.test("from group with several conditions", function(assert) {
        var filter = [condition1, "or", condition2],
            model = utils.convertToInnerStructure(filter, []);
        assert.notEqual(model, filter);
        assert.deepEqual(model, [condition1, "or", condition2, "or"]);
        assert.notEqual(model[0], filter[0]);
        assert.notEqual(model[2], filter[2]);
    });

    QUnit.test("from short group with several short conditions", function(assert) {
        var filter = [["CompanyName", "DevExpress"], ["CompanyName", "DevExpress"], ["!", ["CompanyName", "DevExpress"]]],
            model = utils.convertToInnerStructure(filter, []);

        assert.deepEqual(model, [
            ["CompanyName", "=", "DevExpress"],
            "and",
            ["CompanyName", "=", "DevExpress"],
            "and",
            ["!",
                [["CompanyName", "=", "DevExpress"], "and"]
            ],
            "and"
        ]);
    });

    QUnit.test("check lowercase group", function(assert) {
        var filter = [condition1, "Or", condition2, "Or", [condition1, "And", ["!", [condition1, "Or", condition2]]]],
            model = utils.convertToInnerStructure(filter, []);
        assert.deepEqual(model, [
            condition1,
            "or",
            condition2,
            "or",
            [condition1,
                "and",
                ["!",
                    [condition1,
                        "or",
                        condition2,
                        "or"
                    ]
                ],
                "and"
            ],
            "or"
        ]);
    });

    QUnit.test("with custom operation", function(assert) {
        var filter = ["State", "lastWeek"],
            model = utils.convertToInnerStructure(filter, [{ name: "lastWeek" }]);
        assert.deepEqual(model, [
            ["State", "lastWeek"],
            "and"
        ]);
    });
});

QUnit.module("Filter normalization", function() {
    QUnit.test("get normalized filter from empty group", function(assert) {
        var group = [];

        assert.equal(utils.getNormalizedFilter(group, fields), null);
    });

    QUnit.test("get normalized filter from group without conditions", function(assert) {
        var group = ["and"];

        assert.equal(utils.getNormalizedFilter(group, fields), null);
    });

    QUnit.test("get normalized filter from group with condition", function(assert) {
        var group = [condition1, "and"];

        assert.equal(utils.getNormalizedFilter(group, fields), condition1);
    });

    QUnit.test("get normalized filter from group with short condition", function(assert) {
        var group = [["CompanyName", "DevExpress"], "and"];

        assert.equal(utils.getNormalizedFilter(group, fields), group[0]);
    });

    QUnit.test("get normalized filter from inner group with one condition", function(assert) {
        var group = [[condition1, "and"], "and"];

        assert.equal(utils.getNormalizedFilter(group, fields), condition1);
    });

    QUnit.test("get normalized filter from group with inner group", function(assert) {
        var group = [condition1, "and", [condition2, "and"], "and"];

        group = utils.getNormalizedFilter(group, fields);

        assert.equal(group[0], condition1);
        assert.equal(group[1], "and");
        assert.equal(group[2], condition2);

        group = [condition1, "or", [condition2, "or"], "or"];
        group = utils.getNormalizedFilter(group, fields);

        assert.deepEqual(group, [condition1, "or", condition2]);

        group = [condition1, "and", condition2, "and", ["and"], "and"];
        group = utils.getNormalizedFilter(group, fields);

        assert.deepEqual(group, [condition1, "and", condition2]);

        group = [condition1, "and", ["and"], "and"];
        group = utils.getNormalizedFilter(group, fields);

        assert.deepEqual(group, condition1);
    });


    QUnit.test("get normalized filter from group with empty inner group", function(assert) {
        var group = [["and"], "and"];

        group = utils.getNormalizedFilter(group, fields);

        assert.equal(group, null);
    });

    QUnit.test("get normalized filter from group with condition and empty inner group", function(assert) {
        var group = [condition1, "or", ["and"], "or"];

        group = utils.getNormalizedFilter(group, fields);

        assert.equal(group, condition1);
    });

    QUnit.test("get normalized filter from group with many inner groups", function(assert) {
        var group = [condition1, "and", condition2, "and", ["and"], "and", ["and"], "and", ["and"], "and", ["and"], "and"];

        group = utils.getNormalizedFilter(group, fields);

        assert.deepEqual(group, [condition1, "and", condition2]);
        assert.equal(group[0], condition1);
    });

    QUnit.test("get normalized filter from negative group", function(assert) {
        var group = ["!", [condition1, "and", ["and"], "and"]];

        group = utils.getNormalizedFilter(group, fields);

        assert.deepEqual(group, ["!", condition1]);

        group = ["!", [condition1, "and", condition2, "and"]];
        group = utils.getNormalizedFilter(group, fields);

        assert.deepEqual(group, ["!", [condition1, "and", condition2]]);
        assert.equal(group[1][0], condition1);
    });

    QUnit.test("get normalized filter from group which contains some not valid conditions", function(assert) {
        var notValidCondition = ["Zipcode", "=", ""],
            group = [notValidCondition,
                "and",
                [notValidCondition, "and", condition2, "and"],
                "and",
                ["!", [condition3, "and", notValidCondition, "and"]],
                "and"];

        group = utils.getNormalizedFilter(group, fields);

        assert.deepEqual(group, [condition2, "and", ["!", condition3]]);
    });

    QUnit.test("get normalized filter from group with one not valid condition", function(assert) {
        var notValidCondition = ["Zipcode", "=", ""],
            group = [notValidCondition, "and"];

        group = utils.getNormalizedFilter(group, fields);

        assert.equal(group, null);
    });

    QUnit.test("get normalized filter from group with not valid conditions", function(assert) {
        var notValidCondition = ["Zipcode", "=", ""],
            group = [notValidCondition, [notValidCondition]];

        group = utils.getNormalizedFilter(group, fields);

        assert.equal(group, null);
    });

    QUnit.test("get normalized filter from normalized group which contains not normalized groups", function(assert) {
        var group = [
            [condition1, "and", condition2, "and"],
            "and",
            [condition3, "and", condition2, "and"],
            "and"
        ];

        group = utils.getNormalizedFilter(group, fields);

        assert.deepEqual(group, [[condition1, "and", condition2], "and", [condition3, "and", condition2]]);
        assert.equal(group[2][0], condition3);
    });
});


QUnit.module("getAvailableOperations", {
    beforeEach: function() {
        this.customOperations = [{
            name: "lastDays",
            caption: "last days",
            icon: "add",
            dataTypes: ["date"]
        }];
    }
}, function() {

    QUnit.test("default", function(assert) {
        var operations = utils.getAvailableOperations({}, filterOperationsDescriptions, []);

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

    QUnit.test("when field with filterOperations", function(assert) {
        var operations = utils.getAvailableOperations(fields[1], filterOperationsDescriptions, []);

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

    QUnit.test("for field with lookup", function(assert) {
        var operations = utils.getAvailableOperations({
            dataField: "Product",
            lookup: {
                dataSource: [
                    "DataGrid",
                    "PivotGrid",
                    "TreeList"
                ]
            }
        }, filterOperationsDescriptions, []);

        assert.deepEqual(operations, [{
            "icon": "equal",
            "text": "Equals",
            "value": "="
        }, {
            "icon": "notequal",
            "text": "Does not equal",
            "value": "<>"
        }, {
            "icon": "isblank",
            "text": "Is blank",
            "value": "isblank"
        }, {
            "icon": "isnotblank",
            "text": "Is not blank",
            "value": "isnotblank"
        }]);
    });

    QUnit.test("ignore custom operation if dataType is not set", function(assert) {
        // arrange, act
        var operations = utils.getAvailableOperations({
            dataField: "test"
        }, {
            equals: "="
        }, [{
            name: "lastDays",
            caption: "last days",
            icon: "add"
        }]);

        // assert
        assert.strictEqual(operations.length, 8, "custom operation is ignored");
    });


    QUnit.test("for custom operation with filterOperations", function(assert) {
        // arrange, act
        var operations = utils.getAvailableOperations({
            dataField: "test",
            filterOperations: ["equals", "lastDays"]
        }, {
            equals: "="
        }, [{
            name: "lastDays",
            caption: "last days"
        }]);

        // assert
        assert.strictEqual(operations.length, 2, "two operations");

        assert.strictEqual(operations[0].value, "equals");
        assert.strictEqual(operations[1].value, "lastDays");
        assert.strictEqual(operations[1].icon, "icon-none");
    });

    QUnit.test("custom operation by dataType", function(assert) {
        // arrange, act
        var operations = utils.getAvailableOperations({
            dataField: "test",
            dataType: "date"
        }, {
            equals: "="
        }, this.customOperations);

        // assert
        assert.strictEqual(operations.length, 9, "9 operations");

        assert.strictEqual(operations[8].value, "lastDays");
    });

    QUnit.test("ignore custom operation by filterOperations", function(assert) {
        // arrange, act
        var operations = utils.getAvailableOperations({
            dataField: "test",
            dataType: "date",
            filterOperations: ["equals"]
        }, {
            equals: "="
        }, this.customOperations);

        // assert
        assert.strictEqual(operations.length, 1, "1 operation");
    });

    QUnit.test("ignore custom operation by dataType", function(assert) {
        // arrange, act
        var operations = utils.getAvailableOperations({
            dataField: "test",
            dataType: "number"
        }, {
            equals: "="
        }, this.customOperations);

        // assert
        assert.strictEqual(operations.length, 8, "8 operations");
    });

    QUnit.test("custom operation in field with another dataType", function(assert) {
        // arrange, act
        var operations = utils.getAvailableOperations({
            dataField: "test",
            dataType: "number",
            filterOperations: ["lastDays"]
        }, {
            equals: "="
        }, this.customOperations);

        // assert
        assert.strictEqual(operations.length, 1, "1 operation");
        assert.strictEqual(operations[0].value, "lastDays");
    });

    QUnit.test("get custom operation caption by key", function(assert) {
        // arrange, act
        var operations = utils.getAvailableOperations({
            dataField: "test",
            filterOperations: ["lastDays"]
        }, { }, [{
            name: "lastDays"
        }]);

        // assert
        assert.strictEqual(operations[0].text, "Last Days");
    });
});

QUnit.module("Custom filter expressions", {
    beforeEach: function() {
        this.fields = [{
            dataField: "field1",
            calculateFilterExpression: function(filterValue, selectedFilterOperation) {
                return [
                    [this.dataField, "<>", filterValue],
                    "or",
                    [this.dataField, "=", "10"]
                ];
            }
        },
        {
            dataField: "field2"
        }];
    }
}, function() {

    QUnit.test("calculateFilterExpression for value = empty array", function(assert) {
        // arrange
        var value = [];

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, []), null);
    });

    QUnit.test("calculateFilterExpression for value = null", function(assert) {
        // arrange
        var value = null;

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, []), null);
    });

    QUnit.test("calculateFilterExpression for fieldValue = array", function(assert) {
        // arrange
        var value = ["field1", "range", [2, 3]],
            customOperations = [{
                name: "range",
                calculateFilterExpression: function(filterValue, field) {
                    return [[field.dataField, ">", filterValue[0]], "and", [field.dataField, "<", filterValue[1]]];
                }
            }];

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, customOperations), [
            ["field1", ">", 2],
            "and",
            ["field1", "<", 3]
        ]);
    });

    QUnit.test("calculateFilterExpression for condition", function(assert) {
        // arrange
        var value = ["field1", "1"];

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, []), [["field1", "<>", "1"], "or", ["field1", "=", "10"]]);
    });

    QUnit.test("calculateFilterExpression for group", function(assert) {
        // arrange
        var value = [
            ["field1", "1"],
            "and",
            [
                ["field1", "=", "20"],
                "or",
                ["field2", "30"]
            ]
        ];

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, []), [
            [
                ["field1", "<>", "1"], "or", ["field1", "=", "10"]
            ],
            "and",
            [
                [
                    ["field1", "<>", "20"], "or", ["field1", "=", "10"]
                ],
                "or",
                ["field2", "=", "30"]
            ]
        ]);
    });

    QUnit.test("calculateFilterExpression for short form of group", function(assert) {
        // arrange
        var value = [
            ["field1", "1"],
            [
                ["field1", "=", "20"],
                ["field2", "30"]
            ]
        ];

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, []), [
            [
                ["field1", "<>", "1"], "or", ["field1", "=", "10"]
            ],
            "and",
            [
                [
                    ["field1", "<>", "20"], "or", ["field1", "=", "10"]
                ],
                "and",
                ["field2", "=", "30"]
            ]
        ]);
    });

    QUnit.test("calculateFilterExpression for group with between", function(assert) {
        // arrange
        var value = [
            ["field2", "20"],
            "or",
            ["field2", "30"],
            "or",
            ["field1", "between", [null, null]]
        ];

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, [between.getConfig()]), [
            ["field2", "=", "20"],
            "or",
            ["field2", "=", "30"]
        ]);

        value = [
            ["field2", "20"],
            ["field2", "30"],
            ["field1", "between", [null, null]]
        ];
        assert.deepEqual(utils.getFilterExpression(value, this.fields, [between.getConfig()]), [
            ["field2", "=", "20"],
            "and",
            ["field2", "=", "30"]
        ]);
    });

    QUnit.test("customOperation.calculateFilterExpression", function(assert) {
        // arrange
        var value = ["field1", "lastDays", "2"],
            customOperations = [{
                name: "lastDays",
                calculateFilterExpression: function(filterValue, field) {
                    return [field.dataField, ">", filterValue];
                }
            }];

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, customOperations), ["field1", ">", "2"]);
    });


    QUnit.test("customOperation.calculateFilterExpression with condition does not return a value", function(assert) {
        // arrange
        var value = ["field1", "lastDays", "2"],
            customOperations = [{
                name: "lastDays",
                calculateFilterExpression: function(filterValue, field) {

                }
            }];

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, customOperations), null);
    });

    QUnit.test("customOperation.calculateFilterExpression with group does not return a value", function(assert) {
        // arrange
        var value = [["field1", "lastDays", "2"], "or", ["field1", "lastDays", "1"]],
            customOperations = [{
                name: "lastDays",
                calculateFilterExpression: function(filterValue, field) {

                }
            }];

        // act, assert
        assert.deepEqual(utils.getFilterExpression(value, this.fields, customOperations), null);
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

    QUnit.test("field.customizeText", function(assert) {
        var field = {
                customizeText: function(conditionInfo) {
                    return conditionInfo.valueText + "Test";
                }
            },
            value = "MyValue";
        assert.equal(utils.getCurrentValueText(field, value), "MyValueTest");
    });

    QUnit.test("customOperation.customizeText", function(assert) {
        var field = {
                customizeText: function(conditionInfo) {
                    return conditionInfo.valueText + "Test";
                }
            },
            value = "MyValue",
            customOperation = {
                customizeText: function(conditionInfo) {
                    return conditionInfo.valueText + "CustomOperation";
                }
            };
        assert.equal(utils.getCurrentValueText(field, value, customOperation), "MyValueCustomOperation");
    });

    QUnit.test("default format for date", function(assert) {
        var field = { dataType: "date" },
            value = new Date(2017, 8, 5, 12, 30, 0);

        assert.equal(utils.getCurrentValueText(field, value), "9/5/2017");
    });

    QUnit.test("default format for datetime", function(assert) {
        var field = { dataType: "datetime" },
            value = new Date(2017, 8, 5, 12, 30, 0);

        assert.equal(utils.getCurrentValueText(field, value), "9/5/2017, 12:30 PM");
    });
});

QUnit.module("Lookup Value", function() {
    QUnit.test("array of strings & value=empty", function(assert) {
        var field = {
                lookup: {
                    dataSource: [
                        "DataGrid",
                        "PivotGrid",
                        "TreeList"
                    ]
                }
            },
            value = "";

        utils.getCurrentLookupValueText(field, value, function(r) {
            assert.equal(r, "");
        });
    });

    QUnit.test("array of strings", function(assert) {
        var field = {
                lookup: {
                    dataSource: [
                        "DataGrid",
                        "PivotGrid",
                        "TreeList"
                    ]
                }
            },
            value = "PivotGrid";

        utils.getCurrentLookupValueText(field, value, function(r) {
            assert.equal(r, "PivotGrid");
        });
    });

    QUnit.test("dataField & textField", function(assert) {
        var field = {
                lookup: {
                    dataSource: [{
                        data: 1,
                        text: "DataGrid"
                    }, {
                        data: 2,
                        text: "PivotGrid"
                    }, {
                        data: 3,
                        text: "TreeList"
                    }],
                    valueExpr: "data",
                    displayExpr: "text"
                }
            },
            value = 2;

        utils.getCurrentLookupValueText(field, value, function(r) {
            assert.equal(r, "PivotGrid");
        });
    });

    QUnit.test("dataField & textField & value = empty", function(assert) {
        var field = {
                lookup: {
                    dataSource: [{
                        data: 1,
                        text: "DataGrid"
                    }, {
                        data: 2,
                        text: "PivotGrid"
                    }, {
                        data: 3,
                        text: "TreeList"
                    }],
                    valueExpr: "data",
                    displayExpr: "text"
                }
            },
            value = "";

        utils.getCurrentLookupValueText(field, value, function(r) {
            assert.equal(r, "");
        });
    });

    // T597637
    QUnit.test("lookup with ODataStore shouldn't send getValueText query when value is empty", function(assert) {
        var fakeStore = {
            load: function() {
                assert.ok(false, "load shoudn't execute");
            }
        };
        var field = {
                lookup: {
                    dataSource: {
                        store: fakeStore
                    }
                }
            },
            value = "";

        utils.getCurrentLookupValueText(field, value, function(r) {
            assert.equal(r, "");
        });
    });
});

QUnit.module("Between operation", function() {
    QUnit.test("between is enabled", function(assert) {
        // arrange
        var customOperations = [{ name: "operation1" }];

        // act
        var mergedOperations = utils.getMergedOperations(customOperations, "My Between");

        // assert
        assert.equal(mergedOperations.length, 2, "length == 2");
        assert.equal(mergedOperations[0].caption, "My Between");
        assert.deepEqual(mergedOperations[0].dataTypes, ["number", "date", "datetime"]);
        assert.equal(mergedOperations[1].name, "operation1");
    });

    QUnit.test("between.calculateFilterExpression", function(assert) {
        // arrange
        var customOperations = [];

        // act
        var mergedOperations = utils.getMergedOperations(customOperations, function() { }),
            filterExpression = mergedOperations[0].calculateFilterExpression([1, 2], { dataField: "field" });
        // assert
        assert.deepEqual(filterExpression, [["field", ">=", 1], "and", ["field", "<=", 2]]);

        // act
        filterExpression = mergedOperations[0].calculateFilterExpression([1], { dataField: "field" });
        // assert
        assert.deepEqual(filterExpression, null);

        // act
        filterExpression = mergedOperations[0].calculateFilterExpression([], { dataField: "field" });
        // assert
        assert.deepEqual(filterExpression, null);

        // act
        filterExpression = mergedOperations[0].calculateFilterExpression("", { dataField: "field" });
        // assert
        assert.deepEqual(filterExpression, null);

        // act
        filterExpression = mergedOperations[0].calculateFilterExpression(null, { dataField: "field" });
        // assert
        assert.deepEqual(filterExpression, null);

        // act
        filterExpression = mergedOperations[0].calculateFilterExpression([null, null], { dataField: "field" });
        // assert
        assert.deepEqual(filterExpression, null);
    });

    QUnit.test("between.customizeText", function(assert) {
        // arrange
        var customOperations = [],
            field = { dataType: "number" };

        // act
        var betweenOperation = utils.getMergedOperations(customOperations)[0],
            text = betweenOperation.customizeText({
                field: field,
                value: ""
            });
        // assert
        assert.equal(text, "<enter a value>", "empty text is correct");

        // act
        text = betweenOperation.customizeText({
            field: field,
            value: [0]
        });
        // assert
        assert.equal(text, "0 - ?", "text without endValue");

        // act
        text = betweenOperation.customizeText({
            field: field,
            value: [null, 0]
        });
        // assert
        assert.equal(text, "? - 0", "text without startValue");

        // act
        text = betweenOperation.customizeText({
            field: field,
            value: [0, 1]
        });
        // assert
        assert.equal(text, "0 - 1", "text with startValue & endValue");
    });
});

QUnit.module("filterHasField", function() {
    QUnit.test("filter = null", function(assert) {
        var hasField = utils.filterHasField(null, "field");
        assert.notOk(hasField);
    });

    QUnit.test("filter = condition with field", function(assert) {
        var hasField = utils.filterHasField(["field", "=", 1], "field");
        assert.ok(hasField);
    });

    QUnit.test("filter = condition without field", function(assert) {
        var hasField = utils.filterHasField(["field2", "=", 1], "field");
        assert.notOk(hasField);
    });

    QUnit.test("filter = group with field", function(assert) {
        var hasField = utils.filterHasField([["field2", "=", 2], "and", ["field", "=", 1]], "field");
        assert.ok(hasField);
    });

    QUnit.test("filter = group without field", function(assert) {
        var hasField = utils.filterHasField([["field2", "=", 2], "and", ["field2", "=", 1]], "field");
        assert.notOk(hasField);
    });

    QUnit.test("filter = group with inner group with field", function(assert) {
        var hasField = utils.filterHasField([["field2", "=", 1], "and", [["field2", "=", 2], "and", ["field", "=", 1]]], "field");
        assert.ok(hasField);
    });

    QUnit.test("filter = group with inner group without field", function(assert) {
        var hasField = utils.filterHasField([["field2", "=", 1], "and", [["field2", "=", 2], "and", ["field2", "=", 1]]], "field");
        assert.notOk(hasField);
    });
});

QUnit.module("Filter sync", function() {
    QUnit.test("null with field condition", function(assert) {
        // arrange
        var filter = null,
            addedFilter = ["field", "=", 2];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, addedFilter, "result = addedFilter");
    });

    QUnit.test("empty with field condition", function(assert) {
        // arrange
        var filter = [],
            addedFilter = ["field", "=", 2];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, addedFilter, "result = addedFilter");
    });

    QUnit.test("condition with same field condition", function(assert) {
        // arrange
        var filter = ["field", "=", 1],
            addedFilter = ["field", "=", 2];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, addedFilter, "result = addedFilter");
    });

    QUnit.test("condition with another field condition", function(assert) {
        // arrange
        var filter = ["field", "=", 1],
            addedFilter = ["field2", "=", 2];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, [["field", "=", 1], "and", ["field2", "=", 2]], "result = addedFilter");
    });

    QUnit.test("condition & condition with null value", function(assert) {
        // arrange
        var filter = ["field", "=", 1],
            addedFilter = ["field", "=", null];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.equal(result, null, "result = null");
    });

    QUnit.test("null & condition with null value", function(assert) {
        // arrange
        var filter = null,
            addedFilter = ["field", "=", null];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.equal(result, null, "result = null");
    });

    QUnit.test("condition in the begining of group replace with null value", function(assert) {
        // arrange
        var filter = [["field", "=", 1], "and", ["field2", "=", 2]],
            addedFilter = ["field", "=", null];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, ["field2", "=", 2], "result = field2");
    });

    QUnit.test("condition in the ending of group replace with null value", function(assert) {
        // arrange
        var filter = [["field2", "=", 2], "and", ["field", "=", 1]],
            addedFilter = ["field", "=", null];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, ["field2", "=", 2], "result = field2");
    });

    QUnit.test("group with same field condition", function(assert) {
        // arrange
        var filter = [["field", "=", 1], "and", ["field2", "=", 3], "and", ["field", "=", 4]],
            addedFilter = ["field", "=", 2];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, [["field", "=", 2], "and", ["field2", "=", 3]], "result = addedFilter");
    });

    QUnit.test("group with another field condition", function(assert) {
        // arrange
        var filter = [["field", "=", 1], "and", ["field2", "=", 3]],
            addedFilter = ["field3", "=", 2];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, [["field", "=", 1], "and", ["field2", "=", 3], "and", ["field3", "=", 2]], "result = addedFilter");
    });

    QUnit.test("add anyof to condition without anyof", function(assert) {
        // arrange
        var filter = ["field", "=", 1],
            addedFilter = ["field", "anyof", [2]];

        // act
        var result = utils.syncFilters(filter, addedFilter, HEADER_FILTER_OPERATIONS);

        // assert
        assert.deepEqual(result, [["field", "=", 1], "and", ["field", "anyof", [2]]]);
    });

    QUnit.test("add anyof to condition with noneof", function(assert) {
        // arrange
        var filter = ["field", "noneof", [1]],
            addedFilter = ["field", "anyof", [2]];

        // act
        var result = utils.syncFilters(filter, addedFilter, HEADER_FILTER_OPERATIONS);

        // assert
        assert.deepEqual(result, ["field", "anyof", [2]]);
    });

    QUnit.test("add anyof to group without anyof", function(assert) {
        // arrange
        var filter = [["field", "=", 1], "and", ["field2", "=", 3]],
            addedFilter = ["field", "anyof", [2]];

        // act
        var result = utils.syncFilters(filter, addedFilter, HEADER_FILTER_OPERATIONS);

        // assert
        assert.deepEqual(result, [["field", "=", 1], "and", ["field2", "=", 3], "and", ["field", "anyof", [2]]]);
    });

    QUnit.test("add condition to group with 'or' operation", function(assert) {
        // arrange
        var filter = [["field", "=", 1], "or", ["field2", "=", 3]],
            addedFilter = ["field", "=", 2];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, [["field", "=", 2], "and", [["field", "=", 1], "or", ["field2", "=", 3]]]);
    });

    QUnit.test("add condition to group with 'not and' operation", function(assert) {
        // arrange
        var filter = ["!", [["field", "=", 1], "and", ["field2", "=", 3]]],
            addedFilter = ["field", "=", 2];

        // act
        var result = utils.syncFilters(filter, addedFilter, FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, [["field", "=", 2], "and", ["!", [["field", "=", 1], "and", ["field2", "=", 3]]]]);
    });
});

QUnit.module("getMatchedCondition", function() {
    QUnit.test("from null", function(assert) {
        // arrange
        var filter = null;

        // act
        var result = utils.getMatchedCondition(filter, "field", FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, null);
    });

    QUnit.test("from filter = field condition", function(assert) {
        // arrange
        var filter = ["field", "=", 1];

        // act
        var result = utils.getMatchedCondition(filter, "field", FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, ["field", "=", 1]);
    });

    QUnit.test("from filter != field condition", function(assert) {
        // arrange
        var filter = ["field2", "=", 1];

        // act
        var result = utils.getMatchedCondition(filter, "field", FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, null);
    });

    QUnit.test("from filter with one field condition", function(assert) {
        // arrange
        var filter = [["field", "=", 1], "and", ["field2", "=", 3]];

        // act
        var result = utils.getMatchedCondition(filter, "field", FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, ["field", "=", 1]);
    });

    QUnit.test("from filter with two field condition", function(assert) {
        // arrange
        var filter = [["field", "=", 1], "and", ["field", "=", 3]];

        // act
        var result = utils.getMatchedCondition(filter, "field", FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, null);
    });

    QUnit.test("from filter with anyof in group", function(assert) {
        // arrange
        var filter = [["field2", "=", 3], "and", ["field", "anyof", [1]]];
        // act
        var result = utils.getMatchedCondition(filter, "field", FILTER_ROW_OPERATIONS);
        // assert
        assert.deepEqual(result, null);
    });

    QUnit.test("from filter == field condition with not available operation", function(assert) {
        // arrange
        var filter = ["field", "=", 1];

        // act
        var result = utils.getMatchedCondition(filter, "field", HEADER_FILTER_OPERATIONS);

        // assert
        assert.deepEqual(result, null);
    });

    QUnit.test("from filter == field condition with anyof", function(assert) {
        // arrange
        var filter = ["field", "anyof", [1]];

        // act
        var result = utils.getMatchedCondition(filter, "field", HEADER_FILTER_OPERATIONS);

        // assert
        assert.deepEqual(result[2], [1]);
    });

    QUnit.test("from filter with two field condition and 'or' group value", function(assert) {
        // arrange
        var filter = [["field", "anyof", [1]], "or", ["field", "anyof", [2]]];

        // act
        var result = utils.getMatchedCondition(filter, "field", HEADER_FILTER_OPERATIONS);

        // assert
        assert.deepEqual(result, null);
    });

    QUnit.test("ignore field for 'or' group value", function(assert) {
        // arrange
        var filter = [["field", "=", 1], "or", ["field", "anyof", [2]]];

        // act
        var result = utils.getMatchedCondition(filter, "field", HEADER_FILTER_OPERATIONS);

        // assert
        assert.deepEqual(result, null);
    });

    QUnit.test("ignore field for 'not and' group value", function(assert) {
        // arrange
        var filter = ["!", [["field", "=", 1], "and", ["field", "anyof", [2]]]];

        // act
        var result = utils.getMatchedCondition(filter, "field", HEADER_FILTER_OPERATIONS);

        // assert
        assert.deepEqual(result, null);
    });

    QUnit.test("from filter with two field condition and one is not available", function(assert) {
        // arrange
        var filter = [["field", "=", 1], "and", ["field", "anyof", [2]]];

        // act
        var result = utils.getMatchedCondition(filter, "field", FILTER_ROW_OPERATIONS);

        // assert
        assert.deepEqual(result, ["field", "=", 1]);
    });
});

QUnit.module("getFilterText", function() {
    QUnit.test("from condition", function(assert) {
        // arrange
        var filter = ["field", "=", "1"];

        // act
        var result = utils.getFilterText(filter, [], [{ dataField: "field", caption: "Field" }], { equal: "Equals" });

        // assert
        assert.deepEqual(result, "[Field] Equals '1'");
    });

    QUnit.test("from condition with array value", function(assert) {
        // arrange
        var filter = ["field", "between", [1, 2]];

        // act
        var result = utils.getFilterText(filter, [{ name: "between", caption: "Between" }], [{ dataField: "field", caption: "Field" }]);

        // assert
        assert.deepEqual(result, "[Field] Between('1', '2')");
    });

    QUnit.test("from group", function(assert) {
        // arrange
        var filter = [["field", "=", "1"], "and", ["field", "=", "2"]];

        // act
        var result = utils.getFilterText(filter, [], [{ dataField: "field", caption: "Field" }], { equal: "Equals" }, { and: "And" });

        // assert
        assert.deepEqual(result, "[Field] Equals '1' And [Field] Equals '2'");
    });

    QUnit.test("from group with inner group", function(assert) {
        // arrange
        var filter = [["field", "=", "1"], "and", ["field", "=", "2"], "and", [["field", "=", "3"], "or", ["field", "=", "4"]]];

        // act
        var result = utils.getFilterText(filter, [], [{ dataField: "field", caption: "Field" }], { equal: "Equals" }, { and: "And", or: "Or" });

        // assert
        assert.deepEqual(result, "[Field] Equals '1' And [Field] Equals '2' And ([Field] Equals '3' Or [Field] Equals '4')");
    });


    QUnit.test("from group with inner group", function(assert) {
        // arrange
        var filter = ["!", [["field", "=", "1"], "and", ["field", "=", "2"]]];

        // act
        var result = utils.getFilterText(filter, [], [{ dataField: "field", caption: "Field" }], { equal: "Equals" }, { notAnd: "Not And", and: "And" });

        // assert
        assert.deepEqual(result, "Not ([Field] Equals '1' And [Field] Equals '2')");
    });
});
