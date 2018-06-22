"use strict";

import $ from "jquery";
import { isRenderer } from "core/utils/type";
import devices from "core/devices";
import config from "core/config";
import fields from "../../../helpers/filterBuilderTestData.js";

import "ui/filter_builder/filter_builder";
import "ui/drop_down_box";
import "ui/button";

const
    FILTER_BUILDER_CLASS = "dx-filterbuilder",
    FILTER_BUILDER_ITEM_FIELD_CLASS = FILTER_BUILDER_CLASS + "-item-field",
    FILTER_BUILDER_ITEM_OPERATION_CLASS = FILTER_BUILDER_CLASS + "-item-operation",
    FILTER_BUILDER_ITEM_VALUE_CLASS = FILTER_BUILDER_CLASS + "-item-value",
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = FILTER_BUILDER_CLASS + "-item-value-text",
    FILTER_BUILDER_OVERLAY_CLASS = FILTER_BUILDER_CLASS + "-overlay",
    FILTER_BUILDER_GROUP_OPERATION_CLASS = FILTER_BUILDER_CLASS + "-group-operation",
    FILTER_BUILDER_IMAGE_ADD_CLASS = "dx-icon-plus",
    FILTER_BUILDER_IMAGE_REMOVE_CLASS = "dx-icon-remove",
    FILTER_BUILDER_RANGE_CLASS = FILTER_BUILDER_CLASS + "-range",
    FILTER_BUILDER_RANGE_START_CLASS = FILTER_BUILDER_RANGE_CLASS + "-start",
    FILTER_BUILDER_RANGE_END_CLASS = FILTER_BUILDER_RANGE_CLASS + "-end",
    FILTER_BUILDER_RANGE_SEPARATOR_CLASS = FILTER_BUILDER_RANGE_CLASS + "-separator",
    ACTIVE_CLASS = "dx-state-active",
    FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS = FILTER_BUILDER_CLASS + "-menu-custom-operation",
    TREE_VIEW_CLASS = "dx-treeview",
    TREE_VIEW_TEM_CLASS = TREE_VIEW_CLASS + "-item",
    DISABLED_STATE_CLASS = "dx-state-disabled";

var getSelectedMenuText = function() {
    return $(".dx-treeview-node.dx-state-selected").text();
};

var clickByOutside = function() {
    $("body").trigger("dxpointerdown"); // use dxpointerdown because T600142
};

