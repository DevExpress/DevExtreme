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
    defaultFilterOperation: ""
}, {
    caption: "Date",
    dataField: "Date",
    dataType: "date",
    format: "shortDate",
    filterOperations: ["=", "<>", "<", ">", "<=", ">="],
    defaultFilterOperation: ""
}, {
    caption: "State",
    dataField: "State",
    dataType: "string",
    format: undefined,
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
    defaultFilterOperation: ""
}, {
    caption: "Zipcode",
    dataField: "Zipcode",
    dataType: "number",
    format: undefined,
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
    defaultFilterOperation: ["=", "<>", "<", ">", "<=", ">="]
},
{
    caption: "Contributor",
    dataField: "Contributor",
    dataType: "boolean",
    format: undefined,
    filterOperations: [],
    defaultFilterOperation: ""
}];

var condition1 = ["CompanyName", "=", "Super Mart of the West"];
var condition2 = ["CompanyName", "=", "Super Mart of the West2"];
var condition3 = ["CompanyName", "=", "Super Mart of the West3"];

var FILTER_BUILDER_CLASS = "dx-filterbuilder",
    FILTER_BUILDER_GROUP_CLASS = "dx-filterbuilder-group",
    FILTER_BUILDER_GROUP_ITEM_CLASS = "dx-filterbuilder-group-item",
    FILTER_BUILDER_GROUP_CONTENT_CLASS = "dx-filterbuilder-group-content",
    FILTER_BUILDER_GROUP_OPERATION_CLASS = "dx-filterbuilder-group-operation",
    FILTER_BUILDER_ACTION_CLASS = "dx-filterbuilder-action",
    FILTER_BUILDER_IMAGE_CLASS = "dx-filterbuilder-action-icon",
    FILTER_BUILDER_ITEM_TEXT_CLASS = "dx-filterbuilder-text",
    FILTER_BUILDER_IMAGE_ADD_CLASS = "dx-icon-plus",
    FILTER_BUILDER_IMAGE_REMOVE_CLASS = "dx-icon-remove",
    FILTER_BUILDER_ITEM_FIELD_CLASS = "dx-filterbuilder-item-field",
    FILTER_BUILDER_ITEM_VALUE_CLASS = "dx-filterbuilder-item-value",
    FILTER_BUILDER_ITEM_OPERATOR_CLASS = "dx-filterbuilder-item-operator",
    ACTIVE_CLASS = "dx-state-active",

    ACTIONS = [
        "onEditorPreparing", "onEditorPrepared"
    ];

QUnit.test("markup init", function(assert) {
    var etalon =
    '<div id="container" class="dx-filterbuilder dx-widget" style="width: 400px; height: 300px;">'
        + '<div class="dx-filterbuilder-group">'
            + '<div class="dx-filterbuilder-group-item">'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">And</div>'
                + '<div class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>'
            + '</div>'
            + '<div class="dx-filterbuilder-group-content"></div>'
        + '</div>'
    + '</div>';

    var element = $("#container").dxFilterBuilder();
    assert.equal(element.parent().html(), etalon);
});

QUnit.test("markup is initialized by filter value", function(assert) {
    var container = $("#container");
    container.dxFilterBuilder({
        filter: [
            ["CompanyName", "=", "K&S Music"],
            "Or",
            ["Zipcode", "=", "98027"],
            "Or",
            ["CompanyName", "=", "Screen Shop"]
        ],
        fields: fields
    }).dxFilterBuilder("instance");

    assert.ok(container.hasClass(FILTER_BUILDER_CLASS));
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS).html(), "Company Name");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATOR_CLASS).html(), "=");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0).text(), "K&S Music");

    assert.equal(container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS).eq(1).html(), "Zipcode");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATOR_CLASS).eq(1).html(), "=");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(1).html(), "98027");

    assert.equal(container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS).eq(2).html(), "Company Name");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATOR_CLASS).eq(2).html(), "=");
    var rowValue = container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(2);
    assert.equal(rowValue.text(), "Screen Shop");
    rowValue.click();
    assert.ok($("." + FILTER_BUILDER_ITEM_TEXT_CLASS + " .dx-textbox").dxTextBox("instance"));
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
    assert.equal(groupValue, "!And");
});

QUnit.test("getGroupText", function(assert) {
    var filterBuilder = $("#container").dxFilterBuilder().dxFilterBuilder("instance");
    var group = ["!",
        [
            condition1,
            "And",
            condition2,
            "And",
            condition3
        ]
    ];
    var groupValue = utils.getGroupText(group, filterBuilder._getGroupOperations());
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
