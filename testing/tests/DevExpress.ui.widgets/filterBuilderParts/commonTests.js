"use strict";

/* global fields */

var $ = require("jquery");

require("ui/filter_builder/filter_builder");

var FILTER_BUILDER_ITEM_FIELD_CLASS = "dx-filterbuilder-item-field",
    FILTER_BUILDER_ITEM_OPERATION_CLASS = "dx-filterbuilder-item-operation",
    FILTER_BUILDER_ITEM_VALUE_CLASS = "dx-filterbuilder-item-value",
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = "dx-filterbuilder-item-value-text",
    FILTER_BUILDER_GROUP_CONTENT_CLASS = "dx-filterbuilder-group-content",
    FILTER_BUILDER_IMAGE_ADD_CLASS = "dx-icon-plus",
    FILTER_BUILDER_IMAGE_REMOVE_CLASS = "dx-icon-remove",
    FILTER_BUILDER_GROUP_OPERATION_CLASS = "dx-filterbuilder-group-operation",
    ACTIVE_CLASS = "dx-state-active";

var clickByButtonAndSelectMenuItem = function($button, menuItemIndex) {
    $button.click();
    $(".dx-menu-item-text").eq(menuItemIndex).trigger("dxclick");
};

QUnit.module("Rendering", function() {
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

    QUnit.test("filterbuilder is created by different values", function(assert) {
        var instance = $("#container").dxFilterBuilder({
            fields: fields
        }).dxFilterBuilder("instance");

        try {
            instance.option("value", null);
            instance.option("value", []);
            instance.option("value", ["Or"]);
            instance.option("value", ["!", [["CompanyName", "=", "DevExpress"], ["CompanyName", "=", "DevExpress"]]]);
            instance.option("value", ["!", ["CompanyName", "=", "DevExpress"]]);
            instance.option("value", ["CompanyName", "=", "K&S Music"]);
            instance.option("value", [["CompanyName", "=", "K&S Music"], ["CompanyName", "=", "K&S Music"]]);
            instance.option("value", [[["CompanyName", "=", "K&S Music"], "Or"], "And"]);
            assert.ok(true, "all values were approved");
        } catch(e) {
            assert.ok(false, e);
        }
    });

    QUnit.test("filter Content init by one condition", function(assert) {
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
                        + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-operation\" tabindex=\"0\">Equals</div>'
                        + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-value\">'
                            + '<div class=\"dx-filterbuilder-item-value-text\" tabindex=\"0\">K&amp;S Music</div>'
                        + '</div>'
                    + '</div>'
                + '</div>'
            + '</div>'
        + '</div>';

        var element = $("#container").dxFilterBuilder({
            fields: fields,
            value: [[["CompanyName", "=", "K&S Music"], "Or"], "And"]
        });
        assert.equal(element.find("." + FILTER_BUILDER_GROUP_CONTENT_CLASS).html(), etalon);
    });

    QUnit.test("filter Content init by several conditions", function(assert) {
        var etalon =
                '<div class="dx-filterbuilder-group">'
                    + '<div class=\"dx-filterbuilder-group-item\">'
                        + '<div class=\"dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action\" tabindex=\"0\"></div>'
                        + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-field\" tabindex=\"0\">Company Name</div>'
                        + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-operation\" tabindex=\"0\">Equals</div>'
                        + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-value\">'
                            + '<div class=\"dx-filterbuilder-item-value-text\" tabindex=\"0\">K&amp;S Music</div>'
                        + '</div>'
                    + '</div>'
                + '</div>'
                + '<div class="dx-filterbuilder-group">'
                    + '<div class=\"dx-filterbuilder-group-item\">'
                        + '<div class=\"dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action\" tabindex=\"0\"></div>'
                        + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-field\" tabindex=\"0\">Zipcode</div>'
                        + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-operation\" tabindex=\"0\">Equals</div>'
                        + '<div class=\"dx-filterbuilder-text dx-filterbuilder-item-value\">'
                            + '<div class=\"dx-filterbuilder-item-value-text\" tabindex=\"0\">98027</div>'
                        + '</div>'
                    + '</div>'
                + '</div>';

        var element = $("#container").dxFilterBuilder({
            fields: fields,
            value: [["CompanyName", "=", "K&S Music"], "Or", ["Zipcode", "=", "98027"]]
        });
        assert.equal(element.find("." + FILTER_BUILDER_GROUP_CONTENT_CLASS).html(), etalon);
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
        $fieldButton.click();
        assert.ok($fieldButton.hasClass(ACTIVE_CLASS));

        var $menu = container.find(".dx-overlay");
        assert.ok($menu.length === 1);

        var $menuItem = $(".dx-treeview-item").eq(2);
        assert.equal($menuItem.text(), "State");
        $menuItem.trigger("dxclick");
        assert.equal($fieldButton.html(), "State");
        assert.ok(!$fieldButton.hasClass(ACTIVE_CLASS));
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_OPERATION_CLASS).text(), "Contains");
        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).text(), "<enter a value>");

        $menu = container.find(".dx-overlay");
        assert.ok($menu.length === 0);
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
        $fieldButton.click();

        var $menuItem = $(".dx-treeview-item").eq(5);
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
        $fieldButton.click();

        assert.equal($(".dx-menu-item-selected").text(), "State");

        var $menuItem = $(".dx-menu-item-text").eq(1);
        $menuItem.trigger("dxclick");

        $fieldButton.click();
        assert.equal($(".dx-menu-item-selected").text(), "Date");
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
        $groupButton.click();

        assert.equal($(".dx-menu-item-selected").text(), "And");

        var $menuItem = $(".dx-menu-item-text").eq(3);
        $menuItem.trigger("dxclick");

        $groupButton.click();
        assert.equal($(".dx-menu-item-selected").text(), "Not Or");
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
        $operationButton.click();

        assert.equal($(".dx-menu-item-selected").text(), "Equals");

        var $menuItem = $(".dx-menu-item-text").eq(3);
        $menuItem.trigger("dxclick");

        assert.equal(container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);

        $operationButton.click();
        assert.equal($(".dx-menu-item-selected").text(), "Greater than");
    });

    QUnit.test("hide value field for isblank & isNotBlank", function(assert) {
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

    QUnit.testInActiveWindow("change filter value", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                allowHierarchicalFields: true,
                value: ["State", "<>", "K&S Music"],
                fields: fields
            }).dxFilterBuilder("instance");

        var $valueButton = container.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        $valueButton.click();

        var $textBoxContainer = container.find("." + FILTER_BUILDER_ITEM_VALUE_CLASS + " .dx-textbox"),
            textBoxInstance = $textBoxContainer.dxTextBox("instance"),
            $input = $textBoxContainer.find("input");
        assert.ok($input.is(":focus"));

        textBoxInstance.option("value", "Test");
        $input.trigger("blur");
        assert.notOk(container.find("input").length, "hasn't input");
        assert.deepEqual(instance._model, [["State", "<>", "Test"]]);
        assert.deepEqual(instance.option("value"), ["State", "<>", "Test"]);
    });

    QUnit.test("Add and remove condition", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                allowHierarchicalFields: true,
                value: ["State", "<>", "Test"],
                fields: fields
            }).dxFilterBuilder("instance");

        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_ADD_CLASS), 1);
        assert.deepEqual(instance._model, [["State", "<>", "Test"], ["CompanyName", "contains", ""]]);
        assert.deepEqual(instance.option("value"), [["State", "<>", "Test"], ["CompanyName", "contains", ""]]);

        $("." + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1).click();
        assert.deepEqual(instance._model, [["State", "<>", "Test"]]);
        assert.deepEqual(instance.option("value"), ["State", "<>", "Test"]);
        assert.equal(instance.option("value"), instance._model[0]);
    });

    QUnit.test("Add and remove group", function(assert) {
        var container = $("#container"),
            instance = container.dxFilterBuilder({
                allowHierarchicalFields: true,
                value: ["State", "<>", "Test"],
                fields: fields
            }).dxFilterBuilder("instance");

        clickByButtonAndSelectMenuItem($("." + FILTER_BUILDER_IMAGE_ADD_CLASS), 0);
        assert.deepEqual(instance._model, [["State", "<>", "Test"], ["And"]]);
        assert.deepEqual(instance.option("value"), ["State", "<>", "Test"]);

        $("." + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1).click();
        assert.deepEqual(instance._model, [["State", "<>", "Test"]]);
        assert.deepEqual(instance.option("value"), ["State", "<>", "Test"]);
        assert.equal(instance.option("value"), instance._model[0]);
    });
});