var clickByValue = function(index) {
    $("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).eq(index || 0).trigger("dxclick");
};

var selectMenuItem = function(menuItemIndex) {
    $(`.${TREE_VIEW_TEM_CLASS}`).eq(menuItemIndex).trigger("dxclick");
};

var clickByButtonAndSelectMenuItem = function($button, menuItemIndex) {
    $button.trigger("dxclick");
    selectMenuItem(menuItemIndex);
    $(`.${TREE_VIEW_TEM_CLASS}`).eq(menuItemIndex).trigger("dxclick");
};

QUnit.module("Rendering", function() {
    QUnit.test("field menu test", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["CompanyName", "=", "K&S Music"]
            ],
            fields: [{
                dataField: "CompanyName"
            }, {
                dataField: "Budget",
                visible: false // this is unavailable property but it available in grid. See T579785.
            }]
        });

        var $fieldButton = container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS);
        $fieldButton.trigger("dxclick");

        var $menuItem = $(`.${TREE_VIEW_TEM_CLASS}`).eq(1);
        assert.equal($menuItem.text(), "Budget");
    });

    // T619643
    QUnit.test("deferRendering is enabled in menu", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            fields: [{
                dataField: "CompanyName"
            }]
        });

        container.find("." + FILTER_BUILDER_GROUP_OPERATION_CLASS).trigger("dxclick");
        var popupInstance = container.find("." + FILTER_BUILDER_OVERLAY_CLASS).dxPopup("instance");
        assert.ok(popupInstance.option("deferRendering"));
    });

    QUnit.test("operation menu has between item with custom operation class", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["CompanyName", "=", 1]
            ],
            fields: [{
                dataField: "CompanyName",
                dataType: "number"
            }]
        });

        var $fieldButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        $fieldButton.trigger("dxclick");

        var $customItems = $(`.${TREE_VIEW_CLASS}`).find("." + FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS);
        assert.equal($customItems.length, 1, "one custom");
        assert.equal($customItems.text(), "Is between", "between is custom");
    });

    QUnit.test("value and operations depend on selected field", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: [
                ["CompanyName", "=", "K&S Music"]
            ],
            fields: fields
        });

        var $fieldButton = container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS);
        $fieldButton.trigger("dxclick");
        assert.ok($fieldButton.hasClass(ACTIVE_CLASS));

        assert.ok($(".dx-filterbuilder-fields").length > 0);

        var $menuItem = $(`.${TREE_VIEW_TEM_CLASS}`).eq(2);
        assert.equal($menuItem.text(), "State");
        $menuItem.trigger("dxclick");
        assert.equal($fieldButton.html(), "State");
        assert.ok(!$fieldButton.hasClass(ACTIVE_CLASS));
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).text(), "Contains");
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).text(), "<enter a value>");
        assert.ok($(".dx-filterbuilder-fields").length === 0);
    });

    QUnit.test("editorElement argument of onEditorPreparing option is correct", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["CompanyName", "=", "DevExpress"]
            ],
            onEditorPreparing: function(e) {
                assert.equal(isRenderer(e.editorElement), !!config().useJQuery, "editorElement is correct");
            },
            fields: fields
        });

        // act
        clickByValue();
    });

    QUnit.test("operations are changed after field change", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: [
                ["State", "<>", "K&S Music"]
            ],
            fields: fields
        });

        assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).text(), "Does not equal");

        var $fieldButton = container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS);
        $fieldButton.trigger("dxclick");

        var $menuItem = $(`.${TREE_VIEW_TEM_CLASS}`).eq(5);
        $menuItem.trigger("dxclick");

        assert.equal($fieldButton.html(), "City");
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).text(), "Equals");
    });

    QUnit.test("selected element must change in field menu after click", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["State", "<>", "K&S Music"]
            ],
            fields: fields
        });

        var $fieldButton = container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS);
        $fieldButton.trigger("dxclick");

        assert.equal(getSelectedMenuText(), "State");

        selectMenuItem(1);

        $fieldButton.trigger("dxclick");
        assert.equal(getSelectedMenuText(), "Date");
    });

    QUnit.test("selected element must change in group operation menu after click", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["State", "<>", "K&S Music"]
            ],
            fields: fields
        });

        var $groupButton = container.find("." + FILTER_BUILDER_GROUP_OPERATION_CLASS);
        $groupButton.trigger("dxclick");

        assert.ok($(".dx-filterbuilder-group-operations").length > 0);
        assert.equal(getSelectedMenuText(), "And");

        selectMenuItem(3);

        assert.ok($(".dx-filterbuilder-group-operations").length === 0);

        $groupButton.trigger("dxclick");
        assert.equal(getSelectedMenuText(), "Not Or");
    });

    QUnit.test("selected element must change in filter operation menu after click", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["Date", "=", ""]
            ],
            fields: fields
        });

        var $operationButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        $operationButton.trigger("dxclick");

        assert.ok($(".dx-filterbuilder-operations").length > 0);
        assert.equal(getSelectedMenuText(), "Equals");

        selectMenuItem(3);

        assert.ok($(".dx-filterbuilder-operations").length === 0);
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);

        $operationButton.trigger("dxclick");
        assert.equal(getSelectedMenuText(), "Is greater than");
    });

    // T588221
    QUnit.testInActiveWindow("click by dropdownbox specified editorTemplate", function(assert) {
        var container = $("#container"),
            INNER_ELEMENT_CLASS = "test-inner-element",
            VALUE = "Value after click by button";

        container.dxFilterBuilder({
            value: ["Field", "=", "Test1"],
            fields: [{
                dataField: "Field",
                editorTemplate: function(options, $container) {
                    $("<div>")
                        .appendTo($container)
                        .dxDropDownBox({
                            value: 3,
                            valueExpr: "ID",
                            contentTemplate: function(e) {
                                var dropDownContent = $("<div>");
                                $("<div>")
                                    .addClass(INNER_ELEMENT_CLASS)
                                    .appendTo(dropDownContent);
                                $("<div>")
                                    .appendTo(dropDownContent)
                                    .dxButton({
                                        onClick: function() {
                                            options.setValue(VALUE);
                                        }
                                    });

                                return dropDownContent;
                            }
                        });
                }
            }]
        });

        container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");
        assert.equal($("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).length, 0, "hide button");
        assert.equal($(".dx-dropdowneditor-button").length, 1, "has one dropdowneditor button");

        $(".dx-dropdowneditor-button").trigger("dxclick");
        assert.equal($("." + INNER_ELEMENT_CLASS).length, 1, "dropdown opened");

        $("." + INNER_ELEMENT_CLASS).trigger("dxclick");
        assert.equal($("." + INNER_ELEMENT_CLASS).length, 1, "dropdown opened after click by its inner element");

        $(".dx-button").trigger("dxclick");
        clickByOutside();

        assert.equal($("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), VALUE);
    });

    QUnit.test("Add and remove condition", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                allowHierarchicalFields: true,
                value: ["State", "<>", "Test"],
                fields: fields
            }).dxFilterBuilder("instance");

        $("." + FILTER_BUILDER_IMAGE_ADD_CLASS).trigger("dxclick");

        assert.ok($(".dx-filterbuilder-add-condition").length > 0);

        selectMenuItem(0);

        assert.ok($(".dx-filterbuilder-add-condition").length === 0);
        assert.deepEqual(instance.option("value"), [["State", "<>", "Test"], "and", ["CompanyName", "contains", ""]]);

        $("." + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1).trigger("dxclick");
        assert.deepEqual(instance.option("value"), ["State", "<>", "Test"]);
    });

    QUnit.test("Add and remove group", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                allowHierarchicalFields: true,
                value: ["State", "<>", "Test"],
                fields: fields
            }).dxFilterBuilder("instance");

        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_ADD_CLASS), 1);
        assert.deepEqual(instance.option("value"), ["State", "<>", "Test"]);

        $("." + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1).trigger("dxclick");
        assert.deepEqual(instance.option("value"), ["State", "<>", "Test"]);
    });

    // T589531
    QUnit.test("datebox returns null when a date value is specified as an empty string", function(assert) {
        $("#container").dxFilterBuilder({
            value: ["Date", "=", ""],
            fields: fields
        });

        $("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");
        assert.equal($(".dx-datebox").dxDateBox("instance").option("value"), null);
    });

    // T589341
    QUnit.test("the formatter is applied to a field with the date type", function(assert) {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "This test is not actual for mobile devices");
            return;
        }

        $("#container").dxFilterBuilder({
            value: ["Date", "=", ""],
            fields: [{
                dataField: "Date",
                dataType: "date",
                format: "dd.MM.yyyy"
            }]
        });

        $("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");
        $(".dx-datebox input").val("12/12/2017");
        $(".dx-datebox input").trigger("change");
        clickByOutside();

        assert.equal($("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), "12.12.2017");
    });

    // T589341
    QUnit.test('NumberBox with custom format', function(assert) {
        var $container = $("#container");

        $container.dxFilterBuilder({
            value: ["Weight", "=", 3.14],
            fields: [{
                dataField: "Weight",
                dataType: 'number',
                editorOptions: {
                    format: "#0.## kg"
                }
            }]
        });

        $("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        // assert
        assert.equal($container.find(".dx-texteditor-input").val(), "3.14 kg", 'numberbox formatted value');
    });

    // T603217
    QUnit.test("Menu popup hasn't target", function(assert) {
        // arrange
        var $container = $("#container");

        $container.dxFilterBuilder({
            value: ["Weight", "=", 3.14],
            fields: [{
                dataField: "Weight",
                dataType: 'number'
            }]
        });

        // act
        $("." + FILTER_BUILDER_GROUP_OPERATION_CLASS).trigger("dxclick");

        // assert
        assert.notOk($container.find("." + FILTER_BUILDER_OVERLAY_CLASS).dxPopup("instance").option("target"), "popup target shoud not be set");
    });
});

