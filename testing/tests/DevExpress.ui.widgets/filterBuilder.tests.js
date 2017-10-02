"use strict";

var $ = require("jquery");

var utils = require("ui/filter_builder/utils");
require("ui/filter_builder/filter_builder");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="container"></div>');
});

var FILTER_BUILDER_CLASS = "dx-filterbuilder";

var fields = [{
    caption: "Company Name",
    dataField: "CompanyName",
    dataType: "string",
    format: undefined,
    filterOperations: ["contains", "notcontains", "startswith", "endswith", "=", "<>"],
    defaultFilterOperation: "",
    lookup: {
        dataSource: [{
            value: "K&S Music",
            text: "K&S Music"
        }, {
            value: "Super Mart of the West",
            text: "Super Mart of the West"
        }],
        valueExpr: "value",
        displayExpr: "text"
    }
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

var FILTER_BUILDER_CLASS = "dx-filterbuilder",
    FILTER_BUILDER_ITEM_FIELD_CLASS = "dx-filterbuilder-item-field",
    FILTER_BUILDER_ITEM_OPERATION_CLASS = "dx-filterbuilder-item-operation",
    FILTER_BUILDER_ITEM_VALUE_CLASS = "dx-filterbuilder-item-value",
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = "dx-filterbuilder-item-value-text",
    FILTER_BUILDER_GROUP_CONTENT_CLASS = "dx-filterbuilder-group-content",
    ACTIVE_CLASS = "dx-state-active";

QUnit.test("markup init", function(assert) {
    var etalon =
    '<div id="container" class="dx-filterbuilder dx-widget">'
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

QUnit.test("create filterbuilder by different filter values", function(assert) {
    var element = $("#container").dxFilterBuilder({ fields: fields });
    var instance = element.dxFilterBuilder("instance");
    instance.option("filter", []);
    assert.ok(instance);
    instance.option("filter", ["Or"]);
    assert.ok(instance);
    instance.option("filter", [["CompanyName", "=", "K&S Music"], ["CompanyName", "=", "K&S Music"]]);
    assert.ok(instance);
    instance.option("filter", [[["CompanyName", "=", "K&S Music"], "Or"], "And"]);
    assert.ok(instance);
});

QUnit.test("filter Content init", function(assert) {
    var etalon =
    '<div class=\"dx-filterbuilder-group\">'
        + '<div class=\"dx-filterbuilder-group-item\">'
            + '<div class=\"dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action\" tabindex=\"0\"></div>'
            + '<div class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">Or</div>'
            + '<div class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>'
        + '</div>'
        + '<div class="dx-filterbuilder-group-content">'
            + '<div class="dx-filterbuilder-group">'
                + '<div class=\"dx-filterbuilder-group-item\">'
                    + '<div class=\"dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action\" tabindex=\"0\"></div>'
                    + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-field\" tabindex=\"0\">Company Name</div>'
                    + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-operation\" tabindex=\"0\">=</div>'
                    + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-value\">'
                        + '<div class=\"dx-filterbuilder-item-value-text\" tabindex=\"0\">K&amp;S Music</div>'
                    + '</div>'
                + '</div>'
            + '</div>'
        + '</div>'
    + '</div>';

    var element = $("#container").dxFilterBuilder({
        fields: fields
    });
    var instance = element.dxFilterBuilder("instance");
    instance.option("filter", [[["CompanyName", "=", "K&S Music"], "Or"], "And"]);
    assert.equal(element.find("." + FILTER_BUILDER_GROUP_CONTENT_CLASS).html(), etalon);
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
    });

    assert.ok(container.hasClass(FILTER_BUILDER_CLASS));
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS).html(), "Company Name");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).html(), "=");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).eq(0).text(), "K&S Music");

    assert.equal(container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS).eq(1).html(), "Zipcode");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).eq(1).html(), "=");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).eq(1).html(), "98027");

    assert.equal(container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS).eq(2).html(), "Company Name");
    assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).eq(2).html(), "=");
    var rowValue = container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).eq(2);
    assert.equal(rowValue.text(), "Screen Shop");
    rowValue.click();
    assert.ok($("." + FILTER_BUILDER_ITEM_VALUE_CLASS + " .dx-selectbox").dxSelectBox("instance"));
});

QUnit.test("value and operations depend on selected field", function(assert) {
    var container = $("#container");
    container.dxFilterBuilder({
        filter: [
            ["CompanyName", "=", "K&S Music"]
        ],
        fields: fields
    });
    var fieldButton = container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS);
    assert.ok(!fieldButton.hasClass(ACTIVE_CLASS));
    assert.equal(fieldButton.html(), "Company Name");

    var operationButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
    assert.equal(operationButton.text(), "=");

    var valueButton = container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS);
    assert.equal(valueButton.text(), "K&S Music");

    var $menu = container.children(".dx-has-context-menu");
    assert.ok($menu.length === 0);

    fieldButton.click();
    assert.ok(fieldButton.hasClass(ACTIVE_CLASS));

    $menu = container.children(".dx-has-context-menu");
    assert.ok($menu.length === 1);

    var $dateMenuItem = $(".dx-menu-item-text").eq(2);
    assert.equal($dateMenuItem.html(), "State");

    $dateMenuItem.click();
    assert.equal(fieldButton.html(), "State");

    operationButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
    assert.equal(operationButton.text(), "contains");

    valueButton = container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS);
    assert.equal(valueButton.text(), "<enter a value>");

    var menuClosed = assert.async();
    setTimeout(function() {
        assert.ok(!fieldButton.hasClass(ACTIVE_CLASS));
        $menu = container.children(".dx-has-context-menu");
        assert.ok($menu.length === 0);
        menuClosed();
    }, 500);
});


QUnit.test("editor field depends on field type", function(assert) {
    var container = $("#container");
    container.dxFilterBuilder({
        filter: [
            ["CompanyName", "=", "K&S Music"],
            "Or",
            ["Zipcode", "=", "98027"],
            "Or",
            ["Date", "=", ""],
            "Or",
            ["Contributor", "=", ""]
        ],
        fields: fields
    });
    var companyNameValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
    companyNameValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
    assert.ok(companyNameValueField.find(".dx-selectbox").dxSelectBox("instance"));

    var zipCodeValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(1);
    zipCodeValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
    assert.ok(zipCodeValueField.find(".dx-numberbox").dxNumberBox("instance"));

    var dateValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(2);
    dateValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
    assert.ok(dateValueField.find(".dx-datebox").dxDateBox("instance"));

    var contributorValueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(3);
    contributorValueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
    assert.ok(contributorValueField.find(".dx-selectbox").dxSelectBox("instance"));
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

var condition1 = ["CompanyName", "=", "Super Mart of the West"];
var condition2 = ["CompanyName", "=", "Super Mart of the West2"];
var condition3 = ["CompanyName", "=", "Super Mart of the West3"];

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
    assert.equal(utils.getGroupText(group, filterBuilder._getGroupOperations()), "Not And");
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
    assert.equal(operations[2].text, "contains");
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
    assert.equal(condition[1], "contains");
    assert.equal(condition[2], "");
});