QUnit.module("Create editor by field dataType", function() {
    QUnit.test("number", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["Zipcode", "=", 98027],
            fields: fields
        });
        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        valueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
        assert.ok(valueField.find(".dx-numberbox").dxNumberBox("instance"));
    });

    QUnit.test("string", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["State", "=", "Test"],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        valueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
        assert.ok(valueField.find(".dx-textbox").dxTextBox("instance"));
    });

    QUnit.test("date", function(assert) {
        var container = $("#container"),
            dateBoxInstance;

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["Date", "=", new Date()],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        valueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
        dateBoxInstance = valueField.find(".dx-datebox").dxDateBox("instance");
        assert.strictEqual(dateBoxInstance.option("type"), "date");
    });

    QUnit.test("datetime", function(assert) {
        var container = $("#container"),
            dateBoxInstance;

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["DateTime", "=", new Date()],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        valueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
        dateBoxInstance = valueField.find(".dx-datebox").dxDateBox("instance");
        assert.strictEqual(dateBoxInstance.option("type"), "datetime");
    });

    QUnit.test("boolean", function(assert) {
        var container = $("#container");

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ["Contributor", "=", false],
            fields: fields
        });

        var valueField = $("." + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        valueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
        assert.ok(valueField.find(".dx-selectbox").dxSelectBox("instance"));
    });

    QUnit.test("object", function(assert) {
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
        valueField.find("." + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).click();
        assert.ok(valueField.find(".dx-selectbox").dxSelectBox("instance"));
    });
});