QUnit.module("Filter value", function() {

    QUnit.test("hide filter value for isblank & isNotBlank", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["State", "<>", "K&S Music"]
            ],
            fields: fields
        });

        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);

        // for is blank
        var $operationButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);

        clickByButtonAndSelectMenuItem($operationButton, 6);
        assert.equal($operationButton.text(), "Is blank");
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 0);

        clickByButtonAndSelectMenuItem($operationButton, 5);
        assert.equal($operationButton.text(), "Does not equal");
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);

        // for is not blank
        clickByButtonAndSelectMenuItem($operationButton, 7);
        assert.equal($operationButton.text(), "Is not blank");
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 0);

        clickByButtonAndSelectMenuItem($operationButton, 4);
        assert.equal($operationButton.text(), "Equals");
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);
    });

    QUnit.test("change filter value text when customOperation is selected", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["field", "=", "K&S Music"]
            ],
            customOperations: [{
                name: "customOperation"
            }],
            fields: [{
                dataField: "field",
                filterOperations: ["=", "customOperation"]
            }]
        });

        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).text(), "K&S Music");

        var $operationButton = container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        clickByButtonAndSelectMenuItem($operationButton, 1);

        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).text(), "<enter a value>");
    });

    QUnit.test("execute customOperation.customizeText for field with lookup", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["field", "customOperation", "1"]
            ],
            customOperations: [{
                name: "customOperation",
                customizeText: function() {
                    return "custom text";
                }
            }],
            fields: [{
                dataField: "field",
                lookup: {
                    dataSource: ["1", "2"]
                },
                filterOperations: ["customOperation"]
            }]
        });

        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).text(), "custom text");
    });

    QUnit.test("hide filter value for field with object dataType", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["State", "<>", "K&S Music"]
            ],
            fields: fields
        });

        var $fieldButton = container.find("." + FILTER_BUILDER_ITEM_FIELD_CLASS);

        clickByButtonAndSelectMenuItem($fieldButton, 6);
        assert.equal($fieldButton.text(), "Caption of Object Field");
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 0);

        clickByButtonAndSelectMenuItem($fieldButton, 2);
        assert.equal($fieldButton.text(), "State");
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);
    });

    QUnit.test("hide filter value for customOperation", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: [
                ["State", "lastWeek"]
            ],
            customOperations: [{
                name: "lastWeek",
                dataTypes: ["string"],
                hasValue: false
            }],
            fields: [{ dataField: "State" }]
        });

        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 0);
    });

    QUnit.testInActiveWindow("value button loses focus after value change and outside click", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: ["State", "<>", "K&S Music"],
            fields: fields
        }).dxFilterBuilder("instance");

        container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        var textBoxInstance = $(".dx-textbox").dxTextBox("instance");
        textBoxInstance.option("value", "Test");
        clickByOutside();

        var valueButton = container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        assert.notOk(valueButton.is(":focus"));
    });

    QUnit.testInActiveWindow("range start editor has focus", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: ["field", "between", [1, 2]],
            fields: [{ dataField: "field", dataType: "number" }]
        });

        container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        var $rangeStartEditor = container.find("." + FILTER_BUILDER_RANGE_START_CLASS + " .dx-texteditor-input");
        assert.ok($rangeStartEditor.is(":focus"));
    });

    QUnit.testInActiveWindow("change filter value", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                allowHierarchicalFields: true,
                value: ["State", "<>", "K&S Music"],
                fields: fields
            }).dxFilterBuilder("instance");

        var $valueButton = container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        $valueButton.trigger("dxclick");

        var $textBoxContainer = container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS + " .dx-textbox"),
            textBoxInstance = $textBoxContainer.dxTextBox("instance"),
            $input = $textBoxContainer.find("input");
        assert.ok($input.is(":focus"));

        textBoxInstance.option("value", "Test");
        $input.trigger("blur");
        assert.ok(container.find("input").length, "has input");
        assert.notDeepEqual(instance.option("value"), ["State", "<>", "Test"]);
        clickByOutside();
        assert.deepEqual(instance.option("value"), ["State", "<>", "Test"]);
    });

    QUnit.testInActiveWindow("change filter value in selectbox", function(assert) {
        var $container = $("#container"),
            instance = $container.dxFilterBuilder({
                allowHierarchicalFields: true,
                value: ["CompanyName", "<>", "KS Music"],
                fields: fields
            }).dxFilterBuilder("instance");

        var $valueButton = $container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        $valueButton.trigger("dxclick");

        var $input = $container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).find("input.dx-texteditor-input");
        assert.ok($input.is(":focus"));

        var selectBoxInstance = $container.find(".dx-selectbox").dxSelectBox("instance");
        selectBoxInstance.open();

        $(".dx-list-item").eq(1).trigger("dxclick");

        assert.ok($container.find("input").length, "has input");
        assert.notDeepEqual(instance.option("value"), ["CompanyName", "<>", "Super Mart of the West"]);
        clickByOutside();
        assert.deepEqual(instance.option("value"), ["CompanyName", "<>", "Super Mart of the West"]);
    });

    QUnit.testInActiveWindow("change filter value in selectbox with different value and displayText", function(assert) {
        var $container = $("#container"),
            instance = $container.dxFilterBuilder({
                allowHierarchicalFields: true,
                value: ["Product", "=", 1],
                fields: fields
            }).dxFilterBuilder("instance");

        assert.equal($container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), "DataGrid");

        var $valueButton = $container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        $valueButton.trigger("dxclick");

        var selectBoxInstance = $container.find(".dx-selectbox").dxSelectBox("instance");
        selectBoxInstance.open();
        $(".dx-list-item").eq(1).trigger("dxclick");
        clickByOutside();

        assert.equal($container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), "PivotGrid");
        assert.deepEqual(instance.option("value"), ["Product", "=", 2]);
    });

    QUnit.testInActiveWindow("check default value for number", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                allowHierarchicalFields: true,
                value: ["Zipcode", "<>", 123],
                fields: fields
            }).dxFilterBuilder("instance");

        container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        var editorInstance = container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS + " > div").dxNumberBox("instance");
        editorInstance.option("value", 0);
        clickByOutside();
        assert.deepEqual(instance.option("value"), ["Zipcode", "<>", 0]);
    });

    QUnit.testInActiveWindow("change filter value when specified editorTemplate", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                value: ["Field", "=", "Test1"],
                fields: [{
                    dataField: "Field",
                    editorTemplate: function(options, $container) {
                        $("<input/>").val(options.val).on("change", function(e) {
                            options.setValue($(e.currentTarget).val());
                        }).appendTo($container);
                    }
                }]
            }).dxFilterBuilder("instance");

        var $valueButton = container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        assert.strictEqual($valueButton.text(), "Test1", "filter value");

        $valueButton.trigger("dxclick");

        var $input = container.find("input");
        assert.ok($input.is(":focus"));

        $input.val("Test2");
        $input.trigger("change");
        clickByOutside();

        $valueButton = container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        assert.strictEqual($valueButton.text(), "Test2", "filter value");
        assert.deepEqual(instance.option("value"), ["Field", "=", "Test2"]);
        assert.notOk(container.find("input").length, "hasn't input");
    });
});

QUnit.module("Create editor", function() {
    QUnit.test("dataType - number", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["Zipcode", "=", 98027],
            fields: fields
        });
        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find(".dx-numberbox").dxNumberBox("instance"));
    });

    QUnit.test("dataType - string", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["State", "=", "Test"],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        valueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");
        assert.ok(valueField.find(".dx-textbox").dxTextBox("instance"));
    });

    QUnit.test("dataType - date", function(assert) {
        var container = $("#container"),
            dateBoxInstance;

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["Date", "=", new Date()],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        dateBoxInstance = valueField.find(".dx-datebox").dxDateBox("instance");
        assert.strictEqual(dateBoxInstance.option("type"), "date");
    });

    QUnit.test("dataType - datetime", function(assert) {
        var container = $("#container"),
            dateBoxInstance;

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["DateTime", "=", new Date()],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        dateBoxInstance = valueField.find(".dx-datebox").dxDateBox("instance");
        assert.strictEqual(dateBoxInstance.option("type"), "datetime");
    });

    QUnit.test("dataType - boolean", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["Contributor", "=", false],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find(".dx-selectbox").dxSelectBox("instance"));
    });

    QUnit.test("dataType - object", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["ObjectField", "=", null],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        assert.notOk(valueField.length);
    });

    QUnit.test("field with lookup", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["CompanyName", "=", "Test"],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find(".dx-selectbox").dxSelectBox("instance"));
    });

    QUnit.test("field.editorTemplate", function(assert) {
        var args,
            fields = [{
                dataField: "Field",
                editorTemplate: function(options, $container) {
                    args = options;

                    return $("<input/>").addClass("my-editor");
                }
            }];

        $("#container").dxFilterBuilder({
            value: [
                ["Field", "=", "value"]
            ],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find("input").hasClass("my-editor"));

        assert.strictEqual(args.value, "value", "filter value");
        assert.strictEqual(args.filterOperation, "=", "filter operation");
        assert.strictEqual(args.field.dataField, fields[0].dataField);
        assert.strictEqual(args.field.editorTemplate, fields[0].editorTemplate);
        assert.ok(args.setValue, "has setValue");
    });

    QUnit.test("customOperation.editorTemplate", function(assert) {
        var args,
            fields = [{
                dataField: "Field"
            }];

        $("#container").dxFilterBuilder({
            value: [
                ["Field", "lastDays", 2]
            ],
            fields: fields,
            customOperations: [{
                name: "lastDays",
                dataTypes: ["string"],
                editorTemplate: function(options, $container) {
                    args = options;

                    return $("<input/>").addClass("my-editor");
                }
            }]
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find("input").hasClass("my-editor"));

        assert.strictEqual(args.value, 2, "filter value");
        assert.strictEqual(args.filterOperation, "lastDays", "filter operation");
        assert.strictEqual(args.field.dataField, fields[0].dataField);
        assert.strictEqual(args.field.editorTemplate, fields[0].editorTemplate);
        assert.ok(args.setValue, "has setValue");
    });

    QUnit.test("customOperation.editorTemplate has more priority than field.editorTemplate", function(assert) {
        var event,
            fields = [{
                dataField: "Field",
                dataType: "number",
                editorTemplate: function(options, $container) {
                    event = "field.editorTemplate";
                }
            }],
            instance = $("#container").dxFilterBuilder({
                value: [
                    ["Field", "lastDays", 2]
                ],
                fields: fields,
                customOperations: [{
                    name: "lastDays",
                    dataTypes: ["number"],
                    editorTemplate: function(options, $container) {
                        event = "customOperation.editorTemplate";
                    }
                }]
            }).dxFilterBuilder("instance");


        clickByValue();
        assert.equal(event, "customOperation.editorTemplate", "customOperation.editorTemplate is executed");

        instance.option("value", ["Field", "=", 2]);
        clickByValue();
        assert.equal(event, "field.editorTemplate", "field.editorTemplate is executed");
    });

    QUnit.test("between.editorTemplate", function(assert) {
        // arrange
        var fields = [{
            dataField: "Field",
            dataType: "number"
        }];

        $("#container").dxFilterBuilder({
            value: [
                ["Field", "between", [1, 2]]
            ],
            fields: fields
        });

        // act
        clickByValue();

        var $rangeContainer = $("." + FILTER_BUILDER_RANGE_CLASS),
            $editorStart = $rangeContainer.find("." + FILTER_BUILDER_RANGE_START_CLASS),
            $editorEnd = $rangeContainer.find("." + FILTER_BUILDER_RANGE_END_CLASS),
            $separator = $rangeContainer.find("." + FILTER_BUILDER_RANGE_SEPARATOR_CLASS);

        // assert
        assert.equal($editorStart.length, 1, "Start editor is created");
        assert.equal($editorEnd.length, 1, "End editor is created");
        assert.equal($separator.length, 1, "Separator is created");
        assert.equal($editorStart.dxNumberBox("instance").option("value"), 1, "Start editor value = 1");
        assert.equal($editorEnd.dxNumberBox("instance").option("value"), 2, "End editor value = 2");
    });
});

QUnit.module("Short condition", function() {
    QUnit.test("check value field", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: ["CompanyName", "K&S Music"],
            fields: fields
        });

        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), "K&S Music");
    });

    QUnit.test("check value input", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: ["CompanyName", "K&S Music"],
            fields: fields
        });

        container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        assert.equal(container.find("input").val(), "K&S Music");
    });

    QUnit.test("check value field after change of operation field", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                value: ["CompanyName", "K&S Music"],
                fields: fields
            }).dxFilterBuilder("instance");

        clickByButtonAndSelectMenuItem(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS), 3);

        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), "K&S Music");
        assert.deepEqual(instance.option("value"), ["CompanyName", "endswith", "K&S Music"]);
    });

    QUnit.test("check value input after change of operation field", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            value: ["CompanyName", "K&S Music"],
            fields: fields
        });

        container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).trigger("dxclick");
        $(".dx-menu-item-text").eq(3).trigger("dxclick");
        container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");

        assert.equal(container.find("input").val(), "K&S Music");
    });
});

QUnit.module("on value changed", function() {
    var changeValue = function(container, newValue) {
        container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger("dxclick");
        var $textBoxContainer = container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS + " .dx-textbox"),
            textBoxInstance = $textBoxContainer.dxTextBox("instance");
        textBoxInstance.option("value", "Test");
        return $textBoxContainer;
    };

    QUnit.test("add/remove empty group", function(assert) {
        var container = $("#container"),
            value = [["CompanyName", "K&S Music"]],
            instance = container.dxFilterBuilder({
                value: value,
                fields: fields
            }).dxFilterBuilder("instance");

        // add empty group
        value = instance.option("value");
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_ADD_CLASS).eq(1), 0);
        assert.equal(instance.option("value"), value);

        // remove empty group
        value = instance.option("value");
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(2), 0);
        assert.equal(instance.option("value"), value);

    });

    QUnit.test("add/remove group with condition", function(assert) {
        var container = $("#container"),
            value = [["CompanyName", "K&S Music"]],
            instance = container.dxFilterBuilder({
                value: value,
                fields: fields
            }).dxFilterBuilder("instance");

        // add group
        value = instance.option("value");
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_ADD_CLASS), 1);
        assert.equal(instance.option("value"), value);

        // add inner condition
        value = instance.option("value");
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_ADD_CLASS).eq(1), 0);
        assert.notEqual(instance.option("value"), value);

        // remove group
        value = instance.option("value");
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1), 0);
        assert.notEqual(instance.option("value"), value);

    });

    QUnit.test("add/remove conditions", function(assert) {
        var container = $("#container"),
            value = [["CompanyName", "K&S Music"]],
            instance = container.dxFilterBuilder({
                value: value,
                fields: fields
            }).dxFilterBuilder("instance");

        // add condition
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_ADD_CLASS), 0);

        assert.notEqual(instance.option("value"), value);

        // remove condition
        value = instance.option("value");
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1), 0);

        assert.notEqual(instance.option("value"), value);
    });

    QUnit.test("add/remove condition for field without datatype", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                fields: [{ dataField: "Field" }]
            }).dxFilterBuilder("instance");

        // add condition
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_ADD_CLASS), 0);

        assert.deepEqual(instance.option("value"), ["Field", "contains", ""]);

        // remove condition
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(0), 0);

        assert.deepEqual(instance.option("value"), null);
    });

    QUnit.test("add/remove not valid conditions", function(assert) {
        var container = $("#container"),
            value = [["Zipcode", ""]],
            instance = container.dxFilterBuilder({
                value: value,
                fields: [fields[3]]
            }).dxFilterBuilder("instance");

        // add condition
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_ADD_CLASS), 0);

        assert.equal(instance.option("value"), value);

        // remove condition
        value = instance.option("value");
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1), 0);

        assert.equal(instance.option("value"), value);
    });

    QUnit.test("change condition field", function(assert) {
        var container = $("#container"),
            value = [["CompanyName", "K&S Music"]],
            instance = container.dxFilterBuilder({
                value: value,
                fields: fields
            }).dxFilterBuilder("instance");

        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_ITEM_FIELD_CLASS), 2);

        assert.notEqual(instance.option("value"), value);

        value = instance.option("value");
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_ITEM_FIELD_CLASS), 2);

        assert.equal(instance.option("value"), value);
    });

    QUnit.test("change condition operation", function(assert) {
        var container = $("#container"),
            value = [["CompanyName", "K&S Music"]],
            instance = container.dxFilterBuilder({
                value: value,
                fields: fields
            }).dxFilterBuilder("instance");

        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_ITEM_OPERATION_CLASS), 2);

        assert.notEqual(instance.option("value"), value);

        value = instance.option("value");
        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_ITEM_OPERATION_CLASS), 2);

        assert.equal(instance.option("value"), value);
    });

    QUnit.testInActiveWindow("change condition value by outer click", function(assert) {
        var container = $("#container"),
            value = [["State", "=", ""]],
            instance = container.dxFilterBuilder({
                value: value,
                fields: fields
            }).dxFilterBuilder("instance");

        changeValue(container, "Test");
        clickByOutside();

        assert.notEqual(instance.option("value"), value);
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).length, 1);

        value = instance.option("value");

        changeValue(container, "Test");
        clickByOutside();

        assert.equal(instance.option("value"), value);
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).length, 1);
    });

    QUnit.test("change between value", function(assert) {
        // arrange
        var fields = [{
                dataField: "Field",
                dataType: "number"
            }],
            value = [
                ["Field", "between", []]
            ],
            instance = $("#container").dxFilterBuilder({
                value: value,
                fields: fields
            }).dxFilterBuilder("instance");

        // act
        clickByValue();

        var $editorStart = $("." + FILTER_BUILDER_RANGE_START_CLASS);
        $editorStart.dxNumberBox("instance").option("value", 0);
        clickByOutside();

        // assert
        assert.deepEqual(instance.option("value")[2], [0, null]);

        // act
        instance.option("value", value);
        clickByValue();

        var $editorEnd = $("." + FILTER_BUILDER_RANGE_END_CLASS);
        $editorEnd.dxNumberBox("instance").option("value", 0);
        clickByOutside();

        // assert
        assert.deepEqual(instance.option("value")[2], [null, 0]);
    });
});

QUnit.module("Methods", function() {
    QUnit.test("getFilterExpression", function(assert) {
        // arrange
        var instance = $("#container").dxFilterBuilder({
            value: [
                ["State", "<>", "K&S Music"],
                "and",
                ["OrderDate", "lastDay"]
            ],
            fields: [{
                dataField: "State",
                calculateFilterExpression: function(filterValue, selectedFieldOperation) {
                    return [[this.dataField, selectedFieldOperation, filterValue], "and", [this.dataField, "=", "Some state"]];
                }
            }, {
                dataField: "OrderDate"
            }],
            customOperations: [{
                name: "lastDay",
                dataTypes: ["string"],
                calculateFilterExpression: function(filterValue, field) {
                    return [field.dataField, ">", "1"];
                }
            }]
        }).dxFilterBuilder("instance");

        // act, assert
        assert.deepEqual(instance.getFilterExpression(), [
            [
                ["State", "<>", "K&S Music"],
                "and",
                ["State", "=", "Some state"]
            ],
            "and",
            ["OrderDate", ">", "1"]
        ]);
    });

    // T624888
    QUnit.test("between is available in field.calculateFilterExpression", function(assert) {
        // arrange
        var instance = $("#container").dxFilterBuilder({
            value: [
                ["field", "between", [1, 5]]
            ],
            fields: [{
                dataField: "field",
                dataType: "number",
                calculateFilterExpression: function(filterValue, selectedFieldOperation, target) {
                    assert.strictEqual(target, "filterBuilder");
                    assert.strictEqual(selectedFieldOperation, "between");
                    return [[this.dataField, ">", filterValue[0]], "and", [this.dataField, "<", filterValue[1]]];
                }
            }]
        }).dxFilterBuilder("instance");

        // act, assert
        assert.deepEqual(instance.getFilterExpression(), [
            ["field", ">", 1],
            "and",
            ["field", "<", 5]
        ]);
    });
});

QUnit.module("Group operations", function() {
    let checkPopupDisabledState = function(assert, container) {
        let groupButton = container.find("." + FILTER_BUILDER_GROUP_OPERATION_CLASS);
        groupButton.trigger("dxclick");
        let popup = container.find(`.${FILTER_BUILDER_OVERLAY_CLASS}`);

        assert.ok(groupButton.hasClass(DISABLED_STATE_CLASS));
        assert.equal(popup.length, 0);
    };

    QUnit.test("change groupOperation array", function(assert) {
        let container = $("#container");
        container.dxFilterBuilder({
            fields: fields,
            groupOperations: ["and", "or"]
        });
        container.find("." + FILTER_BUILDER_GROUP_OPERATION_CLASS).trigger("dxclick");
        let items = $(`.${TREE_VIEW_TEM_CLASS}`);

        assert.equal(items.length, 2);
        assert.equal(items.eq(0).text(), "And");
        assert.equal(items.eq(1).text(), "Or");
    });

    QUnit.test("group operation contains 1 item", function(assert) {
        let container = $("#container");
        container.dxFilterBuilder({
            fields: fields,
            groupOperations: ["and"]
        });

        checkPopupDisabledState(assert, container);
    });

    QUnit.test("group operation does not contain items", function(assert) {
        let container = $("#container");
        container.dxFilterBuilder({
            fields: fields,
            groupOperations: []
        });

        checkPopupDisabledState(assert, container);
    });

    QUnit.test("group operation is undefined", function(assert) {
        let container = $("#container");
        container.dxFilterBuilder({
            fields: fields,
            groupOperations: undefined
        });

        checkPopupDisabledState(assert, container);
    });
});
